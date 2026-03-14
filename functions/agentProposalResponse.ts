import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { token, action } = await req.json();

    if (!token || !['accept', 'reject'].includes(action)) {
      return Response.json({
        error: 'Missing or invalid token/action',
      }, { status: 400 });
    }

    // Find proposal by token
    const proposals = await base44.asServiceRole.entities.ReferralProposal.filter({
      proposal_token: token,
    });

    if (!proposals || proposals.length === 0) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 404 });
    }

    const proposal = proposals[0];

    if (action === 'reject') {
      // Mark as rejected
      await base44.asServiceRole.entities.ReferralProposal.update(proposal.id, {
        status: 'rejected',
        response_date: new Date().toISOString().split('T')[0],
      });

      // Notify other agents this slot is available
      return Response.json({
        success: true,
        message: 'You have declined this referral opportunity.',
      });
    }

    // Accept: request fee acknowledgment & agreement
    if (action === 'accept') {
      // For now, just mark as accepted. In production, you'd require digital signature
      await base44.asServiceRole.entities.ReferralProposal.update(proposal.id, {
        status: 'accepted',
        response_date: new Date().toISOString().split('T')[0],
        referral_fee_acknowledged: true,
        mgmt_fee_acknowledged: true,
        agreement_executed: true,
      });

      // Get the seller outreach to find agent contact
      const outreach = await base44.asServiceRole.entities.SellerOutreach.filter({
        id: proposal.seller_outreach_id,
      });

      if (outreach && outreach[0]) {
        // Create AgentReferral record
        await base44.asServiceRole.entities.AgentReferral.create({
          seller_outreach_id: proposal.seller_outreach_id,
          list_agent_name: proposal.agent_name,
          list_agent_email: proposal.agent_email,
          list_agent_phone: proposal.agent_phone,
          broker_name: proposal.agent_brokerage,
          referral_fee_percent: 25,
          relocation_mgmt_fee_percent: 15,
          referral_status: 'agreed',
          referral_agreement_sent: new Date().toISOString().split('T')[0],
        });

        // Mark other proposals as withdrawn (only one agent wins)
        const otherProposals = await base44.asServiceRole.entities.ReferralProposal.filter({
          seller_outreach_id: proposal.seller_outreach_id,
        });

        for (const other of otherProposals) {
          if (other.id !== proposal.id && other.status === 'sent') {
            await base44.asServiceRole.entities.ReferralProposal.update(other.id, {
              status: 'withdrawn',
            });

            // Notify other agents they didn't win
            await base44.integrations.Core.SendEmail({
              to: other.agent_email,
              subject: 'Referral Update: Lead Assigned',
              body: `We've assigned the ${outreach[0].property_address} referral to another agent. We appreciate your interest and will keep you in mind for future opportunities.`,
              from_name: 'Dyson & Dyson',
            });
          }
        }

        // Notify winning agent with seller contact info
        await base44.integrations.Core.SendEmail({
          to: proposal.agent_email,
          subject: `🎉 You've Been Selected! Client Contact Info`,
          body: `Congratulations! You've been selected as the agent for this relocation.

SELLER INFO:
Name: ${outreach[0].seller_name}
Phone: ${outreach[0].seller_phone}
Email: ${outreach[0].seller_email}
Current Property: ${outreach[0].property_address}
Moving To: ${outreach[0].seller_moving_destination}

Please reach out to them immediately to begin the relocation process. They're expecting your contact.

Your 25% referral fee + 15% relocation management fee will be paid at close of escrow.

Best regards,
Dyson & Dyson`,
          from_name: 'Dyson & Dyson',
        });
      }

      return Response.json({
        success: true,
        message: 'You have accepted the referral. Client contact info has been sent to your email.',
      });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});