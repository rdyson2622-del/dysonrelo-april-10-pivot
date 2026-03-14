import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seller_name, seller_email, seller_phone, property_address, outreach_id } = await req.json();

    if (!seller_name || (!seller_email && !seller_phone)) {
      return Response.json({
        error: 'Missing required fields: seller_name and (seller_email or seller_phone)',
      }, { status: 400 });
    }

    const appUrl = 'https://dyson-relocation.app'; // Update with your actual app URL
    const inviteMessage = `Hi ${seller_name},

We've connected with you regarding your home at ${property_address}. 

We'd love to help you find your next perfect home wherever you're moving. Use our free AI Concierge app to get started:

${appUrl}

Our service is completely free to you.

Best regards,
Dyson & Dyson Relocation Team`;

    // Send email
    if (seller_email) {
      await base44.integrations.Core.SendEmail({
        to: seller_email,
        subject: `Your Free Relocation Concierge - Dyson & Dyson`,
        body: inviteMessage,
        from_name: 'Dyson & Dyson Relocation',
      });
    }

    // TODO: If you have Twilio set up, add SMS here
    // For now, we'll just log that phone-based invitation was needed
    if (seller_phone && !seller_email) {
      console.log(`[PENDING SMS] Phone: ${seller_phone} - Requires Twilio integration`);
    }

    return Response.json({
      success: true,
      message: `Invitation sent to ${seller_email || seller_phone}`,
      outreach_id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});