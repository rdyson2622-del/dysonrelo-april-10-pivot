import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const studioBackground = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const gold = '#D4AF37';

function extractBulletPoints(script) {
  if (!script) return [];
  const sentences = script.replace(/\n+/g, ' ').match(/[^.!?]+(?:[.!?]+|$)/g) || [script];
  return sentences
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 25 && !/^(so|well|you know|now|okay|great|thanks|absolutely)[,.\s]/i.test(sentence))
    .slice(0, 5)
    .map(sentence => sentence.replace(/[.!?]+$/, ''));
}

function videoFrame(source, side, name, muted = false) {
  const x = side === 'left' ? '19.6%' : '80.4%';
  return [{
    type: 'composition', track: 4, x, y: '80%', width: '39.15%', height: '39.15%',
    fill_color: '#000000', stroke_color: gold, stroke_width: '0.35 vmin', border_radius: '1.2 vmin',
    elements: [{
      name, type: 'video', track: 1, source, width: '100%', height: '100%',
      fit: 'cover', fill_color: '#000000', volume: muted ? '0%' : '100%',
    }],
  }];
}

function charlieScene(clip, index) {
  return {
    type: 'composition', track: 1,
    elements: [
      { type: 'image', track: 1, source: studioBackground, fit: 'cover' },
      ...videoFrame(clip.charlieVideoUrl, 'left', `Charlie-${index}`),
    ],
  };
}

