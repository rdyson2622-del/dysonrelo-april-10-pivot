import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * realEstateQARender — renders the Real Estate Answers Q&A clips.
 *
 * Charlie (avatar) asks each question; Bob Dyson (talking photo, black shirt,
 * cloned voice "Bob 1") answers. Plus a Charlie page intro and a Charlie outro.
 *
 * Actions (POST body):
 *   { action: "seed" }                       → create clip records with scripts
 *   { action: "startAll" }                   → kick off all pending HeyGen renders
 *   { action: "checkAll" }                   → poll all rendering clips, store completed videos
 *   { action: "start",  clipId, role }       → start one clip (role: "charlie" | "bob")
 *   { action: "check",  clipId, role }       → poll one clip
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
    charlieScript: "Ever wondered what really makes a relocation company different from a regular real estate agent? You're in the right place. This page answers the six questions we hear most often. And here's the best part — you won't be getting the answers from me. Bob Dyson himself, with over fifty-five years in real estate, answers every single one. Just tap any question below, and Bob will give it to you straight.",
  },
  {
    kind: 'qa', faqIndex: 0,
    question: "What's the difference between a relocation manager and a standard real estate agent?",
    charlieScript: "Bob, here's the big one. What's the difference between a relocation manager and a standard real estate agent?",
    bobScript: "A standard agent helps you buy or sell in their local market. A relocation manager coordinates your entire move — selling your current home, finding the right agent in your destination city, managing escrow timelines across two markets at the same time, plus utilities, schools, and logistics. We're the quarterback. The agents work for us, on your behalf.",
  },
  {
    kind: 'qa', faqIndex: 1,
    question: "How does Dyson & Dyson handle a complex move involving two states?",
    charlieScript: "Bob, how does Dyson and Dyson handle a complex move involving two states?",
    bobScript: "We assign you a dedicated relocation manager who stays embedded in every transaction. We interview and select the best agents in both your origin and destination markets, we monitor both escrows daily, and we coordinate the timing — so you're not carrying two mortgages, or stuck in a hotel for weeks.",
  },
  {
    kind: 'qa', faqIndex: 2,
    question: "Is there really no cost to me as the buyer?",
    charlieScript: "Bob, people ask this one all the time. Is there really no cost to the buyer?",
    bobScript: "That's correct — our service is completely free to homebuyers and relocating families. We're funded through referral agreements with the agents and brokers we recommend. And that's one hundred percent compliant with California D-R-E regulations.",
  },
  {
    kind: 'qa', faqIndex: 3,
    question: "What if my deal is stuck or something is going wrong in escrow?",
    charlieScript: "Bob, what if someone's deal is stuck, or something is going wrong in escrow?",
    bobScript: "That's exactly what our Solve My Story tool is for. Describe your situation, and a senior member of my team will review it personally. We specialize in rescuing transactions that are at risk of falling through.",
  },
  {
    kind: 'qa', faqIndex: 4,
    question: "How quickly can Dyson & Dyson start working my case?",
    charlieScript: "Bob, how quickly can Dyson and Dyson start working a case?",
    bobScript: "Immediately. Complete the relocation intake, or talk to Charlie right now. Once we have your contact information and your destination, we begin the agent search within twenty-four hours.",
  },
  {
    kind: 'qa', faqIndex: 5,
    question: "What cities does Dyson & Dyson cover?",
    charlieScript: "Bob, last one. What cities does Dyson and Dyson cover?",
    bobScript: "We operate nationally. Our private referral network spans dozens of destination markets. If you're moving anywhere in the United States, we have vetted agents there — or we'll find the best ones, specifically for your move.",
  },
  {
    kind: 'outro',
    charlieScript: "For answers to any other real estate question, just make your request. We'll either answer it immediately, or after a short search. Go ahead — ask away.",
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
    const Clips = base44.asServiceRole.entities.RealEstateQAClip;

    const startRender = async (clip, role) => {
      const script = role === 'bob' ? clip.bobScript : clip.charlieScript;
      if (!script) return { skipped: true };
      const character = role === 'bob'
        ? { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID }
        : { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' };
      const voiceId = role === 'bob' ? BOB_VOICE_ID : CHARLIE_VOICE_ID;

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character,
            voice: { type: 'text', voice_id: voiceId, input_text: script },
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
        const file = new File([buf], `reqa_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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
            results.push({ clipId: clip.id, kind: clip.kind, faqIndex: clip.faqIndex, role, ...r });
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
            results.push({ clipId: clip.id, kind: clip.kind, faqIndex: clip.faqIndex, role, ...r });
          }
        }
      }
      return Response.json({ success: true, checked: results });
    }

    if (action === 'start' || action === 'check') {
      const { clipId, role } = body;
      if (!clipId || !['charlie', 'bob'].includes(role)) {
        return Response.json({ error: 'clipId and role ("charlie"|"bob") required' }, { status: 400 });
      }
      const arr = await Clips.filter({ id: clipId });
      const clip = arr?.[0];
      if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });
      const r = action === 'start' ? await startRender(clip, role) : await checkRender(clip, role);
      return Response.json({ success: !r.error, ...r });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});