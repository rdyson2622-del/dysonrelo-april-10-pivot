import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2UpdateRender
 *
 * M2M endpoint called by n8n to update a CharliePageExplainer's render lifecycle.
 *
 * Auth: x-pipeline-secret header must match N8N_PIPELINE_SECRET.
 *
 * Body:
 *   {
 *     explainerId: string (required),
 *     renderStatus: "queued" | "rendering" | "heygen_completed" | "composing" | "completed" | "failed",
 *     heygenVideoId?, heygenVideoUrl?, cloudinaryAvatarPublicId?, cloudinaryFinalPublicId?,
 *     finalVideoUrl?, thumbnailUrl?, durationSeconds?, errorMessage?
 *   }
 *
 * When renderStatus = "completed", a CharlieVideoLibrary record is upserted
 * (updated if one already exists for this explainerId, otherwise created).
 */
const VALID_RENDER_STATUSES = ['queued', 'rendering', 'heygen_completed', 'composing', 'completed', 'failed'];

Deno.serve(async (req) => {
  try {
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
    const {
      explainerId,
      renderStatus,
      heygenVideoId,
      heygenVideoUrl,
      cloudinaryAvatarPublicId,
      cloudinaryFinalPublicId,
      finalVideoUrl,
      thumbnailUrl,
      durationSeconds,
      errorMessage,
    } = body || {};

    if (!explainerId) {
      return Response.json({ error: 'explainerId is required' }, { status: 400 });
    }
    if (!renderStatus || !VALID_RENDER_STATUSES.includes(renderStatus)) {
      return Response.json({ error: `renderStatus must be one of: ${VALID_RENDER_STATUSES.join(', ')}` }, { status: 400 });
    }

    const explainerArr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = explainerArr?.[0];
    if (!explainer) {
      return Response.json({ error: 'Explainer not found' }, { status: 404 });
    }

    const updates = { renderStatus };
    if (heygenVideoId !== undefined) updates.heygenVideoId = heygenVideoId;
    if (heygenVideoUrl !== undefined) updates.heygenVideoUrl = heygenVideoUrl;
    if (cloudinaryAvatarPublicId !== undefined) updates.cloudinaryAvatarPublicId = cloudinaryAvatarPublicId;
    if (cloudinaryFinalPublicId !== undefined) updates.cloudinaryFinalPublicId = cloudinaryFinalPublicId;
    if (finalVideoUrl !== undefined) updates.finalVideoUrl = finalVideoUrl;
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

    return Response.json({ success: true, explainerId, renderStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});