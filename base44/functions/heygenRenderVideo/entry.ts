import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * heygenRenderVideo
 * 
 * Takes a DNN article ID, synthesizes Charon audio via charlieSpeak,
 * uploads the audio to HeyGen, and kicks off a lip-sync avatar video render job.
 * 
 * Payload: { article_id: string, avatar_id: string (HeyGen Photo Avatar ID) }
 * Returns: { video_id, status } — poll heygenCheckVideo for completion.
 * 
 * When complete, heygenCheckVideo writes the video_url back to DnnArticle.video_url.
 */

const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const { article_id, avatar_id } = await req.json();
    if (!article_id || !avatar_id) {
      return Response.json({ error: 'article_id and avatar_id are required' }, { status: 400 });
    }

    // 1. Fetch the article
    const articles = await base44.asServiceRole.entities.DnnArticle.filter({ id: article_id });
    const article = articles?.[0];
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    const scriptText = `${article.headline}. ${article.body}`.slice(0, 1500);

    // 2. Synthesize Charon audio via charlieSpeak
    const ttsRes = await base44.asServiceRole.functions.invoke('charlieSpeak', { text: scriptText });
    const audioB64 = ttsRes?.audio;
    if (!audioB64) return Response.json({ error: 'Audio synthesis failed' }, { status: 500 });

    // 3. Upload audio to HeyGen as an asset
    const audioBytes = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0));
    const formData = new FormData();
    formData.append('file', new Blob([audioBytes], { type: 'audio/mpeg' }), 'anchor_audio.mp3');
    formData.append('type', 'audio');

    const uploadRes = await fetch(`${HEYGEN_API}/v1/asset`, {
      method: 'POST',
      headers: { 'X-Api-Key': HEYGEN_API_KEY },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.data?.id) {
      console.error('HeyGen upload error:', uploadData);
      return Response.json({ error: 'HeyGen audio upload failed', detail: uploadData }, { status: 500 });
    }
    const audioAssetId = uploadData.data.id;

    // 4. Submit avatar video render job
    // Layout: anchor slightly right-of-center (x=0.55), leaving left third for data graphics
    const renderRes = await fetch(`${HEYGEN_API}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: avatar_id,
            avatar_style: 'normal',
            // Medium close-up, slightly right of center for L1/3 data graphic overlay
            scale: 1.0,
            offset: { x: 0.1, y: 0.0 },
          },
          voice: {
            type: 'audio',
            audio_asset_id: audioAssetId,
          },
          background: {
            type: 'image',
            // Coastal city high-rise at dusk — warm key light, cool blue rim
            // Replace with your own uploaded background asset ID after uploading to HeyGen
            url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80',
          },
        }],
        dimension: { width: 1920, height: 1080 },
        // 30fps target
        fps: 30,
      }),
    });

    const renderData = await renderRes.json();
    if (!renderRes.ok || !renderData.data?.video_id) {
      console.error('HeyGen render error:', renderData);
      return Response.json({ error: 'HeyGen render job failed', detail: renderData }, { status: 500 });
    }

    const videoId = renderData.data.video_id;

    // 5. Store the pending video_id on the article so heygenCheckVideo can poll it
    await base44.asServiceRole.entities.DnnArticle.update(article_id, {
      video_url: `heygen:pending:${videoId}`,
    });

    return Response.json({ video_id: videoId, status: 'rendering', article_id });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});