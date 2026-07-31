import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnPipelineUpdate
 *
 * Called by n8n (machine-to-machine) to update a DnnArticle's video production state.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Accepted payloads:
 *
 *  Mark rendering (no URL yet):
 *    { "articleId": "...", "status": "rendering" }
 *
 *  Mark complete (with final video):
 *    { "articleId": "...", "videoUrl": "https://...", "thumbnail": "optional", "status": "complete" }
 *
 *  Mark failed (triggers admin SMS):
 *    { "articleId": "...", "status": "failed" }
 *
 *  6AM NEWS flow — save video but keep staged:
 *    { "articleId": "...", "status": "complete", "videoUrl": "...", "thumbnail": "...",
 *      "placement": "news", "publish_status": "staged" }
 *
 *  6AM NEWS flow — publish at 6AM into /dnn-news Featured Videos:
 *    { "articleId": "...", "status": "complete", "videoUrl": "...", "thumbnail": "...",
 *      "placement": "news", "publish_status": "published" }
 *
 * videoUrl is OPTIONAL (only required/used when status = "complete").
 */

const VALID_STATUSES = ['pending', 'rendering', 'complete', 'failed', 'approved_for_render', 'needs_revision', 'pending_review'];

async function sendAdminSMS(message) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  const to = Deno.env.get('ADMIN_PHONE_NUMBER');
  if (!sid || !token || !from || !to) {
    console.warn('Twilio env not fully configured — skipping admin SMS');
    return;
  }
  const creds = btoa(`${sid}:${token}`);
  const params = new URLSearchParams({ To: to, From: from, Body: message });
  const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    console.warn('Admin SMS failed:', detail.slice(0, 200));
  }
}

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

    // 2. Validate body
    const body = await req.json();
    const {
      articleId,
      videoUrl,
      thumbnail,
      thumbnailUrl,
      status,
      heygenVideoId,
      heygen_video_id,
      renderVersion,
      render_version,
      lastRenderError,
      last_render_error,
      // New 6AM-flow fields
      placement,
      section,
      publishStatus,
      publish_status,
      publish_at_local,
      timezone,
      final_delivery_format,
      render_profile,
    } = body || {};

    if (!articleId) {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }
    if (!status || !VALID_STATUSES.includes(status)) {
      return Response.json({ error: `status is required and must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }
    if (status === 'complete' && !videoUrl) {
      return Response.json({ error: 'videoUrl is required when status is "complete"' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Resolve publish_status (accept camelCase or snake_case)
    const publishStatusValue = publishStatus || publish_status;

    // 3. Build update payload based on status
    const updates = { production_status: status };

    // Store 6AM pipeline metadata (only when provided)
    if (placement) updates.placement = placement;
    if (section) updates.section = section;
    if (publish_at_local) updates.publish_at_local = publish_at_local;
    if (timezone) updates.timezone = timezone;
    if (final_delivery_format) updates.final_delivery_format = final_delivery_format;
    if (render_profile) updates.render_profile = render_profile;

    if (status === 'complete') {
      updates.video_url = videoUrl;
      updates.video_completed_at = new Date().toISOString();
      updates.render_requested = false;
      updates.production_status = 'complete';
      const thumb = thumbnail || thumbnailUrl;
      if (thumb) updates.thumbnail_url = thumb;
    } else if (videoUrl) {
      // allow setting a URL on non-complete statuses if provided (optional)
      updates.video_url = videoUrl;
    }

    // When rendering starts, clear the render_requested flag so n8n won't re-pull it
    if (status === 'rendering') {
      updates.render_requested = false;
    }

    // Capture optional render metadata regardless of status
    const hgId = heygenVideoId || heygen_video_id;
    if (hgId !== undefined && hgId !== null) updates.heygen_video_id = hgId;

    const rv = renderVersion ?? render_version;
    if (rv !== undefined && rv !== null && Number.isFinite(Number(rv))) {
      updates.render_version = Number(rv);
    }

    // On failure, record the error message
    if (status === 'failed') {
      const errMsg = lastRenderError || last_render_error;
      if (errMsg) updates.last_render_error = String(errMsg);
    }

    // 4. Publish behavior
    //    staged: do NOT make the article public — leave DnnArticle.status untouched (remains "staged").
    //    published AND placement === "news": flip to published → appears in /dnn-news Featured Videos.
    if (status === 'complete' && publishStatusValue === 'published' && placement === 'news') {
      updates.status = 'published';
      updates.published_date = new Date().toISOString();
      // video_url + production_status complete already set above
    }

    // 5. Update the article
    await base44.asServiceRole.entities.DnnArticle.update(articleId, updates);

    // 6. On failure, alert admin via SMS (n8n must not call notifyAdmin directly)
    if (status === 'failed') {
      let headline = articleId;
      try {
        const arr = await base44.asServiceRole.entities.DnnArticle.filter({ id: articleId });
        if (arr?.[0]?.headline) headline = arr[0].headline;
      } catch (_) {}
      await sendAdminSMS(`DNN pipeline: HeyGen video FAILED for article "${headline}" (${articleId}).`);
    }

    // 7. Respond
    const responsePublishStatus = publishStatusValue || (status === 'complete' ? 'staged' : null);
    return Response.json({
      success: true,
      articleId,
      status,
      publish_status: responsePublishStatus,
      placement: placement || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});