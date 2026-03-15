import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { property_address, city, state, zip } = await req.json();

    if (!property_address || !city || !state) {
      return Response.json({ error: 'Missing required fields: property_address, city, state' }, { status: 400 });
    }

    const apiKey = Deno.env.get('PROPSTREAM_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'PropStream API key not configured' }, { status: 500 });
    }

    // Search for property
    const searchUrl = new URL('https://api.propstream.com/v1/property/search');
    searchUrl.searchParams.set('address', property_address);
    searchUrl.searchParams.set('city', city);
    searchUrl.searchParams.set('state', state);
    if (zip) searchUrl.searchParams.set('zip', zip);

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      return Response.json(
        { error: `PropStream search failed: ${searchResponse.statusText}` },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const property = searchData.results[0];
    const propertyId = property.id;

    // Fetch detailed property info
    const detailUrl = `https://api.propstream.com/v1/property/${propertyId}`;
    const detailResponse = await fetch(detailUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!detailResponse.ok) {
      return Response.json(
        { error: `PropStream detail fetch failed: ${detailResponse.statusText}` },
        { status: detailResponse.status }
      );
    }

    const propertyDetails = await detailResponse.json();

    // Extract key details
    const taxHistory = propertyDetails.tax_history || [];
    const ownerEquity = propertyDetails.owner_equity || null;
    const assessedValue = propertyDetails.assessed_value || null;
    const estimatedValue = propertyDetails.estimated_value || null;

    // Fetch recent comps (similar properties sold nearby)
    const compsUrl = `https://api.propstream.com/v1/property/${propertyId}/comps`;
    let recentComps = [];

    try {
      const compsResponse = await fetch(compsUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (compsResponse.ok) {
        const compsData = await compsResponse.json();
        recentComps = compsData.comps || [];
      }
    } catch (err) {
      console.log('Comps fetch failed, continuing without comps');
    }

    return Response.json({
      property_id: propertyId,
      address: `${property_address}, ${city}, ${state}${zip ? ' ' + zip : ''}`,
      tax_history: taxHistory.slice(0, 5), // Last 5 years
      owner_equity: ownerEquity,
      assessed_value: assessedValue,
      estimated_value: estimatedValue,
      recent_comps: recentComps.slice(0, 3), // Top 3 comps
      full_details: {
        beds: propertyDetails.bedrooms,
        baths: propertyDetails.bathrooms,
        sqft: propertyDetails.square_feet,
        lot_size: propertyDetails.lot_size,
        year_built: propertyDetails.year_built,
        property_type: propertyDetails.property_type,
        owner_name: propertyDetails.owner_name,
        owner_phone: propertyDetails.owner_phone,
        owner_email: propertyDetails.owner_email,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});