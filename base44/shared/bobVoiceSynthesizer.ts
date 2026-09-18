import { secrets } from 'base44:runtime';

export const BOB_STUDIO_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

export async function synthesizeBobSpeech(speechText: string): Promise<string | null> {
  const clean = speechText.replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '').replace(/[*_#`]/g, '').trim();
  if (!clean) return null;

  const heygenKey = secrets.get('HEYGEN_API_KEY');
  if (!heygenKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);
  try {
    const response = await fetch('https://api.heygen.com/v3/voices/speech', {
      method: 'POST',
      headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, voice_id: BOB_STUDIO_VOICE_ID }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result?.data?.audio_url || null;
  } finally {
    clearTimeout(timeout);
  }
}