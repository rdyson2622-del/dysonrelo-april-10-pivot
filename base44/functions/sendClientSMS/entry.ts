import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { client_id, phone, message, client_name } = await req.json();
    if (!phone || !message) {
      return Response.json({ error: 'phone and message are required' }, { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromPhone) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    const params = new URLSearchParams({
      From: fromPhone,
      To: phone,
      Body: message,
    });

    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const twilioData = await twilioRes.json();
    
    if (!twilioData.sid) {
      console.error('[SMS Error]', twilioData);
      return Response.json({ error: twilioData.message || 'SMS send failed' }, { status: 400 });
    }

    console.log(`[SMS Success] to ${phone}:`, twilioData.sid);
    return Response.json({ success: true, sid: twilioData.sid });

  } catch (error) {
    console.error('[SMS Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});