import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * heygenTemplateVars — diagnostic. Returns the raw variable definitions
 * for a HeyGen template so the render pipeline knows exactly which
 * variable names to inject.
 */
Deno.serve(async (req) => {
  try {
    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      const providedSecret = req.headers.get('x-pipeline-secret');
      const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
      if (!(providedSecret && expectedSecret && providedSecret === expectedSecret)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const templateId = body.templateId;
    if (!templateId) return Response.json({ error: 'templateId required' }, { status: 400 });

    const res = await fetch(`https://api.heygen.com/v2/template/${templateId}`, {
      headers: { 'X-Api-Key': heygenKey },
    });
    const data = await res.json();
    return Response.json({
      templateId,
      variables: data?.data?.variables || null,
      raw: data,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});