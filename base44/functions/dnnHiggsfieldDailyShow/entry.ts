import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { gatherPromptTopics, createAndDispatchBroadcast } from '../../shared/dnnPipelineDispatch.ts';

/**
 * dnnHiggsfieldDailyShow — scheduled automation target.
 *
 * Fires automatically every day (scheduled automation) to generate the
 * DNN Daily News show using the Higgsfield + 11 Labs pipeline.
 *
 * This function:
 *   1. Gathers today's published article headlines as prompt topics
 *   2. Creates a DnnBroadcast record with pipeline: 'higgsfield_11labs'
 *   3. Fires the n8n webhook (N8N_BROADCAST_WEBHOOK_URL) with the
 *      broadcast_id + pipeline indicator
 *
 * n8n then generates the script (Gemini), renders the video (Higgsfield),
 * generates audio (11 Labs), stitches the 3 scenes into one MP4, and
 * calls back n8nBroadcastCallback with the final video URL.
 *
 * The entity automation on DnnBroadcast (status → 'ready') then fires
 * dnnTriggerDistribution → n8n W3 publishes to social media.
 *
 * No admin auth — this is triggered internally by the scheduled automation.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const webhookUrl = secrets.get('N8N_BROADCAST_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_BROADCAST_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    const promptTopics = await gatherPromptTopics(base44);

    const result = await createAndDispatchBroadcast(base44, {
      pipeline: 'higgsfield_11labs',
      promptTopics,
      webhookUrl,
    });

    console.log(`[dnnHiggsfieldDailyShow] dispatched: ${JSON.stringify(result)}`);
    return Response.json(result);
  } catch (error) {
    console.error('[dnnHiggsfieldDailyShow] error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}