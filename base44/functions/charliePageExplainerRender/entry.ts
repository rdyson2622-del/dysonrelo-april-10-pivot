import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';
import { CHARLIE_AVATAR_ID } from '../../shared/charlieAvatar.ts';

/**
 * charliePageExplainerRender — generates and renders the Charlie-in-a-circle
 * page explainer clips used by CharliePagePresenter (CharliePageExplainer entity).
 *
 * Actions (POST body):
 *   { action: "generateScript", pageKey, pageTitle, rawPageText } → AI writes finalScript
 *   { action: "render", pageKey }                                 → kicks off HeyGen render
 *   { action: "check", pageKey }                                  → polls HeyGen, saves presenterVideoUrl
 *
 * Auth: admin session.
 */

const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, pageKey, pageTitle, rawPageText } = body || {};
    if (!pageKey) return Response.json({ error: 'pageKey is required' }, { status: 400 });

    const Explainers = base44.asServiceRole.entities.CharliePageExplainer;

    const getRecord = async () => {
      const rows = await Explainers.filter({ pageKey });
      return rows?.[0] || null;
    };

    if (action === 'generateScript') {
      const overview = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are writing a short (35-45 second, ~90-110 word) spoken video script for "Charlie", the friendly AI concierge for Dyson & Dyson's DNN Real Estate News page. Charlie appears in a small circle video and explains this page's features and benefits to a visitor in first person, warm and confident, no fluff, no headers.

Page title: ${pageTitle || 'Real Estate News with Solutions'}
Page content:
${rawPageText}

Write ONLY the spoken script text Charlie says — no stage directions, no quotation marks.`,
      });
      const script = typeof overview === 'string' ? overview.trim() : String(overview || '').trim();

      const existing = await getRecord();
      if (existing) {
        await Explainers.update(existing.id, {
          pageTitle: pageTitle || existing.pageTitle,
          rawPageText,
          aiGeneratedScript: script,
          finalScript: script,
          scriptStatus: 'approved',
          approvedBy: user.email,
          approvedAt: new Date().toISOString(),
        });
        return Response.json({ success: true, script, id: existing.id });
      }
      const created = await Explainers.create({
        pageKey,
        pageTitle: pageTitle || pageKey,
        rawPageText,
        aiGeneratedScript: script,
        finalScript: script,
        scriptStatus: 'approved',
        approvedBy: user.email,
        approvedAt: new Date().toISOString(),
      });
      return Response.json({ success: true, script, id: created.id });
    }

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    if (action === 'render') {
      const record = await getRecord();
      if (!record?.finalScript) return Response.json({ error: 'No approved script for this page yet' }, { status: 400 });

      const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
        method: 'POST',
        headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: record.finalScript },
            background: { type: 'color', value: '#0d0d0d' },
          }],
          dimension: { width: 720, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Explainers.update(record.id, { renderStatus: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return Response.json({ error: 'HeyGen render job failed', detail: data }, { status: 500 });
      }
      await Explainers.update(record.id, { heygenVideoId: videoId, avatarId: CHARLIE_AVATAR_ID, voiceId: CHARLIE_VOICE_ID, renderStatus: 'rendering' });
      return Response.json({ success: true, video_id: videoId, status: 'rendering' });
    }

    if (action === 'check') {
      const record = await getRecord();
      if (!record?.heygenVideoId) return Response.json({ error: 'No render job for this page yet' }, { status: 400 });

      const { status, videoUrl, error } = await checkHeygenStatus(HEYGEN_API_KEY, record.heygenVideoId);

      if (status === 'completed' && videoUrl) {
        const vidRes = await fetch(videoUrl);
        const buf = await vidRes.arrayBuffer();
        const file = new File([buf], `charlie_explainer_${record.id}.mp4`, { type: 'video/mp4' });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await Explainers.update(record.id, {
          heygenVideoUrl: videoUrl,
          presenterVideoUrl: up.file_url,
          renderStatus: 'completed',
        });
        return Response.json({ status: 'completed', presenterVideoUrl: up.file_url });
      }
      if (status === 'failed') {
        await Explainers.update(record.id, { renderStatus: 'failed', errorMessage: error || 'HeyGen render failed' });
        return Response.json({ status: 'failed', error });
      }
      return Response.json({ status: 'processing' });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});