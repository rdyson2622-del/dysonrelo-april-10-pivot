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

    // SCRIPTED RESPONSE TREE — Charlie does NOT improvise.
    // Every reply is a pre-approved message. No free-form AI generation.
    let aiReply = '';

    const firstName = campaign?.owner_name ? campaign.owner_name.split(' ')[0] : '';
    const greeting = firstName ? `Hi ${firstName}` : 'Hi there';

    if (lowerBody.includes('stop') || lowerBody.includes('opt out') || lowerBody.includes('unsubscribe') || lowerBody.includes('remove')) {
      // Handled below — no reply sent
      aiReply = null;

    } else if (
      lowerBody === 'yes' ||
      lowerBody === 'y' ||
      lowerBody.includes('interested') ||
      lowerBody.includes('tell me more') ||
      lowerBody.includes('more info') ||
      lowerBody.includes('how does') ||
      lowerBody.includes('sounds good') ||
      lowerBody.includes('sure')
    ) {
      // INTERESTED — hand off to a real person, do NOT ask questions
      aiReply = `${greeting}! Great to hear from you. Bob Dyson from Dyson & Dyson will reach out to you personally within 24 hours to walk you through our free relocation service. No pressure — just a conversation. Talk soon!`;

    } else if (
      lowerBody.includes('not interested') ||
      lowerBody.includes('no thanks') ||
      lowerBody.includes('no thank you') ||
      lowerBody === 'no' ||
      lowerBody === 'n' ||
      lowerBody.includes('not moving') ||
      lowerBody.includes('not relocating')
    ) {
      // NOT INTERESTED — thank them and close gracefully
      aiReply = `No problem at all, ${firstName ? firstName : 'thank you'}! We wish you all the best with your sale. If anything changes down the road, don't hesitate to reach out. Take care!`;

    } else if (
      lowerBody.includes('already have') ||
      lowerBody.includes('have an agent') ||
      lowerBody.includes('working with') ||
      lowerBody.includes('have a realtor') ||
      lowerBody.includes('have a broker')
    ) {
      // HAS AN AGENT
      aiReply = `That's great — glad you're taken care of! Just so you know, our service works alongside your current agent on the destination side. But no worries if now isn't the right time. Wishing you a smooth sale!`;

    } else if (
      lowerBody.includes('who is this') ||
      lowerBody.includes('who are you') ||
      lowerBody.includes('what is this') ||
      lowerBody.includes('what company') ||
      lowerBody.includes('how did you get') ||
      lowerBody.includes('how do you have')
    ) {
      // SKEPTICAL / WHO ARE YOU
      aiReply = `This is Dyson & Dyson Concierge Relocation — a licensed CA brokerage (DRE #02303118). We saw your home listed and reach out to sellers who may be relocating to offer free help finding a home in their destination city. Reply STOP anytime to opt out.`;

    } else if (lowerBody.includes('call') || lowerBody.includes('phone') || lowerBody.includes('talk') || lowerBody.includes('speak')) {
      // WANTS A CALL
      aiReply = `Absolutely! Bob Dyson will give you a call directly. We'll be in touch within 24 hours. What's the best time of day to reach you?`;

    } else {
      // ANYTHING ELSE — do NOT try to answer. Route to human.
      aiReply = `Thanks for your message! A member of our team will follow up with you shortly. If you have any questions in the meantime, feel free to reply here.`;
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