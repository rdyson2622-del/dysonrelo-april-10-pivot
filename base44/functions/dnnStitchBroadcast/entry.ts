import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — composites individual broadcast clips into a single
 * MP4 with BOTH presenters visible simultaneously, using Creatomate.
 *
 * Layout:
 *   - Studio backdrop fills the full frame continuously.
 *   - Charlie's video box is permanently locked in the lower-left corner.
 *   - Bob's video box is permanently locked in the lower-right corner.
 *   - When a presenter is not speaking, their track shows a muted loop
 *     of their clip (never black, never disappears).
 *   - blend_mode "screen" makes each clip's black background transparent,
 *     so only the presenter is composited over the studio backdrop.
 *
 * Actions (POST body):
 *   { action: "start", broadcastId?: "...", force?: true }
 *     → Creates a Creatomate render compositing all clips with both
 *       presenters visible simultaneously over the studio backdrop.
 *
 *   { action: "check" }
 *     → Polls Creatomate for render completion. Downloads and stores
 *       the composited MP4 when ready.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */

const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

// Presenter box positions (percentages of 1280×720 canvas)
// Charlie: lower-left, Bob: lower-right
const CHARLIE_BOX = { x: "28%", y: "72%", width: "34%", height: "46%" };
const BOB_BOX     = { x: "72%", y: "72%", width: "34%", height: "46%" };

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Auth: admin session or M2M pipeline secret
    const providedSecret = req.headers.get('x-pipeline-secret');
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isM2M = providedSecret && expectedSecret && providedSecret === expectedSecret;
    if (!isM2M) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const creatomateKey = Deno.env.get('CREATOMATE');
    if (!creatomateKey) {
      return Response.json({ error: 'CREATOMATE not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'check';
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: create a Creatomate composited render ──
    if (action === 'start') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        // Find the most recent completed broadcast with clips but no composited video
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

      // If force=true, clear old composited video so a fresh stitch can start
      if (body.force && (broadcast.videoUrl || broadcast.heygenId)) {
        await Broadcasts.update(broadcast.id, { videoUrl: '', heygenId: '', errorMessage: '' });
        broadcast.videoUrl = '';
        broadcast.heygenId = '';
      }

      // Already has a composited video
      if (broadcast.videoUrl) {
        return Response.json({ success: true, message: 'Broadcast already has a composited video', videoUrl: broadcast.videoUrl });
      }

      // Already has a stitching render in progress
      if (broadcast.heygenId) {
        return Response.json({ success: true, message: 'Stitching render already in progress', renderId: broadcast.heygenId });
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'Broadcast has no clips' }, { status: 400 });
      }

      // Verify all clips have rendered video URLs
      const missingClips = clips.filter(c => !c.videoUrl);
      if (missingClips.length > 0) {
        return Response.json({ error: `${missingClips.length} clips missing videoUrl` }, { status: 400 });
      }

      // ── Build the Creatomate RenderScript ──
      // The studio background is a full-frame image rendered first (behind everything).
      // Each clip becomes a composition containing:
      //   Track 1: the speaking presenter's video (with audio)
      //   Track 2: the idle presenter's video (muted loop, never black)
      // Compositions are on the same outer track so they play sequentially.
      // Both presenter boxes are visible simultaneously within each composition.

      const elements = [];

      // 1. Studio backdrop — full frame, continuous, behind everything
      elements.push({
        type: "image",
        source: STUDIO_BG_URL,
        width: "100%",
        height: "100%",
        x: "50%",
        y: "50%",
        fit: "cover",
        z_index: 0
      });

      // 2. For each clip, create a composition with both presenters visible
      clips.forEach((clip, index) => {
        const isCharlie = clip.role === 'charlie';
        const speakingBox = isCharlie ? CHARLIE_BOX : BOB_BOX;
        const idleBox     = isCharlie ? BOB_BOX     : CHARLIE_BOX;

        // Find an idle clip for the OTHER presenter.
        // Prefer the most recent clip of the opposite role before this one;
        // fall back to the first clip of the opposite role after this one.
        let idleClip = null;
        for (let i = index - 1; i >= 0; i--) {
          if (clips[i].role !== clip.role) { idleClip = clips[i]; break; }
        }
        if (!idleClip) {
          for (let i = index + 1; i < clips.length; i++) {
            if (clips[i].role !== clip.role) { idleClip = clips[i]; break; }
          }
        }

        const compElements = [];

        // Speaking video — positioned in presenter's corner, with audio
        // blend_mode "screen" makes the clip's black background transparent
        // so only the presenter is composited over the studio backdrop.
        compElements.push({
          type: "video",
          track: 1,
          source: clip.videoUrl,
          x: speakingBox.x,
          y: speakingBox.y,
          width: speakingBox.width,
          height: speakingBox.height,
          fit: "contain",
          blend_mode: "screen",
          volume: "100%"
        });

        // Idle video — muted loop of the other presenter's clip
        // Never black, never disappears — the idle presenter remains visible
        // in their corner throughout the segment as a clean loop.
        if (idleClip) {
          compElements.push({
            type: "video",
            track: 2,
            source: idleClip.videoUrl,
            x: idleBox.x,
            y: idleBox.y,
            width: idleBox.width,
            height: idleBox.height,
            fit: "contain",
            blend_mode: "screen",
            loop: true,
            volume: "0%"
          });
        }

        // Composition auto-detects its duration from track 1 (the speaking clip).
        // Compositions are on the same outer track, so they play sequentially.
        elements.push({
          type: "composition",
          track: 1,
          elements: compElements
        });
      });

      const renderScript = {
        output_format: "mp4",
        width: 1280,
        height: 720,
        frame_rate: 30,
        elements: elements
      };

      // Submit to Creatomate
      const res = await fetch('https://api.creatomate.com/v2/renders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${creatomateKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(renderScript)
      });

      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: 'Creatomate render failed', details: data }, { status: 502 });
      }

      const renderId = data.id;
      if (!renderId) {
        return Response.json({ error: 'No render ID returned from Creatomate', details: data }, { status: 502 });
      }

      // Store the Creatomate render ID (using heygenId field for backward compat)
      await Broadcasts.update(broadcast.id, { heygenId: renderId });

      return Response.json({
        success: true,
        message: 'Creatomate render started — both presenters visible simultaneously with studio backdrop',
        broadcastId: broadcast.id,
        renderId: renderId,
        clipCount: clips.length,
        provider: 'creatomate'
      });
    }

    // ── CHECK: poll Creatomate for render status ──
    if (action === 'check') {
      // Find broadcasts with a render ID but no composited video yet
      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.heygenId && !b.videoUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending stitching renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const res = await fetch(
          `https://api.creatomate.com/v2/renders/${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'Authorization': `Bearer ${creatomateKey}` } }
        );
        const data = await res.json();
        const status = data.status;

        if (status === 'succeeded') {
          const videoUrl = data.url;
          if (!videoUrl) {
            results.push({ id: broadcast.id, status: 'no_url' });
            continue;
          }

          // Download and store the composited MP4
          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_stitched.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

          // Create a VideoLibrary record so the finished MP4 is available for YouTube, LinkedIn, etc.
          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.`,
            category: 'broadcast',
            source_type: 'upload',
            file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date,
            duration_seconds: data.duration || null,
            tags: ['DNN', 'broadcast', 'real_estate', 'relocation'],
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
            status: 'stitched',
            videoUrl: up.file_url,
            libraryEntry: libTitle,
            provider: 'creatomate'
          });
        } else if (status === 'failed') {
          const errMsg = data.error_message || 'Creatomate render failed';
          // Clear the render ID so it can be retried
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