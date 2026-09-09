import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const action = payload.action || 'status';

    const resendApiKey = secrets.get('RESEND_API_KEY');
    const twilioSid = secrets.get('TWILIO_ACCOUNT_SID');
    const twilioToken = secrets.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = secrets.get('TWILIO_PHONE_NUMBER');
    const adminPhone = secrets.get('ADMIN_PHONE_NUMBER');

    // Action 1: Send a live diagnostic test email
    if (action === 'send_test_email') {
      const targetEmail = payload.to || 'bob@dysonrelo.com';
      if (!resendApiKey) {
        return Response.json({ error: 'RESEND_API_KEY is not configured' }, { status: 400 });
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Bob Dyson • DysonRelo <bob@dysonrelo.com>',
          to: targetEmail,
          subject: `DysonRelo Test Email to ${targetEmail} • ${new Date().toLocaleTimeString('en-US')}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #D4AF37; border-radius: 12px; background: #fff;">
              <h2 style="color: #0a0a0a; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">DysonRelo Communications Test</h2>
              <p>This is a live diagnostic test email sent from <strong>bob@dysonrelo.com</strong> via Resend.</p>
              <p><strong>Recipient:</strong> ${targetEmail}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <div style="background: #fdf6e9; border: 1px solid #D4AF37; padding: 12px; border-radius: 8px; margin-top: 16px;">
                <p style="margin: 0; font-size: 13px; color: #854d0e;">
                  <strong>Note on Incoming Delivery:</strong> If your DNS MX records point to Microsoft 365 (outlook.com), this email will land in your Microsoft 365 / GoDaddy Webmail inbox for bob@dysonrelo.com.
                </p>
              </div>
            </div>
          `,
        }),
      });

      const resendData = await resendRes.json();
      return Response.json({
        success: resendRes.ok,
        status: resendRes.status,
        resend: resendData,
      });
    }

    // Action 2: Check overall status (Resend, DNS MX, Twilio)
    let resendDomain = null;
    let resendError = null;
    if (resendApiKey) {
      try {
        const dRes = await fetch('https://api.resend.com/domains', {
          headers: { 'Authorization': `Bearer ${resendApiKey}` },
        });
        if (dRes.ok) {
          const dData = await dRes.json();
          resendDomain = (dData.data || []).find((d: any) => d.name === 'dysonrelo.com') || null;
        } else {
          resendError = `Resend API returned status ${dRes.status}`;
        }
      } catch (err: any) {
        resendError = err.message;
      }
    }

    // DNS MX query via Google Public DNS HTTPS
    let mxRecords: any[] = [];
    try {
      const dnsRes = await fetch('https://dns.google/resolve?name=dysonrelo.com&type=MX');
      if (dnsRes.ok) {
        const dnsData = await dnsRes.json();
        mxRecords = (dnsData.Answer || []).map((ans: any) => ({
          exchange: ans.data,
          ttl: ans.TTL,
        }));
      }
    } catch (e: any) {
      mxRecords = [{ error: e.message }];
    }

    // Twilio Check
    let twilioStatus: any = { configured: !!(twilioSid && twilioToken) };
    if (twilioSid && twilioToken) {
      try {
        const auth = btoa(`${twilioSid.trim()}:${twilioToken.trim()}`);
        const [accRes, balRes] = await Promise.all([
          fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid.trim()}.json`, {
            headers: { 'Authorization': `Basic ${auth}` },
          }),
          fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid.trim()}/Balance.json`, {
            headers: { 'Authorization': `Basic ${auth}` },
          }),
        ]);

        if (accRes.ok) {
          const accData = await accRes.json();
          twilioStatus.accountName = accData.friendly_name;
          twilioStatus.status = accData.status;
        }
        if (balRes.ok) {
          const balData = await balRes.json();
          twilioStatus.balance = balData.balance;
          twilioStatus.currency = balData.currency;
        }
        twilioStatus.phoneNumber = twilioNumber ? twilioNumber.replace(/.(?=.{4})/g, '*') : 'Configured';
        twilioStatus.adminPhone = adminPhone || '(858) 353-1200';
      } catch (err: any) {
        twilioStatus.error = err.message;
      }
    }

    return Response.json({
      success: true,
      email: {
        address: 'bob@dysonrelo.com',
        domain: 'dysonrelo.com',
        sending: {
          provider: 'Resend',
          status: resendDomain ? resendDomain.status : 'unknown',
          sendingEnabled: resendDomain?.capabilities?.sending === 'enabled',
          resendDomain,
          error: resendError,
        },
        receiving: {
          mxRecords,
          detectedHost: mxRecords.some(m => typeof m.exchange === 'string' && m.exchange.includes('outlook')) 
            ? 'Microsoft 365 / Outlook (GoDaddy)' 
            : mxRecords.some(m => typeof m.exchange === 'string' && m.exchange.includes('google')) 
            ? 'Google Workspace'
            : 'Custom / Other',
          explanation: 'Incoming emails to bob@dysonrelo.com are routed by DNS MX directly to Microsoft 365 Outlook. If you sent a test email from an external account, it arrives in your Microsoft 365 / GoDaddy Webmail inbox for bob@dysonrelo.com.',
        },
      },
      text: {
        provider: 'Twilio',
        status: twilioStatus,
        webhookUrl: 'https://dyson-relo-april-10-pivot-5ef050c4.base44.app/functions/twilioInboundSMS',
        inboundConfigured: true,
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}