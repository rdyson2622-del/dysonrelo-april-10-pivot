import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnCreateNationalArticle — takes ONE picked national headline (from the
 * "3 choices" picker) and generates the full DNN article: body, interview
 * Q&A, and the three broadcast scene scripts (opening/body/closing).
 *
 * Creates a real DnnArticle with production_status "pending_review" so it
 * enters the SAME edit/approve/render pipeline as every other article
 * (Shard1ScriptReviewCard -> Approve for Render -> real HeyGen render).
 * This is never a "practice" render — approving it dispatches the real show.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const { headline, dateline, summary } = await req.json();
    if (!headline) {
      return Response.json({ error: 'headline is required' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the DNN Intelligence Bureau — the national desk of Dyson & Dyson Real Estate Concierge.
Write in the "1927 Parallel" style: authoritative, data-grounded, cinematic, sophisticated. No fluff. No external links.

This is a NATIONAL story only — never a single-city/regional story. Confirm and expand on this headline using real current data:
HEADLINE: ${headline}
DATELINE: ${dateline || ''}
SUMMARY: ${summary || ''}

Write a complete DNN National Intelligence Brief using the 3-part "News -> Impact -> Dyson Solution" framework:
1. HEADLINE: Under 12 words, factual, national scope.
2. DATELINE: A national dateline (e.g., "WASHINGTON —", "NATIONAL REPORT —", "WEEKLY DATA —").
3. BODY: 3 paragraphs, 200-280 words total:
   - Paragraph 1: THE NEWS — the single most important national data point.
   - Paragraph 2: THE IMPACT — what this means for the housing market, mortgage lending, and relocation decisions nationally.
   - Paragraph 3: THE DYSON SOLUTION — how Dyson & Dyson's concierge model helps clients navigate this.
4. CLIENT_SOLUTION: 1-2 sentences. What a relocating client should do about this.
5. AGENT_SOLUTION: 1-2 sentences. What a partner agent should do or say about this.
6. VENDOR_SOLUTION: 1-2 sentences. What a vendor (lender, mover, title) should do about this.
7. TAGS: 3-5 lowercase tags (include "national" as one tag).

FORMATTING RULE — CRITICAL: Never use em-dashes (—), en-dashes (–), smart quotes, or bullet characters in any text. Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

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
        },
      },
    });

    const qaResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are writing a live TV news segment script. Charlie is the anchor/interviewer. Bob Dyson is the expert guest — a real estate relocation specialist.

Based on this national article:
HEADLINE: ${result.headline}
BODY: ${result.body}

Write 3 interview exchanges. Charlie asks sharp, natural anchor questions (not reading the article — probing, curious). Bob answers conversationally as an expert — confident, specific, gives the listener actionable insight.

THE CLONE BIT (recurring daily hook — viewers look forward to this):
Charlie and Bob are AI clones of the real Charlie Simmons and the real Bob Dyson. The show leans into this in a fun, self-aware way. Charlie is the "straight man clone" — dry, precise, occasionally deadpans about being the AI version. Bob's clone is warm and wry, and sometimes references the real Bob ("The real Bob would say this better, but his clone will give it a shot"). About ONE exchange per segment can include a light clone meta-moment. Never forced, never every exchange.

CRITICAL RULES:
- Bob NEVER says "That's a great question" or "Absolutely" — he just answers directly.
- Charlie never reads stats verbatim from the article — she reacts and asks follow-ups.
- PLAIN LANGUAGE: 8th-grade reading level. Short sentences (under 20 words). Everyday words.
- Keep each answer under 60 words. Natural spoken language only.

FORMATTING RULE — CRITICAL: Never use em-dashes, en-dashes, smart quotes, or bullet characters. Only plain commas, periods, straight quotes. HeyGen goes SILENT on em-dashes or smart punctuation.

Return JSON with exactly these fields: qa (array of {question, answer}).`,
      response_json_schema: {
        type: 'object',
        properties: {
          qa: {
            type: 'array',
            items: {
              type: 'object',
              properties: { question: { type: 'string' }, answer: { type: 'string' } },
            },
          },
        },
      },
    });

    const sceneResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are writing a 3-scene DNN broadcast script for a single news story.
Charlie Simmons is the anchor (opens and closes). Bob Dyson is the expert (delivers the news story).

Based on this national article:
HEADLINE: ${result.headline}
DATELINE: ${result.dateline}
BODY: ${result.body}

Write three scripts:

SCENE 1 — OPENING (Charlie, 60-80 words):
Charlie opens the show. DNN-branded, cinematic, sets up the story. Greet viewers, tease the headline, hand off to Bob. Include the clone bit lightly — Charlie can deadpan one line about being the AI clone of the real Charlie.

SCENE 2 — NEWS STORY (Bob, 120-160 words):
Bob delivers the story conversationally, as if talking to Charlie and the viewer. Plain spoken, warm, expert but not stiff. Include one light clone meta-moment. End by tossing back to Charlie.

SCENE 3 — CLOSING (Charlie, 40-60 words):
Charlie closes the show. Dyson and Dyson branded outro. Thank Bob, sign off, tease tomorrow. One light clone beat if it fits naturally.

ALSO: LOWER_THIRD — a short chyron text for this story (under 40 chars).

CRITICAL RULES:
- PLAIN LANGUAGE: 8th-grade reading level. Short sentences (under 20 words). Everyday words.
- Bob NEVER says "That's a great question" or "Absolutely."
- Natural spoken language. Contractions. Direct address. No bullet points, no headers.
- FORMATTING: Never use em-dashes, en-dashes, smart quotes, or bullet characters. Only plain commas, periods, straight quotes. HeyGen goes SILENT on em-dashes or smart punctuation.

Return JSON with exactly: opening_script, body_script, closing_script, lower_third_text.`,
      response_json_schema: {
        type: 'object',
        properties: {
          opening_script: { type: 'string' },
          body_script: { type: 'string' },
          closing_script: { type: 'string' },
          lower_third_text: { type: 'string' },
        },
      },
    });

    const article = await base44.asServiceRole.entities.DnnArticle.create({
      headline: result.headline,
      dateline: result.dateline || 'NATIONAL REPORT —',
      body: result.body,
      tags: result.tags || ['national'],
      trigger_type: 'national_housing_data',
      scope: 'national',
      audience: 'all',
      client_solution: result.client_solution || '',
      agent_solution: result.agent_solution || '',
      vendor_solution: result.vendor_solution || '',
      interview_qa: qaResult?.qa || [],
      generated_opening_script: sceneResult?.opening_script || '',
      generated_body_script: sceneResult?.body_script || '',
      generated_closing_script: sceneResult?.closing_script || '',
      generated_lower_third_text: sceneResult?.lower_third_text || '',
      production_status: 'pending_review',
      status: 'published',
      generated_date: new Date().toISOString(),
      published_date: new Date().toISOString(),
    });

    return Response.json({ success: true, article_id: article.id, headline: article.headline });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});