/**
 * charlieBookends — the two static clips used by the "Sandwich" pipeline
 * (dnnArticleDirectRender).
 *
 * HeyGen is only ever asked to render Bob's middle news segment. The
 * opening and closing are fixed MP4 files that get stitched around Bob's
 * generated clip server-side (via Creatomate) — no HeyGen call for these,
 * no per-article variation, no multi-scene render errors.
 *
 * CURRENT STATUS: TEMPORARY placeholder bookends — a simple DNN logo card
 * (no Charlie avatar), used so the show can run now while the professional
 * animated intro/outro are produced. Swap these two URLs out for the final
 * versions the moment they're ready — no other code changes needed.
 */
export const CHARLIE_INTRO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/b95255e7a_dnn_temp_intro.mp4';
export const CHARLIE_OUTRO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/64b87877c_dnn_temp_outro.mp4';