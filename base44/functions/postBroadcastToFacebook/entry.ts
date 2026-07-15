import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postBroadcastToFacebook — uploads a DNN broadcast MP4 video to the Dyson Facebook Page.
 *
 * Body: { videoUrl: string, text: string, title?: string, description?: string }
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
    const { videoUrl, text, title, description } = body;

    if (!videoUrl) {
      return Response.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

    // Get the Facebook Page
    const accountsRes = await fetch(
      `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
    );
    const accountsData = await accountsRes.json().catch(() => ({}));

    if (!accountsData.data || accountsData.data.length === 0) {
      return Response.json({ error: 'No Facebook Pages found' }, { status: 404 });
    }

    const page = accountsData.data[0];

    // Download the video file
    const vidRes = await fetch(videoUrl);
    if (!vidRes.ok) {
      return Response.json({ error: `Failed to download video: ${vidRes.status}` }, { status: 502 });
    }
    const videoBlob = await vidRes.blob();

    // Upload video to Facebook
    const formData = new FormData();
    formData.append('file_url', videoUrl);
    formData.append('description', text || description || '');
    formData.append('title', title || 'DNN Intelligence Bureau');

    const fbVideoRes = await fetch(
      `https://graph.facebook.com/v25.0/${page.id}/videos?access_token=${page.access_token}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const fbResult = await fbVideoRes.json();
    if (!fbVideoRes.ok) {
      return Response.json({
        error: fbResult.error?.message || 'Facebook video upload failed',
        details: fbResult,
      }, { status: 502 });
    }

    return Response.json({
      success: true,
      post_id: fbResult.id,
      page_name: page.name,
      type: 'video',
    });
  } catch (error) {
    console.error('postBroadcastToFacebook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});