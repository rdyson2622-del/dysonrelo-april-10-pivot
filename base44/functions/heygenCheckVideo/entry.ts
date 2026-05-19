import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * heygenCheckVideo
 * 
 * Polls HeyGen for the render status of a pending video job.
 * When complete, writes the final CDN video_url back to DnnArticle.
 * 
 * Payload: { video_id: string, article_id: string }
 * Returns: { status: 'pending'|'completed'|'failed', video_url? }
 */

const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const { video_id, article_id } = await req.json();
    if (!video_id || !article_id) {
      return Response.json({ error: 'video_id and article_id are required' }, { status: 400 });
    }

    const res = await fetch(`${HEYGEN_API}/v1/video_status.get?video_id=${video_id}`, {
      headers: { 'X-Api-Key': HEYGEN_API_KEY },
    });
    const data = await res.json();
    console.log('RAW HEYGEN RESPONSE:', JSON.stringify(data, null, 2));

    const status = data.data?.status;
    const videoUrl = data.data?.video_url;

    if (status === 'completed' && videoUrl) {
      // Write the final MP4 URL back to the article
      await base44.asServiceRole.entities.DnnArticle.update(article_id, {
        video_url: videoUrl,
      });
      return Response.json({ status: 'completed', video_url: videoUrl });
    }

    if (status === 'failed') {
      return Response.json({ status: 'failed', detail: data.data?.error });
    }

    return Response.json({ status: 'pending' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});