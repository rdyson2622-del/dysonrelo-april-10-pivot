import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { gatherPromptTopics, createAndDispatchBroadcast } from '../../shared/dnnPipelineDispatch.ts';

/**
 * dnnDailyVideoPipeline — "Generate Daily Broadcast" trigger.
 *
 * Creates a DnnBroadcast record and fires the n8n webhook to start the
 * Higgsfield + 11 Labs render pipeline. n8n generates the script (Gemini),
 * renders the video (Higgsfield), generates audio (11 Labs), stitches the
 * 3 scenes into one MP4, and calls back dnnRenderDispatched /
 * n8nBroadcastCallback with the result.
 *
 * Body:
 *   {
 *     prompt_topics?: string  — optional topics/headlines override
 *   }
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

    const webhookUrl = secrets.get('N8N_BROADCAST_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_BROADCAST_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    // Parse optional body
    let promptTopics = '';
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        promptTopics = String(body?.prompt_topics || '').trim();
      } catch (_) {}
    }

    // Default to today's published article headlines when no topics provided
    if (!promptTopics) {
      promptTopics = await gatherPromptTopics(base44);
    }

    const result = await createAndDispatchBroadcast(base44, {
      pipeline: 'higgsfield_11labs',
      promptTopics,
      webhookUrl,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}