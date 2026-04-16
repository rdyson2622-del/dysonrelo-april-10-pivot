import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });

    const name = data.full_name || data.email || 'Unknown';
    const phone = data.phone || 'No phone';
    const source = data.source || 'unknown';

    await Promise.all(adminUsers.map(admin =>
      base44.asServiceRole.integrations.Core.SendEmail({
        to: admin.email,
        from_name: 'Dyson & Dyson System',
        subject: `🙋 NEW OPT-IN — ${name}`,
        body: `NEW OPT-IN ALERT
==========================================

NAME: ${name}
PHONE: ${phone}
EMAIL: ${data.email || 'N/A'}
SOURCE: ${source}
OPTED IN AT: ${data.opted_in_at || new Date().toISOString()}

==========================================
NEXT STEP: Follow up personally at (858) 353-1200 or reply to their message.
Dashboard: https://dysonrelo.com/admin/opt-ins
==========================================`
      })
    ));

    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyOptIn error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});