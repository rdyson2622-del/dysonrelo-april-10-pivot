import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — composites individual broadcast clips into a single
 * MP4 with BOTH presenters visible simultaneously, using Creatomate.
 *
 * Layout:
 *   - Studio backdrop fills the full frame continuously.
 *   - Charlie's video box is permanently locked in the lower-left corner (55% scale).
 *   - Bob's video box is permanently locked in the lower-right corner (55% scale).
 *   - When a presenter is not speaking, their track shows a muted loop
 *     of their clip (never black, never disappears).
 *   - blend_mode "screen" makes each clip's black background transparent,
 *     so only the presenter is composited over the studio backdrop.
 *   - When Bob speaks, a bordered white "Solution Panel" appears in the
 *     studio backdrop's screen area, displaying concise bullet points
 *     extracted from Bob's script.
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

// Presenter box positions — 55% scale, locked to lower-left and lower-right corners
const CHARLIE_BOX = { x: "20%", y: "72%", width: "55%", height: "55%" };
const BOB_BOX     = { x: "80%", y: "72%", width: "55%", height: "55%" };

// Solution Panel — bordered white box inside the studio backdrop's screen area
const PANEL = {
  x: "50%",
  y: "25%",
  width: "42%",
  height: "32%",
  // Inner text area (with padding inside the panel)
  titleY: "14%",
  titleHeight: "6%",
  bulletsY: "29%",
  bulletsWidth: "36%",
  bulletsHeight: "22%",
};

const GOLD = "#D4AF37";
const DARK_TEXT = "#0a0a0a";

/**
 * Extract concise bullet points from Bob's script using the LLM.
 * Falls back to sentence splitting if the LLM call fails.
 */
