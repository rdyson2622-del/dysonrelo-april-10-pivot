import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs daily — generates 10 localized DNN Intelligence Briefs across different markets & topics
// Each article is auto-published immediately to the consumer feed.

const MARKETS = [
  { city: 'Austin', state: 'TX', dateline: 'AUSTIN —' },
  { city: 'Nashville', state: 'TN', dateline: 'NASHVILLE —' },
  { city: 'Phoenix', state: 'AZ', dateline: 'PHOENIX —' },
  { city: 'Denver', state: 'CO', dateline: 'DENVER —' },
  { city: 'Tampa', state: 'FL', dateline: 'TAMPA —' },
  { city: 'Charlotte', state: 'NC', dateline: 'CHARLOTTE —' },
  { city: 'Dallas', state: 'TX', dateline: 'DALLAS —' },
  { city: 'Boise', state: 'ID', dateline: 'BOISE —' },
  { city: 'Raleigh', state: 'NC', dateline: 'RALEIGH —' },
  { city: 'San Francisco', state: 'CA', dateline: 'SAN FRANCISCO —' },
  { city: 'Los Angeles', state: 'CA', dateline: 'LOS ANGELES —' },
  { city: 'Chicago', state: 'IL', dateline: 'CHICAGO —' },
  { city: 'Seattle', state: 'WA', dateline: 'SEATTLE —' },
  { city: 'Miami', state: 'FL', dateline: 'MIAMI —' },
  { city: 'Atlanta', state: 'GA', dateline: 'ATLANTA —' },
  { city: 'San Diego', state: 'CA', dateline: 'SAN DIEGO —' },
];

const TRIGGER_TYPES = [
  'tax_policy',
  'housing_market',
  'job_market',
  'interest_rates',
  'migration_data',
  'employer_news',
];

const TOPIC_MAP = {
  tax_policy: 'state and local tax policy changes affecting homeowners and relocating families',
  housing_market: 'current housing market conditions, inventory levels, and price trends',
  job_market: 'major employer moves, remote work trends, and job market shifts driving relocation',
  interest_rates: 'mortgage rate movements and Federal Reserve policy impact on home buying',
  migration_data: 'latest interstate migration data, population flows, and demographic shifts',
  employer_news: 'major corporate relocations, office expansions, and employer moves triggering housing demand',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function generateArticle(base44, market, trigger_type) {
  const topic = TOPIC_MAP[trigger_type];

  // Step 1: Generate article body
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are the DNN Intelligence Bureau — the editorial voice of Dyson & Dyson Real Estate Concierge. Write in the "1927 Parallel" style: authoritative, data-grounded, cinematic, sophisticated. No fluff. No external links.

Market focus: ${market.city}, ${market.state}
Topic: ${topic}

Write a complete DNN Intelligence Brief:

1. HEADLINE: Under 12 words, factual and specific to ${market.city}.
2. BODY: 3 paragraphs. Open with the single most important local data point for ${market.city}. Give relocation context and implications for someone considering moving to or from ${market.city}. End with a forward-looking insight. Total: 200–280 words.
3. TAGS: 3–5 lowercase tags (include the city name as one tag).

Return JSON:
{
  "headline": "...",
  "body": "full article body with paragraphs separated by newlines",
  "tags": ["tag1", "tag2", "tag3"]
}`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        body: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      }
    }
  });

  // Step 2: Generate interview Q&A from the article — Charlie interviews Bob
  const qaResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are writing a live TV news segment script. Charlie is the anchor/interviewer. Bob Dyson is the expert guest — a real estate relocation specialist.

Based on this article:
HEADLINE: ${result.headline}
BODY: ${result.body}

Write 3 interview exchanges. Charlie asks sharp, natural anchor questions (not reading the article — probing, curious). Bob answers conversationally as an expert — confident, specific, gives the listener actionable insight. 

CRITICAL RULES:
- Bob NEVER says things like "That's a great question" or "Absolutely" — he just answers directly.
- Charlie never reads stats verbatim from the article — she reacts and asks follow-ups.
- Keep each answer under 60 words. Natural spoken language only — no bullet points, no headers.
- Answers must sound like someone talking, not reading. Contractions, direct address ("if you're moving to ${market.city}..."), real specifics.

Return JSON:
{
  "qa": [
    { "question": "Charlie's question", "answer": "Bob's answer" },
    { "question": "Charlie's question", "answer": "Bob's answer" },
    { "question": "Charlie's question", "answer": "Bob's answer" }
  ]
}`,
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
    dateline: market.dateline,
    body: result.body,
    tags: result.tags || [market.city.toLowerCase()],
    trigger_type,
    interview_qa: qaResult?.qa || [],
    status: 'published',
    generated_date: new Date().toISOString(),
    published_date: new Date().toISOString(),
  });

  return result.headline;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Pick 10 unique markets and pair each with a trigger type
    const markets = shuffle(MARKETS).slice(0, 10);
    const triggers = shuffle(TRIGGER_TYPES);

    const results = [];
    const errors = [];

    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      const trigger_type = triggers[i % triggers.length];
      try {
        const headline = await generateArticle(base44, market, trigger_type);
        results.push({ market: market.city, trigger_type, headline });
        // Small delay between calls to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        errors.push({ market: market.city, error: err.message });
      }
    }

    return Response.json({
      success: true,
      generated: results.length,
      articles: results,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});