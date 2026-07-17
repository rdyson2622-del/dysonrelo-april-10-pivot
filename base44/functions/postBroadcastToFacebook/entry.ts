import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postBroadcastToFacebook — Posts a DNN broadcast's stitched MP4 video
 * directly to the Dyson Facebook Page using the Graph API video upload.
 *
 * Body:
 *   { broadcastId?: string, text?: string, title?: string }
 *     → If broadcastId omitted, uses the most recent completed broadcast with a video.
 *
 * Auth: admin session only.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // Find the broadcast
    let broadcast;
    if (body.broadcastId) {
      const arr = await Broadcasts.filter({ id: body.broadcastId });
      broadcast = arr?.[0];
    } else {
      const completed = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 20);
      broadcast = completed.find(b => b.videoUrl);
    }

    if (!broadcast || !broadcast.videoUrl) {
      return Response.json({ error: 'No broadcast with a stitched video found' }, { status: 404 });
    }

    // ── RENDER INVALIDATION GUARD ──
    // Reject posting if the broadcast has pending changes that invalidate the MP4.
    if (broadcast.needsReRender === true) {
      return Response.json({
        error: 'Broadcast has pending script/audio/slide changes. Re-render required before posting.',
        needsReRender: true,
      }, { status: 409 });
    }

    // Build social copy
    const liveUrl = 'https://1dnn.com/broadcast-show';
    const summary = broadcast.headlines?.length
      ? broadcast.headlines.slice(0, 3).join(' · ')
      : "Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.";
    const showLabel = broadcast.show_name || `Show ${broadcast.show_number || ''}`.trim() || 'DNN Broadcast';

    const text = body.text || `${liveUrl}

${showLabel} — ${summary}

Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Solutions, not just headlines.

#DNN #RealEstateNews #Relocation #HousingMarket`;

    const videoTitle = body.title || `${showLabel} — DNN Broadcast ${broadcast.broadcast_date}`;

    // Get Facebook Page access token
    const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

    const accountsRes = await fetch(
      `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
    );
    const accountsData = await accountsRes.json().catch(() => ({}));

    if (!accountsData.data || accountsData.data.length === 0) {
      return Response.json({ error: 'No Facebook Pages found for your account' }, { status: 400 });
    }

    const page = accountsData.data[0];
    console.log(`Posting broadcast video to Facebook Page: ${page.name} (${page.id})`);

    // Upload video via file_url (remote upload — no binary download needed)
    const fbVideoRes = await fetch(
      `https://graph.facebook.com/v25.0/${page.id}/videos?access_token=${page.access_token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: broadcast.videoUrl,
          description: text,
          title: videoTitle,
        }),
      }
    );

    const fbResult = await fbVideoRes.json().catch(() => ({}));

    if (!fbVideoRes.ok) {
      return Response.json({
        error: fbResult.error?.message || 'Facebook video upload failed',
        details: fbResult,
        page_name: page.name,
      }, { status: 502 });
    }

    const postId = fbResult.id;

    // Record distribution on the broadcast
    const distribution = broadcast.distribution || [];
    distribution.push({
      channel: 'facebook',
      recipient: page.name,
      post_id: postId,
      posted_at: new Date().toISOString(),
      status: 'sent',
    });

    await Broadcasts.update(broadcast.id, { distribution });

    return Response.json({
      success: true,
      post_id: postId,
      page_name: page.name,
      page_id: page.id,
      broadcast_id: broadcast.id,
      show_name: broadcast.show_name,
      video_url: broadcast.videoUrl,
      type: 'video',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});