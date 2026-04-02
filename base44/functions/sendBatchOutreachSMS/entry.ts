import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Sends up to 25 SMS messages, 3 minutes apart (180 seconds delay between each)
// Uses Twilio's scheduled messaging to avoid blocking the function
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { owners } = body; // array of { listing_owner_id, phone, owner_name, property_address }

    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      return Response.json({ error: 'No owners provided' }, { status: 400 });
    }

    const batch = owners; // Send all provided owners

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Fetch the Day 1 SMS template
    const templates = await base44.asServiceRole.entities.MessageTemplate.filter({
      name: 'Owner Outreach SMS #1 - Day 1'
    });

    if (!templates.length) {
      return Response.json({ error: 'SMS template not found' }, { status: 404 });
    }

    const templateContent = templates[0].content;
    const DELAY_SECONDS = 180; // 3 minutes between each SMS
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const results = [];
    const now = new Date();

    for (let i = 0; i < batch.length; i++) {
      const owner = batch[i];
      const { listing_owner_id, phone, owner_name, property_address } = owner;

      if (!phone || !listing_owner_id) {
        results.push({ listing_owner_id, status: 'skipped', reason: 'missing phone or id' });
        continue;
      }

      // Schedule each message: start at 5 min (300s) + i * 3 minutes (180s) in the future
      // This ensures the first message is at least 5 min in future as required by Twilio
      const sendAt = new Date(now.getTime() + (300 + i * DELAY_SECONDS) * 1000);
      const sendAtISO = sendAt.toISOString().replace('Z', '+0000'); // Twilio format

      let messageBody = templateContent.replace(/\{\{owner_name\}\}/g, owner_name || 'there');

      const formData = new URLSearchParams();
      formData.append('To', phone);
      formData.append('From', fromNumber);
      formData.append('Body', messageBody);
      formData.append('SendAt', sendAtISO);
      formData.append('ScheduleType', 'fixed');
      formData.append('MessagingServiceSid', Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || '');

      // If no messaging service SID, send immediately (first message) or with a plain send
      // Fallback: send immediately without scheduling for simpler setups
      const formDataNoSchedule = new URLSearchParams();
      formDataNoSchedule.append('To', phone);
      formDataNoSchedule.append('From', fromNumber);
      formDataNoSchedule.append('Body', messageBody);

      // Schedule all messages with proper timing (no immediate fallback)
      const messagingSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');
      if (!messagingSid) {
        return Response.json({ 
          error: 'TWILIO_MESSAGING_SERVICE_SID not configured. Cannot schedule messages without it.' 
        }, { status: 400 });
      }

      formData.set('MessagingServiceSid', messagingSid);
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
        continue;
      }

      results.push({ listing_owner_id, owner_name, status: 'queued', message_sid: result.sid, send_at: sendAtISO });

      // Update DB records
      try {
        const existing = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });
        if (existing.length > 0) {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existing[0].id, {
            sms_sent_date: new Date().toISOString(),
            workflow_stage: 'outreach',
            notes: (existing[0].notes || '') + `\n[${new Date().toLocaleDateString()}] Initial outreach SMS queued (batch position ${i + 1}).`,
          });
        } else {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
            listing_owner_id,
            owner_name: owner_name || 'Unknown',
            owner_phone: phone,
            property_address: property_address || '',
            workflow_stage: 'outreach',
            sms_sent_date: new Date().toISOString(),
            notes: `[${new Date().toLocaleDateString()}] Initial outreach SMS queued (batch position ${i + 1}).`,
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

    const sent = results.filter(r => r.status === 'queued').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    // Log batch result
    try {
      await base44.asServiceRole.entities.BatchSMSLog.create({
        city: body.city || 'Unknown',
        batch_size: batch.length,
        sent_count: sent,
        failed_count: failed,
        skipped_count: skipped,
        sent_at: new Date().toISOString(),
        sent_by: user.email,
        estimated_duration_minutes: batch.length * 3,
      });
    } catch (logErr) {
      console.error('Failed to log batch result:', logErr.message);
    }

    return Response.json({
      success: true,
      sent,
      failed,
      skipped,
      total_in_batch: batch.length,
      results,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});