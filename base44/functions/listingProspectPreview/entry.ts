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
        referral_fee_offered: prospect.referral_fee_offered,
        client_destination: prospect.client_destination,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}