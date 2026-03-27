import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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

    const { city, state, min_price, max_results = 10, days_listed = 1 } = await req.json();

    if (!city || !state) {
      return Response.json({ error: 'city and state are required' }, { status: 400 });
    }

    // BatchData Property Search API
    const requestBody = {
      filters: {
        location: {
          city: city,
          state: state
        },
        listing: {
          status: ["active"],
          listPrice: {
            min: min_price || 0
          },
          daysOnMarket: {
            max: days_listed
          }
        }
      },
      size: max_results,
      fields: [
        "address.street",
        "address.city",
        "address.state",
        "address.zip",
        "listing.listPrice",
        "listing.listDate",
        "listing.daysOnMarket",
        "listing.status",
        "property.bedrooms",
        "property.bathrooms",
        "property.squareFeet",
        "property.propertyType",
        "owner.name"
      ]
    };

    console.log("Searching BatchData for listings:", JSON.stringify(requestBody));

    const response = await fetch("https://api.batchdata.com/api/v1/property/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log("BatchData search response status:", response.status);
    console.log("BatchData search response (first 3000 chars):", responseText.substring(0, 3000));

    if (!response.ok) {
      return Response.json({
        error: `BatchData API error: ${response.status} ${response.statusText}`,
        details: responseText.substring(0, 500)
      }, { status: 502 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return Response.json({ error: 'Failed to parse BatchData response', raw: responseText.substring(0, 500) }, { status: 502 });
    }

    // Normalize results
    const properties = (data?.results || data?.properties || data?.data || []).map(p => ({
      street: p.address?.street || p.street_address || '',
      city: p.address?.city || p.city || city,
      state: p.address?.state || p.state || state,
      zip: p.address?.zip || p.zip_code || '',
      list_price: p.listing?.listPrice || p.list_price || '',
      list_date: p.listing?.listDate || p.list_date || '',
      days_on_market: p.listing?.daysOnMarket ?? p.days_on_market ?? '',
      beds: p.property?.bedrooms || p.bedrooms || '',
      baths: p.property?.bathrooms || p.bathrooms || '',
      sqft: p.property?.squareFeet || p.square_feet || '',
      property_type: p.property?.propertyType || p.property_type || '',
      owner_name: p.owner?.name || p.owner_name || '',
    }));

    return Response.json({
      success: true,
      count: properties.length,
      properties
    });

  } catch (error) {
    console.error("searchListingsForSkipTrace error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});