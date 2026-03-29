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

    // NO AUTO-REPLY LOGIC — every inbound SMS goes straight to Bob.
    // One safe canned response only. No Charlie. No AI guessing.
    let aiReply = null;

    const isOptOut = lowerBody.includes('stop') || lowerBody.includes('opt out') || lowerBody.includes('unsubscribe') || lowerBody.includes('remove');

    if (!isOptOut) {
      aiReply = `Thanks for reaching out! Someone from our team will be in touch with you shortly. You can also reach us directly at (858) 353-1200.`;
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

    // 🚨 Email admin immediately for EVERY inbound SMS (opt-outs too)
    try {
      const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
      const ownerLabel = campaign ? `${campaign.owner_name} — ${campaign.property_address}` : `Unknown sender`;
      const emailPromises = adminUsers.map(admin =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: admin.email,
          from_name: 'Dyson & Dyson System',
          subject: `📱 CALL THEM NOW — SMS Reply: ${ownerLabel}`,
          body: `INBOUND SMS — NEEDS YOUR PERSONAL FOLLOW UP
==========================================

FROM NUMBER: ${from}
OWNER: ${ownerLabel}
PROPERTY: ${campaign?.property_address || 'Unknown'}

THEIR EXACT MESSAGE:
"${messageBody}"

OUR AUTO-REPLY SENT:
"${isOptOut ? '(Opted out — no reply sent)' : aiReply}"

==========================================
NEXT STEP: Call them at ${from} or text them from your personal number.
Their canned reply from us already says to expect a call at (858) 353-1200.
==========================================`
        })
      );
      await Promise.all(emailPromises);
    } catch (notifyErr) {
      console.error('Admin notification failed:', notifyErr.message);
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