import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import jpeg from 'npm:jpeg-js@0.4.4';

/**
 * cropCharlieHeroPhoto — one-off utility to fix the Charlie hero source photo.
 *
 * The photo currently used to create Charlie's HeyGen talking-photo asset is
 * actually a SCREENSHOT of the RoleSelector page itself (square 1:1), with
 * the "News / Relocation / Intelligence" pills and instructional text baked
 * into the bottom of the image. That's why:
 *  - the rendered video pillarboxes with white bars (square image forced to 16:9)
 *  - the pills appear "double exposed" (baked-in text + live HTML pills on top)
 *
 * Fix: crop the square photo down to just the top 56.25% of its height,
 * which mathematically produces an exact 16:9 image and removes the bottom
 * strip containing all the baked-in UI text — no AI regeneration, same real
 * photo of Charlie, just cropped.
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

    // Keep only the top 56.25% of height -> exact 16:9 (W : 0.5625W)
    const outH = Math.round(origW * 9 / 16);
    const cropH = Math.min(outH, origH);
    const outW = origW;

    const outPixels = new Uint8Array(outW * cropH * 4);
    for (let y = 0; y < cropH; y++) {
      const srcRowStart = y * origW * 4;
      const dstRowStart = y * outW * 4;
      outPixels.set(decoded.data.subarray(srcRowStart, srcRowStart + origW * 4), dstRowStart);
    }

    const encoded = jpeg.encode({ data: outPixels, width: outW, height: cropH }, 92);

    const blob = new Blob([encoded.data], { type: 'image/jpeg' });
    const file = new File([blob], 'charlie_hero_cropped_16x9.jpg', { type: 'image/jpeg' });
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