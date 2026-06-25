import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Lists the most recent rendered HeyGen videos so admin can pick the newest clone.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    const listResp = await fetch('https://api.heygen.com/v1/video.list?limit=12', { headers });
    const listData = await listResp.json();
    const videos = listData?.data?.videos || listData?.data?.list || [];

    // For completed videos, fetch the detail to get the playable URL
    const detailed = [];
    for (const v of videos.slice(0, 12)) {
      const id = v.video_id || v.id;
      const status = v.status;
      let video_url = v.video_url || null;
      if (status === 'completed' && !video_url && id) {
        try {
          const dResp = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${id}`, { headers });
          const dData = await dResp.json();
          video_url = dData?.data?.video_url || null;
        } catch (_) {}
      }
      detailed.push({
        video_id: id,
        status,
        created_at: v.created_at,
        title: v.video_title || v.title || null,
        video_url,
      });
    }

    return Response.json({ count: detailed.length, videos: detailed });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});