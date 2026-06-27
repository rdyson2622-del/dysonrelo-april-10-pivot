import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2PullApproved
 *
 * M2M endpoint called by n8n to pull CharliePageExplainer records that are
 * approved and queued for rendering.
 *
 * Auth: x-pipeline-secret header must match N8N_PIPELINE_SECRET.
 *
 * Render trigger: scriptStatus = "approved" AND renderStatus = "queued".
 * For backwards compatibility, records still in "not_started" are also returned.
 *
 * Clean lifecycle:
 *   new → needs_review → approved → queued → rendering → heygen_completed → composing → completed
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
    });

    const payload = explainers.map((e) => ({
      explainerId: e.id,
      pageId: e.pageId,
      pageKey: e.pageKey,
      pageTitle: e.pageTitle,
      pageUrl: e.pageUrl,
      pageScreenshotUrl: e.pageScreenshotUrl,
      finalScript: e.finalScript,
      avatarId: e.avatarId,
      voiceId: e.voiceId,
      charliePosition: e.charliePosition,
      charlieBoxWidth: e.charlieBoxWidth,
      charlieBoxHeight: e.charlieBoxHeight,
      renderStatus: e.renderStatus,
    }));

    return Response.json({ success: true, count: payload.length, explainers: payload });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});