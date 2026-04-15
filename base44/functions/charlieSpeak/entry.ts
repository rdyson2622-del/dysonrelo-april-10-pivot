import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    console.log('Key length:', GEMINI_API_KEY?.length, 'starts with:', GEMINI_API_KEY?.slice(0, 4));

    if (!GEMINI_API_KEY) return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ... ').trim();

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: clean },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-A'
          },
          audioConfig: {
            audioEncoding: 'LINEAR16',
            sampleRateHertz: 16000
          }
        })
      }
    );

    const data = await response.json();
    console.log('TTS status:', response.status, 'error:', data.error?.message);

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'TTS failed' }, { status: 500 });
    }

    const audio = data.audioContent;
    if (!audio) return Response.json({ error: 'No audio returned from TTS' }, { status: 500 });

    return Response.json({ audio, mimeType: 'audio/wav' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});