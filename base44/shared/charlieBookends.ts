/**
 * charlieBookends — the two static clips used by the "Sandwich" pipeline
 * (dnnArticleDirectRender).
 *
 * HeyGen is only ever asked to render Bob's middle news segment. The
 * opening and closing are fixed MP4 files that get stitched around Bob's
 * generated clip server-side (via Creatomate) — no HeyGen call for these,
 * no per-article variation, no multi-scene render errors.
 *
 * CURRENT STATUS: production DNN open/close, produced via Grok. The outro
 * has a permanent lower-third burned in — "The Dyson & Dyson Companies, Inc.
 * • CA DRE #02303118" — so every future article render automatically carries
 * the required license disclosure with no per-article edits needed.
 */
export const CHARLIE_INTRO_URL = 'https://media.base44.com/videos/public/69d905d72ff7c93b5ef050c4/7b8f8897a_DNN_INTROcopy2.mp4';
export const CHARLIE_OUTRO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/6afc5f09e_dnn_outro_with_dre.mp4';