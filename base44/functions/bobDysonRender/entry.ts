import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * bobDysonRender — renders Charlie clips for the Bob Dyson bio page.
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
    question: 'Bob Dyson story — part 1',
    charlieScript: "Let me tell you about Bob Dyson. Bob started his career as a corporate jet pilot and Chief Pilot for the Governor of Oklahoma — at just twenty years old. But flying wasn't his only talent. Bob strategically acquired over one thousand properties across multiple states while building Red Carpet Corporation of America, managing more than sixteen hundred offices nationwide.",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: 'Bob Dyson story — part 2',
    charlieScript: "After selling that company, Bob founded Dyson and Dyson Concierge Relocation Services and established Dyson News Network — DNN — which delivers real estate intelligence to millions. That foundation of expertise, refined over fifty-five-plus years, is what Dyson and Dyson brings to every client today.",
  },
  {
    kind: 'outro',
    faqIndex: 2,
    question: 'Bob Dyson story — part 3',
    charlieScript: "Today, Bob leads a team that combines hands-on real estate expertise with cutting-edge AI to serve families nationwide. And me? I'm Charlie — his AI concierge, here to guide you through every step of your relocation journey. We don't sell real estate. We manage your entire move.",
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
    const Clips = base44.asServiceRole.entities.BobDysonClip;

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
        const file = new File([buf], `bobdyson_${clip.id}_charlie.mp4`, { type: 'video/mp4' });
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