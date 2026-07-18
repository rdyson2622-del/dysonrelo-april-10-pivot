import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnStitchBroadcast — "The Dyson Studio Composite" framework.
 *
 * GOLDEN MASTER LAYOUT (matches DnnNewsBroadcastPlayer frontend exactly):
 *   - Studio backdrop (USA map, gold accents) fills the full frame
 *   - Charlie (avatar) visible bottom-left ALWAYS
 *   - Bob (talking photo) visible bottom-right ALWAYS
 *   - Solution Panel (white card, gold border, bullets) upper-center on Bob's segments
 *   - Both presenters visible SIMULTANEOUSLY throughout the entire broadcast
 *
 * How it works:
 *   HeyGen v2 API renders ONE character per scene. To show both presenters
 *   simultaneously, we BAKE the non-speaking presenter into the background image:
 *     - Charlie's scene → background includes Bob's static preview on the right
 *     - Bob's scene → background includes Charlie's static preview on the left
 *   The speaking presenter is then rendered on top via scale/offset.
 *
 * Auth: admin session OR x-pipeline-secret (n8n).
 */

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

const HEYGEN_API = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_API = 'https://api.heygen.com/v1/video_status.get';
const HEYGEN_AVATAR_API = 'https://api.heygen.com/v2/avatars';
const HEYGEN_VIDEO_AVATAR_API = 'https://api.heygen.com/v2/video_avatar/list';
const HEYGEN_AVATAR_V1_API = 'https://api.heygen.com/v1/avatar.list';
const HEYGEN_TALKING_PHOTO_API = 'https://api.heygen.com/v1/talking_photo.list';

const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

// ── LOAD MASTER LAYOUT ──
async function loadMasterLayout(base44) {
  try {
    const templates = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
    const t = templates?.[0];
    if (t && t.status === 'approved') {
      return {
        studioBgUrl: t.background?.url || 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png',
        charlieAvatarId: t.presenter_1?.heygen_id || '41f40b894f6944188c7908253b12e921',
        charlieVoiceId: t.presenter_1?.voice_id || 'cc5fb6c924064712ba9f690852aa4646',
        bobPhotoId: t.presenter_2?.heygen_id || '31b79a86784e495090472af2e7b9407c',
        bobVoiceId: t.presenter_2?.voice_id || '147b8f5713024fb9afc106f266e47482',
        charliePos: {
          scale: t.presenter_1?.scale || 0.55,
          offset: { x: t.presenter_1?.offset_x ?? -0.25, y: t.presenter_1?.offset_y ?? 0.2 }
        },
        bobPos: {
          scale: t.presenter_2?.scale || 0.55,
          offset: { x: t.presenter_2?.offset_x ?? 0.25, y: t.presenter_2?.offset_y ?? 0.2 }
        },
        solutionPanel: t.solution_panel || null,
        videoDims: t.video_dimensions || { width: 1280, height: 720 },
        templateName: t.template_name,
      };
    }
  } catch (e) {
    console.log(`Master layout load failed, using hardcoded fallback: ${e.message}`);
  }
  return {
    studioBgUrl: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png',
    charlieAvatarId: '41f40b894f6944188c7908253b12e921',
    charlieVoiceId: 'cc5fb6c924064712ba9f690852aa4646',
    bobPhotoId: '31b79a86784e495090472af2e7b9407c',
    bobVoiceId: '147b8f5713024fb9afc106f266e47482',
    charliePos: { scale: 0.55, offset: { x: -0.25, y: 0.2 } },
    bobPos: { scale: 0.55, offset: { x: 0.25, y: 0.2 } },
    solutionPanel: null,
    videoDims: { width: 1280, height: 720 },
    templateName: 'DNN Master Base Layout (fallback)',
  };
}

