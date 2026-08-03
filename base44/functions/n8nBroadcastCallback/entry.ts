import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * n8nBroadcastCallback — incoming webhook from n8n.
 *
 * n8n calls this endpoint once the full broadcast render (HeyGen + Creatomate)
 * is complete and the final 1080p MP4 is uploaded.
 *
 * Payload:
 *   {
 *     "broadcast_id": "<BROADCAST_ID>",
 *     "status": "ready",
 *     "video_url": "<FINAL_1080P_MP4_URL>"
 *   }
 *
 * Auth: validated against N8N_PIPELINE_SECRET (sent as `x-pipeline-secret`
 * header or `pipeline_secret` body field) so only n8n can flip records.
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const pipelineSecret = secrets.get('N8N_PIPELINE_SECRET');
    if (!pipelineSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET is not configured' }, { status: 500 });
    }

    const headerSecret = req.headers.get('x-pipeline-secret');
    let body;
    try { body = await req.json(); } catch (_) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const bodySecret = body?.pipeline_secret;
    if (pipelineSecret !== headerSecret && pipelineSecret !== bodySecret) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { broadcast_id, status, video_url } = body || {};
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Verify the broadcast exists
    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const finalStatus = status === 'ready' ? 'ready' : (status || 'ready');

    if (!video_url || typeof video_url !== 'string') {
      // n8n may report a failure
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, {
        status: 'failed',
        errorMessage: body?.error || 'n8n callback received without video_url',
      });
      return Response.json({ success: false, status: 'failed', broadcast_id });
    }

    // Defensive: n8n W2 has a bug injecting a stray "mp/" segment into the
    // Base44 public file path (/files/mp/public/... → /files/public/...).
    // Strip it so the stored URL always resolves, regardless of the n8n fix.
    const safeVideoUrl = video_url.replace('/files/mp/public/', '/files/public/');

    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, {
      status: finalStatus,
      videoUrl: safeVideoUrl,
      errorMessage: null,
    });

    return Response.json({
      success: true,
      broadcast_id,
      status: finalStatus,
      video_url: safeVideoUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}