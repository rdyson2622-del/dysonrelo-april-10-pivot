import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { listing_owner_id, phone, owner_name } = await req.json();

    if (!phone || !listing_owner_id) {
      return Response.json({ error: 'Missing phone or listing_owner_id' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    const firstName = owner_name ? owner_name.split(' ')[0] : 'there';

    const messageBody = `Hi ${firstName}, this is Dyson & Dyson Concierge Relocation. We noticed your home is listed — are you planning to relocate? We offer a FREE concierge service to find your next home & manage your entire move. Learn more: dysonrelo.com — Reply YES or call Bob at (858) 353-1200. Reply STOP to opt out.`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('To', phone);
    formData.append('From', fromNumber);
    formData.append('Body', messageBody);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: result.message || 'Twilio error', details: result }, { status: 500 });
    }

    // Auto-create or update the campaign record
    const existingCampaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });

    if (existingCampaigns.length > 0) {
      await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existingCampaigns[0].id, {
        sms_sent_date: new Date().toISOString(),
        workflow_stage: 'outreach',
        notes: (existingCampaigns[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS sent.`,
      });
    } else {
      // Auto-create campaign record so it appears in the pipeline
      await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
        listing_owner_id,
        owner_name: owner_name || 'Unknown',
        owner_phone: phone,
        property_address: '',
        workflow_stage: 'outreach',
        sms_sent_date: new Date().toISOString(),
        notes: `[${new Date().toLocaleDateString()}] Campaign auto-created. Initial outreach SMS sent.`,
      });
    }

    // Also update ListingOwner contact status
    await base44.asServiceRole.entities.ListingOwner.update(listing_owner_id, {
      contact_status: 'contacted',
      last_contacted: new Date().toISOString().split('T')[0],
    });

    return Response.json({ success: true, message_sid: result.sid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});