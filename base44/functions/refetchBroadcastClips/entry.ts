import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * refetchBroadcastClips — re-downloads clip videos from HeyGen CDN and
 * re-uploads them to Base44 storage. Fixes expired/404 clip URLs that
 * cause black boxes in the composited video.
 *
 * Payload: { broadcastId: string }
 */
const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    const { broadcastId } = await req.json();
    if (!broadcastId) {
      return Response.json({ error: 'broadcastId is required' }, { status: 400 });
    }

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;
    const arr = await Broadcasts.filter({ id: broadcastId });
    const broadcast = arr?.[0];
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const clips = broadcast.clips || [];
    if (clips.length === 0) {
      return Response.json({ error: 'No clips found' }, { status: 400 });
    }

    const results = [];
    const updatedClips = [...clips];

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      if (!clip.heygenId) {
        results.push({ index: i, role: clip.role, status: 'skipped', reason: 'no heygenId' });
        continue;
      }

      // Fetch video status from HeyGen
      const statusRes = await fetch(
        `${HEYGEN_API}/v1/video_status.get?video_id=${clip.heygenId}`,
        { headers: { 'X-Api-Key': HEYGEN_API_KEY } }
      );
      const statusData = await statusRes.json();
      const heygenStatus = statusData.data?.status;
      const heygenVideoUrl = statusData.data?.video_url;

      if (heygenStatus !== 'completed' || !heygenVideoUrl) {
        results.push({ index: i, role: clip.role, status: 'heygen_not_ready', heygenStatus });
        continue;
      }

      // Download from HeyGen CDN
      const vidRes = await fetch(heygenVideoUrl);
      if (!vidRes.ok) {
        results.push({ index: i, role: clip.role, status: 'download_failed', httpStatus: vidRes.status });
        continue;
      }
      const buf = await vidRes.arrayBuffer();
      const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_clip${i}.mp4`, { type: 'video/mp4' });

      // Upload to Base44 storage
      const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

      // Update clip record
      updatedClips[i] = { ...clip, videoUrl: up.file_url, status: 'completed' };
      results.push({ index: i, role: clip.role, status: 'refetched', oldUrl: clip.videoUrl?.substring(0, 60), newUrl: up.file_url?.substring(0, 60) });
    }

    // Save updated clips
    await Broadcasts.update(broadcast.id, { clips: updatedClips });

    return Response.json({ success: true, results, clipCount: clips.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});