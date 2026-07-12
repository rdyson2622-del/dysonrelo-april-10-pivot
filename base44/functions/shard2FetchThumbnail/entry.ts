import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2FetchThumbnail — backfills a permanent thumbnailUrl for a completed
 * CharliePageExplainer presenter clip. Calls HeyGen video_status.get (free,
 * no render credits), downloads the thumbnail image, uploads it to permanent
 * storage, and updates ONLY thumbnailUrl. Never touches presenterVideoUrl.
 *
 * POST body: { "explainerId": "..." }
 * Auth: admin session.
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { explainerId } = body || {};
    if (!explainerId) return Response.json({ error: 'explainerId is required' }, { status: 400 });

    const arr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = arr?.[0];
    if (!explainer) return Response.json({ error: 'Explainer not found' }, { status: 404 });
    if (!explainer.heygenVideoId) return Response.json({ error: 'Explainer has no heygenVideoId' }, { status: 400 });
    if (explainer.thumbnailUrl) {
      return Response.json({ success: true, message: 'Thumbnail already exists', thumbnailUrl: explainer.thumbnailUrl });
    }

    const res = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(explainer.heygenVideoId)}`,
      { headers: { 'X-Api-Key': heygenKey } }
    );
    const data = await res.json();
    const thumbUrl = data?.data?.thumbnail_url;
    if (!res.ok || !thumbUrl) {
      return Response.json({ error: 'No thumbnail available from HeyGen', details: data?.data?.status || data }, { status: 502 });
    }

    const tRes = await fetch(thumbUrl);
    if (!tRes.ok) return Response.json({ error: 'Failed to download thumbnail' }, { status: 502 });
    const tBuf = await tRes.arrayBuffer();
    const tFile = new File([tBuf], `charlie_presenter_${explainerId}_thumb.jpg`, { type: 'image/jpeg' });
    const up = await base44.asServiceRole.integrations.Core.UploadFile({ file: tFile });

    await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, { thumbnailUrl: up.file_url });
    return Response.json({ success: true, pageKey: explainer.pageKey, thumbnailUrl: up.file_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});