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
 *   { action: "startCombined", clipId }      → render Charlie+Bob as ONE combined clip (cost-optimized)
 *   { action: "checkCombined", clipId }       → poll a combined render
 *   { action: "startAllCombined" }            → combined-render all approved Q&A clips
 *
 * COMBINED RENDER: ONE HeyGen /v2/video/generate call with three sequential
 * video_inputs — Charlie intro, Bob solutions, Charlie out. One render job, one
 * video file, one credit charge.
 *
 * COMPLETE = one single combinedVideoUrl (.mp4). Three separate clips is NOT
 * Complete. Any pending / waiting / queued / processing HeyGen leftovers are
 * cancelled by clearPendingHeygen() immediately before every generate, so stale
 * jobs cannot clog the queue. This is the standard going forward for all Q&A
 * pipelines (see Business Plan v8.0).
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

    // ── Cancel any pending/queued HeyGen jobs so leftovers don't clog the queue ──
    const clearPendingHeygen = async (key) => {
      const cancelled = [];
      try {
        let token = null;
        for (let page = 0; page < 5; page++) {
          const url = `https://api.heygen.com/v1/video.list?limit=50${token ? `&token=${encodeURIComponent(token)}` : ''}`;
          const listRes = await fetch(url, { headers: { 'X-Api-Key': key } });
          const listData = await listRes.json().catch(() => ({}));
          const videos = listData?.data?.videos || listData?.data?.list || [];
          for (const v of videos) {
            const st = String(v?.status || '').toLowerCase();
            if (!['pending', 'waiting', 'queued', 'processing'].includes(st)) continue; // never touch completed/failed
            const id = v?.video_id || v?.id;
            if (!id) continue;
            try {
              // video delete only — never avatar/look delete endpoints
              let del = await fetch(`https://api.heygen.com/v1/video.delete?video_id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { 'X-Api-Key': key },
              });
              if (!del.ok) {
                del = await fetch(`https://api.heygen.com/v3/videos/${encodeURIComponent(id)}`, {
                  method: 'DELETE',
                  headers: { 'X-Api-Key': key },
                });
              }
              if (del.ok) cancelled.push(id);
            } catch (_e) { /* swallow per-item errors — a missed cancel must not abort the generate */ }
          }
          token = listData?.data?.token || null;
          if (!token) break;
        }
      } catch (_e) { /* listing failure must not abort the generate */ }
      return cancelled;
    };

    const charlieScene = (text) => ({
      character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
      voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: text },
      background: { type: 'color', value: '#0d0d0d' },
    });

    const bobScene = (text) => ({
      character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
      voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: text, emotion: 'Excited' },
      background: { type: 'color', value: '#0d0d0d' },
    });

    // Build the three sequential scenes: Charlie intro → Bob solutions → Charlie out
    const buildCombinedInputs = (clips, clip) => {
      const all = Array.isArray(clips) ? clips : [];
      const videoInputs = [];

      const introClip = clip?.kind === 'intro' ? clip : all.find((c) => c.kind === 'intro' && c.charlieScript);
      const introText = introClip?.charlieScript;
      if (introText) videoInputs.push(charlieScene(introText));

      const qaClips = all.filter((c) => c.kind === 'qa' && c.bobScript);
      let bobText = '';
      if (clip?.kind === 'qa' && clip.bobScript) {
        bobText = clip.bobScript;
      } else if (qaClips.length === 1) {
        bobText = qaClips[0].bobScript;
      } else if (qaClips.length > 1) {
        bobText = qaClips
          .slice()
          .sort((a, b) => (a.faqIndex ?? 0) - (b.faqIndex ?? 0))
          .map((c) => c.bobScript)
          .join('\n');
      }
      if (bobText) videoInputs.push(bobScene(bobText));

      const outroClip = all.find((c) => c.kind === 'outro' && c.charlieScript);
      if (outroClip?.charlieScript) videoInputs.push(charlieScene(outroClip.charlieScript));

      return videoInputs;
    };

    // ── COMBINED RENDER: ONE HeyGen generate → ONE mp4 (Charlie intro, Bob solutions, Charlie out) ──
    const startCombinedRender = async (clip, preloadedClips = null) => {
      // Cancel stale pending/queued HeyGen jobs FIRST, before anything else.
      const cancelled = await clearPendingHeygen(heygenKey);

      const clips = preloadedClips || (await Clips.list());
      let videoInputs = buildCombinedInputs(clips, clip);

      if (videoInputs.length < 2) {
        // fallback: keep the old 2-input behavior so the current single Q&A still works
        if (clip?.charlieScript && clip?.bobScript) {
          videoInputs = [charlieScene(clip.charlieScript), bobScene(clip.bobScript)];
        } else {
          return { error: 'Not enough script text to build a combined render' };
        }
      }

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: videoInputs,
          dimension: { width: 1280, height: 720 },
          title: 'ONE MP4 — three sequential scenes: Charlie intro, Bob solutions, Charlie out',
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Clips.update(clip.id, { combinedStatus: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data, cancelled };
      }
      await Clips.update(clip.id, { combinedHeygenId: videoId, combinedStatus: 'rendering' });
      return { videoId, scenes: videoInputs.length, cancelled };
    };

    const checkCombinedRender = async (clip) => {
      const videoId = clip.combinedHeygenId;
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
        const file = new File([buf], `corprelo_${clip.id}_combined.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Clips.update(clip.id, { combinedVideoUrl: up.file_url, combinedStatus: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen combined render failed';
        await Clips.update(clip.id, { combinedStatus: 'failed', errorMessage: errMsg });
        return { status: 'failed', error: errMsg };
      }
      return { status: status || 'processing' };
    };

    if (action === 'startCombined') {
      const { clipId } = body;
      if (!clipId) return Response.json({ error: 'clipId required' }, { status: 400 });
      const arr = await Clips.filter({ id: clipId });
      const clip = arr?.[0];
      if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });
      if (clip.scriptStatus !== 'approved') {
        return Response.json({ success: false, error: 'Script must be approved before rendering' }, { status: 400 });
      }
      const r = await startCombinedRender(clip);
      return Response.json({ success: !r.error, ...r });
    }

    if (action === 'checkCombined') {
      const { clipId } = body;
      if (!clipId) return Response.json({ error: 'clipId required' }, { status: 400 });
      const arr = await Clips.filter({ id: clipId });
      const clip = arr?.[0];
      if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });
      const r = await checkCombinedRender(clip);
      return Response.json({ success: !r.error, ...r });
    }

    if (action === 'startAllCombined') {
      const clips = await Clips.list();
      // ONE generate for the whole set — not a loop of Q&As.
      const target = clips.find((c) => c.kind === 'qa' && c.bobScript)
        || clips.find((c) => c.kind === 'intro' && c.charlieScript);
      if (!target) return Response.json({ success: false, error: 'No clip with script text found' }, { status: 400 });
      const r = await startCombinedRender(target, clips);
      return Response.json({ success: !r.error, clipId: target.id, ...r });
    }

    if (action === 'checkAllCombined') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.combinedStatus === 'rendering') {
          const r = await checkCombinedRender(clip);
          results.push({ clipId: clip.id, faqIndex: clip.faqIndex, ...r });
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

