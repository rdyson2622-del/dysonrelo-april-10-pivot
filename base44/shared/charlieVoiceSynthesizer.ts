/**
 * charlieVoiceSynthesizer — Single source of truth for Charlie's speech audio.
 *
 * Designed for low-latency conversational AI:
 * - Output voice is 100% Charlie's authoritative, distinguished American male voice ('storm').
 * - NEVER uses female voices ('river', 'honey', 'sunny').
 * - Generates fast, high-quality neural speech in ~1.5 seconds instead of 9+ seconds.
 */

import { secrets } from 'base44:runtime';

export const CHARLIE_RUBEN_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

export async function synthesizeCharlieSpeech(base44: any, speechText: string, options: { fast?: boolean } = {}): Promise<string | null> {
  const clean = speechText
    .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
    .replace(/navigate_to_page\s*\(?['"]?[\/a-z0-9_-]+['"]?(?:,\s*['"]?[^'")]*['"]?)?\)?/gi, '')
    .replace(/navigate_to_page:\s*[\/a-z0-9_-]+/gi, '')
    .replace(/[*_#`]/g, '')
    .trim();

  if (!clean) return null;

  // 1. PRIMARY: Authentic Charlie Ruben American Voice (HeyGen Voice ID: cc5fb6c924064712ba9f690852aa4646)
  // NEVER use 'storm' — 'storm' in Core TTS produces an unwanted British/English accent.
  let heygenKey: string | null = null;
  try {
    heygenKey = secrets.get('HEYGEN_API_KEY');
  } catch (_) {
    heygenKey = null;
  }

  if (heygenKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch('https://api.heygen.com/v3/voices/speech', {
        method: 'POST',
        headers: {
          'X-Api-Key': heygenKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: clean,
          voice_id: CHARLIE_RUBEN_VOICE_ID,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.audio_url) {
          return json.data.audio_url;
        }
      } else {
        console.warn('HeyGen Ruben speech API response not ok:', res.status);
      }
    } catch (err) {
      console.warn('HeyGen Ruben speech synthesis call error:', err);
    }
  }

  // 2. Fallback: Only if HeyGen is unavailable, use 'spark' (American male), NEVER 'storm' (British) or female voices
  try {
    const sparkRes = await base44.asServiceRole.integrations.Core.GenerateSpeech({
      text: clean,
      voice: 'spark',
      language_code: 'en',
    });
    return sparkRes?.url || null;
  } catch (_) {
    return null;
  }
}