import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This function is called by automation when:
// 1. A new ChatMessage is created with role="user"
// 2. A new Communication arrives (inbound)
// It fires an SMS to the admin phone for immediate awareness.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
    const adminPhone = Deno.env.get('ADMIN_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromPhone || !adminPhone) {
      console.log('Missing Twilio credentials or ADMIN_PHONE_NUMBER secret');
      return Response.json({ error: 'Missing config' }, { status: 500 });
    }

    // Figure out what happened
    const event = payload?.event;
    const data = payload?.data;

    let alertText = '';

    if (event?.entity_name === 'ChatMessage') {
      // Charlie chat message from a user
      const clientId = data?.client_id;
      const content = data?.content || '(no message)';

      // Try to get client name
      let clientName = 'Unknown Client';
      if (clientId) {
        try {
          const client = await base44.asServiceRole.entities.RelocationClient.get(clientId);
          clientName = client?.full_name || clientName;
        } catch(e) {}
      }

      alertText = `🔔 DYSON RELO ALERT\nNew message from: ${clientName}\n"${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"\n\nReply at: dysonrelo.com/admin/client-detail?id=${clientId || ''}`;

    } else if (event?.entity_name === 'Communication') {
      const recipientName = data?.recipient_name || 'Someone';
      const content = data?.message_content || '(no message)';
      const type = data?.communication_type?.toUpperCase() || 'MSG';
      alertText = `🔔 DYSON RELO ALERT\nNew ${type} from: ${recipientName}\n"${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"\n\nCheck the communication log now.`;
    } else {
      // Generic / manual call
      alertText = payload?.message || '🔔 New activity in Dyson Relo — check your admin panel.';
    }

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
    console.log('Admin SMS result:', result.sid ? 'SENT' : result.message);

    return Response.json({ success: !!result.sid, sid: result.sid });
  } catch (error) {
    console.error('notifyAdmin error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});