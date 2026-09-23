import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * postToInstagram — Publishes a video as an Instagram Reel on the connected
 * Instagram Business account.
 *
 * Body: { text: string, videoUrl: string }
 * Uses the Instagram Graph API (graph.instagram.com) container -> publish flow.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, videoUrl } = await req.json();
    if (!videoUrl) {
      return Response.json({ error: 'Missing videoUrl' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const meData = await meRes.json().catch(() => ({}));
    if (!meData.id) {
      return Response.json({ error: 'Could not fetch Instagram account', details: meData }, { status: 500 });
    }

    // Step 1: create the media container (Reels)
    const containerRes = await fetch(`https://graph.instagram.com/v21.0/${meData.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: text || '',
        access_token: accessToken,
      }),
    });
    const containerData = await containerRes.json().catch(() => ({}));
    if (!containerData.id) {
      return Response.json({ error: 'Failed to create Instagram media container', details: containerData }, { status: 500 });
    }
    const creationId = containerData.id;

    // Step 2: poll container status until FINISHED (video processing)
    let ready = false;
    let lastStatus = 'unknown';
    for (let attempt = 0; attempt < 18; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://graph.instagram.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json().catch(() => ({}));
      lastStatus = statusData.status_code || 'unknown';
      if (lastStatus === 'FINISHED') {
        ready = true;
        break;
      }
      if (lastStatus === 'ERROR') break;
    }

    if (!ready) {
      return Response.json({ error: 'Instagram media container did not finish processing in time', last_status: lastStatus, creation_id: creationId }, { status: 500 });
    }

    // Step 3: publish
    const publishRes = await fetch(`https://graph.instagram.com/v21.0/${meData.id}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
    });
    const publishData = await publishRes.json().catch(() => ({}));
    if (!publishData.id) {
      return Response.json({ error: 'Instagram publish failed', details: publishData }, { status: 500 });
    }

    return Response.json({ success: true, post_id: publishData.id, posted_as: meData.username });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});