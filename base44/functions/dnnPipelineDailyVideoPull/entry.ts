import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnPipelineDailyVideoPull
 *
 * Machine-to-machine endpoint for n8n's 6AM NEWS flow. Creates a staged DnnArticle
 * (approved for render) and returns the DNN video script package for external rendering.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * TWO MODES:
 *
 *  1. Source-provided mode (preferred): n8n sends `source_articles` (ranked, deduped).
 *     Base44 uses source_articles[0] as the primary source and the rest for context.
 *     It does NOT web-search for a different story and only uses numbers present in the
 *     provided material.
 *
 *  2. AI-search fallback mode: only when n8n sends no source_articles. Base44 uses Gemini
 *     web search to find a reputable national real estate story. Returns an error if no
 *     reliable source is found.
 *
 * Response:
 *   { article: { articleId, headline, dateline, body, opening_script, bob_script,
 *                closing_script, wall_board_bullets, tags, trigger_type,
 *                placement, target_live_time_local, timezone, source_url, source_name } }
 */

const VALID_TRIGGERS = [
  'tax_policy', 'housing_market', 'job_market', 'interest_rates', 'migration_data',
  'employer_news', 'general', 'federal_reserve', 'mortgage_lending', 'federal_legislation',
  'national_housing_data', 'economic_indicators', 'demographics_migration', 'insurance_climate',
  'regulatory_compliance', 'construction_supply', 'consumer_protection',
];

const PACKAGE_INSTRUCTIONS = `Produce a complete package:

1. HEADLINE: under 12 words, factual, national scope.
2. DATELINE: "NATIONAL —"
3. BODY: 3 paragraphs, 200-280 words. Paragraph 1 = the news. Paragraph 2 = the impact on housing/mortgages/relocation. Paragraph 3 = what it means practically.
4. OPENING_SCRIPT: spoken by Ruben/Charlie (the host). 20-35 seconds (~50-90 words). Introduce the headline, mention this is DNN Real Estate News, toss to Bob/Dyson for analysis. Natural spoken language.
5. BOB_SCRIPT: spoken by Bob/Dyson (the real estate expert). 45-75 seconds (~120-200 words). Explain what the news means for buyers, sellers, homeowners, or relocating families. PLAIN LANGUAGE RULES — CRITICAL: Write at an 8th-grade reading level. Use short sentences (under 20 words each). Use everyday words a neighbor would understand — no jargon, no industry buzzwords, no academic phrasing, no "robust" or "paradigm" or "mitigate" or "leverage." If a smart 13-year-old wouldn't understand a word, don't use it. Structure: "Here's what happened → Here's what it means for you → Here's what you can do." Be practical, calm, direct. No "that's a great question." No "absolutely." Do not invent statistics — only use numbers present in the provided source material.
6. CLOSING_SCRIPT: spoken by Ruben/Charlie. 15-25 seconds (~35-65 words). Summarize the takeaway, invite viewers to follow/subscribe/check back for more DNN Real Estate News.
7. WALL_BOARD_BULLETS: exactly 3 short bullets for a video wall graphic. Each under 90 characters. Factual, punchy.
8. TAGS: 3-5 lowercase tags (include "housing_market" and "national_real_estate").
9. TRIGGER_TYPE: one of: ${VALID_TRIGGERS.join(', ')}

FORMATTING RULE — CRITICAL: Never use em-dashes (—), en-dashes (–), smart quotes, or bullet characters in any spoken script text (opening_script, bob_script, closing_script). Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

Return JSON with exactly these fields: headline, dateline, body, opening_script, bob_script, closing_script, wall_board_bullets, tags, trigger_type.`;

function formatSourceBlock(src, label) {
  const parts = [`${label}:`];
  if (src.title) parts.push(`Title: ${src.title}`);
  if (src.source_name) parts.push(`Source: ${src.source_name}`);
  if (src.url) parts.push(`URL: ${src.url}`);
  if (src.published_at) parts.push(`Published: ${src.published_at}`);
  if (src.summary) parts.push(`Summary: ${src.summary}`);
  if (src.content_text) parts.push(`Content: ${src.content_text}`);
  return parts.join('\n');
}

