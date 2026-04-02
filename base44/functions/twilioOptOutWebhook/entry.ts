import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse incoming webhook data from Twilio
    const body = await req.text();
    const params = new URLSearchParams(body);
    
    const messageStatus = params.get('MessageStatus');
    const fromNumber = params.get('From');
    const toNumber = params.get('To');
    const messageBody = params.get('Body')?.toUpperCase() || '';
    
    // Twilio sends opt-out notifications via MessageStatus='failed' with specific error codes
    // or when message body contains "STOP"
    if (messageStatus === 'failed' || messageBody.includes('STOP') || messageBody.includes('UNSUBSCRIBE')) {
      // Record the opt-out
      await base44.asServiceRole.entities.OptOut.create({
        phone: fromNumber,
        source: 'twilio_sms',
        opted_out_at: new Date().toISOString(),
        reason: messageStatus === 'failed' ? 'Failed delivery' : 'User sent STOP'
      });
      
      return Response.json({ success: true, message: 'Opt-out recorded' });
    }
    
    return Response.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});