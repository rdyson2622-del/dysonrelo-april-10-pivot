import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { agent_name, dre_number, state, brokerage, markets } = await req.json();

    if (!agent_name) {
      return Response.json({ error: 'agent_name is required' }, { status: 400 });
    }

    const marketList = Array.isArray(markets) ? markets.join(', ') : (markets || 'unknown market');

    const prompt = `You are an expert real estate agent vetting analyst for Dyson & Dyson, a luxury relocation concierge firm founded by Bob Dyson (54 years in the industry).

Your job is to perform a THOROUGH vetting analysis on the following agent candidate for the DNN Agent Bureau — our elite network of personally-reviewed, DRE-verified partner agents.

AGENT CANDIDATE:
- Name: ${agent_name}
- DRE #: ${dre_number || 'not provided — flag this'}
- State: ${state || 'CA (assumed)'}
- Brokerage: ${brokerage || 'not provided — flag this'}
- Target Markets: ${marketList}

VETTING CRITERIA (score each 1–5, 5 = excellent):

1. DRE LICENSE STATUS — Is DRE #${dre_number || '[not provided]'} valid? Are there any disciplinary actions on record? Flag if unknown.
2. PRODUCTION VOLUME — Based on known data or reasonable inference for this agent/brokerage combo, estimate annual closings. Min threshold: 12/yr.
3. MARKET SPECIALIZATION — Does their market focus align with ${marketList}? Are they a true neighborhood expert vs. a generalist?
4. BROKERAGE REPUTATION — Evaluate ${brokerage || 'their brokerage'} for brand strength, support systems, and alignment with luxury/relocation clients.
5. BUYER-SIDE EXPERIENCE — Are they buyer-representation specialists or primarily listing agents? Relocation buyers need buyer-side expertise.
6. PERSONALITY & COMMUNICATION FIT — Based on any public profile, reviews, or web presence, how do they present? Are they high-touch or transactional?
7. REFERRAL PROTECTABILITY — Can we protect our client's equity interests and maintain a fiduciary buffer with this agent?

After scoring each criteria, provide:

OVERALL VETTING SCORE: X/35
BUREAU RECOMMENDATION: [APPROVE / CONDITIONAL APPROVAL / REJECT]
APPROVAL CONDITIONS: (if conditional — what must be confirmed before full activation)

AGENT SUMMARY (2–3 sentences, written as if for the client-facing bureau profile):
[Write this in Bob Dyson's voice — authoritative, warm, earned trust language]

INTERNAL RED FLAGS (admin-only — list any concerns honestly):
[Be blunt here. This is internal.]

SUGGESTED QUESTIONS FOR LIVE INTERVIEW:
1. [question]
2. [question]
3. [question]
4. [question]
5. [question]

Use web search context if available. Be precise, be honest, and flag anything uncertain rather than fabricating facts. This is a trust product — we only put agents in front of clients we'd stake Bob Dyson's 54-year reputation on.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1800,
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const report = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';

    // Parse out key fields
    const scoreMatch = report.match(/OVERALL VETTING SCORE:\s*(\d+)\/35/i);
    const recommendationMatch = report.match(/BUREAU RECOMMENDATION:\s*([^\n]+)/i);

    return Response.json({
      report,
      score: scoreMatch ? parseInt(scoreMatch[1]) : null,
      recommendation: recommendationMatch ? recommendationMatch[1].trim() : null,
      agent_name,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});