// ── FETCH AVATAR PREVIEW IMAGE ──
// Gets the static preview image URL for a HeyGen avatar or talking photo.
// Handles multiple response structures from HeyGen's API.
async function getAvatarPreviewUrl(heygenKey, avatarId, isTalkingPhoto) {
  try {
    if (isTalkingPhoto) {
      // Talking photos may be in /v2/avatar response (data.talking_photos) or /v1/talking_photo.list
      const res = await fetch(HEYGEN_TALKING_PHOTO_API, {
        headers: { 'X-Api-Key': heygenKey }
      });
      const json = await res.json();
      // Try multiple response shapes
      const photos = json?.data?.talking_photos || json?.data || [];
      const list = Array.isArray(photos) ? photos : [];
      const photo = list.find(p => p.talking_photo_id === avatarId || p.id === avatarId);
      const url = photo?.preview_image_url || photo?.image_url || photo?.photo || null;
      console.log(`[TALKING_PHOTO] Found ${list.length} photos, match for ${avatarId}: ${url ? 'YES' : 'NO'}`);
      return url;
    } else {
      // Try v2 API first — avatars can be in data.avatars, data.photo_avatars, or nested in data.groups
      const res = await fetch(HEYGEN_AVATAR_API, {
        headers: { 'X-Api-Key': heygenKey }
      });
      const json = await res.json();
      const flatAvatars = json?.data?.avatars || [];
      const photoAvatars = json?.data?.photo_avatars || [];
      const groupAvatars = (json?.data?.groups || []).flatMap(g => g.avatars || []);
      const talkingPhotos = json?.data?.talking_photos || [];
      const allAvatars = [...flatAvatars, ...photoAvatars, ...groupAvatars, ...talkingPhotos];
      let avatar = allAvatars.find(a => a.avatar_id === avatarId || a.id === avatarId);
      let url = avatar?.preview_image_url || avatar?.preview || avatar?.image_url || null;
      console.log(`[AVATAR v2] ${flatAvatars.length} studio + ${photoAvatars.length} photo + ${groupAvatars.length} grouped + ${talkingPhotos.length} talking = ${allAvatars.length} total, match: ${url ? 'YES' : 'NO'}`);

      return url;
    }
  } catch (e) {
    console.log(`Failed to fetch avatar preview for ${avatarId}: ${e.message}`);
    return null;
  }
}

// ── EXTRACT BULLETS ──
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
        properties: { bullets: { type: 'array', items: { type: 'string' } } },
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

// ── COMPOSE BOB'S SCENE BACKGROUND ──
// Studio backdrop + Charlie's static image (bottom-left) + Solution Panel (upper-center)
// Bob's talking photo will be rendered on top (bottom-right) by HeyGen.
async function composeBobSceneBackground(bullets, title, base44, studioBgUrl, charliePreviewUrl) {
  const bulletText = bullets.map(b => `• ${b}`).join('\n');
  const panelTitle = title || 'THE DYSON SOLUTION';

  const existingImages = [studioBgUrl];
  if (charliePreviewUrl) existingImages.push(charliePreviewUrl);

  const charlieDesc = charliePreviewUrl
    ? `In the BOTTOM-LEFT area of the image, place a vertical portrait-style card (about 15% of frame width, 3:4 aspect ratio) with a thin gold border (#D4AF37, 2px) and rounded corners. Inside this card, show Charlie — a professional man sitting at a news desk with a laptop. The card should be positioned about 24px from the bottom and 32px from the left edge.`
    : '';

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `A professional news broadcast studio backdrop image (1280x720, dark studio set). The studio has a large central screen showing a stylized map of the USA with glowing gold connections between major cities (NYC, Chicago, LA), with "DNN REAL ESTATE NEWS" in bold gold text at the top of the screen. The studio features tiered levels, gold vertical accent lighting, and polished reflective floors.

${charlieDesc}

In the UPPER-CENTER area of the image (starting about 8% from the top, centered horizontally), place a clean white panel (#ffffff background) with a thin gold border (#D4AF37, 2px), rounded corners (14px radius), and a subtle drop shadow. The panel occupies roughly the center 50% of the width and is vertically positioned in the upper half.

INSIDE THE PANEL — everything is CENTERED:
- At the top of the panel, a title in dark charcoal text (#1a1a1a), serif font, bold, reading: "${panelTitle}"
- Below the title, the following bullet points, each on its own line, in dark text (#2a2a2a), with a small gold dot (•) before each point, all centered:
${bulletText}

The bottom-right area should be empty dark studio floor (Bob's video will be rendered there by the video engine). Do NOT add any other text or elements.`,
    existing_image_urls: existingImages,
  });

  return result.url;
}

