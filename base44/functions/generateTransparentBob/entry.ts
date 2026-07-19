import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * generateTransparentBob — generates a short transparent-background WebM video
 * of Bob Dyson using HeyGen's v3/videos API with output_format: "webm".
 *
 * The WebM carries a real alpha channel, so Bob can be layered over the studio
 * backdrop with no visible box or background at all.
 *
 * Uses Bob's real HeyGen avatar (not AI-generated).
 *
 * Auth: admin session.
 */
const HEYGEN_V3_API = 'https://api.heygen.com/v3/videos';
const BOB_AVATAR_ID = '91ce5373b31a477682d23fe196bce66b';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'start';

    // ── START: Generate transparent WebM video of Bob ──
    if (action === 'start') {
      const script = body?.script || 'Hello, I am Bob Dyson.';

      const payload = {
        type: 'avatar',
        avatar_id: BOB_AVATAR_ID,
        script,
        voice_id: BOB_VOICE_ID,
        title: 'Bob Dyson — Transparent Cutout',
        resolution: '1080p',
        aspect_ratio: '16:9',
        output_format: 'webm',
      };

      console.log(`[TRANSPARENT BOB] Requesting WebM render for avatar ${BOB_AVATAR_ID}`);

      const res = await fetch(HEYGEN_V3_API, {
        method: 'POST',
        headers: { 'x-api-key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.message || JSON.stringify(data?.error || data);
        return Response.json({
          error: 'HeyGen transparent render failed',
          details: errMsg,
          rawStatus: res.status,
        }, { status: 502 });
      }

      const videoId = data?.data?.video_id;
      const outputFormat = data?.data?.output_format;

      if (!videoId) {
        return Response.json({ error: 'No video_id returned', details: data }, { status: 502 });
      }

      if (outputFormat !== 'webm') {
        return Response.json({
          error: `HeyGen did not accept WebM format (got ${outputFormat}). Bob's avatar may not support matting.`,
          details: data,
        }, { status: 502 });
      }

      console.log(`[TRANSPARENT BOB] Render started: ${videoId} (webm)`);

      return Response.json({
        success: true,
        videoId,
        outputFormat,
        message: 'Transparent WebM render started. Poll with action "check".',
      });
    }

    // ── CHECK: Poll render, download, persist to Base44 storage ──
    if (action === 'check') {
      const videoId = body?.videoId;
      if (!videoId) {
        return Response.json({ error: 'videoId is required for check' }, { status: 400 });
      }

      const res = await fetch(`${HEYGEN_V3_API}/${videoId}`, {
        headers: { 'x-api-key': heygenKey },
      });
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const webmUrl = data?.data?.video_url;
        if (!webmUrl) {
          return Response.json({ error: 'Completed but no video_url' }, { status: 500 });
        }

        // Download the transparent WebM
        console.log(`[TRANSPARENT BOB] Downloading WebM: ${webmUrl.substring(0, 80)}...`);
        const videoRes = await fetch(webmUrl);
        const videoBlob = await videoRes.blob();

        // Upload to permanent storage
        const file = new File([videoBlob], 'bob_dyson_transparent.webm', { type: 'video/webm' });
        const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        const permanentUrl = uploadRes.file_url;
        console.log(`[TRANSPARENT BOB] Uploaded to permanent storage: ${permanentUrl}`);

        return Response.json({
          success: true,
          status: 'completed',
          videoUrl: permanentUrl,
          heygenUrl: webmUrl,
        });
      } else if (status === 'failed') {
        const errMsg = data?.data?.failure_message || 'Render failed';
        return Response.json({ success: false, status: 'failed', error: errMsg });
      } else {
        return Response.json({ success: true, status: status || 'processing' });
      }
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});