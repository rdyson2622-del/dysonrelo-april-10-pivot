import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Support running a single search by ID, or all active searches
    const body = await req.json().catch(() => ({}));
    const { search_id } = body;

    let searches;
    if (search_id) {
      const single = await base44.asServiceRole.entities.PropertySearch.get(search_id);
      searches = single ? [single] : [];
    } else {
      searches = await base44.asServiceRole.entities.PropertySearch.filter({ is_active: true });
    }

    if (!searches.length) {
      return Response.json({ message: 'No active searches found', processed: 0 });
    }

    const results = [];

    for (const search of searches) {
      try {
        // Search Zillow/Realtor/Redfin via web for real listings
        const today = new Date().toISOString().split('T')[0];
        const communityStr = search.communities?.length > 0 ? search.communities.join(', ') : search.city;
        const propTypes = search.property_types?.join(', ') || 'single family home';

        const prompt = `Search Zillow.com, Redfin.com, and Realtor.com RIGHT NOW for active real estate listings matching these criteria:

Location: ${communityStr}, ${search.city}, ${search.state}
Price Range: $${search.min_price.toLocaleString()} to $${search.max_price.toLocaleString()}
Property Type: ${propTypes}

Go to Zillow.com and search for homes for sale in ${search.city} ${search.state} between $${search.min_price.toLocaleString()} and $${search.max_price.toLocaleString()}. 
Return at least 10 real, currently active listings with real street addresses that exist in ${search.city}, ${search.state}.
Use real MLS listing data from Zillow, Redfin, or Realtor.com.
Each listing must have a real street address, realistic price, beds/baths/sqft for the area.
List date should be recent (within last 30 days from ${today}).

IMPORTANT: Return REAL listings with accurate addresses, not made up ones. Look them up on Zillow.`;

        const llmResponse = await base44.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          model: 'gemini_3_flash',
          response_json_schema: {
            type: 'object',
            properties: {
              listings: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    mls_id: { type: 'string' },
                    property_address: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    zip: { type: 'string' },
                    price: { type: 'number' },
                    bedrooms: { type: 'number' },
                    bathrooms: { type: 'number' },
                    sqft: { type: 'number' },
                    list_agent_name: { type: 'string' },
                    list_agent_email: { type: 'string' },
                    list_agent_phone: { type: 'string' },
                    list_date: { type: 'string' },
                    property_url: { type: 'string' },
                  },
                },
              },
            },
          },
        });

        const listings = llmResponse.listings || [];

        // Store or update listings in database
        for (const listing of listings) {
          // Check if listing already exists
          const existing = await base44.asServiceRole.entities.ListingImport.filter({
            mls_id: listing.mls_id || listing.property_address,
          });

          if (!existing.length) {
            // Create new listing record
            await base44.asServiceRole.entities.ListingImport.create({
              mls_id: listing.mls_id || '',
              property_address: listing.property_address,
              city: listing.city,
              state: listing.state,
              zip: listing.zip || '',
              price: listing.price,
              bedrooms: listing.bedrooms || 0,
              bathrooms: listing.bathrooms || 0,
              sqft: listing.sqft || 0,
              list_agent_name: listing.list_agent_name || '',
              list_agent_email: listing.list_agent_email || '',
              list_agent_phone: listing.list_agent_phone || '',
              list_date: listing.list_date || new Date().toISOString().split('T')[0],
              source: 'automated_search',
              status: 'active',
            });
          }
        }

        // Update search last_run_date
        await base44.asServiceRole.entities.PropertySearch.update(search.id, {
          last_run_date: new Date().toISOString(),
        });

        results.push({
          search_name: search.search_name,
          city: search.city,
          state: search.state,
          listings_found: listings.length,
          status: 'success',
        });
      } catch (error) {
        results.push({
          search_name: search.search_name,
          city: search.city,
          state: search.state,
          status: 'error',
          error: error.message,
        });
      }
    }

    return Response.json({
      message: 'Daily property search completed',
      searches_processed: searches.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});