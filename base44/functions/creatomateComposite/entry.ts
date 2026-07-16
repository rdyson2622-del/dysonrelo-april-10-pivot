import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * creatomateComposite — composites HeyGen-rendered broadcast clips into a
 * studio MP4 using the Creatomate API (RenderScript / JSON-only, no template
 * editor needed).
 *
 * Takes individual clip videoUrls from a DnnBroadcast record and layers them
 * onto the DNN studio background with:
 *   - Studio backdrop image (full-screen base track)
 *   - Charlie clips positioned on the left wall
 *   - Bob clips positioned on the right wall
 *   - News pills along the floor
 *   - DNN logo in the top-left corner
 *
 * Uses Creatomate's RenderScript format (pure JSON) — no template design
 * required in the Creatomate editor.
 *
 * Actions (POST body):
 *   { action: "start", broadcastId?: "..." }
 *     → Finds a completed broadcast with clips but no composited video.
 *       Builds a RenderScript and submits to Creatomate. Stores the render ID.
 *       If broadcastId is omitted, uses the most recent completed broadcast.
 *
 *   { action: "check" }
 *     → Polls in-progress Creatomate renders. When complete, downloads the
 *       final MP4 and stores it on DnnBroadcast.videoUrl + VideoLibrary.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */
const CREATOMATE_BASE = 'https://api.creatomate.com/v2/renders';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/822c13049_generated_image.png';
const DNN_LOGO_URL = 'https://qtrypzzcjebvfcihihnt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';
const DNN_STING_URL = 'https://media.base44.com/videos/public/69d905d72ff7c93b5ef050c4/22d54186e_DNN_Sting_v3.mp4';
const GOLD = '#D4AF37';

