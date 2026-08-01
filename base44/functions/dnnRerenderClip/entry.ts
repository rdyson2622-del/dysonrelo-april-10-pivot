import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnRerenderClip
 *
 * Re-renders a SINGLE DnnNewsClip (one role: charlie or bob) via HeyGen — used to
 * repair a clip that came back broken (e.g. silent video) without paying to
 * re-render all three clips. After re-submitting, it resets the parent article
 * to 'rendering' so dnnVideoPoller re-composites the final broadcast once the
 * new clip finishes.
 *
 * Body: { clipId: string, role: "charlie" | "bob" }
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const HEYGEN_API = 'https://api.heygen.com';

function clean(s) {
  return (s || '')
    .replace(/[*_#`]/g, '')
    .replace(/[\u2014\u2013]/g, ', ')   // em-dash / en-dash → comma (HeyGen TTS goes silent on dashes)
    .replace(/\u2026/g, '. ')          // ellipsis → period
    .replace(/[\u201c\u201d]/g, '"')   // smart double quotes
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u2022\u25CF\u00B7]/g, '') // bullet / middot
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { clipId, role } = body;
    if (!clipId || !['charlie', 'bob'].includes(role)) {
      return Response.json({ error: 'clipId and role (charlie|bob) are required' }, { status: 400 });
    }

    const clip = await base44.asServiceRole.entities.DnnNewsClip.get(clipId);
    if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });

    const rawScript = role === 'charlie' ? clip.charlieScript : clip.bobScript;
    if (!rawScript || !rawScript.trim()) {
      return Response.json({ error: `No ${role} script on this clip` }, { status: 400 });
    }
    const script = clean(rawScript);

    let videoId = null;
    if (role === 'charlie') {
      const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
        method: 'POST',
        headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script, speed: 1.05 },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      videoId = data?.data?.video_id || null;
    } else {
      const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
        method: 'POST',
        headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: script, emotion: 'Excited', speed: 1.12 },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      videoId = data?.data?.video_id || null;
    }

    if (!videoId) {
      return Response.json({ error: 'HeyGen render failed to start' }, { status: 502 });
    }

    // Reset this clip to rendering; clear the old (broken) URL.
    const clipUpdates = {
      [`${role}HeygenId`]: videoId,
      [`${role}Status`]: 'rendering',
      [`${role}VideoUrl`]: null,
      errorMessage: null,
    };
    await base44.asServiceRole.entities.DnnNewsClip.update(clipId, clipUpdates);

    // Reset the parent article so the poller re-composites once the new clip lands.
    if (clip.article_id) {
      await base44.asServiceRole.entities.DnnArticle.update(clip.article_id, {
        production_status: 'rendering',
        video_url: null,
        heygen_video_id: null,
        last_render_error: null,
      });
    }

    return Response.json({
      success: true,
      clipId,
      role,
      heygenId: videoId,
      articleId: clip.article_id || null,
      message: 'Clip re-submitted to HeyGen. Poller will composite the final MP4 once it completes.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}