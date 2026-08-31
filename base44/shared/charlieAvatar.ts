/**
 * charlieAvatar — single source of truth for Charlie's HeyGen identity.
 *
 * Charlie now renders using HeyGen's own "Ruben" library avatar (avatar_id),
 * NOT a talking_photo built from an uploaded still. The previous desk-still
 * asset (charlieDeskAsset.ts) turned out to be the wrong likeness entirely —
 * confirmed by the app owner. Every Charlie render must use this avatar_id.
 */
export const CHARLIE_AVATAR_ID = 'cec8678e3e814b09a621c9231f5a0164';