import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * resolveEscrowIssue — raises an escrow issue and immediately returns a deep
 * LLM solution plus suggested roadmap detour stages. Saves the EscrowIssue
 * record with the solution so the brokerage can act on it.
 *
 * Payload: { escrow_number, property_address, milestone_ref, issue_type,
 *            issue_description, brokerage_id }
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      escrow_number, property_address, milestone_ref,
      issue_type, issue_description, brokerage_id,
    } = body;

    if (!issue_description || !issue_type) {
      return Response.json({ error: 'issue_type and issue_description are required' }, { status: 400 });
    }

    // Deep LLM solution — real estate escrow expert
    const prompt = `You are a senior real estate escrow resolution expert with 30 years of experience closing difficult transactions. A critical issue has arisen on an escrow. Provide an immediate, actionable solution and a roadmap detour to keep this transaction on track or pivot gracefully.

CONTEXT:
- Property: ${property_address || 'N/A'}
- Escrow #: ${escrow_number || 'N/A'}
- Milestone where issue arose: ${milestone_ref || 'N/A'}
- Issue type: ${issue_type}
- Issue description: ${issue_description}

Respond with:
1. A clear, confident solution narrative (2-4 paragraphs) — what to do RIGHT NOW, who to call, what to say, what documents are needed, and how to protect the client. Be specific and practical, not generic.
2. An ordered list of 3-6 concrete action steps.
3. 1-3 "detour stages" — new interim milestones that should be inserted into the roadmap to resolve this issue before the original path resumes. Each detour stage needs a title, a target due date (YYYY-MM-DD, within the next 30 days from today ${new Date().toISOString().slice(0,10)}), and a responsible party (buyer, seller, escrow_company, lender, title_company, inspector, appraiser, or client_action).

Focus on saving the transaction when possible, but also advise on clean exit strategies if it cannot be saved. D&D is known for timely real estate solutions — be decisive and expert.`;

    const llmRes = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          solution: { type: 'string', description: 'The full solution narrative' },
          action_steps: {
            type: 'array',
            items: { type: 'string' },
            description: 'Ordered concrete action steps'
          },
          detour_stages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                due_date: { type: 'string', description: 'YYYY-MM-DD' },
                responsible_party: { type: 'string' }
              }
            },
            description: 'Interim milestones to insert into the roadmap'
          },
          can_save: { type: 'boolean', description: 'Whether the transaction can likely be saved' },
          urgency: { type: 'string', enum: ['immediate', 'within_24h', 'within_3_days', 'monitor'] }
        }
      },
    });
    const solution = llmRes.data || llmRes;

    // Save the issue with the LLM solution
    const record = await base44.entities.EscrowIssue.create({
      brokerage_id: brokerage_id || user.brokerage_id || user.data?.brokerage_id,
      escrow_number: escrow_number || '',
      property_address: property_address || '',
      milestone_ref: milestone_ref || '',
      issue_type,
      issue_description,
      llm_solution: solution.solution || '',
      suggested_actions: solution.action_steps || [],
      detour_stages: solution.detour_stages || [],
      status: 'solution_offered',
      raised_by_name: user.full_name || user.email || 'Portal User',
      raised_by_role: user.role === 'admin' ? 'admin' : (user.portal_role || user.data?.portal_role || 'broker'),
    });

    return Response.json({
      ok: true,
      issue: record,
      solution: solution.solution,
      action_steps: solution.action_steps,
      detour_stages: solution.detour_stages,
      can_save: solution.can_save,
      urgency: solution.urgency,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}