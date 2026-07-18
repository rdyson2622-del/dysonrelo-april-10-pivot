import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — Frontend Staging Model (Assembly Line)
 *
 * HEYGEN'S ONLY JOB: Generate raw talking-head clips on transparent background.
 * No studio backdrop, no composition, no background baking.
 *
 * The DnnNewsBroadcastPlayer.jsx frontend layout handles ALL visual positioning:
 *   - Studio backdrop (HTML/CSS)
 *   - Charlie slot (bottom-left)
 *   - Bob slot (bottom-right)
 *   - Solution panels (HTML overlay)
 *   - Navigation pills (HTML)
 *
 * This function:
 *   1. start  → Sends raw scripts to HeyGen, one clip per call, transparent background
 *   2. check  → Polls each clip's status, stores URLs in clips[].videoUrl
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

// ── LOAD MASTER LAYOUT (avatar IDs + voice IDs only) ──
async function loadMasterLayout(base44) {
  try {
    const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
    const t = templates?.[0];
    if (t && t.status === 'approved') {
      return {
        charlieAvatarId: t.presenter_1?.heygen_id || '41f40b894f6944188c7908253b12e921',
        charlieVoiceId: t.presenter_1?.voice_id || 'cc5fb6c924064712ba9f690852aa4646',
        bobPhotoId: t.presenter_2?.heygen_id || '31b79a86784e495090472af2e7b9407c',
        bobVoiceId: t.presenter_2?.voice_id || '147b8f5713024fb9afc106f266e47482',
        videoDims: t.video_dimensions || { width: 1280, height: 720 },
        templateName: t.template_name,
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
    templateName: 'DNN Master Base Layout (fallback)',
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

    // ── START: Generate raw talking-head clips (transparent background) ──
    if (action === 'start') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        const ready = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 20);
        broadcast = ready.find(b => b.clips?.length > 0 && b.clips.some(c => !c.videoUrl));
      }

      if (!broadcast) {
        return Response.json({ error: 'No broadcast found' }, { status: 404 });
      }

      const layout = await loadMasterLayout(base44);
      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'No clips' }, { status: 400 });
      }

      // Purge cache if requested
      if (body.purgeCache) {
        const purgedClips = clips.map(c => ({ ...c, heygenId: '', videoUrl: '', status: 'not_started', errorMessage: '' }));
        await Broadcasts.update(broadcast.id, {
          clips: purgedClips, status: 'rendering', needsReRender: true,
          videoUrl: '', heygenId: '', errorMessage: '',
        });
        broadcast.clips = purgedClips;
      }

      const updatedClips = [...broadcast.clips];
      const renderIds = [];

      for (let i = 0; i < updatedClips.length; i++) {
        const clip = updatedClips[i];
        if (clip.videoUrl && !body.force && !body.purgeCache) continue;

        const isCharlie = clip.role === 'charlie';
        const character = isCharlie
          ? { type: 'avatar', avatar_id: layout.charlieAvatarId, avatar_style: 'normal' }
          : { type: 'talking_photo', talking_photo_id: layout.bobPhotoId };

        const spokenText = phoneticSpoken(clip.script);
        const voice = isCharlie
          ? { type: 'text', voice_id: layout.charlieVoiceId, input_text: spokenText, speed: 1.05, volume: 1.0 }
          : { type: 'text', voice_id: layout.bobVoiceId, input_text: spokenText, emotion: 'Excited', speed: 1.12, volume: 1.0 };

        // Green screen background — raw talking-head only, frontend chroma-keys it
        const payload = {
          video_inputs: [{
            character,
            voice,
            background: { type: 'color', value: '#00FF00' }
          }],
          dimension: layout.videoDims
        };

        console.log(`[CLIP ${i}] Role: ${clip.role} | Script preview: ${(clip.script || '').substring(0, 80)}...`);

        const res = await fetch(HEYGEN_API, {
          method: 'POST',
          headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        const videoId = data?.data?.video_id;
        if (!res.ok || !videoId) {
          return Response.json({ error: `HeyGen render failed for clip ${i} (${clip.role})`, details: data }, { status: 502 });
        }

        updatedClips[i] = { ...clip, heygenId: videoId, videoUrl: '', status: 'rendering', errorMessage: '' };
        renderIds.push({ index: i, role: clip.role, heygenId: videoId });
      }

      await Broadcasts.update(broadcast.id, {
        clips: updatedClips,
        status: 'rendering',
        needsReRender: false,
        errorMessage: ''
      });

      return Response.json({
        success: true,
        message: 'Raw talking-head clips pushed to HeyGen (transparent background)',
        broadcastId: broadcast.id,
        clipCount: updatedClips.length,
        renderIds,
        layout: layout.templateName,
        provider: 'heygen'
      });
    }

    // ── CHECK: Poll each clip's status ──
    if (action === 'check') {
      const rendering = await Broadcasts.filter({ status: 'rendering' }, '-broadcast_date', 50);
      const results = [];

      for (const broadcast of rendering) {
        const clips = broadcast.clips || [];
        const pending = clips.filter(c => c.heygenId && !c.videoUrl);
        if (pending.length === 0) continue;

        const updatedClips = [...clips];
        let allDone = true;
        let anyFailed = false;

        for (let i = 0; i < clips.length; i++) {
          const clip = clips[i];
          if (!clip.heygenId || clip.videoUrl) continue;

          const res = await fetch(
            `${HEYGEN_STATUS_API}?video_id=${encodeURIComponent(clip.heygenId)}`,
            { headers: { 'X-Api-Key': heygenKey } }
          );
          const data = await res.json();
          const status = data?.data?.status;

          if (status === 'completed') {
            const videoUrl = data?.data?.video_url;
            if (videoUrl) {
              updatedClips[i] = { ...clip, videoUrl, status: 'completed' };
              console.log(`[CLIP ${i}] Completed: ${videoUrl}`);
            } else {
              allDone = false;
              updatedClips[i] = { ...clip, status: 'no_url' };
            }
          } else if (status === 'failed') {
            anyFailed = true;
            const errMsg = data?.data?.error?.message || JSON.stringify(data?.data?.error || data) || 'HeyGen render failed';
            console.log(`[CLIP ${i}] FAILED — Full HeyGen response: ${JSON.stringify(data)}`);
            updatedClips[i] = { ...clip, status: 'failed', errorMessage: errMsg };
          } else {
            allDone = false;
          }
        }

        const completedCount = updatedClips.filter(c => c.videoUrl).length;
        const totalCount = updatedClips.length;

        if (allDone && completedCount === totalCount) {
          await Broadcasts.update(broadcast.id, { clips: updatedClips, status: 'completed', needsReRender: false });
        } else if (anyFailed) {
          await Broadcasts.update(broadcast.id, { clips: updatedClips, status: 'failed' });
        } else {
          await Broadcasts.update(broadcast.id, { clips: updatedClips });
        }

        results.push({
          id: broadcast.id,
          date: broadcast.broadcast_date,
          clipsTotal: totalCount,
          clipsCompleted: completedCount,
          status: allDone && completedCount === totalCount ? 'completed' : (anyFailed ? 'failed' : 'processing')
        });
      }

      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'action must be "start" or "check"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});