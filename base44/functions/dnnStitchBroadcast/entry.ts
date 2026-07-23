import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — stitches individual broadcast clips into a single
 * composited MP4 using HeyGen's multi-input rendering.
 *
 * After all clips for a DnnBroadcast are rendered, this function creates a
 * SINGLE HeyGen render with multiple video_inputs (one per clip), producing
 * one composited video file stored on the DnnBroadcast.videoUrl field.
 *
 * Actions (POST body):
 *   { action: "start", broadcastId?: "..." }
 *     → Finds a completed broadcast with clips but no composited video.
 *       Creates a multi-input HeyGen render and stores the job ID.
 *       If broadcastId is omitted, uses the most recent completed broadcast.
 *
 *   { action: "check" }
 *     → Polls in-progress stitching renders. When completed, downloads and
 *       stores the composited video URL on the DnnBroadcast record.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

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

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'check'; // scheduled automations call with no body → default to check
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: create a multi-input HeyGen render ──
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

      // Already has a composited video
      if (broadcast.videoUrl) {
        return Response.json({ success: true, message: 'Broadcast already has a composited video', videoUrl: broadcast.videoUrl });
      }

      // Already has a stitching render in progress
      if (broadcast.heygenId) {
        return Response.json({ success: true, message: 'Stitching render already in progress', heygenId: broadcast.heygenId });
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'Broadcast has no clips' }, { status: 400 });
      }

      // Build video_inputs — one per clip, preserving each clip's character/voice/background
      const videoInputs = clips.map(clip => {
        const isCharlie = clip.role === 'charlie';
        return isCharlie
          ? {
              character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
              voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: clip.script, speed: 1.05 },
              background: { type: 'color', value: '#00FF00' },
            }
          : {
              character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
              voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: clip.script, emotion: 'Excited', speed: 1.12 },
              background: { type: 'color', value: '#0d0d0d' },
            };
      });

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: videoInputs,
          dimension: { width: 1280, height: 720 },
        }),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen multi-input render failed', details: data }, { status: 502 });
      }

      await Broadcasts.update(broadcast.id, { heygenId: videoId });

      return Response.json({
        success: true,
        message: 'Stitching render started — all clips combined into a single HeyGen render',
        broadcastId: broadcast.id,
        heygenId: videoId,
        clipCount: clips.length,
      });
    }

    // ── CHECK: poll in-progress stitching renders ──
    if (action === 'check') {
      // Find broadcasts with a stitching heygenId but no composited video yet
      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.heygenId && !b.videoUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending stitching renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const res = await fetch(
          `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'X-Api-Key': heygenKey } }
        );
        const data = await res.json();
        const status = data?.data?.status;

        if (status === 'completed') {
          const vidRes = await fetch(data?.data?.video_url);
          if (!vidRes.ok) {
            results.push({ id: broadcast.id, status: 'download_failed' });
            continue;
          }
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_stitched.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

          // Create a VideoLibrary record so the finished MP4 is available for YouTube, LinkedIn, and other venues
          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.`,
            category: 'broadcast',
            source_type: 'upload',
            file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date,
            duration_seconds: data?.data?.duration || null,
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
          });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || 'HeyGen stitching render failed';
          // Clear the heygenId so it can be retried
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