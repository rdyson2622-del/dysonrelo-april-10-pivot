import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

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

    // Strip to headlines and key values only — remove body filler text
    const stripped = stripToEssentials(text);

    // Inject natural pause cues between points
    const scripted = injectPauses(stripped);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `You are Charlie, a confident and polished real estate AI concierge. Speak each point with authority and calm. Take a natural breath-pause between each point. Do not rush. Deliver this script:\n\n${scripted}`
            }]
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Charon"
                }
              }
            }
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('TTS API error:', JSON.stringify(data));
      return Response.json({ error: data.error?.message || 'TTS API error' }, { status: 500 });
    }

    const audioB64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioB64) {
      console.error('No audio in response:', JSON.stringify(data).slice(0, 500));
      return Response.json({ error: 'No audio returned' }, { status: 500 });
    }

    return Response.json({ audio: audioB64, mimeType: 'audio/wav' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Strips text down to headings, short labels, numbers, and key phrases.
 * Removes long body sentences (over 12 words) unless they are a standalone stat or label.
 */
function stripToEssentials(text) {
  // Remove markdown symbols
  const clean = text.replace(/[*_#`]/g, '').replace(/\n{3,}/g, '\n\n').trim();

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  const kept = lines.filter(line => {
    const wordCount = line.split(/\s+/).length;
    const hasNumber = /\d/.test(line);
    const isShort = wordCount <= 12;
    const looksLikeHeading = /^[A-Z]/.test(line) && wordCount <= 8;
    const isBullet = /^[-•·]/.test(line);
    const isLabel = line.endsWith(':') || line.includes(':') && wordCount <= 6;

    return isShort || hasNumber || looksLikeHeading || isBullet || isLabel;
  });

  return kept.join('\n');
}

/**
 * Injects "..." pause cues between lines/sections for natural pacing.
 */
function injectPauses(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ... ');
}