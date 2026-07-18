import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * reuploadShow5Clips — Downloads Show #5's clips from HeyGen's CDN and
 * re-uploads them to permanent Base44 storage, then updates the clip
 * videoUrls so the broadcast is stable and won't cut out mid-playback.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const SHOW_ID = '6a5bc3f68c59018e59d35a69';
    const shows = await base44.asServiceRole.entities.DnnBroadcast.filter({ id: SHOW_ID });
    const show = shows?.[0];
    if (!show || !show.clips?.length) return Response.json({ error: 'Show or clips not found' }, { status: 404 });

    const updatedClips = [...show.clips];
    const results = [];

    for (let i = 0; i < updatedClips.length; i++) {
      const clip = updatedClips[i];
      if (!clip.videoUrl) continue;
      // Skip if already on permanent storage
      if (clip.videoUrl.includes('base44.app')) {
        results.push({ index: i, role: clip.role, skipped: true, url: clip.videoUrl });
        continue;
      }

      console.log(`[CLIP ${i}] Downloading from HeyGen CDN...`);
      const res = await fetch(clip.videoUrl);
      if (!res.ok) {
        results.push({ index: i, role: clip.role, error: `Download failed: ${res.status}` });
        continue;
      }
      const buf = await res.arrayBuffer();
      const cleanName = `dnn_broadcast_2026-07-18_clip${i}.mp4`;
      const file = new File([buf], cleanName, { type: 'video/mp4' });
      const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
      console.log(`[CLIP ${i}] Uploaded to permanent storage: ${up.file_url}`);

      updatedClips[i] = { ...clip, videoUrl: up.file_url };
      results.push({ index: i, role: clip.role, old_url: clip.videoUrl.substring(0, 80), new_url: up.file_url });
    }

    await base44.asServiceRole.entities.DnnBroadcast.update(SHOW_ID, { clips: updatedClips });

    return Response.json({ success: true, clipsUpdated: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});