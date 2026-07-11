import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2RenderPresenterClip
 *
 * Renders a Charlie-ONLY presenter clip for the in-app CharliePagePresenter
 * widget: avatar on a clean dark background, no page screenshot, no text slide.
 *
 * Actions (POST body):
 *   { "action": "start", "explainerId": "..." }
 *     → starts a HeyGen render of finalScript with the explainer's avatar/voice
 *       on a solid #0d0d0d background at 1280x720. Saves job id to heygenVideoId.
 *
 *   { "action": "check", "explainerId": "..." }
 *     → polls HeyGen. When completed, downloads the clip, uploads it to Base44
 *       public storage, and saves the permanent URL to presenterVideoUrl.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    const providedSecret = req.headers.get('x-pipeline-secret');
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isM2M = providedSecret && expectedSecret && providedSecret === expectedSecret;
    if (!isM2M) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, explainerId } = body || {};
    if (!explainerId) {
      return Response.json({ error: 'explainerId is required' }, { status: 400 });
    }

    const arr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = arr?.[0];
    if (!explainer) {
      return Response.json({ error: 'Explainer not found' }, { status: 404 });
    }

    if (action === 'start') {
      const script = explainer.finalScript || explainer.aiGeneratedScript;
      if (!script) {
        return Response.json({ error: 'Explainer has no script' }, { status: 400 });
      }

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: explainer.avatarId,
                avatar_style: 'normal',
              },
              voice: {
                type: 'text',
                voice_id: explainer.voiceId,
                input_text: script,
              },
              background: { type: 'color', value: '#0d0d0d' },
            },
          ],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen start failed', details: data }, { status: 502 });
      }

      await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, {
        heygenVideoId: videoId,
        renderStatus: 'rendering',
      });
      return Response.json({ success: true, videoId, status: 'started' });
    }

    if (action === 'check') {
      const videoId = body.videoId || explainer.heygenVideoId;
      if (!videoId) {
        return Response.json({ error: 'No HeyGen video id to check' }, { status: 400 });
      }

      const res = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
        { headers: { 'X-Api-Key': heygenKey } }
      );
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const videoUrl = data?.data?.video_url;
        // Download and re-upload to permanent Base44 public storage
        const vidRes = await fetch(videoUrl);
        if (!vidRes.ok) {
          return Response.json({ error: 'Failed to download HeyGen video' }, { status: 502 });
        }
        const buf = await vidRes.arrayBuffer();
        const file = new File([buf], `charlie_presenter_${explainerId}.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

        // Save a permanent thumbnail for the collapsed circle widget
        let thumbnailUrl = explainer.thumbnailUrl;
        const heygenThumb = data?.data?.thumbnail_url;
        if (heygenThumb) {
          const tRes = await fetch(heygenThumb);
          if (tRes.ok) {
            const tBuf = await tRes.arrayBuffer();
            const tFile = new File([tBuf], `charlie_presenter_${explainerId}_thumb.jpg`, { type: 'image/jpeg' });
            const tUp = await base44.asServiceRole.integrations.Core.UploadFile({ file: tFile });
            thumbnailUrl = tUp.file_url;
          }
        }

        await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, {
          presenterVideoUrl: up.file_url,
          thumbnailUrl,
          renderStatus: 'completed',
          durationSeconds: data?.data?.duration ?? explainer.durationSeconds,
        });
        return Response.json({ success: true, status: 'completed', presenterVideoUrl: up.file_url });
      }

      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, {
          renderStatus: 'failed',
          errorMessage: errMsg,
        });
        return Response.json({ success: false, status: 'failed', error: errMsg });
      }

      return Response.json({ success: true, status: status || 'processing' });
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});