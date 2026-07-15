import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import UPNG from 'npm:upng-js@2.1.0';

/**
 * resizeStudioImage — Downloads the DNN studio image, resizes it to
 * 1200x627 (LinkedIn's optimal aspect ratio) using UPNG.js,
 * and uploads the result via the UploadFile integration.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sourceUrl = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a6b3b6cc5_Screenshot2026-07-14at95823PM.png';

    // Download the original image
    const imgRes = await fetch(sourceUrl);
    if (!imgRes.ok) {
      return Response.json({ error: 'Failed to download source image', status: imgRes.status }, { status: 500 });
    }
    const imgArrayBuffer = await imgRes.arrayBuffer();
    const imgUint8 = new Uint8Array(imgArrayBuffer);

    // Decode the PNG
    const img = UPNG.decode(imgUint8);
    const origW = img.width;
    const origH = img.height;
    const origRatio = origW / origH;
    const targetRatio = 1200 / 627;

    // Calculate cover crop
    let cropX = 0, cropY = 0, cropW = origW, cropH = origH;
    if (origRatio > targetRatio) {
      // Image is wider — crop sides
      cropW = Math.round(origH * targetRatio);
      cropX = Math.round((origW - cropW) / 2);
    } else {
      // Image is taller — crop top/bottom
      cropH = Math.round(origW / targetRatio);
      cropY = Math.round((origH - cropH) / 2);
    }

    // Get RGBA pixel data
    const rgba = UPNG.toRGBA8(img)[0]; // Returns array of frames, each is Uint8Array of RGBA
    const pixels = new Uint8Array(rgba);

    // Create the output pixel buffer at 1200x627
    const outW = 1200;
    const outH = 627;
    const outPixels = new Uint8Array(outW * outH * 4);

    // Nearest-neighbor resize from the cropped region
    for (let y = 0; y < outH; y++) {
      for (let x = 0; x < outW; x++) {
        // Map output pixel to input crop region
        const srcX = cropX + Math.floor((x / outW) * cropW);
        const srcY = cropY + Math.floor((y / outH) * cropH);
        const srcIdx = (srcY * origW + srcX) * 4;
        const dstIdx = (y * outW + x) * 4;
        outPixels[dstIdx] = pixels[srcIdx];
        outPixels[dstIdx + 1] = pixels[srcIdx + 1];
        outPixels[dstIdx + 2] = pixels[srcIdx + 2];
        outPixels[dstIdx + 3] = pixels[srcIdx + 3];
      }
    }

    // Encode back to PNG
    const encoded = UPNG.encode([outPixels], outW, outH, 0);

    // Upload via the UploadFile integration
    const blob = new Blob([encoded], { type: 'image/png' });
    const file = new File([blob], 'dnn_studio_1200x627.png', { type: 'image/png' });
    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      success: true,
      url: uploadRes.file_url,
      dimensions: `${outW}x${outH}`,
      original_size: `${origW}x${origH}`,
      crop: `x:${cropX} y:${cropY} w:${cropW} h:${cropH}`,
    });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});