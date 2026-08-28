import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secrets.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Dyson Relo <bob@dysonrelo.com>',
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.message || 'Resend request failed', details: data }, { status: response.status });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}