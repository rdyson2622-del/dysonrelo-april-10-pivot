import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnAutoRender
 *
 * Scheduled every 5 minutes. Picks up DnnArticles that an admin approved
 * in the Daily News Library (production_status === 'approved_for_render',
 * render_requested === true), submits a HeyGen avatar render using the
 * EDITED script (edited_full_script, or opening + body + closing), and
 * stores the pending HeyGen video ID on the article.
 *
 * dnnVideoPoller (also scheduled every 5 min) then downloads the finished
 * MP4 and marks the article production_status === 'complete'.
 *
 * Auth: runs as service role via scheduled automation (no user session).
 */

const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';
const DNN_BG = { type: 'color', value: '#000000' };
const HEYGEN_API = 'https://api.heygen.com';

function buildScript(article) {
  if (article.edited_full_script && article.edited_full_script.trim()) {
    return article.edited_full_script;
  }
  const parts = [
    article.edited_opening_script || article.generated_opening_script || '',
    article.edited_body_script || article.generated_body_script || article.body || '',
    article.edited_closing_script || article.generated_closing_script || '',
  ].filter((p) => p && p.trim());
  if (parts.length) return parts.join('\n\n');
  return `${article.headline}. ${article.body || ''}`.slice(0, 3000);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    // Pull articles approved in the Daily News Library awaiting render
    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { production_status: 'approved_for_render', render_requested: true },
      '-updated_date',
      20
    );

    const results = [];
    for (const article of articles) {
      try {
        const raw = buildScript(article);
        const script = raw.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();
        if (!script) {
          results.push({ id: article.id, skipped: 'empty script' });
          continue;
        }

        const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
          method: 'POST',
          headers: { 'X-Api-Key': HEYGEN_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_inputs: [{
              character: { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' },
              voice: { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script },
              background: DNN_BG,
            }],
            dimension: { width: 1920, height: 1080 },
          }),
        });
        const data = await res.json();
        const videoId = data?.data?.video_id;

        if (!res.ok || !videoId) {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: JSON.stringify(data?.error || data).slice(0, 500),
            render_requested: false,
          });
          results.push({ id: article.id, headline: article.headline, error: data?.error || data });
          continue;
        }

        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          video_url: `heygen:pending:${videoId}`,
          heygen_video_id: videoId,
          production_status: 'rendering',
          render_requested: false,
          last_render_error: null,
        });
        results.push({ id: article.id, headline: article.headline, videoId, status: 'rendering' });

        // Light rate-limit between submissions
        await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        results.push({ id: article.id, error: e.message });
      }
    }

    return Response.json({
      success: true,
      approved_found: articles.length,
      processed: results.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});