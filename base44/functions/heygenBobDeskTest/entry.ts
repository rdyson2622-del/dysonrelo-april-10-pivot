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
const HEYGEN_UPLOAD_API = 'https://upload.heygen.com';

const BOB_AVATAR_ID = '52db97a6c48545f5a3e9f14614c28af6';
const BOB_VOICE_ID = '2e2785a64da54895b2cd3b744bf7ca26';

// ⚠️ ONLY approved background — the LOCKED DNN Charlie Desk Studio still.
// Never substitute any other studio/stock background (e.g. the white-panel
// set) for Bob or any other avatar. This still gets uploaded to HeyGen as an
// asset each dispatch and passed as an explicit background override so
// HeyGen can never fall back to the avatar's own default backdrop.
const DNN_CHARLIE_DESK_STUDIO_STILL = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png";

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
    // 1. Upload the LOCKED studio still to HeyGen as an asset so we get a
    // valid image_asset_id — HeyGen's background override does not accept
    // arbitrary external URLs, only its own asset ids. This is the ONLY
    // background asset ever used here.
    const imgRes = await fetch(DNN_CHARLIE_DESK_STUDIO_STILL);
    if (!imgRes.ok) {
      return Response.json({ error: 'Failed to download DNN Charlie Desk Studio still' }, { status: 500 });
    }
    const imgBuf = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get('content-type') || 'image/png';

    const assetUploadRes = await fetch(`${HEYGEN_UPLOAD_API}/v1/asset`, {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenKey,
        'Content-Type': contentType,
      },
      body: imgBuf,
    });
    const assetUploadText = await assetUploadRes.text();
    let assetUploadData;
    try { assetUploadData = JSON.parse(assetUploadText); } catch (_) {
      return Response.json({ error: 'HeyGen asset upload returned non-JSON', raw: assetUploadText.slice(0, 300) }, { status: 500 });
    }

    const imageAssetId = assetUploadData?.data?.id;
    if (!assetUploadRes.ok || !imageAssetId) {
      return Response.json({ error: 'HeyGen studio background asset upload failed', detail: assetUploadData }, { status: 500 });
    }

    // 2. Dispatch the render with the studio still forced as the explicit
    // background — this overrides Bob's own default backdrop (the white
    // panel set) completely.
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
            background: { type: 'image', image_asset_id: imageAssetId },
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