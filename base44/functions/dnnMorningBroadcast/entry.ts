import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnMorningBroadcast — nightly DNN Morning Broadcast, tag-team edition.
 *
 * Charlie Simmons anchors from the DNN studio desk, then tosses one or two
 * stories to Bob Dyson, who appears as a remote correspondent. Three clips
 * are rendered per broadcast: charlie open → bob answer → charlie close.
 * The in-app TV player composites Bob into a corner box over the studio.
 *
 * Actions (POST body):
 *   { action: "run" }     → generate today's scripts + start all renders
 *   { action: "check" }   → poll rendering clips, store completed videos
 *   { action: "generate" }→ scripts only (manual)
 *   { action: "render" }  → start renders for today's script_ready broadcast
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
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

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

    const generateScript = async () => {
      const published = await base44.asServiceRole.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 20);
      if (published.length === 0) return { error: 'No published articles to broadcast' };

      const top = published.slice(0, 6);
      const headlines = top.map(a => a.headline);
      const digest = top.map((a, i) => `STORY ${i + 1}: ${a.headline}\n${(a.body || '').slice(0, 600)}`).join('\n\n');

      const dateSpoken = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric' });

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are writing a two-anchor TV news script for the "DNN Real Estate News Broadcast" for ${dateSpoken}.

CAST:
- Charlie Simmons: the anchor, at the DNN studio news desk.
- Bob Dyson: 55-year real estate veteran, appearing remotely in a correspondent box.

Write THREE spoken segments:

1. charlie_open (180-240 words):
- Begins exactly: "Good day from the DNN news desk — I'm Charlie Simmons, and this is your DNN Real Estate News broadcast for ${dateSpoken}."
- Covers 3-4 of the most market-moving stories from the digest in punchy anchor style, each rewritten conversationally with smooth transitions.
- ENDS by tossing to Bob about the single most relocation-relevant remaining story, e.g. "For what this really means if you're planning a move, let's bring in Bob Dyson. Bob — [specific question about that story]?"

2. bob_answer (80-120 words):
- Bob answers Charlie's question directly, in his warm, plain-spoken veteran voice.
- Focuses on what it means for people relocating or buying/selling right now.
- Ends by handing back, e.g. "...and that's the real story here, Charlie."

3. charlie_close (40-60 words):
- Thanks Bob briefly, then closes exactly with: "That's your DNN brief. The full stories are right below this broadcast — and if any of them affect your move, just ask. I'm Charlie Simmons. We'll see you next time."

Plain spoken text only. No stage directions, no markdown, no scene labels.

TODAY'S STORY DIGEST:
${digest}`,
        response_json_schema: {
          type: 'object',
          properties: {
            charlie_open: { type: 'string' },
            bob_answer: { type: 'string' },
            charlie_close: { type: 'string' },
          },
          required: ['charlie_open', 'bob_answer', 'charlie_close'],
        },
      });

      const clips = [
        { role: 'charlie', script: result.charlie_open, status: 'not_started' },
        { role: 'bob', script: result.bob_answer, status: 'not_started' },
        { role: 'charlie', script: result.charlie_close, status: 'not_started' },
      ];
      const fullScript = `${result.charlie_open}\n\n${result.bob_answer}\n\n${result.charlie_close}`;

      const payload = {
        script: fullScript, headlines, presenter: 'charlie', format: 'tag_team',
        clips, status: 'script_ready', errorMessage: '', videoUrl: '', heygenId: '',
      };

      const existing = await Broadcasts.filter({ broadcast_date: today });
      let record;
      if (existing.length > 0) {
        await Broadcasts.update(existing[0].id, payload);
        record = { ...existing[0], ...payload };
      } else {
        record = await Broadcasts.create({ broadcast_date: today, ...payload });
      }
      return { record };
    };

    const renderClip = async (clip) => {
      const isCharlie = clip.role === 'charlie';
      const videoInput = isCharlie
        ? {
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: clip.script, speed: 1.05 },
            background: { type: 'color', value: '#00FF00' },
          }
        : {
            character: { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID },
            voice: { type: 'text', voice_id: BOB_VOICE_ID, input_text: clip.script, emotion: 'Excited', speed: 1.12 },
            background: { type: 'color', value: '#0d0d0d' },
          };

      const res = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_inputs: [videoInput], dimension: { width: 1280, height: 720 } }),
      });
      const data = await res.json();
      const videoId = data?.data?.video_id;
      if (!res.ok || !videoId) return { error: JSON.stringify(data?.error || data) };
      return { videoId };
    };

    const startRender = async (record) => {
      const clips = [...(record.clips || [])];
      if (clips.length === 0) return { error: 'No clips on this broadcast' };
      const errors = [];
      for (let i = 0; i < clips.length; i++) {
        if (clips[i].videoUrl) continue;
        const r = await renderClip(clips[i]);
        if (r.error) {
          clips[i] = { ...clips[i], status: 'failed' };
          errors.push(r.error);
        } else {
          clips[i] = { ...clips[i], heygenId: r.videoId, status: 'rendering' };
        }
      }
      if (errors.length > 0) {
        await Broadcasts.update(record.id, { clips, status: 'failed', errorMessage: errors[0] });
        return { error: errors[0] };
      }
      await Broadcasts.update(record.id, { clips, status: 'rendering' });
      return { started: clips.length };
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
        // Tag-team broadcasts: poll each clip
        if (rec.clips?.length > 0) {
          const clips = [...rec.clips];
          let changed = false;
          for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            if (clip.videoUrl || !clip.heygenId) continue;
            const res = await fetch(
              `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(clip.heygenId)}`,
              { headers: { 'X-Api-Key': heygenKey } }
            );
            const data = await res.json();
            const status = data?.data?.status;
            if (status === 'completed') {
              const vidRes = await fetch(data?.data?.video_url);
              const buf = await vidRes.arrayBuffer();
              const file = new File([buf], `dnn_broadcast_${rec.broadcast_date}_clip${i}.mp4`, { type: 'video/mp4' });
              const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              clips[i] = { ...clip, videoUrl: up.file_url, status: 'completed' };
              changed = true;
            } else if (status === 'failed') {
              clips[i] = { ...clip, status: 'failed' };
              changed = true;
              await Broadcasts.update(rec.id, { clips, status: 'failed', errorMessage: data?.data?.error?.message || 'HeyGen render failed' });
            }
          }
          const allDone = clips.every(c => c.videoUrl);
          if (changed || allDone) {
            await Broadcasts.update(rec.id, { clips, ...(allDone ? { status: 'completed' } : {}) });
          }
          results.push({ id: rec.id, status: allDone ? 'completed' : 'processing', clips: clips.map(c => c.status) });
          continue;
        }

        // Legacy solo broadcasts
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