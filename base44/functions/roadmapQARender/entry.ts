import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * roadmapQARender — renders the Relocation Roadmap explainer clips.
 *
 * Charlie (avatar) introduces each of the 8 roadmap phases as a question;
 * Bob Dyson (talking photo, cloned voice) answers with exactly what Dyson &
 * Dyson executes in that phase. Plus a Charlie intro and outro.
 *
 * Actions (POST body):
 *   { action: "seed" }                       → create clip records with scripts
 *   { action: "reseed" }                     → delete all clips and re-create from SEED
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
    charlieScript: "This is the page that separates Dyson and Dyson from everyone else — your Relocation Roadmap. Eight phases. Completely managed. Always free to you. Most companies hand you a checklist and wish you luck. We execute every step with you, all the way through close of escrow and beyond. Tap any phase below, and Bob Dyson will tell you exactly what happens — and exactly what we handle for you.",
  },
  {
    kind: 'qa', faqIndex: 1,
    question: "Phase 1: Onboarding & Profile — what happens the moment I come aboard?",
    charlieScript: "Bob, Phase One — Onboarding and Profile. What happens the moment someone comes aboard?",
    bobScript: "The moment your relocation profile is submitted, we go to work. My team reviews it, assigns your personal relocation manager, and schedules two things: an intro call with us, and your private Gemini session — a live, three-way working session where we build your complete relocation plan together, in real time. You're not filling out forms into a void. From day one, real people are building your move.",
  },
  {
    kind: 'qa', faqIndex: 2,
    question: "Phase 2: Agent Match — how is your agent vetting different?",
    charlieScript: "Phase Two is Agent Match. Bob, everyone claims they'll find you a great agent. What makes ours different?",
    bobScript: "We start with a personality interview — with you, not the agent. Then we evaluate the top twenty agents in your destination market: DRE records, actual production numbers, and how they work. My team personally vets every candidate and presents you three to five finalists. You choose. No cold handoffs. And no 'I love me' agents who spend the meeting talking about themselves instead of your move.",
  },
  {
    kind: 'qa', faqIndex: 3,
    question: "Phase 3: Property Search & Selection — how does the AI matching work?",
    charlieScript: "Phase Three — Property Search and Selection. Bob, how does the AI-powered matching actually work?",
    bobScript: "Charlie matches active listings to your exact criteria every single day — not a saved search, a working profile. Your agent coordinates virtual and in-person tours, we run a market comp analysis on every property you're serious about, and together we develop your offer strategy. You never chase listings. They come to you, pre-screened, with the numbers already done.",
  },
  {
    kind: 'qa', faqIndex: 4,
    question: "Phase 4: Community & Neighborhood Research — why does this get its own phase?",
    charlieScript: "Phase Four — Community and Neighborhood Research. Bob, why does that get its own phase?",
    bobScript: "Because buying the right house in the wrong neighborhood is still the wrong move. Charlie and our team research your destination using your priorities — school districts, commute, safety, lifestyle — and we deep-dive every one of them. Then we present a shortlist of three to five communities that actually fit your life. You zero in with data, not guesswork.",
  },
  {
    kind: 'qa', faqIndex: 5,
    question: "Phase 5: Environmental & Property Due Diligence — what are you protecting me from?",
    charlieScript: "Phase Five — Environmental and Property Due Diligence. Bob, what are you protecting people from here?",
    bobScript: "Surprises. We coordinate the property inspections, review the HOA and community documents, and run flood, fire, and hazard zone analysis on every property. Then we review every report and flag anything that deserves your attention — before you commit, not after. When you sign, you know exactly what you're buying.",
  },
  {
    kind: 'qa', faqIndex: 6,
    question: "Phase 6: Purchase Agreement & Service Providers — who does what at the table?",
    charlieScript: "Phase Six — the Purchase Agreement and selecting your service providers. Bob, who does what at the negotiating table?",
    bobScript: "Your agent leads the negotiation — that's their job and their market. My team provides the strategy behind it: contingency planning, counter-offer guidance, and a full review before anything gets executed. And you make the final call, every time. You negotiate with confidence, because you're never negotiating alone.",
  },
  {
    kind: 'qa', faqIndex: 7,
    question: "Phase 7: Escrow & Closing — how do you keep deals from falling apart?",
    charlieScript: "Phase Seven — negotiating the offer, escrow, and closing. Bob, this is where deals fall apart. How do you keep that from happening?",
    bobScript: "We track every escrow milestone personally. Title company selected and engaged. Escrow opened and the timeline set. Lending and appraisal coordinated. Inspections scheduled. Final walkthrough completed. Nothing falls through the cracks between contract and keys — because someone whose only job is your move is watching every date on that calendar.",
  },
  {
    kind: 'qa', faqIndex: 8,
    question: "Phase 8: Move & Move-In — most services disappear after closing. You don't?",
    charlieScript: "And Phase Eight — the move itself. Bob, most services disappear the day escrow closes. You don't?",
    bobScript: "We don't. Charlie manages your entire move-in checklist, end to end. Moving company vetted and booked. Utilities transferred — internet, electric, gas, water — live before your boxes arrive. Travel and packing coordinated. You don't arrive to a to-do list. You arrive to a ready home. That's the finish line we promise — and we keep it.",
  },
  {
    kind: 'outro',
    charlieScript: "Eight phases. Completely managed. Always free to you. That's not a brochure — that's how every Dyson and Dyson relocation actually runs. And Phase One begins the moment you submit your profile. Welcome aboard.",
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
    const Clips = base44.asServiceRole.entities.RoadmapClip;

    const startRender = async (clip, role) => {
      const script = role === 'bob' ? clip.bobScript : clip.charlieScript;
      if (!script) return { skipped: true };
      const character = role === 'bob'
        ? { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID }
        : { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' };
      const voice = role === 'bob'
        ? { type: 'text', voice_id: BOB_VOICE_ID, input_text: script, emotion: 'Excited', speed: 1.12 }
        : { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script };

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
        const file = new File([buf], `roadmap_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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

    if (action === 'reseed') {
      await Clips.deleteMany({ kind: { $in: ['intro', 'qa', 'outro'] } });
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