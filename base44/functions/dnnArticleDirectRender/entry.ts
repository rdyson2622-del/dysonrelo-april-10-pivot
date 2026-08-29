import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';

/**
 * dnnArticleDirectRender
 *
 * Direct in-app HeyGen render for DnnArticle — no n8n involved anywhere.
 *
 * Uses the PROVEN "QA Duo" pattern already working elsewhere (lenderRender,
 * vettingDeskQARender, roadmapQARender): Charlie is a real HeyGen AVATAR
 * (not a stock desk photo), Bob is his talking_photo — both rendered as
 * separate solid-black-background clips. The studio backdrop + two boxes
 * are composited entirely client-side (DnnArticleBroadcastPlayer), never by
 * HeyGen — so HeyGen is never asked to bake in a background or a second
 * person.
 *
 * Three clips per article: Charlie opens, Bob reports the story, Charlie
 * closes — stored in render_clips = { opening, body, closing }, each
 * { heygen_id, video_url, status }.
 *
 * action: 'dispatch' (default) — { article_id } — admin only.
 * action: 'poll' — no auth (called by scheduled automation) — checks every
 *   rendering clip against HeyGen, downloads + stores finished MP4s, flips
 *   production_status to 'complete' once all three clips are done.
 */

const HEYGEN_API = 'https://api.heygen.com';
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const VOICE_SPEED = 0.8;

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
}

async function startClip(heygenKey, role, script) {
  const character = role === 'bob'
    ? { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID }
    : { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' };
  const voiceId = role === 'bob' ? BOB_VOICE_ID : CHARLIE_VOICE_ID;

  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [{
        character,
        voice: { type: 'text', voice_id: voiceId, input_text: script, speed: VOICE_SPEED },
        background: { type: 'color', value: '#000000' },
      }],
      dimension: { width: 1280, height: 720 },
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

async function checkClip(heygenKey, videoId) {
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
      const rendering = await base44.asServiceRole.entities.DnnArticle.filter(
        { production_status: 'rendering' },
        '-updated_date',
        50
      );
      const results = [];
      for (const article of rendering) {
        const clips = article.render_clips || {};
        let changed = false;
        let anyFailed = false;
        for (const key of ['opening', 'body', 'closing']) {
          const clip = clips[key];
          if (!clip || clip.status !== 'rendering' || !clip.heygen_id) continue;
          try {
            const { status, videoUrl, error } = await checkClip(HEYGEN_API_KEY, clip.heygen_id);
            if (status === 'completed' && videoUrl) {
              let savedUrl = videoUrl;
              try {
                const vidRes = await fetch(videoUrl);
                if (vidRes.ok) {
                  const buf = await vidRes.arrayBuffer();
                  const file = new File([buf], `dnn_article_${article.id}_${key}.mp4`, { type: 'video/mp4' });
                  const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                  if (up?.file_url) savedUrl = up.file_url;
                }
              } catch (_) { /* keep HeyGen CDN url as fallback */ }
              clips[key] = { ...clip, video_url: savedUrl, status: 'completed' };
              changed = true;
            } else if (status === 'failed') {
              clips[key] = { ...clip, status: 'failed', error: error || 'HeyGen render failed' };
              anyFailed = true;
              changed = true;
            }
          } catch (e) {
            results.push({ article_id: article.id, clip: key, error: e.message });
          }
          await new Promise((r) => setTimeout(r, 300));
        }

        if (changed) {
          const allDone = ['opening', 'body', 'closing'].every((k) => clips[k]?.status === 'completed');
          const update = { render_clips: clips };
          if (anyFailed) {
            update.production_status = 'failed';
            update.last_render_error = Object.values(clips).map((c) => c?.error).filter(Boolean).join(' | ') || 'One or more clips failed';
          } else if (allDone) {
            update.production_status = 'complete';
            update.video_completed_at = new Date().toISOString();
          }
          await base44.asServiceRole.entities.DnnArticle.update(article.id, update);
          results.push({ article_id: article.id, status: update.production_status || 'rendering' });
        }
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

    if (!openingScript && !bodyScript && !closingScript) {
      return Response.json({ error: 'No script text found on this article' }, { status: 400 });
    }

    try {
      const [openingId, bodyId, closingId] = await Promise.all([
        openingScript ? startClip(HEYGEN_API_KEY, 'charlie', openingScript) : Promise.resolve(null),
        bodyScript ? startClip(HEYGEN_API_KEY, 'bob', bodyScript) : Promise.resolve(null),
        closingScript ? startClip(HEYGEN_API_KEY, 'charlie', closingScript) : Promise.resolve(null),
      ]);

      const render_clips = {
        opening: openingId ? { heygen_id: openingId, status: 'rendering' } : null,
        body: bodyId ? { heygen_id: bodyId, status: 'rendering' } : null,
        closing: closingId ? { heygen_id: closingId, status: 'rendering' } : null,
      };

      await base44.asServiceRole.entities.DnnArticle.update(article_id, {
        production_status: 'rendering',
        render_clips,
        last_render_error: null,
        video_url: null,
      });

      return Response.json({ success: true, render_clips });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});