async function generatePackageFromSources(base44, sourceArticles) {
  const primary = sourceArticles[0];
  const context = sourceArticles.slice(1);
  const contextBlock = context.length
    ? `\n\nCONTEXT SOURCES (corroboration only — do not introduce new statistics):\n${context.map((s, i) => formatSourceBlock(s, `Source ${i + 2}`).replace(/^Source \d+:$/m, `— ${s.source_name || s.title || ''}`)).join('\n\n')}`
    : '';

  return await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are the DNN Intelligence Bureau — the national desk of Dyson & Dyson Real Estate Concierge.
Write a DNN video script package for the 6AM morning show based ONLY on the source material provided below.

CRITICAL RULES:
- Do NOT search the web for a different story.
- Do NOT invent statistics. Only use numbers explicitly present in the provided source material.
- Stay faithful to the primary source. Use context sources only to corroborate.

PRIMARY SOURCE:
${formatSourceBlock(primary, 'Primary')}

${contextBlock}

${PACKAGE_INSTRUCTIONS}`,
    // No web search — n8n is the source-of-truth.
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
}

async function generatePackageFromWebSearch(base44) {
  return await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are the DNN Intelligence Bureau — the national desk of Dyson & Dyson Real Estate Concierge.
No source material was provided, so you may search the web for a reputable national real estate story for the 6AM morning show.

TONE: authoritative, data-grounded, calm, expert. No fluff. No clickbait. No "that's a great question."

PREFER reputable sources: NAR, Realtor.com Research, Redfin Data Center, Zillow Research, Freddie Mac PMMS, Fannie Mae, Census/HUD, Mortgage News Daily, AP, Reuters, CNBC, MarketWatch, Yahoo Finance. Avoid clickbait.

Pull the latest national real estate news right now (housing market, mortgage rates, Fed moves, inventory, migration). Pick ONE story that matters most to buyers, sellers, homeowners, and relocating families today. Only use real numbers from the sources you find — do not invent statistics. If you cannot find a reliable source, return empty fields.

${PACKAGE_INSTRUCTIONS}`,
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
        source_url: { type: 'string' },
        source_name: { type: 'string' },
      },
    },
  });
}

import { blockIfN8n } from '../../shared/n8nGuard.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
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
    const sourceArticles = Array.isArray(body?.source_articles) ? body.source_articles : [];
    const hasSources = sourceArticles.length > 0 && sourceArticles[0]?.title;

    const base44 = createClientFromRequest(req);

    // 3. Generate the script package (source-provided mode preferred)
    let result;
    let primarySource = null;

    if (hasSources) {
      primarySource = sourceArticles[0];
      result = await generatePackageFromSources(base44, sourceArticles);
    } else {
      result = await generatePackageFromWebSearch(base44);
      // Fallback must return an error if no reliable source was found
      if (!result || !result.headline || !result.body) {
        return Response.json({ error: 'No reliable national real estate source found via web search' }, { status: 502 });
      }
      // If the web-search model surfaced a source_url/source_name, capture it
      if (result.source_url || result.source_name) {
        primarySource = {
          url: result.source_url || '',
          source_name: result.source_name || '',
          published_at: '',
          summary: '',
        };
      }
    }

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

    // 6. Build optional source fields (from the primary source when available)
    const sourceFields = {};
    if (primarySource) {
      if (primarySource.url) sourceFields.source_url = primarySource.url;
      if (primarySource.source_name) sourceFields.source_name = primarySource.source_name;
      if (primarySource.published_at) sourceFields.source_published_at = primarySource.published_at;
      if (primarySource.summary) sourceFields.source_summary = primarySource.summary;
    }

    // 7. Create the DnnArticle (staged, approved for render)
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
      ...sourceFields,
    });

    // 8. Return the package to n8n
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
        source_url: sourceFields.source_url || null,
        source_name: sourceFields.source_name || null,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});