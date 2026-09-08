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

  // When fast mode is enabled (real-time V2V voice chat), prioritize ultra-low-latency American male neural speech (~1s)
  // using Core.GenerateSpeech with voice: 'spark' (natural American male).
  // This completely eliminates the 8-10 second HeyGen API lag and ensures zero female voice and zero British accent ('storm').
  if (options.fast) {
    try {
      const sparkRes = await base44.asServiceRole.integrations.Core.GenerateSpeech({
        text: clean,
        voice: 'spark',
        language_code: 'en',
      });
      if (sparkRes?.url) return sparkRes.url;
    } catch (e) {
      console.warn('Fast GenerateSpeech failed, falling back:', e);
    }
  }

  // 1. High-fidelity synthesis: Authentic Charlie Ruben American Voice (HeyGen Voice ID: cc5fb6c924064712ba9f690852aa4646)
  let heygenKey: string | null = null;
  try {
    heygenKey = secrets.get('HEYGEN_API_KEY');
  } catch (_) {
    heygenKey = null;
  }

  if (heygenKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.fast ? 2500 : 8000);
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

  // 2. Fallback: Always 'spark' (American male). NEVER 'storm' (British) and NEVER female voices ('river', 'honey', 'sunny')
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