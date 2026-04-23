import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs daily at 6AM PT
// 1. Picks the most recently published DNN article
// 2. Converts headline + body to audio via Gemini TTS
// 3. Uploads audio file and saves the URL back to the article
// 4. Marks article with audio_url so the feed can show a play button

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    // 1. Get most recent published article without audio yet
    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      5
    );

    if (!articles || articles.length === 0) {
      return Response.json({ error: 'No published articles found' }, { status: 404 });
    }

    // Pick the first one that doesn't have audio yet
    const article = articles.find(a => !a.audio_url) || articles[0];

    // 2. Build the script for TTS
    const dateline = article.dateline ? `${article.dateline} ` : '';
    const script = `Good morning. This is your DNN Intelligence Brief from Dyson and Dyson Real Estate Concierge.

${article.headline}.

${dateline}${article.body}

This has been your DNN Morning Brief. Subscribe at dysonanddyson.com for daily market intelligence delivered straight to you.`;

    // 3. Call Gemini TTS API
    const ttsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: script }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Charon' }
              }
            }
          }
        })
      }
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      return Response.json({ error: 'Gemini TTS failed', details: err }, { status: 500 });
    }

    const ttsData = await ttsResponse.json();
    const audioB64 = ttsData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioB64) {
      return Response.json({ error: 'No audio data returned from Gemini', raw: ttsData }, { status: 500 });
    }

    // 4. Convert base64 to binary and upload
    const binaryStr = atob(audioB64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/wav' });

    // Upload via Base44 UploadFile integration — pass as File object with name
    const audioFile = new File([bytes], `dnn-brief-${article.id}.wav`, { type: 'audio/wav' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
      file: audioFile
    });

    const audioUrl = uploadResult?.file_url;
    if (!audioUrl) {
      return Response.json({ error: 'Upload failed', uploadResult }, { status: 500 });
    }

    // 5. Save audio_url back to the article
    await base44.asServiceRole.entities.DnnArticle.update(article.id, {
      audio_url: audioUrl
    });

    return Response.json({
      success: true,
      article_id: article.id,
      headline: article.headline,
      audio_url: audioUrl,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});