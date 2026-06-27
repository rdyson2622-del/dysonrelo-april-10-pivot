import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * shard2GenerateScript
 *
 * Generates Charlie Simmons' explainer script + overview for a CharliePageExplainer
 * using the page's raw text and the active Shard2 knowledge base entries.
 *
 * Can be called two ways:
 *  - From the admin UI (authenticated user) with { explainerId }
 *  - From n8n (M2M) with header x-pipeline-secret matching N8N_PIPELINE_SECRET and { explainerId }
 *
 * On success the explainer is updated with:
 *   aiGeneratedOverview, aiGeneratedScript, finalScript (seeded from AI), scriptStatus = "needs_review"
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    // Allow either an authenticated admin OR a valid pipeline secret
    const providedSecret = req.headers.get('x-pipeline-secret');
    const expectedSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const isM2M = providedSecret && expectedSecret && providedSecret === expectedSecret;

    if (!isM2M) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { explainerId } = body || {};
    if (!explainerId) {
      return Response.json({ error: 'explainerId is required' }, { status: 400 });
    }

    const explainerArr = await base44.asServiceRole.entities.CharliePageExplainer.filter({ id: explainerId });
    const explainer = explainerArr?.[0];
    if (!explainer) {
      return Response.json({ error: 'Explainer not found' }, { status: 404 });
    }

    // Pull active knowledge base guidance
    const kb = await base44.asServiceRole.entities.Shard2KnowledgeBase.filter({ status: 'active' });
    const guidance = (kb || [])
      .map((k) => `[${k.category}] ${k.title}: ${k.content}`)
      .join('\n');

    const pageText = explainer.rawPageText || '';
    const pageTitle = explainer.pageTitle || 'this page';

    const prompt = `You are scripting a short, friendly explainer video delivered by "Charlie Simmons", the AI concierge host for Dyson & Dyson / DysonRelo relocation services.

Write a spoken script (first person, warm, professional, ~120-160 words) that explains the following page to a visitor. Speak naturally as Charlie. Do not use stage directions, headings, or bullet points — just the spoken words.

PAGE TITLE: ${pageTitle}

PAGE CONTENT:
${pageText}

BRAND & SCRIPT GUIDANCE:
${guidance || 'Keep it warm, concise, and helpful.'}

Also produce a 1-2 sentence overview describing what this page is about.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_4',
      response_json_schema: {
        type: 'object',
        properties: {
          overview: { type: 'string' },
          script: { type: 'string' },
        },
        required: ['overview', 'script'],
      },
    });

    const overview = result?.overview || '';
    const script = result?.script || '';

    await base44.asServiceRole.entities.CharliePageExplainer.update(explainerId, {
      aiGeneratedOverview: overview,
      aiGeneratedScript: script,
      finalScript: explainer.finalScript || script,
      scriptStatus: 'needs_review',
    });

    return Response.json({ success: true, overview, script });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});