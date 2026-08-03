import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * dnnTriggerDistribution — STAGE 3 trigger.
 *
 * Fired automatically by a Base44 entity automation whenever a DnnBroadcast
 * record's status transitions to "ready" (i.e. n8n Workflow 2 just uploaded the
 * final MP4 and set status=ready).
 *
 * This function fetches the broadcast and fires n8n Workflow 3 (Multi-Channel
 * Publishing) webhook so n8n can publish to LinkedIn, Facebook, Instagram,
 * SMS, and email concurrently — each with isolated retry logic.
 *
 * When n8n Workflow 3 finishes publishing, it calls dnnPublishComplete to
 * flip status → "completed" and record published_at.
 *
 * Trigger: entity automation on DnnBroadcast update (status → "ready")
 *   Payload shape: { event, data, old_data, changed_fields }
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const webhookUrl = secrets.get('N8N_DISTRIBUTION_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_DISTRIBUTION_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch (_) { body = {}; }

    // Entity automation payload: { event: {type, entity_name, entity_id}, data, old_data, changed_fields }
    const broadcastId = body?.event?.entity_id || body?.data?.id || body?.entity_id;
    if (!broadcastId) {
      return Response.json({ error: 'No broadcast id in automation payload' }, { status: 400 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcastId).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    if (broadcast.status !== 'ready') {
      return Response.json({ skipped: true, reason: `status is '${broadcast.status}', not 'ready'` });
    }

    if (!broadcast.videoUrl) {
      return Response.json({ error: 'Broadcast has no videoUrl — cannot distribute' }, { status: 400 });
    }

    // Fire n8n Workflow 3 — Multi-Channel Publishing
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        broadcast_id: broadcastId,
        video_url: broadcast.videoUrl,
        show_name: broadcast.show_name,
        show_number: broadcast.show_number,
        broadcast_date: broadcast.broadcast_date,
        script: broadcast.script,
        headlines: broadcast.headlines || [],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return Response.json({
        error: `n8n distribution webhook returned ${res.status}`,
        detail: text.slice(0, 300),
      }, { status: 502 });
    }

    return Response.json({
      success: true,
      broadcast_id: broadcastId,
      distribution_triggered: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}