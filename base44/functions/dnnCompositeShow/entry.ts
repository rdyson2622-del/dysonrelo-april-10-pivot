import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnCompositeShow — Sends all clips for a DnnBroadcast to HeyGen as a single
 * multi-scene video_inputs call. HeyGen renders them sequentially and produces
 * ONE composited MP4. Then uploads to Base44 permanent storage and stores the
 * URL on broadcast.videoUrl.
 *
 * Auth: admin only.
 */
const HEYGEN_API = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_API = 'https://api.heygen.com/v1/video_status.get';
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

function phoneticSpoken(text) {
  if (!text) return text;
  return text
    .replace(/1\s*d\s*n\s*n\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*\/\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*&\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*and\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dysonanddyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/\bdyson\s*\.\s*com\b/gi, 'One D N N dot com')
    .replace(/\bdyson\s+dot\s+com\b/gi, 'One D N N dot com');
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { broadcastId, action } = body;
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: Send all clips as a single multi-scene HeyGen call ──
    if (!action || action === 'start') {
      if (!broadcastId) {
        return Response.json({ error: 'broadcastId required' }, { status: 400 });
      }

      const arr = await Broadcasts.filter({ id: broadcastId });
      const broadcast = arr?.[0];
      if (!broadcast) {
        return Response.json({ error: 'Broadcast not found' }, { status: 404 });
      }

      const clips = (broadcast.clips || []).filter(c => c.script);
      if (clips.length === 0) {
        return Response.json({ error: 'No clips with scripts found' }, { status: 400 });
      }

      // Load master layout for avatar/voice IDs
      let layout;
      try {
        const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
        const t = templates?.[0];
        layout = {
          charlieAvatarId: t?.presenter_1?.heygen_id || '41f40b894f6944188c7908253b12e921',
          charlieVoiceId: t?.presenter_1?.voice_id || 'cc5fb6c924064712ba9f690852aa4646',
          bobPhotoId: t?.presenter_2?.heygen_id || '31b79a86784e495090472af2e7b9407c',
          bobVoiceId: t?.presenter_2?.voice_id || '147b8f5713024fb9afc106f266e47482',
          videoDims: t?.video_dimensions || { width: 1280, height: 720 },
        };
      } catch (_) {
        layout = {
          charlieAvatarId: '41f40b894f6944188c7908253b12e921',
          charlieVoiceId: 'cc5fb6c924064712ba9f690852aa4646',
          bobPhotoId: '31b79a86784e495090472af2e7b9407c',
          bobVoiceId: '147b8f5713024fb9afc106f266e47482',
          videoDims: { width: 1280, height: 720 },
        };
      }

      // Build video_inputs — one entry per clip, each with the correct character
      const videoInputs = clips.map((clip) => {
        const isCharlie = clip.role === 'charlie';
        const character = isCharlie
          ? { type: 'avatar', avatar_id: layout.charlieAvatarId, avatar_style: 'normal' }
          : { type: 'talking_photo', talking_photo_id: layout.bobPhotoId };

        const spokenText = phoneticSpoken(clip.script);
        const voice = isCharlie
          ? { type: 'text', voice_id: layout.charlieVoiceId, input_text: spokenText, speed: 1.05, volume: 1.0 }
          : { type: 'text', voice_id: layout.bobVoiceId, input_text: spokenText, emotion: 'Excited', speed: 1.12, volume: 1.0 };

        return {
          character,
          voice,
          background: { type: 'color', value: '#000000' },
        };
      });

      const payload = {
        video_inputs: videoInputs,
        dimension: layout.videoDims,
      };

      console.log(`[COMPOSITE] Sending ${videoInputs.length} scenes to HeyGen as single video`);

      const res = await fetch(HEYGEN_API, {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen composite render failed', details: data }, { status: 502 });
      }

      // Store the composite heygenId on the broadcast
      await Broadcasts.update(broadcastId, {
        heygenId: videoId,
        status: 'rendering',
        errorMessage: '',
      });

      return Response.json({
        success: true,
        message: `Composite render started — ${videoInputs.length} scenes in a single MP4`,
        broadcastId,
        heygenId: videoId,
      });
    }

    // ── CHECK: Poll the composite render and upload when done ──
    if (action === 'check') {
      const id = body.heygenId || broadcastId;
      let targetId = broadcastId;

      // If heygenId passed directly, find the broadcast by heygenId
      if (body.heygenId && !broadcastId) {
        const all = await Broadcasts.filter({ status: 'rendering' }, '-updated_date', 50);
        const found = all.find(b => b.heygenId === body.heygenId);
        if (!found) {
          return Response.json({ error: 'No rendering broadcast found with that heygenId' }, { status: 404 });
        }
        targetId = found.id;
      }

      if (!targetId) {
        return Response.json({ error: 'broadcastId or heygenId required' }, { status: 400 });
      }

      const arr = await Broadcasts.filter({ id: targetId });
      const broadcast = arr?.[0];
      if (!broadcast || !broadcast.heygenId) {
        return Response.json({ error: 'Broadcast not found or no heygenId' }, { status: 404 });
      }

      const res = await fetch(
        `${HEYGEN_STATUS_API}?video_id=${encodeURIComponent(broadcast.heygenId)}`,
        { headers: { 'X-Api-Key': heygenKey } }
      );
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const heygenUrl = data?.data?.video_url;
        if (!heygenUrl) {
          return Response.json({ error: 'Completed but no video_url returned', status: 'no_url' }, { status: 502 });
        }

        // Download from HeyGen CDN
        console.log(`[COMPOSITE] Downloading from HeyGen: ${heygenUrl.substring(0, 80)}...`);
        const videoRes = await fetch(heygenUrl);
        const videoBlob = await videoRes.blob();

        // Upload to Base44 permanent storage
        const file = new File([videoBlob], `dnn_broadcast_${broadcast.broadcast_date}_composite.mp4`, { type: 'video/mp4' });
        const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        const permanentUrl = uploadRes.file_url;
        console.log(`[COMPOSITE] Uploaded to permanent storage: ${permanentUrl}`);

        await Broadcasts.update(targetId, {
          videoUrl: permanentUrl,
          status: 'completed',
          needsReRender: false,
          errorMessage: '',
        });

        return Response.json({
          success: true,
          status: 'completed',
          videoUrl: permanentUrl,
          message: 'Single composited MP4 ready on permanent storage',
        });
      } else if (status === 'failed') {
        const errMsg = data?.data?.error?.message || JSON.stringify(data?.data?.error) || 'HeyGen render failed';
        await Broadcasts.update(targetId, { status: 'failed', errorMessage: errMsg });
        return Response.json({ error: errMsg, status: 'failed' }, { status: 502 });
      } else {
        return Response.json({ success: true, status: status || 'processing', message: 'Still rendering...' });
      }
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    console.error(`[COMPOSITE] Error: ${error.message}`);
    return Response.json({ error: error.message }, { status: 500 });
  }
});