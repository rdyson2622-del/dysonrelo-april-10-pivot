import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postToLinkedIn — Posts to the authenticated admin's LinkedIn profile.
 *
 * Supports two post types:
 *   1. Link preview post (ARTICLE) — when `url` is provided, LinkedIn renders
 *      a rich preview card with thumbnail image, title, and description
 *      (scraped from the destination page's Open Graph meta tags).
 *   2. Text-only post (NONE) — when no `url` is provided.
 *
 * Body:
 *   { text: string, url?: string, title?: string, description?: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, url, title, description } = await req.json();
    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Get the authenticated user's LinkedIn profile URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profile = await profileRes.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    };

    let postBody;

    if (url) {
      // Link preview post — LinkedIn crawls the URL for OG meta tags
      // to generate the thumbnail image, title, and description card.
      postBody = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'ARTICLE',
            media: [{
              status: 'READY',
              originalUrl: url,
              title: { text: title || '' },
              description: { text: description || '' },
            }],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };
    } else {
      // Text-only post (backward compatible)
      postBody = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };
    }

    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody),
    });

    const result = await postRes.json();
    const postId = postRes.headers.get('x-restli-id') || result.id;

    if (!postRes.ok) {
      return Response.json({ error: result.message || 'LinkedIn API error', details: result }, { status: 500 });
    }

    return Response.json({ success: true, post_id: postId, type: url ? 'link' : 'text' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});