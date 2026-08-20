import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnAutoRender
 *
 * Scheduled every 5 minutes. Picks up DnnArticles approved in the Daily News
 * Library (production_status === 'approved_for_render', render_requested === true)
 * and kicks off the FULL studio broadcast pipeline using the SINGLE-MP4 path:
 *
 *   1. Builds the 3 scripts (opening / body / closing) from the article.
 *   2. Creates ONE DnnBroadcast record (show_number auto-incremented) with the
 *      3 scripts stored as intro_script / content_script / outro_script.
 *   3. Dispatches a SINGLE multi-scene HeyGen render request
 *      (3 video_inputs -> 1 stitched MP4). One HeyGen job id = one MP4.
 *   4. Stores the heygenId on the broadcast, flips status -> 'rendering'.
 *   5. Sets the article to production_status 'rendering'.
 *
 * Downstream (n8n W2 / n8nBroadcastCallback / dnnVideoPoller):
 *   - receives the HeyGen completion, sets videoUrl + status -> 'ready'
 *   - dnnCompositeBroadcast bakes the studio background into the MP4 (Creatomate)
 *   - status -> 'compositing' -> 'completed'
 *
 * CRITICAL DESIGN RULE: This function NEVER creates 3 separate clips or makes
 * 3 separate HeyGen calls. All three scripts are blended into ONE MP4 via a
 * single multi-scene HeyGen request, then composited with the studio background
 * — matching what is posted on the 1DNN news page.
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const HEYGEN_API = 'https://api.heygen.com';

function clean(s) {
  return (s || '')
    .replace(/[*_#`]/g, '')
    .replace(/[\u2014\u2013]/g, ', ')   // em-dash / en-dash -> comma (HeyGen TTS goes silent on dashes)
    .replace(/\u2026/g, '. ')          // ellipsis -> period
    .replace(/[\u201c\u201d]/g, '"')   // smart double quotes
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u2022\u25CF\u00B7]/g, '') // bullet / middot
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

FORMATTING RULE — CRITICAL: Never use em-dashes, en-dashes, smart quotes, or bullet characters in any script text. Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

Write TWO spoken segments in plain spoken text (no markdown, no stage directions):

1. OPENING (120-180 words): Charlie Simmons opens the broadcast. Begin exactly: "Good day from the DNN news desk, I'm Charlie Simmons, and this is your DNN Real Estate News broadcast for ${dateSpoken}." Then introduce this story naturally and toss to Bob Dyson, e.g. "For what this means if you're planning a move, let's bring in Bob Dyson. Bob, [specific question]?"

2. CLOSING (40-60 words): Charlie thanks Bob briefly, then closes exactly with: "That's your DNN brief. The full story is right below this broadcast, and if it affects your move, just ask. I'm Charlie Simmons. We'll see you next time."

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

/**
 * Dispatch a SINGLE multi-scene HeyGen render request.
 * 3 video_inputs (Charlie intro / Bob body / Charlie outro) -> 1 stitched MP4.
 * Returns the HeyGen video_id, or null on failure.
 */
async function dispatchSingleRender(heygenKey, opening, body, closing) {
  const video_inputs = [];

  if (opening) {
    video_inputs.push({
      character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
      voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: opening, speed: 1.05 },
      background: { type: 'color', value: '#0d0d0d' },
    });
  }
  if (body) {
    video_inputs.push({
      character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
      voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: body, emotion: 'Excited', speed: 1.12 },
      background: { type: 'color', value: '#0d0d0d' },
    });
  }
  if (closing) {
    video_inputs.push({
      character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
      voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: closing, speed: 1.05 },
      background: { type: 'color', value: '#0d0d0d' },
    });
  }

  if (video_inputs.length === 0) return null;

  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs,
      dimension: { width: 1280, height: 720 },
    }),
  });
  const data = await res.json().catch(() => null);
  return data?.data?.video_id || null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // HARD BLOCK: this function dispatches straight to HeyGen. DNN broadcasts
    // must render exclusively through the Higgsfield + 11 Labs n8n pipeline —
    // permanently disabled to stop unordered HeyGen spend.
    return Response.json({
      error: 'HeyGen rendering is disabled. DNN broadcasts render exclusively through the Higgsfield + 11 Labs pipeline (dnnDailyVideoPipeline / dnnRerunShow).',
    }, { status: 403 });

    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { production_status: 'approved_for_render', render_requested: true },
      '-updated_date',
      20
    );

    // Determine the next show number from the highest existing show_number
    const latest = await base44.asServiceRole.entities.DnnBroadcast.list('-show_number', 1);
    let nextShowNumber = (latest[0]?.show_number || 0) + 1;

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

        // 1. Create ONE DnnBroadcast record with the 3 scripts
        const broadcast = await base44.asServiceRole.entities.DnnBroadcast.create({
          show_name: `Show ${nextShowNumber}`,
          show_number: nextShowNumber,
          broadcast_date: new Date().toISOString().slice(0, 10),
          headlines: [article.headline],
          presenter: 'charlie',
          format: 'solo',
          intro_script: opening,
          content_script: body,
          outro_script: closing,
          status: 'script_ready',
        });

        // 2. Dispatch a SINGLE multi-scene HeyGen render (3 scenes -> 1 stitched MP4)
        const heygenVideoId = await dispatchSingleRender(HEYGEN_API_KEY, opening, body, closing);

        if (!heygenVideoId) {
          await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
            status: 'failed',
            errorMessage: 'HeyGen single-MP4 dispatch failed',
          });
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: 'HeyGen single-MP4 dispatch failed',
            render_requested: false,
          });
          results.push({ id: article.id, error: 'heygen dispatch failed' });
          nextShowNumber++;
          continue;
        }

        // 3. Store the single HeyGen job id on the broadcast, flip to rendering
        await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
          heygenId: heygenVideoId,
          status: 'rendering',
          errorMessage: null,
        });

        // 4. Move the article into rendering
        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          production_status: 'rendering',
          render_requested: false,
          last_render_error: null,
          heygen_video_id: heygenVideoId,
        });

        results.push({
          id: article.id,
          headline: article.headline,
          broadcast_id: broadcast.id,
          show_number: nextShowNumber,
          heygen_video_id: heygenVideoId,
          status: 'rendering',
          scenes: 3,
          mp4: 1,
        });
        nextShowNumber++;

        await new Promise((r) => setTimeout(r, 800));
      } catch (e) {
        results.push({ id: article.id, error: e.message });
        nextShowNumber++;
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