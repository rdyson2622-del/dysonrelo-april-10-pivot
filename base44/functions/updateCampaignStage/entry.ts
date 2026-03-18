import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { campaign_id, new_stage, destination_city, destination_state, destination_price_range, timeline, notes } = await req.json();

    const validStages = ['outreach', 'response', 'profile_complete', 'processing', 'closed'];
    if (!validStages.includes(new_stage)) {
      return Response.json({ error: 'Invalid stage' }, { status: 400 });
    }

    const updateData = {
      workflow_stage: new_stage
    };

    // Add optional fields if provided
    if (new_stage === 'response' && destination_city) {
      updateData.destination_city = destination_city;
      updateData.destination_state = destination_state;
      updateData.destination_price_range = destination_price_range;
      updateData.timeline = timeline;
      updateData.response_date = new Date().toISOString();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const campaign = await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaign_id, updateData);

    return Response.json({
      success: true,
      campaign,
      message: `Campaign moved to ${new_stage}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});