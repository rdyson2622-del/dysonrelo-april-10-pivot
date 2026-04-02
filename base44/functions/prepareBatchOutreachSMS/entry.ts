import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Validates and prepares batch SMS payload (no Twilio calls)
// Returns structured data ready for sending
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { city, owners } = body;

    if (!city || !Array.isArray(owners) || owners.length === 0) {
      return Response.json({ error: 'Missing city or owners array' }, { status: 400 });
    }

    // Fetch template
    const templates = await base44.asServiceRole.entities.MessageTemplate.filter({
      name: 'Owner Outreach SMS #1 - Day 1',
    });

    if (!templates.length) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    const templateContent = templates[0].content;
    const DELAY_SECONDS = 180; // 3 minutes between messages
    const prepared = [];
    let skipped = 0;

    // Validate and prepare each owner
    for (let i = 0; i < owners.length; i++) {
      const { listing_owner_id, phone, owner_name, property_address } = owners[i];

      // Skip if missing critical data
      if (!listing_owner_id || !phone) {
        skipped++;
        continue;
      }

      // Prepare message
      const messageBody = templateContent.replace(/\{\{owner_name\}\}/g, owner_name || 'there');

      // Calculate send time (10 min + i * 3 min in future)
      const currentTime = new Date();
      const sendAtDate = new Date(currentTime.getTime() + (600 + i * DELAY_SECONDS) * 1000);
      const sendAtISO = sendAtDate.toISOString().replace(/\.\d{3}Z$/, 'Z');

      prepared.push({
        listing_owner_id,
        phone,
        owner_name: owner_name || 'Unknown',
        property_address: property_address || '',
        messageBody,
        sendAtISO,
        batchPosition: i + 1,
      });
    }

    return Response.json({
      success: true,
      city,
      total_owners: owners.length,
      prepared_count: prepared.length,
      skipped_count: skipped,
      prepared_batch: prepared,
      prepared_by: user.email,
      prepared_at: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});