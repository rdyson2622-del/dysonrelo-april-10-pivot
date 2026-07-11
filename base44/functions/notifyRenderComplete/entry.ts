import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { createMimeMessage } from 'npm:mimetext@3.0.27';

// Sends a Gmail alert to the connected account the moment a HeyGen render completes.
// Triggered by entity automations on CharliePageExplainer and DnnArticle.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const event = body?.event;
    const data = body?.data;
    if (!event?.entity_name) {
      return Response.json({ error: 'Missing event payload' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // Recipient = the Gmail account that was connected (the builder's own inbox)
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const to = profile?.email;
    if (!to) {
      return Response.json({ error: 'Could not determine recipient email from Gmail connection' }, { status: 500 });
    }

    let subject, lines;
    if (event.entity_name === 'DnnArticle') {
      subject = `HeyGen render complete: ${data?.headline || 'DNN article'}`;
      lines = [
        'A DNN news video just finished rendering in HeyGen.',
        '',
        `Headline: ${data?.headline || '(unknown)'}`,
        data?.video_url ? `Video: ${data.video_url}` : null,
        `Completed: ${data?.video_completed_at || new Date().toISOString()}`,
      ].filter(Boolean);
    } else {
      subject = `HeyGen render complete: ${data?.pageTitle || 'Charlie explainer'}`;
      lines = [
        'A Charlie page explainer just finished rendering in HeyGen.',
        '',
        `Page: ${data?.pageTitle || '(unknown)'}`,
        data?.presenterVideoUrl ? `Presenter video: ${data.presenterVideoUrl}` : null,
        data?.finalVideoUrl ? `Final video: ${data.finalVideoUrl}` : null,
        `Completed: ${new Date().toISOString()}`,
      ].filter(Boolean);
    }

    const msg = createMimeMessage();
    msg.setSender({ name: 'DysonRelo Studio', addr: to });
    msg.setRecipient(to);
    msg.setSubject(subject);
    msg.addMessage({ contentType: 'text/plain', data: lines.join('\n') });

    const bytes = new TextEncoder().encode(msg.asRaw());
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    const raw = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    const sendData = await sendRes.json();
    if (!sendRes.ok) {
      return Response.json({ error: sendData?.error?.message || 'Gmail send failed' }, { status: 500 });
    }

    return Response.json({ success: true, to, messageId: sendData.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});