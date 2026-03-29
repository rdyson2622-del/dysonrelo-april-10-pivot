import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Follow-up SMS sequence for owners who haven't responded
// Day 3, Day 7, Day 14 — each with a different angle
const FOLLOW_UP_SCRIPTS = {
  3: (firstName, address) =>
    `Hi ${firstName}, just following up — your home at ${address} is listed and we wanted to make sure you saw our note. Our AI concierge Charlie handles your ENTIRE relocation FREE — neighborhoods, schools, agents, everything. Just reply YES to get started. Reply STOP to opt out.`,
  7: (firstName) =>
    `Hey ${firstName} — Bob Dyson here from Dyson & Dyson Relocation. 54 years in real estate. We've helped hundreds of families move seamlessly. If you're heading somewhere new, Charlie (our AI) will map out your whole move for free. Worth 2 minutes? Reply YES or call (858) 353-1200. Reply STOP to opt out.`,
  14: (firstName) =>
    `${firstName}, last message from us — if you're still planning a move, dysonrelo.com has everything you need: AI neighborhood research, school ratings, cost-of-living, agent matching — completely free. No obligation. Just reply YES or visit dysonrelo.com. Reply STOP to opt out.`,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This runs as a scheduled job — no user auth needed, but verify via service role
    const allCampaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.list();

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    const now = new Date();
    let sent = 0;
    let skipped = 0;

    for (const campaign of allCampaigns) {
      // Skip closed, already responded, or no phone
      if (campaign.workflow_stage === 'closed' || campaign.workflow_stage === 'response' ||
          campaign.workflow_stage === 'profile_complete' || campaign.workflow_stage === 'processing') {
        skipped++;
        continue;
      }
      if (!campaign.owner_phone) { skipped++; continue; }
      if (!campaign.sms_sent_date) { skipped++; continue; }

      const smsSentDate = new Date(campaign.sms_sent_date);
      const daysSinceSent = Math.floor((now - smsSentDate) / (1000 * 60 * 60 * 24));

      // Determine which follow-up to send
      const notes = campaign.notes || '';
      const alreadySentDay3 = notes.includes('[FOLLOWUP-DAY3]');
      const alreadySentDay7 = notes.includes('[FOLLOWUP-DAY7]');
      const alreadySentDay14 = notes.includes('[FOLLOWUP-DAY14]');

      let followUpDay = null;
      let messageBody = null;

      const firstName = campaign.owner_name ? campaign.owner_name.split(' ')[0] : 'there';
      const address = campaign.property_address || 'your property';

      if (daysSinceSent >= 14 && !alreadySentDay14 && alreadySentDay7) {
        followUpDay = 14;
        messageBody = FOLLOW_UP_SCRIPTS[14](firstName);
      } else if (daysSinceSent >= 7 && !alreadySentDay7 && alreadySentDay3) {
        followUpDay = 7;
        messageBody = FOLLOW_UP_SCRIPTS[7](firstName);
      } else if (daysSinceSent >= 3 && !alreadySentDay3) {
        followUpDay = 3;
        messageBody = FOLLOW_UP_SCRIPTS[3](firstName, address);
      }

      if (!messageBody) { skipped++; continue; }

      // Send via Twilio
      const formData = new URLSearchParams();
      formData.append('To', campaign.owner_phone);
      formData.append('From', fromNumber);
      formData.append('Body', messageBody);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(`Failed to send to ${campaign.owner_name}: ${result.message}`);
        skipped++;
        continue;
      }

      // Update campaign notes to record what was sent
      await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaign.id, {
        notes: (campaign.notes || '') + `\n[${now.toLocaleDateString()}] [FOLLOWUP-DAY${followUpDay}] Auto follow-up sent: "${messageBody.substring(0, 80)}..."`
      });

      sent++;
    }

    return Response.json({ success: true, sent, skipped });
  } catch (error) {
    console.error('sendFollowUpSMS error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});