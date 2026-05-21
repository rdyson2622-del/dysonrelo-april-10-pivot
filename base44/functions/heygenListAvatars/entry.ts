import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * heygenListAvatars - DEEP RAW AUDIT
 * Pulls ALL asset types with zero filtering — raw JSON logged for inspection.
 */

async function safeFetch(url, headers) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (_) {}
  return { ok: res.ok, status: res.status, data, raw: text.slice(0, 2000) };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    // 1. /v2/avatars — full unfiltered list
    const r1 = await safeFetch('https://api.heygen.com/v2/avatars', headers);
    const allAvatars = r1.data?.data?.avatars || [];
    console.log('=== RAW /v2/avatars TOTAL:', allAvatars.length);

    // Extract ALL non-stock avatars (anything not matching standard public naming)
    const customAvatars = allAvatars.filter(a => {
      const id = a.avatar_id || '';
      return (
        !id.match(/^[A-Z][a-z]+_.*_public/) &&
        !id.match(/_(pro|pro\d)_/) &&
        !id.match(/^(Abigail|Adriana|Aiko|Amanda|Angel|Anna|Anthony|Brian|Bryan|Carlos|Carter|Daniel|David|Emma|Eric|Eva|Grace|Henry|James|Jasmine|Jeffrey|John|Joshua|Judy|Justin|Kate|Kevin|Kim|Lea|Lena|Lewis|Lily|Lucas|Madison|Marcus|Maya|Michael|Miles|Morgan|Nora|Oliver|Owen|Paul|Peter|Philip|Rachel|Rebecca|Ryan|Sara|Sarah|Scott|Sofia|Steven|Susan|Thomas|Tina|Tom|Tyler|Victoria|William|Wilson|Zara)/)
      );
    });

    console.log('=== CUSTOM/NON-STOCK AVATARS FOUND:', customAvatars.length);
    console.log(JSON.stringify(customAvatars.map(a => ({
      id: a.avatar_id,
      name: a.avatar_name,
      gender: a.gender,
      is_public: a.is_public,
      type: a.type,
      group_id: a.group_id,
      preview: a.preview_image_url,
    })), null, 2));

    // 2. /v1/talking_photo — all uploaded talking photos
    const r2 = await safeFetch('https://api.heygen.com/v1/talking_photo', headers);
    console.log('=== RAW /v1/talking_photo:', JSON.stringify(r2.data, null, 2));

    // 3. /v1/avatar — older v1 endpoint, sometimes has clones not in v2
    const r3 = await safeFetch('https://api.heygen.com/v1/avatar.list', headers);
    console.log('=== RAW /v1/avatar.list:', JSON.stringify(r3.data, null, 2));

    // 4. /v2/avatar/group — avatar groups (clones are often in groups)
    const r4 = await safeFetch('https://api.heygen.com/v2/avatar/group.list', headers);
    console.log('=== RAW /v2/avatar/group.list:', JSON.stringify(r4.data, null, 2));

    // 5. Check account info / remaining credits
    const r5 = await safeFetch('https://api.heygen.com/v1/user/remaining_quota', headers);
    console.log('=== ACCOUNT QUOTA:', JSON.stringify(r5.data, null, 2));

    // Search ALL avatars for "bob", "dyson", "news" in name/id
    const nameSearch = allAvatars.filter(a => {
      const id = (a.avatar_id || '').toLowerCase();
      const name = (a.avatar_name || '').toLowerCase();
      return id.includes('bob') || id.includes('dyson') || id.includes('news') ||
             name.includes('bob') || name.includes('dyson') || name.includes('news') ||
             id.includes('custom') || id.includes('private') || id.includes('clone');
    });
    console.log('=== BOB/DYSON/NEWS/CUSTOM SEARCH RESULTS:', JSON.stringify(nameSearch, null, 2));

    const talkingPhotos = r2.data?.data?.talking_photos || r2.data?.data || [];

    return Response.json({
      summary: {
        total_avatars_v2: allAvatars.length,
        custom_non_stock: customAvatars.length,
        talking_photos: Array.isArray(talkingPhotos) ? talkingPhotos.length : 'see raw',
        avatar_groups: r4.data?.data || 'none',
        quota: r5.data?.data || r5.data,
        bob_dyson_news_matches: nameSearch.length,
      },
      custom_avatars: customAvatars.map(a => ({
        id: a.avatar_id,
        name: a.avatar_name,
        gender: a.gender,
        is_public: a.is_public,
        type: a.type,
      })),
      talking_photos: Array.isArray(talkingPhotos)
        ? talkingPhotos.map(t => ({ id: t.talking_photo_id || t.id, name: t.talking_photo_name || t.name, preview: t.preview_image_url }))
        : r2.data,
      avatar_groups_raw: r4.data,
      bob_dyson_matches: nameSearch,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});