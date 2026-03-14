import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { listing_owner_id, phone, owner_name } = await req.json();

    // Create Twilio auth header
    const auth = btoa(`${accountSid}:${authToken}`);

    // Send SMS via Twilio
    const twilioResponse = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: phone,
        Body: `Hi ${owner_name}, we're Dyson & Dyson Concierge Relocation Services. We noticed your home is listed and help relocating sellers like you find their perfect new community completely free. Would you be interested in learning more? Reply YES to chat with Charlie, our AI concierge. 🏡`
      }).toString()
    });

    if (!twilioResponse.ok) {
      const error = await twilioResponse.text();
      return Response.json({ error: 'Failed to send SMS', details: error }, { status: 500 });
    }

    const smsData = await twilioResponse.json();

    // Create outreach campaign record
    const campaign = await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
      listing_owner_id,
      owner_name,
      owner_phone: phone,
      workflow_stage: 'outreach',
      sms_sent_date: new Date().toISOString()
    });

    return Response.json({
      success: true,
      campaign_id: campaign.id,
      twilio_sid: smsData.sid,
      message: 'SMS sent successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});