function bobScene(clip, index, charlieSource) {
  const bobName = `Bob-${index}`;
  const bullets = extractBulletPoints(clip.bobScript);
  const bulletText = bullets.map(point => `•  ${point}`).join('\n\n');
  const totalCharacters = bullets.reduce((sum, point) => sum + point.length, 0);
  const bulletFontSize = totalCharacters > 500 ? '5.2 vmin' : totalCharacters > 350 ? '5.8 vmin' : '6.4 vmin';
  const elements = [
    { type: 'image', track: 1, source: studioBackground, fit: 'cover' },
    {
      type: 'composition', track: 2, x: '47.5%', y: '42%', width: '58%', height: '56%',
      fill_color: '#f5f0e8', stroke_color: gold, stroke_width: '0.4 vmin', border_radius: '1.5 vmin',
      elements: [
        {
          type: 'text', track: 1, text: 'DNN INTELLIGENCE BUREAU', x: '50%', y: '8%', width: '86%', height: '7%',
          x_anchor: '50%', y_anchor: '50%', x_alignment: '0%', y_alignment: '50%',
          fill_color: gold, font_family: 'Inter', font_weight: '700', font_size: '1.8 vmin', letter_spacing: '18%',
        },
        {
          type: 'text', track: 1, text: String(clip.question || '').toUpperCase(), x: '50%', y: '22%', width: '86%', height: '18%',
          x_anchor: '50%', y_anchor: '50%', x_alignment: '0%', y_alignment: '50%',
          fill_color: '#1a1a1a', font_family: 'Cormorant Garamond', font_weight: '500', font_size: '3.2 vmin', line_height: '112%', letter_spacing: '8%',
        },
        {
          type: 'text', track: 1, text: bulletText, x: '50%', y: '62%', width: '82%', height: '58%',
          x_anchor: '50%', y_anchor: '50%', x_alignment: '0%', y_alignment: '50%',
          fill_color: '#2a2a2a', font_family: 'Inter', font_weight: '500', font_size: bulletFontSize, line_height: '138%',
        },
      ],
    },
    ...videoFrame(clip.bobVideoUrl, 'right', bobName),
  ];
  if (charlieSource) elements.push(...videoFrame(charlieSource, 'left', `Charlie-Hold-${index}`, true));
  return { type: 'composition', track: 1, elements };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const apiKey = secrets.get('CREATOMATE');
    if (!apiKey) return Response.json({ error: 'CREATOMATE is not configured' }, { status: 500 });
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'start';

    if (action === 'check') {
      if (!body.renderId) return Response.json({ error: 'renderId is required' }, { status: 400 });
      const statusRes = await fetch(`https://api.creatomate.com/v2/renders/${encodeURIComponent(body.renderId)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const render = await statusRes.json();
      if (!statusRes.ok) return Response.json({ error: 'Creatomate status check failed', details: render }, { status: 502 });
      if (render.status !== 'succeeded') return Response.json({ status: render.status, renderId: body.renderId });

      const videoRes = await fetch(render.url);
      if (!videoRes.ok) return Response.json({ error: 'Could not download completed MP4' }, { status: 502 });
      const bytes = await videoRes.arrayBuffer();
      const safeTitle = String(body.headline || 'dnn-news').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
      const file = new File([bytes], `${safeTitle}.mp4`, { type: 'video/mp4' });
      const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });
      const title = `DNN Studio Broadcast — ${body.headline || 'Latest News'}`;
      const existing = await base44.asServiceRole.entities.VideoLibrary.filter({ title }, '-created_date', 1);
      const libraryData = {
        title,
        description: 'Final DNN studio composite prepared for review and social distribution.',
        category: 'broadcast',
        source_type: 'upload',
        file_url: upload.file_url,
        duration_seconds: render.duration || null,
        tags: ['DNN', 'studio', 'LinkedIn', 'Facebook'],
        is_active: true,
        added_by: user.email,
      };
      if (existing.length) await base44.asServiceRole.entities.VideoLibrary.update(existing[0].id, libraryData);
      else await base44.asServiceRole.entities.VideoLibrary.create(libraryData);
      return Response.json({ status: 'succeeded', mp4Url: upload.file_url, creatomateUrl: render.url, duration: render.duration, headline: body.headline });
    }

    const clips = await base44.asServiceRole.entities.DnnNewsClip.list('-created_date', 200);
    const groups = new Map();
    for (const clip of clips) {
      if (!clip.question) continue;
      if (!groups.has(clip.question)) groups.set(clip.question, []);
      groups.get(clip.question).push(clip);
    }
    const requestedHeadline = body.headline;
    let selected = requestedHeadline ? groups.get(requestedHeadline) : null;
    if (!selected) {
      selected = [...groups.values()].find(group => group.every(clip =>
        clip.kind === 'qa' ? Boolean(clip.bobVideoUrl) : Boolean(clip.charlieVideoUrl)
      ));
    }
    if (!selected?.length) return Response.json({ error: 'No complete DNN news broadcast is ready' }, { status: 404 });

    selected.sort((a, b) => (a.faqIndex || 0) - (b.faqIndex || 0));
    const headline = selected[0].question;
    let lastCharlie = selected.find(clip => clip.kind === 'intro' && clip.charlieVideoUrl)?.charlieVideoUrl || null;
    const scenes = [];
    selected.forEach((clip, index) => {
      if (clip.kind === 'qa' && clip.bobVideoUrl) scenes.push(bobScene(clip, index, lastCharlie));
      else if (clip.charlieVideoUrl) {
        scenes.push(charlieScene(clip, index));
        lastCharlie = clip.charlieVideoUrl;
      }
    });
    if (!scenes.length) return Response.json({ error: 'Broadcast has no renderable scenes' }, { status: 400 });

    const createRes = await fetch('https://api.creatomate.com/v2/renders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        output_format: 'mp4', width: 1280, height: 720, frame_rate: 30,
        elements: scenes,
        metadata: JSON.stringify({ type: 'dnn_studio_review', headline }),
      }),
    });
    const created = await createRes.json();
    const render = Array.isArray(created) ? created[0] : created;
    if (!createRes.ok || !render?.id) return Response.json({ error: 'Creatomate render failed to start', details: created }, { status: 502 });
    return Response.json({ status: render.status || 'planned', renderId: render.id, headline, sceneCount: scenes.length, prospectiveUrl: render.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}