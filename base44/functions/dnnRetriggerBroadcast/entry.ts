import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Active HeyGen presenter config — passed through to n8n.
const DEFAULT_AVATAR_ID = '41f40b894f6944188c7908253b12e921'; // Charlie Simmons
const DEFAULT_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';  // Charlie voice

/**
 * dnnRetriggerBroadcast — re-fires the n8n webhook for an EXISTING broadcast.
 *
 * Unlike dnnDailyVideoPipeline (which always creates a new show), this re-uses
 * an existing DnnBroadcast record by id, resets it to "processing", and sends
 * the same payload to the n8n webhook so the external pipeline can render it.
 *
 * Body:
 *   { broadcast_id: string }
 *
 * Auth: admin session.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const broadcastId = body?.broadcast_id;
    if (!broadcastId) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const webhookUrl = secrets.get('N8N_BROADCAST_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_BROADCAST_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;
    const broadcast = await Broadcasts.get(broadcastId).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const promptTopics = broadcast.prompt_topics || "Today's top relocation and real estate market headlines";

    // Reset to draft (Scripting stage) — n8n W1 will generate script, dispatch to
    // HeyGen, then call dnnRenderDispatched to flip status → "rendering".
    await Broadcasts.update(broadcastId, {
      status: 'draft',
      errorMessage: '',
      videoUrl: '',
      heygenId: '',
    });

    // Fire the n8n webhook
    let webhookStatus = 'sent';
    let webhookDetail = '';
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcast_id: broadcastId,
          prompt_topics: promptTopics,
          avatar_id: DEFAULT_AVATAR_ID,
          voice_id: DEFAULT_VOICE_ID,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        webhookStatus = `failed (${res.status})`;
        webhookDetail = text.slice(0, 300);
        await Broadcasts.update(broadcastId, {
          status: 'failed',
          errorMessage: `n8n webhook returned ${res.status}: ${text.slice(0, 200)}`,
        });
      }
    } catch (err) {
      webhookStatus = `error: ${err.message}`;
      await Broadcasts.update(broadcastId, {
        status: 'failed',
        errorMessage: `n8n webhook error: ${err.message}`,
      });
    }

    return Response.json({
      success: webhookStatus === 'sent',
      broadcast_id: broadcastId,
      show_name: broadcast.show_name,
      webhook: webhookStatus,
      detail: webhookDetail,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}