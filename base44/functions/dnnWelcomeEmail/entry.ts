import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const subscriber = body?.data || body;

    if (!subscriber?.email) {
      return Response.json({ error: 'No email address provided' }, { status: 400 });
    }

    const firstName = (subscriber.full_name || '').split(' ')[0] || 'there';
    const source = subscriber.source || 'our website';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(212,175,55,0.3);border-radius:16px;overflow:hidden;">

          <!-- Gold header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#e8c84a,#D4AF37,#b8920a);padding:24px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#000;">DNN</p>
              <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.7);">DYSON NEWS NETWORK</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:24px;color:#D4AF37;font-weight:600;">Welcome to the Network, ${firstName}.</p>

              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);">
                You're officially part of the DNN Follower Network — a community of professionals and consumers who receive
                real-time real estate intelligence from Dyson &amp; Dyson.
              </p>

              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);">
                Here's what you can expect:
              </p>

              <ul style="margin:0 0 20px;padding-left:20px;color:rgba(255,255,255,0.8);font-size:15px;line-height:1.8;">
                <li><strong style="color:#D4AF37;">Morning Intelligence Brief</strong> — delivered at 6 AM with the day's top real estate stories</li>
                <li><strong style="color:#D4AF37;">Breaking Alerts</strong> — market shifts, rate changes, and policy news that impact your move</li>
                <li><strong style="color:#D4AF37;">Solutions, Not Pitches</strong> — actionable guidance from 55 years of relocation expertise</li>
              </ul>

              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);">
                You submitted your information through <strong style="color:#D4AF37;">${source}</strong>. Our team reviews every submission
                personally and will respond within 24 hours with a clear, actionable resolution — no sales pitch, just answers.
              </p>

              <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);">
                Welcome aboard.
              </p>

              <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.85);font-style:italic;">
                — The Dyson &amp; Dyson Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#0d0d0d;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.35);text-align:center;">
                Dyson &amp; Dyson · 55 Years of Relocation Management<br/>
                You're receiving this because you joined the DNN Follower Network.<br/>
                To unsubscribe, reply to this email with "UNSUBSCRIBE" in the subject line.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: subscriber.email,
      subject: 'Welcome to the DNN Follower Network — Dyson & Dyson',
      body: html,
      from_name: 'DNN — Dyson News Network',
    });

    return Response.json({ success: true, sent_to: subscriber.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});