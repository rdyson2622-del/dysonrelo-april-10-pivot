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

    console.log("API key length:", BATCHDATA_API_KEY.length);
    console.log("API key first 8 chars:", BATCHDATA_API_KEY.substring(0, 8));
    console.log("API key last 4 chars:", BATCHDATA_API_KEY.slice(-4));

    const { street, city, state, zip } = await req.json();

    if (!street || !city || !state) {
      return Response.json({ error: 'street, city, and state are required' }, { status: 400 });
    }

    const response = await fetch("https://api.batchdata.com/api/v1/property/skip-trace", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        requests: [{
          propertyAddress: {
            street: street,
            city: city,
            state: state,
            zip: zip || ''
          }
        }]
      })
    });

    const responseText = await response.text();
    console.log("BatchData response status:", response.status);
    console.log("BatchData response (first 2000 chars):", responseText.substring(0, 2000));

    if (response.status === 401) {
      return Response.json({
        error: 'BatchData API key is invalid or expired. Please update the BATCHDATA_API_KEY secret in your app settings.'
      }, { status: 502 });
    }

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
      return Response.json({ error: 'Failed to parse BatchData response', raw: responseText.substring(0, 500) }, { status: 502 });
    }

    const results = data?.results || data?.data || [];
    const result = results[0];

    if (!result) {
      return Response.json({ error: 'No results returned from BatchData for this address' }, { status: 404 });
    }

    // Extract owner info — handle various BatchData response structures
    const ownerData = result?.owner || result?.owners?.[0] || result?.person || result;
    const ownerName = ownerData?.name?.full
      || ownerData?.ownerName
      || ownerData?.fullName
      || [ownerData?.name?.first, ownerData?.name?.last].filter(Boolean).join(' ')
      || 'Unknown Owner';

    const phones = ownerData?.phones || ownerData?.phoneNumbers || result?.phones || [];
    const emails = ownerData?.emails || ownerData?.emailAddresses || result?.emails || [];

    return Response.json({
      success: true,
      property_address: `${street}, ${city}, ${state}${zip ? ' ' + zip : ''}`,
      city,
      state,
      owner_name: ownerName,
      phones: phones.map(p => ({
        number: p.number || p.phone || p,
        type: p.type || p.phoneType || null,
      })).filter(p => p.number),
      emails: emails.map(e => ({
        email: e.email || e.address || e,
      })).filter(e => e.email),
      raw_result: result  // pass full result for debugging
    });

  } catch (error) {
    console.error("skipTraceByAddress error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});