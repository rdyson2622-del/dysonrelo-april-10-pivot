import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * heygenListAvatars
 * Lists all available avatars (talking photos + streaming avatars) on the HeyGen account.
 * Returns: { avatars: [{avatar_id, avatar_name, preview_image_url}] }
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    // Fetch talking photo avatars (custom uploaded photos)
    const talkingPhotosRes = await fetch('https://api.heygen.com/v2/avatars', {
      headers: { 'X-Api-Key': HEYGEN_API_KEY },
    });
    const talkingPhotosData = await talkingPhotosRes.json();

    return Response.json({
      raw: talkingPhotosData,
      avatars: talkingPhotosData?.data?.avatars || [],
      talking_photos: talkingPhotosData?.data?.talking_photos || [],
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});