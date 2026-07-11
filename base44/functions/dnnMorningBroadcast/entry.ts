import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnMorningBroadcast — nightly DNN Morning Broadcast anchor video.
 *
 * One video per day: Bob Dyson anchors the top headlines from the DNN feed
 * on a DNN Real Estate News studio background. The 20 text briefs stay as-is.
 *
 * Actions (POST body):
 *   { action: "run" }     → generate today's script + start HeyGen render (nightly automation)
 *   { action: "check" }   → poll rendering broadcasts, store completed video (polling automation)
 *   { action: "generate" }→ script only (manual)
 *   { action: "render" }  → start render for today's script_ready broadcast (manual)
 */

const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { action } = body || {};
    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;

    // Today's date in Pacific time
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

    const generateScript = async () => {
      const published = await base44.asServiceRole.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 20);
      if (published.length === 0) return { error: 'No published articles to broadcast' };

      const top = published.slice(0, 8);
      const headlines = top.map(a => a.headline);
      const digest = top.map((a, i) => `STORY ${i + 1}: ${a.headline}\n${(a.body || '').slice(0, 600)}`).join('\n\n');

      const dateSpoken = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric' });

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are writing a spoken news-anchor script for Bob Dyson, founder of Dyson & Dyson, anchoring the "DNN Real Estate News Morning Broadcast" for ${dateSpoken}.

Rules:
- Total length: 300-400 words (about 2.5 minutes spoken).
- Open with exactly: "Good morning, I'm Bob Dyson, and this is your DNN Real Estate News morning broadcast for ${dateSpoken}."
- Cover the top 5-6 most market-moving stories from the digest below in punchy anchor style — one to three sentences each, with a smooth transition between stories.
- Focus on what each story means for people relocating or buying/selling homes.
- No headlines read verbatim — rewrite them conversationally.
- Close with exactly: "That's your DNN morning brief. The full stories are right below this broadcast — and if any of them affect your move, ask Charlie. I'm Bob Dyson. We'll see you tomorrow at six."
- Plain spoken text only. No stage directions, no markdown, no scene labels.

TODAY'S STORY DIGEST:
${digest}`,
        response_json_schema: {
          type: 'object',
          properties: { script: { type: 'string' } },
          required: ['script'],
        },
      });

      const existing = await Broadcasts.filter({ broadcast_date: today });
      let record;
      if (existing.length > 0) {
        record = await Broadcasts.update(existing[0].id, {
          script: result.script, headlines, presenter: 'bob', status: 'script_ready', errorMessage: '',
        });
        record = { ...existing[0], script: result.script, id: existing[0].id };
      } else {
        record = await Broadcasts.create({
          broadcast_date: today, script: result.script, headlines, presenter: 'bob', status: 'script_ready',
        });
      }
      return { record };
    };

    const startRender = async (record) => {
      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_inputs: [{
            character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: record.script, emotion: 'Excited', speed: 1.12 },
            background: { type: 'image', url: STUDIO_BG_URL },
          }],
          dimension: { width: 1280, height: 720 },
        }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) {
        await Broadcasts.update(record.id, { status: 'failed', errorMessage: JSON.stringify(data?.error || data) });
        return { error: data };
      }
      await Broadcasts.update(record.id, { heygenId: videoId, status: 'rendering' });
      return { videoId };
    };

    if (action === 'run') {
      const gen = await generateScript();
      if (gen.error) return Response.json({ success: false, ...gen });
      const r = await startRender(gen.record);
      return Response.json({ success: !r.error, broadcastId: gen.record.id, ...r });
    }

    if (action === 'generate') {
      const gen = await generateScript();
      return Response.json({ success: !gen.error, ...gen });
    }

    if (action === 'render') {
      const arr = await Broadcasts.filter({ broadcast_date: today, status: 'script_ready' });
      if (arr.length === 0) return Response.json({ success: false, error: 'No script_ready broadcast for today' });
      const r = await startRender(arr[0]);
      return Response.json({ success: !r.error, broadcastId: arr[0].id, ...r });
    }

    if (action === 'check') {
      const rendering = await Broadcasts.filter({ status: 'rendering' });
      const results = [];
      for (const rec of rendering) {
        if (!rec.heygenId) continue;
        const res = await fetch(
          `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(rec.heygenId)}`,
          { headers: { 'X-Api-Key': heygenKey } }
        );
        const data = await res.json();
        const status = data?.data?.status;
        if (status === 'completed') {
          const vidRes = await fetch(data?.data?.video_url);
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${rec.broadcast_date}.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          await Broadcasts.update(rec.id, { videoUrl: up.file_url, status: 'completed' });
          results.push({ id: rec.id, status: 'completed', url: up.file_url });
        } else if (status === 'failed') {
          const errMsg = data?.data?.error?.message || 'HeyGen render failed';
          await Broadcasts.update(rec.id, { status: 'failed', errorMessage: errMsg });
          results.push({ id: rec.id, status: 'failed', error: errMsg });
        } else {
          results.push({ id: rec.id, status: status || 'processing' });
        }
      }
      return Response.json({ success: true, checked: results });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});