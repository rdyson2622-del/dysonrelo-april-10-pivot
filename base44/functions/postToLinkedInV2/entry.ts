import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * postToLinkedInV2 — Posts to LinkedIn with a directly-uploaded image.
 *
 * Instead of relying on LinkedIn's scraper to fetch og:image, this function:
 *   1. Downloads the image from the provided imageUrl
 *   2. Uploads it to LinkedIn's media platform
 *   3. Creates the post with the uploaded image attached
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
    };

    // Step 1: Register an image upload
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

    // Step 2: Download the image and upload it to LinkedIn
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();

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

    // Step 3: Wait a moment for LinkedIn to process the image
    await new Promise(r => setTimeout(r, 2000));

    // Step 4: Create the post with the uploaded image (IMAGE category for organization posts)
    const postBody = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: url ? `${text}\n\n${url}` : text },
          shareMediaCategory: 'IMAGE',
          media: [{
            status: 'READY',
            description: { text: description || '' },
            media: assetUrn,
            title: { text: title || '' },
          }],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody),
    });

    const result = await postRes.json();
    const postId = postRes.headers.get('x-restli-id') || result.id;

    if (!postRes.ok) {
      return Response.json({ error: result.message || 'LinkedIn API error', details: result }, { status: 500 });
    }

    return Response.json({ success: true, post_id: postId, asset_urn: assetUrn, type: url ? 'link' : 'image' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});