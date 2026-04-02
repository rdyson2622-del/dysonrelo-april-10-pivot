import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { source, email, phone, full_name, initial_data } = await req.json();

    if (!source || !['chat_initiation', 'sms_reply'].includes(source)) {
      return Response.json({ error: 'Invalid source' }, { status: 400 });
    }

    // Create OptIn record for real-time tracking
    const optIn = await base44.entities.OptIn.create({
      email,
      phone: phone || undefined,
      full_name: full_name || undefined,
      source,
      opted_in_at: new Date().toISOString(),
      initial_data: initial_data || {},
      status: 'new',
    });

    return Response.json({ success: true, optIn });
  } catch (error) {
    console.error('captureOptIn error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});