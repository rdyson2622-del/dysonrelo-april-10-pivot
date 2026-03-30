import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { listing_owner_id, phone, owner_name, property_address, data_env } = body;

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!phone || !listing_owner_id) {
      return Response.json({ error: 'Missing phone or listing_owner_id' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Fetch the Day 1 SMS template (always from prod - templates live in prod only)
    const templates = await base44.asServiceRole.entities.MessageTemplate.filter({ 
      name: 'Owner Outreach SMS #1 - Day 1' 
    });
    
    if (!templates.length) {
      return Response.json({ error: 'SMS template not found' }, { status: 404 });
    }

    let messageBody = templates[0].content;
    messageBody = messageBody.replace(/\{\{owner_name\}\}/g, owner_name || 'there');

    // Send SMS via Twilio
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

    // SMS sent successfully — now update DB records
    // Note: asServiceRole entity operations always use prod DB in this SDK version.
    // For dev/test mode, we still update prod to keep campaign records in sync,
    // but we gracefully handle any errors so they don't block the success response.
    try {
      const existingCampaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });

      if (existingCampaigns.length > 0) {
        await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existingCampaigns[0].id, {
          sms_sent_date: new Date().toISOString(),
          workflow_stage: 'outreach',
          notes: (existingCampaigns[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS sent.`,
        });
      } else {
        await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
          listing_owner_id,
          owner_name: owner_name || 'Unknown',
          owner_phone: phone,
          property_address: property_address || '',
          workflow_stage: 'outreach',
          sms_sent_date: new Date().toISOString(),
          notes: `[${new Date().toLocaleDateString()}] Campaign auto-created. Initial outreach SMS sent.`,
        });
      }

      await base44.asServiceRole.entities.ListingOwner.update(listing_owner_id, {
        contact_status: 'contacted',
        last_contacted: new Date().toISOString().split('T')[0],
      });
    } catch (dbErr) {
      // DB update failed (e.g. test DB mismatch) but SMS was sent — log and continue
      console.error('DB update after SMS failed:', dbErr.message);
    }

    return Response.json({ success: true, message_sid: result.sid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});