import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnDailyVideoPipeline
 *
 * The full daily pipeline:
 *   1. Grabs the latest published DNN article that has no video yet
 *   2. Generates a white-labeled Charlie newscaster script (DNN branded)
 *   3. Submits to HeyGen with Charlie's avatar + voice
 *   4. Polls HeyGen until the render completes (up to ~100 seconds)
 *   5. Downloads the finished MP4 and stores the URL on the article
 *
 * If the render doesn't finish within the polling window, the pending
 * video_id is saved on the article (heygen:pending:{id}) so dnnVideoPoller
 * can pick it up on the next 5-minute cycle.
 *
 * Scheduled daily at 5:10 AM PT — articles are generated at 5:00 AM,
 * video is ready by ~5:30 AM, and dnnSocialBlast posts it at 6:00 AM.
 */

const HEYGEN_API = 'https://api.heygen.com';

// Charlie Simmons — DNN anchor avatar + voice
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    // 1. Get the most recent published article without a completed video
    const published = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      20
    );

    // Skip articles that already have a real video URL (not pending)
    const candidates = published.filter(
      a => !a.video_url || a.video_url.startsWith('heygen:pending:')
    );

    if (!candidates.length) {
      return Response.json({ message: 'No articles pending video render' });
    }

    const article = candidates[0];

    // 2. Generate a white-labeled Charlie newscaster script
    const solutionParts = [];
    if (article.client_solution) solutionParts.push(`For clients: ${article.client_solution}`);
    if (article.agent_solution) solutionParts.push(`For agents: ${article.agent_solution}`);
    if (article.vendor_solution) solutionParts.push(`For vendors: ${article.vendor_solution}`);
    const solutionText = solutionParts.join(' ');

    const scriptResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are writing a spoken newscast script for Charlie Simmons, the DNN Intelligence Bureau anchor.
Write in a professional, authoritative broadcast style — like a national news anchor delivering a brief.
Keep it natural and conversational. No stage directions, no brackets, no headers.

Based on this article:
HEADLINE: ${article.headline}
DATELINE: ${article.dateline || ''}
BODY: ${article.body}

${solutionText ? `SOLUTIONS TO MENTION: ${solutionText}` : ''}

Write a single continuous script (no scene breaks, no labels) that:
1. Opens with the DNN branding: "Good morning, this is your DNN Intelligence Brief from Dyson and Dyson Real Estate Concierge."
2. Delivers the headline and the key facts from the article (don't just read it — rephrase naturally for spoken delivery).
3. Covers the solutions — what clients, agents, and vendors should do about this news.
4. Closes with: "This has been your DNN Intelligence Brief. Subscribe for daily market intelligence at dysonanddyson.com."

Keep the total script under 250 words. Natural spoken language only.`,
      response_json_schema: {
        type: 'object',
        properties: {
          script: { type: 'string' }
        }
      }
    });

    const charlieScript = scriptResult?.script || `${article.headline}. ${article.body}`;
    // Clean up any markdown artifacts
    const cleanScript = charlieScript.replace(/[*_#`]/g, '').replace(/\n{3,}/g, '\n\n').trim();

    // 3. Submit to HeyGen with Charlie's avatar + voice
    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: CHARLIE_AVATAR_ID,
            avatar_style: 'normal',
          },
          voice: {
            type: 'text',
            voice_id: CHARLIE_VOICE_ID,
            input_text: cleanScript,
          },
          background: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1502164980785-d860d4919b56?w=1920&q=80',
          },
        }],
        dimension: { width: 1280, height: 720 },
      }),
    });

    let renderData;
    try { renderData = await renderRes.json(); } catch (_) {
      renderData = {};
    }

    if (!renderRes.ok || !renderData?.data?.video_id) {
      console.error('HeyGen render failed:', JSON.stringify(renderData));
      return Response.json({
        error: 'HeyGen render failed',
        detail: renderData?.error || renderData,
        article_id: article.id,
      }, { status: 500 });
    }

    const videoId = renderData.data.video_id;

    // Mark the article as pending render
    await base44.asServiceRole.entities.DnnArticle.update(article.id, {
      video_url: `heygen:pending:${videoId}`,
      production_status: 'rendering',
    });

    console.log(`HeyGen render submitted: video_id=${videoId} for article "${article.headline}"`);

    // 4. Poll for completion (up to ~100 seconds)
    let renderStatus = 'processing';
    let videoUrl = null;

    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise(r => setTimeout(r, 10000)); // 10 second intervals

      const statusRes = await fetch(
        `${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`,
        { headers: { 'X-Api-Key': HEYGEN_API_KEY } }
      );
      const statusData = await statusRes.json();
      const s = statusData?.data?.status;

      console.log(`Poll attempt ${attempt + 1}: status=${s}`);

      if (s === 'completed' && statusData?.data?.video_url) {
        videoUrl = statusData.data.video_url;
        renderStatus = 'completed';
        break;
      }
      if (s === 'failed') {
        renderStatus = 'failed';
        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          video_url: null,
          production_status: 'failed',
          last_render_error: statusData?.data?.error?.message || 'Render failed',
        });
        return Response.json({
          error: 'HeyGen render failed',
          article_id: article.id,
          detail: statusData?.data?.error,
        }, { status: 500 });
      }
    }

    // 5. If completed, download and store the video
    if (renderStatus === 'completed' && videoUrl) {
      const vidRes = await fetch(videoUrl);
      if (!vidRes.ok) {
        // Video URL is from HeyGen CDN — save it directly even if download fails
        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          video_url: videoUrl,
          production_status: 'complete',
          video_completed_at: new Date().toISOString(),
        });
        return Response.json({
          success: true,
          article_id: article.id,
          headline: article.headline,
          video_url: videoUrl,
          note: 'Video URL saved from HeyGen CDN (download skipped)',
        });
      }

      const buf = await vidRes.arrayBuffer();
      const file = new File([buf], `dnn_${article.id}_charlie.mp4`, { type: 'video/mp4' });
      const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

      await base44.asServiceRole.entities.DnnArticle.update(article.id, {
        video_url: up.file_url,
        production_status: 'complete',
        video_completed_at: new Date().toISOString(),
      });

      return Response.json({
        success: true,
        article_id: article.id,
        headline: article.headline,
        video_url: up.file_url,
      });
    }

    // Still rendering after polling window — poller will pick it up
    return Response.json({
      success: true,
      status: 'still_rendering',
      article_id: article.id,
      headline: article.headline,
      video_id: videoId,
      message: 'Render submitted but not complete within polling window. dnnVideoPoller will check every 5 minutes.',
    });

  } catch (error) {
    console.error('dnnDailyVideoPipeline error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});