import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';

/**
 * heygenCharlieDeskTest — 10-second proof render for the DNN Charlie Desk
 * Studio look, BEFORE dispatching a full show.
 *
 * IMPORTANT: the old CHARLIE_TALKING_PHOTO_ID (72730cc3f5774167811efc2dbda1d1d6)
 * used by dnnDirectDispatch is the REJECTED bookshelf/PiP asset documented on
 * Admin Page #3 — reusing it would just reproduce the rejected look. Instead
 * this function uploads the LOCKED 0f55 desk still itself to HeyGen as a new
 * "talking photo" and renders the test line on that fresh asset.
 *
 * Payload:
 *   { action: 'dispatch' } -> uploads the still, dispatches the render, returns video_id + talking_photo_id
 *   { action: 'status', video_id } -> polls HeyGen for render status
 * Auth: admin session.
 */

const HEYGEN_API = 'https://api.heygen.com';
const HEYGEN_UPLOAD_API = 'https://upload.heygen.com';

const DNN_CHARLIE_DESK_STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const TEST_SCRIPT = 'Good morning, this is Charlie with your Dyson News Network daily real estate intelligence report.';

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
          const file = new File([blob], `charlie_desk_test_${body.video_id}.mp4`, { type: 'video/mp4' });
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          result.videoUrl = uploadRes.file_url;
        } catch (_) { /* fall back to the temp HeyGen URL if re-upload fails */ }
      }
      return Response.json(result);
    }

    // ── action: 'dispatch' (default) ──
    // 1. Download the locked desk still.
    const imgRes = await fetch(DNN_CHARLIE_DESK_STUDIO_STILL);
    if (!imgRes.ok) {
      return Response.json({ error: 'Failed to download DNN Charlie Desk Studio still' }, { status: 500 });
    }
    const imgBuf = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get('content-type') || 'image/png';

    // 2. Upload it to HeyGen as a fresh talking photo asset.
    const uploadRes = await fetch(`${HEYGEN_UPLOAD_API}/v1/talking_photo`, {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenKey,
        'Content-Type': contentType,
      },
      body: imgBuf,
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

    // 3. Dispatch the 10-second test render on the new asset. No scale/offset/
    // talking_photo_style overrides — the source image already IS the full
    // desk-in-frame scene, so it must render exactly as-is, full 16:9.
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
              voice_id: CHARLIE_VOICE_ID,
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
      return Response.json({ error: 'HeyGen test render failed', detail: renderData }, { status: 500 });
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