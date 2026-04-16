import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Sends pre-prepared SMS batch using From number (no MessagingServiceSid needed)
// Messages are sent immediately to Twilio - rate limiting is handled by Twilio's queuing
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { city, prepared_batch } = body;

    if (!city || !Array.isArray(prepared_batch) || prepared_batch.length === 0) {
      return Response.json({ error: 'Missing city or prepared_batch' }, { status: 400 });
    }

    const accountSid = (Deno.env.get('TWILIO_ACCOUNT_SID') || '').trim();
    const authToken = (Deno.env.get('TWILIO_AUTH_TOKEN') || '').trim();
    const fromNumber = (Deno.env.get('TWILIO_PHONE_NUMBER') || '').trim();

    if (!accountSid || !authToken || !fromNumber) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    const results = [];
    let sent = 0;
    let failed = 0;

    for (const item of prepared_batch) {
      const { listing_owner_id, phone, owner_name, property_address, messageBody, batchPosition } = item;

      const formData = new URLSearchParams();
      formData.append('To', phone);
      formData.append('From', fromNumber);
      formData.append('Body', messageBody);

      try {
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
          failed++;
          continue;
        }

        // Update database records
        try {
          const existing = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });
          if (existing.length > 0) {
            await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existing[0].id, {
              sms_sent_date: new Date().toISOString(),
              workflow_stage: 'outreach',
              notes: (existing[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS sent (batch position ${batchPosition}).`,
            });
          } else {
            await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
              listing_owner_id,
              owner_name: owner_name || 'Unknown',
              owner_phone: phone,
              property_address: property_address || '',
              workflow_stage: 'outreach',
              sms_sent_date: new Date().toISOString(),
              notes: `[${new Date().toLocaleDateString()}] Initial outreach SMS sent (batch position ${batchPosition}).`,
            });
          }

          await base44.asServiceRole.entities.ListingOwner.update(listing_owner_id, {
            contact_status: 'contacted',
            last_contacted: new Date().toISOString().split('T')[0],
          });
        } catch (dbErr) {
          console.error('DB update failed for', listing_owner_id, dbErr.message);
        }

        results.push({ listing_owner_id, owner_name, status: 'sent', message_sid: result.sid });
        sent++;

      } catch (err) {
        results.push({ listing_owner_id, owner_name, status: 'failed', error: err.message });
        failed++;
      }
    }

    // Log batch result
    try {
      await base44.asServiceRole.entities.BatchSMSLog.create({
        city,
        batch_size: prepared_batch.length,
        sent_count: sent,
        failed_count: failed,
        skipped_count: 0,
        sent_at: new Date().toISOString(),
        sent_by: user.email,
        estimated_duration_minutes: sent * 3,
      });
    } catch (logErr) {
      console.error('Failed to create BatchSMSLog:', logErr.message);
    }

    return Response.json({
      success: true,
      city,
      sent,
      failed,
      total_sent: prepared_batch.length,
      results,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});