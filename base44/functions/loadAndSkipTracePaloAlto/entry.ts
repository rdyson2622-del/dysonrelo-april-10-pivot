import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const BATCHDATA_API_KEY = Deno.env.get("BATCHDATA_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!BATCHDATA_API_KEY) {
      return Response.json({ error: 'BATCHDATA_API_KEY not configured' }, { status: 500 });
    }

    // Step 1: Search for 10 homes over $2M recently listed in Palo Alto
    console.log("Searching for Palo Alto homes over $2M...");
    const today = new Date();
    const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
    const formattedDate = tenDaysAgo.toISOString().split('T')[0];

    const searchResponse = await fetch("https://api.batchdata.com/batch/property/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: {
          city: "Palo Alto",
          state: "CA"
        },
        listPrice: {
          min: 2000000
        },
        listDateMin: formattedDate,
        limit: 10
      })
    });

    const searchData = await searchResponse.json();
    const properties = searchData.result || searchData.properties || [];

    if (properties.length === 0) {
      return Response.json({
        success: true,
        message: 'No properties found matching criteria',
        properties_found: 0
      });
    }

    console.log(`Found ${properties.length} properties, now skip tracing...`);

    // Step 2: Prepare skip trace requests
    const skipTraceRequests = properties.map(prop => ({
      propertyAddress: {
        street: prop.address?.street || prop.streetAddress || '',
        city: prop.address?.city || 'Palo Alto',
        state: prop.address?.state || 'CA',
        zip: prop.address?.zip || prop.zipCode || ''
      }
    }));

    // Step 3: Perform skip trace
    const skipTraceResponse = await fetch("https://api.batchdata.com/api/v1/property/skip-trace", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: skipTraceRequests
      })
    });

    const skipTraceData = await skipTraceResponse.json();
    const results = skipTraceData?.results || skipTraceData?.data || [];

    console.log(`Received ${results.length} skip trace results`);

    // Step 4: Store in database
    const owners_created = [];
    const errors = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const property = properties[i];

      if (!property) continue;

      const ownerData = result?.owner || result?.owners?.[0] || result?.person || result;
      const ownerName = ownerData?.name?.full
        || ownerData?.ownerName
        || ownerData?.fullName
        || [ownerData?.name?.first, ownerData?.name?.last].filter(Boolean).join(' ')
        || 'Unknown Owner';

      const phones = ownerData?.phones || ownerData?.phoneNumbers || result?.phones || [];
      const primaryPhone = phones[0]?.number || phones[0]?.phone || phones[0] || '';

      const emails = ownerData?.emails || ownerData?.emailAddresses || result?.emails || [];
      const primaryEmail = emails[0]?.email || emails[0]?.address || emails[0] || '';

      const address = `${property.address?.street || property.streetAddress || ''} ${property.address?.city || 'Palo Alto'}, ${property.address?.state || 'CA'} ${property.address?.zip || property.zipCode || ''}`.trim();

      // Check if owner already exists
      const existing = await base44.asServiceRole.entities.ListingOwner.filter({
        property_address: address
      });

      if (existing.length > 0) {
        if (primaryPhone || primaryEmail) {
          await base44.asServiceRole.entities.ListingOwner.update(existing[0].id, {
            phone: primaryPhone || existing[0].phone,
            email: primaryEmail || existing[0].email
          });
          owners_created.push({
            id: existing[0].id,
            address,
            owner: ownerName,
            phone: primaryPhone,
            email: primaryEmail,
            price: property.listPrice,
            action: 'updated'
          });
        }
        continue;
      }

      // Create new owner
      const owner = await base44.asServiceRole.entities.ListingOwner.create({
        owner_name: ownerName,
        phone: primaryPhone,
        email: primaryEmail,
        property_address: address,
        property_city: property.address?.city || 'Palo Alto',
        property_state: property.address?.state || 'CA',
        listing_price: property.listPrice || 0,
        contact_status: 'not_contacted',
        notes: `Loaded via automated Palo Alto search on ${new Date().toLocaleDateString()}`
      });

      owners_created.push({
        id: owner.id,
        address,
        owner: ownerName,
        phone: primaryPhone,
        email: primaryEmail,
        price: property.listPrice,
        action: 'created'
      });
    }

    return Response.json({
      success: true,
      properties_found: properties.length,
      owners_processed: owners_created.length,
      owners: owners_created,
      errors
    });

  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});