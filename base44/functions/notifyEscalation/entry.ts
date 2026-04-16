import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });

    const name = data.consumer_name || 'Unknown';
    const question = data.consumer_question || 'No question recorded';
    const priority = (data.priority || 'medium').toUpperCase();
    const page = data.page_context || 'Unknown page';

    await Promise.all(adminUsers.map(admin =>
      base44.asServiceRole.integrations.Core.SendEmail({
        to: admin.email,
        from_name: 'Dyson & Dyson System',
        subject: `🚨 CHARLIE ESCALATION [${priority}] — ${name}`,
        body: `CHARLIE COULDN'T ANSWER — HUMAN NEEDED
==========================================

CONSUMER: ${name}
EMAIL: ${data.consumer_email || 'N/A'}
PAGE: ${page}
PRIORITY: ${priority}

THEIR QUESTION:
"${question}"

CHARLIE'S HANDOFF:
"${data.handoff_response || 'N/A'}"

==========================================
NEXT STEP: Answer this in the dashboard and optionally save to Charlie's knowledge base.
Dashboard: https://dysonrelo.com/admin/charlie-escalations
==========================================`
      })
    ));

    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyEscalation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});