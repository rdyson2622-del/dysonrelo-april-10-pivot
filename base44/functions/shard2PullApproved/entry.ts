import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2PullApproved
 *
 * M2M endpoint called by n8n to pull CharliePageExplainer records that are
 * ready for rendering (scriptStatus = "approved" AND renderStatus = "queued").
 * Backwards-compat: approved records still in "not_started" are also returned.
 *
 * Auth: x-pipeline-secret header must match N8N_PIPELINE_SECRET.
 *
 * Request body:
 *   { "limit": 1 }   // optional, default 1
 *
 * Response:
 *   {
 *     "items": [
 *       {
 *         "id": "record_id",
 *         "script": "voice script for Ruben",
 *         "pageScreenshotUrl": "public image URL",
 *         "renderStatus": "queued",
 *         // extra fields for HeyGen Template API:
 *         "pageTitle", "pageUrl", "avatarId", "voiceId",
 *         "charliePosition", "charlieBoxWidth", "charlieBoxHeight"
 *       }
 *     ],
 *     "count": 1
 *   }
 */
Deno.serve(async (req) => {
  try {
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const limit = Number(body?.limit) > 0 ? Number(body.limit) : 1;

    const base44 = createClientFromRequest(req);

    // Primary render trigger: approved + queued
    const queued = await base44.asServiceRole.entities.CharliePageExplainer.filter({
      scriptStatus: 'approved',
      renderStatus: 'queued',
    });

    // Backwards-compat: approved scripts that were never moved out of not_started
    const notStarted = await base44.asServiceRole.entities.CharliePageExplainer.filter({
      scriptStatus: 'approved',
      renderStatus: 'not_started',
    });

    const seen = new Set();
    const explainers = [...queued, ...notStarted].filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    }).slice(0, limit);

    const items = explainers.map((e) => ({
      id: e.id,
      script: e.finalScript,
      pageScreenshotUrl: e.pageScreenshotUrl,
      renderStatus: e.renderStatus,
      pageTitle: e.pageTitle,
      pageUrl: e.pageUrl,
      avatarId: e.avatarId,
      voiceId: e.voiceId,
      charliePosition: e.charliePosition,
      charlieBoxWidth: e.charlieBoxWidth,
      charlieBoxHeight: e.charlieBoxHeight,
    }));

    return Response.json({ items, count: items.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});