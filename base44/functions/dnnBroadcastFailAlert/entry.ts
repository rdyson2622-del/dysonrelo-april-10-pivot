// Entity-automation handler: fires when a DnnBroadcast record's status
// changes to "failed". Sends an immediate SMS alert to the admin phone.

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const data = payload?.data;

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
    const adminPhone = Deno.env.get('ADMIN_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromPhone || !adminPhone) {
      console.log('Missing Twilio credentials or ADMIN_PHONE_NUMBER secret');
      return Response.json({ error: 'Missing config' }, { status: 500 });
    }

    const date = data?.broadcast_date || 'unknown date';
    const err = (data?.errorMessage || 'No error details recorded').slice(0, 160);

    const alertText = `🚨 DNN BROADCAST RENDER FAILED\nBroadcast: ${date}\nError: ${err}\n\nFix it at: dysonrelo.com/admin/dnn/studio`;

    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    const params = new URLSearchParams({ From: fromPhone, To: adminPhone, Body: alertText });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: { Authorization: `Basic ${twilioAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    );
    const result = await res.json();
    console.log('Broadcast fail alert SMS:', result.sid ? 'SENT' : result.message);

    return Response.json({ success: !!result.sid, sid: result.sid });
  } catch (error) {
    console.error('dnnBroadcastFailAlert error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});