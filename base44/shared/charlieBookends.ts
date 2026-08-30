/**
 * charlieBookends — the two static, pre-rendered Charlie clips used by the
 * "Sandwich" pipeline (dnnArticleDirectRender).
 *
 * HeyGen is now ONLY ever asked to render Bob's middle news segment. Charlie's
 * opening and closing are fixed, already-recorded MP4 files that get stitched
 * around Bob's generated clip server-side (via Creatomate) — no HeyGen call,
 * no per-article variation, no multi-scene render errors.
 *
 * SETUP REQUIRED: record/upload the final "Charlie Standard Intro" and
 * "Charlie Standard Outro" MP4s once, then paste their file URLs below.
 * Until both are set, dnnArticleDirectRender will refuse to start a render.
 */
export const CHARLIE_INTRO_URL = '';
export const CHARLIE_OUTRO_URL = '';