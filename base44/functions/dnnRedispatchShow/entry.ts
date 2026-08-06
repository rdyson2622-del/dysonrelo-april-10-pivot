import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnRedispatchShow — emergency re-dispatch for a stuck DnnBroadcast render.
 *
 * 1. Cancels the existing HeyGen job (best effort) so it stops consuming queue.
 * 2. Re-submits the stored intro/content/outro scripts as a fresh single
 *    multi-scene HeyGen render (3 video_inputs -> 1 stitched MP4).
 * 3. Resets the broadcast to 'rendering' with the new heygenId and clears any
 *    stale videoUrl / composite state so the poller picks up the new job.
 *
 * Triggered by a one-time scheduled automation (no user session) OR manually
 * by an admin. Follows the same no-auth pattern as dnnAutoSocialPost since it
 * only re-dispatches an existing broadcast and exposes no data.
 *
 * Payload: { broadcast_id: string }
 */
const HEYGEN_API = 'https://api.heygen.com';

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

function clean(s) {
  return (s || '')
    .replace(/[*_#`]/g, '')
    .replace(/[\u2014\u2013]/g, ', ')
    .replace(/\u2026/g, '. ')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2022\u25CF\u00B7]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const broadcastId = body?.broadcast_id || body?.event?.entity_id;
    if (!broadcastId) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcastId).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    // 1. Cancel the existing HeyGen job (best effort — ignore failures)
    let cancelledOld = false;
    if (broadcast.heygenId) {
      try {
        const cancelRes = await fetch(`${HEYGEN_API}/v1/video_status.cancel`, {
          method: 'POST',
          headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ video_id: broadcast.heygenId }),
        });
        cancelledOld = cancelRes.ok;
      } catch (_) { /* best effort */ }
    }

    // 2. Build the 3-scene video_inputs from stored scripts
    const intro = clean(broadcast.intro_script || '');
    const content = clean(broadcast.content_script || '');
    const outro = clean(broadcast.outro_script || '');

    if (!intro && !content && !outro) {
      return Response.json({
        error: 'No stored scripts found. The broadcast needs intro_script, content_script, and outro_script before dispatch.',
      }, { status: 400 });
    }

    const video_inputs = [];
    if (intro) {
      video_inputs.push({
        character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
        voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: intro, speed: 1.05 },
        background: { type: 'color', value: '#0d0d0d' },
      });
    }
    if (content) {
      video_inputs.push({
        character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
        voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: content, emotion: 'Excited', speed: 1.12 },
        background: { type: 'color', value: '#0d0d0d' },
      });
    }
    if (outro) {
      video_inputs.push({
        character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
        voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: outro, speed: 1.05 },
        background: { type: 'color', value: '#0d0d0d' },
      });
    }
    if (video_inputs.length === 0) {
      return Response.json({ error: 'All three scripts are empty' }, { status: 400 });
    }

    // 3. Dispatch the fresh render
    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_inputs, dimension: { width: 1280, height: 720 } }),
    });
    const renderText = await renderRes.text();
    let renderData;
    try { renderData = JSON.parse(renderText); } catch (_) {
      return Response.json({ error: 'HeyGen returned non-JSON', raw: renderText.slice(0, 300) }, { status: 500 });
    }
    if (!renderRes.ok || !renderData.data?.video_id) {
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
        status: 'failed',
        errorMessage: `HeyGen re-dispatch failed: ${JSON.stringify(renderData.error || renderData).slice(0, 300)}`,
      });
      return Response.json({ error: 'HeyGen render job failed', detail: renderData }, { status: 500 });
    }

    const heygenVideoId = renderData.data.video_id;

    // 4. Reset the broadcast to rendering with the new job, clearing stale state
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
      heygenId: heygenVideoId,
      status: 'rendering',
      errorMessage: null,
      videoUrl: null,
      compositedVideoUrl: null,
      compositedRenderId: null,
    });

    return Response.json({
      success: true,
      broadcast_id: broadcastId,
      heygen_video_id: heygenVideoId,
      cancelled_old_job: cancelledOld,
      scenes_dispatched: video_inputs.length,
      status: 'rendering',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}