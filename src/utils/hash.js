/**
 * Frontend Content-Hash Utility
 *
 * Computes a deterministic SHA-256 hash from the broadcast's content + layout
 * configuration. This hash is the "content signature" — two broadcasts with
 * identical scripts, clips, and layout constants produce the same hash.
 *
 * The pipeline uses this hash to check if a render already exists for the
 * exact current configuration. If it does, the cached MP4 is served instantly
 * without consuming a HeyGen credit.
 *
 * CRITICAL: The payload structure below MUST match the backend
 * computeLayoutHash() in dnnStitchBroadcast/entry.ts exactly. Any divergence
 * between frontend and backend hashing will break cache lookups.
 */

// Layout constants — must match dnnStitchBroadcast backend
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const CHARLIE_POS = { scale: 0.55, offset: { x: -0.25, y: 0.2 } };
const BOB_POS = { scale: 0.55, offset: { x: 0.25, y: 0.2 } };

/**
 * Fallback synchronous hash for environments without crypto.subtle.
 * Not cryptographically secure but deterministic for cache lookups.
 */
function simpleStringHash(payload) {
  const str = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generates a SHA-256 content hash from the broadcast's structural configuration.
 *
 * @param {object} broadcastData — the DnnBroadcast record
 * @returns {Promise<string>} — content signature hash (e.g. "hash_abc123...")
 */
export async function generateLayoutHash(broadcastData) {
  if (!broadcastData) return 'hash_empty';

  const clips = (broadcastData.clips || []).map(c => ({
    role: c.role || '',
    script: c.script || '',
    question: c.question || '',
  }));

  const payload = {
    clips,
    format: broadcastData.format || 'solo',
    script: broadcastData.script || '',
    studioBg: STUDIO_BG_URL,
    charlieAvatar: CHARLIE_AVATAR_ID,
    charlieVoice: CHARLIE_VOICE_ID,
    bobPhoto: BOB_TALKING_PHOTO_ID,
    bobVoice: BOB_VOICE_ID,
    charliePos: CHARLIE_POS,
    bobPos: BOB_POS,
  };

  // Use Web Crypto SHA-256 when available, fall back to simple hash
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const serialized = JSON.stringify(payload);
      const data = new TextEncoder().encode(serialized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return 'hash_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return simpleStringHash(payload);
    }
  }

  return simpleStringHash(payload);
}