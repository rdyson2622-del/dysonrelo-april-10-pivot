import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * dnnAudienceDistribute — Sends a finished DNN broadcast to a B2B audience
 * (e.g., Corporate HR Managers) via Gmail.
 *
 * Body:
 *   { broadcast_id, audience_id, subject?, preheader?, channels?: ['email'] }
 *
 * - Fetches all active AudienceContact records for the given audience_id.
 * - Sends a personalized email to each contact via the connected Gmail account.
 * - Skips contacts with status 'bounced' or 'unsubscribed', or missing email.
 * - Records each send in the broadcast's distribution array (channel: 'subscriber_email'
 *   with recipient = contact name + email).
 * - Returns per-contact send results + aggregate counts.
 *
 * Auth: admin session.
 */

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function toBase64Url(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function encodeHeader(str) {
  if (/^[\x00-\x7F]*$/.test(str)) return str;
  return `=?UTF-8?B?${utf8ToBase64(str)}?=`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { broadcast_id, audience_id } = body;
    if (!broadcast_id) return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    if (!audience_id) return Response.json({ error: 'audience_id is required' }, { status: 400 });

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) return Response.json({ error: 'Broadcast not found' }, { status: 404 });

    const hasComposited = broadcast.compositedVideoUrl && !String(broadcast.compositedVideoUrl).startsWith('creatomate:pending:');
    const hasRaw = broadcast.videoUrl && !String(broadcast.videoUrl).startsWith('heygen:pending:');
    if (!hasComposited && !hasRaw) {
      return Response.json({ error: 'Broadcast has no finished video URL yet' }, { status: 400 });
    }
    const videoUrl = hasComposited ? broadcast.compositedVideoUrl : broadcast.videoUrl;

    const audience = await base44.asServiceRole.entities.TargetAudienceProfile.get(audience_id).catch(() => null);
    if (!audience) return Response.json({ error: 'Audience not found' }, { status: 404 });

    // Fetch all active contacts for this audience
    const contacts = await base44.asServiceRole.entities.AudienceContact.filter({
      audience_id,
      status: 'active',
    }, '-created_date', 500);

    const eligible = contacts.filter(c => c.email && c.consent_status !== 'declined');
    if (eligible.length === 0) {
      return Response.json({
        success: false,
        error: 'No eligible contacts (with email + not declined) in this audience',
        audience_name: audience.audience_name,
        total_contacts: contacts.length,
      }, { status: 400 });
    }

    // Resolve sender Gmail address
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json().catch(() => ({}));
    const senderEmail = profile.emailAddress || 'me';
    const senderName = 'Dyson & Dyson Real Estate Concierge';

    const headlineText = broadcast.headlines?.length
      ? broadcast.headlines.join(' | ')
      : (broadcast.prompt_topics || 'Daily Real Estate Intelligence');
    const showName = broadcast.show_name || `Show ${broadcast.show_number || ''}`;

    const subject = body.subject || `DNN Intelligence — ${showName}: ${headlineText.slice(0, 80)}`;
    const preheader = body.preheader || 'Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you what to do about it.';

    const distribution = [...(broadcast.distribution || [])];
    const results = { sent: [], failed: [], skipped: [] };

    for (const contact of eligible) {
      const firstName = (contact.contact_name || '').split(' ')[0] || 'there';
      const htmlBody = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;">
  <div style="padding:24px 32px;border-bottom:1px solid #D4AF37;">
    <div style="font-size:11px;letter-spacing:0.25em;color:#D4AF37;font-weight:700;text-transform:uppercase;">DNN Intelligence Bureau</div>
    <div style="font-size:10px;color:#888;margin-top:4px;">Dyson & Dyson Real Estate Concierge</div>
  </div>
  <div style="padding:32px;">
    <p style="color:#cccccc;font-size:15px;line-height:1.6;">Hi ${firstName},</p>
    <p style="color:#cccccc;font-size:15px;line-height:1.6;">A new DNN broadcast is ready for you:</p>
    <h2 style="color:#D4AF37;font-family:Georgia,serif;font-size:22px;line-height:1.3;margin:20px 0 8px;">${headlineText}</h2>
    <p style="color:#888;font-size:13px;margin:0 0 24px;">${showName} · ${broadcast.broadcast_date || ''}</p>
    <div style="background:#000;border:1px solid #D4AF37;border-radius:12px;padding:0;overflow:hidden;margin:24px 0;">
      <a href="https://1dnn.com/dnn-news" style="display:block;text-decoration:none;">
        <img src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png" alt="DNN Studio" style="display:block;width:100%;height:auto;" />
      </a>
    </div>
    <p style="color:#cccccc;font-size:15px;line-height:1.6;">${preheader}</p>
    <div style="margin:28px 0;">
      <a href="https://1dnn.com/dnn-news" style="background:linear-gradient(135deg,#e8c84a 0%,#D4AF37 50%,#b8920a 100%);color:#000;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;display:inline-block;">Watch the Full Broadcast</a>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.6;border-top:1px solid #333;padding-top:20px;margin-top:32px;">
      You received this because you are part of the <strong style="color:#D4AF37;">${audience.audience_name}</strong> distribution list.<br/>
      Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you exactly what to do about it.
    </p>
    <p style="color:#666;font-size:11px;margin-top:16px;">To unsubscribe, reply with "unsubscribe".</p>
  </div>
</div>
</body></html>`;

      const textBody = `DNN Intelligence Bureau — ${showName}\n${headlineText}\n\nHi ${firstName},\n\nA new DNN broadcast is ready for you.\n\nWatch it here: https://1dnn.com/dnn-news\n\n${preheader}\n\n— Dyson & Dyson Real Estate Concierge\n\nYou received this because you are part of the ${audience.audience_name} distribution list. To unsubscribe, reply with "unsubscribe".`;

      const mimeMessage =
        `To: ${encodeHeader(contact.contact_name)} <${contact.email}>\r\n` +
        `From: ${encodeHeader(senderName)} <${senderEmail}>\r\n` +
        `Subject: ${encodeHeader(subject)}\r\n` +
        `Content-Type: multipart/alternative; boundary="dnnalt"\r\n` +
        `MIME-Version: 1.0\r\n\r\n` +
        `--dnnalt\r\n` +
        `Content-Type: text/plain; charset=UTF-8\r\n` +
        `Content-Transfer-Encoding: base64\r\n\r\n` +
        `${utf8ToBase64(textBody)}\r\n\r\n` +
        `--dnnalt\r\n` +
        `Content-Type: text/html; charset=UTF-8\r\n` +
        `Content-Transfer-Encoding: base64\r\n\r\n` +
        `${utf8ToBase64(htmlBody)}\r\n\r\n` +
        `--dnnalt--`;

      const raw = toBase64Url(utf8ToBase64(mimeMessage));

      try {
        const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw }),
        });
        const sendData = await sendRes.json();
        if (!sendRes.ok) {
          results.failed.push({ contact_id: contact.id, email: contact.email, error: sendData.error?.message || 'Gmail send failed' });
        } else {
          results.sent.push({ contact_id: contact.id, email: contact.email, message_id: sendData.id });
          distribution.push({
            channel: 'subscriber_email',
            status: 'sent',
            post_id: sendData.id,
            posted_at: new Date().toISOString(),
            recipient: `${contact.contact_name} <${contact.email}>`,
          });
          // Update contact send counters
          await base44.asServiceRole.entities.AudienceContact.update(contact.id, {
            last_sent_at: new Date().toISOString(),
            sends_received: (contact.sends_received || 0) + 1,
          }).catch(() => {});
        }
      } catch (e) {
        results.failed.push({ contact_id: contact.id, email: contact.email, error: e.message });
      }
    }

    // Record distribution on the broadcast
    await base44.asServiceRole.entities.DnnBroadcast.update(broadcast_id, { distribution });

    return Response.json({
      success: results.sent.length > 0,
      broadcast_id,
      audience_id,
      audience_name: audience.audience_name,
      total_contacts: contacts.length,
      eligible: eligible.length,
      sent: results.sent.length,
      failed: results.failed.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}