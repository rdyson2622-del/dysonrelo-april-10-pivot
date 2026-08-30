import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';

/**
 * dnnArticleDirectRender
 *
 * Direct in-app HeyGen render for DnnArticle — no n8n involved anywhere.
 *
 * COMBINED SINGLE-VIDEO RENDER (the proven corporateReloQARender
 * "startCombinedRender" pattern): Charlie opens, Bob reports, Charlie closes
 * are sent as THREE sequential video_inputs in ONE /v2/video/generate call.
 * HeyGen renders them as ONE combined MP4 — one job, one credit charge, one
 * finished video file. No separate clips, no client-side stitching.
 *
 * The HeyGen ID the admin found under "Projects" (7695badc51394481a329fcefec792af0)
 * turned out to be a completed VIDEO render, not a reusable Template — HeyGen
 * templates and finished videos are different resource types, so it can't be
 * called with new script text. This combined-generate approach produces the
 * same "one finished MP4" result without needing any template at all.
 *
 * Result is stored on the legacy single-clip fields: heygen_video_id +
 * video_url. The Show Pipeline card already falls back to a plain <video>
 * player for these fields when render_clips is absent — untouched.
 *
 * action: 'dispatch' (default) — { article_id } — admin only.
 * action: 'poll' — no auth (called by scheduled automation) — checks the
 *   combined job against HeyGen, downloads + stores the finished MP4, flips
 *   production_status to 'complete'.
 */

const HEYGEN_API = 'https://api.heygen.com';
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const VOICE_SPEED = 0.8;
const RENDER_TIMEOUT_MINUTES = 15;

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
}

function charlieScene(text) {
  return {
    character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
    voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: text, speed: VOICE_SPEED },
    background: { type: 'color', value: '#000000' },
  };
}

function bobScene(text) {
  return {
    character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
    voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: text, speed: VOICE_SPEED },
    background: { type: 'color', value: '#000000' },
  };
}

// ONE HeyGen /v2/video/generate call with sequential video_inputs → ONE combined mp4.
async function startCombinedRender(heygenKey, videoInputs) {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: videoInputs,
      dimension: { width: 1280, height: 720 },
      title: 'DNN Article — combined single MP4 (Charlie open, Bob report, Charlie close)',
    }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (_) {
    throw new Error(`HeyGen render returned non-JSON: ${text.slice(0, 300)}`);
  }
  const videoId = data?.data?.video_id;
  if (!res.ok || !videoId) {
    throw new Error(`HeyGen render job failed: ${JSON.stringify(data)}`);
  }
  return videoId;
}

async function checkRender(heygenKey, videoId) {
  const res = await fetch(`${HEYGEN_API}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`, {
    headers: { 'X-Api-Key': heygenKey },
  });
  const data = await res.json();
  return { status: data?.data?.status, videoUrl: data?.data?.video_url, error: data?.data?.error?.message };
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    // ── action: 'poll' — scheduled automation, checks all rendering articles ──
    if (body.action === 'poll') {
      // Oldest-updated first — stuck articles otherwise sink to the bottom of
      // a '-updated_date' sort and never get re-checked (or timed out) once
      // enough newer renders pile up ahead of them in the 50-record window.
      const rendering = await base44.asServiceRole.entities.DnnArticle.filter(
        { production_status: 'rendering' },
        'updated_date',
        50
      );
      const timeoutCutoff = Date.now() - RENDER_TIMEOUT_MINUTES * 60 * 1000;
      const results = [];
      for (const article of rendering) {
        if (!article.heygen_video_id) continue; // old render_clips-based article — nothing left to poll for it here
        const stale = new Date(article.updated_date || article.created_date).getTime() < timeoutCutoff;
        try {
          const { status, videoUrl, error } = await checkRender(HEYGEN_API_KEY, article.heygen_video_id);
          if (status === 'completed' && videoUrl) {
            let savedUrl = videoUrl;
            try {
              const vidRes = await fetch(videoUrl);
              if (vidRes.ok) {
                const buf = await vidRes.arrayBuffer();
                const file = new File([buf], `dnn_article_${article.id}.mp4`, { type: 'video/mp4' });
                const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                if (up?.file_url) savedUrl = up.file_url;
              }
            } catch (_) { /* keep HeyGen CDN url as fallback */ }
            await base44.asServiceRole.entities.DnnArticle.update(article.id, {
              video_url: savedUrl,
              production_status: 'complete',
              video_completed_at: new Date().toISOString(),
            });
            results.push({ article_id: article.id, status: 'complete' });
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
          results.push({ article_id: article.id, error: e.message });
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      return Response.json({ checked: results.length, results });
    }

    // ── action: 'dispatch' (default) — admin triggers a direct render ──
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { article_id } = body;
    if (!article_id) return Response.json({ error: 'article_id is required' }, { status: 400 });

    const article = await base44.asServiceRole.entities.DnnArticle.get(article_id);
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    const openingScript = sanitizeVoiceScript(pick(article.edited_opening_script, article.generated_opening_script)).slice(0, 1500);
    const bodyScript = sanitizeVoiceScript(pick(article.edited_body_script, article.generated_body_script) || article.body).slice(0, 2500);
    const closingScript = sanitizeVoiceScript(pick(article.edited_closing_script, article.generated_closing_script)).slice(0, 1500);

    const videoInputs = [];
    if (openingScript) videoInputs.push(charlieScene(openingScript));
    if (bodyScript) videoInputs.push(bobScene(bodyScript));
    if (closingScript) videoInputs.push(charlieScene(closingScript));

    if (videoInputs.length === 0) {
      return Response.json({ error: 'No script text found on this article' }, { status: 400 });
    }

    try {
      const videoId = await startCombinedRender(HEYGEN_API_KEY, videoInputs);

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