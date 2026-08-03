import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';

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

      // ── Fetch the active broadcast template (saved open/close) ──────────
      const templates = await base44.asServiceRole.entities.BroadcastTemplate.filter(
        { is_active: true }, '-version', 1
      );
      const activeTemplate = templates[0];

      let openScript, bobAnswer, closeScript;

      if (activeTemplate) {
        // Use saved template for open/close — only generate Bob's answer fresh
        const storyTeasers = top.slice(0, 4).map((a, i) => `Story ${i + 1}: ${a.headline}`).join('. ');
        openScript = activeTemplate.open_script_template
          .replace(/{DATE}/g, dateSpoken)
          .replace(/{STORY_TEASERS}/g, storyTeasers);
        closeScript = activeTemplate.close_script_template.replace(/{DATE}/g, dateSpoken);

        const bobResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are writing Bob Dyson's segment for the DNN Real Estate News Broadcast for ${dateSpoken}.

Bob answers Charlie's question about the most relocation-relevant story from today's digest in 80-120 words.

CRITICAL TONE RULES FOR BOB — KINDER AND SOFTER:
- Bob NEVER talks down to the viewer or gives directives like "you need to", "you should", "you must", "do this", "don't do that."
- Instead, Bob is warm, kind, and gentle. He frames his expertise as suggestions and shared client experiences.
- He uses phrases like: "I'd suggest considering...", "Many of our clients have found...", "One approach that's worked well for some families...", "You might think about...", "What we've seen work..."
- He speaks WITH the viewer, not AT them, like a trusted friend sharing perspective over coffee, not an instructor giving orders.
- He respects that the viewer may have their own knowledge and situation, so he offers options and considerations rather than directives.
- When sharing solutions, he frames them as what other clients have CHOSEN to do, not what you must do.
- Keep the warm, seasoned, dry-wit personality. Keep all facts, numbers, and specific details exactly the same.
- Keep it conversational and natural spoken language.

FORMATTING RULE — CRITICAL: Never use em-dashes, en-dashes, smart quotes, or bullet characters. Use only plain commas, periods, and straight quotes. HeyGen goes SILENT on em-dashes or smart punctuation.

Plain spoken text only. No stage directions, no markdown, no scene labels.

TODAY'S STORY DIGEST:
${digest}

Return ONLY Bob's spoken answer text.`,
        });
        bobAnswer = typeof bobResult === 'string'
          ? bobResult.trim()
          : (bobResult?.response || bobResult?.text || bobResult?.output || '').trim();
      } else {
        // No template yet — generate all three segments (original behavior)
        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are writing a two-anchor TV news script for the "DNN Real Estate News Broadcast" for ${dateSpoken}.

CAST:
- Charlie Simmons: the anchor, at the DNN studio news desk.
- Bob Dyson: 55-year real estate veteran, appearing remotely in a correspondent box.

Write THREE spoken segments:

1. charlie_open (180-240 words):
- Begins exactly: "Good day from the DNN news desk. I'm Charlie Simmons, and this is your DNN Real Estate News broadcast for ${dateSpoken}."
- Covers 3-4 of the most market-moving stories from the digest in punchy anchor style, each rewritten conversationally with smooth transitions.
- The open should frame D&D relocation services as SOLUTIONS to real estate situations, and encourage viewers to contact us with their real estate issues for possible suggestions or solutions.
- ENDS by tossing to Bob about the single most relocation-relevant remaining story, e.g. "For what this really means if you're planning a move, let's bring in Bob Dyson. Bob, [specific question about that story]?"

2. bob_answer (80-120 words):
- Bob answers Charlie's question directly, in his warm, plain-spoken veteran voice.
- Focuses on what it means for people relocating or buying/selling right now.
- CRITICAL TONE RULE FOR BOB — KINDER AND SOFTER: Bob NEVER talks down to the viewer or gives directives like "you need to", "you should", "you must", "do this", "don't do that." Instead, Bob is warm, kind, and gentle. He frames his expertise as suggestions and shared client experiences. He uses phrases like "I'd suggest considering...", "Many of our clients have found...", "One approach that's worked well for some families...", "You might think about...", "What we've seen work..." He speaks WITH the viewer, not AT them, like a trusted friend sharing perspective over coffee, not an instructor giving orders. He respects that the viewer may have their own knowledge and situation, so he offers options and considerations rather than directives. When sharing solutions, he frames them as what other clients have CHOSEN to do, not what you must do.
- Ends by handing back, e.g. "...and that's the real story here, Charlie."

3. charlie_close (40-60 words):
- Thanks Bob briefly, then closes exactly with: "That's your DNN brief. The full stories are right below this broadcast. And if any of them affect your move, just ask. I'm Charlie Simmons. We'll see you next time."

FORMATTING RULE — CRITICAL: Never use em-dashes, en-dashes, smart quotes, or bullet characters in any script text. Use only plain commas, periods, and straight quotes. HeyGen's text-to-speech engine goes SILENT when it encounters em-dashes or smart punctuation.

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
        openScript = result.charlie_open;
        bobAnswer = result.bob_answer;
        closeScript = result.charlie_close;
      }

      const clips = [
        { role: 'charlie', script: openScript, status: 'not_started' },
        { role: 'bob', script: bobAnswer, status: 'not_started' },
        { role: 'charlie', script: closeScript, status: 'not_started' },
      ];
      const fullScript = `${openScript}\n\n${bobAnswer}\n\n${closeScript}`;

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
        // Auto-assign the next sequential show name/number
        const all = await Broadcasts.list('broadcast_date', 200);
        const nextNum = all.length + 1;
        record = await Broadcasts.create({ broadcast_date: today, show_name: `Show ${nextNum}`, show_number: nextNum, ...payload });
      }
      return { record };
    };

    const renderClip = async (clip) => {
      const isCharlie = clip.role === 'charlie';
      const videoInput = isCharlie
        ? {
            character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal', scale: 1.0, offset: { x: 0, y: 0.18 } },
            voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: clip.script, speed: 1.05 },
            background: { type: 'color', value: '#0d0d0d' },
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
          clips[i] = { ...clips[i], heygenId: r.videoId, status: 'rendering', startedAt: new Date().toISOString() };
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

            // 5-minute timeout: abort stuck renders
            if (clip.startedAt && Date.now() - new Date(clip.startedAt).getTime() > 5 * 60 * 1000) {
              clips[i] = { ...clip, status: 'failed' };
              changed = true;
              await Broadcasts.update(rec.id, { clips, status: 'failed', errorMessage: 'Render timed out after 5 minutes' });
              results.push({ id: rec.id, status: 'timeout', error: 'Render timed out after 5 minutes' });
              continue;
            }

            const { status, videoUrl, error } = await checkHeygenStatus(heygenKey, clip.heygenId);
            if (status === 'completed') {
              const vidRes = await fetch(videoUrl);
              const buf = await vidRes.arrayBuffer();
              const file = new File([buf], `dnn_broadcast_${rec.broadcast_date}_clip${i}.mp4`, { type: 'video/mp4' });
              const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              clips[i] = { ...clip, videoUrl: up.file_url, status: 'completed' };
              changed = true;
            } else if (status === 'failed') {
              clips[i] = { ...clip, status: 'failed' };
              changed = true;
              await Broadcasts.update(rec.id, { clips, status: 'failed', errorMessage: error || 'HeyGen render failed' });
            }
          }
          const allDone = clips.every(c => c.videoUrl);
          if (changed || allDone) {
            await Broadcasts.update(rec.id, { clips, ...(allDone ? { status: 'completed' } : {}) });
          }

          // Auto-trigger stitching: combine all clips into a single composited video
          if (allDone && !rec.videoUrl) {
            try {
              await base44.asServiceRole.functions.invoke('dnnStitchBroadcast', {
                action: 'start',
                broadcastId: rec.id,
              });
              console.log(`Auto-triggered stitching for broadcast ${rec.id}`);
            } catch (e) {
              console.log(`Stitching trigger failed for ${rec.id}: ${e.message}`);
            }
          }

          results.push({ id: rec.id, status: allDone ? 'completed' : 'processing', clips: clips.map(c => c.status) });
          continue;
        }

        // Legacy solo broadcasts
        if (!rec.heygenId) continue;
        const { status, videoUrl, error } = await checkHeygenStatus(heygenKey, rec.heygenId);
        if (status === 'completed') {
          const vidRes = await fetch(videoUrl);
          const buf = await vidRes.arrayBuffer();
          const file = new File([buf], `dnn_broadcast_${rec.broadcast_date}.mp4`, { type: 'video/mp4' });
          const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
          await Broadcasts.update(rec.id, { videoUrl: up.file_url, status: 'completed' });
          results.push({ id: rec.id, status: 'completed', url: up.file_url });
        } else if (status === 'failed') {
          const errMsg = error || 'HeyGen render failed';
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