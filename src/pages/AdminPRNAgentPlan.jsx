import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN = '#ede0cc';

const INITIAL_SECTIONS = [
  {
    id: 'overview',
    title: 'PRN OVERVIEW — WHAT IS THE PRIVATE REFERRAL NETWORK?',
    content: `The Private Referral Network (PRN) is Dyson & Dyson's exclusive, invitation-only ecosystem connecting vetted real estate agents and mortgage lenders with high-intent relocation clients. Unlike public directories or Zillow-style marketplaces, the PRN is a closed, curated network where every professional is personally vetted by Bob Dyson before being granted access.

The PRN is not a lead-generation platform. It is a referral management and co-marketing infrastructure designed to:
• Generate consistent, pre-qualified referral volume for partner agents and lenders
• Position Dyson & Dyson as the intelligence layer and relocation concierge for every transaction
• Build a recurring revenue model through subscription tiers and referral fee structures`
  },
  {
    id: 'agent_value',
    title: 'AGENT VALUE PROPOSITION',
    content: `What agents get when they join the PRN:

1. PRE-QUALIFIED REFERRALS — Every client handed off has already completed the Dyson intake process (Gemini Session), is commitment-gated, and has articulated their destination, timeline, and budget.

2. DNN CO-BRANDING — Partner agents are featured in the Dyson News Network (DNN) as "Bureau-Certified" professionals. Their name, photo, and bio appear alongside DNN intelligence briefs sent to thousands of subscribers.

3. RELOCATION CONCIERGE BACKUP — Dyson & Dyson remains actively embedded in the transaction as the relocation manager. Agents close deals; we handle the logistics, communications, and client anxiety.

4. ESCROW MONITORING — Our team monitors escrow milestones and surfaces issues early, reducing fall-through risk and improving close rates.

5. EXCLUSIVE MARKET ACCESS — PRN agents are the only professionals recommended to Dyson clients in their designated market. No competition within the same territory.`
  },
  {
    id: 'subscription_tiers',
    title: 'AGENT SUBSCRIPTION TIERS',
    content: `The PRN operates on a tiered subscription model:

── BRONZE TIER ($X/month) ──
• Listed in the DNN Agent Bureau directory
• Basic co-branding on DNN articles (city-level)
• Up to 2 referrals per quarter
• Access to Dyson relocation materials and scripts

── SILVER TIER ($X/month) ──
• Everything in Bronze
• Featured placement in DNN Morning Brief (monthly rotation)
• Up to 5 referrals per quarter
• Dedicated co-brand label: "Brought to you by DNN in partnership with [Agent Name]"
• Priority escrow monitoring

── GOLD TIER ($X/month) ──
• Everything in Silver
• Exclusive territory lock — no competing PRN agent in your market
• Unlimited referral volume
• Bob Dyson personal introduction for high-value clients
• Featured video segment in DNN News Feed
• Quarterly performance review call with Dyson team

NOTE: Pricing placeholders above ($X) to be finalized. Replace with agreed monthly rates.`
  },
  {
    id: 'referral_fee',
    title: 'REFERRAL FEE STRUCTURE',
    content: `In addition to the subscription fee, PRN agents pay a referral fee on closed transactions originated through the Dyson network:

• Standard Referral Fee: 25% of gross commission on buyer-side transactions
• Seller-Side (Listing Referral): 20% of gross commission
• Dual-Side (Buy + Sell through Dyson client): 30% of total gross commission

All referral fee agreements are documented via the Dyson Referral Agreement (generated automatically through the platform) and signed digitally before client introduction.

IMPORTANT: Referral fees are earned by the Dyson Referral Group (CalDRE #XXXXXXX) and are only payable broker-to-broker per California DRE regulations.`
  },
  {
    id: 'onboarding',
    title: 'AGENT ONBOARDING PROCESS',
    content: `How an agent enters the PRN:

STEP 1 — REFERRAL OR APPLICATION
Agent is referred by an existing PRN member or applies through the DNN Agent Bureau page. Cold applicants go through a longer vetting period.

STEP 2 — BOB DYSON VETTING CALL (30 min)
Personal conversation covering: transaction volume, market specialties, communication style, client service philosophy, and personality fit. This is a relationship business — culture matters.

STEP 3 — LICENSE & BACKGROUND VERIFICATION
DRE license check, NMLS (for lenders), recent transaction history, online reputation audit (Zillow/Google reviews), and reference call with a past client.

STEP 4 — SUBSCRIPTION AGREEMENT SIGNED
Agent selects tier, signs the PRN Subscription Agreement, and provides billing info. Monthly subscription begins.

STEP 5 — ONBOARDING BRIEF
Agent receives Dyson Relocation Protocol guide, co-brand assets, introduction to Charlie (AI concierge), and escrow monitoring enrollment.

STEP 6 — FIRST REFERRAL INTRODUCTION
Dyson team makes the warm introduction. Agent receives full client intake summary, Gemini Session notes, and escrow setup checklist.`
  },
  {
    id: 'agent_obligations',
    title: 'AGENT OBLIGATIONS & STANDARDS',
    content: `PRN agents agree to the following standards of conduct:

• RESPONSE TIME: All Dyson client introductions must be acknowledged within 2 hours. First client contact must occur within 24 hours.

• COMMUNICATION TRANSPARENCY: Agents agree to copy the Dyson team (or designated inbox) on all major milestone communications with the client during the transaction.

• REPORTING: Agents submit a brief status update (via the platform or text) at each escrow milestone: offer accepted, inspection complete, contingencies released, clear to close, funding.

• CLIENT EXPERIENCE STANDARD: Clients are the priority. Any agent who receives more than 2 documented complaints from Dyson clients is placed on probation and may be removed from the PRN.

• EXCLUSIVITY RESPECT: Gold-tier agents may not refer Dyson clients to competing agents or lenders outside the PRN without written consent.`
  },
  {
    id: 'revenue_model',
    title: 'DYSON PRN REVENUE MODEL',
    content: `Revenue streams generated by the PRN for Dyson & Dyson:

1. SUBSCRIPTION REVENUE
Monthly recurring revenue from Bronze/Silver/Gold agent subscriptions. Target: 20 active PRN agents at average $X/month = $XX,XXX/month ARR.

2. REFERRAL FEE INCOME
25% referral fee on each closed transaction. At average commission of $15,000/side, each closed Dyson referral generates $3,750 in referral income.

3. DNN FEATURED PLACEMENT FEES
Agents and lenders pay a premium to be featured in DNN newsletters, social posts, and article co-branding campaigns. Separate from subscription.

4. LENDER PARTNER FEES
Vetted lenders pay a parallel structure — subscription + per-referral fee — mirroring the agent model.

5. WHITE-LABEL CONTENT LICENSING
Agents may license DNN-produced market intelligence content (articles, morning briefs) under their own brand for use in their client communications.

PROJECTED ANNUAL PRN REVENUE TARGET: $XXX,XXX (to be modeled based on finalized pricing)`
  },
  {
    id: 'competitive_moat',
    title: 'COMPETITIVE MOAT — WHY AGENTS STAY',
    content: `The PRN is defensible because it is not a commodity lead service. Agents who join receive:

• RELATIONSHIP CAPITAL — A personal endorsement from Bob Dyson carries significant weight in the relocation and referral community. Agents become associated with a 55-year legacy brand.

• PRE-SOLD CLIENTS — Dyson clients arrive having already been educated by Charlie, guided through the Gemini Session, and committed to the relocation process. The agent doesn't sell the client on moving — they execute the plan.

• RECURRING VOLUME — Unlike one-off referral networks, PRN agents receive a predictable pipeline as Dyson scales DNN subscriber acquisition and outreach campaigns.

• CO-MARKETING INFRASTRUCTURE — Agents gain access to a content marketing machine (DNN) they could not build themselves. Their faces and markets get broadcast to thousands of subscribers organically.

• LOYALTY THROUGH RESULTS — Agents who perform well become the permanent go-to for their market. The Dyson team actively protects their territory and promotes their success stories in the Bureau Story Hub.`
  },
  {
    id: 'flat50_stripe',
    dividerAbove: true,
    title: 'SECTION 10: THE "FLAT $50" STRIPE UTILITY (THE "S" SERVICE)',
    content: `Logic: Pre-paid fuel model. No skip-trace or data request can be executed unless the user has a positive credit balance. This prevents delivery glitches and manual refunds.

Interface: When the balance hits zero, a Stripe-hosted modal appears for a Flat $50 Refill.`
  },
  {
    id: 'vendor_affiliate',
    dividerAbove: true,
    title: 'SECTION 11: VENDOR & AFFILIATE DATA ACCESS',
    content: `Target: Contractors, Appraisers, and Inspectors.

Utility: Vendors get skip-trace access at a $1.50 "Partner Rate" to verify property ownership and "stories" before rolling a truck.`
  },
  {
    id: 'lender_agent_loop',
    dividerAbove: true,
    title: 'SECTION 12: AUTOMATED LENDER-TO-AGENT LOOP',
    content: `Logic: Every agent skip-trace result automatically attaches a "Rate-Solve" financing scenario from their paired lender partner.`
  },
  {
    id: 'respa_msa',
    dividerAbove: true,
    title: 'SECTION 13: RESPA-COMPLIANT MSA FRAMING',
    content: `Logic: All partnerships are structured as broker-to-broker referrals or co-marketing MSAs to ensure full legal compliance while scaling to 100 cities.`
  },
  {
    id: 'skip_trace_interface',
    dividerAbove: true,
    title: 'SECTION 14: THE SKIP-TRACE RESULT INTERFACE',
    content: `The "Reveal" Logic: When a trace is successful, the data must be presented in a "Dyson Gold" branded pill — clean, credentialed, and immediately actionable.

DATA POINTS INCLUDED IN EVERY RESULT PILL:

1. Owner Identity
   Full Name + Current Mailing Address (verified against county records).

2. Contact Intel
   Up to 3 verified phone numbers (each flagged for DNC status) and 2 verified email addresses.

3. Property Story
   Instant link to the property's last sale date and estimated current equity position — giving the agent context before the first call.

4. The Lender Solve
   A "One-Click" button to send this full data package directly to the agent's paired Lender partner for a "Rate-Solve" financing scenario — completing the loop from lead identification to financing intelligence in a single workflow.

WHY THIS COMPLETES THE BLUEPRINT:

This interface is the product. Everything else in this plan — the subscriptions, the tiers, the vendor network, the lender loop — exists to deliver this one moment: an agent opens a skip-trace result and has every tool they need to convert a cold homeowner into a client conversation.

Revenue defined (Stripe tiers).
Users defined (Vendors, Agents, Lenders).
Product defined (This Interface).

The 14-Section PRN Master Plan is complete.`
  },
  {
    id: 'pending_affiliate_roster',
    dividerAbove: true,
    title: 'SECTION 15: THE "PENDING AFFILIATE" ROSTER & B2B RECOVERY',
    content: `The Logic: Instead of "cold calling" agents, we build a national roster of 1,000+ agents based on performance data (Gemini/PropStream vetted). They are entered as "Pending Affiliates."

The B2B Hook: We target high-volume agents in destination cities (Nashville, Boise, etc.) with the "Escrow Rescue" proposition. We fix their "stuck" CA buyer's home sale so they can close their deal.

The Roster Strategy: We promote these agents on DysonHome.com within a "Vetted City Directory." We share their stats and performance, but keep the contact "blind" (Contact goes to Dyson first).

The Conversion: Once an agent realizes we are already promoting them and have a "Rescue" case for them, they are moved from "Pending" to "Active PRN Member" at no cost, provided they agree to the Dyson 8-Phase Logistics protocol.

── ROSTER WORKFLOW ──
1. IDENTIFY — Use Gemini + PropStream to pull top-volume agents in target destination cities (50+ transactions/year, strong close rates).
2. ENTER — Add them to the PartnerAgent entity with status: "prospect" and a note: "Pending Affiliate — not yet contacted."
3. PROMOTE — Feature their stats in the DNN Vetted City Directory with blind contact routing (all inquiries come to Dyson inbox first).
4. RESCUE TRIGGER — When a Dyson client's CA escrow is stalled, we identify the destination agent in our roster and reach out with the live case.
5. CONVERT — Agent sees the value (free promotion + a live deal), agrees to the 8-Phase Protocol, and is upgraded to Active PRN Member.

This eliminates cold outreach entirely. Every agent "onboarded" has already been warmed by the Directory and pulled in by a real deal.`
  },
  {
    id: 'notes',
    title: 'INTERNAL NOTES & OPEN ITEMS',
    content: `Items to finalize before PRN launch:

[ ] Finalize Bronze / Silver / Gold monthly subscription pricing
[ ] Confirm referral fee percentages with legal/compliance review (CA DRE broker-to-broker)
[ ] Set CalDRE license number in all referral agreement templates
[ ] Build out the agent-facing PRN enrollment page (public-facing)
[ ] Define "territory" parameters — zip code level? City? County?
[ ] Create automated referral agreement generation flow in platform
[ ] Set up PRN agent portal view (separate from admin)
[ ] Launch first cohort: target 5 Gold agents in top Dyson destination markets
[ ] Draft PRN pitch deck for agent recruitment outreach
[ ] Schedule Bob Dyson intro video for PRN landing page`
  },
];

