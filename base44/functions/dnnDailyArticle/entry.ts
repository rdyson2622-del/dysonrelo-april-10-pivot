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
3. CLIENT_SOLUTION: 1-2 sentences. What a relocating client should do about this.
4. AGENT_SOLUTION: 1-2 sentences. What a partner agent should do or say about this.
5. VENDOR_SOLUTION: 1-2 sentences. What a vendor (lender, mover, title) should do about this.
6. TAGS: 3–5 lowercase tags (include the city name as one tag).

FORMATTING RULE — CRITICAL: Never use em-dashes (—), en-dashes (–), smart quotes, or bullet characters in any text. Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

Return JSON:
{
  "headline": "...",
  "body": "full article body with paragraphs separated by newlines",
  "client_solution": "...",
  "agent_solution": "...",
  "vendor_solution": "...",
  "tags": ["tag1", "tag2", "tag3"]
}`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        body: { type: 'string' },
        client_solution: { type: 'string' },
        agent_solution: { type: 'string' },
        vendor_solution: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      }
    }
  });

  // Step 2: Generate interview Q&A from the article — Charlie interviews Bob (tag-team banter style)
  const qaResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are writing a LIVE tag-team TV news segment script for DNN — Dyson News Network. This is a real broadcast desk, not a reading of an article.

CHARLIE is the anchor — sharp, quick, slightly wry. She thinks on her feet, reacts to Bob's answers, and occasionally lands a light quip. She never reads stats verbatim — she interprets and probes.

BOB DYSON is the expert — warm, seasoned, 55 years in the business. He answers directly with real specifics, but he's got a dry wit. He might use a relatable analogy or a gentle one-liner that makes you smile, not laugh out loud. He never says "That's a great question" or "Absolutely" — he just talks.

CRITICAL TONE RULE FOR BOB: Bob NEVER talks down to the listener or gives directives like "you need to" or "you should" or "do this, don't do that." Instead, Bob frames his expertise as suggestions and shared experience. He uses phrases like "I'd suggest considering..." or "Many of our clients have found..." or "One approach that's worked well..." or "You might think about..." He speaks WITH the viewer, not AT them — like a trusted advisor sharing perspective, not an instructor giving orders. He respects that the viewer may have their own knowledge and situation, so he offers options and considerations rather than directives.

Based on this article:
HEADLINE: ${result.headline}
BODY: ${result.body}

Write 3 exchanges that feel like a real back-and-forth between two people who know each other and enjoy working together.

CRITICAL RULES:
- Each question and answer must include NATURAL HANDOFF language. Charlie tosses to Bob naturally ("Bob, you've been watching this market — what's the real story?"). Bob throws it back ("Back to you, Charlie" or "Charlie, here's what I'd watch...").
- Include a REACTION in at least one exchange — Charlie reacting to something Bob said before asking the next question, or Bob reacting to Charlie's framing ("Well, you're not wrong about that, but...").
- Include LIGHT HUMOR in roughly 1 of the 3 exchanges — a wry observation, a relatable analogy, or a gentle quip. Keep it natural and professional — never corny, never forced. Think dry wit, not jokes.
- PLAIN LANGUAGE: Write at an 8th-grade reading level. Short sentences (under 20 words). Everyday words a neighbor would understand — no jargon, no industry buzzwords, no "robust" or "paradigm" or "mitigate" or "leverage." If a smart 13-year-old wouldn't understand a word, don't use it. Bob explains things simply, like talking to a friend, not a textbook.
- Keep each answer under 65 words. Natural spoken language only — no bullet points, no headers, no "in conclusion."
- Use contractions, direct address ("if you're moving to ${market.city}..."), and real specifics from the article data.
- The segment should sound like two pros who genuinely like each other, not two people reading a script.

FORMATTING RULE — CRITICAL: Never use em-dashes (—), en-dashes (–), smart quotes, or bullet characters in any question or answer text. Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

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
    client_solution: result.client_solution || '',
    agent_solution: result.agent_solution || '',
    vendor_solution: result.vendor_solution || '',
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