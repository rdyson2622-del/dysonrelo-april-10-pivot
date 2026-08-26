import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// DNN "Blast to Subscribers" — sends email to relevant tier, marks article as blasted
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { article_id, tier_filter } = await req.json();
    if (!article_id) return Response.json({ error: 'article_id required' }, { status: 400 });

    const article = await base44.asServiceRole.entities.DnnArticle.get(article_id);
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    // Fetch subscribers — filter by tier if specified
    const allSubs = await base44.asServiceRole.entities.DnnSubscriber.list('-created_date', 5000);
    const targets = allSubs.filter(s => {
      if (s.unsubscribed) return false;
      if (!s.email) return false;
      if (tier_filter && tier_filter !== 'all') return s.tier === tier_filter;
      return true;
    });

    // Preview of first 60 words for email teaser
    const words = article.body?.split(' ') || [];
    const teaser = words.slice(0, 60).join(' ') + (words.length > 60 ? '...' : '');

    const emailBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e7eb; padding: 0;">
  <div style="background: linear-gradient(135deg, #1a1a1a, #0f0f0f); padding: 32px; border-bottom: 2px solid #D4AF37;">
    <p style="color: #D4AF37; font-size: 10px; letter-spacing: 0.3em; font-family: Arial, sans-serif; text-transform: uppercase; margin: 0 0 8px;">DNN Intelligence Bureau · Breaking Brief</p>
    <h1 style="color: #ffffff; font-size: 24px; line-height: 1.3; margin: 0; font-weight: 900;">${article.headline}</h1>
    ${article.dateline ? `<p style="color: #6b7280; font-size: 12px; font-family: monospace; margin: 8px 0 0;">${article.dateline}</p>` : ''}
  </div>
  <div style="padding: 32px;">
    <p style="color: #d1d5db; font-size: 16px; line-height: 1.8; margin: 0 0 24px;">${teaser}</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://dysonrelo.com" style="background: linear-gradient(135deg, #e8c84a, #D4AF37); color: #000; font-weight: 900; font-size: 14px; padding: 14px 32px; text-decoration: none; border-radius: 8px; letter-spacing: 0.05em; font-family: Arial, sans-serif;">READ THE FULL BRIEF →</a>
    </div>
    <p style="color: #4b5563; font-size: 11px; text-align: center; font-family: Arial, sans-serif; border-top: 1px solid #1f2937; padding-top: 16px; margin: 0;">
      DNN Intelligence Bureau · The Dyson & Dyson Companies, Inc · CA DRE #02303118<br/>
      You're receiving this because you're in our Power Base subscriber list.<br/>
      <a href="https://dysonrelo.com" style="color: #D4AF37;">Unsubscribe</a>
    </p>
  </div>
</div>`;

    let sent = 0;
    let failed = 0;

    // Send in batches of 5 with delay to avoid rate limits
    for (let i = 0; i < targets.length; i += 5) {
      const batch = targets.slice(i, i + 5);
      await Promise.all(batch.map(async (sub) => {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: sub.email,
            subject: `DNN Breaking Brief: ${article.headline}`,
            body: emailBody,
            from_name: 'DNN Intelligence Bureau',
          });
          sent++;
        } catch {
          failed++;
        }
      }));
      if (i + 5 < targets.length) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // Mark article as blasted
    await base44.asServiceRole.entities.DnnArticle.update(article_id, {
      status: 'blasted',
      published_date: new Date().toISOString(),
    });

    return Response.json({ success: true, sent, failed, total: targets.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});