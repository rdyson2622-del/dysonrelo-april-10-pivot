import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendViaResend } from '../../shared/resendEmail.ts';

// Sends email via Resend — for reaching external, non-registered addresses
// (affiliate agents, HR contacts, inactive agents, client lists) that the
// built-in SendEmail integration can't reach.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { to, subject, html, from } = await req.json();
    if (!to || !subject || !html) {
      return Response.json({ error: 'to, subject, and html are required' }, { status: 400 });
    }

    const data = await sendViaResend({ to, subject, html, from });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}