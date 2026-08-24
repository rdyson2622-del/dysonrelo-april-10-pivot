import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';

/**
 * heygenBobDeskTest — short standing-Bob proof render on the LOCKED 0f55 DNN
 * Charlie Desk Studio still, using the new Bob avatar look + voice.
 *
 * Bob is a standing full-body avatar (not a talking_photo upload like
 * Charlie), so no image-upload step is needed — HeyGen already has the
 * look registered under BOB_AVATAR_ID.
 *
 * Payload:
 *   { action: 'dispatch' } -> dispatches the render, returns video_id
 *   { action: 'status', video_id } -> polls HeyGen for render status
 * Auth: admin session.
 */

const HEYGEN_API = 'https://api.heygen.com';

const BOB_AVATAR_ID = '52db97a6c48545f5a3e9f14614c28af6';
const BOB_VOICE_ID = '2e2785a64da54895b2cd3b744bf7ca26';

// "Dyson" is spelled phonetically here so HeyGen's TTS says it correctly
// (rhymes with "ice on" — like the vacuum brand), not "DIS-in" or "DIE-zon".
const TEST_SCRIPT = "This is Bob Dye-sun with DNN Real Estate News. Solutions that move families forward.";

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

    if (body.action === 'status') {
      if (!body.video_id) return Response.json({ error: 'video_id is required' }, { status: 400 });
      const result = await checkHeygenStatus(heygenKey, body.video_id);
      return Response.json(result);
    }

    // ── action: 'dispatch' (default) ──
    // Bob's avatar_id already renders as a full-frame character (its own
    // baked-in scene). Layering a SECOND background image on top of that
    // (as a prior version of this function did) produced a "box in a box"
    // — the avatar's own frame nested inside our injected studio image.
    // Fix: dispatch the avatar + voice ONLY, with no background override,
    // exactly like removing a stale layer instead of stacking a new one
    // on top of it.
    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: BOB_AVATAR_ID,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              voice_id: BOB_VOICE_ID,
              input_text: TEST_SCRIPT,
            },
          },
        ],
        dimension: { width: 1920, height: 1080 },
      }),
    });

    const renderText = await renderRes.text();
    let renderData;
    try { renderData = JSON.parse(renderText); } catch (_) {
      return Response.json({ error: 'HeyGen render returned non-JSON', raw: renderText.slice(0, 300) }, { status: 500 });
    }

    if (!renderRes.ok || !renderData?.data?.video_id) {
      return Response.json({ error: 'HeyGen Bob test render failed', detail: renderData }, { status: 500 });
    }

    return Response.json({
      success: true,
      video_id: renderData.data.video_id,
      avatar_id: BOB_AVATAR_ID,
      script: TEST_SCRIPT,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});