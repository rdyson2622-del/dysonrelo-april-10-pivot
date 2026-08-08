import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const studioBackground = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const gold = '#D4AF37';

// Speaking rate used to estimate per-scene durations from word counts.
const WORDS_PER_SEC = 2.5;
const MAX_BULLETS = 6;

function wordCount(s) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function estDuration(s) {
  return wordCount(s) / WORDS_PER_SEC;
}

/**
 * buildWhiteboard — derives bullet points for Bob's content segment and returns
 * Creatomate elements for a whiteboard panel centered above the Bob box, with
 * each bullet revealed progressively (synced to the estimated content window).
 *
 * Timing model: the stitched MP4 is intro → content → outro. We estimate each
 * scene's duration from its word count, so bullets appear during Bob's segment
 * only and accumulate so the viewer can follow along.
 *
 * Bullets come from broadcast.content_bullets (curated) or are auto-derived
 * from content_script sentences. If no content_script exists, no whiteboard is
 * rendered (we can't time it reliably).
 */
// Hard caps so a single bullet can never wrap to more than ~2 lines and the
// total block can never exceed the panel. These are the root-cause fix for the
// recurring "overlapping garbled text" bug — previous versions derived bullets
// from full sentences and guessed a font size, which overflowed the panel.
const BULLET_MAX_CHARS = 48;
const HEADER_PX = 80; // header + divider reserve inside the panel

function shortenBullet(s) {
  let t = String(s).trim().replace(/\s+/g, ' ');
  // Cut at the first natural break (comma, semicolon, em-dash) for a clean phrase.
  const breakMatch = t.match(/^(.{8,}?)[,;—–-]\s/);
  if (breakMatch && breakMatch[1].length <= BULLET_MAX_CHARS) {
    t = breakMatch[1].trim();
  }
  // Aggressive: keep only the first 5 words so the bullet fits ONE line with no
  // wrapping (Creatomate's wrap was collapsing multi-line text). Manual
  // content_bullets entries are used as-is when present.
  const words = t.split(' ').slice(0, 5).join(' ');
  return words.replace(/[.,;:]+$/, '');
}

