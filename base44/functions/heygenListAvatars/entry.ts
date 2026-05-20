import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * heygenListAvatars
 * Pulls ALL asset types from the HeyGen account to locate custom clones.
 */

async function safeFetch(url, headers) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch (_) {
    return { ok: false, status: res.status, data: null, raw: text.slice(0, 300) };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY };

    // 1. /v2/avatars — public + personal/custom clones
    const avatarsResult = await safeFetch('https://api.heygen.com/v2/avatars', headers);
    const allAvatars = avatarsResult.data?.data?.avatars || [];

    // Personal = anything that doesn't have the stock _public_ / _pro naming pattern
    const personalAvatars = allAvatars.filter(a =>
      !a.avatar_id?.includes('_public_') && !a.avatar_id?.match(/_(pro|pro\d)_/)
    );

    console.log('ALL AVATAR COUNT:', allAvatars.length);
    console.log('PERSONAL/CUSTOM AVATARS:', JSON.stringify(
      personalAvatars.map(a => ({ id: a.avatar_id, name: a.avatar_name, gender: a.gender, is_public: a.is_public })),
      null, 2
    ));

    // 2. /v1/talking_photo — uploaded talking photos / photo avatars
    const tpResult = await safeFetch('https://api.heygen.com/v1/talking_photo', headers);
    const talkingPhotos = tpResult.data?.data?.talking_photos
      || tpResult.data?.data
      || [];
    console.log('TALKING PHOTOS RAW:', JSON.stringify(tpResult.data, null, 2));

    // 3. /v2/avatars?include_personal=true — some accounts need this flag
    const personalRes = await safeFetch('https://api.heygen.com/v2/avatars?include_personal=true', headers);
    const personalOnly = (personalRes.data?.data?.avatars || []).filter(a =>
      !a.avatar_id?.includes('_public_') && !a.avatar_id?.match(/_(pro|pro\d)_/)
    );
    console.log('PERSONAL ONLY (include_personal flag):', JSON.stringify(
      personalOnly.map(a => ({ id: a.avatar_id, name: a.avatar_name })),
      null, 2
    ));

    return Response.json({
      personal_avatars: personalAvatars.map(a => ({
        id: a.avatar_id, name: a.avatar_name, gender: a.gender,
      })),
      personal_avatars_v2: personalOnly.map(a => ({
        id: a.avatar_id, name: a.avatar_name, gender: a.gender,
      })),
      talking_photos: Array.isArray(talkingPhotos)
        ? talkingPhotos.map(t => ({
            id: t.talking_photo_id || t.id,
            name: t.talking_photo_name || t.name,
            preview: t.preview_image_url,
          }))
        : { raw: tpResult.data },
      total_avatars: allAvatars.length,
      tp_endpoint_status: tpResult.status,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});