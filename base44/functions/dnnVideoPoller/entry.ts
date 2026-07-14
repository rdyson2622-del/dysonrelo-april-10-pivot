import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnVideoPoller
 *
 * Runs every 5 minutes. Checks two types of pending HeyGen renders:
 *
 * 1. DnnNewsClip records with charlieStatus or bobStatus === 'rendering'
 *    → Downloads completed videos and stores URLs on the clip
 *
 * 2. DnnArticle records with video_url starting with "heygen:pending:"
 *    → Legacy single-anchor renders (fallback path)
 */

const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    const results = [];

    // ── 1. Check DnnNewsClip renders (tag-team banter pipeline) ──
    const clips = await base44.asServiceRole.entities.DnnNewsClip.list(undefined, 100);

    for (const clip of clips) {
      for (const role of ['charlie', 'bob']) {
        const status = clip[`${role}Status`];
        const videoId = clip[`${role}HeygenId`];

        if (status !== 'rendering' || !videoId) continue;

        try {
          const statusRes = await fetch(
            `${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`,
            { headers: { 'X-Api-Key': HEYGEN_API_KEY } }
          );
          const statusData = await statusRes.json();
          const s = statusData?.data?.status;

          console.log(`Polling clip ${clip.id} ${role} ${videoId}: status=${s}`);

          if (s === 'completed' && statusData?.data?.video_url) {
            const cdnUrl = statusData.data.video_url;
            let savedUrl = null;

            try {
              const vidRes = await fetch(cdnUrl);
              if (vidRes.ok) {
                const buf = await vidRes.arrayBuffer();
                const file = new File([buf], `dnn_clip_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
                const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                if (up?.file_url) savedUrl = up.file_url;
              }
            } catch (uploadErr) {
              console.log(`Upload failed for clip ${videoId}, using CDN URL: ${uploadErr.message}`);
            }

            if (!savedUrl) savedUrl = cdnUrl;

            await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
              [`${role}VideoUrl`]: savedUrl,
              [`${role}Status`]: 'completed',
            });
            results.push({ type: 'clip', clipId: clip.id, role, status: 'completed', video_url: savedUrl });
          } else if (s === 'failed') {
            const errMsg = statusData?.data?.error?.message || 'Render failed';
            await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
              [`${role}Status`]: 'failed',
              errorMessage: errMsg,
            });
            results.push({ type: 'clip', clipId: clip.id, role, status: 'failed', error: errMsg });
          } else {
            results.push({ type: 'clip', clipId: clip.id, role, status: 'still_rendering', heygen_status: s });
          }
        } catch (e) {
          results.push({ type: 'clip', clipId: clip.id, role, error: e.message });
        }

        await new Promise(r => setTimeout(r, 300));
      }
    }

    // ── 2. Check legacy DnnArticle renders (single-anchor fallback) ──
    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      50
    );

    const pendingArticles = articles.filter(
      a => a.video_url && a.video_url.startsWith('heygen:pending:')
    );

    for (const article of pendingArticles) {
      const videoId = article.video_url.replace('heygen:pending:', '');

      try {
        const statusRes = await fetch(
          `${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`,
          { headers: { 'X-Api-Key': HEYGEN_API_KEY } }
        );
        const statusData = await statusRes.json();
        const s = statusData?.data?.status;

        if (s === 'completed' && statusData?.data?.video_url) {
          const cdnUrl = statusData.data.video_url;
          let savedUrl = null;

          try {
            const vidRes = await fetch(cdnUrl);
            if (vidRes.ok) {
              const buf = await vidRes.arrayBuffer();
              const file = new File([buf], `dnn_${article.id}_charlie.mp4`, { type: 'video/mp4' });
              const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              if (up?.file_url) savedUrl = up.file_url;
            }
          } catch (uploadErr) {
            console.log(`Upload failed for ${videoId}, using CDN URL: ${uploadErr.message}`);
          }

          if (!savedUrl) savedUrl = cdnUrl;

          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            video_url: savedUrl,
            production_status: 'complete',
            video_completed_at: new Date().toISOString(),
          });
          results.push({ type: 'article', article_id: article.id, headline: article.headline, status: 'completed', video_url: savedUrl });
        } else if (s === 'failed') {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            video_url: null,
            production_status: 'failed',
            last_render_error: statusData?.data?.error?.message || 'Render failed',
          });
          results.push({ type: 'article', article_id: article.id, headline: article.headline, status: 'failed' });
        } else {
          results.push({ type: 'article', article_id: article.id, headline: article.headline, status: 'still_rendering' });
        }
      } catch (e) {
        results.push({ type: 'article', article_id: article.id, error: e.message });
      }

      await new Promise(r => setTimeout(r, 300));
    }

    return Response.json({ checked: results.length, results });
  } catch (error) {
    console.error('dnnVideoPoller error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});