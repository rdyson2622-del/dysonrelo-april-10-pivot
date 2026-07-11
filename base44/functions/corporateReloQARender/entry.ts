import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * corporateReloQARender — renders the Corporate Relo / HR Manager Q&A clips.
 *
 * Charlie (avatar) asks each question; Bob Dyson (talking photo, cloned voice)
 * answers. Plus a Charlie intro and a Charlie outro.
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
    charlieScript: "If you manage relocations for your company, you already know the pain: traditional corporate relocation companies charge management fees, referral markups, and administrative overhead that can add thousands of dollars per transferred employee. I'm Charlie with Dyson and Dyson — and Bob Dyson is about to show you a better model. Tap any question below, and Bob will answer it himself.",
  },
  {
    kind: 'qa', faqIndex: 0,
    question: "How do you eliminate the relocation management fees other companies charge?",
    charlieScript: "Bob, how do you save companies the management fees that traditional corporate relocation companies charge?",
    bobScript: "It's simple, Charlie. We don't bill the company a dime in relocation management fees. Instead, we're compensated through a share of the commission already being paid to the buying or selling agent — money that's built into every real estate transaction anyway. Your company keeps its relocation budget. Your employee gets white-glove service. And nobody writes an extra check.",
  },
  {
    kind: 'qa', faqIndex: 1,
    question: "How do you find the right agent on the receiving end?",
    charlieScript: "Bob, what about finding the right agent on the receiving end? That's usually where relocations go sideways.",
    bobScript: "That's the part we've actually made fun and rewarding. Every agent in our national and international network is production-vetted, license-verified, and matched to your employee's specific move. So your transferee ends up with a proven professional on the receiving end — not Aunt Suzie, who assumes she's getting the business just because she holds a real estate license.",
  },
  {
    kind: 'qa', faqIndex: 2,
    question: "What if my relocating employee knows several agents personally?",
    charlieScript: "Bob, here's the situation HR managers dread. What happens when the relocating employee knows three or four agents personally?",
    bobScript: "This is the part HR managers love most. Our selection process makes the decision for them. No awkward phone calls. No hurt feelings. No favors owed. Your employee never has to appear to be the one choosing — the system chose, not them. Those uncomfortable situations simply disappear.",
  },
  {
    kind: 'qa', faqIndex: 3,
    question: "Give me the overview — what exactly does Dyson & Dyson do for a corporate transferee?",
    charlieScript: "Bob, for an HR manager hearing about us for the first time — walk them through the overview. What exactly does Dyson and Dyson do for a corporate transferee?",
    bobScript: "We manage the entire move, end to end — as if we were packing boxes right alongside your employee. We vet and select the receiving agent, coordinate the sale of their current home and the purchase of the new one, manage escrow timelines, and handle the landing: schools, utilities, healthcare, and a thirty, sixty, ninety day settle-in plan. Your employee gets one point of contact and a full team behind it. Your HR department gets status visibility the whole way — and never a surprise.",
  },
  {
    kind: 'qa', faqIndex: 4,
    question: "What are the features and benefits for the company and the employee?",
    charlieScript: "Bob, break down the features and benefits — first for the company, then for the relocating employee.",
    bobScript: "For the company: zero management fees, zero markups, and a transferee who's productive faster because the move isn't consuming them. Predictable, professional, and off your HR team's plate. For the employee: a production-vetted agent on the receiving end, an AI concierge named Charlie available twenty-four seven, neighborhood and school research done for them, moving logistics coordinated, and utilities live before the boxes arrive. White-glove treatment their previous employer's relocation company never gave them — at no cost to them or to you.",
  },
  {
    kind: 'qa', faqIndex: 5,
    question: "Why the Dyson & Dyson way?",
    charlieScript: "Bob, last question. There are big-name relocation companies out there. Why the Dyson and Dyson way?",
    bobScript: "Fifty-five years of relocation management experience — personal moves and full corporate relocations, and we've lived these moves ourselves. A national and international network of vetted agents we sought out based on performance and production, all of record. Daily market intelligence through DNN Real Estate News. And a business model where our incentives line up with yours: we only win when the transaction closes well. The big names bill you for the process. We're paid by the outcome. That's the Dyson and Dyson way.",
  },
  {
    kind: 'outro',
    charlieScript: "Vetted pros. Zero management fees. Zero awkward conversations. That's corporate relocation done right. Reach out below, and let's talk about your next transferee — where your people land well.",
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
    const Clips = base44.asServiceRole.entities.CorporateReloClip;

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
        const file = new File([buf], `corprelo_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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