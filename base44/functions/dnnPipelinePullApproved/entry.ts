import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnPipelinePullApproved
 *
 * Machine-to-machine endpoint for n8n to fetch ONLY articles the admin team has
 * approved for HeyGen rendering.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Optional body: { "limit": 10 } (defaults to 10, max 50)
 *
 * Returns articles where:
 *   admin_approved      === true
 *   render_requested    === true
 *   production_status    === "approved_for_render"
 *
 * Script selection: edited_full_script takes priority over generated_full_script.
 * Same logic applies per-scene for opening/body/closing/lower-third.
 *
 * Returns:
 * {
 *   "articles": [
 *     {
 *       "id", "headline", "final_script", "opening_script", "body_script",
 *       "closing_script", "lower_third_text", "pronunciation_notes",
 *       "scene_1_background_url", "scene_2_background_url", "scene_3_background_url",
 *       "render_version"
 *     }
 *   ]
 * }
 */

function pick(edited, generated) {
  if (edited !== undefined && edited !== null && String(edited).trim() !== '') return edited;
  return generated || '';
}

import { blockIfN8n } from '../../shared/n8nGuard.ts';

Deno.serve(async (req) => {
  try {
    const __n8nBlocked = blockIfN8n(req); if (__n8nBlocked) return __n8nBlocked;
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let limit = 10;
    try {
      const body = await req.json();
      if (body && Number.isFinite(body.limit)) {
        limit = Math.min(Math.max(parseInt(body.limit, 10), 1), 50);
      }
    } catch (_) {
      // no body — use default
    }

    const base44 = createClientFromRequest(req);

    const approved = await base44.asServiceRole.entities.DnnArticle.filter(
      {
        admin_approved: true,
        render_requested: true,
        production_status: 'approved_for_render',
      },
      '-generated_date',
      limit
    );

    const articles = approved.map((a) => ({
      id: a.id,
      headline: a.headline,
      final_script: pick(a.edited_full_script, a.generated_full_script),
      opening_script: pick(a.edited_opening_script, a.generated_opening_script),
      body_script: pick(a.edited_body_script, a.generated_body_script),
      closing_script: pick(a.edited_closing_script, a.generated_closing_script),
      lower_third_text: pick(a.edited_lower_third_text, a.generated_lower_third_text),
      pronunciation_notes: a.pronunciation_notes || '',
      scene_1_background_url: a.scene_1_background_url || '',
      scene_2_background_url: a.scene_2_background_url || '',
      scene_3_background_url: a.scene_3_background_url || '',
      render_version: a.render_version || 0,
    }));

    return Response.json({ articles });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});