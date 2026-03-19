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

    // BatchData Property Search API - search for recently listed Palo Alto properties over $2M
    // Using searchCriteria as the top-level key per BatchData v1 docs
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const searchPayload = {
      searchCriteria: {
        address: {
          city: "Palo Alto",
          state: "CA"
        },
        listing: {
          listingStatus: ["Active"],
          minListPrice: 2000000,
          listDateMin: thirtyDaysAgo
        }
      },
      take: 20,
      skip: 0
    };

    console.log("Calling BatchData Property Search for Palo Alto listings >$2M...");

    // Test with a short timeout to see if API is reachable
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let response;
    try {
      response = await fetch("https://api.batchdata.com/api/v1/property/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(searchPayload),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseText = await response.text();
    console.log("BatchData response status:", response.status);
    console.log("BatchData raw response:", responseText.substring(0, 2000));

    if (!response.ok) {
      return Response.json({
        error: `BatchData API error: ${response.status} ${response.statusText}`,
        details: responseText
      }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return Response.json({ error: 'Failed to parse BatchData response', raw: responseText }, { status: 502 });
    }

    // Extract listings from response — BatchData nests results under results[0].properties or similar
    const properties = data?.results?.[0]?.properties
      || data?.results?.[0]?.result?.properties
      || data?.data?.[0]?.properties
      || data?.properties
      || [];

    console.log(`Found ${properties.length} properties from BatchData`);

    if (properties.length === 0) {
      return Response.json({
        success: true,
        message: 'No properties found matching criteria',
        raw_response_keys: Object.keys(data || {}),
        full_response: data
      });
    }

    // Save each listing to ListingImport
    const saved = [];
    const skipped = [];

    for (const prop of properties) {
      const address = prop.address?.street || prop.propertyAddress?.street || prop.street || '';
      const city = prop.address?.city || prop.propertyAddress?.city || 'Palo Alto';
      const state = prop.address?.state || prop.propertyAddress?.state || 'CA';
      const zip = prop.address?.zip || prop.propertyAddress?.zip || '';
      const price = prop.listing?.listPrice || prop.listPrice || prop.price || 0;
      const mlsId = prop.mlsId || prop.mls_id || prop.id || '';

      if (!address) {
        skipped.push({ reason: 'no address', raw: prop });
        continue;
      }

      // Check for duplicate
      const existing = mlsId
        ? await base44.asServiceRole.entities.ListingImport.filter({ mls_id: mlsId })
        : await base44.asServiceRole.entities.ListingImport.filter({ property_address: address, city });

      if (existing.length > 0) {
        skipped.push({ address, reason: 'already exists' });
        continue;
      }

      const record = await base44.asServiceRole.entities.ListingImport.create({
        mls_id: mlsId,
        property_address: address,
        city,
        state,
        zip,
        price,
        bedrooms: prop.bedrooms || prop.beds || 0,
        bathrooms: prop.bathrooms || prop.baths || 0,
        sqft: prop.squareFeet || prop.sqft || prop.livingArea || 0,
        list_agent_name: prop.listing?.agentName || prop.listingAgent?.name || '',
        list_agent_email: prop.listing?.agentEmail || prop.listingAgent?.email || '',
        list_agent_phone: prop.listing?.agentPhone || prop.listingAgent?.phone || '',
        list_date: prop.listing?.listDate || prop.listDate || new Date().toISOString().split('T')[0],
        source: 'idx_feed',
        status: 'active'
      });

      saved.push({ id: record.id, address, price });
    }

    return Response.json({
      success: true,
      total_from_api: properties.length,
      saved: saved.length,
      skipped: skipped.length,
      listings_saved: saved,
      listings_skipped: skipped
    });

  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});