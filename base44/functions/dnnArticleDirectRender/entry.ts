import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';
import { uploadCharlieDeskTalkingPhoto } from '../../shared/charlieDeskAsset.ts';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';

/**
 * dnnArticleDirectRender
 *
 * Direct in-app HeyGen render for DnnArticle — no n8n involved anywhere.
 * Uses the same LOCKED Charlie desk talking_photo asset + voice already
 * proven in heygenCharlieDeskTest, so this reproduces the approved look.
 *
 * action: 'dispatch' (default) — { article_id } — admin only. Builds the
 *   full anchor script from the article's edited/generated scenes, renders
 *   it on Charlie's desk still, stores heygen_video_id, sets production_status
 *   to 'rendering'.
 * action: 'poll' — no auth (called by scheduled automation) — checks every
 *   article in 'rendering' against HeyGen, downloads + stores the finished
 *   MP4, flips status to 'complete' or 'failed'.
 */

const HEYGEN_API = 'https://api.heygen.com';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
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
        if (!article.heygen_video_id) continue;
        try {
          const { status, videoUrl, error } = await checkHeygenStatus(HEYGEN_API_KEY, article.heygen_video_id);
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
            } catch (_) { /* keep the HeyGen CDN url as fallback */ }

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
          } else {
            results.push({ article_id: article.id, status: 'pending' });
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

    const fullScript = pick(article.edited_full_script, article.generated_full_script) ||
      [
        pick(article.edited_opening_script, article.generated_opening_script),
        pick(article.edited_body_script, article.generated_body_script),
        pick(article.edited_closing_script, article.generated_closing_script),
      ].filter(Boolean).join(' ');

    if (!fullScript.trim()) return Response.json({ error: 'No script text found on this article' }, { status: 400 });

    const cleanScript = sanitizeVoiceScript(fullScript).slice(0, 4500);

    let talkingPhotoId;
    try {
      talkingPhotoId = await uploadCharlieDeskTalkingPhoto(HEYGEN_API_KEY);
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }

    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_inputs: [{
          character: { type: 'talking_photo', talking_photo_id: talkingPhotoId, scale: 1, offset: { x: 0, y: 0 } },
          voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: cleanScript, speed: 0.8 },
        }],
        dimension: { width: 1280, height: 720 },
      }),
    });

    const renderText = await renderRes.text();
    let renderData;
    try { renderData = JSON.parse(renderText); } catch (_) {
      return Response.json({ error: 'HeyGen render returned non-JSON', raw: renderText.slice(0, 300) }, { status: 500 });
    }
    if (!renderRes.ok || !renderData?.data?.video_id) {
      return Response.json({ error: 'HeyGen render job failed', detail: renderData }, { status: 500 });
    }

    const videoId = renderData.data.video_id;
    await base44.asServiceRole.entities.DnnArticle.update(article_id, {
      production_status: 'rendering',
      heygen_video_id: videoId,
      last_render_error: null,
      video_url: null,
    });

    return Response.json({ success: true, video_id: videoId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});