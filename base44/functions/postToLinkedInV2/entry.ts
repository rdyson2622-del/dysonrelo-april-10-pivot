import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postToLinkedInV2 — Posts to LinkedIn with a directly-uploaded image.
 *
 * Uses the newer Posts API (rest/posts) with direct image upload.
 *
 * Body:
 *   { text: string, imageUrl: string, url?: string, title?: string, description?: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, imageUrl, url, title, description } = await req.json();
    if (!text || !imageUrl) {
      return Response.json({ error: 'Missing text or imageUrl' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Fetch Bob's personal profile URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    if (!profile.sub) {
      return Response.json({ error: 'Could not fetch LinkedIn profile' }, { status: 500 });
    }
    const authorUrn = `urn:li:person:${profile.sub}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'Linkedin-Version': '202603',
    };

    // Step 1: Download the image
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();

    // Step 2: Register an image upload via the media API
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

    // Step 3: Upload the image binary
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

    // Step 4: Wait for LinkedIn to process the image
    await new Promise(r => setTimeout(r, 3000));

    // Step 5: Create the post using the newer Posts API (rest/posts)
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

    return Response.json({ success: true, post_id: postId, asset_urn: assetUrn, type: 'image' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});