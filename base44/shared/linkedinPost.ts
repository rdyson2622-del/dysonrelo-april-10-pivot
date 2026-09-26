/**
 * linkedinPost — shared LinkedIn video/image posting logic.
 *
 * Extracted from postToLinkedInV2 so it can be called directly (no HTTP hop,
 * no admin-session requirement) from automated/scheduled functions like
 * dnnSocialBlast, in addition to the admin-only manual endpoint.
 *
 * Throws a plain Error with a descriptive message on any failure — callers
 * decide how to report it (HTTP response vs. swallow-and-continue).
 */
export async function postLinkedInVideoOrImage(base44, { text, videoUrl, imageUrl, title, description, organizationName }) {
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
    const aclElements = aclsData?.elements || [];

    if (!aclElements.length) {
      throw new Error('No administered organization pages found for the connected LinkedIn account');
    }

    const orgUrns = [...new Set(aclElements.map(e => e.organization))];
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

    if (!orgs.length) {
      throw new Error('Could not fetch organization details for the administered LinkedIn pages');
    }

    const org = orgs.find(o =>
      o.localizedName?.toLowerCase().includes(organizationName.toLowerCase()) ||
      o.vanityName?.toLowerCase().includes(organizationName.toLowerCase())
    );

    if (!org) {
      throw new Error(`Could not find LinkedIn organization matching "${organizationName}" (available: ${orgs.map(o => o.localizedName).join(', ')})`);
    }

    authorUrn = `urn:li:organization:${org.id}`;
    postedAs = org.localizedName;
  } else {
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    if (!profile.sub) throw new Error('Could not fetch LinkedIn profile');
    authorUrn = `urn:li:person:${profile.sub}`;
  }

  if (videoUrl) {
    const vidRes = await fetch(videoUrl);
    const vidBuffer = await vidRes.arrayBuffer();
    const fileSize = vidBuffer.byteLength;

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

    if (!videoUrn || !instructions || instructions.length === 0) {
      throw new Error(`LinkedIn video upload initialization failed: ${JSON.stringify(initData)}`);
    }

    const vidBytes = new Uint8Array(vidBuffer);
    const uploadedPartIds = [];

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

      if (!uploadRes.ok) {
        const uploadError = await uploadRes.text().catch(() => 'upload error');
        throw new Error(`LinkedIn video binary upload failed: ${uploadError.slice(0, 300)}`);
      }
    }

    await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalizeUploadRequest: { video: videoUrn, uploadToken: uploadToken || '', uploadedPartIds } }),
    });

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

    const mediaUrn = videoUrn.replace(':video:', ':digitalmediaAsset:');
    const postBody = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          media: [{ media: mediaUrn, status: 'READY', title: { text: title || '' } }],
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
      throw new Error(result.message || `LinkedIn video post failed: ${JSON.stringify(result)}`);
    }

    return { success: true, post_id: postId, video_urn: videoUrn, type: 'video', posted_as: postedAs, video_ready: videoReady, video_status: pollStatus };
  }

  if (!imageUrl) throw new Error('Missing videoUrl or imageUrl');

  const imgRes = await fetch(imageUrl);
  const imgBuffer = await imgRes.arrayBuffer();

  const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registerUploadRequest: {
        owner: authorUrn,
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        serviceRelationships: [{ identifier: 'urn:li:userGeneratedContent', relationshipType: 'OWNER' }],
      },
    }),
  });

  const registerData = await registerRes.json();
  const uploadUrl = registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl;
  if (!uploadUrl) throw new Error(`Failed to register LinkedIn image upload: ${JSON.stringify(registerData)}`);

  const assetUrn = registerData.value.asset;

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': imgRes.headers.get('content-type') || 'image/png' },
    body: imgBuffer,
  });
  if (!uploadRes.ok) {
    const uploadErr = await uploadRes.text();
    throw new Error(`LinkedIn image upload failed: ${uploadErr.slice(0, 300)}`);
  }

  await new Promise(r => setTimeout(r, 3000));

  const postBody = {
    author: authorUrn,
    commentary: text,
    visibility: 'PUBLIC',
    distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
    content: { media: { title: title || '', id: assetUrn.replace(':digitalmediaAsset:', ':image:'), altText: description || '' } },
  };

  const postRes = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(postBody),
  });

  const result = await postRes.json().catch(() => ({}));
  const postId = postRes.headers.get('x-restli-id') || result.id;

  if (!postRes.ok) {
    throw new Error(result.message || `LinkedIn image post failed: ${JSON.stringify(result)}`);
  }

  return { success: true, post_id: postId, asset_urn: assetUrn, type: 'image', posted_as: postedAs };
}