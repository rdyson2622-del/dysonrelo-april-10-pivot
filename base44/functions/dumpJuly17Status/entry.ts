import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const headers = { 'X-Api-Key': HEYGEN_API_KEY };

    const candidates = [
      '1fcaeb7db1074a92948404b0102361a3',
      '310700ada68a43b2af49caed82973273',
      'f3f394142acd4c1e9fdc80e02adf8a6c',
    ];

    const results = [];
    for (const vid of candidates) {
      const statusRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${vid}`, { headers });
      const statusData = await statusRes.json();
      results.push({
        video_id: vid,
        full_data: statusData?.data
      });
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});