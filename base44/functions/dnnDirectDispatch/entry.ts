import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnDirectDispatch — dispatches a DNN broadcast directly to HeyGen.
 *
 * Reads the stored intro_script / content_script / outro_script from a
 * DnnBroadcast record and dispatches them as a SINGLE multi-scene HeyGen
 * render request (3 video_inputs → 1 stitched MP4, rendered by HeyGen itself
 * — not three separate clips stitched afterward).
 *
 * Scene layout: Charlie at the studio desk (intro + outro), Bob in a
 * correspondent box (content/solutions segment, since Bob's avatar is not
 * in the studio but in the office/field).
 *
 * On success, stores the heygen_video_id and flips status → "rendering".
 * Poll with heygenCheckVideo / dnnVideoPoller for completion.
 *
 * Payload: { broadcast_id: string }
 * Auth: admin session.
 */

const HEYGEN_API = 'https://api.heygen.com';

// Charlie Simmons — studio anchor avatar
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

// Bob Dyson — remote correspondent talking photo
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

// DNN Studio backdrop — Charlie seated at the desk (left), Bob standing in the
// studio (right). Same background image used everywhere else on the site
// (composited social MP4 + in-browser preview) so the raw HeyGen render now
// matches the studio set instead of a plain black background.
const STUDIO_BACKGROUND_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

/**
 * Clean script text for HeyGen TTS.
 * HeyGen's TTS engine goes SILENT on em-dashes, smart quotes, and bullet
 * characters. This normalizes all of those to plain ASCII so the avatar
 * speaks the full script without stuttering, gaps, or double-run glitches.
 */
function clean(s) {
  return (s || '')
    .replace(/[*_#`]/g, '')
    .replace(/[\u2014\u2013]/g, ', ')   // em-dash / en-dash -> comma
    .replace(/\u2026/g, '. ')          // ellipsis -> period
    .replace(/[\u201c\u201d]/g, '"')   // smart double quotes
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u2022\u25CF\u00B7]/g, '') // bullet / middot
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { broadcast_id } = body;
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;
    const broadcast = await Broadcasts.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    // Clean all scripts before dispatch — HeyGen TTS goes silent on em-dashes,
    // smart quotes, and weird spacing, causing stuttering and double-run glitches.
    const intro = clean(broadcast.intro_script || '');
    const content = clean(broadcast.content_script || '');
    const outro = clean(broadcast.outro_script || '');

    if (!intro && !content && !outro) {
      return Response.json({
        error: 'No stored scripts found. The broadcast needs intro_script, content_script, and outro_script before dispatch.',
      }, { status: 400 });
    }

    // Build the 3-scene video_inputs array for a single HeyGen render.
    // HeyGen stitches all scenes into one MP4.
    const video_inputs = [];

    // Studio backdrop for every scene. Charlie sits at the desk on the LEFT
    // (negative x offset), Bob stands in the studio on the RIGHT (positive x
    // offset) — matching the DNN set layout stored in the Higgsfield library.
    const studioBg = { type: 'image', url: STUDIO_BACKGROUND_URL };

    if (intro) {
      video_inputs.push({
        character: {
          type: 'avatar',
          avatar_id: CHARLIE_AVATAR_ID,
          avatar_style: 'normal',
          scale: 0.85,
          offset: { x: -0.28, y: 0.18 },
        },
        voice: {
          type: 'text',
          voice_id: CHARLIE_VOICE_ID,
          input_text: intro,
          speed: 1.05,
        },
        background: studioBg,
      });
    }

    if (content) {
      video_inputs.push({
        character: {
          type: 'talking_photo',
          talking_photo_id: BOB_TALKING_PHOTO_ID,
          scale: 0.85,
          offset: { x: 0.28, y: 0.1 },
        },
        voice: {
          type: 'text',
          voice_id: BOB_VOICE_ID,
          input_text: content,
          emotion: 'Excited',
          speed: 1.12,
        },
        background: studioBg,
      });
    }

    if (outro) {
      video_inputs.push({
        character: {
          type: 'avatar',
          avatar_id: CHARLIE_AVATAR_ID,
          avatar_style: 'normal',
          scale: 0.85,
          offset: { x: -0.28, y: 0.18 },
        },
        voice: {
          type: 'text',
          voice_id: CHARLIE_VOICE_ID,
          input_text: outro,
          speed: 1.05,
        },
        background: studioBg,
      });
    }

    if (video_inputs.length === 0) {
      return Response.json({ error: 'All three scripts are empty' }, { status: 400 });
    }

    // Single HeyGen API call — multi-scene render
    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs,
        dimension: { width: 1280, height: 720 },
      }),
    });

    const renderText = await renderRes.text();
    console.log('HeyGen render status:', renderRes.status, 'body:', renderText.slice(0, 500));

    let renderData;
    try { renderData = JSON.parse(renderText); } catch (_) {
      return Response.json({
        error: 'HeyGen returned non-JSON',
        raw: renderText.slice(0, 300),
      }, { status: 500 });
    }

    if (!renderRes.ok || !renderData.data?.video_id) {
      // Mark the broadcast as failed so the admin sees the error
      await Broadcasts.update(broadcast_id, {
        status: 'failed',
        errorMessage: `HeyGen dispatch failed: ${JSON.stringify(renderData.error || renderData).slice(0, 300)}`,
      });
      return Response.json({
        error: 'HeyGen render job failed',
        detail: renderData,
      }, { status: 500 });
    }

    const heygenVideoId = renderData.data.video_id;

    // Store the job id and flip to rendering — n8n W2 / n8nBroadcastCallback
    // will receive the completion webhook and set videoUrl + status → ready
    await Broadcasts.update(broadcast_id, {
      heygenId: heygenVideoId,
      status: 'rendering',
      errorMessage: null,
    });

    return Response.json({
      success: true,
      broadcast_id,
      heygen_video_id: heygenVideoId,
      scenes_dispatched: video_inputs.length,
      status: 'rendering',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});