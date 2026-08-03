import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * dnnPublishComplete — STAGE 3 callback from n8n Workflow 3.
 *
 * n8n Workflow 3 (Multi-Channel Publishing) calls this AFTER it has finished
 * publishing the broadcast to all distribution channels (LinkedIn, Facebook,
 * Instagram, SMS, email). Each channel publishes independently with isolated
 * retry — a single channel failure does not block the others.
 *
 * Payload:
 *   {
 *     "broadcast_id":        "<DnnBroadcast id>",
 *     "distribution_results": [
 *       { "channel": "linkedin", "status": "sent", "post_id": "urn:li:..." },
 *       { "channel": "facebook", "status": "sent", "post_id": "123_456" },
 *       { "channel": "instagram", "status": "failed", "error": "token expired" },
 *       { "channel": "subscriber_email", "status": "sent", "recipient_count": 142 }
 *     ],
 *     "pipeline_secret": "<N8N_PIPELINE_SECRET>"   // or x-pipeline-secret header
 *   }
 *
 * This endpoint merges the results into the broadcast's distribution array,
 * sets status → "completed", and stamps published_at.
 *
 * Auth: validated against N8N_PIPELINE_SECRET so only n8n can call this.
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

    const { broadcast_id, distribution_results } = body || {};
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const existingDist = broadcast.distribution || [];
    const newDist = Array.isArray(distribution_results) ? distribution_results : [];

    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, {
      status: 'completed',
      published_at: new Date().toISOString(),
      distribution: [...existingDist, ...newDist],
    });

    return Response.json({
      success: true,
      broadcast_id,
      status: 'completed',
      channels_published: newDist.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}