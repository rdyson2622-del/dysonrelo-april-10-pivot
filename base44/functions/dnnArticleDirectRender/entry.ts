import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';
import { uploadBobOutsideTalkingPhoto } from '../../shared/bobOutsideAsset.ts';
import { CHARLIE_INTRO_URL, CHARLIE_OUTRO_URL } from '../../shared/charlieBookends.ts';

/**
 * dnnArticleDirectRender — the "Sandwich" pipeline.
 *
 * HeyGen only ever renders ONE clip: Bob's middle news segment. Charlie's
 * opening and closing are static, pre-recorded MP4s (charlieBookends.ts) —
 * never sent to HeyGen. Once Bob's HeyGen clip completes, the three files
 * (Charlie_Intro.mp4 + Bob_Generated_Segment.mp4 + Charlie_Outro.mp4) are
 * stitched server-side via Creatomate into one combined MP4, which is what
 * lands on the article's video_url for the Show Production Pipeline player.
 *
 * This replaces the old combined-scene HeyGen render (Charlie open/close +
 * Bob body all sent to HeyGen together) — that approach caused multi-scene
 * render errors and burned more HeyGen credits per article than necessary.
 *
 * action: 'dispatch' (default) — { article_id } — admin only. Starts Bob's
 *   HeyGen render only.
 * action: 'poll' — no auth (scheduled automation only; currently paused —
 *   run manually via the Refresh button). Advances rendering articles
 *   through: HeyGen (Bob) → Creatomate (stitch) → complete.
 */

const HEYGEN_API = 'https://api.heygen.com';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const RENDER_TIMEOUT_MINUTES = 15;

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
}

function bobScene(text, talkingPhotoId) {
  return {
    character: { type: 'talking_photo', talking_photo_id: talkingPhotoId, scale: 1, offset: { x: 0, y: 0 } },
    voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: text, emotion: 'Excited', speed: 0.92 },
    background: { type: 'color', value: '#0d0d0d' },
  };
}

async function startBobRender(heygenKey, text, talkingPhotoId) {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [bobScene(text, talkingPhotoId)],
      dimension: { width: 1280, height: 720 },
      title: 'DNN Article — Bob segment (Sandwich pipeline)',
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

async function startStitch(creatomateKey, bobVideoUrl) {
  const res = await fetch('https://api.creatomate.com/v2/renders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${creatomateKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      output_format: 'mp4',
      width: 1280,
      height: 720,
      frame_rate: 30,
      elements: [
        { type: 'video', track: 1, source: CHARLIE_INTRO_URL },
        { type: 'video', track: 1, source: bobVideoUrl },
        { type: 'video', track: 1, source: CHARLIE_OUTRO_URL },
      ],
    }),
  });
  const data = await res.json();
  const render = Array.isArray(data) ? data[0] : data;
  if (!res.ok || !render?.id) throw new Error(`Creatomate stitch failed to start: ${JSON.stringify(data)}`);
  return render.id;
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

    // ── action: 'poll' ── advances rendering articles through HeyGen (Bob) → Creatomate (stitch) → complete
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
        const stitchRenderId = article.render_clips?.creatomate_render_id;

        try {
          // ── Phase 2: Creatomate stitch in progress ──
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
                render_clips: null,
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

          // ── Phase 1: HeyGen rendering Bob's segment ──
          if (!article.heygen_video_id) continue; // nothing left to poll for this article
          const { status, videoUrl, error } = await checkHeygen(HEYGEN_API_KEY, article.heygen_video_id);
          if (status === 'completed' && videoUrl) {
            if (!CREATOMATE_KEY) throw new Error('CREATOMATE not configured — cannot stitch bookends');
            const renderId = await startStitch(CREATOMATE_KEY, videoUrl);
            await base44.asServiceRole.entities.DnnArticle.update(article.id, {
              render_clips: { creatomate_render_id: renderId, bob_video_url: videoUrl },
            });
            results.push({ article_id: article.id, status: 'stitching' });
          } else if (status === 'failed') {
            await base44.asServiceRole.entities.DnnArticle.update(article.id, {
              production_status: 'failed',
              last_render_error: error || 'HeyGen render failed',
            });
            results.push({ article_id: article.id, status: 'failed' });
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

    try {
      const bobTalkingPhotoId = await uploadBobOutsideTalkingPhoto(HEYGEN_API_KEY);
      const videoId = await startBobRender(HEYGEN_API_KEY, bodyScript, bobTalkingPhotoId);

      await base44.asServiceRole.entities.DnnArticle.update(article_id, {
        production_status: 'rendering',
        heygen_video_id: videoId,
        render_clips: null,
        last_render_error: null,
        video_url: null,
      });

      return Response.json({ success: true, video_id: videoId });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});