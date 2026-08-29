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
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

import { blockIfN8n } from '../../shared/n8nGuard.ts';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';
import { uploadCharlieDeskTalkingPhoto } from '../../shared/charlieDeskAsset.ts';
import { uploadBobOutsideTalkingPhoto } from '../../shared/bobOutsideAsset.ts';
import { sanitizeVoiceScript } from '../../shared/sanitizeVoiceScript.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
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

      // Build video_inputs — one per clip. Charlie uses the locked, Bob-free
      // desk still uploaded fresh as a talking_photo (same asset proven on the
      // "Charlie Speaking at the Desk" preview render) — never avatar_id.
      let charlieTalkingPhotoId = null;
      let bobTalkingPhotoId = null;
      if (clips.some(c => c.role === 'charlie')) {
        charlieTalkingPhotoId = await uploadCharlieDeskTalkingPhoto(heygenKey);
      }
      if (clips.some(c => c.role === 'bob')) {
        bobTalkingPhotoId = await uploadBobOutsideTalkingPhoto(heygenKey);
      }
      const videoInputs = clips.map(clip => {
        const isCharlie = clip.role === 'charlie';
        const sanitizedScript = sanitizeVoiceScript(clip.script);
        return isCharlie
          ? {
              character: { type: 'talking_photo', talking_photo_id: charlieTalkingPhotoId, scale: 1, offset: { x: 0, y: 0 } },
              voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: sanitizedScript, speed: 0.8 },
              background: { type: 'color', value: '#0d0d0d' },
            }
          : {
              character: { type: 'talking_photo', talking_photo_id: bobTalkingPhotoId, scale: 1, offset: { x: 0, y: 0 } },
              voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: sanitizedScript, emotion: 'Excited', speed: 0.92 },
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

      await Broadcasts.update(broadcast.id, { heygenId: videoId, errorMessage: '' });

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
      // Multi-input stitched renders (3 clips combined) take longer than a
      // single clip render — align the timeout with the platform's 20-minute
      // render watchdog standard instead of the old 5-minute cutoff, which
      // was killing renders that were still legitimately in HeyGen's queue.
      const TWENTY_MINUTES = 20 * 60 * 1000;
      for (const broadcast of pending) {
        if (Date.now() - new Date(broadcast.updated_date).getTime() > TWENTY_MINUTES) {
          await Broadcasts.update(broadcast.id, { heygenId: '', errorMessage: 'Stitching render timed out after 20 minutes' });
          results.push({ id: broadcast.id, status: 'timeout', error: 'Stitching render timed out after 20 minutes' });
          continue;
        }

        const { status, videoUrl, error, duration } = await checkHeygenStatus(heygenKey, broadcast.heygenId);

        if (status === 'completed' && videoUrl) {
          const vidRes = await fetch(videoUrl);
          if (!vidRes.ok) {
            // Don't silently retry the same (likely expired) URL forever —
            // clear heygenId so the admin sees a clear failure and can hit
            // "Start Stitching" again to get a fresh render.
            const errMsg = `HeyGen reported the stitched video as ready, but downloading it failed (HTTP ${vidRes.status}). Click Start Stitching to retry.`;
            await Broadcasts.update(broadcast.id, { heygenId: '', errorMessage: errMsg });
            results.push({ id: broadcast.id, status: 'download_failed', error: errMsg });
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
            duration_seconds: duration || null,
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
          const errMsg = error || 'HeyGen stitching render failed';
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