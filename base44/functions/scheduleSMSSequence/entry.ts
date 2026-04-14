import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Enrolls a list of owner IDs into an SMS sequence.
// Each subsequent message is Twilio-scheduled at the delay specified in the sequence step.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { sequence_id, owner_ids } = await req.json();
    if (!sequence_id || !Array.isArray(owner_ids) || owner_ids.length === 0) {
      return Response.json({ error: 'sequence_id and owner_ids are required' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');

    if (!accountSid || !authToken || !messagingServiceSid) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    // Fetch sequence
    const sequence = await base44.asServiceRole.entities.SMSSequence.get(sequence_id);
    if (!sequence || !sequence.steps?.length) {
      return Response.json({ error: 'Sequence not found or has no steps' }, { status: 404 });
    }

    // Fetch owners
    const allOwners = await base44.asServiceRole.entities.ListingOwner.list('-created_date', 5000);
    const ownerMap = {};
    for (const o of allOwners) ownerMap[o.id] = o;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioAuth = btoa(`${accountSid}:${authToken}`);

    let enrolled = 0;
    let skipped = 0;
    const errors = [];
    const now = new Date();

    for (const ownerId of owner_ids) {
      const owner = ownerMap[ownerId];
      if (!owner?.phone) { skipped++; continue; }

      // Check if already enrolled in this sequence (prevent duplicates)
      const existing = await base44.asServiceRole.entities.SMSSequenceEnrollment.filter({
        sequence_id,
        listing_owner_id: ownerId,
        status: 'active',
      });
      if (existing.length > 0) { skipped++; continue; }

      const stepsLog = [];
      let cumulativeMs = 0;

      // Schedule all steps for this owner
      for (let i = 0; i < sequence.steps.length; i++) {
        const step = sequence.steps[i];
        const delayMs = ((step.delay_days || 0) * 24 * 60 * 60 + (step.delay_hours || 0) * 60 * 60) * 1000;
        cumulativeMs += delayMs;

        // Step 1 with 0 delay = send immediately; otherwise always schedule
        const sendAt = new Date(now.getTime() + cumulativeMs);

        // Fill placeholders
        const body = (step.message || '')
          .replace(/\{\{owner_name\}\}/g, owner.owner_name || 'there')
          .replace(/\{\{property_address\}\}/g, owner.property_address || '')
          .replace(/\{\{listing_price\}\}/g, owner.listing_price ? `$${Number(owner.listing_price).toLocaleString()}` : '')
          .replace(/\{\{destination_city\}\}/g, owner.moving_to || '');

        const params = new URLSearchParams({
          MessagingServiceSid: messagingServiceSid,
          To: owner.phone,
          Body: body,
        });

        // If send time is > 15 minutes from now, use Twilio scheduled delivery
        const minutesUntilSend = cumulativeMs / 60000;
        if (minutesUntilSend >= 15) {
          // Twilio requires ISO 8601 with timezone for scheduled messages
          params.append('SendAt', sendAt.toISOString());
          params.append('ScheduleType', 'fixed');
        }

        let messageSid = null;
        let stepStatus = 'scheduled';

        try {
          const twilioRes = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });
          const data = await twilioRes.json();
          if (data.sid) {
            messageSid = data.sid;
            stepStatus = data.status || 'scheduled';
          } else {
            stepStatus = 'failed';
            errors.push(`Step ${i + 1} for ${owner.owner_name}: ${data.message}`);
          }
        } catch (e) {
          stepStatus = 'failed';
          errors.push(`Step ${i + 1} for ${owner.owner_name}: ${e.message}`);
        }

        stepsLog.push({
          step_number: i + 1,
          sent_at: sendAt.toISOString(),
          message_sid: messageSid,
          status: stepStatus,
        });
      }

      // Calculate next_step_due (first step's send time)
      const firstStep = sequence.steps[0];
      const firstDelaySec = ((firstStep.delay_days || 0) * 24 * 60 * 60) + ((firstStep.delay_hours || 0) * 3600);
      const nextDue = new Date(now.getTime() + firstDelaySec * 1000);

      // Create enrollment record
      await base44.asServiceRole.entities.SMSSequenceEnrollment.create({
        sequence_id,
        sequence_name: sequence.name,
        listing_owner_id: ownerId,
        owner_name: owner.owner_name || '',
        owner_phone: owner.phone,
        property_address: owner.property_address || '',
        enrolled_at: now.toISOString(),
        enrolled_by: user.email,
        current_step: 0,
        next_step_due: nextDue.toISOString(),
        status: 'active',
        steps_log: stepsLog,
      });

      // Update owner contact_status
      await base44.asServiceRole.entities.ListingOwner.update(ownerId, {
        contact_status: 'contacted',
        last_contacted: now.toISOString().split('T')[0],
      });

      enrolled++;
    }

    return Response.json({
      success: true,
      enrolled,
      skipped,
      errors: errors.length ? errors : undefined,
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});