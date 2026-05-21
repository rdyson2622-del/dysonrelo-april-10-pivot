import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * BRUTE FORCE AVATAR HUNT
 * Hits 3 endpoints in parallel, dumps full raw JSON to console.
 * Looking for Bob Dyson custom clone.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    // PARALLEL — hit all 3 endpoints simultaneously
    const [r1, r2, r3] = await Promise.all([
      fetch('https://api.heygen.com/v2/avatars', { headers }).then(r => r.json()),
      fetch('https://api.heygen.com/v2/video_avatar/list', { headers }).then(r => r.json()),
      fetch('https://api.heygen.com/v1/avatar.list', { headers }).then(r => r.json()),
    ]);

    // === ENDPOINT 1: v2/avatars — filter for is_custom: true ===
    const v2Avatars = r1?.data?.avatars || [];
    const customAvatars = v2Avatars.filter(a => a.is_custom === true || a.type === 'custom' || a.is_public === false);

    console.log('=== ENDPOINT 1: GET /v2/avatars ===');
    console.log('TOTAL COUNT:', v2Avatars.length);
    console.log('CUSTOM (is_custom=true OR is_public=false):', customAvatars.length);
    console.log('--- ALL AVATAR NAMES + IDS (v2) ---');
    v2Avatars.forEach(a => {
      console.log(`ID: ${a.avatar_id} | NAME: ${a.avatar_name} | is_custom: ${a.is_custom} | is_public: ${a.is_public} | type: ${a.type}`);
    });

    // === ENDPOINT 2: v2/video_avatar/list ===
    const videoAvatars = r2?.data?.video_avatar_list || r2?.data?.avatars || r2?.data || [];
    console.log('\n=== ENDPOINT 2: GET /v2/video_avatar/list ===');
    console.log('RAW RESPONSE:', JSON.stringify(r2, null, 2));
    if (Array.isArray(videoAvatars)) {
      videoAvatars.forEach(a => {
        console.log(`VIDEO_AVATAR ID: ${a.avatar_id || a.id} | NAME: ${a.avatar_name || a.name} | TYPE: ${a.type}`);
      });
    }

    // === ENDPOINT 3: v1/avatar.list ===
    const v1Avatars = r3?.data?.avatar_list || r3?.data?.avatars || r3?.data || [];
    console.log('\n=== ENDPOINT 3: GET /v1/avatar.list ===');
    console.log('RAW RESPONSE:', JSON.stringify(r3, null, 2));
    if (Array.isArray(v1Avatars)) {
      v1Avatars.forEach(a => {
        console.log(`V1 AVATAR ID: ${a.avatar_id || a.id} | NAME: ${a.avatar_name || a.name} | TYPE: ${a.type}`);
      });
    }

    // === SEARCH ALL THREE for Bob / Dyson / custom / clone ===
    const allFound = [
      ...v2Avatars,
      ...(Array.isArray(videoAvatars) ? videoAvatars : []),
      ...(Array.isArray(v1Avatars) ? v1Avatars : []),
    ];

    const bobMatches = allFound.filter(a => {
      const id = (a.avatar_id || a.id || '').toLowerCase();
      const name = (a.avatar_name || a.name || '').toLowerCase();
      return id.includes('bob') || id.includes('dyson') || id.includes('news') ||
             name.includes('bob') || name.includes('dyson') || name.includes('news') ||
             id.includes('custom') || id.includes('clone') || id.includes('private');
    });

    console.log('\n=== BOB/DYSON/NEWS/CUSTOM MATCHES ACROSS ALL ENDPOINTS ===');
    console.log(JSON.stringify(bobMatches, null, 2));

    return Response.json({
      endpoint1_v2_avatars: {
        total: v2Avatars.length,
        custom_count: customAvatars.length,
        custom_list: customAvatars.map(a => ({ id: a.avatar_id, name: a.avatar_name, type: a.type, is_public: a.is_public })),
        all_names: v2Avatars.map(a => ({ id: a.avatar_id, name: a.avatar_name, is_custom: a.is_custom, is_public: a.is_public })),
      },
      endpoint2_video_avatar_list: {
        raw: r2,
        parsed: Array.isArray(videoAvatars) ? videoAvatars.map(a => ({ id: a.avatar_id || a.id, name: a.avatar_name || a.name })) : videoAvatars,
      },
      endpoint3_v1_avatar_list: {
        raw: r3,
        parsed: Array.isArray(v1Avatars) ? v1Avatars.map(a => ({ id: a.avatar_id || a.id, name: a.avatar_name || a.name })) : v1Avatars,
      },
      bob_dyson_matches: bobMatches,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});