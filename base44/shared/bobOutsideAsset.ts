/**
 * bobOutsideAsset — single source of truth for Bob's HeyGen talking-photo
 * ID: the "black shirt, outside" look, provided directly by the admin as
 * an already-uploaded/registered HeyGen asset.
 *
 * IMPORTANT: this is a FIXED ID, not a still we re-crop and re-upload on
 * every render. Every previous attempt to locally crop a source photo
 * (v1/v2/v3 in this file's history) produced a different framing bug each
 * time (pillarboxing, "huge teeth" close-up, cropped-off top of head).
 * Using the admin-verified ID directly removes that entire failure class.
 * Do not swap this for a re-uploaded still without explicit confirmation.
 */
export const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';