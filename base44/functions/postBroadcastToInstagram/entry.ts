import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postBroadcastToInstagram — publishes a DNN broadcast MP4 video to Instagram.
 *
 * Body: { videoUrl: string, caption: string }
 *
 * Uses the Instagram Graph API (graph.instagram.com) — NOT Facebook Graph API.
 *
 * Flow:
 *   1. Get the Instagram user ID from graph.instagram.com/me
 *   2. Create a media container (POST /{user_id}/media with video_url + caption)
 *   3. Publish the container (POST /{user_id}/media_publish?creation_id=...)
 *
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
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { videoUrl, caption } = body;

    if (!videoUrl) {
      return Response.json({ error: 'videoUrl is required' }, { status: 400 });
    }
    if (!caption) {
      return Response.json({ error: 'caption is required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Step 1: Get Instagram user ID
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const meData = await meRes.json();
    const igUserId = meData.id;

    if (!igUserId) {
      return Response.json({
        error: 'Could not fetch Instagram user ID',
        details: meData,
      }, { status: 500 });
    }

    // Step 2: Create media container
    const createBody = new FormData();
    createBody.append('video_url', videoUrl);
    createBody.append('caption', caption);
    createBody.append('media_type', 'REELS');

    const createRes = await fetch(
      `https://graph.instagram.com/v25.0/${igUserId}/media?access_token=${accessToken}`,
      {
        method: 'POST',
        body: createBody,
      }
    );

    const createData = await createRes.json();
    const creationId = createData.id;

    if (!createRes.ok || !creationId) {
      return Response.json({
        error: createData.error?.message || 'Instagram media container creation failed',
        details: createData,
      }, { status: 502 });
    }

    // Step 3: Poll container status until ready (max 60s)
    let mediaStatus = 'IN_PROGRESS';
    for (let attempt = 0; attempt < 36; attempt++) {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://graph.instagram.com/v25.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json().catch(() => ({}));
      mediaStatus = statusData.status_code || 'IN_PROGRESS';
      if (mediaStatus === 'FINISHED') break;
      if (mediaStatus === 'ERROR') {
        return Response.json({
          error: 'Instagram media processing failed',
          details: statusData,
        }, { status: 502 });
      }
    }

    if (mediaStatus !== 'FINISHED') {
      return Response.json({
        error: `Instagram media not ready after polling (status: ${mediaStatus})`,
        creation_id: creationId,
      }, { status: 502 });
    }

    // Step 4: Publish the container
    const publishBody = new FormData();
    publishBody.append('creation_id', creationId);

    const publishRes = await fetch(
      `https://graph.instagram.com/v25.0/${igUserId}/media_publish?access_token=${accessToken}`,
      {
        method: 'POST',
        body: publishBody,
      }
    );

    const publishData = await publishRes.json();
    const mediaId = publishData.id;

    if (!publishRes.ok || !mediaId) {
      return Response.json({
        error: publishData.error?.message || 'Instagram publish failed',
        details: publishData,
      }, { status: 502 });
    }

    return Response.json({
      success: true,
      post_id: mediaId,
      ig_username: meData.username,
      type: 'video',
    });
  } catch (error) {
    console.error('postBroadcastToInstagram error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});