import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    console.log('API key present:', !!GEMINI_API_KEY, 'length:', GEMINI_API_KEY?.length);

    // Clean markdown, normalize whitespace
    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ... ').trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: clean }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } }
            }
          }
        })
      }
    );

    const data = await response.json();

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      console.error('Gemini TTS error:', JSON.stringify(data));
      return Response.json({ error: data.error?.message || 'TTS failed' }, { status: 500 });
    }

    const audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audio) return Response.json({ error: 'No audio returned from Gemini' }, { status: 500 });

    return Response.json({ audio, mimeType: 'audio/wav' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});