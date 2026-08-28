/**
 * charlieDeskAsset — single source of truth for the "Charlie at the DNN desk"
 * visual, shared by every render path (test preview, morning broadcast,
 * stitching) so they can never drift apart again.
 *
 * This is the EXACT still + upload approach already proven working on the
 * "Charlie Speaking at the Desk" preview card (heygenCharlieDeskTest) — a
 * locked studio still uploaded to HeyGen as a talking_photo, no avatar_id,
 * no scale/offset overrides.
 */

// Charlie ALONE at the desk — the standing second man has been removed from
// the studio floor. Do not swap this URL without regenerating a Charlie-only
// still first; the old asset (352681ac5_generated_image.png) has Bob baked
// into the background and must never be reused.
//
// This still is pre-cropped/resized to EXACTLY 1280x720 (the render canvas
// size). The source AI image was square (1024x1024) — uploaded as-is, HeyGen
// mapped it 1:1 at "scale: 1" onto the 16:9 canvas, which pillarboxed it into
// a small centered box ("Charlie in a box") instead of filling the frame.
// Pre-matching the still's pixel dimensions to the canvas guarantees scale:1
// fills the entire frame with zero pillarboxing. Do not swap this URL for a
// non-16:9 image without re-running cropCharlieDeskToWidescreen first.
export const CHARLIE_DESK_STILL_URL =
  'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/b79e52377_charlie_desk_widescreen_1280x720.png';

const HEYGEN_UPLOAD_API = 'https://upload.heygen.com';

/**
 * Uploads the locked Charlie desk still to HeyGen as a fresh talking_photo
 * asset and returns its talking_photo_id. HeyGen talking photos aren't
 * reusable by a fixed ID across accounts/sessions the way avatars are, so
 * this must be called once per render job (cache the returned id locally
 * within that job if it's needed for multiple clips).
 */
export async function uploadCharlieDeskTalkingPhoto(heygenKey: string): Promise<string> {
  const imgRes = await fetch(CHARLIE_DESK_STILL_URL);
  if (!imgRes.ok) {
    throw new Error('Failed to download Charlie desk studio still');
  }
  const imgBuf = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get('content-type') || 'image/png';

  const uploadRes = await fetch(`${HEYGEN_UPLOAD_API}/v1/talking_photo`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenKey, 'Content-Type': contentType },
    body: imgBuf,
  });
  const uploadText = await uploadRes.text();
  let uploadData;
  try {
    uploadData = JSON.parse(uploadText);
  } catch (_) {
    throw new Error(`HeyGen upload returned non-JSON: ${uploadText.slice(0, 300)}`);
  }

  const talkingPhotoId = uploadData?.data?.talking_photo_id;
  if (!uploadRes.ok || !talkingPhotoId) {
    throw new Error(`HeyGen talking photo upload failed: ${JSON.stringify(uploadData)}`);
  }
  return talkingPhotoId;
}