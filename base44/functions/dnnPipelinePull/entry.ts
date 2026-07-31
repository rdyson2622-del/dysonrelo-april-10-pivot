import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnPipelinePull
 *
 * Machine-to-machine endpoint for n8n to fetch DnnArticle records that still
 * need Shard 1 video production (no video produced yet).
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Optional body: { "limit": 10 }  (defaults to 10, max 50)
 *
 * Returns:
 * {
 *   "articles": [
 *     { "id", "headline", "body", "dateline", "trigger_type" }
 *   ]
 * }
 *
 * "Needs video" = production_status is missing / "none" / "failed".
 * (rendering, pending, and complete are excluded so n8n never double-processes.)
 */

import { blockIfN8n } from '../../shared/n8nGuard.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // 1. Shared-secret auth
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse optional limit
    let limit = 10;
    try {
      const body = await req.json();
      if (body && Number.isFinite(body.limit)) {
        limit = Math.min(Math.max(parseInt(body.limit, 10), 1), 50);
      }
    } catch (_) {
      // no body — use default
    }

    const base44 = createClientFromRequest(req);

    // 3. Fetch recent articles, then filter for those needing video.
    //    We pull a generous batch and filter in-memory since "needs video"
    //    spans missing / none / failed states.
    const recent = await base44.asServiceRole.entities.DnnArticle.list('-generated_date', 200);

    const needsVideo = recent.filter((a) => {
      const ps = a.production_status;
      return !ps || ps === 'none' || ps === 'failed';
    });

    const articles = needsVideo.slice(0, limit).map((a) => ({
      id: a.id,
      headline: a.headline,
      body: a.body,
      dateline: a.dateline,
      trigger_type: a.trigger_type,
    }));

    return Response.json({ articles });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});