// ── COMPOSE CHARLIE'S SCENE BACKGROUND ──
// Studio backdrop + Bob's static image (bottom-right)
// Charlie's avatar will be rendered on top (bottom-left) by HeyGen.
async function composeCharlieSceneBackground(base44, studioBgUrl, bobPreviewUrl) {
  if (!bobPreviewUrl) return studioBgUrl;

  const result = await base44.asServiceRole.integrations.Core.GenerateImage({
    prompt: `A professional news broadcast studio backdrop image (1280x720, dark studio set). The studio has a large central screen showing a stylized map of the USA with glowing gold connections between major cities (NYC, Chicago, LA), with "DNN REAL ESTATE NEWS" in bold gold text at the top of the screen. The studio features tiered levels, gold vertical accent lighting, and polished reflective floors.

In the BOTTOM-RIGHT area of the image, place a vertical portrait-style card (about 15% of frame width, 3:4 aspect ratio) with a thin gold border (#D4AF37, 2px) and rounded corners. Inside this card, show Bob Dyson — a distinguished older man (55-year real estate veteran) against a light background with palm trees. The card should be positioned about 24px from the bottom and 32px from the right edge.

The bottom-left area should be empty dark studio floor (Charlie's video will be rendered there by the video engine). Do NOT add any other text or elements.`,
    existing_image_urls: [studioBgUrl, bobPreviewUrl],
  });

  return result.url;
}

