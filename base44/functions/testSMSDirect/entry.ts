import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    const { to, message } = await req.json();

    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    const params = new URLSearchParams({ From: fromPhone, To: to, Body: message });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: { Authorization: `Basic ${twilioAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    );
    const result = await res.json();
    console.log('SMS result:', JSON.stringify(result));
    return Response.json({ success: !!result.sid, sid: result.sid, error: result.message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});