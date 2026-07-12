import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnVideoPoller
 *
 * Runs every 5 minutes. Finds DNN articles with a pending HeyGen render
 * (video_url starts with "heygen:pending:") and checks if the render
 * is complete. When complete, downloads the video and stores the URL.
 *
 * This is the backup for renders that don't finish within the
 * dnnDailyVideoPipeline's 100-second polling window.
 */

const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    // Find all articles with pending renders
    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      50
    );

    const pending = articles.filter(
      a => a.video_url && a.video_url.startsWith('heygen:pending:')
    );

    if (!pending.length) {
      return Response.json({ message: 'No pending renders to check' });
    }

    const results = [];

    for (const article of pending) {
      const videoId = article.video_url.replace('heygen:pending:', '');

      try {
        const statusRes = await fetch(
          `${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`,
          { headers: { 'X-Api-Key': HEYGEN_API_KEY } }
        );
        const statusData = await statusRes.json();
        const s = statusData?.data?.status;
        console.log(`Polling ${videoId}: status=${s}, raw=${JSON.stringify(statusData?.data).slice(0, 300)}`);

        if (s === 'completed' && statusData?.data?.video_url) {
          const cdnUrl = statusData.data.video_url;
          let savedUrl = null;

          // Try to download and re-upload to Base44 storage
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

          // Fallback: save the HeyGen CDN URL directly
          if (!savedUrl) savedUrl = cdnUrl;

          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            video_url: savedUrl,
            production_status: 'complete',
            video_completed_at: new Date().toISOString(),
          });
          results.push({ article_id: article.id, headline: article.headline, status: 'completed', video_url: savedUrl, uploaded: savedUrl !== cdnUrl });
        } else if (s === 'failed') {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            video_url: null,
            production_status: 'failed',
            last_render_error: statusData?.data?.error?.message || 'Render failed',
          });
          results.push({ article_id: article.id, headline: article.headline, status: 'failed' });
        } else {
          results.push({ article_id: article.id, headline: article.headline, status: 'still_rendering', heygen_status: s, raw: statusData?.data });
        }
      } catch (e) {
        results.push({ article_id: article.id, error: e.message });
      }

      // Small delay between checks
      await new Promise(r => setTimeout(r, 500));
    }

    return Response.json({ checked: pending.length, results });
  } catch (error) {
    console.error('dnnVideoPoller error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});