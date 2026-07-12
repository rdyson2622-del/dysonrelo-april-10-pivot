import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * aiAssistantRender — renders Charlie clips for the 21 AI Assistants page.
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
    question: 'The backside of Dyson — part 1',
    charlieScript: "What you're looking at here is the backside of the Dyson and Dyson companies. Most people see the front door — the concierge, the relocation roadmap, the news bureau. But behind that front door is an entire workforce of twenty-one AI specialists. Each one owns a single domain. Each one is an expert in exactly one thing. And they all talk to each other — passing insights, triggering actions, and optimizing outcomes together — so you never have to manage the complexity. Let me walk you through who they are and what they do.",
  },
  {
    kind: 'qa',
    faqIndex: 1,
    question: 'The backside of Dyson — part 2',
    charlieScript: "I'm Charlie — your portal concierge. I'm the one you talk to first, every time. Scout scores every lead that comes through the door. Nexus matches you to the right agent in our vetted network. Pulse watches market intelligence in real time. Guardian provides transaction oversight on every deal. Relay handles follow-up automation so nothing falls through the cracks. And Composer generates content — listings, briefs, emails — across the entire ecosystem.",
  },
  {
    kind: 'qa',
    faqIndex: 2,
    question: 'The backside of Dyson — part 3',
    charlieScript: "Then we have the intelligence layer. Lens optimizes every profile in the system. Curator builds education pathways so clients learn as they go. Dispatch coordinates all the service providers — movers, utilities, the whole vendor network. Harvest is our credit engine. And Anchor monitors compliance across every transaction, every document, every disclosure — nothing slips.",
  },
  {
    kind: 'outro',
    faqIndex: 3,
    question: 'The backside of Dyson — part 4',
    charlieScript: "Finally, the orchestration layer. Radar finds opportunities in the market before anyone else does. Conductor orchestrates the entire workflow — all twenty-one of us, working in concert. Herald handles news distribution. Emissary manages email intelligence. And Sentinel is our admin intelligence — the one that watches the watchers. Twenty-one specialists, one ecosystem, and you never have to manage a single one of them. That's the backside of Dyson and Dyson.",
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
    const Clips = base44.asServiceRole.entities.AIAssistantClip;

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
        const file = new File([buf], `aiassistant_${clip.id}_charlie.mp4`, { type: 'video/mp4' });
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