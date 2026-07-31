import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2UpdateRender
 *
 * M2M endpoint called by n8n to update a CharliePageExplainer's render lifecycle.
 *
 * Auth: x-pipeline-secret header must match N8N_PIPELINE_SECRET.
 *
 * n8n-friendly body (matches Shard1-style naming):
 *   {
 *     "articleId": "record_id",          // required (alias: explainerId)
 *     "status": "rendering",             // required (alias: renderStatus)
 *     "heygen_video_id": "video_id",     // optional
 *     "videoUrl": "final_video_url",     // optional (on complete)
 *     "thumbnail": "thumbnail_url",      // optional (on complete)
 *     "last_render_error": "error msg"   // optional (on failed)
 *   }
 *
 * Accepted status values: queued | rendering | heygen_completed | composing | complete | completed | failed
 * ("complete" is normalized to "completed").
 *
 * When status = complete/completed, a CharlieVideoLibrary record is upserted.
 */
const STATUS_MAP = {
  queued: 'queued',
  rendering: 'rendering',
  heygen_completed: 'heygen_completed',
  composing: 'composing',
  complete: 'completed',
  completed: 'completed',
  failed: 'failed',
};

import { blockIfN8n } from '../../shared/n8nGuard.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Accept both n8n naming and internal naming
    const explainerId = body.articleId || body.explainerId;
    const rawStatus = body.status || body.renderStatus;
    const heygenVideoId = body.heygen_video_id ?? body.heygenVideoId;
    const finalVideoUrl = body.videoUrl ?? body.finalVideoUrl;
    const presenterVideoUrl = body.presenterVideoUrl ?? body.avatarVideoUrl ?? body.charlieVideoUrl;
    const thumbnailUrl = body.thumbnail ?? body.thumbnailUrl;
    const errorMessage = body.last_render_error ?? body.errorMessage;
    const durationSeconds = body.durationSeconds;
    const heygenVideoUrl = body.heygenVideoUrl;

    if (!explainerId) {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }
    const renderStatus = STATUS_MAP[rawStatus];
    if (!renderStatus) {
      return Response.json({ error: `status must be one of: ${Object.keys(STATUS_MAP).join(', ')}` }, { status: 400 });
    }

    const explainerArr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = explainerArr?.[0];
    if (!explainer) {
      return Response.json({ error: 'Explainer not found' }, { status: 404 });
    }

    const updates = { renderStatus };
    if (heygenVideoId !== undefined) updates.heygenVideoId = heygenVideoId;
    if (heygenVideoUrl !== undefined) updates.heygenVideoUrl = heygenVideoUrl;
    if (finalVideoUrl !== undefined) updates.finalVideoUrl = finalVideoUrl;
    if (presenterVideoUrl !== undefined) updates.presenterVideoUrl = presenterVideoUrl;
    if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl;
    if (durationSeconds !== undefined) updates.durationSeconds = durationSeconds;
    if (renderStatus === 'failed' && errorMessage) updates.errorMessage = String(errorMessage);

    await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, updates);

    // On completion, upsert a CharlieVideoLibrary record (no duplicates per explainerId)
    if (renderStatus === 'completed') {
      const finalUrl = finalVideoUrl || explainer.finalVideoUrl;
      const thumb = thumbnailUrl || explainer.thumbnailUrl;
      const duration = durationSeconds ?? explainer.durationSeconds;

      const existing = await base44.asServiceRole.entities.CharlieVideoLibrary.filter({ explainerId });
      const libData = {
        explainerId,
        pageTitle: explainer.pageTitle,
        videoTitle: explainer.pageTitle,
        finalVideoUrl: finalUrl,
        thumbnailUrl: thumb,
        durationSeconds: duration,
        status: 'completed',
      };

      if (existing && existing.length > 0) {
        await base44.asServiceRole.entities.CharlieVideoLibrary.update(existing[0].id, libData);
      } else {
        await base44.asServiceRole.entities.CharlieVideoLibrary.create(libData);
      }
    }

    return Response.json({ success: true, articleId: explainerId, status: renderStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});