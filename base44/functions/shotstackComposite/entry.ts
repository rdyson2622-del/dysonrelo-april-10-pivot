import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * shotstackComposite — composites HeyGen-rendered broadcast clips into a
 * studio MP4 using the Shotstack API.
 *
 * Takes individual clip videoUrls from a DnnBroadcast record and bakes them
 * onto the studio background with:
 *   - Studio backdrop image (full-screen base track)
 *   - Charlie clips positioned on the left wall
 *   - Bob clips positioned on the right wall with black side panels
 *   - Whiteboard overlay with bullet points (HTML asset)
 *   - News pills on the floor
 *
 * Actions (POST body):
 *   { action: "start", broadcastId: "..." }
 *     → Builds a Shotstack timeline from the broadcast's clips and submits
 *       for rendering. Stores the Shotstack render ID on the broadcast.
 *
 *   { action: "check" }
 *     → Polls in-progress Shotstack renders. When complete, downloads the
 *       final MP4 and stores it on DnnBroadcast.videoUrl + VideoLibrary.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 *
 * NOTE: Sandbox tier renders include a Shotstack watermark.
 */
const SHOTSTACK_BASE = 'https://api.shotstack.io/stage';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO_URL = 'https://qtrypzzcjebvfcihihnt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';
const GOLD = '#D4AF37';

// Default per-clip length (seconds) — used when we can't probe the video.
// Shotstack will hold the last frame if the video is shorter than this.
const DEFAULT_CLIP_LENGTH = 30;

