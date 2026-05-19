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

    // Voice priority: Charon (deep baritone) → Fenrir → Neural2-D fallback
    // speakingRate 0.85 ≈ 150 wpm; pitch -6.0 hard-clamps to low baritone register
    const VOICE_ATTEMPTS = [
      { api: 'v1beta1', name: 'en-US-Chirp3-HD-Charon' },
      { api: 'v1beta1', name: 'en-US-Chirp3-HD-Fenrir' },
      { api: 'v1',      name: 'en-US-Neural2-D' },
    ];

    let audio = null;
    for (const voice of VOICE_ATTEMPTS) {
      const resp = await fetch(
        `https://texttospeech.googleapis.com/${voice.api}/text:synthesize?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: clean },
            voice: { languageCode: 'en-US', name: voice.name },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 0.85,   // ~150 wpm measured cadence
              pitch: -6.0,          // hard-clamp to low baritone (100-120 Hz range)
              effectsProfileId: ['headphone-class-device']
            }
          })
        }
      );
      const d = await resp.json();
      if (resp.ok && d.audioContent) { audio = d.audioContent; break; }
      console.warn(`Voice ${voice.name} failed:`, d.error?.message);
    }

    if (!audio) return Response.json({ error: 'All voice models failed' }, { status: 500 });
    return Response.json({ audio, mimeType: 'audio/mpeg' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});