import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2GetExplainer
 *
 * M2M endpoint for n8n to fetch a single CharliePageExplainer by id.
 * Auth: x-pipeline-secret header must match N8N_PIPELINE_SECRET.
 *
 * Body: { explainerId: string }
 */
Deno.serve(async (req) => {
  try {
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'N8N_PIPELINE_SECRET not configured' }, { status: 500 });
    }
    const providedSecret = req.headers.get('x-pipeline-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { explainerId } = body || {};
    if (!explainerId) {
      return Response.json({ error: 'explainerId is required' }, { status: 400 });
    }

    const arr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = arr?.[0];
    if (!explainer) {
      return Response.json({ error: 'Explainer not found' }, { status: 404 });
    }

    return Response.json({ success: true, explainer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});