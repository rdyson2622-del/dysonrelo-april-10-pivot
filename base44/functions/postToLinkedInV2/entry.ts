import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postToLinkedInV2 — Posts a video (or image fallback) to LinkedIn.
 *
 * When videoUrl is provided, uploads and posts the video.
 * Otherwise, falls back to the imageUrl.
 *
 * When organizationName is provided, posts to that company page (must be admin).
 * Otherwise, posts to the user's personal profile.
 *
 * Body:
 *   { text: string, videoUrl?: string, imageUrl?: string, title?: string, description?: string, organizationName?: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, videoUrl, imageUrl, title, description, organizationName, broadcastId } = await req.json();
    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }

    // ── RENDER INVALIDATION GUARD ──
    // If broadcastId is provided, verify the broadcast is not stale.
    // If stale, reject so the frontend can trigger a re-render first.
    // If fresh, use the broadcast's stored videoUrl (guaranteed up-to-date).
    let effectiveVideoUrl = videoUrl;
    if (broadcastId) {
      try {
        const broadcasts = await base44.asServiceRole.entities.DnnBroadcast.filter({ id: broadcastId });
        const broadcast = broadcasts?.[0];
        if (broadcast) {
          if (broadcast.needsReRender === true) {
            return Response.json({
              error: 'Broadcast has pending script/audio/slide changes. Re-render required before posting.',
              needsReRender: true,
            }, { status: 409 });
          }
          if (broadcast.videoUrl) effectiveVideoUrl = broadcast.videoUrl;
        }
      } catch (e) {
        console.log(`Render guard check failed (continuing with provided URL): ${e.message}`);
      }
    }

    if (!effectiveVideoUrl && !imageUrl) {
      return Response.json({ error: 'Missing videoUrl or imageUrl' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'Linkedin-Version': '202603',
    };

    let authorUrn;
    let postedAs = 'personal';

    if (organizationName) {
      // Step 1: List organization ACLs where the user is an APPROVED ADMINISTRATOR
      const aclsRes = await fetch(
        'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization,role,state))',
        { headers }
      );
      const aclsData = await aclsRes.json().catch(() => ({}));
      const aclElements = aclsData?.elements || [];

      if (!aclElements.length) {
        return Response.json({
          error: 'No administered organization pages found for your LinkedIn account',
          hint: 'Make sure your LinkedIn account is an ADMINISTRATOR of the DNN page, not just a follower.',
        }, { status: 400 });
      }

      // Step 2: Extract organization URNs and look up each org's name
      const orgUrns = [...new Set(aclElements.map(e => e.organization))];
      const orgs = [];

      for (const orgUrn of orgUrns) {
        const orgId = orgUrn.split(':').pop();
        const orgRes = await fetch(
          `https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,localizedName,vanityName)`,
          { headers }
        );
        const orgData = await orgRes.json().catch(() => ({}));
        if (orgData.localizedName) {
          orgs.push(orgData);
        }
      }

      if (!orgs.length) {
        return Response.json({
          error: 'Could not fetch organization details for your administered pages',
          org_urns_found: orgUrns,
        }, { status: 400 });
      }

      // Step 3: Find the matching organization by name (case-insensitive)
      const org = orgs.find(o =>
        o.localizedName?.toLowerCase().includes(organizationName.toLowerCase()) ||
        o.vanityName?.toLowerCase().includes(organizationName.toLowerCase())
      );

      if (!org) {
        return Response.json({
          error: `Could not find organization matching "${organizationName}"`,
          available_pages: orgs.map(o => o.localizedName),
        }, { status: 400 });
      }

      authorUrn = `urn:li:organization:${org.id}`;
      postedAs = org.localizedName;
      console.log(`Posting to LinkedIn organization: ${org.localizedName} (${authorUrn})`);
    } else {
      // Post to the user's personal profile
      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await profileRes.json();
      if (!profile.sub) {
        return Response.json({ error: 'Could not fetch LinkedIn profile' }, { status: 500 });
      }
      authorUrn = `urn:li:person:${profile.sub}`;
    }

    if (effectiveVideoUrl) {
      // --- VIDEO UPLOAD via LinkedIn Videos API ---
      // Step 1: Download the video
      const vidRes = await fetch(effectiveVideoUrl);
      const vidBuffer = await vidRes.arrayBuffer();
      const fileSize = vidBuffer.byteLength;

      // Step 2: Initialize upload
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
        return Response.json({ error: 'Video upload initialization failed', details: initData }, { status: 500 });
      }

      // Step 3: Upload video binary (handle chunked uploads)
      const vidBytes = new Uint8Array(vidBuffer);
      const uploadedPartIds = [];
      let uploadFailed = false;
      let uploadError = '';

      for (const instr of instructions) {
        const start = instr.firstByte || 0;
        const end = (instr.lastByte ?? fileSize - 1) + 1;
        const chunk = new Blob([vidBytes.slice(start, end)], { type: 'application/octet-stream' });

        const uploadRes = await fetch(instr.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(end - start),
          },
          body: chunk,
        });

        const etag = uploadRes.headers.get('etag') || uploadRes.headers.get('ETag');
        if (etag) uploadedPartIds.push(etag.replace(/"/g, ''));

        if (!uploadRes.ok) {
          uploadFailed = true;
          uploadError = await uploadRes.text().catch(() => 'upload error');
          break;
        }
      }

      if (uploadFailed) {
        return Response.json({ error: 'Video binary upload failed', details: uploadError.slice(0, 500) }, { status: 500 });
      }

      // Step 4: Finalize upload
      await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalizeUploadRequest: {
            video: videoUrn,
            uploadToken: uploadToken || '',
            uploadedPartIds,
          },
        }),
      });

      // Step 5: Poll until AVAILABLE (max 60s)
      let videoReady = false;
      let pollStatus = 'unknown';
      for (let attempt = 0; attempt < 12; attempt++) {
        await new Promise(r => setTimeout(r, 5000));
        const statusRes = await fetch(`https://api.linkedin.com/rest/videos/${encodeURIComponent(videoUrn)}`, {
          headers,
        });
        const statusData = await statusRes.json().catch(() => ({}));
        pollStatus = statusData?.status || statusData?.processingStatus || `http_${statusRes.status}`;
        if (pollStatus === 'READY' || pollStatus === 'AVAILABLE') {
          videoReady = true;
          break;
        }
        if (pollStatus === 'FAILED' || pollStatus === 'ERROR') break;
      }

      // Step 6: Create the post with the video via ugcPosts API
      const mediaUrn = videoUrn.replace(':video:', ':digitalmediaAsset:');
      const postBody = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            media: [{
              media: mediaUrn,
              status: 'READY',
              title: { text: title || '' },
            }],
            shareCommentary: { text },
            shareMediaCategory: 'VIDEO',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      };

      const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody),
      });

      const result = await postRes.json().catch(() => ({}));
      const postId = postRes.headers.get('x-restli-id') || result.id;

      if (!postRes.ok) {
        return Response.json({ error: result.message || 'LinkedIn video post failed', details: result, status: postRes.status }, { status: 500 });
      }

      return Response.json({ success: true, post_id: postId, video_urn: videoUrn, type: 'video', posted_as: postedAs, video_ready: videoReady, video_status: pollStatus });
    }

    // --- IMAGE FALLBACK ---
    if (!imageUrl) {
      return Response.json({ error: 'Missing imageUrl' }, { status: 400 });
    }

    // Download the image
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();

    // Register image upload
    const registerBody = {
      registerUploadRequest: {
        owner: authorUrn,
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        serviceRelationships: [{
          identifier: 'urn:li:userGeneratedContent',
          relationshipType: 'OWNER',
        }],
      },
    };

    const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(registerBody),
    });

    const registerData = await registerRes.json();
    if (!registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl) {
      return Response.json({ error: 'Failed to register upload', details: registerData }, { status: 500 });
    }

    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetUrn = registerData.value.asset;

    // Upload image binary
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': imgRes.headers.get('content-type') || 'image/png',
      },
      body: imgBuffer,
    });

    if (!uploadRes.ok) {
      const uploadErr = await uploadRes.text();
      return Response.json({ error: 'Image upload failed', details: uploadErr }, { status: 500 });
    }

    await new Promise(r => setTimeout(r, 3000));

    // Create post via Posts API
    const postBody = {
      author: authorUrn,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
      content: {
        media: {
          title: title || '',
          id: assetUrn.replace(':digitalmediaAsset:', ':image:'),
          altText: description || '',
        },
      },
    };

    const postRes = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody),
    });

    const result = await postRes.json().catch(() => ({}));
    const postId = postRes.headers.get('x-restli-id') || result.id;

    if (!postRes.ok) {
      return Response.json({ error: result.message || 'LinkedIn API error', details: result, status: postRes.status }, { status: 500 });
    }

    return Response.json({ success: true, post_id: postId, asset_urn: assetUrn, type: 'image', posted_as: postedAs });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});