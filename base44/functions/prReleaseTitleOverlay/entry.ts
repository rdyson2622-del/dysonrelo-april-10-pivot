import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Burns the PrRelease's bannerHook text as a bold lower-third title over the
// first 3 seconds of a finished Bob video (via Creatomate), then saves the
// resulting MP4 back onto that PrRelease's mediaAssetUrl.
//
// Payload:
//   { action: 'start', releaseId, videoUrl, titleText } -> dispatches the Creatomate render, returns renderId
//   { action: 'check', releaseId, renderId } -> polls; on success uploads + saves mediaAssetUrl
// Auth: admin session.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = secrets.get('CREATOMATE');
    if (!apiKey) return Response.json({ error: 'CREATOMATE is not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));

    if (body.action === 'check') {
      if (!body.renderId) return Response.json({ error: 'renderId is required' }, { status: 400 });
      const statusRes = await fetch(`https://api.creatomate.com/v2/renders/${encodeURIComponent(body.renderId)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const render = await statusRes.json();
      if (!statusRes.ok) return Response.json({ error: 'Creatomate status check failed', details: render }, { status: 502 });
      if (render.status !== 'succeeded') return Response.json({ status: render.status, renderId: body.renderId });

      const videoRes = await fetch(render.url);
      if (!videoRes.ok) return Response.json({ error: 'Could not download completed MP4' }, { status: 502 });
      const bytes = await videoRes.arrayBuffer();
      const file = new File([bytes], `pr_release_titled_${body.renderId}.mp4`, { type: 'video/mp4' });
      const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });

      if (body.releaseId) {
        await base44.asServiceRole.entities.PrRelease.update(body.releaseId, { mediaAssetUrl: upload.file_url, titleOverlayAppliedAt: new Date().toISOString() });
      }

      return Response.json({ status: 'succeeded', mp4Url: upload.file_url });
    }

    // action: 'start'
    if (!body.videoUrl || !body.titleText) {
      return Response.json({ error: 'videoUrl and titleText are required' }, { status: 400 });
    }

    const createRes = await fetch('https://api.creatomate.com/v2/renders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        output_format: 'mp4',
        width: 1280,
        height: 720,
        frame_rate: 30,
        elements: [
          { type: 'video', track: 1, source: body.videoUrl, fit: 'cover' },
          {
            type: 'shape', track: 2, path: 'M 0% 0% L 100% 0% L 100% 100% L 0% 100% Z',
            x: '50%', y: '85%', width: '100%', height: '16%',
            x_anchor: '50%', y_anchor: '50%',
            fill_color: 'rgba(13,13,13,0.82)',
            time: 0, duration: 3,
          },
          {
            type: 'text', track: 3, text: String(body.titleText).toUpperCase(),
            x: '50%', y: '85%', width: '92%', height: '14%',
            x_anchor: '50%', y_anchor: '50%', x_alignment: '50%', y_alignment: '50%',
            fill_color: '#D4AF37', font_family: 'Inter', font_weight: '800',
            font_size: '5.2 vmin', letter_spacing: '4%',
            time: 0, duration: 3,
          },
        ],
        metadata: JSON.stringify({ type: 'pr_release_title_overlay', releaseId: body.releaseId || null }),
      }),
    });
    const created = await createRes.json();
    const render = Array.isArray(created) ? created[0] : created;
    if (!createRes.ok || !render?.id) return Response.json({ error: 'Creatomate render failed to start', details: created }, { status: 502 });

    return Response.json({ status: render.status || 'planned', renderId: render.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});