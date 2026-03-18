import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all active search profiles
    const searches = await base44.entities.PropertySearch.filter({ is_active: true });

    if (!searches.length) {
      return Response.json({ message: 'No active searches found', processed: 0 });
    }

    const results = [];

    for (const search of searches) {
      try {
        // Call Gemini to search for recent listings matching criteria
        const prompt = `Find recent property listings for the following criteria:
        
City: ${search.city}
State: ${search.state}
Price Range: $${search.min_price.toLocaleString()} - $${search.max_price.toLocaleString()}
Property Types: ${search.property_types?.join(', ') || 'Any'}
${search.communities?.length > 0 ? `Communities: ${search.communities.join(', ')}` : ''}

Search for listings from the last 24 hours. Return results as JSON with fields: 
- mls_id (if available)
- property_address
- city
- state
- zip
- price
- bedrooms
- bathrooms
- sqft
- list_agent_name
- list_agent_email
- list_agent_phone
- list_date
- property_url (if found online)

Return as JSON array only, no other text.`;

        const llmResponse = await base44.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
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
          const existing = await base44.entities.ListingImport.filter({
            mls_id: listing.mls_id || listing.property_address,
          });

          if (!existing.length) {
            // Create new listing record
            await base44.entities.ListingImport.create({
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
        await base44.entities.PropertySearch.update(search.id, {
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