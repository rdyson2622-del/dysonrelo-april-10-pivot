import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * pollSocialAnalytics — Fetches latest view/engagement stats for all
 * distributed social posts (LinkedIn + Facebook) and stores them on the
 * DnnBroadcast.distribution[].analytics object.
 *
 * Body:
 *   { broadcastId?: string }  — if omitted, polls all broadcasts with sent posts
 *
 * Returns:
 *   { polled: [{ id, channels: [{ channel, post_id, impressions, likes, ... }] }] }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { broadcastId } = body || {};
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // Get broadcasts that have distribution records with sent posts
    let broadcasts = [];
    if (broadcastId) {
      const rec = await Broadcasts.get(broadcastId);
      if (rec) broadcasts = [rec];
    } else {
      broadcasts = await Broadcasts.list('-broadcast_date', 50);
    }

    // Filter to only shows that have sent social posts with post_ids
    const targets = broadcasts.filter(b => {
      const dists = b.distribution || [];
      return dists.some(d => d.status === 'sent' && d.post_id && (d.channel === 'linkedin' || d.channel === 'facebook'));
    });

    if (targets.length === 0) {
      return Response.json({ success: true, polled: [], message: 'No posts to poll' });
    }

    // Get LinkedIn access token (shared connector)
    let linkedinToken = '';
    try {
      const liConn = await base44.asServiceRole.connectors.getConnection('linkedin');
      linkedinToken = liConn.accessToken;
    } catch (e) {}

    // Get Facebook access token (shared connector)
    let fbToken = '';
    let fbPageId = '';
    try {
      const fbConn = await base44.asServiceRole.connectors.getConnection('facebook_pages');
      fbToken = fbConn.accessToken;
      // Try to get the page ID from the connection metadata or API
      const pagesRes = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${fbToken}`
      );
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        if (pagesData.data && pagesData.data.length > 0) {
          fbPageId = pagesData.data[0].id;
          fbToken = pagesData.data[0].access_token;
        }
      }
    } catch (e) {}

    const results = [];

    for (const broadcast of targets) {
      const distribution = [...(broadcast.distribution || [])];
      let changed = false;

      for (let i = 0; i < distribution.length; i++) {
        const dist = distribution[i];
        if (dist.status !== 'sent' || !dist.post_id) continue;

        const prevAnalytics = dist.analytics || {};
        const prevImpressions = prevAnalytics.impressions || 0;

        if (dist.channel === 'linkedin' && linkedinToken) {
          try {
            const headers = {
              Authorization: `Bearer ${linkedinToken}`,
              'X-Restli-Protocol-Version': '2.0.0',
              'Content-Type': 'application/json',
            };

            // Fetch social actions (likes, comments, shares)
            const socialRes = await fetch(
              `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(dist.post_id)}`,
              { headers }
            );
            const socialData = socialRes.ok ? await socialRes.json() : {};

            // Fetch impression statistics
            let impressions = 0;
            let uniqueImpressions = 0;
            try {
              const impRes = await fetch(
                `https://api.linkedin.com/rest/socialActions/${encodeURIComponent(dist.post_id)}/statistics`,
                { headers }
              );
              if (impRes.ok) {
                const impData = await impRes.json();
                impressions = impData.impressions || 0;
                uniqueImpressions = impData.uniqueImpressions || 0;
              }
            } catch (e) {}

            const likes = socialData.likesSummary?.totalLikes || 0;
            const comments = socialData.commentsSummary?.totalComments || 0;
            const shares = socialData.sharesSummary?.totalShares || 0;
            const engagementRate = impressions > 0 ? Math.round(((likes + comments + shares) / impressions) * 10000) / 100 : 0;

            distribution[i] = {
              ...dist,
              analytics: {
                impressions,
                unique_impressions: uniqueImpressions,
                likes,
                comments,
                shares,
                engagement_rate: engagementRate,
                previous_impressions: prevImpressions,
                polled_at: new Date().toISOString(),
              },
            };
            changed = true;
          } catch (e) {
            console.log(`LinkedIn analytics error for ${dist.post_id}: ${e.message}`);
          }
        }

        if (dist.channel === 'facebook' && fbToken && dist.post_id) {
          try {
            // Fetch post insights (impressions, reactions, comments, shares)
            const insightsRes = await fetch(
              `https://graph.facebook.com/v19.0/${dist.post_id}/insights?metric=post_impressions,post_impressions_unique,post_reactions_like_total,post_comments,post_shares&access_token=${fbToken}`
            );
            const insightsData = insightsRes.ok ? await insightsRes.json() : {};

            let impressions = 0;
            let uniqueImpressions = 0;
            let likes = 0;
            let comments = 0;
            let shares = 0;

            if (insightsData.data) {
              for (const metric of insightsData.data) {
                if (metric.name === 'post_impressions' && metric.values?.[0]) {
                  impressions = metric.values[0].value || 0;
                } else if (metric.name === 'post_impressions_unique' && metric.values?.[0]) {
                  uniqueImpressions = metric.values[0].value || 0;
                } else if (metric.name === 'post_reactions_like_total' && metric.values?.[0]) {
                  likes = metric.values[0].value || 0;
                } else if (metric.name === 'post_comments' && metric.values?.[0]) {
                  comments = metric.values[0].value || 0;
                } else if (metric.name === 'post_shares' && metric.values?.[0]) {
                  shares = metric.values[0].value || 0;
                }
              }
            }

            // Fallback: fetch basic post data (likes, comments, shares)
            if (impressions === 0 && likes === 0 && comments === 0) {
              try {
                const postRes = await fetch(
                  `https://graph.facebook.com/v19.0/${dist.post_id}?fields=reactions.summary(true),comments.summary(true),shares,created_time&access_token=${fbToken}`
                );
                if (postRes.ok) {
                  const postData = await postRes.json();
                  likes = postData.reactions?.summary?.total_count || 0;
                  comments = postData.comments?.summary?.total_count || 0;
                  shares = postData.shares?.count || 0;
                }
              } catch (e) {}
            }

            // Try to get video views if it's a video post
            let videoViews = 0;
            try {
              const videoRes = await fetch(
                `https://graph.facebook.com/v19.0/${dist.post_id}/video_insights?metric=video_views&access_token=${fbToken}`
              );
              if (videoRes.ok) {
                const videoData = await videoRes.json();
                if (videoData.data && videoData.data[0]?.values?.[0]) {
                  videoViews = videoData.data[0].values[0].value || 0;
                }
              }
            } catch (e) {}

            const engagementRate = impressions > 0 ? Math.round(((likes + comments + shares) / impressions) * 10000) / 100 : 0;

            distribution[i] = {
              ...dist,
              analytics: {
                impressions,
                unique_impressions: uniqueImpressions,
                likes,
                comments,
                shares,
                video_views: videoViews,
                engagement_rate: engagementRate,
                previous_impressions: prevImpressions,
                polled_at: new Date().toISOString(),
              },
            };
            changed = true;
          } catch (e) {
            console.log(`Facebook analytics error for ${dist.post_id}: ${e.message}`);
          }
        }
      }

      if (changed) {
        await Broadcasts.update(broadcast.id, { distribution });
        const channelStats = distribution
          .filter(d => d.analytics)
          .map(d => ({
            channel: d.channel,
            post_id: d.post_id,
            impressions: d.analytics.impressions || 0,
            likes: d.analytics.likes || 0,
            comments: d.analytics.comments || 0,
            shares: d.analytics.shares || 0,
          }));
        results.push({ id: broadcast.id, show_name: broadcast.show_name, channels: channelStats });
      }
    }

    return Response.json({ success: true, polled: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});