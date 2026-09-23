import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

/**
 * dnnSendArticleEmailBlast — Sends the DNN Morning Brief email for ONE specific
 * DnnArticle (by id) to all active DNN subscribers + admin team.
 *
 * Unlike dnnMorningEmailBlast (which auto-picks the "latest published" article),
 * this lets us push out a specific older/back-dated story on demand — e.g. the
 * San Diego brief — without disturbing the auto-pick logic used elsewhere.
 *
 * Body: { articleId: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const isManual = req.method === 'POST';
    if (isManual) {
      const user = await base44.auth.me().catch(() => null);
      if (user && user.role !== 'admin') {
        return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
      }
    }

    const { articleId } = await req.json();
    if (!articleId) {
      return Response.json({ error: 'Missing articleId' }, { status: 400 });
    }

    const article = await base44.asServiceRole.entities.DnnArticle.get(articleId);
    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const allSubscribers = await base44.asServiceRole.entities.DnnSubscriber.filter(
      { unsubscribed: false }, '-subscribed_at', 5000
    );
    const subscribers = allSubscribers.filter(s => s.email && s.email.trim());

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' }, '-created_date', 100);
    const adminEmails = adminUsers.filter(u => u.email && u.email.trim()).map(u => u.email);

    const subscriberEmails = subscribers.map(s => s.email);
    const allRecipients = [...new Set([...subscriberEmails, ...adminEmails, 'rdyson2622@gmail.com'])];

    if (!allRecipients.length) {
      return Response.json({ error: 'No subscribers or admin recipients with email addresses' }, { status: 404 });
    }

    const firstPara = article.body?.split('\n').find(p => p.trim()) || '';
    const teaser = firstPara.length > 200 ? firstPara.slice(0, 200) + '...' : firstPara;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const triggerLabel = {
      tax_policy: 'TAX POLICY', housing_market: 'HOUSING MARKET', job_market: 'JOB MARKET',
      interest_rates: 'INTEREST RATES', migration_data: 'MIGRATION DATA', employer_news: 'EMPLOYER NEWS',
      general: 'GENERAL',
    }[article.trigger_type] || 'INTELLIGENCE BRIEF';

    const appUrl = 'https://1dnn.com/dnn-news?autoplay=1';

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #080808; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #080808; }
    .header { background: #0d0d0d; padding: 28px 32px; border-bottom: 1px solid rgba(212,175,55,0.2); text-align: center; }
    .header-tag { font-size: 10px; letter-spacing: 0.3em; font-weight: 900; color: #D4AF37; text-transform: uppercase; margin-bottom: 4px; }
    .header-title { font-size: 22px; font-weight: 900; letter-spacing: 0.2em; color: #ffffff; text-transform: uppercase; }
    .date-bar { background: rgba(212,175,55,0.06); padding: 8px 32px; text-align: center; font-size: 11px; color: #64748b; letter-spacing: 0.1em; border-bottom: 1px solid rgba(212,175,55,0.1); }
    .content { padding: 32px; }
    .category-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 900; letter-spacing: 0.15em; color: #D4AF37; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.25); margin-bottom: 16px; }
    .headline { font-size: 24px; font-weight: 900; color: #ffffff; line-height: 1.3; margin-bottom: 12px; }
    .dateline { font-size: 11px; color: #475569; font-family: monospace; margin-bottom: 16px; }
    .teaser { font-size: 15px; color: #94a3b8; line-height: 1.7; margin-bottom: 28px; }
    .cta-btn { display: block; width: fit-content; margin: 0 auto 32px; padding: 14px 32px; background: linear-gradient(135deg, #e8c84a, #D4AF37); color: #000000; font-weight: 900; font-size: 13px; letter-spacing: 0.1em; text-decoration: none; border-radius: 8px; text-align: center; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0; }
    .footer { padding: 20px 32px; text-align: center; }
    .footer p { font-size: 10px; color: #334155; margin: 4px 0; }
    .footer a { color: #475569; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-tag">📡 DNN Intelligence Bureau</div>
      <div class="header-title">Morning Brief</div>
    </div>
    <div class="date-bar">${today}</div>
    <div class="content">
      <div class="category-pill">${triggerLabel}</div>
      <div class="headline">${article.headline}</div>
      ${article.dateline ? `<div class="dateline">${article.dateline}</div>` : ''}
      <div class="teaser">${teaser}</div>
      <a href="${appUrl}" class="cta-btn">▶ Watch Today's Broadcast</a>
      <hr class="divider">
      <p style="font-size:12px; color:#475569; text-align:center; line-height:1.6;">
        Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence in a full broadcast show.
      </p>
    </div>
    <div class="footer">
      <p>The Dyson &amp; Dyson Companies, Inc · CA DRE #02303118</p>
      <p>You're receiving this because you subscribed to DNN Intelligence.</p>
      <p><a href="mailto:info@dysonanddyson.com">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const email of allRecipients) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `📡 DNN Morning Broadcast: ${article.headline}`,
          body: emailBody,
          from_name: 'DNN Intelligence Bureau',
        });
        sent++;
      } catch (e) {
        failed++;
        errors.push(`${email}: ${e.message}`);
      }
    }

    if (article.status === 'published') {
      await base44.asServiceRole.entities.DnnArticle.update(article.id, { status: 'blasted' });
    }

    return Response.json({
      success: true,
      article_headline: article.headline,
      recipients_total: allRecipients.length,
      sent,
      failed,
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});