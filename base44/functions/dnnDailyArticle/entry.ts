import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs daily — generates a fresh real estate relocation intelligence article
// and saves it as "published" in DnnArticle so it appears on the consumer feed immediately.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const TRIGGER_TYPES = [
      'tax_policy',
      'housing_market',
      'job_market',
      'interest_rates',
      'migration_data',
      'employer_news',
    ];

    // Pick a random trigger type so content varies daily
    const trigger_type = TRIGGER_TYPES[Math.floor(Math.random() * TRIGGER_TYPES.length)];

    const topicMap = {
      tax_policy: 'state and local tax policy changes affecting homeowners and relocating families',
      housing_market: 'current housing market conditions, inventory levels, and price trends in top relocation markets',
      job_market: 'major employer moves, remote work trends, and job market shifts driving relocation decisions',
      interest_rates: 'mortgage rate movements and Federal Reserve policy impact on home buying decisions',
      migration_data: 'latest interstate migration data, population flows, and top cities gaining and losing residents',
      employer_news: 'major corporate relocations, office expansions, and employer moves triggering housing demand',
    };

    const topic = topicMap[trigger_type];

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the DNN Intelligence Bureau — the editorial voice of Dyson & Dyson Real Estate Concierge. Write in the "1927 Parallel" style: authoritative, data-grounded, cinematic, and sophisticated. No fluff. No filler. No external links.

Today's topic: ${topic}

Write a complete DNN Intelligence Brief with the following structure:

1. HEADLINE: Short, punchy, under 12 words. No clickbait. Factual and specific.
2. DATELINE: City of origin in caps followed by em dash (e.g. "SAN FRANCISCO —")
3. BODY: 3–4 paragraphs. First paragraph opens with the single most important data point. Subsequent paragraphs provide context, relocation implications, and what this means for someone considering a move. Final paragraph ends with a forward-looking insight. Total: 250–350 words.
4. TAGS: 3–5 lowercase topic tags relevant to the article (e.g. "austin", "mortgage-rates", "california-exodus")

Return JSON:
{
  "headline": "...",
  "dateline": "CITY NAME —",
  "body": "full article body paragraphs separated by newlines",
  "tags": ["tag1", "tag2", "tag3"]
}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          dateline: { type: 'string' },
          body: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        }
      }
    });

    // Save as published immediately
    const article = await base44.asServiceRole.entities.DnnArticle.create({
      headline: result.headline,
      dateline: result.dateline,
      body: result.body,
      tags: result.tags || [],
      trigger_type,
      status: 'published',
      generated_date: new Date().toISOString(),
      published_date: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      article_id: article.id,
      headline: result.headline,
      trigger_type,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});