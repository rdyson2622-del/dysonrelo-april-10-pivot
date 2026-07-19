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

/**
 * TONE PRINCIPLES — Applied to all seed scripts on the front side.
 *
 * VOICE: Sped up from the original slow/boring delivery. Energetic but not hyper.
 * PERSONALITY: Warm, seasoned, dry wit — a little humor, a little charm.
 * TONE: Conversational, like talking to friends — NOT an instructor or lecturer.
 * APPROACH: "What we do in these situations is..." / "Here's how we handle that..."
 *           Share experiences, tell quick stories, use "we" and "I" naturally.
 * AVOID: Slow monotone, directive commands, stiff corporate speak, formality.
 * KEEP: All facts, numbers, specific details exactly the same.
 */
const SEED = [
  { question: "Who is Bob Dyson?", answerScript: "So — I'm Bob Dyson. Fifty-five plus years in real estate, and honestly I still love it. Started out flying corporate jets — was the Governor of Oklahoma's Chief Pilot at twenty, if you can believe that. Along the way I picked up over a thousand properties across multiple states. These days I run this relocation program personally, and every client starts with a conversation with me. Not a form. Not a call center. Just me." },
  { question: "How do I get started with Dyson & Dyson?", answerScript: "Real simple. We start with a free, no-obligation conversation — you tell me what's going on, and if we're a fit, my team takes it from there. No paperwork mountain, no enrollment forms. What we do in these situations is just talk first. You can reach me at eight five eight, three five three, twelve hundred, or book a session right here on the site." },
  { question: "How do you pick the right agent for me?", answerScript: "We don't just hand you a name off a list — that's not how we work. What we do in these situations is pull actual production data, interview top performers in your destination market, and match an agent whose track record fits your specific move. Your price point, your neighborhood, your timeline. And because they work through us, they stay accountable. If something drifts, we step in." },
  { question: "Can you help me sell my current home too?", answerScript: "Absolutely — and honestly, that's the part people forget. A real relocation has two sides, the sale and the purchase. What we do is coordinate your listing with a vetted agent in your current market, then we time both transactions so you're never carrying two mortgages or stuck without a home. It's a dance, but we've done this dance a few thousand times." },
  { question: "What is a buyer broker agreement and do I need one?", answerScript: "Good question. A buyer broker agreement is the contract that formalizes your relationship with the agent representing you — what they do for you, how they're compensated. What we do in these situations is walk you through it line by line before you sign anything. No surprises, no fine print gotchas. We've seen enough of these to know where the landmines are." },
  { question: "How does Dyson & Dyson make money if the service is free?", answerScript: "Fair question — and I appreciate you asking. When you close on a home with an agent we recommended, that agent pays us a referral fee out of their commission. You never pay a dime. The fee doesn't come out of your pocket and it doesn't change your price. Fully compliant, completely transparent. That's how the industry works, and we're upfront about it." },
  { question: "Do you help with schools for my kids?", answerScript: "We do — and honestly, schools are usually the biggest driver of where a family lands. What we do in these situations is research the districts, help arrange tours, and walk you through the enrollment paperwork so your kids are set before you even arrive. Moving is hard enough. Making sure your kids land in the right school — that's where we earn our keep." },
  { question: "Do you help with movers and moving logistics?", answerScript: "Yes. We build your packing timeline, connect you with vetted movers, and manage the whole checklist so nothing falls through the cracks. And if you've got specialized assets — pianos, horses, a boat, a wine collection — we handle that too. What we do in these situations is think three steps ahead, because the stuff that trips people up is the stuff they didn't see coming." },
  { question: "Do you set up utilities at my new home?", answerScript: "We do. Internet, electric, gas, water — all arranged before you arrive. What we do in these situations is make sure the lights are on and the wifi works the day you walk in the door. Sounds small, but trust me — after a cross-country move, you want to walk into a working house, not a dark one." },
  { question: "Can you help me find doctors in my new city?", answerScript: "Yes — healthcare setup is part of the concierge service. We help you locate doctors, dentists, and specialists in your new area so there's no gap in care for you or your family. What we do in these situations is get you connected before you need it, because the worst time to find a doctor is when you already need one." },
  { question: "What is the 30/60/90 day plan?", answerScript: "So here's the thing — moving is day one. Settling in is the real job. What we do in these situations is set milestones for your first thirty, sixty, and ninety days. Services connected, schools running, community connections made. By day ninety, you're not just living there — you're home. That's the difference between a move and a relocation." },
  { question: "What if I'm not sure where I want to move yet?", answerScript: "Honestly? That's actually the best place to start. What we do in these situations is city and neighborhood research based on your lifestyle — commute, schools, culture, cost of living. We narrow it down together. No pressure, no hard sell. Just a conversation, and we'll figure it out." },
  { question: "Can you help me if I'm renting instead of buying?", answerScript: "We can. Our core service is built around home purchases, but we guide renters too — neighborhood research, the local rental landscape, all the logistics on the move side. What we do in these situations is meet you where you are. Buying, renting, undecided — doesn't matter. We'll help you think it through." },
  { question: "What makes your agents different from ones I'd find myself?", answerScript: "Accountability. Any agent can look good online — a slick website and a headshot doesn't tell you much. What we do in these situations is select agents on verified production data, interview them ourselves, and they answer to us throughout your transaction. If anything drifts, we step in. You don't get that finding someone on your own." },
  { question: "What is the Private Referral Network?", answerScript: "The P-R-N is our national network of vetted, top-producing agents. Every member earned their spot on performance — not on paying for placement. What we do in these situations is hand you to someone we'd trust with our own family's move. That's not marketing — that's the bar." },
  { question: "Do you work with seniors or people downsizing?", answerScript: "All the time. Downsizing moves carry their own weight — decades of belongings, timing the sale, finding the right next home. What we do in these situations is handle it with extra care and extra patience. There's a lot of emotion in those moves, and we respect that." },
  { question: "Can my employer use your service for employee relocations?", answerScript: "Yes. We work with employers who want their people relocated smoothly without standing up an internal relocation department. What we do in these situations is set up a program — your HR team can reach out to me directly and we'll get it rolling. It's a win-win. Your employees get white-glove service, and you don't have to build a relo department from scratch." },
  { question: "What is a Gemini Session?", answerScript: "So a Gemini Session is a live, three-way conversation — you, our AI assistant, and senior staff — where we dig into your situation in real time. It's the fastest way to get real answers about your specific move. And it's free. What we do in these situations is skip the back-and-forth and just get you real answers, fast." },
  { question: "Is my information kept private?", answerScript: "Completely. Your details are used for one purpose — managing your relocation. We don't sell your information, and we don't blast you with marketing. What we do in these situations is treat your data the way we'd want ours treated. That's a promise I stand behind personally." },
  { question: "What happens after I talk to Bob?", answerScript: "So once we've talked and you're in the program, my team goes to work. Within twenty-four hours we begin the agent search in your destination market, and your dedicated relocation manager builds your plan. From that point on, you've got a team — not just an agent. What we do in these situations is make sure you never feel alone in the process. Because you won't be." },
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
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: clip.answerScript, emotion: 'Excited', speed: 1.12 },
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