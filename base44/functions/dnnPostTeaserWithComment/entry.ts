import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnPostTeaserWithComment — Posts a 5-second teaser clip natively to LinkedIn
 * and Facebook, then drops the full show link as the first comment.
 *
 * This is the "Teaser + Comment" playbook:
 *   1. Post the lightweight teaser video natively (algorithm-friendly)
 *   2. Immediately post a comment with the link to the full show on 1dnn.com
 *   3. Record distribution status on the DnnBroadcast entity
 *
 * Auth: admin session (manual trigger) or x-pipeline-secret (scheduled automation).
 */
const SHOW_URL = 'https://1dnn.com';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Auth: admin or M2M pipeline secret
    const providedSecret = req.headers.get('x-pipeline-secret');
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isM2M = providedSecret && expectedSecret && providedSecret === expectedSecret;
    if (!isM2M) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const broadcastId = body?.broadcastId;
    const channels = body?.channels || ['linkedin', 'facebook']; // default both
    const customCaption = body?.caption; // optional override from admin edit
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // Find the target broadcast
    let broadcast;
    if (broadcastId) {
      const arr = await Broadcasts.filter({ id: broadcastId });
      broadcast = arr?.[0];
    } else {
      // Latest completed broadcast with a teaser
      const all = await Broadcasts.list('-broadcast_date', 20);
      broadcast = all.find(b => b.videoUrl && b.teaserUrl && b.status === 'completed');
    }

    if (!broadcast) {
      return Response.json({ error: 'No broadcast with composited video + teaser found' }, { status: 404 });
    }

    if (!broadcast.teaserUrl) {
      return Response.json({ error: 'Broadcast has no teaser clip. Generate one first via creatomateComposite.' }, { status: 400 });
    }

    // Build social copy
    const dateSpoken = new Date(broadcast.broadcast_date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    const headline = broadcast.headlines?.[0] || `DNN Real Estate News with Solutions — ${dateSpoken}`;

    const defaultCaption = `${headline}

DNN Intelligence Bureau — ${dateSpoken}
Real estate news WITH solutions. We don't just report — we tell you exactly what to do about it.

Watch the full show: ${SHOW_URL}

#RealEstateNews #Relocation #DNN`;

    const teaserCaption = customCaption || defaultCaption;
    const linkCommentText = `Watch the full broadcast here: ${SHOW_URL}`;

    const distribution = broadcast.distribution || [];
    const results = { broadcastId: broadcast.id, showName: broadcast.show_name, linkedin: null, facebook: null };

    // ── LINKEDIN: Post teaser video + comment with link ──
    if (channels.includes('linkedin')) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Linkedin-Version': '202603',
        };

        // Resolve author URN — try organization first, fall back to personal
        let authorUrn;
        let postedAs = 'personal';

        const aclsRes = await fetch(
          'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization,role,state))',
          { headers }
        );
        const aclsData = await aclsRes.json().catch(() => ({}));
        const orgUrns = [...new Set((aclsData?.elements || []).map(e => e.organization))];

        let orgFound = null;
        for (const orgUrn of orgUrns) {
          const orgId = orgUrn.split(':').pop();
          const orgRes = await fetch(`https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,localizedName,vanityName)`, { headers });
          const orgData = await orgRes.json().catch(() => ({}));
          if (orgData.localizedName?.toLowerCase().includes('dyson')) { orgFound = orgData; break; }
        }

        if (orgFound) {
          authorUrn = `urn:li:organization:${orgFound.id}`;
          postedAs = orgFound.localizedName;
        } else {
          const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } });
          const profile = await profileRes.json();
          if (!profile.sub) throw new Error('Could not fetch LinkedIn profile');
          authorUrn = `urn:li:person:${profile.sub}`;
        }

        // Download teaser video
        const vidRes = await fetch(broadcast.teaserUrl);
        const vidBuffer = await vidRes.arrayBuffer();
        const fileSize = vidBuffer.byteLength;

        // Initialize upload via Videos API
        const initRes = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initializeUploadRequest: { owner: authorUrn, fileSizeBytes: fileSize, uploadCaptions: false, uploadThumbnail: false },
          }),
        });
        const initData = await initRes.json();
        const uploadToken = initData?.value?.uploadToken;
        const videoUrn = initData?.value?.video;
        const instructions = initData?.value?.uploadInstructions;

        if (!videoUrn || !instructions || instructions.length === 0) throw new Error('LinkedIn video init failed');

        // Upload video binary
        const vidBytes = new Uint8Array(vidBuffer);
        const uploadedPartIds = [];
        for (const instr of instructions) {
          const start = instr.firstByte || 0;
          const end = (instr.lastByte ?? fileSize - 1) + 1;
          const chunk = new Blob([vidBytes.slice(start, end)], { type: 'application/octet-stream' });
          const uploadResp = await fetch(instr.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(end - start) },
            body: chunk,
          });
          const etag = uploadResp.headers.get('etag') || uploadResp.headers.get('ETag');
          if (etag) uploadedPartIds.push(etag.replace(/"/g, ''));
          if (!uploadResp.ok) throw new Error('LinkedIn video upload failed');
        }

        // Finalize upload
        await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ finalizeUploadRequest: { video: videoUrn, uploadToken: uploadToken || '', uploadedPartIds } }),
        });

        // Poll for READY (max 60s — teaser is tiny so should be fast)
        let videoReady = false;
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 5000));
          const statusRes = await fetch(`https://api.linkedin.com/rest/videos/${encodeURIComponent(videoUrn)}`, { headers });
          const statusData = await statusRes.json().catch(() => ({}));
          const pollStatus = statusData?.status || statusData?.processingStatus || `http_${statusRes.status}`;
          if (pollStatus === 'READY' || pollStatus === 'AVAILABLE') { videoReady = true; break; }
          if (pollStatus === 'FAILED' || pollStatus === 'ERROR') break;
        }

        // Create post with teaser video
        const mediaUrn = videoUrn.replace(':video:', ':digitalmediaAsset:');
        const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                media: [{ media: mediaUrn, status: 'READY', title: { text: headline } }],
                shareCommentary: { text: teaserCaption },
                shareMediaCategory: 'VIDEO',
              },
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
          }),
        });
        const postData = await postRes.json().catch(() => ({}));
        const postId = postRes.headers.get('x-restli-id') || postData.id;
        if (!postRes.ok) throw new Error(postData.message || 'LinkedIn post failed');

        // Post comment with show link
        let commentId = '';
        try {
          const commentRes = await fetch('https://api.linkedin.com/v2/comments', {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actor: authorUrn,
              object: postId,
              message: { text: linkCommentText },
            }),
          });
          const commentData = await commentRes.json().catch(() => ({}));
          commentId = commentRes.headers.get('x-restli-id') || commentData.id || '';
        } catch (commentErr) {
          // Comment failed but post succeeded — not critical
          console.warn('LinkedIn comment failed:', commentErr.message);
        }

        results.linkedin = { success: true, post_id: postId, comment_id: commentId, posted_as: postedAs, video_ready: videoReady };
      } catch (e) {
        results.linkedin = { success: false, error: e.message };
      }
    }

    // ── FACEBOOK: Post teaser video + comment with link ──
    if (channels.includes('facebook')) {
      try {
        const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

        const accountsRes = await fetch(`https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`);
        const accountsData = await accountsRes.json().catch(() => ({}));

        if (!accountsData.data || accountsData.data.length === 0) {
          results.facebook = { success: false, error: 'No Facebook Pages found' };
        } else {
          const page = accountsData.data[0];

          // Upload teaser video to Facebook Page
          const vidRes = await fetch(broadcast.teaserUrl);
          const videoBuf = await vidRes.arrayBuffer();
          const formData = new FormData();
          formData.append('source', new Blob([videoBuf], { type: 'video/mp4' }), 'dnn_teaser.mp4');
          formData.append('description', teaserCaption);
          formData.append('title', headline);

          const fbPostRes = await fetch(`https://graph.facebook.com/v25.0/${page.id}/videos?access_token=${page.access_token}`, {
            method: 'POST',
            body: formData,
          });
          const fbResult = await fbPostRes.json();
          if (!fbPostRes.ok) {
            results.facebook = { success: false, error: fbResult.error?.message || 'Facebook API error' };
          } else {
            const fbPostId = fbResult.id;

            // Post comment with show link
            let fbCommentId = '';
            try {
              const commentRes = await fetch(
                `https://graph.facebook.com/v25.0/${fbPostId}/comments?message=${encodeURIComponent(linkCommentText)}&access_token=${page.access_token}`,
                { method: 'POST' }
              );
              const commentData = await commentRes.json().catch(() => ({}));
              fbCommentId = commentData.id || '';
            } catch (commentErr) {
              console.warn('Facebook comment failed:', commentErr.message);
            }

            results.facebook = { success: true, post_id: fbPostId, comment_id: fbCommentId, page_name: page.name };
          }
        }
      } catch (e) {
        results.facebook = { success: false, error: e.message };
      }
    }

    // Record distribution results on the broadcast
    const now = new Date().toISOString();
    const distRecords = [...distribution];

    if (results.linkedin) {
      const idx = distRecords.findIndex(d => d.channel === 'linkedin');
      const record = {
        channel: 'linkedin',
        status: results.linkedin.success ? 'sent' : 'failed',
        recipient: results.linkedin.posted_as || 'DNN LinkedIn Page',
        post_id: results.linkedin.post_id || '',
        comment_id: results.linkedin.comment_id || '',
        posted_at: results.linkedin.success ? now : undefined,
        error: results.linkedin.success ? undefined : results.linkedin.error,
      };
      if (idx >= 0) distRecords[idx] = { ...distRecords[idx], ...record };
      else distRecords.push(record);
    }

    if (results.facebook) {
      const idx = distRecords.findIndex(d => d.channel === 'facebook');
      const record = {
        channel: 'facebook',
        status: results.facebook.success ? 'sent' : 'failed',
        recipient: results.facebook.page_name || 'DNN Facebook Page',
        post_id: results.facebook.post_id || '',
        comment_id: results.facebook.comment_id || '',
        posted_at: results.facebook.success ? now : undefined,
        error: results.facebook.success ? undefined : results.facebook.error,
      };
      if (idx >= 0) distRecords[idx] = { ...distRecords[idx], ...record };
      else distRecords.push(record);
    }

    await Broadcasts.update(broadcast.id, { distribution: distRecords });

    return Response.json({
      success: true,
      broadcastId: broadcast.id,
      showName: broadcast.show_name,
      date: broadcast.broadcast_date,
      results,
    });
  } catch (error) {
    console.error('dnnPostTeaserWithComment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});