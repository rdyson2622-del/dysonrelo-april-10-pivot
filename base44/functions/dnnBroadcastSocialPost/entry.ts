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

    // Default to the DNN LinkedIn company page unless caller overrides with
    // a different organizationName (or explicitly passes 'personal').
    const linkedinOrg = organizationName === 'personal' ? null : (organizationName || 'DNN');

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

    const results = { linkedin: null, facebook: null, instagram: null };
    const distribution = [...(broadcast.distribution || [])];

    // ─── LinkedIn video upload ───────────────────────────────────────────
    const channels = Array.isArray(body.channels) ? body.channels : ['linkedin', 'facebook'];
    if (!channels.includes('linkedin')) {
      results.linkedin = { success: false, skipped: true, error: 'LinkedIn not requested in channels' };
    } else try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Linkedin-Version': '202603',
      };

      let authorUrn;
      let postedAs = 'personal';

      if (linkedinOrg) {
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
          o.localizedName?.toLowerCase().includes(linkedinOrg.toLowerCase()) ||
          o.vanityName?.toLowerCase().includes(linkedinOrg.toLowerCase())
        );

        if (!org) {
          results.linkedin = { success: false, error: `No LinkedIn page matching "${linkedinOrg}"`, available: orgs.map(o => o.localizedName) };
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
    // Skip Facebook unless explicitly requested (channels=['facebook'] or ['linkedin','facebook'])
    if (!channels.includes('facebook')) {
      results.facebook = { success: false, skipped: true, error: 'Facebook not requested in channels' };
    } else try {
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

    // ─── Instagram video upload (Business account) ─────────────────────
    // Instagram requires a 2-step publish: create a media container, then publish it.
    // Uses graph.instagram.com (NOT graph.facebook.com) per the connector guide.
    if (!channels.includes('instagram')) {
      results.instagram = { success: false, skipped: true, error: 'Instagram not requested in channels' };
    } else try {
      const { accessToken: igToken } = await base44.asServiceRole.connectors.getConnection('instagram');
      // Resolve the Instagram Business user id
      const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${igToken}`);
      const meData = await meRes.json().catch(() => ({}));
      const igUserId = meData.id;
      if (!igUserId) {
        results.instagram = { success: false, error: 'Could not resolve Instagram Business user id', details: meData };
      } else {
        // Step 1 — create the video media container
        const createRes = await fetch(`https://graph.instagram.com/v25.0/${igUserId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'REELS',
            video_url: videoUrl,
            caption: socialText.slice(0, 2200),
            share_to_feed: true,
            access_token: igToken,
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok || !createData.id) {
          results.instagram = { success: false, error: createData.error?.message || 'Instagram media creation failed', details: createData };
        } else {
          const creationId = createData.id;
          // Poll until the container is READY (max 60s)
          let containerReady = false;
          let pollStatus = 'IN_PROGRESS';
          for (let attempt = 0; attempt < 36; attempt++) {
            await new Promise(r => setTimeout(r, 5000));
            const statusRes = await fetch(`https://graph.instagram.com/v25.0/${creationId}?fields=status_code&access_token=${igToken}`);
            const statusData = await statusRes.json().catch(() => ({}));
            pollStatus = statusData.status_code || 'UNKNOWN';
            if (pollStatus === 'FINISHED') { containerReady = true; break; }
            if (pollStatus === 'ERROR') break;
          }
          if (!containerReady) {
            results.instagram = { success: false, error: `Instagram video processing did not finish (status: ${pollStatus})` };
          } else {
            // Step 2 — publish the container
            const publishRes = await fetch(`https://graph.instagram.com/v25.0/${igUserId}/media_publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creation_id: creationId, access_token: igToken }),
            });
            const publishData = await publishRes.json();
            if (!publishRes.ok) {
              results.instagram = { success: false, error: publishData.error?.message || 'Instagram publish failed', details: publishData };
            } else {
              results.instagram = { success: true, post_id: publishData.id, username: meData.username };
              distribution.push({ channel: 'instagram', status: 'sent', post_id: publishData.id, posted_at: new Date().toISOString(), recipient: meData.username });
            }
          }
        }
      }
    } catch (e) {
      results.instagram = { success: false, error: e.message };
    }

    // Record distribution on the broadcast
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, { distribution });

    return Response.json({
      success: results.linkedin?.success || results.facebook?.success || results.instagram?.success,
      broadcast_id,
      ...results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}