/**
 * bobOutsideAsset — single source of truth for Bob's "outside casual" visual,
 * shared by every render path (morning broadcast, stitching) so they never
 * drift apart.
 *
 * ROOT CAUSE of the pillarbox/black-bar bug: Bob's original HeyGen
 * talking_photo source image is a PORTRAIT photo (1023x1537), not 16:9.
 * HeyGen's "scale: 1" maps the source image onto the 1280x720 render canvas
 * by its own aspect ratio, so a narrow portrait photo gets letterboxed with
 * large black bars on both sides — the exact "two famous black bars" bug.
 *
 * Fix (same approach already proven for Charlie): pre-crop/resize the source
 * to the EXACT render canvas pixel size (1280x720), then upload that
 * widescreen still to HeyGen fresh as a talking_photo for every render job.
 * scale:1 then maps it 1:1 onto the full frame with zero pillarboxing.
 *
 * v3 UPDATE: the previous v2 crop center-cropped a narrow 1023px-wide
 * portrait selfie down to 16:9, which mathematically only leaves ~575px of
 * vertical room — landing on an extreme, distorted face-only close-up
 * ("huge teeth" bug). Replaced with a properly composed head-and-shoulders
 * photo (visible chest/shoulders + headroom) cropped from a wider, correctly
 * framed source, so Bob's face is proportionate on screen instead of filling
 * the entire frame.
 */

export const BOB_OUTSIDE_STILL_URL =
  'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/5c0b65f3a_charlie_desk_widescreen_1280x720.png';

const HEYGEN_UPLOAD_API = 'https://upload.heygen.com';

/**
 * Uploads the locked, widescreen Bob still to HeyGen as a fresh talking_photo
 * asset and returns its talking_photo_id. Must be called once per render job.
 */
export async function uploadBobOutsideTalkingPhoto(heygenKey: string): Promise<string> {
  const imgRes = await fetch(BOB_OUTSIDE_STILL_URL);
  if (!imgRes.ok) {
    throw new Error('Failed to download Bob outside widescreen still');
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