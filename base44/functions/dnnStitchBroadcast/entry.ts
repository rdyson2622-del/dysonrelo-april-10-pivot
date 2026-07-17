import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — "The Dyson Studio Composite" framework.
 *
 * Generates the entire 3-minute broadcast as a single, multi-scene MP4
 * directly from HeyGen's native /v2/video/generate API.
 *
 * Layout (native HeyGen positioning):
 *   - Studio backdrop fills the full frame (background type: 'image').
 *   - Charlie (avatar, 55% scale, bottom-left offset) and Bob (talking photo,
 *     55% scale, bottom-right offset) are positioned natively via HeyGen's
 *     scale/offset parameters.
 *   - When the script transitions to Bob's solution segments, a composed
 *     background image (studio backdrop + white-bordered Solution Panel with
 *     bullet points) is used as the scene background so the panel appears
 *     inside the studio screen area.
 *   - All scenes are passed as video_inputs in a single HeyGen API call,
 *     producing one multi-scene MP4.
 *
 * Actions (POST body):
 *   { action: "start", broadcastId?: "...", force?: true }
 *     → Generates the full multi-scene video via HeyGen.
 *
 *   { action: "check" }
 *     → Polls HeyGen for render completion. Downloads and stores the MP4.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */

// ── PHONETIC DOMAIN NORMALIZATION (SPOKEN AUDIO ONLY) ──
// Visual scripts keep "1DNN.COM"; only the spoken input_text sent to HeyGen
// TTS is rewritten so the engine pronounces each letter distinctly.
// "One D N N dot com" — spaces between D, N, N force letter-by-letter speech.
// This NEVER touches "Bob Dyson" (the person) — only domain references.
function phoneticSpoken(text) {
  if (!text) return text;
  return text
    // 1DNN.COM — already correct brand, just phoneticize
    .replace(/1\s*d\s*n\s*n\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/1\s*d\s*n\s*n\s+dot\s+com/gi, 'One D N N dot com')
    // Legacy "Dyson & Dyson .com" domain variants → 1DNN.COM
    .replace(/dyson\s*\/\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*&\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*and\s*dyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dysonanddyson\s*\.\s*com/gi, 'One D N N dot com')
    .replace(/dyson\s*\/\s*dyson\s+dot\s+com/gi, 'One D N N dot com')
    .replace(/dyson\s*and\s*dyson\s+dot\s+com/gi, 'One D N N dot com')
    // Standalone legacy domain "dyson.com" / "dyson dot com" → 1DNN.COM
    .replace(/\bdyson\s*\.\s*com\b/gi, 'One D N N dot com')
    .replace(/\bdyson\s+dot\s+com\b/gi, 'One D N N dot com');
}

const HEYGEN_API = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_API = 'https://api.heygen.com/v1/video_status.get';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

// Presenter positions — 55% scale, locked to bottom-left and bottom-right
const CHARLIE_POS = { scale: 0.55, offset: { x: -0.25, y: 0.2 } };
const BOB_POS     = { scale: 0.55, offset: { x:  0.25, y: 0.2 } };

/**
 * Extract concise bullet points from Bob's script using the LLM.
 * Falls back to sentence splitting if the LLM call fails.
 */
