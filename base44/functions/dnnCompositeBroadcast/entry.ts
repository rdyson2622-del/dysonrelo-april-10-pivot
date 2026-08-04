import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const studioBackground = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const gold = '#D4AF37';

/**
 * dnnCompositeBroadcast — BAKES the DNN studio background INTO the broadcast MP4.
 *
 * The raw broadcast.videoUrl is just the HeyGen avatar on a black/green background.
 * The studio backdrop only exists as a CSS overlay in the in-browser player. This
 * function composites the raw MP4 over the studio background image via Creatomate so
 * the final MP4 has the full studio set baked in — the version that gets distributed
 * to LinkedIn / Facebook / Instagram.
 *
 * Actions:
 *   start: { broadcast_id } → kicks off the Creatomate render, stores
 *          compositedVideoUrl = 'creatomate:pending:<id>' on the broadcast.
 *   check: { broadcast_id, renderId } → polls Creatomate; on success downloads
 *          the composited MP4, uploads it, and stores the real URL on the broadcast.
 *
 * Auth: admin session OR pipeline secret (for n8n/automation calls).
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'start';

    const user = await base44.auth.me().catch(() => null);
    const pipelineSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isServiceCall = pipelineSecret && body.pipeline_secret === pipelineSecret;
    if ((!user || user.role !== 'admin') && !isServiceCall) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const apiKey = secrets.get('CREATOMATE');
    if (!apiKey) return Response.json({ error: 'CREATOMATE is not configured' }, { status: 500 });

    const broadcastId = body.broadcast_id;
    if (!broadcastId) return Response.json({ error: 'broadcast_id is required' }, { status: 400 });

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcastId).catch(() => null);
    if (!broadcast) return Response.json({ error: 'Broadcast not found' }, { status: 404 });

    const rawUrl = broadcast.videoUrl;
    if (!rawUrl || String(rawUrl).startsWith('heygen:pending:')) {
      return Response.json({ error: 'Broadcast has no finished videoUrl to composite' }, { status: 400 });
    }

    // ─── check action: poll Creatomate, store composited MP4 ─────────────
    if (action === 'check') {
      const renderId = body.renderId || broadcast.compositedRenderId;
      if (!renderId) return Response.json({ error: 'renderId is required' }, { status: 400 });

      const statusRes = await fetch(`https://api.creatomate.com/v2/renders/${encodeURIComponent(renderId)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const render = await statusRes.json();
      if (!statusRes.ok) return Response.json({ error: 'Creatomate status check failed', details: render }, { status: 502 });
      if (render.status !== 'succeeded') {
        return Response.json({ status: render.status, renderId });
      }

      const videoRes = await fetch(render.url);
      if (!videoRes.ok) return Response.json({ error: 'Could not download composited MP4' }, { status: 502 });
      const bytes = await videoRes.arrayBuffer();
      const safeName = String(broadcast.show_name || 'dnn-broadcast').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
      const file = new File([bytes], `${safeName}-studio.mp4`, { type: 'video/mp4' });
      const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });

      await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
        compositedVideoUrl: upload.file_url,
        compositedRenderId: null,
        status: broadcast.status === 'compositing' ? 'ready' : broadcast.status,
      });

      return Response.json({
        status: 'succeeded',
        broadcast_id: broadcastId,
        compositedVideoUrl: upload.file_url,
        creatomateUrl: render.url,
        duration: render.duration,
      });
    }

    // ─── start action: kick off Creatomate composite ─────────────────────
    // Studio background full-frame + the raw broadcast MP4 in a gold-bordered
    // black-backed box at the bottom-center (matches the in-browser Charlie box).
    const elements = [
      { type: 'image', track: 1, source: studioBackground, fit: 'cover' },
      // Black backing box behind the video (covers chroma-key edges)
      {
        type: 'shape', path: 'M 0% 0% L 100% 0% L 100% 100% L 0% 100% Z', track: 2,
        x: '50%', y: '80%', width: '33%', height: '33%',
        x_anchor: '50%', y_anchor: '50%',
        fill_color: '#000000', border_radius: '1.2 vmin',
      },
      // The broadcast video in a gold-bordered box (the "Charlie box")
      {
        type: 'video', track: 3, source: rawUrl,
        x: '50%', y: '80%', width: '32%', height: '32%',
        x_anchor: '50%', y_anchor: '50%',
        fit: 'cover', volume: '100%',
        stroke_color: gold, stroke_width: '0.4 vmin', border_radius: '1 vmin',
      },
    ];

    const createRes = await fetch('https://api.creatomate.com/v2/renders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        output_format: 'mp4', width: 1920, height: 1080, frame_rate: 30,
        elements,
        metadata: JSON.stringify({ type: 'dnn_broadcast_studio_composite', broadcast_id: broadcastId }),
      }),
    });
    const created = await createRes.json();
    const render = Array.isArray(created) ? created[0] : created;
    if (!createRes.ok || !render?.id) {
      return Response.json({ error: 'Creatomate render failed to start', details: created }, { status: 502 });
    }

    await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, {
      compositedVideoUrl: `creatomate:pending:${render.id}`,
      compositedRenderId: render.id,
      status: 'compositing',
    });

    return Response.json({
      status: render.status || 'planned',
      renderId: render.id,
      broadcast_id: broadcastId,
      prospectiveUrl: render.url,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}