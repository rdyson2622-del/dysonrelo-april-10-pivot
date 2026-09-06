import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * replyToRealEstateRequest — admin sends a personal reply back to whoever
 * submitted a "Talk to us" request. Emails the requester (if we have an
 * email on file) and saves the reply on the record so it shows in the
 * admin request library.
 *
 * Payload: { id, reply_text }
 */
export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, reply_text } = await req.json().catch(() => ({}));
    if (!id || !reply_text?.trim()) {
      return Response.json({ error: 'id and reply_text are required' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.RealEstateRequest.get(id);
    if (!record) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }

    let emailSent = false;
    if (record.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: record.email,
        subject: "A reply from your Dyson & Dyson team",
        body: `Hi ${record.full_name || 'there'},\n\nRegarding your message: "${record.request_text}"\n\n${reply_text.trim()}\n\n— The Dyson & Dyson Team`,
        from_name: 'Dyson & Dyson',
      });
      emailSent = true;
    }

    const updated = await base44.asServiceRole.entities.RealEstateRequest.update(id, {
      admin_reply: reply_text.trim(),
      replied_at: new Date().toISOString(),
      replied_by: user.email,
    });

    return Response.json({ success: true, email_sent: emailSent, request: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}