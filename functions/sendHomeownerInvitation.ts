import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Verify we have the seller outreach data
    if (!data) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    const { seller_name, seller_phone, seller_email, property_address } = data;

    if (!seller_phone && !seller_email) {
      return Response.json({ error: 'No phone or email to contact seller' }, { status: 400 });
    }

    // Send SMS if phone exists
    if (seller_phone) {
      const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
      }

      const smsBody = `Hi ${seller_name}! We're Dyson & Dyson Relocation. We help families relocate with an AI concierge + top local agents—at zero cost to you. Chat with us: https://dyson-relocation.app/chat`;

      const formData = new FormData();
      formData.append('Body', smsBody);
      formData.append('From', twilioPhoneNumber);
      formData.append('To', seller_phone);

      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
          },
          body: formData,
        }
      );

      if (!twilioResponse.ok) {
        const error = await twilioResponse.json();
        console.error('Twilio SMS error:', error);
      }
    }

    // Send email if email exists
    if (seller_email) {
      await base44.integrations.Core.SendEmail({
        to: seller_email,
        subject: 'Free Relocation Help for Your Home Sale',
        body: `Hi ${seller_name},

We noticed your home at ${property_address} is listed for sale. 

We're Dyson & Dyson Relocation—we help families relocate with:
✓ AI Concierge (Charlie) available 24/7
✓ Free neighborhood research & city guides
✓ Hand-matched local agents in your destination city
✓ Complete moving coordination
✓ Schools, healthcare, utilities setup

All 100% free to you as the buyer.

Let's talk about your relocation:
https://dyson-relocation.app/chat

Best regards,
Dyson & Dyson Relocation Team`,
        from_name: 'Dyson & Dyson',
      });
    }

    return Response.json({
      success: true,
      message: `Invitation sent to ${seller_name} via ${seller_phone ? 'SMS' : ''}${seller_phone && seller_email ? ' and ' : ''}${seller_email ? 'email' : ''}`,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});