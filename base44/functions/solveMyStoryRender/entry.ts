import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * solveMyStoryRender — renders the Solve My Story page duo presentation.
 * Charlie explains the page and introduces Bob; Bob delivers the AI vision message.
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
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

const SEED = [
  {
    kind: 'intro',
    faqIndex: 0,
    question: 'Charlie explains the page',
    charlieScript: "Welcome to Solve My Story — the fastest way to get a real answer to any real estate problem. Here's how it works. First, pick the situation that best describes yours. Then tell us your story in your own words — where you're moving from and to, what's stuck, and what's at stake. Add your contact information, hit submit, and within twenty-four hours a senior member of the Dyson team will respond with a clear, actionable resolution. No sales pitch. No obligation. Just answers backed by fifty-five years of experience. Don't hold back — the more detail you share, the faster we solve it. And now, I'd like you to hear something exciting from the man himself. Here's Bob Dyson, on how our new A I team is changing everything. Bob?",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: "Bob's AI vision message",
    bobScript: "Thanks, Charlie. With our new artificial intelligence tools, we've created twenty-one A I assistants to help our subscribing homeowners, potential homeowners, and relocation clients get the answers, options, solutions, and methods to handle almost every home ownership or relocation issue that arises during these periods of change. It's exciting to watch your needs — and ours — solved in an instant, in many cases. Our A I assistants do all the heavy lifting: the deep research, the logical thinking, and the execution of many of the tasks you face as a homeowner. That has allowed us to stay ahead of most real estate issues in these rapidly changing times. I predict that within the next year, we'll see monumental opportunities to position you in advance of real estate and finance related situations. Today, with the combined assistance of Google Gemini, Grok, Chat G P T, and other powerful new tools, we're positioned to provide you with answers before you even know there's an issue. Our real estate news, delivered to our subscribers every morning at six A M, keeps you up to date — but it also knows your preferences and your profile, and can offer solutions to new situations the moment they're announced. The bottom line: we've moved to the position of providing our clients and affiliates with well-thought-out real estate solutions — and in many cases, we can execute on your decisions for you. This builds on our history of proper planning, performance, and evaluation — and adds the opportunity to execute your plans and objectives for you. We look forward to helping you with all your real estate decisions and opportunities.",
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
    const Clips = base44.asServiceRole.entities.SolveMyStoryClip;

    const startRender = async (clip, role) => {
      const script = role === 'bob' ? clip.bobScript : clip.charlieScript;
      if (!script) return { skipped: true };
      const character = role === 'bob'
        ? { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID }
        : { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' };
      const voiceId = role === 'bob' ? BOB_VOICE_ID : CHARLIE_VOICE_ID;
      const voice = role === 'bob'
        ? { type: 'text', voice_id: voiceId, input_text: script, emotion: 'Excited', speed: 1.12 }
        : { type: 'text', voice_id: voiceId, input_text: script };

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character,
            voice,
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Clips.update(clip.id, { [`${role}Status`]: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Clips.update(clip.id, { [`${role}HeygenId`]: videoId, [`${role}Status`]: 'rendering' });
      return { videoId };
    };

    const checkRender = async (clip, role) => {
      const videoId = clip[`${role}HeygenId`];
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
        const file = new File([buf], `sms_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Clips.update(clip.id, { [`${role}VideoUrl`]: up.file_url, [`${role}Status`]: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await Clips.update(clip.id, { [`${role}Status`]: 'failed', errorMessage: errMsg });
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
        for (const role of ['charlie', 'bob']) {
          const script = role === 'bob' ? clip.bobScript : clip.charlieScript;
          const status = clip[`${role}Status`];
          if (script && status !== 'completed' && status !== 'rendering') {
            const r = await startRender(clip, role);
            results.push({ clipId: clip.id, kind: clip.kind, role, ...r });
          }
        }
      }
      return Response.json({ success: true, started: results });
    }

    if (action === 'checkAll') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        for (const role of ['charlie', 'bob']) {
          if (clip[`${role}Status`] === 'rendering') {
            const r = await checkRender(clip, role);
            results.push({ clipId: clip.id, kind: clip.kind, role, ...r });
          }
        }
      }
      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});