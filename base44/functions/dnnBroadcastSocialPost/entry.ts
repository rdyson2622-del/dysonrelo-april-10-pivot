import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnBroadcastSocialPost — Posts a finished DNN broadcast MP4 to LinkedIn
 * (video upload) and Facebook (video upload) in one call.
 *
 * Body:
 *   { broadcast_id: string, text?: string, organizationName?: string }
 *
 * - LinkedIn: uploads the MP4 as a native video post (personal or company page).
 * - Facebook: uploads the MP4 to the first managed Page as a native video.
 * - Records each successful post in the broadcast's distribution array.
 *
 * Auth: admin session.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { broadcast_id, text, organizationName } = body;
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }
    const hasComposited = broadcast.compositedVideoUrl && !String(broadcast.compositedVideoUrl).startsWith('creatomate:pending:');
    const hasRaw = broadcast.videoUrl && !String(broadcast.videoUrl).startsWith('heygen:pending:');
    if (!hasComposited && !hasRaw) {
      return Response.json({ error: 'Broadcast has no finished video URL yet' }, { status: 400 });
    }

    // Prefer the studio-composited MP4 (studio bg baked in) for social posts.
    // Fall back to the raw avatar MP4 only if the composite isn't ready yet.
    const videoUrl = hasComposited ? broadcast.compositedVideoUrl : broadcast.videoUrl;
    const usedComposited = Boolean(hasComposited);
    const headlineText = broadcast.headlines?.length
      ? broadcast.headlines.join(' | ')
      : (broadcast.prompt_topics || 'Daily Real Estate Intelligence');

    const socialText = text || `📡 DNN Intelligence Bureau

${headlineText}

Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you exactly what to do about it.

🔔 Watch the full broadcast: https://1dnn.com/dnn-news
Subscribe for free daily intelligence: https://1dnn.com/subscribe

#RealEstateNews #RelocationIntelligence #DNN #DysonAndDyson #HousingMarket #RealEstate`;

    const results = { linkedin: null, facebook: null };
    const distribution = [...(broadcast.distribution || [])];

    // ─── LinkedIn video upload ───────────────────────────────────────────
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Linkedin-Version': '202603',
      };

      let authorUrn;
      let postedAs = 'personal';

      if (organizationName) {
        const aclsRes = await fetch(
          'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization,role,state))',
          { headers }
        );
        const aclsData = await aclsRes.json().catch(() => ({}));
        const orgUrns = [...new Set((aclsData?.elements || []).map(e => e.organization))];

        const orgs = [];
        for (const orgUrn of orgUrns) {
          const orgId = orgUrn.split(':').pop();
          const orgRes = await fetch(
            `https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,localizedName,vanityName)`,
            { headers }
          );
          const orgData = await orgRes.json().catch(() => ({}));
          if (orgData.localizedName) orgs.push(orgData);
        }

        const org = orgs.find(o =>
          o.localizedName?.toLowerCase().includes(organizationName.toLowerCase()) ||
          o.vanityName?.toLowerCase().includes(organizationName.toLowerCase())
        );

        if (!org) {
          results.linkedin = { success: false, error: `No LinkedIn page matching "${organizationName}"`, available: orgs.map(o => o.localizedName) };
        } else {
          authorUrn = `urn:li:organization:${org.id}`;
          postedAs = org.localizedName;
        }
      } else {
        const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profile = await profileRes.json();
        authorUrn = `urn:li:person:${profile.sub}`;
      }

      if (authorUrn) {
        // Download the video
        const vidRes = await fetch(videoUrl);
        const vidBuffer = await vidRes.arrayBuffer();
        const fileSize = vidBuffer.byteLength;

        // Initialize upload
        const initRes = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initializeUploadRequest: {
              owner: authorUrn,
              fileSizeBytes: fileSize,
              uploadCaptions: false,
              uploadThumbnail: false,
            },
          }),
        });
        const initData = await initRes.json();
        const uploadToken = initData?.value?.uploadToken;
        const videoUrn = initData?.value?.video;
        const instructions = initData?.value?.uploadInstructions;

        if (!videoUrn || !instructions || instructions.length === 0) {
          results.linkedin = { success: false, error: 'Video upload init failed', details: initData };
        } else {
          const vidBytes = new Uint8Array(vidBuffer);
          const uploadedPartIds = [];
          let uploadFailed = false;

          for (const instr of instructions) {
            const start = instr.firstByte || 0;
            const end = (instr.lastByte ?? fileSize - 1) + 1;
            const chunk = new Blob([vidBytes.slice(start, end)], { type: 'application/octet-stream' });
            const uploadRes = await fetch(instr.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(end - start) },
              body: chunk,
            });
            const etag = uploadRes.headers.get('etag') || uploadRes.headers.get('ETag');
            if (etag) uploadedPartIds.push(etag.replace(/"/g, ''));
            if (!uploadRes.ok) { uploadFailed = true; break; }
          }

          if (uploadFailed) {
            results.linkedin = { success: false, error: 'Video binary upload failed' };
          } else {
            // Finalize
            await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
              method: 'POST',
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                finalizeUploadRequest: { video: videoUrn, uploadToken: uploadToken || '', uploadedPartIds },
              }),
            });

            // Poll until READY (max 60s)
            let videoReady = false;
            let pollStatus = 'unknown';
            for (let attempt = 0; attempt < 12; attempt++) {
              await new Promise(r => setTimeout(r, 5000));
              const statusRes = await fetch(`https://api.linkedin.com/rest/videos/${encodeURIComponent(videoUrn)}`, { headers });
              const statusData = await statusRes.json().catch(() => ({}));
              pollStatus = statusData?.status || statusData?.processingStatus || `http_${statusRes.status}`;
              if (pollStatus === 'READY' || pollStatus === 'AVAILABLE') { videoReady = true; break; }
              if (pollStatus === 'FAILED' || pollStatus === 'ERROR') break;
            }

            // Create the post
            const mediaUrn = videoUrn.replace(':video:', ':digitalmediaAsset:');
            const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
              method: 'POST',
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                author: authorUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                  'com.linkedin.ugc.ShareContent': {
                    media: [{ media: mediaUrn, status: 'READY', title: { text: headlineText.slice(0, 100) } }],
                    shareCommentary: { text: socialText },
                    shareMediaCategory: 'VIDEO',
                  },
                },
                visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
              }),
            });
            const result = await postRes.json().catch(() => ({}));
            const postId = postRes.headers.get('x-restli-id') || result.id;

            if (!postRes.ok) {
              results.linkedin = { success: false, error: result.message || 'LinkedIn post failed', details: result };
            } else {
              results.linkedin = { success: true, post_id: postId, posted_as: postedAs, video_ready: videoReady };
              distribution.push({ channel: 'linkedin', status: 'sent', post_id: postId, posted_at: new Date().toISOString(), recipient: postedAs });
            }
          }
        }
      }
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    // ─── Facebook video upload ───────────────────────────────────────────
    try {
      const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
      const accountsRes = await fetch(
        `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
      );
      const accountsData = await accountsRes.json().catch(() => ({}));

      if (!accountsData.data || accountsData.data.length === 0) {
        results.facebook = { success: false, error: 'No Facebook Pages found' };
      } else {
        // Prefer the DNN News page; fall back to the first available page
        const page = accountsData.data.find(p =>
          (p.name || '').toLowerCase().includes('dnn')
        ) || accountsData.data[0];

        // Upload video to the page via file_url (Facebook fetches it)
        const fbVideoRes = await fetch(`https://graph.facebook.com/v25.0/${page.id}/videos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_url: videoUrl,
            description: socialText,
            title: headlineText.slice(0, 100),
            access_token: page.access_token,
          }),
        });
        const fbResult = await fbVideoRes.json();

        if (!fbVideoRes.ok) {
          results.facebook = { success: false, error: fbResult.error?.message || 'Facebook video upload failed', details: fbResult };
        } else {
          results.facebook = { success: true, post_id: fbResult.id, page_name: page.name };
          distribution.push({ channel: 'facebook', status: 'sent', post_id: fbResult.id, posted_at: new Date().toISOString(), recipient: page.name });
        }
      }
    } catch (e) {
      results.facebook = { success: false, error: e.message };
    }

    // Record distribution on the broadcast
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, { distribution });

    return Response.json({
      success: results.linkedin?.success || results.facebook?.success,
      broadcast_id,
      ...results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}