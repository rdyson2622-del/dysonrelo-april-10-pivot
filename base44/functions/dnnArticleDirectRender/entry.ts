import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';
import { BOB_TALKING_PHOTO_ID } from '../../shared/bobOutsideAsset.ts';
import { CHARLIE_AVATAR_ID } from '../../shared/charlieAvatar.ts';
import { CHARLIE_INTRO_URL, CHARLIE_OUTRO_URL } from '../../shared/charlieBookends.ts';
import { DNN_STUDIO_BACKGROUND_URL } from '../../shared/dnnStudioBackground.ts';

/**
 * dnnArticleDirectRender — the "Sandwich" pipeline.
 *
 * HeyGen renders exactly TWO clips per article: Charlie's toss (presents the
 * story, hands off to Bob) and Bob's answer (the solution/analysis). Both are
 * boxed over the DNN studio backdrop in the in-app preview (render_clips.opening
 * / render_clips.body — see DnnArticleBroadcastPlayer). Charlie's static
 * pre-recorded Intro/Outro (charlieBookends.ts) bookend the whole thing — never
 * sent to HeyGen. Once both clips complete, all four files (Intro + Charlie
 * toss + Bob answer + Outro) are stitched server-side via Creatomate into one
 * combined MP4, which lands on the article's video_url for distribution.
 *
 * action: 'dispatch' (default) — { article_id } — admin only. Starts Charlie's
 *   toss + Bob's answer HeyGen renders.
 * action: 'poll' — no auth (scheduled automation only; currently paused —
 *   run manually via the Refresh button). Advances rendering articles
 *   through: HeyGen (Charlie + Bob) → Creatomate (stitch) → complete.
 */

const HEYGEN_API = 'https://api.heygen.com';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const RENDER_TIMEOUT_MINUTES = 15;

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
}

function presenterScene(text, character, voiceId, emotion) {
  return {
    character,
    // speed 1.0 was tested and confirmed still sluggish/"drunk" on this voice —
    // 1.15 is the correction. Do not drop this back to 1.0.
    voice: { type: 'text', voice_id: voiceId, input_text: text, emotion, speed: 1.15 },
    background: { type: 'color', value: '#0d0d0d' },
  };
}

async function startRender(heygenKey, scene, title) {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [scene],
      dimension: { width: 1280, height: 720 },
      title,
    }),
  });
  const text2 = await res.text();
  let data;
  try { data = JSON.parse(text2); } catch (_) {
    throw new Error(`HeyGen render returned non-JSON: ${text2.slice(0, 300)}`);
  }
  const videoId = data?.data?.video_id;
  if (!res.ok || !videoId) throw new Error(`HeyGen render job failed: ${JSON.stringify(data)}`);
  return videoId;
}

async function checkHeygen(heygenKey, videoId) {
  const res = await fetch(`${HEYGEN_API}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`, {
    headers: { 'X-Api-Key': heygenKey },
  });
  const data = await res.json();
  return { status: data?.data?.status, videoUrl: data?.data?.video_url, error: data?.data?.error?.message };
}

// Builds the studio composite: Track 1 is the DNN backdrop, spanning the
// entire composition (no time/duration set — Creatomate stretches an image
// with no explicit duration to match the longest track). Track 2 is a
// SEQUENTIAL overlay (auto-placed one after another, in array order, since
// none of these clips overlap in time): the Grok intro plays full-frame
// (covering the backdrop), then Charlie's clip is scaled + anchored into a
// gold-bordered box over the visible backdrop, then Bob's clip into a second
// box, then the Grok outro plays full-frame again. Charlie and Bob never
// overlap in time, so they safely share one auto-sequenced track instead of
// requiring hardcoded second-by-second offsets across separate tracks (which
// we don't have — the clip durations aren't known until Creatomate renders).
// CRITICAL: every element on track 2 gets an EXPLICIT time: 'auto' — this is
// the only way to force Creatomate to play them strictly one after another
// (intro fully finishes, THEN Charlie, THEN Bob, THEN outro). Leaving "time"
// unset is what caused the intro and outro to render on top of each other at
// the front instead of bookending the piece — never omit this again.
function buildStudioComposite({ introUrl, charlieUrl, bobUrl, outroUrl }) {
  const BOX = { width: '30%', height: '75%', y: '50%', y_anchor: '50%', fit: 'cover', border_radius: '10px', border_width: '4px', border_color: '#D4AF37', shadow_color: 'rgba(0,0,0,0.7)', shadow_blur: '1.2vmin' };
  return [
    { type: 'image', track: 1, source: DNN_STUDIO_BACKGROUND_URL, width: '100%', height: '100%', x: '50%', y: '50%', fit: 'cover' },
    { type: 'video', track: 2, time: 0, source: introUrl, width: '100%', height: '100%', x: '50%', y: '50%', fit: 'cover' },
    { type: 'video', track: 2, time: 'auto', source: charlieUrl, ...BOX, x: '20%', x_anchor: '50%' },
    { type: 'video', track: 2, time: 'auto', source: bobUrl, ...BOX, x: '80%', x_anchor: '50%' },
    { type: 'video', track: 2, time: 'auto', source: outroUrl, width: '100%', height: '100%', x: '50%', y: '50%', fit: 'cover' },
  ];
}

