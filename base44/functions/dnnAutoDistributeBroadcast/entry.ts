import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnAutoDistributeBroadcast — Auto-posts the latest composited DNN broadcast
 * video to LinkedIn, Instagram, and Facebook.
 *
 * Finds the most recent DnnBroadcast with a composited videoUrl that hasn't been
 * distributed yet, posts the video to all connected social platforms, and records
 * the distribution status on the broadcast entity.
 *
 * Auth: admin session (manual trigger) or x-pipeline-secret (scheduled automation).
 */
const SUBSCRIBE_URL = 'https://1dnn.com/subscribe';
const SHOW_URL = 'https://1dnn.com/dnn-news';

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

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // Find the latest broadcast with a composited video that hasn't been distributed
    const all = await Broadcasts.list('-broadcast_date', 20);
    const broadcast = all.find(b =>
      b.videoUrl &&
      b.status === 'completed' &&
      (!b.distribution || b.distribution.length === 0 || b.distribution.every(d => d.status === 'failed'))
    );

    if (!broadcast) {
      return Response.json({
        success: true,
        message: 'No composited broadcasts pending distribution',
      });
    }

    // Build social copy
    const dateSpoken = new Date(broadcast.broadcast_date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });

    const headline = broadcast.headlines?.[0] || `DNN Real Estate News with Solutions — ${dateSpoken}`;

    const socialText = `🎬 ${headline}

📡 DNN Intelligence Bureau — ${dateSpoken}
Dyson & Dyson Real Estate Concierge delivers real estate news WITH solutions. We don't just report what happened — we tell you exactly what to do about it.

🔔 Watch the full broadcast: ${SHOW_URL}
Subscribe for free daily intelligence: ${SUBSCRIBE_URL}

#RealEstateNews #RelocationIntelligence #DNN #DysonAndDyson #HousingMarket #RealEstate`;

    const distribution = broadcast.distribution || [];
    const results = { broadcastId: broadcast.id, showName: broadcast.show_name, linkedin: null, instagram: null, facebook: null };

    // ── LinkedIn: post video to organization page ──
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

      // Get user's authorized organizations
      const orgsRes = await fetch(
        'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*~(organization~(id,localizedName,vanityName,logoV2)))',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const orgsData = await orgsRes.json();
      const orgElement = orgsData?.elements?.find(e => e?.organization?.['~']?.localizedName?.includes('Dyson'));
      const orgInfo = orgElement?.organization?.['~'];

      if (!orgInfo) {
        // Fall back to personal profile
        const profileRes = await fetch('https://api.linkedin.com/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profileData = await profileRes.json();
        const authorUrn = `urn:li:person:${profileData.id}`;

        // Upload video to LinkedIn
        const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
              owner: authorUrn,
              serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
            },
          }),
        });
        const registerData = await registerRes.json();
        const uploadUrl = registerData?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl;
        const assetUrn = registerData?.value?.asset;

        if (!uploadUrl || !assetUrn) throw new Error('LinkedIn register failed');

        // Download and upload the video
        const vidRes = await fetch(broadcast.videoUrl);
        const videoBuf = await vidRes.arrayBuffer();
        const uploadResp = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: videoBuf,
        });
        if (!uploadResp.ok) throw new Error('LinkedIn video upload failed');

        // Poll for READY status (max 60s)
        let assetReady = false;
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 5000));
          const statusRes = await fetch(`https://api.linkedin.com/v2/assets/${assetUrn.split(':').pop()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const statusData = await statusRes.json();
          if (statusData?.recipes?.[0]?.status === 'READY') { assetReady = true; break; }
        }
        if (!assetReady) throw new Error('LinkedIn video not ready after 60s');

        // Create post
        const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text: socialText },
                shareMediaCategory: 'VIDEO',
                media: [{ status: 'READY', description: { text: headline }, media: assetUrn, title: { text: broadcast.show_name || 'DNN Broadcast' } }],
              },
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
          }),
        });
        const postData = await postRes.json();
        if (!postRes.ok) throw new Error(postData.message || 'LinkedIn post failed');
        results.linkedin = { success: true, post_id: postData.id, type: 'video' };
      } else {
        // Organization post
        const authorUrn = `urn:li:organization:${orgInfo.id}`;

        const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
              owner: authorUrn,
              serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
            },
          }),
        });
        const registerData = await registerRes.json();
        const uploadUrl = registerData?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl;
        const assetUrn = registerData?.value?.asset;

        if (!uploadUrl || !assetUrn) throw new Error('LinkedIn register failed');

        const vidRes = await fetch(broadcast.videoUrl);
        const videoBuf = await vidRes.arrayBuffer();
        const uploadResp = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: videoBuf,
        });
        if (!uploadResp.ok) throw new Error('LinkedIn video upload failed');

        let assetReady = false;
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 5000));
          const statusRes = await fetch(`https://api.linkedin.com/v2/assets/${assetUrn.split(':').pop()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const statusData = await statusRes.json();
          if (statusData?.recipes?.[0]?.status === 'READY') { assetReady = true; break; }
        }
        if (!assetReady) throw new Error('LinkedIn video not ready after 60s');

        const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text: socialText },
                shareMediaCategory: 'VIDEO',
                media: [{ status: 'READY', description: { text: headline }, media: assetUrn, title: { text: broadcast.show_name || 'DNN Broadcast' } }],
              },
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
          }),
        });
        const postData = await postRes.json();
        if (!postRes.ok) throw new Error(postData.message || 'LinkedIn post failed');
        results.linkedin = { success: true, post_id: postData.id, type: 'video', org: orgInfo.localizedName };
      }
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    // ── Instagram: post video as Reel ──
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

      // Get Instagram user ID
      const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
      const meData = await meRes.json();
      const igUserId = meData.id;
      if (!igUserId) throw new Error('Could not fetch Instagram user ID');

      // Create media container (REELS)
      const createBody = new FormData();
      createBody.append('video_url', broadcast.videoUrl);
      createBody.append('caption', socialText);
      createBody.append('media_type', 'REELS');

      const createRes = await fetch(`https://graph.instagram.com/v25.0/${igUserId}/media?access_token=${accessToken}`, {
        method: 'POST',
        body: createBody,
      });
      const createData = await createRes.json();
      const creationId = createData.id;
      if (!createRes.ok || !creationId) throw new Error(createData.error?.message || 'Instagram container creation failed');

      // Poll for FINISHED status (max 60s)
      let mediaStatus = 'IN_PROGRESS';
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const statusRes = await fetch(`https://graph.instagram.com/v25.0/${creationId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json().catch(() => ({}));
        mediaStatus = statusData.status_code || 'IN_PROGRESS';
        if (mediaStatus === 'FINISHED') break;
        if (mediaStatus === 'ERROR') throw new Error('Instagram media processing failed');
      }
      if (mediaStatus !== 'FINISHED') throw new Error(`Instagram media not ready (status: ${mediaStatus})`);

      // Publish
      const publishBody = new FormData();
      publishBody.append('creation_id', creationId);
      const publishRes = await fetch(`https://graph.instagram.com/v25.0/${igUserId}/media_publish?access_token=${accessToken}`, {
        method: 'POST',
        body: publishBody,
      });
      const publishData = await publishRes.json();
      if (!publishRes.ok || !publishData.id) throw new Error(publishData.error?.message || 'Instagram publish failed');

      results.instagram = { success: true, post_id: publishData.id, username: meData.username };
    } catch (e) {
      results.instagram = { success: false, error: e.message };
    }

    // ── Facebook: post video to Page ──
    try {
      const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

      const accountsRes = await fetch(`https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`);
      const accountsData = await accountsRes.json().catch(() => ({}));

      if (!accountsData.data || accountsData.data.length === 0) {
        results.facebook = { success: false, error: 'No Facebook Pages found' };
      } else {
        const page = accountsData.data[0];

        // Upload video directly to Facebook Page
        const vidRes = await fetch(broadcast.videoUrl);
        const videoBuf = await vidRes.arrayBuffer();
        const formData = new FormData();
        formData.append('source', new Blob([videoBuf], { type: 'video/mp4' }), 'dnn_broadcast.mp4');
        formData.append('description', socialText);
        formData.append('title', broadcast.show_name || 'DNN Broadcast');

        const fbPostRes = await fetch(`https://graph.facebook.com/v25.0/${page.id}/videos?access_token=${page.access_token}`, {
          method: 'POST',
          body: formData,
        });
        const fbResult = await fbPostRes.json();
        if (!fbPostRes.ok) {
          results.facebook = { success: false, error: fbResult.error?.message || 'Facebook API error' };
        } else {
          results.facebook = { success: true, post_id: fbResult.id, page_name: page.name, type: 'video' };
        }
      }
    } catch (e) {
      results.facebook = { success: false, error: e.message };
    }

    // Record distribution results on the broadcast
    const now = new Date().toISOString();
    const distRecords = [];

    if (results.linkedin) {
      distRecords.push({
        channel: 'linkedin',
        status: results.linkedin.success ? 'sent' : 'failed',
        recipient: results.linkedin.org || 'DNN LinkedIn Page',
        post_id: results.linkedin.post_id || '',
        posted_at: results.linkedin.success ? now : undefined,
        error: results.linkedin.success ? undefined : results.linkedin.error,
      });
    }
    if (results.instagram) {
      distRecords.push({
        channel: 'instagram',
        status: results.instagram.success ? 'sent' : 'failed',
        recipient: results.instagram.username || 'DNN Instagram',
        post_id: results.instagram.post_id || '',
        posted_at: results.instagram.success ? now : undefined,
        error: results.instagram.success ? undefined : results.instagram.error,
      });
    }
    if (results.facebook) {
      distRecords.push({
        channel: 'facebook',
        status: results.facebook.success ? 'sent' : 'failed',
        recipient: results.facebook.page_name || 'DNN Facebook Page',
        post_id: results.facebook.post_id || '',
        posted_at: results.facebook.success ? now : undefined,
        error: results.facebook.success ? undefined : results.facebook.error,
      });
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
    console.error('dnnAutoDistributeBroadcast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});