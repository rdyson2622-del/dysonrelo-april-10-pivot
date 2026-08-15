import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const accountSid = (Deno.env.get('TWILIO_ACCOUNT_SID') || '').trim();
    const authToken = (Deno.env.get('TWILIO_AUTH_TOKEN') || '').trim();

    console.log('=== TWILIO DEBUG ===');
    console.log('SID length:', accountSid.length, '| first4:', accountSid.substring(0, 4));
    console.log('Token length:', authToken.length);

    if (!accountSid || !authToken) {
      return Response.json({ error: 'Twilio credentials missing' }, { status: 400 });
    }

    const credentials = btoa(`${accountSid}:${authToken}`);
    const accountUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`;

    const accountRes = await fetch(accountUrl, {
      headers: { 'Authorization': `Basic ${credentials}` },
    });

    const accountData = await accountRes.json();
    console.log('Twilio response status:', accountRes.status);

    if (!accountRes.ok) {
      return Response.json({
        error: 'Twilio API error',
        status: accountRes.status,
        message: accountData.message || accountData.error_message,
        sid_used: accountSid.substring(0, 8) + '...',
      }, { status: 400 });
    }

    const balanceRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Balance.json`,
      { headers: { 'Authorization': `Basic ${credentials}` } }
    );
    const balanceData = await balanceRes.json();

    return Response.json({
      success: true,
      account: {
        sid: accountData.sid,
        friendly_name: accountData.friendly_name,
        status: accountData.status,
        type: accountData.type,
      },
      balance: {
        balance: balanceData.balance,
        currency: balanceData.currency,
      },
      health: {
        is_active: accountData.status === 'active',
        has_balance: parseFloat(balanceData.balance) > 0,
        message:
          accountData.status !== 'active' ? `⚠️ Account status: ${accountData.status}` :
          parseFloat(balanceData.balance) <= 0 ? '⚠️ Account has no balance' :
          '✓ Account is active and has balance',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});