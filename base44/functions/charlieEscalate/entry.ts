import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

// Called by live-voice Charlie (Talking App) when a caller asks something
// Charlie isn't confident answering, or explicitly asks for a human. Logs it
// to the same CharlieEscalation queue the admin dashboard already reviews.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const { question, consumer_name, consumer_email, handoff_response, priority } = await req.json();

    if (!question) {
      return Response.json({ error: 'question is required' }, { status: 400 });
    }

    const escalation = await base44.asServiceRole.entities.CharlieEscalation.create({
      consumer_question: question,
      consumer_name: consumer_name || user?.full_name || '',
      consumer_email: consumer_email || user?.email || '',
      handoff_response: handoff_response || "I've noted that for our team to follow up with you directly.",
      priority: priority || 'medium',
      page_context: 'talking-app-v2v',
      status: 'open',
    });

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    await Promise.all(
      adminUsers.map((admin: any) =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: admin.email,
          from_name: 'Dyson & Dyson System',
          subject: `🚨 Charlie Live Voice Escalation — ${escalation.consumer_name || 'Caller'}`,
          body: `Charlie couldn't fully answer a question during a live V2V call.

CALLER: ${escalation.consumer_name || 'Unknown'}
EMAIL: ${escalation.consumer_email || 'N/A'}
PRIORITY: ${(priority || 'medium').toUpperCase()}

QUESTION:
"${question}"

CHARLIE SAID:
"${escalation.handoff_response}"

Review and reply: https://dysonrelo.com/admin/charlie-escalations`,
        })
      )
    );

    await base44.asServiceRole.entities.CharlieEscalation.update(escalation.id, {
      notifications_sent: { email: true, sms: false, dashboard: true },
    });

    return Response.json({ success: true, escalation_id: escalation.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});