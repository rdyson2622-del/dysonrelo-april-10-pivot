import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { waitUntil } from 'base44:runtime';

const VALID_CONTEXTS = ['corporate_relo', 'general', 'client_portal', 'agent_portal', 'vendor_portal', 'brokerage_portal'];
const VALID_PORTAL_ROLES = ['client', 'agent', 'referral_agent', 'vendor', 'hr', 'brokerage_admin', 'general'];

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
    const { request_text, full_name, email, context, portal_role, audience } = body || {};

    if (!request_text || !request_text.trim()) {
      return Response.json({ error: 'request_text is required' }, { status: 400 });
    }

    const user = await base44.auth.me().catch(() => null);
    const startedAt = Date.now();

    const record = await base44.asServiceRole.entities.RealEstateRequest.create({
      full_name: full_name || user?.full_name || '',
      email: email || user?.email || '',
      user_id: user?.id || '',
      portal_role: VALID_PORTAL_ROLES.includes(portal_role) ? portal_role : 'general',
      context: VALID_CONTEXTS.includes(context) ? context : 'general',
      request_text: request_text.trim(),
      status: 'processing',
    });

    // Notify admins immediately by text — don't wait on the LLM roadmap.
    waitUntil(
      base44.asServiceRole.functions.invoke('notifyAdmin', {
        event: { entity_name: 'RealEstateRequest' },
        data: record,
      }).catch(() => {})
    );

    const audienceLine = audience ? `They are ${audience}.` : '';
    const prompt = `You are a senior real estate relocation expert at Dyson & Dyson. ${audienceLine} Someone just described the following real estate issue or request. Give them an immediate, confident, practical response and a short roadmap of the steps we will take to handle it.

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