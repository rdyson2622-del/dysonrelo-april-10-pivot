import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { FFmpeg } from 'npm:@ffmpeg/ffmpeg@0.12.10';
import { fetchFile } from 'npm:@ffmpeg/util@0.12.1';

/**
 * compositeShowClips — Downloads all clips for a DnnBroadcast, concatenates them
 * into a single MP4 using ffmpeg.wasm, uploads to Base44 permanent storage,
 * and stores the composited URL on the broadcast's videoUrl field.
 *
 * Auth: admin only.
 */
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

    const body = await req.json().catch(() => ({}));
    const { broadcastId } = body;
    if (!broadcastId) {
      return Response.json({ error: 'broadcastId required' }, { status: 400 });
    }

    const broadcasts = await base44.asServiceRole.entities.DnnBroadcast.filter({ id: broadcastId });
    const broadcast = broadcasts?.[0];
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const clips = (broadcast.clips || []).filter(c => c.videoUrl);
    if (clips.length === 0) {
      return Response.json({ error: 'No clips with videoUrl found' }, { status: 400 });
    }

    if (clips.length === 1) {
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, { videoUrl: clips[0].videoUrl });
      return Response.json({ success: true, videoUrl: clips[0].videoUrl, message: 'Single clip — set as videoUrl directly' });
    }

    console.log(`[COMPOSITE] Concatenating ${clips.length} clips for broadcast ${broadcastId}`);

    // Initialize ffmpeg.wasm
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    console.log('[COMPOSITE] ffmpeg.wasm loaded');

    // Download and write each clip to the virtual FS
    for (let i = 0; i < clips.length; i++) {
      const clipUrl = clips[i].videoUrl;
      console.log(`[COMPOSITE] Downloading clip ${i}: ${clipUrl.substring(0, 80)}...`);
      const data = await fetchFile(clipUrl);
      await ffmpeg.writeFile(`clip${i}.mp4`, data);
    }

    // Build the concat list file
    let listContent = '';
    for (let i = 0; i < clips.length; i++) {
      listContent += `file 'clip${i}.mp4'\n`;
    }
    await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(listContent));

    // Concatenate — re-encode audio, copy video stream for speed
    console.log('[COMPOSITE] Running ffmpeg concat...');
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '23',
      '-c:a', 'aac',
      '-movflags', '+faststart',
      'output.mp4'
    ]);

    // Read the output file
    const outputData = await ffmpeg.readFile('output.mp4');
    console.log(`[COMPOSITE] Output file size: ${outputData.byteLength} bytes`);

    // Upload to Base44 storage
    const blob = new Blob([outputData], { type: 'video/mp4' });
    const file = new File([blob], `dnn_broadcast_${broadcast.broadcast_date}_composite.mp4`, { type: 'video/mp4' });

    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const compositeUrl = uploadRes.file_url;
    console.log(`[COMPOSITE] Uploaded to: ${compositeUrl}`);

    // Update the broadcast
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, { videoUrl: compositeUrl });

    // Cleanup virtual FS
    for (let i = 0; i < clips.length; i++) {
      try { await ffmpeg.deleteFile(`clip${i}.mp4`); } catch (_) {}
    }
    try { await ffmpeg.deleteFile('concat.txt'); } catch (_) {}
    try { await ffmpeg.deleteFile('output.mp4'); } catch (_) {}

    return Response.json({
      success: true,
      videoUrl: compositeUrl,
      clipCount: clips.length,
      message: `Composited ${clips.length} clips into single MP4`
    });
  } catch (error) {
    console.error(`[COMPOSITE] Error: ${error.message}`);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});