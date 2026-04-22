import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, full_name, source, partner_agent_id, partner_agent_name } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await base44.asServiceRole.entities.DnnSubscriber.filter({ email });

    if (existing.length > 0) {
      const sub = existing[0];
      if (sub.unsubscribed) {
        // Re-subscribe
        await base44.asServiceRole.entities.DnnSubscriber.update(sub.id, {
          unsubscribed: false,
          last_engaged: new Date().toISOString(),
          source: source || sub.source,
        });
        return Response.json({ success: true, action: 'resubscribed' });
      }
      return Response.json({ success: true, action: 'already_subscribed' });
    }

    // Create new subscriber
    await base44.asServiceRole.entities.DnnSubscriber.create({
      email,
      full_name: full_name || '',
      tier: 'tier1',
      source: source || 'direct',
      partner_agent_id: partner_agent_id || null,
      partner_agent_name: partner_agent_name || null,
      subscribed_at: new Date().toISOString(),
      last_engaged: new Date().toISOString(),
      is_hot_lead: false,
      unsubscribed: false,
    });

    return Response.json({ success: true, action: 'subscribed' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});