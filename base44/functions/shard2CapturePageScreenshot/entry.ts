import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { Image } from 'https://deno.land/x/imagescript@1.2.17/mod.ts';

const OUT_W = 1920;
const OUT_H = 1080;

/**
 * Force any decoded image into an exact OUT_W x OUT_H frame using a cover-crop
 * (fill the whole frame, crop overflow, never letterbox/pillarbox).
 */
async function toExact16x9(buffer) {
  const img = await Image.decode(new Uint8Array(buffer));
  const srcRatio = img.width / img.height;
  const dstRatio = OUT_W / OUT_H;

  let cropW, cropH, cropX, cropY;
  if (srcRatio > dstRatio) {
    // Source too wide -> crop the sides
    cropH = img.height;
    cropW = Math.round(img.height * dstRatio);
    cropX = Math.round((img.width - cropW) / 2);
    cropY = 0;
  } else {
    // Source too tall -> crop top/bottom (keep the top of the page)
    cropW = img.width;
    cropH = Math.round(img.width / dstRatio);
    cropX = 0;
    cropY = 0; // anchor to top so the hero/header stays in frame
  }

  const cropped = img.crop(cropX, cropY, cropW, cropH);
  cropped.resize(OUT_W, OUT_H);
  return await cropped.encode();
}

/**
 * shard2CapturePageScreenshot
 *
 * Captures a clean, video-ready 1920x1080 (true 16:9) screenshot of a page and
 * saves it as a direct public image URL on the target record(s).
 *
 * Capture rules (HeyGen page_screenshot background requirements):
 *   - viewport 1920x1080, deviceScaleFactor 1
 *   - fullPage = false (visible viewport only, NOT a long vertical scroll)
 *   - no browser chrome, no scrollbars, cropped to fill the full 16:9 canvas
 *
 * The captured PNG is re-uploaded to Base44 public storage so HeyGen always gets
 * a stable, direct, public image URL (never a transient screenshot-service URL).
 *
 * Auth:
 *   - Authenticated admin (app session), OR
 *   - x-pipeline-secret header matching N8N_PIPELINE_SECRET (M2M)
 *
 * Body (one of):
 *   { "explainerId": "..." }   // capture for a CharliePageExplainer (uses its pageUrl)
 *   { "pageId": "..." }        // capture for a DysonPage (uses its pageUrl), also syncs explainers
 *   { "url": "https://..." }   // capture an explicit URL, returns the image URL only
 *
 * Returns: { success: true, pageScreenshotUrl: "https://media.base44.com/..." }
 */
import { blockIfN8n } from '../../shared/n8nGuard.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Auth: pipeline secret OR authenticated admin
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const providedSecret = req.headers.get('x-pipeline-secret');
    const isM2M = expectedSecret && providedSecret === expectedSecret;
    if (!isM2M) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const { explainerId, pageId } = body || {};
    let targetUrl = body?.url;

    let explainer = null;
    let page = null;

    if (!targetUrl && explainerId) {
      const arr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
      explainer = arr?.[0];
      if (!explainer) return Response.json({ error: 'Explainer not found' }, { status: 404 });
      targetUrl = explainer.pageUrl;
    }

    if (!targetUrl && pageId) {
      const arr = await base44.asServiceRole.entities.DysonPage.filter({ id: pageId });
      page = arr?.[0];
      if (!page) return Response.json({ error: 'Page not found' }, { status: 404 });
      targetUrl = page.pageUrl;
    }

    if (!targetUrl) {
      return Response.json({ error: 'Provide explainerId, pageId, or url (target page has no pageUrl set)' }, { status: 400 });
    }

    // --- Capture: 1920x1080 viewport, visible area only, cropped, no chrome ---
    // thum.io is keyless. Params:
    //   /width/1920  -> output width 1920
    //   /viewport/1920x1080 -> render at desktop 16:9 viewport (no mobile sidebars)
    //   /crop/1080   -> crop height to 1080 (kills the long vertical scroll)
    //   /fullpage is intentionally OMITTED so we get the visible viewport only
    // Render at a real desktop 1920x1080 viewport, visible area only (no fullpage).
    // crop/1080 trims the long vertical scroll. We still hard-normalize below.
    const shotUrl = `https://image.thum.io/get/width/1920/viewport/1920x1080/crop/1080/noanimate/${targetUrl}`;

    const shotRes = await fetch(shotUrl);
    if (!shotRes.ok) {
      return Response.json({ error: `Screenshot service failed (${shotRes.status})`, shotUrl }, { status: 502 });
    }
    const rawBuffer = await shotRes.arrayBuffer();
    if (!rawBuffer || rawBuffer.byteLength < 1000) {
      return Response.json({ error: 'Screenshot service returned an empty image', shotUrl }, { status: 502 });
    }

    // Hard-normalize to EXACTLY 1920x1080 via cover-crop so HeyGen always gets a
    // true full-frame 16:9 background — no sidebars, no letterboxing, ever.
    const imgBuffer = await toExact16x9(rawBuffer);

    // Re-upload to Base44 public storage for a stable direct URL
    const file = new File([imgBuffer], `shard2-bg-${Date.now()}.png`, { type: 'image/png' });
    const uploaded = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const pageScreenshotUrl = uploaded?.file_url;
    if (!pageScreenshotUrl) {
      return Response.json({ error: 'Upload to public storage failed' }, { status: 502 });
    }

    // Persist to the relevant record(s)
    if (explainer) {
      await base44.asServiceRole.entities.CharliePageExplainer.update(explainer.id, { pageScreenshotUrl });
    }
    if (page) {
      await base44.asServiceRole.entities.DysonPage.update(page.id, { pageScreenshotUrl });
      // Keep any explainers for this page in sync
      const explainers = await base44.asServiceRole.entities.CharliePageExplainer.filter({ pageId: page.id });
      for (const e of explainers) {
        await base44.asServiceRole.entities.CharliePageExplainer.update(e.id, { pageScreenshotUrl });
      }
    }

    return Response.json({ success: true, pageScreenshotUrl, capturedFrom: targetUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});