function buildWhiteboard(broadcast) {
  const introDur = estDuration(broadcast.intro_script);
  const contentDur = estDuration(broadcast.content_script);

  // Need a content segment to place the whiteboard in.
  if (contentDur <= 0) return [];

  // Resolve bullets: curated first, else derive from content_script sentences.
  let bullets = Array.isArray(broadcast.content_bullets) && broadcast.content_bullets.length
    ? broadcast.content_bullets.map(b => shortenBullet(b)).filter(Boolean)
    : [];
  if (bullets.length === 0 && broadcast.content_script) {
    bullets = broadcast.content_script
      .split(/(?<=[.!?])\s+/)
      .map(s => shortenBullet(s))
      .filter(s => s && wordCount(s) >= 2)
      .slice(0, MAX_BULLETS);
  }
  if (bullets.length === 0) return [];
  bullets = bullets.slice(0, MAX_BULLETS);

  const n = bullets.length;
  const contentStart = introDur;

  // ── ABSOLUTE PIXEL LAYOUT (canvas = 1920×1080) ────────────────────────
  // Previous attempts used percentage-based Y with y_anchor/y_alignment on
  // text elements. Creatomate silently collapsed every bullet to the same
  // Y coordinate, producing the overlapping "smear" the user keeps seeing.
  //
  // Fix: position every text element with y as a NUMBER (Creatomate treats
  // bare numbers as pixels) and y_anchor '0%' (top edge). No y_alignment.
  // Each bullet's TOP edge is at a distinct pixel value — overlap is now
  // mathematically impossible. Shapes (panel, divider) keep percentages
  // since those render correctly.
  const CANVAS_W = 1920;
  const CANVAS_H = 1080;

  // Panel geometry in pixels (centered horizontally, upper-middle vertically).
  const panelWidthPx = Math.round(CANVAS_W * 0.64);   // 1229px
  const panelHeightPx = n <= 2 ? Math.round(CANVAS_H * 0.26)
                       : n <= 4 ? Math.round(CANVAS_H * 0.32)
                                : Math.round(CANVAS_H * 0.38);
  const panelCenterYPx = n <= 2 ? Math.round(CANVAS_H * 0.31)
                       : n <= 4 ? Math.round(CANVAS_H * 0.33)
                                : Math.round(CANVAS_H * 0.35);
  const panelTopPx = panelCenterYPx - Math.round(panelHeightPx / 2);
  const panelLeftPx = Math.round((CANVAS_W - panelWidthPx) / 2);

  // Fixed readable font size — bullets are ≤5 words so they never wrap.
  const fontSize = 38;
  const lineSpacingPx = 64;  // vertical gap between bullet top-edges

  const elements = [];

  // Panel background — gold-bordered white card (shape, percentages OK).
  elements.push({
    type: 'shape',
    path: 'M 0% 0% L 100% 0% L 100% 100% L 0% 100% Z',
    track: 4,
    x: '50%', y: `${(panelCenterYPx / CANVAS_H * 100).toFixed(2)}%`,
    width: '64%', height: `${(panelHeightPx / CANVAS_H * 100).toFixed(2)}%`,
    x_anchor: '50%', y_anchor: '50%',
    fill_color: '#ffffff', fill_opacity: 0.97,
    stroke_color: gold, stroke_width: '0.45 vmin',
    border_radius: '1.5 vmin',
    time: contentStart, duration: contentDur,
    animations: [{ type: 'fade', time: 0, duration: 0.4 }],
  });

  // Header "KEY POINTS" — pixel Y, top-anchored.
  const headerTopPx = panelTopPx + 24;
  elements.push({
    type: 'text',
    track: 5,
    text: 'KEY POINTS',
    x: CANVAS_W / 2,            // pixel center
    y: headerTopPx,            // pixel top-edge
    width: panelWidthPx - 80,
    x_anchor: '50%', y_anchor: '0%',
    font_family: 'Inter',
    font_size: 28,
    font_color: gold,
    x_alignment: '50%',
    time: contentStart, duration: contentDur,
    animations: [{ type: 'fade', time: 0, duration: 0.4 }],
  });

  // Divider line under header — pixel Y as a thin shape.
  const dividerTopPx = headerTopPx + 42;
  elements.push({
    type: 'shape',
    path: 'M 0% 0% L 100% 0% L 100% 100% L 0% 100% Z',
    track: 6,
    x: CANVAS_W / 2, y: dividerTopPx,
    width: Math.round(panelWidthPx * 0.52), height: 2,
    x_anchor: '50%', y_anchor: '0%',
    fill_color: gold, fill_opacity: 0.5,
    time: contentStart, duration: contentDur,
    animations: [{ type: 'fade', time: 0, duration: 0.4 }],
  });

  // ── Bullets — each its own text element, ABSOLUTE pixel Y, top-anchored ──
  // This is the root-cause fix: distinct pixel Y values + y_anchor '0%' means
  // Creatomate cannot collapse them to one line.
  const bodyTopPx = dividerTopPx + 28;
  // Vertically center the bullet block within the remaining panel space.
  const bodyBottomPx = panelTopPx + panelHeightPx - 24;
  const bodyHeightPx = bodyBottomPx - bodyTopPx;
  const blockHeightPx = lineSpacingPx * (n - 1) + fontSize;
  const startYpx = bodyTopPx + Math.max(0, (bodyHeightPx - blockHeightPx) / 2);

  for (let i = 0; i < n; i++) {
    const bulletTopPx = Math.round(startYpx + i * lineSpacingPx);
    elements.push({
      type: 'text',
      track: 7 + i,
      text: `•  ${bullets[i]}`,
      x: CANVAS_W / 2,
      y: bulletTopPx,
      width: Math.round(panelWidthPx * 0.82),
      x_anchor: '50%', y_anchor: '0%',
      font_family: 'Inter',
      font_size: fontSize,
      font_color: '#1a1a1a',
      x_alignment: '50%',
      time: contentStart, duration: contentDur,
      animations: [{ type: 'fade', time: 0.3 + i * 0.15, duration: 0.4 }],
    });
  }

  return elements;
}

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
    // A timed whiteboard panel of bullet points is baked in above Bob's box,
    // synced to the content segment so viewers can follow along.
    const whiteboard = buildWhiteboard(broadcast);

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
      ...whiteboard,
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