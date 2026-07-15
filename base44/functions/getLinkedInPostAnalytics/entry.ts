import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * getLinkedInPostAnalytics — Fetches impression and engagement stats
 * for a LinkedIn post created via the API.
 *
 * LinkedIn does not show analytics in the UI for API-created posts,
 * so this function pulls stats directly from the LinkedIn API.
 *
 * Body:
 *   { postUrn: string }  — e.g. "urn:li:share:123456789"
 *
 * Returns:
 *   { impressions, uniqueImpressions, likes, comments, shares, reactionsByType }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { postUrn, listRecent } = body;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    };

    // If listRecent is true, fetch the user's recent posts first
    if (listRecent || !postUrn) {
      const profileRes2 = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const profile2 = await profileRes2.json();
      const personUrn = `urn:li:person:${profile2.sub}`;

      // Try ugcPosts endpoint first
      let postsData = { elements: [] };
      try {
        const postsRes = await fetch(
          `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=${encodeURIComponent(personUrn)}&count=10`,
          { headers: { ...headers, 'Content-Type': 'application/json' } }
        );
        if (postsRes.ok) postsData = await postsRes.json();
      } catch (e) {}

      // Fallback: try shares endpoint
      if (!postsData.elements || postsData.elements.length === 0) {
        try {
          const sharesRes = await fetch(
            `https://api.linkedin.com/v2/shares?q=owners&owners=${encodeURIComponent(personUrn)}&count=10`,
            { headers: { ...headers, 'Content-Type': 'application/json' } }
          );
          if (sharesRes.ok) {
            const sharesData = await sharesRes.json();
            postsData = { elements: (sharesData.elements || []).map(s => ({
              id: s.activity || s.share,
              specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text: s.text?.text || '' } } },
              created: { time: s.created?.time || s.lastModified?.time }
            })) };
          }
        } catch (e) {}
      }

      const recentPosts = [];
      for (const post of postsData.elements || []) {
        const urn = post.id || '';
        const text = post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '';
        const created = post.created?.time ? new Date(post.created.time).toISOString() : null;

        // Fetch stats for each post
        let stats = { likes: 0, comments: 0, shares: 0, impressions: 0 };
        try {
          const sRes = await fetch(
            `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(urn)}`,
            { headers: { ...headers, 'Content-Type': 'application/json' } }
          );
          if (sRes.ok) {
            const sData = await sRes.json();
            stats = {
              likes: sData.likesSummary?.totalLikes || 0,
              comments: sData.commentsSummary?.totalComments || 0,
              shares: sData.sharesSummary?.totalShares || 0,
              impressions: 0,
            };
          }
        } catch (e) {}

        recentPosts.push({ postUrn: urn, text: text.slice(0, 120), created, stats });
      }

      return Response.json({ recentPosts });
    }

    // Fetch social action statistics (likes, comments, shares)
    const socialRes = await fetch(
      `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}`,
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
    const socialData = socialRes.ok ? await socialRes.json() : {};

    // Fetch impression statistics via the analytics API
    // Uses the share statistics endpoint
    const shareUrn = postUrn.replace('urn:li:share:', '');
    let impressions = 0;
    let uniqueImpressions = 0;

    try {
      const impRes = await fetch(
        `https://api.linkedin.com/rest/socialActions/${encodeURIComponent(postUrn)}/statistics`,
        { headers: { ...headers, 'Content-Type': 'application/json' } }
      );
      if (impRes.ok) {
        const impData = await impRes.json();
        impressions = impData.impressions || 0;
        uniqueImpressions = impData.uniqueImpressions || 0;
      }
    } catch (e) {
      // Impressions may not be available immediately; return 0
    }

    return Response.json({
      postUrn,
      impressions,
      uniqueImpressions,
      likes: socialData.likesSummary?.totalLikes || 0,
      comments: socialData.commentsSummary?.totalComments || 0,
      shares: socialData.sharesSummary?.totalShares || 0,
      reactionsByType: socialData.likesSummary?.aggregatedByReactionType || {},
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});