import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const SHOW_ID = '6a57c2a751d0648ec726cb7c';

    const shows = await base44.asServiceRole.entities.DnnBroadcast.filter({ id: SHOW_ID });
    const show = shows?.[0];
    if (!show || !show.heygenId) return Response.json({ error: 'Show or heygenId not found' }, { status: 404 });

    // Fetch HeyGen CDN URL (clean, no hash prefix)
    const statusRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${show.heygenId}`, {
      headers: { 'X-Api-Key': HEYGEN_API_KEY },
    });
    const statusData = await statusRes.json();
    const cdnUrl = statusData?.data?.video_url;

    if (!cdnUrl) return Response.json({ error: 'HeyGen CDN URL not available', status: statusData?.data?.status }, { status: 502 });

    await base44.asServiceRole.entities.DnnBroadcast.update(SHOW_ID, { videoUrl: cdnUrl });

    return Response.json({
      success: true,
      heygenId: show.heygenId,
      clean_url: cdnUrl,
      duration: statusData?.data?.duration,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});