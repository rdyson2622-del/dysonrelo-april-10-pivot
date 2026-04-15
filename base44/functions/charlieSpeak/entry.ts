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

    const audioContent = data.audioContent;
    if (!audioContent) return Response.json({ error: 'No audio returned from TTS' }, { status: 500 });

    // Decode base64 PCM data
    const binaryStr = atob(audioContent);
    const pcmBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      pcmBytes[i] = binaryStr.charCodeAt(i);
    }

    // Build WAV header for 16kHz, mono, 16-bit PCM
    const sampleRate = 16000;
    const channels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * channels * (bitsPerSample / 8);
    const blockAlign = channels * (bitsPerSample / 8);
    const dataSize = pcmBytes.length;

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF chunk
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');

    // fmt chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk1 size
    view.setUint16(20, 1, true);  // audio format (1 = PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Combine header + PCM data
    const wav = new Uint8Array(header.byteLength + pcmBytes.length);
    wav.set(new Uint8Array(header), 0);
    wav.set(pcmBytes, 44);

    // Convert to base64 for response
    let b64 = '';
    for (let i = 0; i < wav.length; i++) {
      b64 += String.fromCharCode(wav[i]);
    }
    const wavBase64 = btoa(b64);

    return Response.json({ audio: wavBase64, mimeType: 'audio/wav' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});