import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * realEstateIssueRoadmap — a visitor (client or HR manager) describes a real
 * estate issue or request. Gemini generates an instant solution plus a
 * short step-by-step roadmap, which is saved so it can be displayed
 * transparently and in real time (e.g. to both the employee and their HR
 * manager on the Corporate Relo page).
 *
 * Public endpoint — no login required (used on public marketing pages).
 *
 * Payload: { request_text, full_name?, email?, context? ('corporate_relo'|'general') }
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { request_text, full_name, email, context } = body || {};

    if (!request_text || !request_text.trim()) {
      return Response.json({ error: 'request_text is required' }, { status: 400 });
    }

    const startedAt = Date.now();

    const record = await base44.asServiceRole.entities.RealEstateRequest.create({
      full_name: full_name || '',
      email: email || '',
      context: context === 'corporate_relo' ? 'corporate_relo' : 'general',
      request_text: request_text.trim(),
      status: 'processing',
    });

    const prompt = `You are a senior real estate relocation expert at Dyson & Dyson. Someone just described the following real estate issue or request. Give them an immediate, confident, practical response and a short roadmap of the steps we will take to handle it.

REQUEST: "${request_text.trim()}"

Respond with:
1. A short, warm, confident solution/response (2-4 sentences) speaking directly to them.
2. 2-4 concrete next-step action items.
3. A roadmap of 4-6 short stage titles (2-4 words each) representing the steps from receiving this request through to resolution (e.g. "Review Request", "Match Resource", "Connect Expert", "Resolve & Confirm"). Tailor the stage titles to the specific request.`;

    let llmData;
    try {
      const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: {
            solution: { type: 'string' },
            action_steps: { type: 'array', items: { type: 'string' } },
            roadmap_stage_titles: { type: 'array', items: { type: 'string' } },
          },
        },
      });
      llmData = llmRes.data || llmRes;
    } catch (llmError) {
      await base44.asServiceRole.entities.RealEstateRequest.update(record.id, {
        status: 'failed',
      });
      return Response.json({ error: `LLM error: ${llmError.message}` }, { status: 500 });
    }

    const roadmap_stages = (llmData.roadmap_stage_titles || []).map((title, i) => ({
      id: `stage_${i}`,
      title,
      status: 'completed',
    }));
    const duration_ms = Date.now() - startedAt;

    const updated = await base44.asServiceRole.entities.RealEstateRequest.update(record.id, {
      status: 'completed',
      solution: llmData.solution || '',
      action_steps: llmData.action_steps || [],
      roadmap_stages,
      duration_ms,
    });

    return Response.json({ success: true, request: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}