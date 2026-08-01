import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * getAvatarPreviewImages — Fetches preview/thumbnail image URLs for
 * Charlie (avatar) and Bob (talking photo) from HeyGen.
 *
 * Returns the image URLs so they can be used as overlays on the studio
 * background in BroadcastShow and RoleSelector.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
    const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';

    // Fetch from multiple endpoints in parallel
    const [avatarsRes, videoAvatarsRes, talkingPhotosRes, v1AvatarsRes] = await Promise.all([
      fetch('https://api.heygen.com/v2/avatars', { headers }).then(r => r.json()).catch(() => ({})),
      fetch('https://api.heygen.com/v2/video_avatar/list', { headers }).then(r => r.json()).catch(() => ({})),
      fetch('https://api.heygen.com/v1/talking_photo.list', { headers }).then(r => r.json()).catch(() => ({})),
      fetch('https://api.heygen.com/v1/avatar.list', { headers }).then(r => r.json()).catch(() => ({})),
    ]);

    // Search all avatar lists for Charlie
    const v2Avatars = avatarsRes?.data?.avatars || [];
    const videoAvatars = videoAvatarsRes?.data?.video_avatar_list || videoAvatarsRes?.data?.avatars || [];
    const v1Avatars = v1AvatarsRes?.data?.avatar_list || v1AvatarsRes?.data?.avatars || [];

    const charlie = [
      ...v2Avatars,
      ...videoAvatars,
      ...v1Avatars,
    ].find(a =>
      a.avatar_id === CHARLIE_AVATAR_ID ||
      a.id === CHARLIE_AVATAR_ID
    );

    // Search talking photos for Bob — HeyGen returns them in data[] with `id` field
    const allPhotos = talkingPhotosRes?.data?.talking_photo_list || talkingPhotosRes?.data?.talking_photos || talkingPhotosRes?.data || [];
    const photoArray = Array.isArray(allPhotos) ? allPhotos : [];
    const bob = photoArray.find(p =>
      p.talking_photo_id === BOB_TALKING_PHOTO_ID ||
      p.id === BOB_TALKING_PHOTO_ID
    );

    // Also search video avatars for Bob (in case he's there)
    const bobInVideoAvatars = videoAvatars.find(a =>
      a.avatar_id === BOB_TALKING_PHOTO_ID || a.id === BOB_TALKING_PHOTO_ID
    );

    return Response.json({
      charlie: charlie ? {
        id: charlie.avatar_id || charlie.id,
        name: charlie.avatar_name || charlie.name,
        preview_image_url: charlie.preview_image_url || charlie.preview_image || charlie.thumbnail || charlie.image_url || null,
        full_object: charlie,
      } : {
        error: 'Charlie not found in any endpoint',
        searched_id: CHARLIE_AVATAR_ID,
        counts: { v2: v2Avatars.length, video: videoAvatars.length, v1: v1Avatars.length },
        video_avatar_sample: videoAvatars.slice(0, 3).map(a => ({ id: a.avatar_id, name: a.avatar_name, keys: Object.keys(a) })),
      },

      bob: bob ? {
        id: bob.talking_photo_id || bob.id,
        name: bob.talking_photo_name || bob.name || 'Bob',
        preview_image_url: bob.preview_image_url || bob.preview_image || bob.thumbnail || bob.image_url || bob.photo_image_url || bob.circle_image || null,
        full_object: bob,
      } : {
        error: 'Bob not found in talking photos',
        searched_id: BOB_TALKING_PHOTO_ID,
        talking_photo_count: photoArray.length,
        bob_in_video_avatars: bobInVideoAvatars ? { id: bobInVideoAvatars.avatar_id, name: bobInVideoAvatars.avatar_name } : null,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}