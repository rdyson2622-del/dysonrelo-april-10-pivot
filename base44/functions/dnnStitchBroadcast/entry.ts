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

const HEYGEN_TEMPLATE_API = 'https://api.heygen.com/v2/template';
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

// ── LOAD MASTER LAYOUT CONFIG (template ID + presenter IDs + dims) ──
async function loadMasterLayout(base44) {
  try {
    const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
    const t = templates?.[0];
    if (t) {
      return {
        templateId: t?.heygen_template_id,
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
    templateId: null,
    charlieAvatarId: '41f40b894f6944188c7908253b12e921',
    charlieVoiceId: 'cc5fb6c924064712ba9f690852aa4646',
    bobPhotoId: '31b79a86784e495090472af2e7b9407c',
    bobVoiceId: '147b8f5713024fb9afc106f266e47482',
    videoDims: { width: 1280, height: 720 },
  };
}

// ── SPLIT A SCRIPT INTO UP TO N SPOKEN LINES ──
function splitScriptIntoLines(script, maxLines = 8) {
  if (!script) return [];
  const sentences = script.match(/[^.!?]+[.!?]+["']?/g) || [script];
  if (sentences.length <= maxLines) return sentences.map(s => s.trim()).filter(Boolean);
  const lines = [];
  const perLine = Math.ceil(sentences.length / maxLines);
  for (let i = 0; i < sentences.length; i += perLine) {
    const chunk = sentences.slice(i, i + perLine).join(' ').trim();
    if (chunk) lines.push(chunk);
  }
  return lines.slice(0, maxLines);
}

// ── BUILD TEMPLATE VARIABLES FROM BROADCAST ──
function buildTemplateVariables(broadcast) {
  const variables = {};
  const isTagTeam = broadcast.format === 'tag_team';

  // Studio wall: headline + 3 bullets from headlines array
  const headlines = broadcast.headlines || [];
  if (headlines[0]) {
    variables['studio_wall_headline'] = {
      name: 'studio_wall_headline', type: 'text',
      properties: { content: headlines[0] },
    };
  }
  if (headlines[1]) {
    variables['studio_wall_bullet_1'] = {
      name: 'studio_wall_bullet_1', type: 'text',
      properties: { content: headlines[1] },
    };
  }
  if (headlines[2]) {
    variables['studio_wall_bullet_2'] = {
      name: 'studio_wall_bullet_2', type: 'text',
      properties: { content: headlines[2] },
    };
  }
  if (headlines[3]) {
    variables['studio_wall_bullet_3'] = {
      name: 'studio_wall_bullet_3', type: 'text',
      properties: { content: headlines[3] },
    };
  }

  if (isTagTeam && broadcast.clips?.length) {
    // Tag-team: split clips by role
    const charlieClips = broadcast.clips.filter(c => c.role === 'charlie' && c.script);
    const bobClips = broadcast.clips.filter(c => c.role === 'bob' && c.script);

    const charlieScript = charlieClips.map(c => c.script).join(' ');
    const bobScript = bobClips.map(c => c.script).join(' ');

    const charlieLines = splitScriptIntoLines(charlieScript, 8);
    const bobLines = splitScriptIntoLines(bobScript, 8);

    charlieLines.forEach((line, i) => {
      variables[`charlie_line_${i + 1}`] = {
        name: `charlie_line_${i + 1}`, type: 'text',
        properties: { content: phoneticSpoken(line) },
      };
    });
    bobLines.forEach((line, i) => {
      variables[`bob_line_${i + 1}`] = {
        name: `bob_line_${i + 1}`, type: 'text',
        properties: { content: phoneticSpoken(line) },
      };
    });
  } else {
    // Solo: all script goes to Charlie's 8 lines
    const lines = splitScriptIntoLines(broadcast.script, 8);
    lines.forEach((line, i) => {
      variables[`charlie_line_${i + 1}`] = {
        name: `charlie_line_${i + 1}`, type: 'text',
        properties: { content: phoneticSpoken(line) },
      };
    });
  }

  return variables;
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

    // ── START: Template-based render ──
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

      const layout = await loadMasterLayout(base44);

      // Allow per-call template override for testing
      if (body.templateId) {
        layout.templateId = body.templateId;
      }

      if (!layout.templateId) {
        return Response.json({
          error: 'No heygen_template_id set on the master LayoutTemplate. Configure it in Admin Layout Library first.',
        }, { status: 400 });
      }

      const variables = buildTemplateVariables(broadcast);
      const variableCount = Object.keys(variables).length;
      if (variableCount === 0) {
        return Response.json({ error: 'No variables could be built from this broadcast' }, { status: 400 });
      }

      const payload = {
        title: `${broadcast.show_name || 'DNN Broadcast'} — ${broadcast.broadcast_date || ''}`,
        variables,
        test: false,
      };

      const presenterLabel = broadcast.format === 'tag_team' ? 'Tag-team (Charlie + Bob)' : 'Solo (Charlie)';

      console.log(`[TEMPLATE RENDER] Firing template render for broadcast ${broadcast.id} | template: ${layout.templateId} | presenter: ${presenterLabel} | variables: ${variableCount}`);

      const res = await fetch(`${HEYGEN_TEMPLATE_API}/${layout.templateId}/generate`, {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen template render failed', details: data }, { status: 502 });
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
        message: `Template render submitted — ${presenterLabel} | ${variableCount} variables injected`,
        broadcastId: broadcast.id,
        heygenId: videoId,
        templateId: layout.templateId,
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
          console.log(`[TEMPLATE RENDER] Downloading from HeyGen: ${heygenUrl.substring(0, 80)}...`);
          const videoRes = await fetch(heygenUrl);
          const videoBlob = await videoRes.blob();

          // Upload to Base44 permanent storage
          const file = new File([videoBlob], `dnn_broadcast_${broadcast.broadcast_date}.mp4`, { type: 'video/mp4' });
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          const permanentUrl = uploadRes.file_url;
          console.log(`[TEMPLATE RENDER] Uploaded to permanent storage: ${permanentUrl}`);

          await Broadcasts.update(broadcast.id, {
            videoUrl: permanentUrl,
            status: 'completed',
            needsReRender: false,
            errorMessage: '',
          });

          results.push({ id: broadcast.id, status: 'completed', videoUrl: permanentUrl });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || JSON.stringify(data?.data?.error) || 'HeyGen render failed';
          console.log(`[TEMPLATE RENDER] FAILED — Error: ${errMsg}`);
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