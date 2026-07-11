import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * receivingAgentQARender — renders the "Why Dyson & Dyson Is Different" Q&A clips
 * for the Referral Receiving Agent modal.
 *
 * Charlie (avatar) asks each question; Bob Dyson (talking photo, cloned voice,
 * excited delivery) answers. Plus a Charlie intro and a Charlie outro.
 *
 * Actions (POST body):
 *   { action: "seed" }                       → create clip records with scripts
 *   { action: "startAll" }                   → kick off all pending HeyGen renders
 *   { action: "checkAll" }                   → poll all rendering clips, store completed videos
 *   { action: "rerenderBob" }                → re-render all Bob clips
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
    charlieScript: "So a Dyson referral just landed in your market — and you're wondering what makes this different from every corporate relo package you've ever seen. Fair question. This isn't another corporate relo company. Six things change when the referral comes from us — and you won't hear them from me. Bob Dyson answers every one himself. Tap any question below.",
  },
  {
    kind: 'qa', faqIndex: 0,
    question: 'The Client Pays Nothing',
    charlieScript: "Bob, first one. Does the relocating client pay anything for all this?",
    bobScript: "Not a dime. Unlike corporate relo companies, our service is completely free to the relocating family. We're funded through referral agreements with the agents and brokers we recommend — one hundred percent compliant with D-R-E regulations. So your client arrives grateful — not nickel-and-dimed.",
  },
  {
    kind: 'qa', faqIndex: 1,
    question: 'You Get DIRECT Access to the Client',
    charlieScript: "Bob, do receiving agents get direct access to the client — or is there a corporate gatekeeper?",
    bobScript: "No gatekeeper. None. Because you're participating in our corporate or private relocation process — and you abide by our strict guidelines — you work directly with the client from the very first introduction. You represent them. We manage the move around you. That's the whole point.",
  },
  {
    kind: 'qa', faqIndex: 2,
    question: 'The Client Chooses YOU',
    charlieScript: "Bob, how does the client actually end up with a particular receiving agent?",
    bobScript: "They choose you. We capture a voice and video interview from every candidate agent applying for the representation. The client hears your voice, your answers, your personality — and selects the agent they want. You win the representation on merit — not on a rotation list. Nobody else in this business does that.",
  },
  {
    kind: 'qa', faqIndex: 3,
    question: 'A Fee Structure That Works',
    charlieScript: "Bob, let's talk about the money. How does the fee structure work for the receiving agent?",
    bobScript: "Straightforward. Our referral and management fee totals fifty percent of the buy-side commission — twenty-five percent to the sending agent, and fifteen to twenty-five percent to us for managing the entire move. Now remember — the sweat equity of selling a three hundred thousand dollar home is the same as a three million dollar home. And here's the truth: we have never had a receiving agent decline.",
  },
  {
    kind: 'qa', faqIndex: 4,
    question: 'We Quarterback Everything Else',
    charlieScript: "Bob, beyond the home search, what does your team actually handle?",
    bobScript: "Everything else. Escrow coordination across two markets, timetables, utilities, schools, healthcare, and a thirty, sixty, ninety day settle-in plan. You focus on finding the home — we handle the logistics that usually kill deals. That's why our transactions close.",
  },
  {
    kind: 'qa', faqIndex: 5,
    question: 'Monthly Affiliate Bonus Pool',
    charlieScript: "Bob, last one — tell them about the monthly affiliate bonus pool.",
    bobScript: "This is my favorite part. As a network member, you share in five to ten percent of our management fees each month you close — nationwide and worldwide. And another one to three percent is paid equally to our passive affiliates on all network sales that month. You're not just receiving one referral — you're joining a producing network.",
  },
  {
    kind: 'outro',
    charlieScript: "Want to receive vetted, move-managed referrals in your market? Call the number below and talk to the team directly. We'll take it from there.",
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
    const Clips = base44.asServiceRole.entities.ReceivingAgentClip;

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
        const file = new File([buf], `recvagent_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
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

    if (action === 'rerenderBob') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.bobScript && clip.bobStatus !== 'rendering') {
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
      const r = action === 'start' ? await startRender(clip, role) : await checkRender(clip, role);
      return Response.json({ success: !r.error, ...r });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});