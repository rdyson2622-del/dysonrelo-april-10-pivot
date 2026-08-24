import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import UPNG from 'npm:upng-js@2.1.0';
import jpeg from 'npm:jpeg-js@0.4.4';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';

/**
 * heygenBobDeskTest — short standing-Bob proof render, ALWAYS on the LOCKED
 * DNN Charlie Desk Studio backdrop.
 *
 * IMPORTANT: Bob's HeyGen avatar_id (52db97a6...) is a real-photo avatar
 * shot in a totally different room (a theater with red seats), with its own
 * baked-in background that HeyGen cannot cleanly key/matte out. Using that
 * avatar_id — with or without a "background" override — either shows the
 * theater as-is (padded with white pillarbox bars) or pastes the theater
 * clip as a box-in-a-box on top of an injected background. Both are wrong.
 *
 * Fix (same real-photo method already proven for Charlie): the LOCKED 0f55
 * desk studio still already has Bob standing in it, in-frame, on the right
 * side. We crop that real photo down to Bob's side of the room (still the
 * same studio: gold branding, glass walls, DNN signage) and upload THAT as
 * a fresh HeyGen talking photo — no theater, no AI-generated likeness, no
 * pillarboxing (no forced dimension — renders at the cropped photo's native
 * aspect).
 *
 * Payload:
 *   { action: 'dispatch' } -> crops + uploads + dispatches the render, returns video_id
 *   { action: 'status', video_id } -> polls HeyGen for render status
 * Auth: admin session.
 */

const HEYGEN_API = 'https://api.heygen.com';
const HEYGEN_UPLOAD_API = 'https://upload.heygen.com';

const DNN_CHARLIE_DESK_STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
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

    // ── action: 'dispatch' (default) ──
    // 1. Download the locked desk studio still and crop to Bob's side of the
    // room (right ~40% of the frame, full height) — the real photo already
    // shows him standing there in the studio.
    const imgRes = await fetch(DNN_CHARLIE_DESK_STUDIO_STILL);
    if (!imgRes.ok) {
      return Response.json({ error: 'Failed to download DNN Charlie Desk Studio still' }, { status: 500 });
    }
    const pngBuf = new Uint8Array(await imgRes.arrayBuffer());
    const decodedPng = UPNG.decode(pngBuf);
    const origW = decodedPng.width;
    const origH = decodedPng.height;
    const rgba = new Uint8Array(UPNG.toRGBA8(decodedPng)[0]);

    const cropX = Math.round(origW * 0.6);
    const cropW = origW - cropX;
    const cropH = origH;

    const cropped = new Uint8Array(cropW * cropH * 4);
    for (let y = 0; y < cropH; y++) {
      const srcStart = (y * origW + cropX) * 4;
      const dstStart = y * cropW * 4;
      cropped.set(rgba.subarray(srcStart, srcStart + cropW * 4), dstStart);
    }
    const jpegOut = jpeg.encode({ data: cropped, width: cropW, height: cropH }, 92);

    // 2. Upload the cropped Bob-side studio photo to HeyGen as a fresh talking photo.
    const uploadRes = await fetch(`${HEYGEN_UPLOAD_API}/v1/talking_photo`, {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenKey,
        'Content-Type': 'image/jpeg',
      },
      body: jpegOut.data,
    });
    const uploadText = await uploadRes.text();
    let uploadData;
    try { uploadData = JSON.parse(uploadText); } catch (_) {
      return Response.json({ error: 'HeyGen upload returned non-JSON', raw: uploadText.slice(0, 300) }, { status: 500 });
    }

    const talkingPhotoId = uploadData?.data?.talking_photo_id;
    if (!uploadRes.ok || !talkingPhotoId) {
      return Response.json({ error: 'HeyGen talking photo upload failed', detail: uploadData }, { status: 500 });
    }

    // 3. Dispatch the render on the new asset. No dimension override — the
    // cropped studio photo IS the frame, rendered at its own native aspect,
    // so there is no pillarboxing and no second background to fight with.
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
              talking_photo_id: talkingPhotoId,
            },
            voice: {
              type: 'text',
              voice_id: BOB_VOICE_ID,
              input_text: TEST_SCRIPT,
            },
          },
        ],
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
      talking_photo_id: talkingPhotoId,
      script: TEST_SCRIPT,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});