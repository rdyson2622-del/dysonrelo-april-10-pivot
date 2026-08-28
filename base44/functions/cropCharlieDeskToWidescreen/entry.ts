import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import UPNG from 'npm:upng-js@2.1.0';
import jpeg from 'npm:jpeg-js@0.4.4';

/**
 * cropCharlieDeskToWidescreen — fixes the "Charlie in a box" pillarbox bug.
 *
 * The current Charlie desk still (d886e8e7e_generated_image.png) is a SQUARE
 * AI image. HeyGen's talking_photo "scale: 1" maps the source image 1:1 by
 * its own aspect ratio onto the render canvas — a square image on a 16:9
 * (1280x720) canvas gets pillarboxed into a smaller centered box, which is
 * exactly the "box inserted over a full-screen studio background" look
 * being reported.
 *
 * Fix: center-crop the source to 16:9, THEN resize (nearest-neighbor) to
 * the EXACT render canvas pixel size (1280x720) so HeyGen's scale:1 always
 * maps it 1:1 onto the full frame with zero pillarboxing, regardless of
 * source format (PNG or JPEG).
 *
 * Payload: { image_url?: string } — defaults to the current desk still.
 */

const DEFAULT_SOURCE_URL =
  'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d886e8e7e_generated_image.png';

const TARGET_W = 1280;
const TARGET_H = 720;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const imageUrl = body?.image_url || DEFAULT_SOURCE_URL;

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return Response.json({ error: 'Failed to download source image' }, { status: 500 });
    const buf = new Uint8Array(await imgRes.arrayBuffer());

    let origW, origH, rgba;
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;

    if (isPng) {
      const img = UPNG.decode(buf);
      origW = img.width;
      origH = img.height;
      rgba = new Uint8Array(UPNG.toRGBA8(img)[0]);
    } else {
      const decoded = jpeg.decode(buf, { useTArray: true });
      origW = decoded.width;
      origH = decoded.height;
      rgba = decoded.data;
    }

    // Center-crop vertically to exact 16:9
    const cropH = Math.min(Math.round(origW * 9 / 16), origH);
    const cropW = Math.min(origW, Math.round(origH * 16 / 9));
    const xOffset = Math.floor((origW - cropW) / 2);
    const yOffset = Math.floor((origH - cropH) / 2);

    const cropped = new Uint8Array(cropW * cropH * 4);
    for (let y = 0; y < cropH; y++) {
      const srcRowStart = ((y + yOffset) * origW + xOffset) * 4;
      const dstRowStart = y * cropW * 4;
      cropped.set(rgba.subarray(srcRowStart, srcRowStart + cropW * 4), dstRowStart);
    }

    // Nearest-neighbor resize to EXACT render canvas size so scale:1 in
    // HeyGen maps the photo pixel-for-pixel onto the full frame.
    const outPixels = new Uint8Array(TARGET_W * TARGET_H * 4);
    for (let y = 0; y < TARGET_H; y++) {
      const srcY = Math.min(cropH - 1, Math.floor((y * cropH) / TARGET_H));
      for (let x = 0; x < TARGET_W; x++) {
        const srcX = Math.min(cropW - 1, Math.floor((x * cropW) / TARGET_W));
        const srcIdx = (srcY * cropW + srcX) * 4;
        const dstIdx = (y * TARGET_W + x) * 4;
        outPixels[dstIdx] = cropped[srcIdx];
        outPixels[dstIdx + 1] = cropped[srcIdx + 1];
        outPixels[dstIdx + 2] = cropped[srcIdx + 2];
        outPixels[dstIdx + 3] = cropped[srcIdx + 3];
      }
    }

    const centerIdx = (Math.floor(TARGET_H / 2) * TARGET_W + Math.floor(TARGET_W / 2)) * 4;
    const debugSample = {
      topLeft: Array.from(outPixels.slice(0, 4)),
      center: Array.from(outPixels.slice(centerIdx, centerIdx + 4)),
      cropW, cropH, xOffset, yOffset,
      isPng,
    };

    const encoded = UPNG.encode([outPixels.buffer], TARGET_W, TARGET_H, 0);
    const blob = new Blob([encoded], { type: 'image/png' });
    const file = new File([blob], 'charlie_desk_widescreen_1280x720.png', { type: 'image/png' });
    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      success: true,
      url: uploadRes.file_url,
      original: `${origW}x${origH}`,
      output: `${TARGET_W}x${TARGET_H}`,
      debugSample,
    });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});