import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnPipelineDailyVideoPull
 *
 * Machine-to-machine endpoint for n8n's 6AM NEWS flow. Generates one national
 * real estate news story + DNN video script package, creates a staged DnnArticle
 * (approved for render), and returns the package for external rendering.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Request body (from n8n):
 *   { runId, source, placement, section, timezone, target_live_time_local,
 *     render_profile, limit }
 *
 * Response:
 *   { article: { articleId, headline, dateline, body, opening_script, bob_script,
 *                closing_script, wall_board_bullets, tags, trigger_type,
 *                placement, target_live_time_local, timezone } }
 */

const VALID_TRIGGERS = [
  'tax_policy', 'housing_market', 'job_market', 'interest_rates', 'migration_data',
  'employer_news', 'general', 'federal_reserve', 'mortgage_lending', 'federal_legislation',
  'national_housing_data', 'economic_indicators', 'demographics_migration', 'insurance_climate',
  'regulatory_compliance', 'construction_supply', 'consumer_protection',
];

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // 1. Shared-secret auth
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const body = await req.json().catch(() => ({}));
    const placement = body?.placement || 'news';
    const section = body?.section || 'news';
    const timezone = body?.timezone || 'America/Los_Angeles';
    const targetLiveTime = body?.target_live_time_local || '06:00';

    const base44 = createClientFromRequest(req);

    // 3. Generate national real estate news + DNN script package (fresh web data)
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the DNN Intelligence Bureau — the national desk of Dyson & Dyson Real Estate Concierge.
Write a national real estate news brief and a DNN video script package for the 6AM morning show.

TONE: authoritative, data-grounded, calm, expert. No fluff. No clickbait. No "that's a great question."

PULL the latest national real estate news right now (housing market, mortgage rates, Fed moves, inventory, migration). Pick ONE story that matters most to buyers, sellers, homeowners, and relocating families today.

Produce a complete package:

1. HEADLINE: under 12 words, factual, national scope.
2. DATELINE: "NATIONAL —"
3. BODY: 3 paragraphs, 200-280 words. Paragraph 1 = the news. Paragraph 2 = the impact on housing/mortgages/relocation. Paragraph 3 = what it means practically.
4. OPENING_SCRIPT: spoken by Ruben/Charlie (the host). 20-35 seconds (~50-90 words). Introduce the headline, mention this is DNN Real Estate News, toss to Bob/Dyson for analysis. Natural spoken language.
5. BOB_SCRIPT: spoken by Bob/Dyson (the real estate expert). 45-75 seconds (~120-200 words). Explain what the news means for buyers, sellers, homeowners, or relocating families. Practical, calm, expert. No fake statistics unless sourced from the current news. No "that's a great question." No "absolutely." Direct, conversational.
6. CLOSING_SCRIPT: spoken by Ruben/Charlie. 15-25 seconds (~35-65 words). Summarize the takeaway, invite viewers to follow/subscribe/check back for more DNN Real Estate News.
7. WALL_BOARD_BULLETS: exactly 3 short bullets for a video wall graphic. Each under 90 characters. Factual, punchy.
8. TAGS: 3-5 lowercase tags (include "housing_market" and "national_real_estate").
9. TRIGGER_TYPE: one of: ${VALID_TRIGGERS.join(', ')}

Return JSON with exactly these fields: headline, dateline, body, opening_script, bob_script, closing_script, wall_board_bullets, tags, trigger_type.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          dateline: { type: 'string' },
          body: { type: 'string' },
          opening_script: { type: 'string' },
          bob_script: { type: 'string' },
          closing_script: { type: 'string' },
          wall_board_bullets: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          trigger_type: { type: 'string' },
        },
      },
    });

    if (!result || !result.headline || !result.body) {
      return Response.json({ error: 'AI did not return a valid script package' }, { status: 502 });
    }

    // 4. Normalize trigger_type
    let triggerType = result.trigger_type;
    if (!VALID_TRIGGERS.includes(triggerType)) triggerType = 'housing_market';

    // 5. Normalize bullets to exactly 3
    const bullets = Array.isArray(result.wall_board_bullets)
      ? result.wall_board_bullets.slice(0, 3)
      : [];

    const tags = Array.isArray(result.tags) && result.tags.length
      ? result.tags
      : ['housing_market', 'national_real_estate'];

    const nowIso = new Date().toISOString();

    // 6. Create the DnnArticle (staged, approved for render)
    const created = await base44.asServiceRole.entities.DnnArticle.create({
      headline: result.headline,
      dateline: result.dateline || 'NATIONAL —',
      body: result.body,
      tags,
      trigger_type: triggerType,
      scope: 'national',
      audience: 'all',
      status: 'staged',
      production_status: 'approved_for_render',
      render_requested: true,
      admin_approved: true,
      generated_date: nowIso,
      placement,
      section,
      target_live_time_local: targetLiveTime,
      timezone,
      generated_opening_script: result.opening_script,
      generated_body_script: result.bob_script,
      generated_closing_script: result.closing_script,
      generated_full_script: `${result.opening_script}\n\n${result.bob_script}\n\n${result.closing_script}`,
    });

    // 7. Return the package to n8n
    return Response.json({
      article: {
        articleId: created.id,
        headline: result.headline,
        dateline: result.dateline || 'NATIONAL —',
        body: result.body,
        opening_script: result.opening_script,
        bob_script: result.bob_script,
        closing_script: result.closing_script,
        wall_board_bullets: bullets,
        tags,
        trigger_type: triggerType,
        placement,
        target_live_time_local: targetLiveTime,
        timezone,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});