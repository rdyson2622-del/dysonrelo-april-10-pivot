import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint (no login) — powers the personalized listing-agent preview
// page. "get" looks up a prospect by their unique token and marks it viewed.
// "submit_destination" saves the client's move destination the agent enters,
// so it's ready for the follow-up call. "admin_send_email" (admin-only) emails
// the magic link to the listing agent.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { action, token, client_destination, prospect_id } = await req.json();

    if (action === 'admin_send_email') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 403 });
      if (!prospect_id) return Response.json({ error: 'Missing prospect_id' }, { status: 400 });

      const prospect = await base44.asServiceRole.entities.ListingProspect.get(prospect_id);
      if (!prospect) return Response.json({ error: 'Not found' }, { status: 404 });
      if (!prospect.agent_email) return Response.json({ error: 'No email on file for this agent' }, { status: 400 });

      const origin = req.headers.get('origin') || req.headers.get('referer') || '';
      const baseUrl = origin ? new URL(origin).origin : '';
      const previewUrl = `${baseUrl}/agent-preview/${prospect.token}`;
      const listingLabel = [prospect.listing_address, prospect.city].filter(Boolean).join(', ');

      const market = prospect.city || 'your market';

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: prospect.agent_email,
        subject: `Congratulations on your recent escrow — take a look at DysonRelo`,
        body: `Hi ${prospect.agent_name},\n\nCongratulations on getting your listing into escrow${listingLabel ? ` at ${listingLabel}` : ''}! Navigating a transaction like this in ${market} takes serious expertise, and getting it under contract is a huge win.\n\nAs your sellers prepare for their next chapter, I want to share a strategy that top-producing agents use to maximize their outbound referrals.\n\nWhen your clients are moving out of the area, sending them directly to an unknown agent leaves their experience — and your reputation — up to chance. By routing your referrals through Dyson Relo, you guarantee a premium, white-glove experience for your client while significantly increasing your own compensation.\n\nHere is why agents in our network prefer using a dedicated relocation company over direct agent-to-agent handoffs:\n\nHigher Referral Compensation: You earn a larger referral fee than standard broker-to-broker splits.\n\nEnd-to-End Move Management: We act as a full-service concierge, managing your client's entire relocation process — from moving logistics to destination settling — so you don't have to.\n\nComplete Transparency: You are never left in the dark. We keep you strictly in the loop from the moment they leave your market until they close in their new one.\n\nTake a moment to review the DysonRelo platform here: ${previewUrl}\n\nJoining our network also means you become eligible to receive pre-qualified, inbound buyer leads moving into your territory.\n\nIf your current escrow clients are relocating out of the area, I would love to connect for five minutes this week to discuss how we can manage their move and secure your referral fee.\n\nBest regards,\n${prospect.rep_name || 'The Dyson Relo Team'}\nDyson Relo`,
        from_name: prospect.rep_name ? `${prospect.rep_name} — Dyson Relo` : 'Dyson Relo',
      });

      await base44.asServiceRole.entities.ListingProspect.update(prospect.id, {
        status: prospect.status === 'queued' ? 'contacted' : prospect.status,
        contacted_at: new Date().toISOString(),
      });

      return Response.json({ success: true });
    }

    if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

    const matches = await base44.asServiceRole.entities.ListingProspect.filter({ token });
    const prospect = matches[0];
    if (!prospect) return Response.json({ error: 'Not found' }, { status: 404 });

    if (action === 'submit_destination') {
      await base44.asServiceRole.entities.ListingProspect.update(prospect.id, {
        client_destination: (client_destination || '').slice(0, 1000),
        status: 'responded',
      });
      return Response.json({ success: true });
    }

    // "claim" — the agent just set a password and verified their email on
    // the frontend (register + OTP). This converts their temporary preview
    // profile into a permanent Relo Agent partner record, with their
    // current listing noted so it's ready as their first active project.
    if (action === 'claim') {
      await base44.asServiceRole.entities.ListingProspect.update(prospect.id, { status: 'converted' });

      const listingLabel = [prospect.listing_address, prospect.city].filter(Boolean).join(', ');
      const partnerPayload = {
        agent_name: prospect.agent_name,
        email: prospect.agent_email,
        phone: prospect.agent_phone,
        brokerage: prospect.brokerage,
        dre_number: prospect.dre_number,
        status: 'active',
        notes: `Claimed via listing preview${listingLabel ? ' — ' + listingLabel : ''}`,
        onboarded_at: new Date().toISOString(),
      };

      if (prospect.agent_email) {
        const existing = await base44.asServiceRole.entities.PartnerAgent.filter({ email: prospect.agent_email });
        if (existing[0]) {
          await base44.asServiceRole.entities.PartnerAgent.update(existing[0].id, partnerPayload);
        } else {
          await base44.asServiceRole.entities.PartnerAgent.create(partnerPayload);
        }
      }

      return Response.json({ success: true, listing_label: listingLabel });
    }

    // Default: "get" — return only the display fields, mark as previewed
    if (prospect.status === 'queued' || prospect.status === 'contacted') {
      await base44.asServiceRole.entities.ListingProspect.update(prospect.id, {
        status: 'previewed',
        previewed_at: new Date().toISOString(),
      });
    }

    return Response.json({
      success: true,
      prospect: {
        agent_name: prospect.agent_name,
        brokerage: prospect.brokerage,
        city: prospect.city,
        listing_address: prospect.listing_address,
        listing_value: prospect.listing_value,
        photo_url: prospect.photo_url,
        bedrooms: prospect.bedrooms,
        bathrooms: prospect.bathrooms,
        sqft: prospect.sqft,
        listing_description: prospect.listing_description,
        referral_fee_offered: prospect.referral_fee_offered,
        client_destination: prospect.client_destination,
        dre_number: prospect.dre_number,
        agent_phone: prospect.agent_phone,
        agent_email: prospect.agent_email,
        rep_name: prospect.rep_name,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}