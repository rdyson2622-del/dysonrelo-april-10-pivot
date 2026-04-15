import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Sends SMS messages immediately using From number (no scheduling, no MessagingServiceSid needed)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { owners, city } = body; // owners: array of { listing_owner_id, phone, owner_name, property_address }

    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      return Response.json({ error: 'No owners provided' }, { status: 400 });
    }

    const accountSid = (Deno.env.get('TWILIO_ACCOUNT_SID') || '').trim();
    const authToken = (Deno.env.get('TWILIO_AUTH_TOKEN') || '').trim();
    const fromNumber = (Deno.env.get('TWILIO_PHONE_NUMBER') || '').trim();

    if (!accountSid || !authToken || !fromNumber) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    // Fetch the Day 1 SMS template
    const templates = await base44.asServiceRole.entities.MessageTemplate.filter({
      name: 'Owner Outreach SMS #1 - Day 1'
    });

    if (!templates.length) {
      return Response.json({ error: 'SMS template "Owner Outreach SMS #1 - Day 1" not found' }, { status: 404 });
    }

    const templateContent = templates[0].content;
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioAuth = btoa(`${accountSid}:${authToken}`);

    const results = [];

    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      const { listing_owner_id, phone, owner_name, property_address } = owner;

      if (!phone || !listing_owner_id) {
        results.push({ listing_owner_id, status: 'skipped', reason: 'missing phone or id' });
        continue;
      }

      const messageBody = templateContent.replace(/\{\{owner_name\}\}/g, owner_name || 'there');

      const formData = new URLSearchParams();
      formData.append('To', phone);
      formData.append('From', fromNumber);
      formData.append('Body', messageBody);

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`Failed to send to ${owner_name}:`, result.message);
        results.push({ listing_owner_id, owner_name, status: 'failed', error: result.message });
        continue;
      }

      results.push({ listing_owner_id, owner_name, status: 'sent', message_sid: result.sid });

      // Update DB records
      try {
        const existing = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });
        if (existing.length > 0) {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existing[0].id, {
            sms_sent_date: new Date().toISOString(),
            workflow_stage: 'outreach',
            notes: (existing[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS sent (batch position ${i + 1}).`,
          });
        } else {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
            listing_owner_id,
            owner_name: owner_name || 'Unknown',
            owner_phone: phone,
            property_address: property_address || '',
            workflow_stage: 'outreach',
            sms_sent_date: new Date().toISOString(),
            notes: `[${new Date().toLocaleDateString()}] Initial outreach SMS sent (batch position ${i + 1}).`,
          });
        }

        await base44.asServiceRole.entities.ListingOwner.update(listing_owner_id, {
          contact_status: 'contacted',
          last_contacted: new Date().toISOString().split('T')[0],
        });
      } catch (dbErr) {
        console.error('DB update failed for', listing_owner_id, dbErr.message);
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    // Log batch result
    try {
      await base44.asServiceRole.entities.BatchSMSLog.create({
        city: city || 'Unknown',
        batch_size: owners.length,
        sent_count: sent,
        failed_count: failed,
        skipped_count: skipped,
        sent_at: new Date().toISOString(),
        sent_by: user.email,
        estimated_duration_minutes: 0,
      });
    } catch (logErr) {
      console.error('Failed to log batch result:', logErr.message);
    }

    return Response.json({
      success: true,
      sent,
      failed,
      skipped,
      total: owners.length,
      results,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});