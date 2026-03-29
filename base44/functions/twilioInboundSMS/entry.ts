import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// This function receives inbound SMS replies from Twilio webhook
// Set this URL in Twilio console: Phone Numbers > Active Numbers > Messaging Webhook
// URL: https://app.base44.com/api/functions/twilioInboundSMS

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From');
    const messageBody = params.get('Body') || '';
    const to = params.get('To');

    if (!from) {
      return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Find the campaign by phone number
    const campaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({
      owner_phone: from
    });

    let campaign = campaigns.length > 0 ? campaigns[0] : null;

    // Also try to find by ListingOwner phone
    if (!campaign) {
      const owners = await base44.asServiceRole.entities.ListingOwner.filter({
        phone: from
      });
      if (owners.length > 0) {
        const ownerCampaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({
          listing_owner_id: owners[0].id
        });
        campaign = ownerCampaigns.length > 0 ? ownerCampaigns[0] : null;
      }
    }

    const lowerBody = messageBody.toLowerCase().trim();

    // Generate AI response using Gemini
    let aiReply = '';

    try {
      const context = campaign
        ? `You are Charlie, an AI concierge from Dyson & Dyson Concierge Relocation Services. You are responding to a property owner named ${campaign.owner_name} who is selling their home at ${campaign.property_address}. The owner replied to your outreach SMS. Their message: "${messageBody}". Be warm, professional, and helpful. If they said YES or are interested, ask where they are planning to move and their timeline. Keep your reply under 160 characters if possible, or split into 2 short messages. Do NOT use hashtags or emojis excessively.`
        : `You are Charlie, an AI concierge from Dyson & Dyson Concierge Relocation Services. Someone replied to one of our SMS campaigns from number ${from}. Their message: "${messageBody}". Be warm, professional, and helpful. Ask them if they are selling a home and planning to relocate.`;

      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: context }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        }
      );

      const geminiData = await geminiRes.json();
      aiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (aiErr) {
      aiReply = `Thanks for your reply! I'm Charlie from Dyson & Dyson. Are you planning to relocate? We can help you find your next home completely free. What city are you moving to?`;
    }

    // Update campaign if found
    if (campaign) {
      const updates = {
        response_date: new Date().toISOString(),
        workflow_stage: 'response',
        notes: (campaign.notes || '') + `\n[${new Date().toLocaleDateString()}] Owner replied: "${messageBody}"\nCharlie: "${aiReply}"`
      };

      // Parse intent from message
      if (lowerBody.includes('stop') || lowerBody.includes('opt out') || lowerBody.includes('unsubscribe')) {
        updates.workflow_stage = 'closed';
        updates.notes = (campaign.notes || '') + `\n[${new Date().toLocaleDateString()}] Owner opted out.`;
        aiReply = null; // Don't reply to opt-outs
      }

      await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaign.id, updates);
    }

    // Send AI reply via Twilio if we have one
    if (aiReply) {
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

      const formData = new URLSearchParams();
      formData.append('To', from);
      formData.append('From', fromNumber);
      formData.append('Body', aiReply);

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
    }

    // 🚨 Email admin immediately when anyone replies to our SMS
    if (aiReply && from) {
      try {
        const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
        const ownerLabel = campaign ? `${campaign.owner_name} (${campaign.property_address})` : `Unknown — ${from}`;
        const emailPromises = adminUsers.map(admin =>
          base44.asServiceRole.integrations.Core.SendEmail({
            to: admin.email,
            from_name: 'Dyson & Dyson System',
            subject: `🔔 SMS REPLY RECEIVED — ${ownerLabel}`,
            body: `INBOUND SMS REPLY
==========================================

FROM: ${from}
OWNER: ${ownerLabel}
STAGE: ${campaign?.workflow_stage || 'unknown'}

THEIR MESSAGE:
"${messageBody}"

CHARLIE'S AUTO-REPLY:
"${aiReply}"

==========================================
ACTION: Log in to review and follow up if needed.
dysonrelo.com/admin/outreach-campaigns
==========================================`
          })
        );
        await Promise.all(emailPromises);
      } catch (notifyErr) {
        console.error('Admin notification failed:', notifyErr.message);
      }
    }

    // Always return TwiML to Twilio
    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error('twilioInboundSMS error:', error.message);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
});