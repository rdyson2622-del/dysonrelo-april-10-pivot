/**
 * charlieBookends — the two static clips used by the "Sandwich" pipeline
 * (dnnArticleDirectRender).
 *
 * HeyGen is only ever asked to render Bob's middle news segment. The
 * opening and closing are fixed MP4 files that get stitched around Bob's
 * generated clip server-side (via Creatomate) — no HeyGen call for these,
 * no per-article variation, no multi-scene render errors.
 *
 * CURRENT STATUS: production DNN open/close, produced via Grok.
 */
export const CHARLIE_INTRO_URL = 'https://media.base44.com/videos/public/69d905d72ff7c93b5ef050c4/7b8f8897a_DNN_INTROcopy2.mp4';
export const CHARLIE_OUTRO_URL = 'https://media.base44.com/videos/public/69d905d72ff7c93b5ef050c4/f06e14126_DNN_OUTROcopy.mp4';