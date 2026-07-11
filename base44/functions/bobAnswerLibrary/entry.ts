import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * bobAnswerLibrary — manages the expanded Bob Dyson video answer library
 * used by the Charlie chat box.
 *
 * Actions (POST body):
 *   { action: "seed" }               → create the initial library of Q&A scripts
 *   { action: "startAll" }           → kick off HeyGen renders for all draft/failed clips
 *   { action: "checkAll" }           → poll rendering clips, store completed videos
 *   { action: "start", clipId }      → render one clip
 *   { action: "check", clipId }      → poll one clip
 *
 * Auth: admin session.
 */

const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

const SEED = [
  { question: "Who is Bob Dyson?", answerScript: "I'm Bob Dyson. I've spent over fifty-five years in real estate, and I run this relocation program personally. Every client's first step is a conversation with me — not a form, not a call center. Me." },
  { question: "How do I get started with Dyson & Dyson?", answerScript: "It's simple. The first step is a free, no-obligation conversation with me. No paperwork, no enrollment forms. You tell me your situation, and if we're a fit, my team takes it from there. Call eight five eight, three five three, twelve hundred, or book a session right here on the site." },
  { question: "How do you pick the right agent for me?", answerScript: "We don't hand you a name off a list. We pull production data, we interview top performers in your destination market, and we select the agent whose track record matches your specific move — your price point, your neighborhood, your timeline. And because they work through us, they stay accountable." },
  { question: "Can you help me sell my current home too?", answerScript: "Absolutely. A real relocation has two sides — the sale and the purchase. We coordinate your listing with a vetted agent in your current market, and we time both transactions so you're never carrying two mortgages or stuck without a home." },
  { question: "What is a buyer broker agreement and do I need one?", answerScript: "A buyer broker agreement is the contract that formalizes your relationship with the agent representing you. It spells out what they do for you and how they're compensated. When you work with us, we walk you through it before you sign anything — no surprises." },
  { question: "How does Dyson & Dyson make money if the service is free?", answerScript: "Fair question. When you close on a home with an agent we recommended, that agent pays us a referral fee out of their commission. You never pay a dime, and the fee doesn't come out of your pocket or change your price. It's fully compliant and completely transparent." },
  { question: "Do you help with schools for my kids?", answerScript: "We do. School fit is one of the biggest drivers of where a family should land. We research the districts, help arrange tours, and walk you through enrollment paperwork so your kids are set before you even arrive." },
  { question: "Do you help with movers and moving logistics?", answerScript: "Yes. We build your packing timeline, connect you with vetted movers, and manage the checklist so nothing falls through the cracks. If you've got specialized assets — pianos, horses, a boat, a wine collection — we handle that logistics too." },
  { question: "Do you set up utilities at my new home?", answerScript: "We do. Internet, electric, gas, water — all arranged before you arrive, so the lights are on and the wifi works the day you walk in the door." },
  { question: "Can you help me find doctors in my new city?", answerScript: "Yes. Healthcare setup is part of the concierge service. We help you locate doctors, dentists, and specialists in your new area, so there's no gap in care for you or your family." },
  { question: "What is the 30/60/90 day plan?", answerScript: "It's how we make sure you actually settle in — not just move in. Milestones for your first thirty, sixty, and ninety days: services connected, schools running, community connections made. Moving is day one. Settling in is the real job." },
  { question: "What if I'm not sure where I want to move yet?", answerScript: "That's actually a great place to start. We do city and neighborhood research based on your lifestyle — commute, schools, culture, cost of living. Talk to me before you decide, and we'll narrow it down together." },
  { question: "Can you help me if I'm renting instead of buying?", answerScript: "We can. While our core service is built around home purchases, we guide renters too — neighborhood research, the local rental landscape, and everything on the logistics side of the move." },
  { question: "What makes your agents different from ones I'd find myself?", answerScript: "Accountability. Any agent can look good online. Our agents are selected on verified production data, interviewed by us, and they answer to us throughout your transaction. If anything drifts, we step in. You don't get that finding someone on your own." },
  { question: "What is the Private Referral Network?", answerScript: "The P-R-N is our national network of vetted, top-producing agents. Every member earned their spot on performance — not on paying for placement. When we hand you to a P-R-N agent, you're getting someone we'd trust with our own family's move." },
  { question: "Do you work with seniors or people downsizing?", answerScript: "All the time. Downsizing moves have their own emotional and logistical weight — decades of belongings, timing the sale, finding the right next home. We handle those moves with extra care and extra patience." },
  { question: "Can my employer use your service for employee relocations?", answerScript: "Yes. We work with employers who want their people relocated smoothly without standing up an internal relocation department. Have your HR team reach out to me directly and we'll set up a program." },
  { question: "What is a Gemini Session?", answerScript: "A Gemini Session is a live, three-way conversation — you, our AI assistant, and senior staff — where we dig into your situation in real time. It's the fastest way to get real answers about your specific move. And it's free." },
  { question: "Is my information kept private?", answerScript: "Completely. Your details are used for one purpose — managing your relocation. We don't sell your information, and we don't blast you with marketing. That's a promise I stand behind personally." },
  { question: "What happens after I talk to Bob?", answerScript: "Once we've talked and you're in the program, my team goes to work. Within twenty-four hours we begin the agent search in your destination market, and your dedicated relocation manager builds your plan. From that point on, you've got a team — not just an agent." },
];

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { action } = body || {};
    const Clips = base44.asServiceRole.entities.BobAnswerClip;

    const startRender = async (clip) => {
      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: clip.answerScript, emotion: 'Excited', speed: 1.05 },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Clips.update(clip.id, { status: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Clips.update(clip.id, { heygenId: videoId, status: 'rendering', errorMessage: '' });
      return { videoId };
    };

    const checkRender = async (clip) => {
      if (!clip.heygenId) return { skipped: true };
      const res = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(clip.heygenId)}`,
        { headers: { 'X-Api-Key': heygenKey } }
      );
      const data = await res.json();
      const status = data?.data?.status;

      if (status === 'completed') {
        const vidRes = await fetch(data?.data?.video_url);
        if (!vidRes.ok) return { error: 'download failed' };
        const buf = await vidRes.arrayBuffer();
        const file = new File([buf], `bobanswer_${clip.id}.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Clips.update(clip.id, { videoUrl: up.file_url, status: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await Clips.update(clip.id, { status: 'failed', errorMessage: errMsg });
        return { status: 'failed', error: errMsg };
      }
      return { status: status || 'processing' };
    };

    if (action === 'seed') {
      const existing = await Clips.list();
      if (existing.length > 0) {
        return Response.json({ success: true, message: 'Already seeded', count: existing.length });
      }
      const created = await Clips.bulkCreate(SEED.map(s => ({ ...s, status: 'draft', isActive: true })));
      return Response.json({ success: true, created: created.length });
    }

    if (action === 'startAll') {
      const clips = await Clips.list(null, 200);
      const results = [];
      for (const clip of clips) {
        if (clip.status === 'draft' || clip.status === 'failed') {
          const r = await startRender(clip);
          results.push({ clipId: clip.id, question: clip.question, ...r });
        }
      }
      return Response.json({ success: true, started: results.length, results });
    }

    if (action === 'rerenderAll') {
      const clips = await Clips.list(null, 200);
      const results = [];
      for (const clip of clips) {
        if (clip.answerScript && clip.status !== 'rendering') {
          const r = await startRender(clip);
          results.push({ clipId: clip.id, question: clip.question, ...r });
        }
      }
      return Response.json({ success: true, started: results.length, results });
    }

    if (action === 'checkAll') {
      const clips = await Clips.filter({ status: 'rendering' }, null, 200);
      const results = [];
      for (const clip of clips) {
        const r = await checkRender(clip);
        results.push({ clipId: clip.id, question: clip.question, ...r });
      }
      return Response.json({ success: true, checked: results });
    }

    if (action === 'start' || action === 'check') {
      const { clipId } = body;
      if (!clipId) return Response.json({ error: 'clipId required' }, { status: 400 });
      const arr = await Clips.filter({ id: clipId });
      const clip = arr?.[0];
      if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });
      const r = action === 'start' ? await startRender(clip) : await checkRender(clip);
      return Response.json({ success: !r.error, ...r });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});