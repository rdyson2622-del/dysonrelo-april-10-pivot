import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Charlie's voice: Google Cloud TTS — Chirp3-HD-Charon (deep authoritative male)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: clean },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Chirp3-HD-Charon'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('TTS error:', data.error?.message);
      // Fallback to a reliable Neural2 male voice if Charon not available
      const fallback = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: clean },
            voice: {
              languageCode: 'en-US',
              name: 'en-US-Neural2-D'  // deep male Neural2 voice
            },
            audioConfig: {
              audioEncoding: 'MP3'
            }
          })
        }
      );
      const fallbackData = await fallback.json();
      if (!fallback.ok) return Response.json({ error: fallbackData.error?.message || 'TTS failed' }, { status: 500 });
      return Response.json({ audio: fallbackData.audioContent, mimeType: 'audio/mpeg' });
    }

    return Response.json({ audio: data.audioContent, mimeType: 'audio/mpeg' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});