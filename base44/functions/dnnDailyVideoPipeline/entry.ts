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
 * Batch mode (POST { batch: true }): submits renders for ALL pending articles
 * without polling — the dnnVideoPoller (every 5 min) handles completion.
 *
 * Scheduled daily at 5:15 AM PT — articles are generated at 5:00 AM,
 * video is ready by ~5:45 AM, and dnnSocialBlast posts it at 6:00 AM.
 */

const HEYGEN_API = 'https://api.heygen.com';

// Charlie Simmons — DNN anchor avatar + voice
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

// DNN Intelligence Bureau studio background — generated image of a professional
// news desk set with monitor wall, used as the HeyGen video background
const DNN_STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f408a6a7_generated_image.png';

// Build the LLM script prompt for a given article
function buildScriptPrompt(article) {
  const solutionParts = [];
  if (article.client_solution) solutionParts.push(`For clients: ${article.client_solution}`);
  if (article.agent_solution) solutionParts.push(`For agents: ${article.agent_solution}`);
  if (article.vendor_solution) solutionParts.push(`For vendors: ${article.vendor_solution}`);
  const solutionText = solutionParts.join(' ');

  return `You are writing a spoken newscast script for Charlie Simmons, the DNN Intelligence Bureau anchor.
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

Keep the total script under 250 words. Natural spoken language only.`;
}

// Submit a render request to HeyGen and return { video_id } or null
async function submitHeyGenRender(cleanScript, heygenApiKey) {
  const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: {
      'X-Api-Key': heygenApiKey,
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
          url: DNN_STUDIO_BG_URL,
        },
      }],
      dimension: { width: 1280, height: 720 },
    }),
  });

  let renderData;
  try { renderData = await renderRes.json(); } catch (_) { renderData = {}; }

  if (!renderRes.ok || !renderData?.data?.video_id) {
    console.error('HeyGen render failed:', JSON.stringify(renderData));
    return null;
  }

  return renderData.data.video_id;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    // Parse batch mode from request body
    let batchMode = false;
    if (req.method === 'POST') {
      try { const body = await req.json(); batchMode = body.batch === true; } catch (_) {}
    }

    // 1. Get published articles without a completed video
    const published = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      batchMode ? 50 : 20
    );

    const candidates = published.filter(
      a => !a.video_url || a.video_url.startsWith('heygen:pending:')
    );

    if (!candidates.length) {
      return Response.json({ message: 'No articles pending video render' });
    }

    // ── BATCH MODE: submit all pending articles, no polling ──
    if (batchMode) {
      const toRender = candidates.filter(a => !a.video_url);
      const results = [];

      for (const article of toRender) {
        try {
          const scriptResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: buildScriptPrompt(article),
            response_json_schema: {
              type: 'object',
              properties: { script: { type: 'string' } }
            }
          });

          const cleanScript = (scriptResult?.script || `${article.headline}. ${article.body}`)
            .replace(/[*_#`]/g, '').replace(/\n{3,}/g, '\n\n').trim();

          const videoId = await submitHeyGenRender(cleanScript, HEYGEN_API_KEY);

          if (videoId) {
            await base44.asServiceRole.entities.DnnArticle.update(article.id, {
              video_url: `heygen:pending:${videoId}`,
              production_status: 'rendering',
            });
            results.push({ article_id: article.id, headline: article.headline, video_id: videoId, status: 'submitted' });
            console.log(`Batch render submitted: ${videoId} for "${article.headline}"`);
          } else {
            results.push({ article_id: article.id, headline: article.headline, status: 'failed', error: 'HeyGen submission failed' });
          }
        } catch (e) {
          results.push({ article_id: article.id, headline: article.headline, status: 'failed', error: e.message });
        }
      }

      const submitted = results.filter(r => r.status === 'submitted').length;
      const failed = results.filter(r => r.status === 'failed').length;

      return Response.json({
        batch: true,
        total: results.length,
        submitted,
        failed,
        results,
      });
    }

    // ── SINGLE MODE: one article, with polling ──
    const article = candidates[0];

    // 2. Generate script
    const scriptResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: buildScriptPrompt(article),
      response_json_schema: {
        type: 'object',
        properties: { script: { type: 'string' } }
      }
    });

    const charlieScript = scriptResult?.script || `${article.headline}. ${article.body}`;
    const cleanScript = charlieScript.replace(/[*_#`]/g, '').replace(/\n{3,}/g, '\n\n').trim();

    // 3. Submit to HeyGen
    const videoId = await submitHeyGenRender(cleanScript, HEYGEN_API_KEY);

    if (!videoId) {
      return Response.json({
        error: 'HeyGen render failed',
        article_id: article.id,
      }, { status: 500 });
    }

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
      await new Promise(r => setTimeout(r, 10000));

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