// Presenter box dimensions (as fraction of frame)
const PRESENTER_SCALE = 0.32;
const CHARLIE_POS = { x: -0.62, y: -0.25 };
const BOB_POS = { x: 0.62, y: -0.25 };

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Auth: admin or M2M pipeline secret
    const providedSecret = req.headers.get('x-pipeline-secret');
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isM2M = providedSecret && expectedSecret && providedSecret === expectedSecret;
    if (!isM2M) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const shotstackKey = Deno.env.get('shotstack');
    if (!shotstackKey) {
      return Response.json({ error: 'shotstack API key not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'check';
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: build timeline and submit to Shotstack ──
    if (action === 'start') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        const completed = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 20);
        broadcast = completed.find(b =>
          b.clips?.length > 0 &&
          b.clips.every(c => c.videoUrl) &&
          !b.videoUrl
        );
      }

      if (!broadcast) {
        return Response.json({ error: 'No completed broadcast with un-stitched clips found' }, { status: 404 });
      }

      // If force=true, clear old composited video
      if (body.force && (broadcast.videoUrl || broadcast.heygenId)) {
        await Broadcasts.update(broadcast.id, { videoUrl: '', heygenId: '', errorMessage: '' });
        broadcast.videoUrl = '';
        broadcast.heygenId = '';
      }

      if (broadcast.videoUrl) {
        return Response.json({ success: true, message: 'Broadcast already has a composited video', videoUrl: broadcast.videoUrl });
      }

      if (broadcast.heygenId) {
        return Response.json({ success: true, message: 'Shotstack render already in progress', renderId: broadcast.heygenId });
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'Broadcast has no clips' }, { status: 400 });
      }

      // ── Build the Shotstack timeline ──
      // Track 0 (bottom): Studio background image (full duration)
      // Track 1: Charlie clips (left wall, sequential)
      // Track 2: Bob clips (right wall, sequential, with black side panels)
      // Track 3: Whiteboard overlay (HTML asset, shown during Bob clips with bullets)
      // Track 4: News pills + DNN logo (full duration overlays)

      const totalDuration = clips.reduce((sum, c) => sum + (DEFAULT_CLIP_LENGTH), 0);

      // Studio background — spans the entire timeline
      const bgClips = [{
        asset: { type: 'image', src: STUDIO_BG_URL },
        start: 0,
        length: totalDuration,
        fit: 'crop',
      }];

      // Charlie and Bob clips — positioned on their respective walls
      const charlieClips = [];
      const bobClips = [];
      const whiteboardClips = [];

      let currentTime = 0;
      for (const clip of clips) {
        const clipLen = DEFAULT_CLIP_LENGTH;
        const isCharlie = clip.role === 'charlie';

        if (isCharlie) {
          charlieClips.push({
            asset: {
              type: 'video',
              src: clip.videoUrl,
            },
            start: currentTime,
            length: clipLen,
            fit: 'contain',
            transform: {
              position: { x: CHARLIE_POS.x, y: CHARLIE_POS.y },
              scale: { x: PRESENTER_SCALE, y: PRESENTER_SCALE },
            },
            transition: { in: 'fade', out: 'fade' },
          });
        } else {
          // Bob — video on right wall
          bobClips.push({
            asset: {
              type: 'video',
              src: clip.videoUrl,
            },
            start: currentTime,
            length: clipLen,
            fit: 'contain',
            transform: {
              position: { x: BOB_POS.x, y: BOB_POS.y },
              scale: { x: PRESENTER_SCALE, y: PRESENTER_SCALE },
            },
            transition: { in: 'fade', out: 'fade' },
          });

          // Whiteboard overlay — HTML asset with bullet points
          // Extract bullets from the clip script (split by newlines, filter short lines)
          const bullets = (clip.script || '')
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 10 && l.length < 200)
            .slice(0, 4);

          if (bullets.length > 0) {
            const bulletHtml = bullets.map(b =>
              `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
                <div style="width:8px;height:8px;border-radius:50%;background:${GOLD};margin-top:6px;flex-shrink:0;"></div>
                <span style="color:#2a2a2a;font-size:22px;font-family:Inter,sans-serif;">${b.replace(/</g, '&lt;')}</span>
              </div>`
            ).join('');

            whiteboardClips.push({
              asset: {
                type: 'html',
                html: `<div style="background:#f5f0e8;border:3px solid ${GOLD};border-radius:6px;padding:24px;box-shadow:0 6px 24px rgba(0,0,0,0.4);width:100%;height:100%;box-sizing:border-box;">
                  ${bulletHtml}
                </div>`,
                width: 460,
                height: 280,
                background: 'transparent',
              },
              start: currentTime,
              length: clipLen,
              transform: {
                position: { x: 0, y: 0.12 },
                scale: { x: 0.95, y: 0.95 },
              },
              transition: { in: 'fade', out: 'fade' },
            });
          }
        }

        currentTime += clipLen;
      }

      // News pills — small HTML badges along the bottom of the frame
      const pillLabels = ['MARKET PULSE', 'RATE WATCH', 'MIGRATION DATA', 'HOUSING SUPPLY'];
      const pillWidth = 120;
      const pillGap = 10;
      const pillStartX = -((pillLabels.length * (pillWidth + pillGap)) / 2) + pillWidth / 2;

      const newsPillClips = pillLabels.map((label, i) => ({
        asset: {
          type: 'html',
          html: `<div style="background:rgba(0,0,0,0.7);border:1px solid rgba(212,175,55,0.4);border-radius:20px;padding:6px 14px;color:${GOLD};font-size:11px;font-weight:700;letter-spacing:1.5px;font-family:Inter,sans-serif;white-space:nowrap;">${label}</div>`,
          width: pillWidth,
          height: 32,
          background: 'transparent',
        },
        start: 0,
        length: totalDuration,
        transform: {
          position: { x: pillStartX + i * (pillWidth + pillGap), y: -0.42 },
        },
      }));

      // DNN logo badge — top left corner
      const logoClip = {
        asset: { type: 'image', src: DNN_LOGO_URL },
        start: 0,
        length: totalDuration,
        fit: 'contain',
        transform: {
          position: { x: -0.72, y: 0.42 },
          scale: { x: 0.12, y: 0.12 },
        },
      };

      const timeline = {
        background: '#000000',
        tracks: [
          { clips: bgClips },                           // Track 0: studio background
          { clips: charlieClips },                       // Track 1: Charlie (left wall)
          { clips: bobClips },                           // Track 2: Bob (right wall)
          { clips: whiteboardClips },                    // Track 3: whiteboard overlay
          { clips: [...newsPillClips, logoClip] },      // Track 4: news pills + logo
        ],
      };

      // Submit to Shotstack
      const renderBody = {
        timeline,
        output: {
          format: 'mp4',
          resolution: '1080',
          aspectRatio: '16:9',
        },
      };

      const ssRes = await fetch(`${SHOTSTACK_BASE}/render`, {
        method: 'POST',
        headers: {
          'x-api-key': shotstackKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(renderBody),
      });

      const ssData = await ssRes.json();
      const renderId = ssData?.response?.id;

      if (!ssRes.ok || !renderId) {
        return Response.json({
          error: 'Shotstack render failed',
          details: ssData,
        }, { status: 502 });
      }

      // Store the Shotstack render ID in the heygenId field (reusing the field)
      await Broadcasts.update(broadcast.id, { heygenId: renderId });

      return Response.json({
        success: true,
        message: 'Shotstack composite render started',
        broadcastId: broadcast.id,
        renderId,
        clipCount: clips.length,
        totalDuration,
      });
    }

    // ── CHECK: poll in-progress Shotstack renders ──
    if (action === 'check') {
      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.heygenId && !b.videoUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending Shotstack renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const ssRes = await fetch(
          `${SHOTSTACK_BASE}/render/${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'x-api-key': shotstackKey } }
        );
        const ssData = await ssRes.json();
        const status = ssData?.response?.status;

        if (status === 'done') {
          const videoUrl = ssData?.response?.url;
          if (!videoUrl) {
            results.push({ id: broadcast.id, status: 'done_but_no_url' });
            continue;
          }

          // Download and re-upload to Base44 storage
          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_shotstack.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

          // Create/update VideoLibrary entry
          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Composited via Shotstack.`,
            category: 'broadcast',
            source_type: 'upload',
            file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date,
            duration_seconds: ssData?.response?.duration || null,
            tags: ['DNN', 'broadcast', 'real_estate', 'relocation', 'shotstack'],
            is_active: true,
          };
          if (existingLib && existingLib.length > 0) {
            await base44.asServiceRole.entities.VideoLibrary.update(existingLib[0].id, libData);
          } else {
            await base44.asServiceRole.entities.VideoLibrary.create(libData);
          }

          results.push({
            id: broadcast.id,
            date: broadcast.broadcast_date,
            status: 'composited',
            videoUrl: up.file_url,
            duration: ssData?.response?.duration,
            libraryEntry: libTitle,
          });
        } else if (status === 'failed') {
          const errMsg = ssData?.response?.error || 'Shotstack render failed';
          await Broadcasts.update(broadcast.id, { heygenId: '', errorMessage: errMsg });
          results.push({ id: broadcast.id, status: 'failed', error: errMsg });
        } else {
          results.push({ id: broadcast.id, status: status || 'processing' });
        }
      }

      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});