import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BATCHDATA_API_KEY = Deno.env.get("BATCHDATA_API_KEY");

function normalizePropertyRecord(p) {
  if (!p || typeof p !== 'object') return null;

  const street = p.address?.street || p.street || p.street_address || '';
  const city = p.address?.city || p.city || '';
  const state = p.address?.state || p.state || '';
  const zip = p.address?.zip || p.zip || p.zip_code || '';

  const beds = p.building?.bedroomCount ?? p.property?.bedrooms ?? p.listing?.bedroomCount ?? p.beds ?? p.bedrooms ?? '';
  const baths = p.building?.bathroomCount ?? p.property?.bathrooms ?? p.listing?.bathroomCount ?? p.baths ?? p.bathrooms ?? '';
  const sqft = p.building?.livingAreaSquareFeet ?? p.building?.totalBuildingAreaSquareFeet ?? p.property?.squareFeet ?? p.listing?.livingArea ?? p.sqft ?? p.square_feet ?? '';
  const apn = p.ids?.apn || p.apn || '';

  const listPrice = p.listing?.price ?? p.listing?.listPrice ?? p.list_price ?? '';
  const value = p.valuation?.estimatedValue ?? p.valuation?.price ?? p.listing?.price ?? p.listing?.soldPrice ?? listPrice ?? '';

  const daysOnMarket = p.listing?.daysOnMarket ?? p.days_on_market ?? '';
  const propType = p.general?.propertyTypeDetail || p.general?.propertyTypeCategory || p.listing?.propertyType || p.property?.propertyType || '';

  return {
    street,
    city,
    state,
    zip,
    beds,
    baths,
    sqft,
    apn,
    list_price: listPrice,
    value,
    days_on_market: daysOnMarket,
    property_type: propType,
    mls_number: p.listing?.listingNumber || p.mls_number || ''
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    if (!BATCHDATA_API_KEY) {
      return Response.json({
        success: false,
        configured: false,
        provider: "BatchData",
        error: "BATCHDATA_API_KEY not configured in workspace settings.",
        properties: [],
        listings: []
      }, { status: 500 });
    }

    const payload = await req.json().catch(() => ({}));
    const { street, city, state, zip, mls_number, query, address, options, max_results } = payload;

    const hasParsedAddress = Boolean(street && String(street).trim().length > 0);
    const searchTarget = mls_number || query || address || (hasParsedAddress ? '' : `${city || ''} ${state || ''}`.trim());

    let targetUrl = '';
    let requestBody = null;

    if (hasParsedAddress) {
      // 1. Parsed address -> lookup/all-attributes
      targetUrl = "https://api.batchdata.com/api/v1/property/lookup/all-attributes";
      requestBody = {
        requests: [
          {
            address: {
              street: String(street).trim(),
              city: city ? String(city).trim() : '',
              state: state ? String(state).trim() : '',
              zip: zip ? String(zip).trim() : ''
            }
          }
        ]
      };
    } else {
      // 2. MLS# or unparsed/full street string -> property/search
      targetUrl = "https://api.batchdata.com/api/v1/property/search";
      requestBody = {
        searchCriteria: {
          query: String(searchTarget || '').trim()
        },
        options: {
          skip: options?.skip || 0,
          take: options?.take || max_results || 1
        }
      };
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();

    if (!response.ok) {
      return Response.json({
        success: false,
        provider: "BatchData",
        endpoint: targetUrl,
        error: `BatchData API error: ${response.status} ${response.statusText}`,
        details: responseText.substring(0, 500),
        count: 0,
        properties: [],
        listings: []
      }, { status: response.status >= 500 ? 502 : response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return Response.json({
        success: false,
        provider: "BatchData",
        error: 'Failed to parse BatchData JSON response',
        raw: responseText.substring(0, 500),
        count: 0,
        properties: [],
        listings: []
      }, { status: 502 });
    }

    // Extract raw records whether array or dictionary
    let rawItems = [];
    if (Array.isArray(data?.results?.properties)) {
      rawItems = data.results.properties;
    } else if (Array.isArray(data?.results)) {
      rawItems = data.results;
    } else if (Array.isArray(data?.properties)) {
      rawItems = data.properties;
    } else if (Array.isArray(data?.data)) {
      rawItems = data.data;
    } else if (data?.results && typeof data.results === 'object') {
      // Object dict of properties e.g. { "0": {...} }
      rawItems = Object.values(data.results).filter(v => v && typeof v === 'object' && !Array.isArray(v) && (v.address || v.building || v.ids));
    }

    const properties = rawItems.map(normalizePropertyRecord).filter(Boolean);

    return Response.json({
      success: true,
      provider: "BatchData",
      endpoint: targetUrl,
      count: properties.length,
      properties,
      listings: properties
    });

  } catch (error) {
    return Response.json({
      success: false,
      provider: "BatchData",
      error: error.message,
      count: 0,
      properties: [],
      listings: []
    }, { status: 500 });
  }
});