import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import jpeg from 'npm:jpeg-js@0.4.4';

/**
 * centerCropWidescreen — one-off utility to fix AI-generated studio images
 * that come back square (1024x1024) instead of native 16:9. Center-crops
 * vertically to an exact 16:9 frame (keeps full width, trims equal amounts
 * off top and bottom) so the subjects stay centered and nothing is
 * pillarboxed when used as a HeyGen talking-photo source.
 *
 * Payload: { image_url: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image_url } = await req.json();
    if (!image_url) return Response.json({ error: 'image_url is required' }, { status: 400 });

    const imgRes = await fetch(image_url);
    if (!imgRes.ok) return Response.json({ error: 'Failed to download source image' }, { status: 500 });
    const buf = new Uint8Array(await imgRes.arrayBuffer());

    const decoded = jpeg.decode(buf, { useTArray: true });
    const origW = decoded.width;
    const origH = decoded.height;

    const outW = origW;
    const outH = Math.round(origW * 9 / 16);
    const cropH = Math.min(outH, origH);
    const yOffset = Math.floor((origH - cropH) / 2);

    const outPixels = new Uint8Array(outW * cropH * 4);
    for (let y = 0; y < cropH; y++) {
      const srcRowStart = (y + yOffset) * origW * 4;
      const dstRowStart = y * outW * 4;
      outPixels.set(decoded.data.subarray(srcRowStart, srcRowStart + origW * 4), dstRowStart);
    }

    const encoded = jpeg.encode({ data: outPixels, width: outW, height: cropH }, 92);

    const blob = new Blob([encoded.data], { type: 'image/jpeg' });
    const file = new File([blob], 'studio_widescreen_16x9.jpg', { type: 'image/jpeg' });
    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      success: true,
      url: uploadRes.file_url,
      original: `${origW}x${origH}`,
      cropped: `${outW}x${cropH}`,
    });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});