import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * lenderRender — renders Charlie + Bob duo clips for the Financial Services
 * (Select a Lender) page.
 *
 * Charlie (avatar) opens, asks questions; Bob Dyson (talking photo, cloned
 * voice) answers. Charlie closes.
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
    faqIndex: 0,
    question: 'Lender vetting — introduction',
    charlieScript: "When it comes to choosing a lender, there's more to it than just finding the lowest rate. Bob Dyson has guided families through every lending scenario imaginable over his fifty-five-year career — and he knows that the type of lender you choose can shape your entire loan experience. Let me bring Bob in to walk you through the two lending configurations you'll encounter, and why we stay involved in the selection process.",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: 'What are the two lending configurations?',
    charlieScript: "Bob, walk us through the two lending configurations a buyer will encounter. What should they know?",
    bobScript: "Basically, in the lending process you have two different lending configurations. The first is proprietary lenders — these are lenders that only sell their own mortgage products. That limits your selection of loans, types of loans, and various other options. There's usually no wiggle room in pricing or lending fees either. Now, if you are in private backing at a large bank, your weight could change things — but for most buyers, a proprietary lender narrows your choices.",
  },
  {
    kind: 'qa',
    faqIndex: 2,
    question: 'Why do you recommend a loan brokerage instead?',
    charlieScript: "So if proprietary lenders limit your options, what's the better path? Bob, tell them about loan brokerages.",
    bobScript: "That's why we always shop the market. And to best do that, we recommend a loan brokerage — a brokerage that offers and processes loans for various third-party lenders. That really opens up so many ways to select a loan that best works for you and your situation. As part of our services, we stay involved in the selection process and vet the lenders based on not only the loan itself, but their service history and knowledge of specific communities and loan products. It's an art, if you do it right!",
  },
  {
    kind: 'qa',
    faqIndex: 3,
    question: 'Why does DNN vet every lender?',
    charlieScript: "Bob, most buyers just shop rates on comparison sites. Why does DNN insist on vetting every single lender?",
    bobScript: "Most buyers shop for rates on comparison sites that compare lenders with zero vetting. Rates are cheaper because corners are cut: slower closings, hidden costs, loan products designed to hurt you long-term. Our vetted lenders compete on fairness, speed, and service — not race-to-the-bottom pricing. We check NMLS licensing, audit production history, benchmark rate competitiveness, interview for relocation fit, and require a fiduciary agreement. Every lender on this page has passed all five steps. This is not a directory — it's a guarantee.",
  },
  {
    kind: 'outro',
    faqIndex: 4,
    question: 'Lender vetting — closing',
    charlieScript: "And that's exactly why every lender on this page has been through our five-step vetting process. Bob's team doesn't just check rates — they evaluate service history, community knowledge, and relocation fit. When you choose a DNN-vetted lender, you're getting the benefit of that artistry. If you have any questions about which lending configuration is right for your move, just ask — I'm here to help.",
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
    const Clips = base44.asServiceRole.entities.LenderClip;

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
        const file = new File([buf], `lender_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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

    if (action === 'approveAll') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        await Clips.update(clip.id, { scriptStatus: 'approved' });
        results.push({ clipId: clip.id, kind: clip.kind, scriptStatus: 'approved' });
      }
      return Response.json({ success: true, approved: results });
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