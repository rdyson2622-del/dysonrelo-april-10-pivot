import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * dnnPipelineSaveScript
 *
 * Called by n8n (machine-to-machine) to push AI-generated Shard 1 script data
 * into Base44 for admin review BEFORE HeyGen rendering.
 *
 * Auth: shared secret in the `x-pipeline-secret` header (must match N8N_PIPELINE_SECRET).
 *
 * Accepted payload:
 * {
 *   "articleId": "...",
 *   "generated_opening_script": "...",
 *   "generated_body_script": "...",
 *   "generated_closing_script": "...",
 *   "generated_full_script": "...",
 *   "generated_lower_third_text": "...",
 *   "scene_1_background_url": "...",
 *   "scene_2_background_url": "...",
 *   "scene_3_background_url": "..."
 * }
 *
 * Sets production_status to "pending_review" so the admin team can review/edit.
 */

Deno.serve(async (req) => {
  try {
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

    const body = await req.json();
    const {
      articleId,
      generated_opening_script,
      generated_body_script,
      generated_closing_script,
      generated_full_script,
      generated_lower_third_text,
      scene_1_background_url,
      scene_2_background_url,
      scene_3_background_url,
    } = body || {};

    if (!articleId) {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }

    const updates = {
      production_status: 'pending_review',
      admin_approved: false,
      render_requested: false,
    };

    // Only set fields that were actually provided
    if (generated_opening_script !== undefined) updates.generated_opening_script = generated_opening_script;
    if (generated_body_script !== undefined) updates.generated_body_script = generated_body_script;
    if (generated_closing_script !== undefined) updates.generated_closing_script = generated_closing_script;
    if (generated_full_script !== undefined) updates.generated_full_script = generated_full_script;
    if (generated_lower_third_text !== undefined) updates.generated_lower_third_text = generated_lower_third_text;
    if (scene_1_background_url !== undefined) updates.scene_1_background_url = scene_1_background_url;
    if (scene_2_background_url !== undefined) updates.scene_2_background_url = scene_2_background_url;
    if (scene_3_background_url !== undefined) updates.scene_3_background_url = scene_3_background_url;

    const base44 = createClientFromRequest(req);
    await base44.asServiceRole.entities.DnnArticle.update(articleId, updates);

    return Response.json({ success: true, articleId, production_status: 'pending_review' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});