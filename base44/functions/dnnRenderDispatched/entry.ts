import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * dnnRenderDispatched — STAGE 1 callback from n8n Workflow 1.
 *
 * n8n Workflow 1 (Script & Dispatch) calls this AFTER it has:
 *   1. Generated the script via Gemini
 *   2. Sent the render request to HeyGen (/v2/video/generate)
 *   3. Received the heygen video_id back
 *
 * This endpoint stores the HeyGen job id and flips status → "rendering".
 * n8n Workflow 1 then ENDS immediately (no Wait node, no polling).
 * HeyGen will call n8n Workflow 2's webhook listener independently when done.
 *
 * Payload (multi-scene — Charlie Intro → Bob Content → Charlie Outro):
 *   {
 *     "broadcast_id":    "<DnnBroadcast id>",
 *     "heygen_video_id":  "<HeyGen job id — single multi-scene render>",
 *     "intro_script":     "<Scene 1 — Charlie>",
 *     "content_script":   "<Scene 2 — Bob>",
 *     "outro_script":      "<Scene 3 — Charlie>",
 *     "script":           "<optional — combined full script for backward compat>",
 *     "pipeline_secret": "<N8N_PIPELINE_SECRET>"   // or x-pipeline-secret header
 *   }
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

    const { broadcast_id, heygen_video_id, script, intro_script, content_script, outro_script } = body || {};
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }
    if (!heygen_video_id) {
      return Response.json({ error: 'heygen_video_id is required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const update = {
      status: 'rendering',
      heygenId: heygen_video_id,
      errorMessage: null,
    };
    if (script && typeof script === 'string') {
      update.script = script;
    }
    if (intro_script && typeof intro_script === 'string') {
      update.intro_script = intro_script;
    }
    if (content_script && typeof content_script === 'string') {
      update.content_script = content_script;
    }
    if (outro_script && typeof outro_script === 'string') {
      update.outro_script = outro_script;
    }

    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, update);

    return Response.json({
      success: true,
      broadcast_id,
      status: 'rendering',
      heygen_video_id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}