import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { audio_url, avatar_id } = await req.json();
    if (!audio_url) return Response.json({ error: 'audio_url required' }, { status: 400 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const avatarId = avatar_id || 'Adrian_public_2_20240312';

    // Submit video generation job using pre-recorded audio
    const heygenRes = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: avatarId,
            avatar_style: 'normal',
          },
          voice: {
            type: 'audio',
            audio_url: audio_url,
          },
          background: {
            type: 'color',
            value: '#1a1a1a',
          },
        }],
        dimension: { width: 1280, height: 720 },
        aspect_ratio: '16:9',
      }),
    });

    const heygenBody = await heygenRes.json();
    console.log('[INFO] HeyGen response:', JSON.stringify(heygenBody));

    if (heygenBody.error) {
      return Response.json({ error: heygenBody.error }, { status: 500 });
    }

    const videoId = heygenBody.data?.video_id;
    return Response.json({ video_id: videoId, status: 'pending' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});