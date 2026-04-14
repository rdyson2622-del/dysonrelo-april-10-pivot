import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    // Auth check skipped for credential test

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')?.trim();
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')?.trim();
    console.log('SID starts with:', accountSid?.substring(0, 4), 'SID length:', accountSid?.length);
    console.log('Token length:', authToken?.length);

    if (!accountSid || !authToken) {
      return Response.json({ error: 'Twilio credentials missing' }, { status: 400 });
    }

    // Check account status
    const accountUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`;
    const accountRes = await fetch(accountUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      },
    });

    const accountData = await accountRes.json();

    if (!accountRes.ok) {
      return Response.json({
        error: 'Twilio API error',
        status: accountRes.status,
        message: accountData.message || accountData.error_message,
      }, { status: 400 });
    }

    // Check balance
    const balanceUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Balance.json`;
    const balanceRes = await fetch(balanceUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      },
    });

    const balanceData = await balanceRes.json();

    return Response.json({
      success: true,
      account: {
        sid: accountData.sid,
        friendly_name: accountData.friendly_name,
        status: accountData.status,
        type: accountData.type,
        date_created: accountData.date_created,
        date_updated: accountData.date_updated,
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
          parseFloat(balanceData.balance) <= 0 ? '⚠️ Account has no balance (zero credits)' :
          '✓ Account is active and has balance',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});