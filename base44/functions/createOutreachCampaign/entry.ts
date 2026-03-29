import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Creates an OwnerOutreachCampaign record when an SMS is first sent to a ListingOwner
// Called automatically by sendOwnerOutreachSMS or manually

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { listing_owner_id } = await req.json();
    if (!listing_owner_id) {
      return Response.json({ error: 'Missing listing_owner_id' }, { status: 400 });
    }

    const owner = await base44.asServiceRole.entities.ListingOwner.get(listing_owner_id);
    if (!owner) {
      return Response.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Check if campaign already exists
    const existing = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({ listing_owner_id });
    if (existing.length > 0) {
      return Response.json({ success: true, campaign: existing[0], already_existed: true });
    }

    const campaign = await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
      listing_owner_id,
      owner_name: owner.owner_name,
      owner_phone: owner.phone,
      property_address: owner.property_address,
      listing_price: owner.listing_price,
      workflow_stage: 'outreach',
      sms_sent_date: new Date().toISOString(),
      notes: `[${new Date().toLocaleDateString()}] Campaign created. Initial SMS sent.`,
    });

    return Response.json({ success: true, campaign, already_existed: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});