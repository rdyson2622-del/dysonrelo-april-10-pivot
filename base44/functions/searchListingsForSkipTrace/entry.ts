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
  const livingArea = p.building?.livingAreaSquareFeet ?? p.listing?.livingArea ?? p.building?.totalBuildingAreaSquareFeet ?? p.property?.squareFeet ?? p.sqft ?? p.square_feet ?? '';
  const yearBuilt = p.building?.yearBuilt ?? p.listing?.yearBuilt ?? p.property?.yearBuilt ?? p.year_built ?? '';
  const apn = p.ids?.apn || p.apn || p.ids?.parcelNumber || '';

  const listPrice = p.listing?.price ?? p.listing?.listPrice ?? p.list_price ?? '';
  const estimatedValue = p.valuation?.estimatedValue ?? p.valuation?.price ?? '';
  const value = estimatedValue || listPrice || p.listing?.soldPrice || '';

  const status = p.listing?.status || p.listing?.statusCategory || (listPrice ? 'Active' : '');
  const listingNumber = p.listing?.listingNumber || p.listing?.mlsNumber || p.mls_number || '';
  const listingUrl = p.listing?.listingUrl || p.listing_url || '';
  const daysOnMarket = p.listing?.daysOnMarket ?? p.days_on_market ?? '';
  const propType = p.listing?.propertyType || p.general?.propertyTypeDetail || p.general?.propertyTypeCategory || p.property?.propertyType || '';

  return {
    street,
    city,
    state,
    zip,
    beds,
    baths,
    sqft: livingArea,
    livingArea,
    living_area: livingArea,
    yearBuilt,
    year_built: yearBuilt,
    apn,
    list_price: listPrice,
    estimatedValue,
    estimated_value: estimatedValue,
    value,
    status,
    days_on_market: daysOnMarket,
    daysOnMarket,
    property_type: propType,
    propertyType: propType,
    listing_number: listingNumber,
    listingNumber,
    mls_number: listingNumber,
    listing_url: listingUrl,
    listingUrl,
    listing: {
      status,
      price: listPrice,
      listingNumber,
      listingUrl,
      daysOnMarket,
      propertyType: propType,
      livingArea,
      yearBuilt
    },
    valuation: {
      estimatedValue,
      priceRangeMin: p.valuation?.priceRangeMin,
      priceRangeMax: p.valuation?.priceRangeMax
    },
    building: {
      livingArea,
      livingAreaSquareFeet: livingArea,
      yearBuilt,
      beds,
      bedroomCount: beds,
      baths,
      bathroomCount: baths
    },
    ids: {
      apn
    },
    address: {
      street,
      city,
      state,
      zip
    },
    raw: p
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

    const rawStreet = String(street || '').trim();
    // A street is only suitable for lookup/all-attributes if it begins with a street/house number
    const hasStreetNumber = /^\d+[\w-]*\s+/.test(rawStreet);
    const hasParsedAddress = Boolean(rawStreet && hasStreetNumber);
    const searchTarget = String(mls_number || query || address || rawStreet || `${city || ''} ${state || ''}`.trim()).trim();

    // Guard: never send empty requests to BatchData
    if (!hasParsedAddress && !searchTarget) {
      return Response.json({
        success: true,
        provider: "BatchData",
        count: 0,
        properties: [],
        listings: []
      });
    }

    let targetUrl = '';
    let requestBody = null;

    if (hasParsedAddress) {
      // 1. Parsed address with house number -> lookup/all-attributes
      targetUrl = "https://api.batchdata.com/api/v1/property/lookup/all-attributes";
      requestBody = {
        requests: [
          {
            address: {
              street: rawStreet,
              city: city ? String(city).trim() : '',
              state: state ? String(state).trim() : '',
              zip: zip ? String(zip).trim() : ''
            }
          }
        ]
      };
    } else {
      // 2. Street without number (e.g. "Candela Place"), MLS#, or query -> property/search
      targetUrl = "https://api.batchdata.com/api/v1/property/search";
      requestBody = {
        searchCriteria: {
          query: String(searchTarget || '').trim()
        },
        options: {
          skip: options?.skip || 0,
          take: options?.take || max_results || 10
        }
      };
    }

    let response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    let responseText = await response.text();
    let data = null;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }

    // Extract raw records: BatchData results is DICT { meta, properties: [...] }
    let rawResults = data?.results;
    let rawItems = Array.isArray(rawResults)
      ? rawResults
      : (rawResults?.properties || data?.properties || data?.data || []);

    // Fallback: if lookup/all-attributes returned 0 matches or was not ok, retry via property/search with searchTarget
    if ((!response.ok || rawItems.length === 0) && searchTarget) {
      const fallbackUrl = "https://api.batchdata.com/api/v1/property/search";
      const fallbackBody = {
        searchCriteria: {
          query: String(searchTarget || '').trim()
        },
        options: {
          skip: 0,
          take: options?.take || max_results || 5
        }
      };

      const fbResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BATCHDATA_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(fallbackBody)
      });

      if (fbResponse.ok) {
        const fbText = await fbResponse.text();
        try {
          const fbData = JSON.parse(fbText);
          const fbRawResults = fbData?.results;
          const fbItems = Array.isArray(fbRawResults)
            ? fbRawResults
            : (fbRawResults?.properties || fbData?.properties || fbData?.data || []);
          if (fbItems.length > 0) {
            targetUrl = fallbackUrl;
            rawItems = fbItems;
          }
        } catch {}
      }
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