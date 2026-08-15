/**
 * Shared dispatch logic for DNN broadcast shows.
 *
 * Used by both:
 *   - dnnDailyVideoPipeline (admin-triggered)
 *   - dnnHiggsfieldDailyShow (scheduled automation)
 *
 * Both functions create a DnnBroadcast record and fire the n8n webhook
 * (N8N_BROADCAST_WEBHOOK_URL) with pipeline: 'higgsfield_11labs'. n8n then
 * generates the script (Gemini), renders the video (Higgsfield), generates
 * audio (11 Labs), stitches the 3 scenes, and calls back
 * dnnRenderDispatched / n8nBroadcastCallback.
 */

/**
 * Gather today's published article headlines to use as prompt topics.
 */
export async function gatherPromptTopics(base44) {
  const today = await base44.asServiceRole.entities.DnnArticle.filter(
    { status: 'published' },
    '-generated_date',
    10
  );
  return today
    .map(a => a.headline)
    .filter(Boolean)
    .join(' | ') || "Today's top relocation and real estate market headlines";
}

/**
 * Create a DnnBroadcast record and fire the n8n webhook to start the
 * external render pipeline.
 *
 * @param {object} base44 - Base44 client (from createClientFromRequest)
 * @param {object} opts
 * @param {string} opts.pipeline - 'higgsfield_11labs'
 * @param {string} opts.promptTopics - headline topics for the script
 * @param {string} opts.webhookUrl - n8n webhook URL
 * @returns {object} { success, broadcast_id, status, pipeline, webhook }
 */
export async function createAndDispatchBroadcast(base44, opts) {
  const { pipeline, promptTopics, webhookUrl } = opts;

  const today = new Date().toISOString().slice(0, 10);
  const existing = await base44.asServiceRole.entities.DnnBroadcast.list('-created_date', 1);
  const nextShowNumber = (existing[0]?.show_number || 0) + 1;

  // 1. Create the DnnBroadcast record in "processing" state
  const broadcast = await base44.asServiceRole.entities.DnnBroadcast.create({
    show_name: `Show ${nextShowNumber}`,
    show_number: nextShowNumber,
    broadcast_date: today,
    presenter: 'charlie',
    format: 'solo',
    pipeline: 'higgsfield_11labs',
    status: 'processing',
    prompt_topics: promptTopics,
    headlines: promptTopics.split(' | ').filter(Boolean),
  });

  // 2. Fire the n8n webhook with the broadcast_id + pipeline indicator.
  //    scene_order tells n8n the EXACT order to generate + stitch the 3 scenes.
  //    Without this, n8n may stitch scenes out of order (e.g. content before intro).
  const payload = {
    broadcast_id: broadcast.id,
    prompt_topics: promptTopics,
    pipeline: 'higgsfield_11labs',
    scene_order: [
      { scene: 1, field: 'intro_script', speaker: 'charlie', label: 'Intro / Opening', instruction: 'Charlie opens the show and introduces the headlines' },
      { scene: 2, field: 'content_script', speaker: 'bob', label: 'Main Content', instruction: 'Bob explains the news story in depth' },
      { scene: 3, field: 'outro_script', speaker: 'charlie', label: 'Outro / Closing', instruction: 'Charlie closes the show and signs off' },
    ],
  };

  let webhookStatus = 'sent';
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      webhookStatus = `failed (${res.status})`;
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
        status: 'failed',
        errorMessage: `n8n webhook returned ${res.status}: ${text.slice(0, 200)}`,
      });
    }
  } catch (err) {
    webhookStatus = `error: ${err.message}`;
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
      status: 'failed',
      errorMessage: `n8n webhook error: ${err.message}`,
    });
  }

  return {
    success: webhookStatus === 'sent',
    broadcast_id: broadcast.id,
    status: webhookStatus === 'sent' ? 'processing' : 'failed',
    pipeline: 'higgsfield_11labs',
    webhook: webhookStatus,
  };
}