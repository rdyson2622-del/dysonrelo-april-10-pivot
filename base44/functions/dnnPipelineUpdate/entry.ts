import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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

Deno.serve(async (req) => {
  try {
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

    // 3. Build update payload based on status
    const updates = { production_status: status };

    if (status === 'complete') {
      updates.video_url = videoUrl;
      updates.video_completed_at = new Date().toISOString();
      updates.render_requested = false;
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

    // 4. Update the article
    await base44.asServiceRole.entities.DnnArticle.update(articleId, updates);

    // 5. On failure, alert admin via SMS (n8n must not call notifyAdmin directly)
    if (status === 'failed') {
      let headline = articleId;
      try {
        const arr = await base44.asServiceRole.entities.DnnArticle.filter({ id: articleId });
        if (arr?.[0]?.headline) headline = arr[0].headline;
      } catch (_) {}
      await sendAdminSMS(`DNN pipeline: HeyGen video FAILED for article "${headline}" (${articleId}).`);
    }

    return Response.json({ success: true, articleId, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});