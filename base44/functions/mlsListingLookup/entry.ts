import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Admin tool: given a single MLS listing URL, pulls the listing details AND
// the listing agent's info straight off the public listing page — no manual
// typing required to build a ListingProspect record.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const { url } = await req.json();
    if (!url) return Response.json({ error: 'Missing url' }, { status: 400 });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Look up this MLS/real estate listing page and extract the listing details and the listing agent's contact info: ${url}\n\nIf a field isn't available, leave it blank/omit it. Do not guess a price, address, or contact info that isn't actually on the page.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          agent_name: { type: 'string' },
          agent_phone: { type: 'string' },
          agent_email: { type: 'string' },
          brokerage: { type: 'string' },
          city: { type: 'string' },
          listing_address: { type: 'string' },
          listing_value: { type: 'number' },
          bedrooms: { type: 'number' },
          bathrooms: { type: 'number' },
          sqft: { type: 'number' },
          photo_url: { type: 'string' },
          listing_description: { type: 'string' },
        },
      },
    });

    return Response.json({ success: true, listing: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}