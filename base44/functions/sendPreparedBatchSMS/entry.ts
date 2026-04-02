import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Sends pre-prepared SMS batch to Twilio
// Input: prepared batch from prepareBatchOutreachSMS
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

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const messagingSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');

    if (!accountSid || !authToken || !messagingSid) {
      return Response.json({ error: 'Twilio config missing' }, { status: 400 });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const results = [];
    let sent = 0;
    let failed = 0;

    // Send each prepared message to Twilio
    for (const item of prepared_batch) {
      const { listing_owner_id, phone, owner_name, property_address, messageBody, sendAtISO, batchPosition } = item;

      const formData = new URLSearchParams();
      formData.append('To', phone);
      formData.append('MessagingServiceSid', messagingSid);
      formData.append('Body', messageBody);
      formData.append('SendAt', sendAtISO);
      formData.append('ScheduleType', 'fixed');

      try {
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
          results.push({ listing_owner_id, owner_name, status: 'failed', error: result.message });
          failed++;
          continue;
        }

        // Success - update database
        try {
          const existing = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });
          if (existing.length > 0) {
            await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existing[0].id, {
              sms_sent_date: new Date().toISOString(),
              workflow_stage: 'outreach',
              notes: (existing[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS queued (batch position ${batchPosition}).`,
            });
          } else {
            await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
              listing_owner_id,
              owner_name: owner_name || 'Unknown',
              owner_phone: phone,
              property_address: property_address || '',
              workflow_stage: 'outreach',
              sms_sent_date: new Date().toISOString(),
              notes: `[${new Date().toLocaleDateString()}] Initial outreach SMS queued (batch position ${batchPosition}).`,
            });
          }

          await base44.asServiceRole.entities.ListingOwner.update(listing_owner_id, {
            contact_status: 'contacted',
            last_contacted: new Date().toISOString().split('T')[0],
          });
          console.log('Updated ListingOwner contact_status for', listing_owner_id);
        } catch (dbErr) {
          console.error('DB update failed for', listing_owner_id, ':', dbErr.message);
        }

        results.push({ listing_owner_id, owner_name, status: 'queued', message_sid: result.sid });
        sent++;

      } catch (err) {
        results.push({ listing_owner_id, owner_name, status: 'failed', error: err.message });
        failed++;
      }
    }

    // Log batch result
    try {
      const logRecord = await base44.asServiceRole.entities.BatchSMSLog.create({
        city,
        batch_size: prepared_batch.length,
        sent_count: sent,
        failed_count: failed,
        skipped_count: 0,
        sent_at: new Date().toISOString(),
        sent_by: user.email,
        estimated_duration_minutes: sent * 3,
      });
      console.log('BatchSMSLog created:', logRecord.id);
    } catch (logErr) {
      console.error('CRITICAL: Failed to create BatchSMSLog', { city, sent, failed, error: logErr.message });
      // Still return success for SMS send, but log the DB failure
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