async function extractBullets(script, base44) {
  if (!script || script.trim().length === 0) return [];

  try {
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are extracting key solution bullet points from a DNN broadcast script segment spoken by Bob Dyson (a 55-year real estate veteran).

Extract 3-4 concise, punchy bullet points that capture the SOLUTION Bob is offering viewers. Each bullet should be a short action-oriented point (max 12 words). Do not include filler words or intros — just the core solution points.

BRAND NAMING RULE (critical): The corporate web address is "1DNN.COM" — NEVER use the legacy "Dyson" or "Dyson.com" domain naming convention in any output. If the source script mentions the old domain, normalize it to "1DNN.COM" in your bullet points.

Return ONLY the bullet points as a JSON array of strings. Each string should NOT start with "•" — just the text.

Script:
${script}`,
      response_json_schema: {
        type: 'object',
        properties: {
          bullets: { type: 'array', items: { type: 'string' } }
        },
        required: ['bullets']
      }
    });
    const bullets = (result.bullets || []).filter(b => b && b.trim().length > 0).slice(0, 4);
    if (bullets.length > 0) return bullets;
  } catch (e) {
    console.log(`LLM bullet extraction failed, falling back to sentence split: ${e.message}`);
  }

  const sentences = script.split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 120);
  return sentences.slice(0, 4);
}

/**
 * Compose a background image for Bob's solution segments.
 * Uses the studio backdrop as a reference and overlays a white-bordered
 * Solution Panel with bullet points in the upper-center screen area.
 * Returns the URL of the generated image.
 */
async function composeSolutionBackground(bullets, base44) {
  const bulletText = bullets.map(b => `• ${b}`).join('\n');

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `A professional news broadcast studio backdrop image. In the upper-center area of the image, there is a white-bordered panel with a gold (#D4AF37) border and rounded corners, positioned to look like it fits inside a display screen. Inside the panel, at the top, there is a gold title bar with white text that reads "THE DYSON SOLUTION". Below the title, there are the following bullet points in dark text:\n${bulletText}\n\nThe panel should be clean and professional, with a subtle drop shadow. The rest of the image is the dark studio backdrop.`,
    existing_image_urls: [STUDIO_BG_URL],
  });

  return result.url;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Auth: admin session or M2M pipeline secret
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

    // ── START: generate the full multi-scene video via HeyGen ──
    if (action === 'start') {
      const broadcastId = body.broadcastId;
      let broadcast;

      if (broadcastId) {
        const arr = await Broadcasts.filter({ id: broadcastId });
        broadcast = arr?.[0];
      } else {
        const completed = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 20);
        broadcast = completed.find(b => b.clips?.length > 0 && !b.videoUrl);
      }

      if (!broadcast) {
        return Response.json({ error: 'No completed broadcast found' }, { status: 404 });
      }

      if (body.force && (broadcast.videoUrl || broadcast.heygenId)) {
        await Broadcasts.update(broadcast.id, { videoUrl: '', heygenId: '', errorMessage: '' });
        broadcast.videoUrl = '';
        broadcast.heygenId = '';
      }

      if (broadcast.videoUrl) {
        return Response.json({ success: true, message: 'Already has composited video', videoUrl: broadcast.videoUrl });
      }

      if (broadcast.heygenId) {
        return Response.json({ success: true, message: 'Render already in progress', heygenId: broadcast.heygenId });
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'No clips' }, { status: 400 });
      }

      // Build video_inputs — one scene per clip, all with the studio backdrop
      const videoInputs = [];
      const panelBackgrounds = []; // track which scenes got solution panels

      for (const clip of clips) {
        const isCharlie = clip.role === 'charlie';
        const pos = isCharlie ? CHARLIE_POS : BOB_POS;

        // Determine the background for this scene
        let bgUrl = STUDIO_BG_URL;
        let hasPanel = false;

        if (!isCharlie) {
          // Bob's solution segment — compose a background with the Solution Panel
          const bullets = await extractBullets(clip.script, base44);
          if (bullets.length > 0) {
            try {
              bgUrl = await composeSolutionBackground(bullets, base44);
              hasPanel = true;
            } catch (e) {
              console.log(`Solution panel composition failed, using studio backdrop: ${e.message}`);
            }
          }
        }

        panelBackgrounds.push(hasPanel);

        // Character — positioned natively via HeyGen scale/offset
        const character = isCharlie
          ? {
              type: 'avatar',
              avatar_id: CHARLIE_AVATAR_ID,
              avatar_style: 'normal',
              scale: pos.scale,
              offset: pos.offset,
            }
          : {
              type: 'talking_photo',
              talking_photo_id: BOB_TALKING_PHOTO_ID,
              scale: pos.scale,
              offset: pos.offset,
            };

        // Voice — volume normalized so Bob matches Charlie's audible level
        const spokenText = phoneticSpoken(clip.script);
        const voice = isCharlie
          ? { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: spokenText, speed: 1.05, volume: 1.0 }
          : { type: 'text', voice_id: BOB_VOICE_ID, input_text: spokenText, emotion: 'Excited', speed: 1.12, volume: 1.4 };

        videoInputs.push({
          character,
          voice,
          background: { type: 'image', url: bgUrl },
        });
      }

      // Submit the entire multi-scene video to HeyGen in a single call
      const res = await fetch(HEYGEN_API, {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: videoInputs,
          dimension: { width: 1280, height: 720 },
        }),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen render failed', details: data }, { status: 502 });
      }

      await Broadcasts.update(broadcast.id, { heygenId: videoId });

      return Response.json({
        success: true,
        message: 'HeyGen multi-scene render started — dual avatars + solution panel over studio backdrop',
        broadcastId: broadcast.id,
        renderId: videoId,
        clipCount: clips.length,
        scenesWithPanel: panelBackgrounds.filter(Boolean).length,
        provider: 'heygen'
      });
    }

    // ── CHECK: poll HeyGen for render status ──
    if (action === 'check') {
      const all = await Broadcasts.filter({ status: 'completed' }, '-broadcast_date', 50);
      const pending = all.filter(b => b.heygenId && !b.videoUrl);

      if (pending.length === 0) {
        return Response.json({ success: true, message: 'No pending renders', pending: 0 });
      }

      const results = [];
      for (const broadcast of pending) {
        const res = await fetch(
          `${HEYGEN_STATUS_API}?video_id=${encodeURIComponent(broadcast.heygenId)}`,
          { headers: { 'X-Api-Key': heygenKey } }
        );
        const data = await res.json();
        const status = data?.data?.status;

        if (status === 'completed') {
          const videoUrl = data?.data?.video_url;
          if (!videoUrl) {
            results.push({ id: broadcast.id, status: 'no_url' });
            continue;
          }

          const vidRes = await fetch(videoUrl);
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_stitched.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url });

          // Create VideoLibrary entry
          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.`,
            category: 'broadcast',
            source_type: 'upload',
            file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date,
            duration_seconds: data?.data?.duration || null,
            tags: ['DNN', 'broadcast', 'real_estate', 'relocation'],
            is_active: true,
          };
          if (existingLib && existingLib.length > 0) {
            await base44.asServiceRole.entities.VideoLibrary.update(existingLib[0].id, libData);
          } else {
            await base44.asServiceRole.entities.VideoLibrary.create(libData);
          }

          results.push({
            id: broadcast.id,
            date: broadcast.broadcast_date,
            status: 'stitched',
            videoUrl: up.file_url,
            libraryEntry: libTitle,
            provider: 'heygen'
          });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || 'HeyGen render failed';
          await Broadcasts.update(broadcast.id, { heygenId: '', errorMessage: errMsg });
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