// ── COMPUTE LAYOUT HASH ──
async function computeLayoutHash(broadcast, layout) {
  const clips = (broadcast.clips || []).map(c => ({
    role: c.role || '',
    script: c.script || '',
    question: c.question || '',
  }));
  const content = {
    clips,
    format: broadcast.format || 'solo',
    script: broadcast.script || '',
    studioBg: layout.studioBgUrl,
    charlieAvatar: layout.charlieAvatarId,
    charlieVoice: layout.charlieVoiceId,
    bobPhoto: layout.bobPhotoId,
    bobVoice: layout.bobVoiceId,
    charliePos: layout.charliePos,
    bobPos: layout.bobPos,
  };
  const serialized = JSON.stringify(content);
  const data = new TextEncoder().encode(serialized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'hash_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    // ── START ──
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

      const layout = await loadMasterLayout(base44);
      const layoutHash = await computeLayoutHash(broadcast, layout);

      if (!body.force) {
        if (broadcast.videoUrl && broadcast.layoutHash === layoutHash) {
          return Response.json({ success: true, message: 'Cached video (hash match)', videoUrl: broadcast.videoUrl, cached: true });
        }
        const allWithHash = await Broadcasts.filter({ layoutHash }, '-broadcast_date', 50);
        const cached = allWithHash.find(b => b.videoUrl && b.id !== broadcast.id);
        if (cached) {
          await Broadcasts.update(broadcast.id, { videoUrl: cached.videoUrl, layoutHash, needsReRender: false });
          return Response.json({ success: true, message: 'Served cached render from matching hash', videoUrl: cached.videoUrl, cached: true, sourceBroadcast: cached.id });
        }
        const allBroadcasts = await Broadcasts.filter({}, '-broadcast_date', 50);
        for (const b of allBroadcasts) {
          if (b.id === broadcast.id) continue;
          const histEntry = (b.renderHistory || []).find(h => h.layoutHash === layoutHash && h.videoUrl);
          if (histEntry) {
            await Broadcasts.update(broadcast.id, { videoUrl: histEntry.videoUrl, layoutHash, needsReRender: false });
            return Response.json({ success: true, message: 'Served cached render from historical hash', videoUrl: histEntry.videoUrl, cached: true, sourceBroadcast: b.id });
          }
        }
      }

      if (body.purgeCache) {
        await Broadcasts.update(broadcast.id, {
          videoUrl: '', heygenId: '', layoutHash: '', errorMessage: '',
          renderHistory: [], needsReRender: true,
        });
        broadcast.videoUrl = ''; broadcast.heygenId = ''; broadcast.layoutHash = ''; broadcast.renderHistory = [];
        broadcast.needsReRender = true;
        console.log(`[PURGE] Show ${broadcast.show_number}: cache purged`);
      } else {
        if (broadcast.layoutHash !== layoutHash) {
          await Broadcasts.update(broadcast.id, { layoutHash });
          broadcast.layoutHash = layoutHash;
        }
        if (body.force && (broadcast.videoUrl || broadcast.heygenId)) {
          await Broadcasts.update(broadcast.id, { videoUrl: '', heygenId: '', errorMessage: '' });
          broadcast.videoUrl = ''; broadcast.heygenId = '';
        }
        if (broadcast.videoUrl) {
          return Response.json({ success: true, message: 'Already has composited video', videoUrl: broadcast.videoUrl });
        }
        if (broadcast.heygenId) {
          return Response.json({ success: true, message: 'Render already in progress', heygenId: broadcast.heygenId });
        }
      }

      const clips = broadcast.clips || [];
      if (clips.length === 0) {
        return Response.json({ error: 'No clips' }, { status: 400 });
      }

      // ── FETCH AVATAR PREVIEW IMAGES ──
      // These static images are baked into the background so both presenters
      // are visible simultaneously in the final MP4.
      console.log('[PREVIEW] Fetching avatar preview images for dual-presenter composition...');
      let charliePreviewUrl = await getAvatarPreviewUrl(heygenKey, layout.charlieAvatarId, false);
      const bobPreviewUrl = await getAvatarPreviewUrl(heygenKey, layout.bobPhotoId, true);
      console.log(`[PREVIEW] Charlie preview from API: ${charliePreviewUrl || 'NOT FOUND'}`);
      console.log(`[PREVIEW] Bob preview from API: ${bobPreviewUrl || 'NOT FOUND'}`);

      // Fallback: generate a static Charlie image if the API didn't return one
      if (!charliePreviewUrl) {
        try {
          console.log('[PREVIEW] Generating fallback Charlie static image...');
          const charlieImg = await base44.asServiceRole.integrations.Core.GenerateImage({
            prompt: 'A professional AI news anchor named Charlie — a clean-cut man in a dark suit, sitting at a modern news desk with a laptop, studio lighting. Vertical portrait composition, head and shoulders visible. Dark background. Professional broadcast appearance.',
          });
          charliePreviewUrl = charlieImg.url;
          console.log(`[PREVIEW] Generated Charlie fallback image: ${charliePreviewUrl}`);
        } catch (e) {
          console.log(`[PREVIEW] Charlie fallback generation failed: ${e.message}`);
        }
      }

      // ── BUILD VIDEO INPUTS ──
      const videoInputs = [];
      const panelBackgrounds = [];

      for (const clip of clips) {
        const isCharlie = clip.role === 'charlie';
        const pos = isCharlie ? layout.charliePos : layout.bobPos;

        let bgUrl = layout.studioBgUrl;
        let hasPanel = false;

        if (isCharlie) {
          // Charlie's scene: bake Bob's static image into the background (bottom-right)
          try {
            bgUrl = await composeCharlieSceneBackground(base44, layout.studioBgUrl, bobPreviewUrl);
          } catch (e) {
            console.log(`Charlie scene background composition failed, using plain studio: ${e.message}`);
          }
        } else {
          // Bob's scene: bake Charlie's static image + Solution Panel into the background
          const bullets = await extractBullets(clip.script, base44);
          if (bullets.length > 0) {
            try {
              bgUrl = await composeBobSceneBackground(bullets, clip.question || clip.title, base44, layout.studioBgUrl, charliePreviewUrl);
              hasPanel = true;
            } catch (e) {
              console.log(`Bob scene background composition failed, using studio backdrop: ${e.message}`);
            }
          }
        }

        panelBackgrounds.push(hasPanel);

        const character = isCharlie
          ? {
              type: 'avatar',
              avatar_id: layout.charlieAvatarId,
              avatar_style: 'normal',
              scale: pos.scale,
              offset: pos.offset,
            }
          : {
              type: 'talking_photo',
              talking_photo_id: layout.bobPhotoId,
              scale: pos.scale,
              offset: pos.offset,
            };

        const spokenText = phoneticSpoken(clip.script);
        const voice = isCharlie
          ? { type: 'text', voice_id: layout.charlieVoiceId, input_text: spokenText, speed: 1.05, volume: 1.0 }
          : { type: 'text', voice_id: layout.bobVoiceId, input_text: spokenText, emotion: 'Excited', speed: 1.12, volume: 1.0 };

        videoInputs.push({ character, voice, background: { type: 'image', url: bgUrl } });
      }

      // ── PAYLOAD AUDIT ──
      const payloadAudit = {
        layoutTemplate: layout.templateName,
        studioBackgroundUrl: layout.studioBgUrl,
        videoDimensions: layout.videoDims,
        charliePreview: charliePreviewUrl || 'NOT_FOUND',
        bobPreview: bobPreviewUrl || 'NOT_FOUND',
        dualPresenterMode: true,
        charlie: { type: 'avatar', avatarId: layout.charlieAvatarId, scale: layout.charliePos.scale, offsetX: layout.charliePos.offset.x, offsetY: layout.charliePos.offset.y },
        bob: { type: 'talking_photo', photoId: layout.bobPhotoId, scale: layout.bobPos.scale, offsetX: layout.bobPos.offset.x, offsetY: layout.bobPos.offset.y },
        scenes: videoInputs.map((vi, i) => ({
          index: i, role: clips[i].role, backgroundUrl: vi.background.url,
          characterType: vi.character.type, characterScale: vi.character.scale,
          hasPanel: panelBackgrounds[i], scriptPreview: (clips[i].script || '').substring(0, 100),
        })),
      };
      console.log(`[AUDIT] Payload being sent to HeyGen:\n${JSON.stringify(payloadAudit, null, 2)}`);

      const res = await fetch(HEYGEN_API, {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_inputs: videoInputs, dimension: layout.videoDims }),
      });

      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        return Response.json({ error: 'HeyGen render failed', details: data, payloadAudit }, { status: 502 });
      }

      if (body.purgeCache) {
        await Broadcasts.update(broadcast.id, { heygenId: videoId, layoutHash, needsReRender: false });
      } else {
        await Broadcasts.update(broadcast.id, { heygenId: videoId });
      }

      return Response.json({
        success: true,
        message: body.purgeCache
          ? 'FRESH render pushed to HeyGen — dual-presenter layout, cache purged'
          : 'HeyGen multi-scene render started — dual-presenter golden master layout',
        broadcastId: broadcast.id,
        renderId: videoId,
        clipCount: clips.length,
        scenesWithPanel: panelBackgrounds.filter(Boolean).length,
        layoutTemplate: layout.templateName,
        layoutHash,
        dualPresenterMode: true,
        charliePreviewFetched: !!charliePreviewUrl,
        bobPreviewFetched: !!bobPreviewUrl,
        payloadAudit,
        provider: 'heygen'
      });
    }

    // ── CHECK ──
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
          if (!videoUrl) { results.push({ id: broadcast.id, status: 'no_url' }); continue; }

          const vidRes = await fetch(videoUrl);
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${broadcast.broadcast_date}_stitched.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });

          const history = broadcast.renderHistory || [];
          const newEntry = { layoutHash: broadcast.layoutHash || '', videoUrl: up.file_url, renderedAt: new Date().toISOString() };
          const filteredHistory = history.filter(h => h.layoutHash !== newEntry.layoutHash);
          await Broadcasts.update(broadcast.id, { videoUrl: up.file_url, needsReRender: false, renderHistory: [...filteredHistory, newEntry] });

          const libTitle = `DNN Broadcast — ${broadcast.broadcast_date}`;
          const existingLib = await base44.asServiceRole.entities.VideoLibrary.filter({ title: libTitle });
          const libData = {
            title: libTitle,
            description: `Full DNN Intelligence Bureau broadcast for ${broadcast.broadcast_date}. Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.`,
            category: 'broadcast', source_type: 'upload', file_url: up.file_url,
            broadcast_date: broadcast.broadcast_date, duration_seconds: data?.data?.duration || null,
            tags: ['DNN', 'broadcast', 'real_estate', 'relocation'], is_active: true,
          };
          if (existingLib && existingLib.length > 0) {
            await base44.asServiceRole.entities.VideoLibrary.update(existingLib[0].id, libData);
          } else {
            await base44.asServiceRole.entities.VideoLibrary.create(libData);
          }

          results.push({ id: broadcast.id, date: broadcast.broadcast_date, status: 'stitched', videoUrl: up.file_url, libraryEntry: libTitle, provider: 'heygen' });
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