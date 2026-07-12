import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * lenderRender — renders Charlie clips for the Financial Services (Select a Lender) page.
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

const SEED = [
  {
    kind: 'intro',
    faqIndex: 0,
    question: 'Lender vetting — part 1',
    charlieScript: "When it comes to choosing a lender, there's more to it than just finding the lowest rate. Bob Dyson has guided families through every lending scenario imaginable over his fifty-five-year career — and he knows that the type of lender you choose can shape your entire loan experience. Let me walk you through the two lending configurations you'll encounter, and why we stay involved in the selection process.",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: 'Lender vetting — part 2',
    charlieScript: "Basically, in the lending process you have two different lending configurations. The first is proprietary lenders — these are lenders that only sell their own mortgage products. That limits your selection of loans, types of loans, and various other options. There's usually no wiggle room in pricing or lending fees either. Now, if you are in private backing at a large bank, your weight could change things — but for most buyers, a proprietary lender narrows your choices. That's why we always shop the market. And to best do that, we recommend a loan brokerage — a brokerage that offers and processes loans for various third-party lenders. That really opens up so many ways to select a loan that best works for you and your situation. As part of our services, we stay involved in the selection process and vet the lenders based on not only the loan itself, but their service history and knowledge of specific communities and loan products. It's an art, if you do it right!",
  },
  {
    kind: 'outro',
    faqIndex: 2,
    question: 'Lender vetting — part 3',
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

    const startRender = async (clip) => {
      const script = clip.charlieScript;
      if (!script) return { skipped: true };
      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Clips.update(clip.id, { charlieStatus: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Clips.update(clip.id, { charlieHeygenId: videoId, charlieStatus: 'rendering' });
      return { videoId };
    };

    const checkRender = async (clip) => {
      const videoId = clip.charlieHeygenId;
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
        const file = new File([buf], `lender_${clip.id}_charlie.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Clips.update(clip.id, { charlieVideoUrl: up.file_url, charlieStatus: 'completed' });
        return { status: 'completed', url: up.file_url };
      }
      if (status === 'failed') {
        const errMsg = data?.data?.error?.message || 'HeyGen render failed';
        await Clips.update(clip.id, { charlieStatus: 'failed', errorMessage: errMsg });
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
        if (clip.charlieScript && clip.charlieStatus !== 'completed' && clip.charlieStatus !== 'rendering') {
          const r = await startRender(clip);
          results.push({ clipId: clip.id, kind: clip.kind, ...r });
        }
      }
      return Response.json({ success: true, started: results });
    }

    if (action === 'checkAll') {
      const clips = await Clips.list();
      const results = [];
      for (const clip of clips) {
        if (clip.charlieStatus === 'rendering') {
          const r = await checkRender(clip);
          results.push({ clipId: clip.id, kind: clip.kind, ...r });
        }
      }
      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});