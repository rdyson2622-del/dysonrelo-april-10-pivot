import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const SHOW_ID = '6a57c2a751d0648ec726cb7c';
    const shows = await base44.asServiceRole.entities.DnnBroadcast.filter({ id: SHOW_ID });
    const show = shows?.[0];
    if (!show || !show.videoUrl) return Response.json({ error: 'Show or videoUrl not found' }, { status: 404 });

    // Download current stored video
    const res = await fetch(show.videoUrl);
    const buf = await res.arrayBuffer();
    const cleanName = `Show4_July17_Render_v2.mp4`;
    const file = new File([buf], cleanName, { type: 'video/mp4' });
    const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    await base44.asServiceRole.entities.DnnBroadcast.update(SHOW_ID, {
      videoUrl: up.file_url,
    });

    return Response.json({
      success: true,
      old_url: show.videoUrl,
      new_url: up.file_url,
      filename: cleanName,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});