async function startStitch(creatomateKey, clips) {
  const payload = {
    output_format: 'mp4',
    width: 1280,
    height: 720,
    frame_rate: 30,
    elements: buildStudioComposite(clips),
  };
  const res = await fetch('https://api.creatomate.com/v2/renders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${creatomateKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  const render = Array.isArray(data) ? data[0] : data;
  if (!res.ok || !render?.id) throw new Error(`Creatomate stitch failed to start: ${JSON.stringify(data)}`);
  return { renderId: render.id, payload };
}

async function checkStitch(creatomateKey, renderId) {
  const res = await fetch(`https://api.creatomate.com/v2/renders/${encodeURIComponent(renderId)}`, {
    headers: { Authorization: `Bearer ${creatomateKey}` },
  });
  const render = await res.json();
  return { status: render?.status, url: render?.url, error: render?.error_message || null };
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    // ── action: 'poll' ── advances rendering articles through HeyGen (Charlie + Bob) → Creatomate (stitch) → complete
    if (body.action === 'poll') {
      const CREATOMATE_KEY = Deno.env.get('CREATOMATE');
      const rendering = await base44.asServiceRole.entities.DnnArticle.filter(
        { production_status: 'rendering' },
        'updated_date',
        50
      );
      const timeoutCutoff = Date.now() - RENDER_TIMEOUT_MINUTES * 60 * 1000;
      const results = [];

      for (const article of rendering) {
        const stale = new Date(article.updated_date || article.created_date).getTime() < timeoutCutoff;
        const clips = article.render_clips || {};
        const stitchRenderId = clips.creatomate_render_id;

        try {
          // ── Phase 3: Creatomate stitch (Intro + Charlie + Bob + Outro) in progress ──
          if (stitchRenderId) {
            if (!CREATOMATE_KEY) throw new Error('CREATOMATE not configured');
            const { status, url, error } = await checkStitch(CREATOMATE_KEY, stitchRenderId);
            if (status === 'succeeded' && url) {
              let savedUrl = url;
              try {
                const vidRes = await fetch(url);
                if (vidRes.ok) {
                  const buf = await vidRes.arrayBuffer();
                  const file = new File([buf], `dnn_article_${article.id}.mp4`, { type: 'video/mp4' });
                  const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                  if (up?.file_url) savedUrl = up.file_url;
                }
              } catch (_) { /* keep Creatomate CDN url as fallback */ }
              await base44.asServiceRole.entities.DnnArticle.update(article.id, {
                video_url: savedUrl,
                production_status: 'complete',
                video_completed_at: new Date().toISOString(),
                heygen_video_id: null,
              });
              results.push({ article_id: article.id, status: 'complete' });
            } else if (status === 'failed') {
              await base44.asServiceRole.entities.DnnArticle.update(article.id, {
                production_status: 'failed',
                last_render_error: error || 'Creatomate stitch failed',
              });
              results.push({ article_id: article.id, status: 'failed' });
            } else if (stale) {
              await base44.asServiceRole.entities.DnnArticle.update(article.id, {
                production_status: 'failed',
                last_render_error: `Stitch timed out after ${RENDER_TIMEOUT_MINUTES} min`,
              });
              results.push({ article_id: article.id, status: 'failed (timeout)' });
            }
            continue;
          }

          // ── Phase 1 & 2: HeyGen rendering Charlie's toss and Bob's answer ──
          const opening = clips.opening || {};
          const bodyClip = clips.body || {};
          if (!opening.heygen_id && !bodyClip.heygen_id) continue; // nothing to poll for this article

          const nextClips = { ...clips, opening: { ...opening }, body: { ...bodyClip } };
          let changed = false;

          if (opening.heygen_id && !opening.video_url) {
            const { status, videoUrl, error } = await checkHeygen(HEYGEN_API_KEY, opening.heygen_id);
            if (status === 'completed' && videoUrl) {
              nextClips.opening = { ...opening, video_url: videoUrl, status: 'completed' };
              changed = true;
            } else if (status === 'failed') {
              throw new Error(error || "Charlie's toss render failed");
            }
          }
          if (bodyClip.heygen_id && !bodyClip.video_url) {
            const { status, videoUrl, error } = await checkHeygen(HEYGEN_API_KEY, bodyClip.heygen_id);
            if (status === 'completed' && videoUrl) {
              nextClips.body = { ...bodyClip, video_url: videoUrl, status: 'completed' };
              changed = true;
            } else if (status === 'failed') {
              throw new Error(error || "Bob's answer render failed");
            }
          }

          const bothDone = nextClips.opening.video_url && nextClips.body.video_url;
          if (bothDone) {
            if (!CREATOMATE_KEY) throw new Error('CREATOMATE not configured — cannot stitch bookends');
            const { renderId, payload } = await startStitch(CREATOMATE_KEY, {
              introUrl: CHARLIE_INTRO_URL,
              charlieUrl: nextClips.opening.video_url,
              bobUrl: nextClips.body.video_url,
              outroUrl: CHARLIE_OUTRO_URL,
            });
            console.log('Creatomate stitch payload:', JSON.stringify(payload));
            nextClips.creatomate_render_id = renderId;
            await base44.asServiceRole.entities.DnnArticle.update(article.id, { render_clips: nextClips });
            results.push({ article_id: article.id, status: 'stitching' });
          } else if (changed) {
            await base44.asServiceRole.entities.DnnArticle.update(article.id, { render_clips: nextClips });
            results.push({ article_id: article.id, status: 'partial' });
          } else if (stale) {
            await base44.asServiceRole.entities.DnnArticle.update(article.id, {
              production_status: 'failed',
              last_render_error: `Timed out after ${RENDER_TIMEOUT_MINUTES} min with no HeyGen response`,
            });
            results.push({ article_id: article.id, status: 'failed (timeout)' });
          }
        } catch (e) {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: e.message,
          });
          results.push({ article_id: article.id, error: e.message });
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      return Response.json({ checked: results.length, results });
    }

    // ── action: 'dispatch' (default) — admin triggers a direct render ──
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (!CHARLIE_INTRO_URL || !CHARLIE_OUTRO_URL) {
      return Response.json({
        error: 'Charlie intro/outro MP4s are not configured yet. Upload the standard intro and outro clips and set CHARLIE_INTRO_URL / CHARLIE_OUTRO_URL in base44/shared/charlieBookends.ts before rendering.',
      }, { status: 400 });
    }

    const { article_id } = body;
    if (!article_id) return Response.json({ error: 'article_id is required' }, { status: 400 });

    const article = await base44.asServiceRole.entities.DnnArticle.get(article_id);
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    const bodyScript = sanitizeVoiceScript(pick(article.edited_body_script, article.generated_body_script) || article.body).slice(0, 2500);
    if (!bodyScript) {
      return Response.json({ error: 'No news segment script found on this article' }, { status: 400 });
    }
    const tossScript = sanitizeVoiceScript(
      pick(article.edited_opening_script, article.generated_opening_script) ||
      `Here's a look at today's story: ${article.headline}. For what this means if you're relocating, let's bring in real estate veteran Bob Dyson.`
    ).slice(0, 1500);

    try {
      const charlieCharacter = { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID };
      const bobCharacter = { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID, scale: 1, offset: { x: 0, y: 0 } };
      const [charlieVideoId, bobVideoId] = await Promise.all([
        startRender(HEYGEN_API_KEY, presenterScene(tossScript, charlieCharacter, CHARLIE_VOICE_ID), 'DNN Article — Charlie toss (Sandwich pipeline)'),
        startRender(HEYGEN_API_KEY, presenterScene(bodyScript, bobCharacter, BOB_VOICE_ID, 'Excited'), 'DNN Article — Bob segment (Sandwich pipeline)'),
      ]);

      await base44.asServiceRole.entities.DnnArticle.update(article_id, {
        production_status: 'rendering',
        heygen_video_id: null,
        render_clips: {
          opening: { heygen_id: charlieVideoId, status: 'rendering' },
          body: { heygen_id: bobVideoId, status: 'rendering' },
        },
        last_render_error: null,
        video_url: null,
      });

      return Response.json({ success: true, charlie_video_id: charlieVideoId, bob_video_id: bobVideoId });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});