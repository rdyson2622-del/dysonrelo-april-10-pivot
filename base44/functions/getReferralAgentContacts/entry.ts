import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { referral_agent_id } = await req.json();
    if (!referral_agent_id) {
      return Response.json({ error: 'referral_agent_id is required' }, { status: 400 });
    }
    // Public referral agent portal has no login — use service role, scoped strictly
    // to this one agent's own contacts so they (and only they) can see their list.
    const contacts = await base44.asServiceRole.entities.ReferralAgentContact.filter(
      { referral_agent_id },
      '-created_date',
      200
    );
    return Response.json({ contacts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}