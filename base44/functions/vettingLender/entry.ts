import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { lender_name, nmls_number, state, company, markets, loan_types } = await req.json();
    if (!lender_name) {
      return Response.json({ error: 'lender_name is required' }, { status: 400 });
    }

    const marketList = Array.isArray(markets) ? markets.join(', ') : (markets || 'unknown');
    const loanList = Array.isArray(loan_types) ? loan_types.join(', ') : (loan_types || 'not specified');

    const prompt = `You are an expert mortgage lender vetting analyst for Dyson & Dyson, a luxury relocation concierge firm. You are evaluating a lender candidate for the DNN Vetted Lender Bureau — our elite network of personally-reviewed, NMLS-verified mortgage partners.

LENDER CANDIDATE:
- Name: ${lender_name}
- NMLS #: ${nmls_number || 'not provided — flag this'}
- State(s): ${state || 'not specified'}
- Company: ${company || 'not provided'}
- Target Markets: ${marketList}
- Loan Types Claimed: ${loanList}

VETTING CRITERIA (score each 1–5, 5 = excellent):

1. NMLS LICENSE STATUS — Is NMLS #${nmls_number || '[not provided]'} valid and current? Any disciplinary actions, complaints, or suspensions on record? Flag if unknown.
2. PRODUCTION VOLUME — Estimate annual loan volume and unit count. Min threshold: 24+ closings/yr for individual, proportionally more for team.
3. LOAN TYPE EXPERTISE — Do they have genuine depth in the loan types they claim? Especially: relocation-relevant products (bridge loans, VA, jumbo, DSCR for investors)?
4. CLOSE TIME PERFORMANCE — What is their average close timeline? For relocation clients, under 30 days is preferred. Flag if data unavailable.
5. COMMUNICATION & SERVICE REPUTATION — Based on reviews, ratings (Zillow, Google, Yelp), or industry reputation. Are they high-touch with relocation clients?
6. COMPANY/BANK BACKING — Evaluate ${company || 'their company'} for financial stability, product breadth, and rate competitiveness.
7. FIDUCIARY FIT — Can we maintain our fiduciary buffer? Will they respect our client's equity position and not upsell harmful products?

After scoring each criteria, provide:

OVERALL VETTING SCORE: X/35
BUREAU RECOMMENDATION: [APPROVE / CONDITIONAL APPROVAL / REJECT]
APPROVAL CONDITIONS: (if conditional — what must be confirmed)

LENDER SUMMARY (2–3 sentences for client-facing bureau profile, written in Bob Dyson's authoritative voice):
[Warm but earned. Focus on why this lender is safe for a relocation client.]

INTERNAL RED FLAGS (admin-only, be blunt):
[List anything concerning honestly.]

RELOCATION-SPECIFIC STRENGTHS:
[What makes this lender particularly good OR bad for relocation buyers specifically?]

SUGGESTED INTERVIEW QUESTIONS:
1. [question]
2. [question]
3. [question]
4. [question]
5. [question]

Use web search context where available. Flag anything uncertain rather than fabricating. This is a trust product — relocation clients are often in the most financially vulnerable moment of their lives.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1800 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const report = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
    const scoreMatch = report.match(/OVERALL VETTING SCORE:\s*(\d+)\/35/i);
    const recommendationMatch = report.match(/BUREAU RECOMMENDATION:\s*([^\n]+)/i);

    return Response.json({
      report,
      score: scoreMatch ? parseInt(scoreMatch[1]) : null,
      recommendation: recommendationMatch ? recommendationMatch[1].trim() : null,
      lender_name,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});