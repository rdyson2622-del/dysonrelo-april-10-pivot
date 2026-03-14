import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import crypto from 'crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { seller_outreach_id, destination_city, destination_state, seller_name, moving_timeline } = await req.json();

    if (!seller_outreach_id || !destination_city || !destination_state) {
      return Response.json({
        error: 'Missing required fields: seller_outreach_id, destination_city, destination_state',
      }, { status: 400 });
    }

    // Use LLM to find top 5 agents in destination city
    const agentSearchResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Find the top 5 real estate agents by sales volume and client reviews in ${destination_city}, ${destination_state}. 
      For each, provide: full name, email, phone, and brokerage firm. 
      Focus on agents with strong relocation experience and high client satisfaction.
      Return as JSON array with fields: name, email, phone, brokerage.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          agents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                brokerage: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const agents = agentSearchResult.agents || [];
    const proposals = [];

    // Create proposal records and send emails
    for (const agent of agents.slice(0, 5)) {
      const proposalToken = crypto.randomUUID();

      // Create ReferralProposal record
      const proposal = await base44.asServiceRole.entities.ReferralProposal.create({
        seller_outreach_id,
        destination_city,
        destination_state,
        agent_name: agent.name,
        agent_email: agent.email,
        agent_phone: agent.phone,
        agent_brokerage: agent.brokerage,
        status: 'sent',
        proposal_token: proposalToken,
      });

      // Send referral proposal email
      const acceptLink = `${Deno.env.get('APP_URL') || 'https://dyson-relocation.app'}/agent-proposal?token=${proposalToken}&action=accept`;
      const rejectLink = `${Deno.env.get('APP_URL') || 'https://dyson-relocation.app'}/agent-proposal?token=${proposalToken}&action=reject`;

      const emailBody = `Subject: Exclusive Relocation Lead - ${seller_name} Moving to ${destination_city}

Dear ${agent.name},

You've been selected as one of 5 top agents to compete for an exclusive relocation lead.

CLIENT: ${seller_name}
MOVING TO: ${destination_city}, ${destination_state}
TIMELINE: ${moving_timeline || 'Not specified'}

REFERRAL TERMS:
• Referral Fee: 25% of commission (acknowledged at offer acceptance)
• Relocation Management Fee: 15% (paid at close of escrow)
• Both fees must be acknowledged and executed in writing

BY ACCEPTING, YOU AGREE TO:
✓ These fee terms (25% referral + 15% management fee)
✓ Full digital agreement execution
✓ Sharing contact details with the client upon selection
✓ Professional relocation-focused service

RESPOND WITHIN 24 HOURS:

👉 ACCEPT OFFER: ${acceptLink}
👉 DECLINE OFFER: ${rejectLink}

The first agent to accept and execute the agreement will be selected as the lead agent. You'll receive client contact info immediately to begin discussions.

Best regards,
Dyson & Dyson Relocation Team`;

      await base44.integrations.Core.SendEmail({
        to: agent.email,
        subject: `Exclusive Relocation Lead - ${seller_name} → ${destination_city}`,
        body: emailBody,
        from_name: 'Dyson & Dyson',
      });

      proposals.push({
        ...proposal,
        acceptLink,
        rejectLink,
      });
    }

    return Response.json({
      success: true,
      proposals_sent: proposals.length,
      proposals,
      seller_outreach_id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});