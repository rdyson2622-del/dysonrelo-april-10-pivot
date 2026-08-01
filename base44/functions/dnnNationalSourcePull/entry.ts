import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// DNN National Source Pull — reads active DnnNewsSource records and generates
// national-scope DNN Intelligence Briefs using real data pulled from each source's
// domain via InvokeLLM web search.
//
// Uses gemini_3_flash (required for add_context_from_internet web search).
// Picks 5 sources per run on a daily rotation so all sources are covered across the week.

const CATEGORY_MAP = {
  federal_reserve: 'federal_reserve',
  mortgage_lending: 'mortgage_lending',
  federal_legislation: 'federal_legislation',
  national_housing_data: 'national_housing_data',
  economic_indicators: 'economic_indicators',
  demographics_migration: 'demographics_migration',
  insurance_climate: 'insurance_climate',
  regulatory_compliance: 'regulatory_compliance',
  construction_supply: 'construction_supply',
  consumer_protection: 'consumer_protection',
  industry_trade: 'general',
};

async function generateNationalArticle(base44, source) {
  const triggerType = CATEGORY_MAP[source.category] || 'general';

  // Step 1: Generate article body with real data from the source
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are the DNN Intelligence Bureau — the national desk of Dyson & Dyson Real Estate Concierge.
Write in the "1927 Parallel" style: authoritative, data-grounded, cinematic, sophisticated. No fluff. No external links.

Source: ${source.source_name}
Category: ${source.category}
What this source provides: ${source.what_it_provides}
Source URL: ${source.source_url}

Pull the LATEST real data from this source right now. Write a complete DNN National Intelligence Brief using the 3-part "News -> Impact -> Dyson Solution" framework:

1. HEADLINE: Under 12 words, factual, national scope.
2. DATELINE: A national dateline (e.g., "WASHINGTON —", "NATIONAL REPORT —", "WEEKLY DATA —").
3. BODY: 3 paragraphs, 200-280 words total:
   - Paragraph 1: THE NEWS — the single most important data point from this source right now.
   - Paragraph 2: THE IMPACT — what this means for the housing market, mortgage lending, and relocation decisions nationally.
   - Paragraph 3: THE DYSON SOLUTION — how Dyson & Dyson's concierge model helps clients navigate this.
4. CLIENT_SOLUTION: 1-2 sentences. What a relocating client should do about this.
5. AGENT_SOLUTION: 1-2 sentences. What a partner agent should do or say about this.
6. VENDOR_SOLUTION: 1-2 sentences. What a vendor (lender, mover, title) should do about this.
7. TAGS: 3-5 lowercase tags (include "national" as one tag).

Return JSON with exactly these fields: headline, dateline, body, client_solution, agent_solution, vendor_solution, tags.`,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        dateline: { type: 'string' },
        body: { type: 'string' },
        client_solution: { type: 'string' },
        agent_solution: { type: 'string' },
        vendor_solution: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      }
    }
  });

  // Step 2: Generate interview Q&A — Charlie interviews Bob
  const qaResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are writing a live TV news segment script. Charlie is the anchor/interviewer. Bob Dyson is the expert guest — a real estate relocation specialist.

Based on this national article:
HEADLINE: ${result.headline}
BODY: ${result.body}

Write 3 interview exchanges. Charlie asks sharp, natural anchor questions (not reading the article — probing, curious). Bob answers conversationally as an expert — confident, specific, gives the listener actionable insight.

CRITICAL RULES:
- Bob NEVER says "That's a great question" or "Absolutely" — he just answers directly.
- Charlie never reads stats verbatim from the article — she reacts and asks follow-ups.
- PLAIN LANGUAGE: Write at an 8th-grade reading level. Short sentences (under 20 words). Everyday words a neighbor would understand — no jargon, no industry buzzwords, no "robust" or "paradigm" or "mitigate." If a smart 13-year-old wouldn't understand a word, don't use it.
- Keep each answer under 60 words. Natural spoken language only — no bullet points, no headers.
- Answers must sound like someone talking, not reading. Contractions, direct address.

Return JSON with exactly these fields: qa (array of {question, answer}).`,
    response_json_schema: {
      type: 'object',
      properties: {
        qa: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' }
            }
          }
        }
      }
    }
  });

  await base44.asServiceRole.entities.DnnArticle.create({
    headline: result.headline,
    dateline: result.dateline || 'NATIONAL REPORT —',
    body: result.body,
    tags: result.tags || ['national'],
    trigger_type: triggerType,
    scope: 'national',
    audience: source.audience || 'all',
    client_solution: result.client_solution || '',
    agent_solution: result.agent_solution || '',
    vendor_solution: result.vendor_solution || '',
    interview_qa: qaResult?.qa || [],
    status: 'published',
    generated_date: new Date().toISOString(),
    published_date: new Date().toISOString(),
  });

  // Update last_pulled_at on the source
  await base44.asServiceRole.entities.DnnNewsSource.update(source.id, {
    last_pulled_at: new Date().toISOString(),
  });

  return result.headline;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all active sources, sorted by display order
    const sources = await base44.asServiceRole.entities.DnnNewsSource.filter(
      { is_active: true },
      'display_order',
      50
    );

    if (!sources.length) {
      return Response.json({ error: 'No active sources found' }, { status: 404 });
    }

    // Pick 5 sources per run, rotating daily so all sources are covered across the week
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const startIdx = dayOfYear % sources.length;
    const selected = [];
    const count = Math.min(5, sources.length);
    for (let i = 0; i < count; i++) {
      selected.push(sources[(startIdx + i) % sources.length]);
    }

    const results = [];
    const errors = [];

    for (const source of selected) {
      try {
        const headline = await generateNationalArticle(base44, source);
        results.push({ source: source.source_name, category: source.category, headline });
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        errors.push({ source: source.source_name, error: err.message });
      }
    }

    return Response.json({
      success: true,
      sources_total: sources.length,
      sources_pulled: selected.length,
      generated: results.length,
      articles: results,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});