/**
 * dnnStudioBackground — single source of truth for the DNN studio backdrop
 * image used behind Charlie/Bob's boxes in DnnStudioComposite.
 *
 * IMPORTANT: this background is composited entirely on OUR side (a static
 * image rendered behind two <video> boxes in the browser). HeyGen never
 * sees or renders this image — every HeyGen render for Charlie/Bob uses a
 * plain solid-black background only (see roadmapQARender / vettingDeskQARender
 * pattern). Keeping backgrounds 100% on our side removes HeyGen from the
 * failure path entirely for anything backdrop-related.
 */
export const DNN_STUDIO_BACKGROUND_URL =
  'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d17c5e2ac_STUDIOBACKDROP.jpg';