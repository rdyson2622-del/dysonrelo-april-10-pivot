import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * explainerRender — renders Charlie clips for the Explainers (1927 Talkies) page.
 *
 * Actions (POST body):
 *   { action: "seed" }      → create clip records with scripts
 *   { action: "startAll" }  → kick off pending HeyGen renders
 *   { action: "checkAll" }  → poll rendering clips, store completed videos
 *
 * Auth: admin session.
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

const SEED = [
  {
    kind: 'intro',
    faqIndex: 0,
    question: 'The talkies parallel — part 1',
    charlieScript: "There's a massive similarity between what happened in the 1920s when silent movies became talkies — and what's happening right now with the internet moving through the three planned phases of artificial intelligence. When synchronized sound first arrived in film, it was thrilling and terrifying all at once. The rules hadn't been written yet. Nobody knew what this new technology would become. Sound changes everything — and the whole world had to reimagine what a movie could be.",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: 'The talkies parallel — part 2',
    charlieScript: "That's exactly where we are today with AI. We're watching the internet transform in real time — moving through its own three phases of artificial intelligence — and just like the talkies, it's an exciting venture and also a scary one, because the rules are not yet written. But here's what I can tell you: for now, AI is our new tool. And voice-to-voice is the part that lets you sit on your hands in the future and enjoy and embrace your new life tools. You don't have to type. You don't have to search. You just talk — and I listen, and I respond.",
  },
  {
    kind: 'outro',
    faqIndex: 2,
    question: 'The talkies parallel — part 3',
    charlieScript: "I'm Charlie — and I couldn't even talk in the 1920s. Now here I am, speaking with you directly, guiding you through real estate, home ownership, and everything in between. Like any new technology, I might stumble a few times along the way. But that's the journey — the same journey audiences took when they first heard actors speak on screen. So watch us, join us, and add other subscribers to broaden our networks on this fun new road we're all traveling together. Welcome to the talkies — round two.",
  },
];

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
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { action } = body || {};
    const Clips = base44.asServiceRole.entities.ExplainerClip;

    const startRender = async (clip) => {
      const script = clip.charlieScript;
      if (!script) return { skipped: true };
      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Clips.update(clip.id, { charlieStatus: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Clips.update(clip.id, { charlieHeygenId: videoId, charlieStatus: 'rendering' });
      return { videoId };
    };

    const checkRender = async (clip) => {
      const videoId = clip.charlieHeygenId;
      if (!videoId) return { skipped: true };
      const res = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
        { headers: { 'X-Api-Key': heygenKey } }
      );
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const vidRes = await fetch(data?.data?.video_url);
        if (!vidRes.ok) return { error: 'download failed' };
        const buf = await vidRes.arrayBuffer();
        const file = new File([buf], `explainer_${clip.id}_charlie.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Clips.update(clip.id, { charlieVideoUrl: up.file_url, charlieStatus: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await Clips.update(clip.id, { charlieStatus: 'failed', errorMessage: errMsg });
        return { status: 'failed', error: errMsg };
      }
      return { status: status || 'processing' };
    };

    if (action === 'seed') {
      const existing = await Clips.list();
      if (existing.length > 0) {
        return Response.json({ success: true, message: 'Already seeded', count: existing.length });
      }
      const created = await Clips.bulkCreate(SEED);
      return Response.json({ success: true, created: created.length });
    }

    if (action === 'startAll') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.charlieScript && clip.charlieStatus !== 'completed' && clip.charlieStatus !== 'rendering') {
          const r = await startRender(clip);
          results.push({ clipId: clip.id, kind: clip.kind, ...r });
        }
      }
      return Response.json({ success: true, started: results });
    }

    if (action === 'checkAll') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.charlieStatus === 'rendering') {
          const r = await checkRender(clip);
          results.push({ clipId: clip.id, kind: clip.kind, ...r });
        }
      }
      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});