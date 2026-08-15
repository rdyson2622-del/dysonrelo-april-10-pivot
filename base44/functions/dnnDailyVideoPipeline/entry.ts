import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { gatherPromptTopics, createAndDispatchBroadcast } from '../../shared/dnnPipelineDispatch.ts';

// Active HeyGen presenter config — passed through to n8n so the external
// pipeline renders with the correct anchor avatar + voice.
const DEFAULT_AVATAR_ID = '41f40b894f6944188c7908253b12e921'; // Charlie Simmons
const DEFAULT_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';  // Charlie voice

/**
 * dnnDailyVideoPipeline — "Generate Daily Broadcast" trigger.
 *
 * Creates a DnnBroadcast record and fires the n8n webhook to start the
 * external render pipeline. n8n generates the script, renders the video,
 * and calls back dnnRenderDispatched / n8nBroadcastCallback with the result.
 *
 * Body:
 *   {
 *     prompt_topics?: string,     — optional topics/headlines override
 *     pipeline?: 'heygen' | 'higgsfield_11labs'  — which render pipeline to use
 *                                                  (defaults to 'heygen')
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
    let pipeline = 'heygen';
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        promptTopics = String(body?.prompt_topics || '').trim();
        pipeline = body?.pipeline === 'higgsfield_11labs' ? 'higgsfield_11labs' : 'heygen';
      } catch (_) {}
    }

    // Default to today's published article headlines when no topics provided
    if (!promptTopics) {
      promptTopics = await gatherPromptTopics(base44);
    }

    // Higgsfield pipeline doesn't use HeyGen avatar/voice IDs
    const opts = { pipeline, promptTopics, webhookUrl };
    if (pipeline === 'heygen') {
      opts.avatarId = DEFAULT_AVATAR_ID;
      opts.voiceId = DEFAULT_VOICE_ID;
    }

    const result = await createAndDispatchBroadcast(base44, opts);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}