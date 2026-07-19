import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * persistBobPreview — downloads Bob Dyson's talking photo preview from HeyGen
 * and uploads it to permanent Base44 storage so the layout preview has a stable
 * image URL (HeyGen signed URLs expire).
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const headers = { 'X-Api-Key': HEYGEN_API_KEY, 'Accept': 'application/json' };

    // Fetch all private avatar groups
    const groupsRes = await fetch('https://api.heygen.com/v2/avatar_group.list?include_public=false', { headers })
      .then(r => r.json());
    const groups = groupsRes?.data?.avatar_group_list || [];

    // Find the BOB DYSON group
    const bobGroup = groups.find(g =>
      (g.name || '').toLowerCase().includes('bob') &&
      (g.name || '').toLowerCase().includes('dyson')
    );

    if (!bobGroup) {
      return Response.json({ error: 'BOB DYSON avatar group not found', groups: groups.map(g => g.name) }, { status: 404 });
    }

    // Fetch looks for the Bob group
    const looksRes = await fetch(`https://api.heygen.com/v2/avatar_group/${bobGroup.id}/avatars`, { headers })
      .then(r => r.json()).catch(() => null);
    const looks = looksRes?.data?.avatar_list || [];
    const bobLook = looks[0];

    if (!bobLook) {
      return Response.json({ error: 'No looks found in BOB DYSON group' }, { status: 404 });
    }

    const previewUrl = bobLook.preview_image_url || bobLook.image_url;
    if (!previewUrl) {
      return Response.json({ error: 'No preview URL for Bob look' }, { status: 404 });
    }

    // Download the preview image
    const imgRes = await fetch(previewUrl);
    const imgBlob = await imgRes.blob();
    const file = new File([imgBlob], 'bob_dyson_preview.webp', { type: 'image/webp' });

    // Upload to permanent storage
    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const permanentUrl = uploadRes.file_url;

    return Response.json({
      success: true,
      groupId: bobGroup.id,
      groupName: bobGroup.name,
      avatarId: bobLook.avatar_id || bobLook.id,
      previewUrl: permanentUrl,
      originalUrl: previewUrl.substring(0, 80) + '...',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});