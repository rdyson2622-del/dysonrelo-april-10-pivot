import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BATCHDATA_API_KEY = Deno.env.get("BATCHDATA_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { owner_ids } = body;

    if (!owner_ids || !owner_ids.length) {
      return Response.json({ error: 'No owner_ids provided' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const owner_id of owner_ids) {
      try {
        const owner = await base44.asServiceRole.entities.ListingOwner.get(owner_id);
        if (!owner) {
          errors.push({ owner_id, error: 'Owner not found' });
          continue;
        }

        // Call BatchData skip trace API
        const bdResponse = await fetch('https://api.batchdata.com/api/v1/property/skip-trace', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BATCHDATA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [{
              propertyAddress: {
                street: owner.property_address,
                city: owner.property_city,
                state: owner.property_state,
              }
            }]
          })
        });

        if (!bdResponse.ok) {
          const errText = await bdResponse.text();
          errors.push({ owner_id, address: owner.property_address, error: `BatchData error: ${bdResponse.status} - ${errText}` });
          continue;
        }

        const bdResult = await bdResponse.json();
        // BatchData returns results in responses array
        const personData = bdResult?.responses?.[0]?.people?.[0];
        const ownerName = personData?.name?.full || bdResult?.responses?.[0]?.owner?.name || owner.owner_name;
        const phone = personData?.phones?.[0]?.number || personData?.phones?.[0] || '';
        const email = personData?.emails?.[0]?.email || personData?.emails?.[0] || '';

        // Update the ListingOwner record with real owner info
        const updates = {
          notes: (owner.notes || '') + `\nSkip traced ${new Date().toLocaleDateString()}: ${ownerName}`,
        };
        if (ownerName && ownerName !== owner.owner_name) updates.owner_name = ownerName;
        if (phone) updates.phone = phone;
        if (email) updates.email = email;

        await base44.asServiceRole.entities.ListingOwner.update(owner_id, updates);

        results.push({
          owner_id,
          address: owner.property_address,
          owner_name: ownerName,
          phone,
          email,
          status: 'success'
        });

      } catch (err) {
        errors.push({ owner_id, error: err.message });
      }
    }

    return Response.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      results,
      error_details: errors
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});