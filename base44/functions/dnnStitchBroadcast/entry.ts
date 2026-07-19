import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — HEYGEN TEMPLATE API EDITION
 *
 * Fires ONE authenticated POST to the HeyGen Template generation endpoint,
 * passing the daily dual-host dialogue as text variables into a static
 * Master Template. The template locks all visual layout (studio background,
 * dual-avatar framing, lower thirds) in HeyGen. No raw avatar clips.
 * No stitching. One API call → one fully compiled master MP4.
 *
 * Script parsing:
 *   The broadcast.script is parsed for speaker turns. Lines prefixed with
 *   "Charlie:" or "Bob:" (case-insensitive) are mapped to:
 *     speaker_1_line_1, speaker_2_line_1, speaker_1_line_2, ...
 *   If no speaker markers are found, the entire script goes into
 *   speaker_1_line_1 (backward compatible with single-host monologues).
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

// ── LOAD MASTER LAYOUT ──
async function loadMasterLayout(base44) {
  try {
    const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
    const t = templates?.[0];
    if (t && (t.status === 'approved' || t.status === 'synced_to_heygen')) {
      return {
        heygenTemplateId: t.heygen_template_id || '',
        templateName: t.template_name,
        videoDims: t.video_dimensions || { width: 1280, height: 720 },
      };
    }
  } catch (e) {
    console.log(`Master layout load failed, using fallback: ${e.message}`);
  }
  return {
    heygenTemplateId: '',
    templateName: 'DNN Master Base Layout (fallback)',
    videoDims: { width: 1280, height: 720 },
  };
}

// ── SCRIPT-TO-VARIABLE PARSER ──
// Parses a dual-host script into speaker turn variables.
// Returns a variables object keyed by speaker_1_line_N / speaker_2_line_N.
function parseScriptToVariables(script) {
  if (!script) return {};

  const variables = {};
  let speaker1Count = 0;
  let speaker2Count = 0;
  let currentSpeaker = null;
  let currentText = '';

  const lines = script.split('\n');

  const flush = () => {
    const text = phoneticSpoken(currentText.trim());
    if (!text) return;
    if (currentSpeaker === 'charlie') {
      speaker1Count++;
      const key = `speaker_1_line_${speaker1Count}`;
      variables[key] = { name: key, type: 'text', properties: { content: text } };
    } else if (currentSpeaker === 'bob') {
      speaker2Count++;
      const key = `speaker_2_line_${speaker2Count}`;
      variables[key] = { name: key, type: 'text', properties: { content: text } };
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const charlieMatch = trimmed.match(/^(?:Charlie|Speaker 1|CHARLIE)\s*:\s*(.*)/i);
    const bobMatch = trimmed.match(/^(?:Bob|Speaker 2|BOB)\s*:\s*(.*)/i);

    if (charlieMatch) {
      flush();
      currentSpeaker = 'charlie';
      currentText = charlieMatch[1];
    } else if (bobMatch) {
      flush();
      currentSpeaker = 'bob';
      currentText = bobMatch[1];
    } else if (currentSpeaker) {
      currentText += ' ' + trimmed;
    }
  }
  flush();

  // Fallback: no speaker markers found — put entire script in speaker_1_line_1
  if (Object.keys(variables).length === 0) {
    const fullText = phoneticSpoken(script.trim());
    variables['speaker_1_line_1'] = {
      name: 'speaker_1_line_1',
      type: 'text',
      properties: { content: fullText },
    };
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

    // ── START: Single Template API call ──
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
      if (!layout.heygenTemplateId) {
        return Response.json({
          error: 'No heygen_template_id configured on the master LayoutTemplate. Set it in Admin → Layout Library.',
        }, { status: 400 });
      }

      // Parse the dual-host script into text variables
      const variables = parseScriptToVariables(broadcast.script);
      const varCount = Object.keys(variables).length;

      const payload = {
        variables,
        title: broadcast.show_name || `DNN Broadcast ${broadcast.broadcast_date}`,
        test: false,
      };

      console.log(`[TEMPLATE API] Firing single render for broadcast ${broadcast.id} | ${varCount} text variables | template: ${layout.heygenTemplateId}`);

      const res = await fetch(
        `${HEYGEN_TEMPLATE_API}/${layout.heygenTemplateId}/generate`,
        {
          method: 'POST',
          headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen Template API render failed', details: data }, { status: 502 });
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
        message: 'Template API render submitted — single call, dual-avatar master',
        broadcastId: broadcast.id,
        heygenId: videoId,
        templateId: layout.heygenTemplateId,
        variableCount: varCount,
      });
    }

    // ── CHECK: Poll the template render, download, upload to permanent storage ──
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
          console.log(`[TEMPLATE API] Downloading from HeyGen: ${heygenUrl.substring(0, 80)}...`);
          const videoRes = await fetch(heygenUrl);
          const videoBlob = await videoRes.blob();

          // Upload to Base44 permanent storage
          const file = new File([videoBlob], `dnn_broadcast_${broadcast.broadcast_date}.mp4`, { type: 'video/mp4' });
          const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          const permanentUrl = uploadRes.file_url;
          console.log(`[TEMPLATE API] Uploaded to permanent storage: ${permanentUrl}`);

          await Broadcasts.update(broadcast.id, {
            videoUrl: permanentUrl,
            status: 'completed',
            needsReRender: false,
            errorMessage: '',
          });

          results.push({ id: broadcast.id, status: 'completed', videoUrl: permanentUrl });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || JSON.stringify(data?.data?.error) || 'HeyGen render failed';
          console.log(`[TEMPLATE API] FAILED — Error: ${errMsg}`);
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