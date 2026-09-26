import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { postLinkedInVideoOrImage } from '../../shared/linkedinPost.ts';

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
 *
 * The actual posting logic lives in shared/linkedinPost.ts so automated
 * pipelines (e.g. dnnSocialBlast) can call it directly without an HTTP hop.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text, videoUrl, imageUrl, title, description, organizationName } = await req.json();
    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }
    if (!videoUrl && !imageUrl) {
      return Response.json({ error: 'Missing videoUrl or imageUrl' }, { status: 400 });
    }

    const result = await postLinkedInVideoOrImage(base44, { text, videoUrl, imageUrl, title, description, organizationName });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});