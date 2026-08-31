import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';
import { BOB_TALKING_PHOTO_ID } from '../../shared/bobOutsideAsset.ts';

/**
 * heygenBobDeskTest — short proof render of Bob in his PROVEN "outside casual"
 * look: a talking-photo of Bob in a casual black shirt, shot outside the
 * studio, on a plain solid background.
 *
 * IMPORTANT: this is the SAME talking_photo_id + voice_id already used
 * reliably across every existing Q&A explainer pipeline (roadmapQARender,
 * vettingDeskQARender, etc). Do NOT go back to cropping the DNN desk studio
 * photo for Bob — that produced white pillarbox bars and was rejected.
 * Bob never appears at the studio desk; he appears alone in this box look
 * for his own script segment, cut in between Charlie's desk segments.
 *
 * Payload:
 *   { action: 'dispatch' } -> dispatches the render, returns video_id
 *   { action: 'status', video_id } -> polls HeyGen for render status
 * Auth: admin session.
 */

const HEYGEN_API = 'https://api.heygen.com';

const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

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
      // HeyGen's temp signed URL expires in a few days — re-upload to permanent
      // Base44 storage so the last completed test video keeps working on reload.
      if (result.status === 'completed' && result.videoUrl) {
        try {
          const videoRes = await fetch(result.videoUrl);
          const videoBuf = await videoRes.arrayBuffer();
          const blob = new Blob([videoBuf], { type: 'video/mp4' });
          const file = new File([blob], `bob_desk_test_${body.video_id}.mp4`, { type: 'video/mp4' });
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          result.videoUrl = uploadRes.file_url;
        } catch (_) { /* fall back to the temp HeyGen URL if re-upload fails */ }
      }
      return Response.json(result);
    }

    // ── action: 'dispatch' (default) ── Bob's proven talking-photo look,
    // solid dark background, no studio compositing. Uses a fresh widescreen
    // (1280x720) upload of Bob's still every time — the original portrait
    // (1023x1537) source caused the pillarbox black-bar bug.
    const bobTalkingPhotoId = BOB_TALKING_PHOTO_ID;
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
              type: 'talking_photo',
              talking_photo_id: bobTalkingPhotoId,
              scale: 1,
              offset: { x: 0, y: 0 },
            },
            voice: {
              type: 'text',
              voice_id: BOB_VOICE_ID,
              input_text: TEST_SCRIPT,
              emotion: 'Excited',
              speed: 1.0,
            },
            background: { type: 'color', value: '#0d0d0d' },
          },
        ],
        dimension: { width: 1280, height: 720 },
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
      talking_photo_id: bobTalkingPhotoId,
      script: TEST_SCRIPT,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});