// Presenter box dimensions (as % of 1920x1080 frame) — defaults
// Overridable per-broadcast via DnnBroadcast.layoutConfig
const DEFAULTS = {
  presenterWidth: 15,
  presenterHeight: 50,
  charlieX: 4,
  charlieY: 100,
  bobX: 96,
  bobY: 100,
  pillY: 93,
  pillWidth: 14,
  showText: '',
  showTextX: 50,
  showTextY: 8,
  showTextSize: 3,
};

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

    const apiKey = Deno.env.get('CREATOMATE');
    if (!apiKey) {
      return Response.json({ error: 'CREATOMATE API key not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'check';
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: build RenderScript and submit to Creatomate ──
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
          (body.force || !b.videoUrl)
        );
      }

      if (!broadcast) {
        return Response.json({ error: 'No completed broadcast with un-composited clips found' }, { status: 404 });
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
        return Response.json({ success: true, message: 'Creatomate render already in progress', renderId: broadcast.heygenId });
      }

      const clips = (broadcast.clips || []).filter(c => c.videoUrl);
      if (clips.length === 0) {
        return Response.json({ error: 'Broadcast has no clips with video URLs' }, { status: 400 });
      }

      // Merge broadcast-specific layout overrides with defaults
      const lc = { ...DEFAULTS, ...(broadcast.layoutConfig || {}) };
      const pct = (v) => `${v}%`;

      // ── Build the RenderScript ──
      // Creatomate RenderScript: elements array, tracks layered bottom→top.
      // Track 1 (bottom): Studio background image (full screen, full duration)
      // Track 2: Static presenter headshots (always visible, frozen first frame, muted)
      // Track 3: Opener sting → presenter clips → closer sting (auto-sequenced)
      // Track 4 (top): Name/title overlays + news pills + show text (full duration)

      const elements = [];

      // Studio background — full screen
      elements.push({
        type: 'image',
        track: 1,
        time: 0,
        source: STUDIO_BG_URL,
        width: '100%',
        height: '100%',
        x: '50%',
        y: '50%',
        x_anchor: '50%',
        y_anchor: '50%',
        x_alignment: '50%',
        y_alignment: '50%',
      });

      // Identify first clip per presenter for static headshot
      const charlieClip = clips.find(c => c.role === 'charlie');
      const bobClip = clips.find(c => c.role === 'bob');

      // Static Charlie headshot — always visible on left, frozen first frame, muted
      if (charlieClip) {
        elements.push({
          type: 'video',
          track: 2,
          time: 0,
          source: charlieClip.videoUrl,
          width: pct(lc.presenterWidth),
          height: pct(lc.presenterHeight),
          x: pct(lc.charlieX),
          y: pct(lc.charlieY),
          x_anchor: '0%',
          y_anchor: '100%',
          x_alignment: '0%',
          y_alignment: '100%',
          trim_start: 0,
          trim_duration: 0.5,
          loop: true,
          volume: 0,
        });
      }

      // Static Bob headshot — always visible on right, frozen first frame, muted
      if (bobClip) {
        elements.push({
          type: 'video',
          track: 2,
          time: 0,
          source: bobClip.videoUrl,
          width: pct(lc.presenterWidth),
          height: pct(lc.presenterHeight),
          x: pct(lc.bobX),
          y: pct(lc.bobY),
          x_anchor: '100%',
          y_anchor: '100%',
          x_alignment: '100%',
          y_alignment: '100%',
          trim_start: 0,
          trim_duration: 0.5,
          loop: true,
          volume: 0,
        });
      }

      // Presenter clips — active video on track 3, positioned over static headshots
      // Audio normalized to volume: 1.0 for consistent levels between presenters
      const clipElements = clips.map(clip => {
        const isCharlie = clip.role === 'charlie';
        return {
          type: 'video',
          track: 1,
          source: clip.videoUrl,
          width: pct(lc.presenterWidth),
          height: pct(lc.presenterHeight),
          x: pct(isCharlie ? lc.charlieX : lc.bobX),
          y: pct(isCharlie ? lc.charlieY : lc.bobY),
          x_anchor: isCharlie ? '0%' : '100%',
          y_anchor: '100%',
          x_alignment: isCharlie ? '0%' : '100%',
          y_alignment: '100%',
          volume: isCharlie ? 1.0 : 2.5,
          animations: [
            { time: 0, duration: 0.5, type: 'fade', transition: true },
          ],
        };
      });

      // DNN opener sting — full screen, auto-sequences first on track 3
      elements.push({
        type: 'video',
        track: 3,
        source: DNN_STING_URL,
        width: '100%',
        height: '100%',
        x: '50%',
        y: '50%',
        x_anchor: '50%',
        y_anchor: '50%',
        x_alignment: '50%',
        y_alignment: '50%',
        volume: 1.0,
      });

      // Presenter composition — auto-sequences after the opener sting
      elements.push({
        type: 'composition',
        track: 3,
        width: '100%',
        height: '100%',
        x: '50%',
        y: '50%',
        x_anchor: '50%',
        y_anchor: '50%',
        x_alignment: '50%',
        y_alignment: '50%',
        elements: clipElements,
      });

      // DNN closer sting — auto-sequences after presenters
      elements.push({
        type: 'video',
        track: 3,
        source: DNN_STING_URL,
        width: '100%',
        height: '100%',
        x: '50%',
        y: '50%',
        x_anchor: '50%',
        y_anchor: '50%',
        x_alignment: '50%',
        y_alignment: '50%',
        volume: 1.0,
      });

      // Name/title overlay — Charlie (below box)
      if (charlieClip) {
        elements.push({
          type: 'text',
          track: 4,
          time: 0,
          text: 'CHARLIE SIMMONS\nDNN ANCHOR',
          width: pct(lc.presenterWidth + 2),
          x: pct(lc.charlieX),
          y: pct(lc.charlieY + 2),
          x_anchor: '0%',
          y_anchor: '100%',
          x_alignment: '0%',
          y_alignment: '100%',
          fill_color: GOLD,
          font_family: 'Inter',
          font_weight: '700',
          font_size: '1.4 vmin',
          text_align: 'center',
          background_color: 'rgba(0,0,0,0.85)',
          background_x_padding: '30%',
          background_y_padding: '25%',
          background_border_radius: '10%',
        });
      }

      // Name/title overlay — Bob (below box)
      if (bobClip) {
        elements.push({
          type: 'text',
          track: 4,
          time: 0,
          text: 'BOB DYSON\nFOUNDER',
          width: pct(lc.presenterWidth + 2),
          x: pct(lc.bobX),
          y: pct(lc.bobY + 2),
          x_anchor: '100%',
          y_anchor: '100%',
          x_alignment: '100%',
          y_alignment: '100%',
          fill_color: GOLD,
          font_family: 'Inter',
          font_weight: '700',
          font_size: '1.4 vmin',
          text_align: 'center',
          background_color: 'rgba(0,0,0,0.85)',
          background_x_padding: '30%',
          background_y_padding: '25%',
          background_border_radius: '10%',
        });
      }

      // News pills — bottom of screen, full duration
      const pillLabels = ['MARKET PULSE', 'RATE WATCH', 'MIGRATION DATA', 'HOUSING SUPPLY'];
      const pillSpacing = 100 / (pillLabels.length + 1); // evenly distributed
      for (let i = 0; i < pillLabels.length; i++) {
        const pillX = pillSpacing * (i + 1);
        elements.push({
          type: 'text',
          track: 4,
          time: 0,
          text: pillLabels[i],
          width: pct(lc.pillWidth),
          height: '4%',
          x: `${pillX}%`,
          y: pct(lc.pillY),
          x_anchor: '50%',
          y_anchor: '50%',
          x_alignment: '50%',
          y_alignment: '50%',
          fill_color: GOLD,
          font_family: 'Inter',
          font_weight: '700',
          font_size: '2.2 vmin',
          background_color: 'rgba(0,0,0,0.75)',
          background_x_padding: '60%',
          background_y_padding: '40%',
          background_border_radius: '40%',
        });
      }

      // Show title text overlay (optional)
      if (lc.showText) {
        elements.push({
          type: 'text',
          track: 4,
          time: 0,
          text: lc.showText,
          x: pct(lc.showTextX),
          y: pct(lc.showTextY),
          x_anchor: '50%',
          y_anchor: '50%',
          x_alignment: '50%',
          y_alignment: '50%',
          fill_color: GOLD,
          font_family: 'Inter',
          font_weight: '900',
          font_size: `${lc.showTextSize} vmin`,
        });
      }

      // DNN logo — top left corner (skip if URL is unreachable; non-critical)
      // Note: Supabase URLs may 404 for Creatomate's downloader; we skip the logo
      // rather than fail the entire render. Add a hosted public URL here to re-enable.
      // elements.push({
      //   type: 'image', track: 3, time: 0, source: DNN_LOGO_URL,
      //   width: '12%', height: '6.75%', x: '8%', y: '6%',
      //   x_anchor: '50%', y_anchor: '50%', x_alignment: '50%', y_alignment: '50%',
      // });

      const renderScript = {
        output_format: 'mp4',
        width: 1920,
        height: 1080,
        frame_rate: 30,
        elements,
      };

      // Submit to Creatomate
      const cmRes = await fetch(CREATOMATE_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(renderScript),
      });

      const cmData = await cmRes.json();
      const renderId = cmData?.id;

      if (!cmRes.ok || !renderId) {
        return Response.json({
          error: 'Creatomate render failed',
          details: cmData,
        }, { status: 502 });
      }

      // Store the Creatomate render ID in the heygenId field (reusing the field)
      await Broadcasts.update(broadcast.id, { heygenId: renderId });

      return Response.json({
        success: true,
        message: 'Creatomate composite render started',
        broadcastId: broadcast.id,
        renderId,
        clipCount: clips.length,
      });
    }

    // ── CHECK: poll in-progress Creatomate renders ──
    if (action === 'check') {
      if (body.renderId) {
        const cmRes = await fetch(
          `${CREATOMATE_BASE}/${encodeURIComponent(body.renderId)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );
        const cmData = await cmRes.json();
        return Response.json({ render: cmData });
      }

      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.heygenId && !b.videoUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending Creatomate renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const cmRes = await fetch(
          `${CREATOMATE_BASE}/${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );
        const cmData = await cmRes.json();
        const status = cmData?.status;

        if (status === 'succeeded') {
          const videoUrl = cmData?.url;
          if (!videoUrl) {
            results.push({ id: broadcast.id, status: 'succeeded_but_no_url' });
            continue;
          }

          // Download and re-upload to Base44 storage
          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_creatomate.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

          // Create/update VideoLibrary entry
          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Composited via Creatomate.`,
            category: 'broadcast',
            source_type: 'upload',
            file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date,
            duration_seconds: cmData?.duration || null,
            tags: ['DNN', 'broadcast', 'real_estate', 'relocation', 'creatomate'],
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
            duration: cmData?.duration,
            libraryEntry: libTitle,
          });
        } else if (status === 'failed') {
          const errMsg = cmData?.error_message || 'Creatomate render failed';
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