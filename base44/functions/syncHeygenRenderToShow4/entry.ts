import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * syncHeygenRenderToShow4 — pulls a specific HeyGen render by video ID,
 * downloads the MP4 from the HeyGen CDN, uploads it permanently to Base44
 * platform storage, and updates Show #4's videoUrl field.
 *
 * Does NOT trigger a new render — only maps an existing HeyGen asset.
 *
 * Payload: { heygenVideoId: "1fcaeb7d..." }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const heygenVideoId = body?.heygenVideoId;
    if (!heygenVideoId) return Response.json({ error: 'heygenVideoId required' }, { status: 400 });

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    // 1. Fetch HeyGen status to get the CDN MP4 URL
    const statusRes = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(heygenVideoId)}`,
      { headers: { 'X-Api-Key': heygenKey } }
    );
    const statusData = (await statusRes.json())?.data;

    if (!statusData) return Response.json({ error: 'HeyGen returned no data' }, { status: 502 });
    if (statusData.status !== 'completed') {
      return Response.json({ error: `HeyGen render not completed (status: ${statusData.status})` }, { status: 400 });
    }

    const cdnUrl = statusData.video_url;
    if (!cdnUrl) return Response.json({ error: 'No video_url on HeyGen CDN' }, { status: 404 });

    // 2. Download the MP4 from HeyGen CDN
    const vidRes = await fetch(cdnUrl);
    if (!vidRes.ok) return Response.json({ error: `CDN download failed: ${vidRes.status}` }, { status: 502 });
    const buf = await vidRes.arrayBuffer();

    // 3. Upload to Base44 platform storage with a clean filename
    const cleanName = `Show4_July17_Render_${heygenVideoId.slice(0, 8)}.mp4`;
    const file = new File([buf], cleanName, { type: 'video/mp4' });
    const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    // 4. Update Show #4
    const SHOW_ID = '6a57c2a751d0648ec726cb7c';
    await base44.asServiceRole.entities.DnnBroadcast.update(SHOW_ID, {
      videoUrl: up.file_url,
    });

    return Response.json({
      success: true,
      heygenVideoId,
      cdnUrl,
      storedUrl: up.file_url,
      filename: cleanName,
      duration: statusData.duration || null,
      thumbnail: statusData.thumbnail_url || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});