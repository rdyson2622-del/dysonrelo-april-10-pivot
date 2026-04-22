import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { template_id, owner_ids } = await req.json();
    if (!template_id || !owner_ids?.length) {
      return Response.json({ error: 'template_id and owner_ids are required' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromPhone) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    // Fetch template
    const template = await base44.asServiceRole.entities.MessageTemplate.get(template_id);
    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    // Fetch all owners in one call
    const allOwners = await base44.asServiceRole.entities.ListingOwner.list('-created_date', 5000);
    const ownerMap = {};
    for (const o of allOwners) ownerMap[o.id] = o;

    const twilioAuth = btoa(`${accountSid}:${authToken}`);

    let sent = 0;
    let failed = 0;
    const errors = [];

    // Send in concurrent chunks of 10 to avoid timeout
    const CHUNK_SIZE = 10;
    const chunks = [];
    for (let i = 0; i < owner_ids.length; i += CHUNK_SIZE) {
      chunks.push(owner_ids.slice(i, i + CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (ownerId) => {
        const owner = ownerMap[ownerId];
        if (!owner?.phone) { failed++; return; }

        // Fill placeholders
        const body = template.content
          .replace(/\{\{owner_name\}\}/g, owner.owner_name || 'there')
          .replace(/\{\{property_address\}\}/g, owner.property_address || '')
          .replace(/\{\{listing_price\}\}/g, owner.listing_price ? `$${Number(owner.listing_price).toLocaleString()}` : '')
          .replace(/\{\{destination_city\}\}/g, owner.moving_to || '');

        const params = new URLSearchParams({
          From: fromPhone,
          To: owner.phone,
          Body: body,
        });

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        const twilioData = await twilioRes.json();
        console.log(`[SMS] ${owner.owner_name} (${owner.phone}):`, twilioData.sid ? 'SUCCESS' : `FAILED - ${twilioData.message} (code ${twilioData.code})`);

        if (twilioData.sid) {
          sent++;
          await base44.asServiceRole.entities.ListingOwner.update(ownerId, {
            contact_status: 'contacted',
            last_contacted: new Date().toISOString().split('T')[0],
          });
        } else {
          failed++;
          errors.push(`${owner.owner_name}: ${twilioData.message || 'Unknown error'} (${twilioData.code || 'N/A'})`);
        }
      }));
    }

    // Log the batch
    await base44.asServiceRole.entities.BatchSMSLog.create({
      city: 'Manual Send',
      batch_size: owner_ids.length,
      sent_count: sent,
      failed_count: failed,
      skipped_count: 0,
      sent_at: new Date().toISOString(),
      sent_by: user.email,
      estimated_duration_minutes: 0,
      notes: `Manual send via Compose SMS — template: ${template.name}`,
    });

    return Response.json({ success: true, sent, failed, errors });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});