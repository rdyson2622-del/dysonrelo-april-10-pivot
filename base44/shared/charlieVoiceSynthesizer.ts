/**
 * charlieVoiceSynthesizer — Single source of truth for Charlie's speech audio.
 *
 * Uses Charlie's authentic American voice from HeyGen ("Ruben" - voice_id: cc5fb6c924064712ba9f690852aa4646),
 * matching his voice from all DNN news broadcasts, desk videos, and explainer presentations.
 *
 * If HeyGen is unavailable or times out, falls back to the neutral American 'river' voice
 * rather than 'storm' (which has an unwanted British/Englishman accent).
 */

import { secrets } from 'base44:runtime';

export const CHARLIE_RUBEN_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

export async function synthesizeCharlieSpeech(base44: any, speechText: string): Promise<string | null> {
  const clean = speechText
    .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
    .replace(/navigate_to_page\s*\(?['"]?[\/a-z0-9_-]+['"]?(?:,\s*['"]?[^'")]*['"]?)?\)?/gi, '')
    .replace(/navigate_to_page:\s*[\/a-z0-9_-]+/gi, '')
    .replace(/[*_#`]/g, '')
    .trim();

  if (!clean) return null;

  // 1. Try Charlie's actual HeyGen Ruben voice (our real Charlie)
  let heygenKey: string | null = null;
  try {
    heygenKey = secrets.get('HEYGEN_API_KEY');
  } catch (_) {
    heygenKey = null;
  }

  if (heygenKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
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
        const errText = await res.text().catch(() => '');
        console.warn('HeyGen Ruben speech API response not ok:', res.status, errText);
      }
    } catch (err) {
      console.warn('HeyGen Ruben TTS error or timeout, falling back:', err);
    }
  }

  // 2. Fallback to American neutral voice ('river') if HeyGen fails (NEVER 'storm')
  try {
    const fallbackRes = await base44.asServiceRole.integrations.Core.GenerateSpeech({
      text: clean,
      voice: 'river',
    });
    return fallbackRes?.url || null;
  } catch (err) {
    console.warn('Fallback GenerateSpeech error:', err);
    return null;
  }
}