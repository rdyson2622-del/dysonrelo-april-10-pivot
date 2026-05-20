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

    const body = await req.json();
    const article_id = body.article_id;
    // Default to preferred male newscaster avatar
    const avatar_id = body.avatar_id || '4c9f4855c6914ac2ba676544524709eb';
    if (!article_id) {
      return Response.json({ error: 'article_id is required' }, { status: 400 });
    }

    // 1. Fetch the article
    const articles = await base44.asServiceRole.entities.DnnArticle.filter({ id: article_id });
    const article = articles?.[0];
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    const scriptText = `${article.headline}. ${article.body}`.slice(0, 1500);
    const cleanText = scriptText.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();

    // 2. Synthesize Charon audio directly via Google TTS (inlined to avoid auth proxy)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const VOICE_ATTEMPTS = [
      { api: 'v1beta1', name: 'en-US-Chirp3-HD-Charon' },
      { api: 'v1beta1', name: 'en-US-Chirp3-HD-Fenrir' },
      { api: 'v1',      name: 'en-US-Neural2-D' },
    ];

    let audioB64 = null;
    for (const voice of VOICE_ATTEMPTS) {
      const ttsResp = await fetch(
        `https://texttospeech.googleapis.com/${voice.api}/text:synthesize?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: cleanText },
            voice: { languageCode: 'en-US', name: voice.name },
            audioConfig: { audioEncoding: 'MP3' },
          }),
        }
      );
      const ttsData = await ttsResp.json();
      if (ttsResp.ok && ttsData.audioContent) { audioB64 = ttsData.audioContent; break; }
      console.warn(`Voice ${voice.name} failed:`, ttsData.error?.message);
    }
    if (!audioB64) return Response.json({ error: 'Audio synthesis failed — all voice models failed' }, { status: 500 });

    // 3. Upload audio to Base44 public storage to get a URL HeyGen can fetch
    const audioBytes = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0));
    const audioFile = new File([audioBytes], 'anchor_audio.mp3', { type: 'audio/mpeg' });

    const { file_url: audioUrl } = await base44.asServiceRole.integrations.Core.UploadFile({ file: audioFile });
    if (!audioUrl) return Response.json({ error: 'Failed to upload audio to storage' }, { status: 500 });
    console.log('Audio uploaded to:', audioUrl);

    // 4. Submit avatar video render job — pass audio as a public URL
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
          },
          voice: {
            type: 'audio',
            audio_url: audioUrl,
          },
          background: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80',
          },
        }],
        dimension: { width: 1920, height: 1080 },
      }),
    });

    const renderText = await renderRes.text();
    console.log('HeyGen render status:', renderRes.status, 'body:', renderText.slice(0, 500));
    let renderData;
    try { renderData = JSON.parse(renderText); } catch (_) {
      return Response.json({ error: 'HeyGen render returned non-JSON', raw: renderText.slice(0, 300) }, { status: 500 });
    }
    if (!renderRes.ok || !renderData.data?.video_id) {
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