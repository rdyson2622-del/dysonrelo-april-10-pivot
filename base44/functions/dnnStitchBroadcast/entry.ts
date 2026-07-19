import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — SOLO PRESENTER EDITION
 *
 * Fires ONE authenticated POST to the HeyGen video/generate endpoint.
 * Charlie (or Bob) stands full-screen and reads the broadcast script.
 * No HeyGen Master Template, no dual-box text variables, no template ID lock.
 *
 * Presenter selection:
 *   - broadcast.presenter === 'bob'   → Bob (talking_photo)
 *   - default (including 'charlie')  → Charlie (avatar)
 *
 * Avatar/voice IDs are loaded from the LayoutTemplate golden master if present,
 * otherwise fall back to hardcoded defaults.
 *
 * SINGLE MP4 DELIVERY: One API call → one MP4 → uploaded to permanent storage.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */

const HEYGEN_API = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_API = 'https://api.heygen.com/v1/video_status.get';
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

// ── PHONETIC DOMAIN NORMALIZATION (SPOKEN AUDIO ONLY) ──
function phoneticSpoken(text) {
  if (!text) return text;
  return text
    .replace(/1\s*d\s*n\s*n\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/1\s*d\s*n\s*n\s+dot\s+com/gi, 'One D N N dot com')
    .replace(/dyson\s*\/\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*&\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*and\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dysonanddyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*\/\s*dyson\s+dot\s+com/gi, 'One D N N dot com')
    .replace(/dyson\s*and\s*dyson\s+dot\s+com/gi, 'One D N N dot com')
    .replace(/\bdyson\s*\.\s*com\b/gi, 'One D N N dot com')
    .replace(/\bdyson\s+dot\s+com\b/gi, 'One D N N dot com');
}

// ── LOAD PRESENTER CONFIG FROM MASTER LAYOUT (no template ID required) ──
async function loadPresenterConfig(base44) {
  try {
    const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
    const t = templates?.[0];
    if (t) {
      return {
        charlieAvatarId: t?.presenter_1?.heygen_id || '41f40b894f6944188c7908253b12e921',
        charlieVoiceId: t?.presenter_1?.voice_id || 'cc5fb6c924064712ba9f690852aa4646',
        bobPhotoId: t?.presenter_2?.heygen_id || '31b79a86784e495090472af2e7b9407c',
        bobVoiceId: t?.presenter_2?.voice_id || '147b8f5713024fb9afc106f266e47482',
        videoDims: t?.video_dimensions || { width: 1280, height: 720 },
      };
    }
  } catch (e) {
    console.log(`Master layout load failed, using fallback: ${e.message}`);
  }
  return {
    charlieAvatarId: '41f40b894f6944188c7908253b12e921',
    charlieVoiceId: 'cc5fb6c924064712ba9f690852aa4646',
    bobPhotoId: '31b79a86784e495090472af2e7b9407c',
    bobVoiceId: '147b8f5713024fb9afc106f266e47482',
    videoDims: { width: 1280, height: 720 },
  };
}

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
    const action = body?.action || 'check';
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // ── START: Solo presenter render ──
    if (action === 'start') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        const ready = await Broadcasts.filter({ status: 'script_ready' }, '-broadcast_date', 20);
        broadcast = ready.find(b => b.script && !b.videoUrl);
        if (!broadcast) {
          const drafts = await Broadcasts.filter({ status: 'draft' }, '-broadcast_date', 20);
          broadcast = drafts.find(b => b.script && !b.videoUrl);
        }
      }

      if (!broadcast) {
        return Response.json({ error: 'No broadcast with a script found' }, { status: 404 });
      }
      if (!broadcast.script) {
        return Response.json({ error: 'Broadcast has no script' }, { status: 400 });
      }

      const config = await loadPresenterConfig(base44);
      const isBob = broadcast.presenter === 'bob';

      const spokenText = phoneticSpoken(broadcast.script.trim());

      const character = isBob
        ? { type: 'talking_photo', talking_photo_id: config.bobPhotoId }
        : { type: 'avatar', avatar_id: config.charlieAvatarId, avatar_style: 'normal' };

      const voice = isBob
        ? { type: 'text', voice_id: config.bobVoiceId, input_text: spokenText, emotion: 'Excited', speed: 1.12, volume: 1.0 }
        : { type: 'text', voice_id: config.charlieVoiceId, input_text: spokenText, speed: 1.05, volume: 1.0 };

      const payload = {
        video_inputs: [{
          character,
          voice,
          background: { type: 'color', value: '#000000' },
        }],
        dimension: config.videoDims,
        test: false,
      };

      const presenterLabel = isBob ? 'Bob (talking photo)' : 'Charlie (avatar)';

      console.log(`[SOLO RENDER] Firing solo render for broadcast ${broadcast.id} | presenter: ${presenterLabel}`);

      const res = await fetch(HEYGEN_API, {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen solo render failed', details: data }, { status: 502 });
      }

      await Broadcasts.update(broadcast.id, {
        heygenId: videoId,
        status: 'rendering',
        needsReRender: false,
        errorMessage: '',
        videoUrl: '',
      });

      return Response.json({
        success: true,
        message: `Solo render submitted — ${presenterLabel} reading full script`,
        broadcastId: broadcast.id,
        heygenId: videoId,
        presenter: isBob ? 'bob' : 'charlie',
      });
    }

    // ── CHECK: Poll the render, download, upload to permanent storage ──
    if (action === 'check') {
      const rendering = await Broadcasts.filter({ status: 'rendering' }, '-broadcast_date', 50);
      const results = [];

      for (const broadcast of rendering) {
        if (!broadcast.heygenId || broadcast.videoUrl) continue;

        const res = await fetch(
          `${HEYGEN_STATUS_API}?video_id=${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'X-Api-Key': heygenKey } }
        );
        const data = await res.json();
        const status = data?.data?.status;

        if (status === 'completed') {
          const heygenUrl = data?.data?.video_url;
          if (!heygenUrl) {
            await Broadcasts.update(broadcast.id, { errorMessage: 'Completed but no video_url returned' });
            results.push({ id: broadcast.id, status: 'no_url' });
            continue;
          }

          // Download from HeyGen CDN
          console.log(`[SOLO RENDER] Downloading from HeyGen: ${heygenUrl.substring(0, 80)}...`);
          const videoRes = await fetch(heygenUrl);
          const videoBlob = await videoRes.blob();

          // Upload to Base44 permanent storage
          const file = new File([videoBlob], `dnn_broadcast_${broadcast.broadcast_date}.mp4`, { type: 'video/mp4' });
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          const permanentUrl = uploadRes.file_url;
          console.log(`[SOLO RENDER] Uploaded to permanent storage: ${permanentUrl}`);

          await Broadcasts.update(broadcast.id, {
            videoUrl: permanentUrl,
            status: 'completed',
            needsReRender: false,
            errorMessage: '',
          });

          results.push({ id: broadcast.id, status: 'completed', videoUrl: permanentUrl });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || JSON.stringify(data?.data?.error) || 'HeyGen render failed';
          console.log(`[SOLO RENDER] FAILED — Error: ${errMsg}`);
          await Broadcasts.update(broadcast.id, { status: 'failed', errorMessage: errMsg });
          results.push({ id: broadcast.id, status: 'failed', error: errMsg });
        } else {
          results.push({ id: broadcast.id, status: status || 'processing' });
        }
      }

      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});