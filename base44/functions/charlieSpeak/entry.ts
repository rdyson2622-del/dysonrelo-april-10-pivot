import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Dual-host Google Cloud TTS for in-house DNN morning creative.
// speaker: 'charlie' | 'bob'  (default charlie)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { text, speaker = 'charlie' } = body || {};
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) return Response.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });

    const clean = String(text).replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();
    if (!clean) return Response.json({ error: 'Empty text after cleanup' }, { status: 400 });

    // Charlie = deep news-desk baritone; Bob = warmer expert register
    const VOICE_ATTEMPTS = speaker === 'bob'
      ? [
          { api: 'v1beta1', name: 'en-US-Chirp3-HD-Fenrir' },
          { api: 'v1beta1', name: 'en-US-Chirp3-HD-Charon' },
          { api: 'v1', name: 'en-US-Neural2-J' },
        ]
      : [
          { api: 'v1beta1', name: 'en-US-Chirp3-HD-Charon' },
          { api: 'v1beta1', name: 'en-US-Chirp3-HD-Fenrir' },
          { api: 'v1', name: 'en-US-Neural2-D' },
        ];

    let audio = null;
    let usedVoice = null;
    for (const voice of VOICE_ATTEMPTS) {
      const resp = await fetch(
        `https://texttospeech.googleapis.com/${voice.api}/text:synthesize?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: clean },
            voice: { languageCode: 'en-US', name: voice.name },
            audioConfig: { audioEncoding: 'MP3' },
          }),
        },
      );
      const d = await resp.json();
      if (resp.ok && d.audioContent) {
        audio = d.audioContent;
        usedVoice = voice.name;
        break;
      }
      console.warn(`Voice ${voice.name} failed:`, d.error?.message);
    }

    if (!audio) return Response.json({ error: 'All voice models failed' }, { status: 500 });
    return Response.json({
      audio,
      mimeType: 'audio/mpeg',
      speaker: speaker === 'bob' ? 'bob' : 'charlie',
      voice: usedVoice,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
