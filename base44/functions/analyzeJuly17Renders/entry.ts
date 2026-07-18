import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const headers = { 'X-Api-Key': HEYGEN_API_KEY };

    const candidates = [
      { video_id: '1fcaeb7db1074a92948404b0102361a3', label: '7:57am PT' },
      { video_id: '310700ada68a43b2af49caed82973273', label: '3:40am PT' },
      { video_id: 'f3f394142acd4c1e9fdc80e02adf8a6c', label: '1:44pm PT (wrong)' },
    ];

    const results = [];
    for (const c of candidates) {
      const statusRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${c.video_id}`, { headers });
      const d = (await statusRes.json())?.data;

      const thumbUrl = d?.thumbnail_url;
      const gifUrl = d?.gif_url;

      let verdict = null;
      if (thumbUrl && gifUrl) {
        const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Analyze these frames from a DNN broadcast video. Look for a WHITE solution panel with GOLD BORDER, DARK SERIF TITLE (not gold bar), and CENTERED GOLD BULLET DOTS. Is the new design present? Describe what you see.`,
          file_urls: [thumbUrl, gifUrl],
          response_json_schema: {
            type: 'object',
            properties: {
              new_design: { type: 'boolean' },
              desc: { type: 'string' }
            },
            required: ['new_design', 'desc']
          }
        });
        verdict = { new_design: llmRes.new_design, desc: llmRes.desc };
      }

      results.push({
        id: c.video_id,
        label: c.label,
        new_design: verdict?.new_design,
        desc: verdict?.desc,
        mp4: d?.video_url
      });
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});