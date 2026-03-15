import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GOOGLE_CLOUD_API_KEY") || Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text) {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }

    // Clean text for speech
    const clean = text.replace(/[*_#`]/g, '').replace(/\n/g, ' ').trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Say in a confident and strong tone: ${clean}` }]
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Enceladus"
                }
              }
            }
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'TTS API error' }, { status: 500 });
    }

    const audioB64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioB64) {
      return Response.json({ error: 'No audio returned' }, { status: 500 });
    }

    return Response.json({ audio: audioB64, mimeType: 'audio/wav' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});