import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * heygenGroupLooks
 * Fetches the avatar "looks" under a given avatar group/identity ID,
 * and (optionally) lists available voices — so we can pick a renderable
 * avatarId + voiceId for Shard 2.
 *
 * Body: { groupId: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const groupId = body.groupId;
    if (!groupId) return Response.json({ error: 'groupId required' }, { status: 400 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    const [looksRes, voicesRes] = await Promise.all([
      fetch(`https://api.heygen.com/v2/avatar_group/${groupId}/avatars`, { headers }).then(r => r.json()).catch(e => ({ error: e.message })),
      fetch('https://api.heygen.com/v2/voices', { headers }).then(r => r.json()).catch(e => ({ error: e.message })),
    ]);

    const looksRaw = looksRes?.data?.avatar_list || looksRes?.data?.avatars || looksRes?.data || [];
    const looks = Array.isArray(looksRaw)
      ? looksRaw.map(a => ({ avatarId: a.avatar_id || a.id, name: a.avatar_name || a.name }))
      : [];

    const voicesRaw = voicesRes?.data?.voices || voicesRes?.data || [];
    const voices = Array.isArray(voicesRaw)
      ? voicesRaw.slice(0, 60).map(v => ({ voiceId: v.voice_id, name: v.name, gender: v.gender, language: v.language }))
      : [];

    return Response.json({
      groupId,
      looks,
      looksCount: looks.length,
      looksRaw: looks.length === 0 ? looksRes : undefined,
      voiceCount: Array.isArray(voicesRaw) ? voicesRaw.length : 0,
      sampleVoices: voices,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});