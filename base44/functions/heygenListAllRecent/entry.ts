import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    const listResp = await fetch('https://api.heygen.com/v1/video.list?limit=30', { headers });
    const listData = await listResp.json();
    const videos = listData?.data?.videos || listData?.data?.list || [];

    const detailed = [];
    for (const v of videos.slice(0, 30)) {
      const id = v.video_id || v.id;
      const dResp = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${id}`, { headers });
      const dData = await dResp.json();
      const d = dData?.data || {};
      detailed.push({
        video_id: id,
        status: d.status,
        created_at: v.created_at,
        created_date: new Date(v.created_at * 1000).toISOString(),
        duration: d.duration,
        video_url: d.video_url,
      });
    }

    // Sort by created_at desc
    detailed.sort((a, b) => b.created_at - a.created_at);

    // Only multi-scene renders (duration > 90s = full broadcast), compact output
    const multiScene = detailed.filter(v => v.duration && v.duration > 90).map(v => ({
      video_id: v.video_id,
      created_date: v.created_date,
      duration: Math.round(v.duration),
    }));

    return Response.json({ count: multiScene.length, videos: multiScene });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});