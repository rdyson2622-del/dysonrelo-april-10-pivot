import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * heygenFindBobAvatar — lists custom avatar groups + custom voices,
 * searching for Bob Dyson's clone (black shirt look) and his voice.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };
    const body = await req.json().catch(() => ({}));

    if (body.voicesOnly) {
      const vr = await fetch('https://api.heygen.com/v2/voices', { headers }).then(r => r.json());
      const all = vr?.data?.voices || [];
      const matches = all.filter(v =>
        v.is_custom === true ||
        (v.name || '').toLowerCase().includes('bob') ||
        (v.name || '').toLowerCase().includes('dyson') ||
        (v.name || '').toLowerCase().includes('charlie')
      ).map(v => ({ voiceId: v.voice_id, name: v.name, gender: v.gender, language: v.language, is_custom: v.is_custom }));
      return Response.json({ total: all.length, matches });
    }

    const [groupsRes, voicesRes] = await Promise.all([
      fetch('https://api.heygen.com/v2/avatar_group.list?include_public=false', { headers }).then(r => r.json()),
      fetch('https://api.heygen.com/v2/voices', { headers }).then(r => r.json()),
    ]);

    const groups = groupsRes?.data?.avatar_group_list || [];

    // Pull looks for every private group so we can see the black-shirt look
    const groupsWithLooks = await Promise.all(groups.map(async (g) => {
      const looksRes = await fetch(`https://api.heygen.com/v2/avatar_group/${g.id}/avatars`, { headers })
        .then(r => r.json()).catch(() => null);
      const looksRaw = looksRes?.data?.avatar_list || [];
      return {
        groupId: g.id,
        groupName: g.name,
        looks: looksRaw.map(a => ({
          avatarId: a.avatar_id || a.id,
          name: a.avatar_name || a.name,
          previewUrl: a.preview_image_url || a.image_url,
        })),
      };
    }));

    const voicesRaw = voicesRes?.data?.voices || [];
    const customVoices = voicesRaw.filter(v =>
      v.is_custom === true ||
      (v.name || '').toLowerCase().includes('bob') ||
      (v.name || '').toLowerCase().includes('dyson')
    ).map(v => ({ voiceId: v.voice_id, name: v.name, gender: v.gender, language: v.language, is_custom: v.is_custom }));

    return Response.json({
      groupCount: groups.length,
      groups: groupsWithLooks,
      customVoices,
      totalVoices: voicesRaw.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});