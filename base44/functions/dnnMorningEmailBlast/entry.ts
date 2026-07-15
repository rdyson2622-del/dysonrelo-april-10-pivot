import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs daily at 8AM PT
// 1. Grabs the most recent published/blasted DNN article
// 2. Sends a formatted morning brief email to all active DNN subscribers

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get the most recent published article
    const published = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      1
    );
    const blasted = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'blasted' },
      '-generated_date',
      1
    );

    // Pick the most recent across both statuses
    const candidates = [...published, ...blasted].sort(
      (a, b) => new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
    );

    if (!candidates.length) {
      return Response.json({ error: 'No published articles found' }, { status: 404 });
    }

    const article = candidates[0];

    // Get all active subscribers with email addresses
    const allSubscribers = await base44.asServiceRole.entities.DnnSubscriber.filter(
      { unsubscribed: false },
      '-subscribed_at',
      5000
    );

    const subscribers = allSubscribers.filter(s => s.email && s.email.trim());

    // Also get admin team emails so the brief goes to the internal team every day
    const adminUsers = await base44.asServiceRole.entities.User.filter(
      { role: 'admin' },
      '-created_date',
      100
    );
    const adminEmails = adminUsers.filter(u => u.email && u.email.trim()).map(u => u.email);

    // Merge subscribers + admin team, dedup by email
    const subscriberEmails = subscribers.map(s => s.email);
    const allRecipients = [...new Set([...subscriberEmails, ...adminEmails])];

    if (!allRecipients.length) {
      return Response.json({ error: 'No subscribers or admin recipients with email addresses' }, { status: 404 });
    }

    // Build the first paragraph of the article as the teaser
    const firstPara = article.body?.split('\n').find(p => p.trim()) || '';
    const teaser = firstPara.length > 200 ? firstPara.slice(0, 200) + '...' : firstPara;

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    const triggerLabel = {
      tax_policy: 'TAX POLICY',
      housing_market: 'HOUSING MARKET',
      job_market: 'JOB MARKET',
      interest_rates: 'INTEREST RATES',
      migration_data: 'MIGRATION DATA',
      employer_news: 'EMPLOYER NEWS',
      general: 'GENERAL',
    }[article.trigger_type] || 'INTELLIGENCE BRIEF';

    const appUrl = 'https://1dnn.com/dnn-news';

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
      <a href="${appUrl}" class="cta-btn">▶ Read Full Brief + Watch Video</a>
      <hr class="divider">
      <p style="font-size:12px; color:#475569; text-align:center; line-height:1.6;">
        This is your free daily DNN Intelligence Brief from Dyson &amp; Dyson Real Estate Concierge.<br>
        Market-moving news curated by AI — localized to the markets that matter to your move.
      </p>
    </div>
    <div class="footer">
      <p>Dyson &amp; Dyson Real Estate Concierge · CA DRE #02303118</p>
      <p>You're receiving this because you subscribed to DNN Intelligence.</p>
      <p><a href="mailto:info@dysonanddyson.com">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send to all subscribers + admin team — batch with small delay to avoid rate limits
    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const email of allRecipients) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `📡 DNN Morning Brief: ${article.headline}`,
          body: emailBody,
          from_name: 'DNN Intelligence Bureau',
        });
        sent++;
      } catch (e) {
        failed++;
        errors.push(`${email}: ${e.message}`);
      }
    }

    console.log(`DNN Morning Blast: ${sent} sent, ${failed} failed`);

    return Response.json({
      success: true,
      article_headline: article.headline,
      recipients_total: allRecipients.length,
      subscribers: subscriberEmails.length,
      admins: adminEmails.length,
      sent,
      failed,
      errors: errors.slice(0, 10),
    });

  } catch (error) {
    console.error('dnnMorningEmailBlast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});