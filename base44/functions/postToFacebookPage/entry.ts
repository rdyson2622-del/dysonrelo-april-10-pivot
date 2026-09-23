import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * postToFacebookPage — Posts a video (or link/text fallback) to a managed Facebook Page.
 *
 * Body: { text: string, videoUrl?: string, pageName?: string }
 * If pageName is omitted, uses the first managed Page returned by /me/accounts.
 * If pageName is provided, matches it case-insensitively against the Page name.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, videoUrl, pageName } = await req.json();
    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

    const accountsRes = await fetch(
      `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
    );
    const accountsData = await accountsRes.json().catch(() => ({}));
    const pages = accountsData?.data || [];

    if (!pages.length) {
      return Response.json({ error: 'No managed Facebook Pages found for your account', details: accountsData }, { status: 400 });
    }

    let page;
    if (pageName) {
      page = pages.find((p) => p.name?.toLowerCase().includes(pageName.toLowerCase()));
      if (!page) {
        return Response.json({
          error: `Could not find a Page matching "${pageName}"`,
          available_pages: pages.map((p) => p.name),
        }, { status: 400 });
      }
    } else {
      page = pages[0];
    }

    const pageAccessToken = page.access_token;

    if (videoUrl) {
      const videoRes = await fetch(`https://graph.facebook.com/v25.0/${page.id}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: videoUrl,
          description: text,
          access_token: pageAccessToken,
        }),
      });
      const videoData = await videoRes.json().catch(() => ({}));
      if (!videoRes.ok) {
        return Response.json({ error: videoData?.error?.message || 'Facebook video post failed', details: videoData }, { status: 500 });
      }
      return Response.json({ success: true, post_id: videoData.id, type: 'video', posted_as: page.name });
    }

    const postRes = await fetch(`https://graph.facebook.com/v25.0/${page.id}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, access_token: pageAccessToken }),
    });
    const postData = await postRes.json().catch(() => ({}));
    if (!postRes.ok) {
      return Response.json({ error: postData?.error?.message || 'Facebook post failed', details: postData }, { status: 500 });
    }
    return Response.json({ success: true, post_id: postData.id, type: 'text', posted_as: page.name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});