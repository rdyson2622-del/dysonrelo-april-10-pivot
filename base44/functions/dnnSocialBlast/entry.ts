import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Daily Social Blast — posts the latest DNN Intelligence Brief to:
//   1. LinkedIn (personal profile)
//   2. Facebook Pages (first managed Page)
//
// Scheduled daily at 6:00 AM PT (13:00 UTC).
// Can also be triggered manually by an admin via frontend.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth check — admin only for manual triggers; automation runs as service role
    const isManual = req.method === 'POST';
    if (isManual) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
      }
    }

    // --- 1. Get the most recent published/blasted article ---
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

    const candidates = [...published, ...blasted].sort(
      (a, b) => new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
    );

    if (!candidates.length) {
      return Response.json({ error: 'No published articles found to post' }, { status: 404 });
    }

    const article = candidates[0];

    // --- 2. Build social copy ---
    const appUrl = 'https://app.base44.com/apps/683966cc2de4e2c5e7699c47/dnn-news';
    const firstPara = article.body?.split('\n').find(p => p.trim()) || '';
    const teaser = firstPara.length > 180 ? firstPara.slice(0, 180) + '...' : firstPara;

    const triggerLabel = {
      tax_policy: 'TAX POLICY',
      housing_market: 'HOUSING MARKET',
      job_market: 'JOB MARKET',
      interest_rates: 'INTEREST RATES',
      migration_data: 'MIGRATION DATA',
      employer_news: 'EMPLOYER NEWS',
      general: 'INTELLIGENCE BRIEF',
      federal_reserve: 'FEDERAL RESERVE',
      mortgage_lending: 'MORTGAGE LENDING',
      federal_legislation: 'FEDERAL LEGISLATION',
      national_housing_data: 'NATIONAL HOUSING DATA',
      economic_indicators: 'ECONOMIC INDICATORS',
      demographics_migration: 'DEMOGRAPHICS & MIGRATION',
      insurance_climate: 'INSURANCE & CLIMATE',
      regulatory_compliance: 'REGULATORY COMPLIANCE',
      construction_supply: 'CONSTRUCTION & SUPPLY',
      consumer_protection: 'CONSUMER PROTECTION',
    }[article.trigger_type] || 'INTELLIGENCE BRIEF';

    // Build the solution section — this is what makes DNN different
    let solutionSection = '';
    if (article.client_solution) {
      solutionSection += `\n🔵 FOR CLIENTS: ${article.client_solution}`;
    }
    if (article.agent_solution) {
      solutionSection += `\n🟡 FOR AGENTS: ${article.agent_solution}`;
    }
    if (article.vendor_solution) {
      solutionSection += `\n🟢 FOR VENDORS: ${article.vendor_solution}`;
    }

    const socialText = `📡 DNN Intelligence Bureau — ${triggerLabel}

${article.headline}

${teaser}

${solutionSection}

Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you exactly what to do about it.

Read the full brief: ${appUrl}

#RealEstateNews #RelocationIntelligence #DNN #DysonAndDyson #HousingMarket #RealEstate`;

    const results = {
      article_headline: article.headline,
      linkedin: null,
      facebook: null,
    };

    // --- 3. Post to LinkedIn ---
    try {
      const { accessToken: linkedinToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${linkedinToken}` },
      });
      const profile = await profileRes.json();
      const authorUrn = `urn:li:person:${profile.sub}`;

      const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${linkedinToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: socialText },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
      });

      const linkedinResult = await postRes.json();
      if (!postRes.ok) {
        results.linkedin = { success: false, error: linkedinResult.message || 'LinkedIn API error', details: linkedinResult };
      } else {
        results.linkedin = { success: true, post_id: linkedinResult.id };
      }
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    // --- 4. Post to Facebook Pages ---
    try {
      const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

      // List managed Pages and get Page access token for the first one
      const accountsRes = await fetch(
        `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
      );
      const accountsData = await accountsRes.json();

      if (!accountsData.data || accountsData.data.length === 0) {
        results.facebook = { success: false, error: 'No Facebook Pages found for this account' };
      } else {
        const page = accountsData.data[0]; // First managed Page

        const fbPostRes = await fetch(
          `https://graph.facebook.com/v25.0/${page.id}/feed?access_token=${page.access_token}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: socialText,
              link: appUrl,
            }),
          }
        );

        const fbResult = await fbPostRes.json();
        if (!fbPostRes.ok) {
          results.facebook = { success: false, error: fbResult.error?.message || 'Facebook API error', details: fbResult };
        } else {
          results.facebook = { success: true, post_id: fbResult.id, page_name: page.name };
        }
      }
    } catch (e) {
      results.facebook = { success: false, error: e.message };
    }

    console.log('DNN Social Blast results:', JSON.stringify(results));

    return Response.json({ success: true, ...results });
  } catch (error) {
    console.error('dnnSocialBlast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});