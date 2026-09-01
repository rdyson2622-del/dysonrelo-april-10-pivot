import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { sendViaResend } from '../../shared/resendEmail.ts';

// Sends a single page/video link to one recipient via SMS (Twilio) or
// email (Resend). Used by the Admin "Quick Send" tool.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { channel, to, recipient_name, subject, message } = await req.json();
    if (!channel || !to || !message) {
      return Response.json({ error: 'channel, to, and message are required' }, { status: 400 });
    }

    if (channel === 'sms') {
      const accountSid = secrets.get('TWILIO_ACCOUNT_SID');
      const authToken = secrets.get('TWILIO_AUTH_TOKEN');
      const fromNumber = secrets.get('TWILIO_PHONE_NUMBER');

      const params = new URLSearchParams({ From: fromNumber, To: to, Body: message });
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = await res.json();
      if (!res.ok || !data.sid) {
        return Response.json({ error: data.message || 'Twilio error' }, { status: 500 });
      }

      await base44.asServiceRole.entities.Communication.create({
        communication_type: 'sms',
        recipient_name: recipient_name || to,
        recipient_phone: to,
        message_content: message,
        sent_date: new Date().toISOString(),
        status: 'sent',
      });

      return Response.json({ success: true, sid: data.sid });
    }

    if (channel === 'email') {
      const html = message.replace(/\n/g, '<br>');
      await sendViaResend({ to, subject: subject || 'A message from Dyson & Dyson', html });

      await base44.asServiceRole.entities.Communication.create({
        communication_type: 'email',
        recipient_name: recipient_name || to,
        recipient_email: to,
        message_content: message,
        sent_date: new Date().toISOString(),
        status: 'sent',
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: 'channel must be "sms" or "email"' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}