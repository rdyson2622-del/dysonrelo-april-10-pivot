import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generates a hyper-local relocation report for a given zip code
// Also handles subscriber capture (email + zip → DnnSubscriber)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { zip_code, email, full_name, action } = await req.json();

    // Action: "generate" = generate report for zip. "capture" = save subscriber.
    if (action === 'capture') {
      if (!email || !zip_code) return Response.json({ error: 'email and zip_code required' }, { status: 400 });

      // Check for duplicate
      const existing = await base44.asServiceRole.entities.DnnSubscriber.filter({ email });
      if (existing.length === 0) {
        await base44.asServiceRole.entities.DnnSubscriber.create({
          email,
          full_name: full_name || '',
          tier: 'tier1',
          source: `Zip Popup — ${zip_code}`,
          is_hot_lead: false,
          subscribed_at: new Date().toISOString(),
          notes: `Captured via Local Pulse popup. Zip: ${zip_code}`,
        });
      }
      return Response.json({ success: true, already_existed: existing.length > 0 });
    }

    // Action: "generate" (default) — generate the hyper-local report
    if (!zip_code) return Response.json({ error: 'zip_code required' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the DNN Intelligence Bureau — the research arm of Dyson & Dyson Real Estate Concierge. Write in the "1927 Parallel" style: authoritative, sophisticated, data-grounded, slightly cinematic. No fluff. No external source links.

Generate a 200-word "Hyper-Local Relocation Report" for ZIP code ${zip_code}. 

Include:
1. Current market snapshot for that ZIP/area (median prices, inventory trend, days on market)
2. Why people are moving OUT of that area (cost, taxes, lifestyle) OR into it
3. What relocation destination would be a natural parallel move from this zip code
4. One compelling data point a homeowner in that zip needs to know RIGHT NOW

Author: "DNN Intelligence Bureau" — no external links, no bylines.

Return JSON:
{
  "location_name": "City, State name of the zip",
  "report_title": "short punchy title under 10 words",
  "teaser": "first 50 words of the report (the free preview)",
  "full_report": "the complete 200-word report",
  "key_stat": "one punchy stat e.g. '$1.2M median, down 8% YoY'",
  "migration_direction": "outflow or inflow",
  "suggested_destination": "best relocation destination from this zip"
}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          location_name: { type: 'string' },
          report_title: { type: 'string' },
          teaser: { type: 'string' },
          full_report: { type: 'string' },
          key_stat: { type: 'string' },
          migration_direction: { type: 'string' },
          suggested_destination: { type: 'string' },
        }
      }
    });

    return Response.json({ success: true, report: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});