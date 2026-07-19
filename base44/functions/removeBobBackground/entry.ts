import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * removeBobBackground — downloads Bob's HeyGen talking photo, sends it to
 * remove.bg for true background removal (alpha transparency), and uploads
 * the resulting transparent PNG to permanent Base44 storage.
 *
 * Requires REMOVE_BG_API_KEY secret (free key from remove.bg/api).
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const REMOVE_BG_KEY = Deno.env.get('REMOVE_BG_API_KEY');
    if (!REMOVE_BG_KEY) {
      return Response.json({
        error: 'REMOVE_BG_API_KEY not set. Get a free key at remove.bg/api and add it in Settings → Secrets.',
      }, { status: 500 });
    }

    // Source image — Bob's HeyGen talking photo preview (already persisted)
    const SOURCE_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/b41f00909_bob_dyson_preview.webp';

    // Download the source image
    const imgRes = await fetch(SOURCE_URL);
    const imgBlob = await imgRes.blob();

    // Send to remove.bg for background removal
    const formData = new FormData();
    formData.append('image_file', imgBlob, 'bob_dyson.webp');
    formData.append('size', 'auto');

    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': REMOVE_BG_KEY },
      body: formData,
    });

    if (!removeBgRes.ok) {
      const errText = await removeBgRes.text();
      return Response.json({ error: `remove.bg failed: ${removeBgRes.status}`, details: errText }, { status: 502 });
    }

    const transparentPng = await removeBgRes.blob();

    // Upload the transparent PNG to permanent storage
    const file = new File([transparentPng], 'bob_dyson_transparent.png', { type: 'image/png' });
    const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const permanentUrl = uploadRes.file_url;

    return Response.json({
      success: true,
      previewUrl: permanentUrl,
      note: 'Bob is now a true transparent PNG — no background at all.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});