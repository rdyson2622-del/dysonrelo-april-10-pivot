import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * agentInviteCampaign — sends personalized email + SMS invitations
 * to VettedPartner agents, inviting them to subscribe to DNN and
 * join the Dyson Relocation Network.
 *
 * POST body:
 *   { action: "send" }           → send to all pending agents
 *   { action: "send", dryRun: true } → preview without sending
 *   { action: "status" }        → return campaign summary
 */

const SUBSCRIBE_URL = 'https://1dnn.com/agent-subscribe';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, dryRun } = body || {};
    const Partners = base44.asServiceRole.entities.VettedPartner;

    if (action === 'status') {
      const all = await Partners.list('-created_date', 500);
      const pending = all.filter(p => p.status === 'pending' || !p.status);
      const contacted = all.filter(p => p.status === 'contacted');
      const converted = all.filter(p => p.status === 'converted');
      const withEmail = all.filter(p => p.email && p.email !== 'Email' && p.email.includes('@'));
      return Response.json({
        total: all.length,
        pending: pending.length,
        contacted: contacted.length,
        converted: converted.length,
        withValidEmail: withEmail.length,
      });
    }

    if (action !== 'send') {
      return Response.json({ error: 'Unknown action' }, { status: 400 });
    }

    // Fetch all pending agents
    const all = await Partners.list('-created_date', 500);
    const targets = all.filter(p =>
      (p.status === 'pending' || !p.status) &&
      p.email && p.email !== 'Email' && p.email.includes('@') &&
      p.agent_name && p.agent_name !== 'Agent Name'
    );

    if (dryRun) {
      return Response.json({
        dryRun: true,
        targetCount: targets.length,
        sample: targets.slice(0, 3).map(t => ({ name: t.agent_name, email: t.email, city: t.city, state: t.state })),
      });
    }

    // Get Gmail access token for sending emails
    let gmailToken = null;
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('gmail');
      gmailToken = conn.accessToken;
    } catch (e) {
      console.log('Gmail connector not available:', e.message);
    }

    // Twilio config
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

    const results = { emailed: 0, smsSent: 0, failed: 0, errors: [] };

    for (const agent of targets) {
      const subscribeLink = `${SUBSCRIBE_URL}?name=${encodeURIComponent(agent.agent_name)}&email=${encodeURIComponent(agent.email)}&phone=${encodeURIComponent(agent.phone || '')}&brokerage=${encodeURIComponent(agent.brokerage || '')}&city=${encodeURIComponent(agent.city || '')}&state=${encodeURIComponent(agent.state || '')}`;

      // Send email via Gmail API
      if (gmailToken) {
        try {
          const subject = `${agent.agent_name}, You're Invited to Join the Dyson Relocation Network`;
          const textBody = `Dear ${agent.agent_name},

You've been hand-selected from a review of top-producing independent agents in ${agent.city || ''}${agent.state ? ', ' + agent.state : ''} to join the Dyson & Dyson Relocation Network.

We're building a national network of boutique independent brokerages — no Compass, no franchises — to serve the $1.5M-$6M relocation market across all 50 states.

As a network agent, you'll receive:
• The DNN Real Estate News broadcast every morning — for you and your clients
• Pre-qualified relocation client referrals (your 25% fee is protected)
• National exposure through our broadcast and intelligence platform

Subscribe here to activate your membership:
${subscribeLink}

There is no cost to subscribe. You'll receive the morning broadcast starting tomorrow.

Best regards,
The Dyson & Dyson Team`;

          const rawMessage = btoa(
            `From: Dyson & Dyson <noreply@1dnn.com>\r\n` +
            `To: ${agent.email}\r\n` +
            `Subject: ${subject}\r\n` +
            `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
            textBody
          ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

          const emailRes = await fetch(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${gmailToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ raw: rawMessage }),
            }
          );
          if (emailRes.ok) {
            results.emailed++;
          } else {
            const errText = await emailRes.text();
            results.errors.push(`${agent.agent_name} email: ${errText.slice(0, 100)}`);
          }
        } catch (e) {
          results.errors.push(`${agent.agent_name} email: ${e.message}`);
        }
      }

      // Send SMS via Twilio
      if (twilioSid && twilioToken && twilioFrom && agent.phone) {
        try {
          const cleanPhone = agent.phone.replace(/[^\d+]/g, '');
          const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
          const smsBody = `${agent.agent_name}, you've been selected to join the Dyson Relocation Network. Subscribe to receive daily DNN real estate news + client referrals: ${subscribeLink}. Reply STOP to opt out.`;

          const smsRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                From: twilioFrom,
                To: formattedPhone,
                Body: smsBody,
              }),
            }
          );
          if (smsRes.ok) {
            results.smsSent++;
          } else {
            const errText = await smsRes.text();
            results.errors.push(`${agent.agent_name} sms: ${errText.slice(0, 100)}`);
          }
        } catch (e) {
          results.errors.push(`${agent.agent_name} sms: ${e.message}`);
        }
      }

      // Mark as contacted
      try {
        await Partners.update(agent.id, { status: 'contacted' });
      } catch (e) {
        // non-fatal
      }

      // Rate limit: 500ms between sends
      await new Promise(r => setTimeout(r, 500));
    }

    return Response.json({
      success: true,
      targets: targets.length,
      ...results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});