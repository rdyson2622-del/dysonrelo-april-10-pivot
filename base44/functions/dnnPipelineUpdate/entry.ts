import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnPipelineUpdate
 *
 * Called by n8n (machine-to-machine) after it finishes producing a video.
 * Updates an existing DnnArticle with the final video URL and marks production complete.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Body:
 * {
 *   "articleId": "...",
 *   "videoUrl": "https://...",
 *   "thumbnailUrl": "optional",
 *   "status": "complete"
 * }
 */

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // 1. Shared-secret auth — no user session for machine-to-machine calls
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate body
    const body = await req.json();
    const { articleId, videoUrl, thumbnailUrl, status } = body || {};

    if (!articleId) {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }
    if (!videoUrl) {
      return Response.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // 3. Build update payload
    const updates = {
      video_url: videoUrl,
      production_status: status || 'complete',
      video_completed_at: new Date().toISOString(),
    };
    if (thumbnailUrl) {
      updates.thumbnail_url = thumbnailUrl;
    }

    // 4. Update the article using service role (admin privileges)
    await base44.asServiceRole.entities.DnnArticle.update(articleId, updates);

    return Response.json({
      success: true,
      articleId,
      videoUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});