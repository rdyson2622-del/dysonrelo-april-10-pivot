import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnAutoRender
 *
 * Scheduled every 5 minutes. Picks up DnnArticles approved in the Daily News
 * Library (production_status === 'approved_for_render', render_requested === true)
 * and kicks off the FULL studio broadcast pipeline:
 *
 *   1. Creates 3 DnnNewsClip records (intro / qa / outro) linked via article_id.
 *   2. Renders 3 HeyGen clips:
 *        - Charlie open  (avatar on green screen #00FF00 for chroma key)
 *        - Bob body      (talking photo on dark #0d0d0d)
 *        - Charlie close (avatar on green screen #00FF00)
 *   3. Sets the article to production_status 'rendering'.
 *
 * dnnVideoPoller then:
 *   - downloads the 3 finished clips
 *   - triggers dnnCreatomateRender to composite the studio backdrop + bullet banner
 *   - downloads the final MP4 back onto the article (production_status 'complete')
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const HEYGEN_API = 'https://api.heygen.com';

function clean(s) {
  return (s || '').replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();
}

function buildScripts(article) {
  const opening = clean(article.edited_opening_script || article.generated_opening_script || '');
  const body = clean(article.edited_body_script || article.generated_body_script || article.body || '');
  const closing = clean(article.edited_closing_script || article.generated_closing_script || '');
  return { opening, body, closing };
}

async function ensureScripts(base44, article, body) {
  const dateSpoken = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const updates = {};
  let opening = article.edited_opening_script || article.generated_opening_script || '';
  let closing = article.edited_closing_script || article.generated_closing_script || '';

  if (!opening.trim() || !closing.trim()) {
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are writing a DNN Real Estate News broadcast script for ${dateSpoken}.

ARTICLE HEADLINE: ${article.headline}
ARTICLE BODY: ${body.slice(0, 1200)}

Write TWO spoken segments in plain spoken text (no markdown, no stage directions):

1. OPENING (120-180 words): Charlie Simmons opens the broadcast. Begin exactly: "Good day from the DNN news desk — I'm Charlie Simmons, and this is your DNN Real Estate News broadcast for ${dateSpoken}." Then introduce this story naturally and toss to Bob Dyson, e.g. "For what this means if you're planning a move, let's bring in Bob Dyson. Bob — [specific question]?"

2. CLOSING (40-60 words): Charlie thanks Bob briefly, then closes exactly with: "That's your DNN brief. The full story is right below this broadcast — and if it affects your move, just ask. I'm Charlie Simmons. We'll see you next time."

Return JSON with exactly: { "opening": "...", "closing": "..." }`,
      response_json_schema: {
        type: 'object',
        properties: { opening: { type: 'string' }, closing: { type: 'string' } },
      },
    });
    if (!opening.trim() && result?.opening) {
      opening = result.opening;
      updates.generated_opening_script = result.opening;
    }
    if (!closing.trim() && result?.closing) {
      closing = result.closing;
      updates.generated_closing_script = result.closing;
    }
  }

  if (Object.keys(updates).length) {
    await base44.asServiceRole.entities.DnnArticle.update(article.id, updates);
  }
  return { opening, closing };
}

async function renderCharlie(heygenKey, script) {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [{
        character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
        voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script, speed: 1.05 },
        background: { type: 'color', value: '#00FF00' },
      }],
      dimension: { width: 1280, height: 720 },
    }),
  });
  const data = await res.json();
  return data?.data?.video_id || null;
}

async function renderBob(heygenKey, script) {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [{
        character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
        voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: script, emotion: 'Excited', speed: 1.12 },
        background: { type: 'color', value: '#0d0d0d' },
      }],
      dimension: { width: 1280, height: 720 },
    }),
  });
  const data = await res.json();
  return data?.data?.video_id || null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { production_status: 'approved_for_render', render_requested: true },
      '-updated_date',
      20
    );

    const results = [];
    for (const article of articles) {
      try {
        const built = buildScripts(article);
        const { opening, closing } = await ensureScripts(base44, article, built.body);
        const body = built.body;
        if (!opening || !body || !closing) {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: 'Missing opening, body, or closing script',
            render_requested: false,
          });
          results.push({ id: article.id, error: 'missing script segment' });
          continue;
        }

        // 1. Create 3 DnnNewsClip records linked to this article
        const clips = await base44.asServiceRole.entities.DnnNewsClip.bulkCreate([
          { kind: 'intro', faqIndex: 0, question: article.headline, article_id: article.id, charlieScript: opening, charlieStatus: 'not_started' },
          { kind: 'qa', faqIndex: 1, question: article.headline, article_id: article.id, bobScript: body, bobStatus: 'not_started' },
          { kind: 'outro', faqIndex: 2, question: article.headline, article_id: article.id, charlieScript: closing, charlieStatus: 'not_started' },
        ]);

        // 2. Render 3 HeyGen clips
        const introId = await renderCharlie(HEYGEN_API_KEY, opening);
        const bodyId = await renderBob(HEYGEN_API_KEY, body);
        const outroId = await renderCharlie(HEYGEN_API_KEY, closing);

        const errors = [];
        if (!introId) errors.push('intro render failed');
        if (!bodyId) errors.push('body render failed');
        if (!outroId) errors.push('outro render failed');

        if (errors.length) {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: errors.join('; '),
            render_requested: false,
          });
          results.push({ id: article.id, error: errors.join('; ') });
          continue;
        }

        // 3. Store HeyGen IDs on the clips
        await base44.asServiceRole.entities.DnnNewsClip.bulkUpdate([
          { id: clips[0].id, charlieHeygenId: introId, charlieStatus: 'rendering' },
          { id: clips[1].id, bobHeygenId: bodyId, bobStatus: 'rendering' },
          { id: clips[2].id, charlieHeygenId: outroId, charlieStatus: 'rendering' },
        ]);

        // 4. Move article into rendering
        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          production_status: 'rendering',
          render_requested: false,
          last_render_error: null,
          heygen_video_id: null,
          video_url: null,
        });
        results.push({ id: article.id, headline: article.headline, status: 'rendering', clips: 3 });

        await new Promise((r) => setTimeout(r, 800));
      } catch (e) {
        results.push({ id: article.id, error: e.message });
      }
    }

    return Response.json({
      success: true,
      approved_found: articles.length,
      processed: results.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});