async function extractBullets(script, base44) {
  if (!script || script.trim().length === 0) return [];

  try {
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are extracting key solution bullet points from a DNN broadcast script segment spoken by Bob Dyson (a 55-year real estate veteran).

Extract 3-4 concise, punchy bullet points that capture the SOLUTION Bob is offering viewers. Each bullet should be a short action-oriented point (max 12 words). Do not include filler words or intros — just the core solution points.

Return ONLY the bullet points as a JSON array of strings. Each string should NOT start with "•" — just the text.

Script:
${script}`,
      response_json_schema: {
        type: 'object',
        properties: {
          bullets: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['bullets']
      }
    });
    const bullets = (result.bullets || []).filter(b => b && b.trim().length > 0).slice(0, 4);
    if (bullets.length > 0) return bullets;
  } catch (e) {
    console.log(`LLM bullet extraction failed, falling back to sentence split: ${e.message}`);
  }

  // Fallback: split into sentences and take the first 3-4
  const sentences = script.split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 120);
  return sentences.slice(0, 4);
}

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

      if (body.force && (broadcast.videoUrl || broadcast.heygenId)) {
        await Broadcasts.update(broadcast.id, { videoUrl: '', heygenId: '', errorMessage: '' });
        broadcast.videoUrl = '';
        broadcast.heygenId = '';
      }

      if (broadcast.videoUrl) {
        return Response.json({ success: true, message: 'Broadcast already has a composited video', videoUrl: broadcast.videoUrl });
      }

      if (broadcast.heygenId) {
        return Response.json({ success: true, message: 'Stitching render already in progress', renderId: broadcast.heygenId });
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'Broadcast has no clips' }, { status: 400 });
      }

      const missingClips = clips.filter(c => !c.videoUrl);
      if (missingClips.length > 0) {
        return Response.json({ error: `${missingClips.length} clips missing videoUrl` }, { status: 400 });
      }

      // ── Build the Creatomate RenderScript ──
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
      for (let index = 0; index < clips.length; index++) {
        const clip = clips[index];
        const isCharlie = clip.role === 'charlie';
        const isBob = !isCharlie;
        const speakingBox = isCharlie ? CHARLIE_BOX : BOB_BOX;
        const idleBox     = isCharlie ? BOB_BOX     : CHARLIE_BOX;

        // Find an idle clip for the OTHER presenter
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

        // Speaking video — 55% scale, positioned in presenter's corner
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
          volume: "100%",
          z_index: 10
        });

        // Idle video — muted loop of the other presenter's clip (never black)
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
            volume: "0%",
            z_index: 9
          });
        }

        // ── Solution Panel (Bob's segments only) ──
        // When Bob speaks, a bordered white panel appears in the studio
        // backdrop's screen area, displaying concise solution bullet points.
        if (isBob) {
          // Extract bullet points from Bob's script
          const bullets = await extractBullets(clip.script, base44);

          if (bullets.length > 0) {
            // Panel background — white bordered box with gold border and shadow
            compElements.push({
              type: "shape",
              track: 1,
              x: PANEL.x,
              y: PANEL.y,
              width: PANEL.width,
              height: PANEL.height,
              fill_color: "#ffffff",
              stroke_color: GOLD,
              stroke_width: "0.25vmin",
              border_radius: "0.8vmin",
              shadow_color: "#000000",
              shadow_blur: "1.5vmin",
              shadow_y: "0.3vmin",
              shadow_opacity: "40%",
              z_index: 5,
              // Fade in/out animation
              animations: [
                { time: 0, duration: 0.5, easing: "ease", type: "fade" },
                { time: 0, duration: 0.5, offset: 1, easing: "ease", type: "fade" }
              ]
            });

            // Title bar — gold background with white text
            compElements.push({
              type: "text",
              track: 1,
              x: PANEL.x,
              y: PANEL.titleY,
              width: PANEL.width,
              height: PANEL.titleHeight,
              text: "THE DYSON SOLUTION",
              fill_color: "#ffffff",
              font_family: "Inter",
              font_weight: 700,
              font_size: null,
              font_size_minimum: "1.5vmin",
              font_size_maximum: "2.5vmin",
              x_alignment: "50%",
              y_alignment: "50%",
              text_transform: "uppercase",
              letter_spacing: "8%",
              background_color: GOLD,
              background_x_padding: "8%",
              background_y_padding: "15%",
              background_border_radius: "10%",
              z_index: 6,
              animations: [
                { time: 0, duration: 0.5, easing: "ease", type: "fade" },
                { time: 0, duration: 0.5, offset: 1, easing: "ease", type: "fade" }
              ]
            });

            // Bullet points — dark text on white panel
            const bulletText = bullets.map(b => `• ${b}`).join('\n');
            compElements.push({
              type: "text",
              track: 1,
              x: PANEL.x,
              y: PANEL.bulletsY,
              width: PANEL.bulletsWidth,
              height: PANEL.bulletsHeight,
              text: bulletText,
              fill_color: DARK_TEXT,
              font_family: "Inter",
              font_weight: 500,
              font_size: null,
              font_size_minimum: "1.5vmin",
              font_size_maximum: "2.8vmin",
              x_alignment: "0%",
              y_alignment: "0%",
              text_wrap: true,
              line_height: "160%",
              z_index: 6,
              animations: [
                { time: 0, duration: 0.5, easing: "ease", type: "fade" },
                { time: 0, duration: 0.5, offset: 1, easing: "ease", type: "fade" }
              ]
            });
          }
        }

        // Composition auto-detects its duration from track 1 (the speaking clip)
        elements.push({
          type: "composition",
          track: 1,
          elements: compElements
        });
      }

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

      await Broadcasts.update(broadcast.id, { heygenId: renderId });

      return Response.json({
        success: true,
        message: 'Creatomate render started — dual avatars + solution panel over studio backdrop',
        broadcastId: broadcast.id,
        renderId: renderId,
        clipCount: clips.length,
        provider: 'creatomate'
      });
    }

    // ── CHECK: poll Creatomate for render status ──
    if (action === 'check') {
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

          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_stitched.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

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