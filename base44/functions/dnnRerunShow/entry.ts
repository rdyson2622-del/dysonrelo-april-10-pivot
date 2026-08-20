import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * dnnRerunShow — re-dispatch an existing DnnBroadcast through the n8n
 * Higgsfield + 11 Labs pipeline.
 *
 * Use this when a show's stitched video has the scenes in the wrong order
 * or the render otherwise came out wrong and you want n8n to regenerate it.
 *
 * The function:
 *   1. Loads the existing broadcast (must have prompt_topics or scripts)
 *   2. Resets it to 'processing' and clears stale video/composite state
 *   3. Re-fires the n8n webhook with explicit scene_order so n8n stitches
 *      intro → content → outro in the correct order
 *
 * Payload: { broadcast_id: string }
 * Auth: admin session.
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookUrl = secrets.get('N8N_BROADCAST_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_BROADCAST_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const broadcastId = body?.broadcast_id;
    if (!broadcastId) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcastId).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    // Reset stale render state so the UI shows a clean "processing" status
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
      status: 'processing',
      heygenId: null,
      videoUrl: null,
      compositedVideoUrl: null,
      compositedRenderId: null,
      errorMessage: null,
    });

    // Re-fire the n8n webhook with explicit scene ordering + the exact
    // DNN studio backdrop (Charlie seated at the anchor desk on the LEFT,
    // Bob standing in the studio on the RIGHT) so Higgsfield renders every
    // scene against the correct set instead of a default/black background.
    const STUDIO_BACKGROUND_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
    const payload = {
      broadcast_id: broadcastId,
      prompt_topics: broadcast.prompt_topics || broadcast.headlines?.join(' | ') || "Today's top relocation and real estate market headlines",
      pipeline: 'higgsfield_11labs',
      rerun: true,
      background: {
        url: STUDIO_BACKGROUND_URL,
        description: 'DNN studio set: Charlie Simmons seated at the anchor desk on the LEFT, Bob Dyson standing in the studio on the RIGHT',
      },
      scene_order: [
        { scene: 1, field: 'intro_script', speaker: 'charlie', label: 'Intro / Opening', position: 'seated at desk, left', instruction: 'Charlie opens the show and introduces the headlines' },
        { scene: 2, field: 'content_script', speaker: 'bob', label: 'Main Content', position: 'standing, right', instruction: 'Bob explains the news story in depth' },
        { scene: 3, field: 'outro_script', speaker: 'charlie', label: 'Outro / Closing', position: 'seated at desk, left', instruction: 'Charlie closes the show and signs off' },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
        status: 'failed',
        errorMessage: `Rerun webhook returned ${res.status}: ${text.slice(0, 200)}`,
      });
      return Response.json({ error: `n8n webhook returned ${res.status}`, detail: text.slice(0, 300) }, { status: 502 });
    }

    return Response.json({
      success: true,
      broadcast_id: broadcastId,
      status: 'processing',
      pipeline: 'higgsfield_11labs',
      scene_order: payload.scene_order.map(s => `Scene ${s.scene}: ${s.label} (${s.speaker})`).join(' → '),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}