export default function AdminPRNAgentPlan() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [editing, setEditing] = useState(null); // id of section being edited
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  const startEdit = (section) => {
    setEditing(section.id);
    setEditTitle(section.title);
    setEditContent(section.content);
  };

  const saveEdit = () => {
    setSections(prev => prev.map(s => s.id === editing ? { ...s, title: editTitle, content: editContent } : s));
    setEditing(null);
  };

  const deleteSection = (id) => {
    if (window.confirm('Remove this section?')) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const id = `section_${Date.now()}`;
    setSections(prev => [...prev, { id, title: newSectionTitle.toUpperCase(), content: 'Add your content here...' }]);
    setNewSectionTitle('');
    setShowAddSection(false);
    setTimeout(() => startEdit({ id, title: newSectionTitle.toUpperCase(), content: 'Add your content here...' }), 100);
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: TAN }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRIVATE REFERRAL NETWORK</p>
          <h1 className="font-black text-3xl tracking-tight mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
            PRN Agent Business Plan
          </h1>
          <p className="text-sm" style={{ color: '#6b5c45' }}>
            Internal strategy document — agent involvement, subscription model, and revenue architecture.
            <br />Click any section to edit. Add or remove sections as needed.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id}>
            {section.dividerAbove && (
              <hr style={{ border: 'none', borderTop: '2px solid rgba(212,175,55,0.5)', margin: '8px 0 24px 0' }} />
            )}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.3)' }}>

              {editing === section.id ? (
                /* ── EDIT MODE ── */
                <div className="p-6">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full font-black text-sm tracking-[0.15em] uppercase mb-4 px-3 py-2 rounded-lg outline-none"
                    style={{ background: '#ede0cc', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={16}
                    className="w-full text-sm leading-relaxed px-3 py-3 rounded-lg outline-none resize-y"
                    style={{ background: '#ede0cc', border: `1px solid ${GOLD}`, color: '#2a1f0e', fontFamily: 'Georgia, serif' }}
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={saveEdit}
                      className="px-5 py-2 rounded-full text-sm font-bold"
                      style={{ background: GOLD, color: '#000' }}>
                      Save
                    </button>
                    <button onClick={() => setEditing(null)}
                      className="px-5 py-2 rounded-full text-sm font-bold"
                      style={{ background: 'rgba(0,0,0,0.08)', color: '#444' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── VIEW MODE ── */
                <div>
                  <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.07)' }}>
                    <p className="text-xs tracking-[0.2em] uppercase" style={{ color: GOLD, fontWeight: section.dividerAbove ? 900 : 800, fontSize: section.dividerAbove ? '0.8rem' : undefined }}>
                      {section.title}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(section)}
                        className="text-xs px-3 py-1 rounded-full font-semibold transition-all hover:opacity-80"
                        style={{ background: GOLD, color: '#000' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteSection(section.id)}
                        className="text-xs px-3 py-1 rounded-full font-semibold transition-all hover:opacity-80"
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#2a1f0e', fontFamily: 'Georgia, serif' }}>
                      {section.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            </div>
          ))}
        </div>

        {/* Add Section */}
        <div className="mt-8">
          {showAddSection ? (
            <div className="rounded-2xl p-6" style={{ background: '#fff8ee', border: `2px dashed ${GOLD}` }}>
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>NEW SECTION TITLE</p>
              <input
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSection()}
                placeholder="e.g. LENDER CROSS-SELL STRATEGY"
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none mb-4"
                style={{ background: '#ede0cc', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={addSection}
                  className="px-5 py-2 rounded-full text-sm font-bold"
                  style={{ background: GOLD, color: '#000' }}>
                  Add Section
                </button>
                <button onClick={() => setShowAddSection(false)}
                  className="px-5 py-2 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(0,0,0,0.08)', color: '#444' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddSection(true)}
              className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest transition-all hover:opacity-80"
              style={{ background: 'transparent', border: `2px dashed rgba(212,175,55,0.4)`, color: GOLD }}>
              + ADD NEW SECTION
            </button>
          )}
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}