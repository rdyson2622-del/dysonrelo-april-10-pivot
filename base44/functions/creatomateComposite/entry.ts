import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * creatomateComposite — composites HeyGen-rendered broadcast clips into a
 * studio MP4 using the Creatomate API (RenderScript / JSON-only).
 *
 * Takes individual clip videoUrls from a DnnBroadcast record and layers them
 * onto the DNN studio background with:
 *   - Studio backdrop image (full-screen base track)
 *   - Charlie clips positioned on the left wall
 *   - Bob clips positioned on the right wall
 *   - News pills along the floor
 *   - DNN logo in the top-left corner
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */
const CREATOMATE_BASE = 'https://api.creatomate.com/v2/renders';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';
const GOLD = '#D4AF37';

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

    // ── START ──
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

      const lc = { ...DEFAULTS, ...(broadcast.layoutConfig || {}) };
      const pct = (v) => `${v}%`;

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

      // Presenter clips — sequential on track 2 (each vanishes when its segment ends)
      // No fit:cover, no background fill — transparent bounding box so no black rectangle
      for (const clip of clips) {
        const isCharlie = clip.role === 'charlie';
        elements.push({
          type: 'video',
          track: 2,
          source: clip.videoUrl,
          width: pct(lc.presenterWidth),
          height: pct(lc.presenterHeight),
          x: pct(isCharlie ? lc.charlieX : lc.bobX),
          y: pct(isCharlie ? lc.charlieY : lc.bobY),
          x_anchor: isCharlie ? '0%' : '100%',
          y_anchor: '100%',
          x_alignment: isCharlie ? '0%' : '100%',
          y_alignment: '100%',
          background_color: 'transparent',
        });
      }

      // News pills — floor labels (track 4, on top of everything)
      const pillLabels = ['NEWS', 'RELOCATION', 'INTELLIGENCE'];
      for (let i = 0; i < pillLabels.length; i++) {
        const pillSpacing = 100 / (pillLabels.length + 1);
        const pillX = pillSpacing * (i + 1);
        elements.push({
          type: 'text',
          track: 4,
          time: 0,
          text: pillLabels[i],
          width: pct(lc.pillWidth),
          x: pct(pillX),
          y: pct(lc.pillY),
          x_anchor: '50%',
          y_anchor: '50%',
          x_alignment: '50%',
          y_alignment: '50%',
          fill_color: GOLD,
          font_family: 'Inter',
          font_weight: '700',
          font_size: '2.5 vmin',
          text_align: 'center',
          background_color: 'rgba(0,0,0,0.85)',
          background_x_padding: '30%',
          background_y_padding: '20%',
          background_border_radius: '50%',
        });
      }

      // Show title text overlay (optional)
      if (lc.showText) {
        elements.push({
          type: 'text',
          track: 3,
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

      // DNN logo — top left corner
      elements.push({
        type: 'image',
        track: 3,
        time: 0,
        source: DNN_LOGO_URL,
        width: '12%',
        height: '6.75%',
        x: '8%',
        y: '6%',
        x_anchor: '50%',
        y_anchor: '50%',
        x_alignment: '50%',
        y_alignment: '50%',
      });

      const renderScript = {
        output_format: 'mp4',
        width: 1920,
        height: 1080,
        frame_rate: 30,
        elements,
      };

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

      await Broadcasts.update(broadcast.id, { heygenId: renderId });

      return Response.json({
        success: true,
        message: 'Creatomate composite render started',
        broadcastId: broadcast.id,
        renderId,
        clipCount: clips.length,
      });
    }

    // ── CHECK ──
    if (action === 'check') {
      if (body.renderId) {
        const cmRes = await fetch(
          `${CREATOMATE_BASE}/${encodeURIComponent(body.renderId)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );
        const cmData = await cmRes.json();

        if (cmData.status === 'succeeded' && cmData.url && body.broadcastId) {
          const vidRes = await fetch(cmData.url);
          if (vidRes.ok) {
            const buf = await vidRes.arrayBuffer();
            const file = new File([buf], `dnn_broadcast_persisted.mp4`, { type: 'video/mp4' });
            const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
            await Broadcasts.update(body.broadcastId, { videoUrl: up.file_url, heygenId: '' });

            const bData = await Broadcasts.filter({ id: body.broadcastId });
            const broadcast = bData?.[0];
            if (broadcast) {
              const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
              const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
              const libData = {
                title: libTitle,
                description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}.`,
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
            }

            return Response.json({
              success: true,
              message: 'Composite downloaded and persisted',
              videoUrl: up.file_url,
              duration: cmData?.duration,
            });
          }
        }

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

          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_creatomate.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

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

    // ── GENERATE TEASER ──
    if (action === 'generateTeaser') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        const completed = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 20);
        broadcast = completed.find(b => b.videoUrl && !b.teaserUrl);
      }

      if (!broadcast) {
        return Response.json({ error: 'No completed broadcast with composited video but no teaser found' }, { status: 404 });
      }

      if (!broadcast.videoUrl) {
        return Response.json({ error: 'Broadcast has no composited video URL' }, { status: 400 });
      }

      if (broadcast.teaserUrl) {
        return Response.json({ success: true, message: 'Teaser already generated', teaserUrl: broadcast.teaserUrl });
      }

      if (broadcast.teaserRenderId) {
        return Response.json({ success: true, message: 'Teaser render in progress', renderId: broadcast.teaserRenderId });
      }

      const teaserScript = {
        output_format: 'mp4',
        width: 1920,
        height: 1080,
        frame_rate: 30,
        elements: [
          {
            type: 'video',
            track: 1,
            source: broadcast.videoUrl,
            width: '100%',
            height: '100%',
            x: '50%',
            y: '50%',
            x_anchor: '50%',
            y_anchor: '50%',
            x_alignment: '50%',
            y_alignment: '50%',
            trim_start: 0,
            trim_duration: 5,
          },
          {
            type: 'text',
            track: 2,
            time: 0,
            text: 'WATCH THE FULL SHOW\n1dnn.com/#news',
            x: '50%',
            y: '85%',
            x_anchor: '50%',
            y_anchor: '50%',
            x_alignment: '50%',
            y_alignment: '50%',
            fill_color: GOLD,
            font_family: 'Inter',
            font_weight: '900',
            font_size: '5 vmin',
            text_align: 'center',
            background_color: 'rgba(0,0,0,0.85)',
            background_x_padding: '40%',
            background_y_padding: '30%',
            background_border_radius: '8%',
          },
        ],
      };

      const cmRes = await fetch(CREATOMATE_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teaserScript),
      });

      const cmData = await cmRes.json();
      const renderId = cmData?.id;

      if (!cmRes.ok || !renderId) {
        return Response.json({ error: 'Creatomate teaser render failed', details: cmData }, { status: 502 });
      }

      await Broadcasts.update(broadcast.id, { teaserRenderId: renderId });

      return Response.json({
        success: true,
        message: 'Teaser render started',
        broadcastId: broadcast.id,
        renderId,
      });
    }

    // ── CHECK TEASER ──
    if (action === 'checkTeaser') {
      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.teaserRenderId && !b.teaserUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending teaser renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const cmRes = await fetch(
          `${CREATOMATE_BASE}/${encodeURIComponent(broadcast.teaserRenderId)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );
        const cmData = await cmRes.json();
        const status = cmData?.status;

        if (status === 'succeeded') {
          const teaserUrl = cmData?.url;
          if (!teaserUrl) {
            results.push({ id: broadcast.id, status: 'succeeded_but_no_url' });
            continue;
          }

          const vidRes = await fetch(teaserUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_teaser_${broadcast.broadcast_date}.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { teaserUrl: up.file_url, teaserRenderId: '' });

          results.push({ id: broadcast.id, status: 'teaser_ready', teaserUrl: up.file_url });
        } else if (status === 'failed') {
          const errMsg = cmData?.error_message || 'Teaser render failed';
          await Broadcasts.update(broadcast.id, { teaserRenderId: '' });
          results.push({ id: broadcast.id, status: 'failed', error: errMsg });
        } else {
          results.push({ id: broadcast.id, status: status || 'processing' });
        }
      }

      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'action must be "start", "check", "generateTeaser", or "checkTeaser"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});