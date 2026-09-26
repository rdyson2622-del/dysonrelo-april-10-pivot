import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { postLinkedInVideoOrImage } from '../../shared/linkedinPost.ts';

/**
 * dnnSocialBlast — Posts the next un-blasted, video-ready DNN article to
 * Facebook AND the DNN LinkedIn page in one call.
 *
 * Each call picks the OLDEST video-ready 'published' article and, on success,
 * marks it 'blasted' so the next call naturally moves to the next article in
 * the queue. Running this multiple times a day (see the DNN Daily Social
 * Blast workflow schedule) cycles through the week's articles across both
 * socials with multiple runs per day.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth check — admin only for manual triggers
    const isManual = req.method === 'POST';
    if (isManual) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
      }
    }

    // 1. Get the most recent published article with a completed video
    const candidates = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' }, '-generated_date', 50
    );

    const videoReady = candidates.filter(a =>
      a.video_url && !a.video_url.startsWith('heygen:pending:') && a.production_status === 'complete'
    );

    if (!videoReady.length) {
      return Response.json({
        error: 'No published articles with completed video found',
        status: 'no_video_ready',
        candidates_checked: candidates.length,
      }, { status: 404 });
    }

    // Oldest-first so multiple runs in a day cycle through the week's stack in order.
    const article = videoReady.sort(
      (a, b) => new Date(a.generated_date || a.created_date) - new Date(b.generated_date || b.created_date)
    )[0];

    // 2. Build social copy
    const firstPara = article.body?.split('\n').find(p => p.trim()) || '';
    const teaser = firstPara.length > 180 ? firstPara.slice(0, 180) + '...' : firstPara;

    const triggerLabel = {
      tax_policy: 'TAX POLICY', housing_market: 'HOUSING MARKET', job_market: 'JOB MARKET',
      interest_rates: 'INTEREST RATES', migration_data: 'MIGRATION DATA', employer_news: 'EMPLOYER NEWS',
      general: 'INTELLIGENCE BRIEF', federal_reserve: 'FEDERAL RESERVE', mortgage_lending: 'MORTGAGE LENDING',
      federal_legislation: 'FEDERAL LEGISLATION', national_housing_data: 'NATIONAL HOUSING DATA',
      economic_indicators: 'ECONOMIC INDICATORS', demographics_migration: 'DEMOGRAPHICS & MIGRATION',
      insurance_climate: 'INSURANCE & CLIMATE', regulatory_compliance: 'REGULATORY COMPLIANCE',
      construction_supply: 'CONSTRUCTION & SUPPLY', consumer_protection: 'CONSUMER PROTECTION',
    }[article.trigger_type] || 'INTELLIGENCE BRIEF';

    const subscribeUrl = 'https://1dnn.com/subscribe';
    const showUrl = 'https://1dnn.com/dnn-news?autoplay=1';

    const socialText = `${article.headline}

${teaser}

📡 DNN Intelligence Bureau — ${triggerLabel}
Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you exactly what to do about it.

🔔 Watch the full broadcast: ${showUrl}
Subscribe for free daily intelligence: ${subscribeUrl}

#RealEstateNews #RelocationIntelligence #DNN #DysonAndDyson #HousingMarket #RealEstate`;

    const results = {
      article_headline: article.headline,
      facebook: null,
      linkedin: null,
    };

    // 3. Post to Facebook Pages
    try {
      const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

      const accountsRes = await fetch(
        `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
      );
      const accountsData = await accountsRes.json().catch(() => ({}));

      if (!accountsData.data || accountsData.data.length === 0) {
        results.facebook = { success: false, error: 'No Facebook Pages found' };
      } else {
        const page = accountsData.data[0];

        const fbPostRes = await fetch(
          `https://graph.facebook.com/v25.0/${page.id}/feed?access_token=${page.access_token}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: socialText, link: showUrl }),
          }
        );

        const fbResult = await fbPostRes.json();
        if (!fbPostRes.ok) {
          results.facebook = { success: false, error: fbResult.error?.message || 'Facebook API error', details: fbResult };
        } else {
          results.facebook = { success: true, post_id: fbResult.id, page_name: page.name, type: 'text' };
        }
      }
    } catch (e) {
      results.facebook = { success: false, error: e.message };
    }

    // 4. Post to LinkedIn (DNN page)
    try {
      const linkedinResult = await postLinkedInVideoOrImage(base44, {
        text: socialText,
        videoUrl: article.video_url,
        title: article.headline,
        organizationName: 'DNN',
      });
      results.linkedin = { success: true, ...linkedinResult };
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    console.log('DNN Social Blast results:', JSON.stringify(results));

    // Mark article as blasted if either channel succeeded
    if ((results.facebook?.success || results.linkedin?.success) && article.status === 'published') {
      await base44.asServiceRole.entities.DnnArticle.update(article.id, { status: 'blasted' });
    }

    return Response.json({ success: true, ...results });
  } catch (error) {
    console.error('dnnSocialBlast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});