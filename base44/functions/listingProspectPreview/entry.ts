import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint (no login) — powers the personalized listing-agent preview
// page. "get" looks up a prospect by their unique token and marks it viewed.
// "submit_destination" saves the client's move destination the agent enters,
// so it's ready for the follow-up call.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { action, token, client_destination } = await req.json();

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
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}