import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * vettingDeskQARender — renders the Dyson National Vetting Desk Q&A clips
 * for the Referral Sending Agent page.
 *
 * Charlie (avatar) asks each question; Bob Dyson (talking photo, cloned voice,
 * excited delivery) answers. Plus a Charlie intro and a Charlie outro.
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
    charlieScript: "Thinking about sending us a client? You've reached the Dyson National Vetting Desk — where your referral becomes our full-time job. Here's the key: the more you tell us up front about your client, where they're relocating to, and their preferred timetable, the better their landing. Tap any question below, and Bob Dyson will answer it himself.",
  },
  {
    kind: 'qa', faqIndex: 0,
    question: "What information should I include when I refer a client?",
    charlieScript: "Bob, when an agent sends us a referral, what should they include?",
    bobScript: "Everything you can. Where the client is headed, their preferred timetable, price range, family situation, and anything special about the move — a business, horses, a boat, aging parents. The more you give us up front, the faster and more precisely we vet the destination side. There is no such thing as too much detail.",
  },
  {
    kind: 'qa', faqIndex: 1,
    question: "What happens to my client after I hand them off?",
    charlieScript: "Bob, once an agent hands their client to us, what actually happens?",
    bobScript: "We move with them. Step by step, through the entire relocation — as if we were packing boxes right alongside them. Agent selection, escrow timelines, schools, utilities, healthcare, and a thirty, sixty, ninety day settle-in plan. Your client is never handed off and forgotten. And you stay in the loop the whole way.",
  },
  {
    kind: 'qa', faqIndex: 2,
    question: "How do you match my client to a destination agent?",
    charlieScript: "Bob, how do you match a client to the right destination agent?",
    bobScript: "Geography is only the starting point. We identify top performers in the area your client wants — then we capture a voice and video interview with every candidate applying for the buyer representation. Your client hears each applicant's voice, their answers, their expressions, their personality — and picks the one they want to interview further. Nobody else does that.",
  },
  {
    kind: 'qa', faqIndex: 3,
    question: "Do you have real relocation experience — personal and corporate?",
    charlieScript: "Bob, what kind of relocation experience does your team actually have?",
    bobScript: "Both kinds — and we have the testimonials to prove it. We've managed personal family moves and full corporate relocations for over five decades. We've lived these moves ourselves. That's why we treat your client's move like it's our own.",
  },
  {
    kind: 'qa', faqIndex: 4,
    question: "How do the referral fees and commissions work when I send you a client?",
    charlieScript: "Bob, here's the money question. When an affiliate agent or broker sends you a client, how do the referral fees and commissions actually work?",
    bobScript: "Here's exactly how we participate in the commissions disbursed at the close of escrow. First — you refer your client to us for the management of the entire move, including the vetting of the agent for the buyer's selection. Second — our referral agreement with you is for twenty-five percent of the commission earned on the buy side of the purchase, paid to you through your broker arrangement. In addition, we collect another fifteen to twenty-five percent of that commission as our management fee for managing the entire move. Now, you might ask — will a receiving broker really agree to a total of fifty percent in relocation and referral fees? Well, remember — the sweat equity of selling a buyer a three hundred thousand dollar home is the same sweat equity as a three million dollar home. The receiving broker can make that call. But I will tell you this — we have never had a receiving agent decline our referral and management fee.",
  },
  {
    kind: 'qa', faqIndex: 5,
    question: "What bonuses do Dyson affiliate agents and brokers receive?",
    charlieScript: "Bob, tell them about the monthly bonus pool for Dyson and Dyson Relocation Network affiliates.",
    bobScript: "This is my favorite part. As an incentive and bonus to you — the sending affiliate agent or broker — at the end of each month, we add up all the sales that closed that month, nationwide and worldwide. We allocate between five and ten percent of our management fee as a bonus, distributed to every agent and broker who closed a transaction that month. Remember — as a producing Dyson affiliate and subscriber, we sought you out based on your performance, your production, your average sale price — all of which is of record. And another one to three percent is paid equally to our passive affiliate agents and brokers on all sales for that month. Here's an example: two hundred seventy-five agents close forty sales collectively in a month, averaging two million dollars per sale at two and a half percent gross commission. It's realistic that each producing agent or brokerage could receive a bonus of over ten thousand dollars that month — in addition to their own referral. And even non-producing affiliates receive a bonus that month. We don't stop there. We're approaching the point where we can offer you daily broadcast real estate news — with you as the presenter to your local audience, your contact list, and your past clients. We clone you as our spokesman or spokeswoman with DNN Real Estate News.",
  },
  {
    kind: 'outro',
    charlieScript: "Ready to put the Vetting Desk to work? Fill out the referral form below with as much detail about your client as you can — destination, timetable, and anything special. We'll take it from there.",
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
    const Clips = base44.asServiceRole.entities.VettingDeskClip;

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
        const file = new File([buf], `vetdesk_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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
          if (script && clip.scriptStatus === 'approved' && status !== 'completed' && status !== 'rendering') {
            const r = await startRender(clip, role);
            results.push({ clipId: clip.id, kind: clip.kind, faqIndex: clip.faqIndex, role, ...r });
          }
        }
      }
      return Response.json({ success: true, started: results });
    }

    if (action === 'rerenderBob') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.bobScript && clip.scriptStatus === 'approved' && clip.bobStatus !== 'rendering') {
          const r = await startRender(clip, 'bob');
          results.push({ clipId: clip.id, faqIndex: clip.faqIndex, ...r });
        }
      }
      return Response.json({ success: true, started: results.length, results });
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
      if (action === 'start' && clip.scriptStatus !== 'approved') {
        return Response.json({ success: false, error: 'Script must be approved before rendering' }, { status: 400 });
      }
      const r = action === 'start' ? await startRender(clip, role) : await checkRender(clip, role);
      return Response.json({ success: !r.error, ...r });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});