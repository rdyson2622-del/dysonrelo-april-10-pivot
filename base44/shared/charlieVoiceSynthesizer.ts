/**
 * charlieVoiceSynthesizer — Single source of truth for Charlie's speech audio.
 *
 * Charlie's voice is EXCLUSIVELY the HeyGen Ruben voice:
 * Voice ID: cc5fb6c924064712ba9f690852aa4646
 *
 * Matches all Dyson & Dyson explainer videos and video productions.
 * NEVER uses secondary TTS voices ('spark', 'storm', 'river', 'sunny', etc.).
 */

export const CHARLIE_RUBEN_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

export async function synthesizeCharlieSpeech(
  _base44: any,
  speechText: string,
  _options: { fast?: boolean } = {}
): Promise<string | null> {
  const clean = speechText
    .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
    .replace(/navigate_to_page\s*\(?['"]?[\/a-z0-9_-]+['"]?(?:,\s*['"]?[^'")]*['"]?)?\)?/gi, '')
    .replace(/navigate_to_page:\s*[\/a-z0-9_-]+/gi, '')
    .replace(/[*_#`]/g, '')
    .trim();

  if (!clean) return null;

  // Retrieve HEYGEN_API_KEY from Deno environment (standard in Base44 backend functions)
  let heygenKey: string | null = null;
  try {
    heygenKey = Deno.env.get('HEYGEN_API_KEY') || null;
  } catch (_) {
    heygenKey = null;
  }

  if (!heygenKey) {
    try {
      const { secrets } = await import('base44:runtime');
      heygenKey = secrets.get('HEYGEN_API_KEY') || null;
    } catch (_) {
      heygenKey = null;
    }
  }

  if (heygenKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
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
      console.warn('HeyGen Ruben speech synthesis call error:', err);
    }
  }

  return null;
}