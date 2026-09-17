/**
 * copilotDomainContext.js
 * 
 * Implements:
 * 1. Domain-Specific Knowledge Loading based on active Execution Door
 * 2. Left-to-Right Visual Actions (generating structured visual inspection cards pushed to right panel)
 * 3. Escalation Protocol ("Hitting the Wall") detection
 */

export function getDomainKnowledgeContext(view, propertyAddress, dossierData) {
  const shortAddr = dossierData?.shortAddress || (propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property');
  const city = dossierData?.city || 'La Jolla, CA';

  switch (view) {
    case 'escrow':
      return `
ACTIVE DOOR: ESCROW WATCH & TITLE CONTINGENCY SHIELD
Key Diligence Rules & Checklists for ${shortAddr}:
1. Active Contingency Removal: California Form RPA contingencies NEVER expire automatically by calendar date. Under contract terms, the seller must issue a 48-hour formal Notice to Buyer to Perform (NBP) before initiating cancellation. The buyer must affirmatively sign Form CR (Contingency Removal).
2. Statutory Liquidated Damages Cap: Under Cal. Civ. Code § 1675, for 1–4 unit owner-occupied residential properties, the seller's sole liquidated damages remedy for buyer default is strictly capped at 3% of the purchase price. Any seller demand beyond 3% is legally defective.
3. Preliminary Title Schedule B Exceptions: Critical diligence required on Schedule B Part II exceptions—specifically unrecorded utility/access easements, CC&R architectural constraints, and solar UCC-1 financing liens. Demand ALTA extended coverage with appropriate endorsements rather than bare CLTA standard title.
4. Escrow Timeline Milestones:
   - Day 1–3: Initial earnest money deposit wire (require verbal phone verification to independently verified escrow officer number before wiring).
   - Day 1–17: General home, sewer lateral, roof, and Schedule B title review.
   - Day 17: Standard statutory inspection and appraisal contingency removal window (affirmative Form CR only).
   - Day 21: Formal loan commitment verification before loan contingency release.
   - Day 28–30: Final verification of property condition (Form VP) and county deed recording.
5. Statutory TDS/SPQ Windows: Under Cal. Civ. Code § 1102.3, if seller disclosures (TDS/SPQ) or amendments are delivered late or electronically, buyer retains an absolute 3-to-5 day statutory rescission privilege with full deposit return.
`;

    case 'vetting':
      return `
ACTIVE DOOR: AGENT VETTING STANDARDS DESK & CLIENT ADVISORY GATE
Key Diligence Rules & Checklists for ${shortAddr}:
1. Ongoing Partnership via Referral Agreement: CoPilot does not disappear when an agent is selected. Under our formal referral agreement, CoPilot remains actively involved alongside the buyer and their vetted agent throughout the entire sequence of events (discovery, offer, inspections, escrow, and closing) as an extra layer of strategic analytical support.
2. Dedicated Buyer Loyalty vs. Dual Agency: Educate the buyer on the structural conflicts of listing agent representation (the listing agent owes existing fiduciary duties to the seller to maximize sale price). Independent buyer-side representation ensures 100% undivided loyalty.
3. Vetting Benchmarks: Verify the agent's recent transaction volume in ${city}, deposit protection track record, lack of disciplinary actions, and transparent written representation agreement terms.
4. CoPilot Role: Strategic intelligence advocate and analytical backup; the buyer makes the final choice, supported by CoPilot and the vetted local agent.

MANDATORY ONBOARDING & AGREEMENT GATE CONTEXT:
- If user asks "Why do I need to confirm this?" or "Why do I need to sign this?":
  Answer clearly and compliantly: This confirms you are not currently under an exclusive representation agreement with another real estate broker. California DRE compliance and professional ethics prohibit tortious interference, and this declaration protects you while allowing Bob Dyson's team to legally go to work on your behalf as your strategic intelligence advisor.
- If user asks "Are you my agent?" or "Does this mean you are my agent?":
  Answer clearly: CoPilot and Bob Dyson act as your analytical advisory and referral partner, not your sole listing or transactional agent. Under our formal referral agreement, we pair you with a top vetted local buyer specialist and stay by your side through closing providing second-look comps, contingency tracking, and strategic analysis at zero extra fee to you.
- If user asks about the agreement status:
  Explain that once confirmed, Bob Dyson's team reviews the property file and contacts the buyer to align on goals before deploying deeper back-office resources.
`;

    case 'roadmap':
      return `
ACTIVE DOOR: TRANSACTION MOVE ROADMAP (7-PHASE SEQUENCE)
Milestone Protocol for ${shortAddr}:
- Phase 1 (Discovery & Risk Audit): 90-day adjusted comps, natural hazard disclosure (NHD), geotechnical exposure, and zoning analysis.
- Phase 2 (Agent Pairing): Pair with vetted independent buyer's agent under our formal referral agreement structure.
- Phase 3 (Offer & Contingency Formulation): Draft protective loan, appraisal, and physical inspection contingency clauses with affirmative release requirements.
- Phase 4 (Escrow Opening & Deposit): 3-day earnest money wire with independent verbal phone verification; review escrow instructions.
- Phase 5 (Physical & Title Review): Days 1–17 specialized structural, sewer, roof, and Schedule B title exception reviews.
- Phase 6 (Appraisal & Financing): Managing appraisal gap negotiations before releasing financing contingencies.
- Phase 7 (Final Walkthrough & Closing): Verifying agreed seller repairs (Form VP), signing closing statement, and county recording.
`;

    case 'dossier':
    case 'audit':
      return `
ACTIVE DOOR: PROPERTY AUDIT & COMPARATIVE ANALYSIS
Specific Property Context for ${shortAddr}:
- Subject List Price: ${dossierData?.listPrice || 'Under review'}
- Comps Analysis: ${dossierData?.compsSummary || 'Comparing recent adjusted neighborhood sales'}
- Environmental Risks: ${dossierData?.risksSummary || 'Reviewing bluff setback, drainage, and permit notes'}
- Geotechnical & Bluff Setback: California Coastal Commission mandates 75-year projected erosion setbacks and un-waivable soil boring studies along coastal bluff zones. Standard home inspectors do not inspect soil shear strength or ancient landslide planes.
`;

    case 'news':
    case 'dnn':
      return `
ACTIVE DOOR: DNN NEWS & DAILY MARKET BROADCAST
Market Intelligence Context for ${city} & Destination Luxury:
- Constrained inventory conditions and supply squeeze across premier coastal markets.
- Price resilience supported by high-equity cash and jumbo conforming borrowers.
- Conforming jumbo rate spread stabilizing at ~6.45%.
- How high-net-worth buyers use fiduciary due diligence and contract contingency shields during inventory freezes.
- Bob Dyson fiduciary commentary: never waive appraisal or title shields under pressure from listing agents.
`;

    case 'solutions':
      return `
ACTIVE DOOR: SOLUTIONS VAULT & STRATEGY PLAYBOOKS
Key Playbooks:
1. California Prop 19: Allows homeowners aged 55+, severely disabled, or natural disaster victims to transfer their lower original taxable property base up to 3 times to any replacement home anywhere in California.
2. 1031 Exchange Timelines: Strict 45-day replacement property written identification deadline and 180-day closing window with zero IRS extensions.
3. ALTA Extended Title: Covers unrecorded easements, boundary disputes, and survey encroachments omitted by standard CLTA policies.
`;

    default:
      return `
ACTIVE ADVISORY CONTEXT:
Fiduciary real estate intelligence for ${shortAddr}. Focus on independent buyer loyalty, second-opinion comp valuation, active contingency removal, and earnest money deposit protection under California broker supervision (CA DRE #02303118).
`;
  }
}

/**
 * Detects if the user inquiry warrants pushing a specific visual document / clause snippet
 * to the right-side dossier panel.
 */
export function detectVisualSnippetRequest(query, activeView, propertyAddress, dossierData) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();
  const shortAddr = dossierData?.shortAddress || (propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property');

  // 1. Bad contingency / poorly written clause / contingency trap
  if (
    /bad contingency|poorly written clause|bad clause|contingency trap|defective clause|contingency example|what does a bad/i.test(q)
  ) {
    return {
      type: 'clause_comparison',
      title: 'Contract Clause Review: Defective vs. Protective Contingency',
      subtitle: `Analyzing contingency language for offer formulation on ${shortAddr}`,
      badge: 'Visual Clause Breakdown',
      data: {
        defectiveClause: "Buyer shall remove all loan and appraisal contingencies within 14 days of acceptance regardless of lender underwriting status.",
        trapExplanation: "This language forces contingency release on a calendar date even if the bank's underwriter or appraiser is delayed, placing your 3% deposit at risk of forfeiture if loan approval stalls.",
        protectiveClause: "Loan and appraisal contingencies shall remain in full force and effect until Buyer delivers written affirmative notice of satisfaction following receipt of satisfactory written loan commitment.",
        protectiveExplanation: "Requires affirmative written approval and prevents automatic expiration or premature deposit forfeiture under California contract rules.",
        takeaway: "Under our referral agreement, CoPilot and your vetted agent review purchase agreement addenda before submission to ensure protective contingency language is maintained.",
        followUpPrompt: "Bob, how do we counter if the seller's agent pushes back on this contingency?"
      }
    };
  }

  // 2. Preliminary Title / Schedule B exceptions
  if (
    /schedule b|title exception|easement|title cloud|preliminary title|encroachment/i.test(q)
  ) {
    return {
      type: 'title_exception',
      title: 'Schedule B Title Exception Breakdown',
      subtitle: `Fiduciary analysis of title exceptions for ${shortAddr}`,
      badge: 'Title Diligence View',
      data: {
        itemNumber: '11',
        exceptionType: 'Unrecorded Blanket Utility & Access Easement',
        exceptionText: "An easement for public utilities and ingress/egress over the southerly 20 feet of said land as reserved in deed recorded in Book 1420.",
        impact: "Restricts future pool construction, ADU expansion, and structural fencing within the 20-foot perimeter.",
        recommendedAction: "Order ALTA boundary survey stakes and have your title officer issue an endorsement confirming zero encroaching improvements.",
        followUpPrompt: "Bob, what title endorsement do we request from the escrow officer to cover this easement?"
      }
    };
  }

  // 3. Coastal bluff setback / geotechnical soil hazards
  if (
    /bluff setback|coastal bluff|coastal commission|geotechnical|soil stability|cliff erosion|erosion/i.test(q)
  ) {
    return {
      type: 'bluff_setback',
      title: 'Coastal Bluff Setback & Geotechnical Protocol',
      subtitle: `Zoning and soil stability overview for ${shortAddr}`,
      badge: 'Geotechnical Analysis',
      data: {
        setback: '25–40 Ft Structural Setback',
        timeline: '75-Year Projected Erosion Line',
        study: 'Geotechnical Boring & Core Shear Test',
        advisoryNotes: `California Coastal Commission and municipal codes require all permanent structural elements to be set back beyond the projected 75-year bluff retreat line. Standard home inspectors do not inspect soil shear strength or ancient landslide planes; an independent geotechnical engineering report is essential before contingency release.`,
        followUpPrompt: "Charlie, what questions should we give our geotechnical inspector for this parcel?"
      }
    };
  }

  // 4. Prop 19 tax base portability transfer
  if (
    /prop 19|property tax transfer|tax base portability|tax base transfer|transfer tax base/i.test(q)
  ) {
    return {
      type: 'prop19_calc',
      title: 'Prop 19 Property Tax Base Transfer Calculation',
      subtitle: 'Transferring your lower taxable assessment across California',
      badge: 'Tax Portability Model',
      data: {
        originalBase: '$650,000 (~$8,100/yr)',
        replacementCost: '$2,850,000 (~$35,600/yr standard)',
        annualSavings: '~$27,500 / year in savings',
        summary: `Under California Prop 19, homeowners aged 55+, severely disabled, or victims of wildfires can transfer their existing taxable value anywhere in California up to 3 times. If the replacement property costs more than the original sale, only the difference is added to your existing tax base.`,
        followUpPrompt: "Charlie, what is the deadline to file the Prop 19 transfer claim after buying?"
      }
    };
  }

  // 5. Escrow timeline / liquidated damages / contingency schedule
  if (
    /escrow timeline|escrow milestones|30-day timeline|liquidated damages|deposit cap|when do contingencies expire|contingency schedule/i.test(q)
  ) {
    return {
      type: 'clause_comparison',
      title: 'Escrow Watch: Statutory Milestones & Deposit Protection',
      subtitle: `30-Day Escrow Diligence Sequence for ${shortAddr}`,
      badge: 'Escrow Milestone Card',
      data: {
        defectiveClause: "Seller demands automatic 3% deposit forfeiture if buyer fails to close on the 30th calendar day without prior written Notice to Perform.",
        trapExplanation: "Under California Form RPA, contingencies NEVER expire automatically, and Cal. Civ. Code § 1675 limits seller liquidated damages to 3% only after formal written notice and affirmative buyer default.",
        protectiveClause: "Day 1–3: Verbal wire verification. Day 17: Statutory inspection/appraisal removal via affirmative Form CR only. Day 21: Written loan commitment. Day 30: County deed recording.",
        protectiveExplanation: "All contingency removals require buyer's affirmative written signature on Form CR; seller cannot cancel without a 48-hour formal Notice to Buyer to Perform (NBP).",
        takeaway: "Under our referral agreement, CoPilot and Bob Dyson monitor every milestone date alongside your vetted agent and escrow officer.",
        followUpPrompt: "Bob, what happens if the lender needs 5 extra days past Day 21?"
      }
    };
  }

  return null;
}

/**
 * Detects whether a consumer question "Hits the Wall" (triggers strict human broker escalation).
 * Non-negotiable hard stops:
 * - Complex structural/geotechnical failure or dispute
 * - Exact commissions, rebate percentages, or referral splits
 * - Formal legal/tax liability advice ("can I sue", "is this contract binding", "am I legally obligated")
 * - Complex contract arbitration, mediation, or DRE disputes
 * - Direct request for Bob Dyson or licensed broker intervention
 */
export function detectEscalationTrigger(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  // 1. Direct request to speak with Bob / Broker
  if (
    /talk to bob|speak with bob|have bob call|connect me with bob|connect with bob|broker review|human specialist|speak to a broker|call me/i.test(q)
  ) {
    return {
      reason: 'direct_broker_request',
      speaker: 'bob',
      handoffText: "This needs Bob's review. This touches on transaction structure and requires direct principal broker consultation. I am flagging this for Bob Dyson's immediate personal attention.",
      actionLabel: "Call / Connect with Bob",
      phone: "(858) 353-1200",
      email: "bob@dysonrelo.com"
    };
  }

  // 2. Complex structural disputes, foundation cracking, landslide, geotechnical fault
  if (
    /foundation (crack|cracks|cracked|failing|failure|damage)|slope (failure|slide|movement)|structural (failure|damage|defect|dispute)|ancient landslide|soil shear/i.test(q)
  ) {
    return {
      reason: 'complex_structural_hard_stop',
      speaker: 'bob',
      handoffText: "This needs Bob's review. Complex structural, geotechnical, and foundation defects require professional engineering inspection and licensed broker oversight before any contingency removal. I am flagging this for Bob Dyson.",
      actionLabel: "Call / Connect with Bob",
      phone: "(858) 353-1200",
      email: "bob@dysonrelo.com"
    };
  }

  // 3. Exact commission / fee / rebate percentage demand
  if (
    /exact (commission|fee|percentage|rebate %|split)|how much commission exactly|what is your commission percentage|quote me a commission|exact rebate/i.test(q)
  ) {
    return {
      reason: 'exact_commission_hard_stop',
      speaker: 'charlie',
      handoffText: "This needs Bob's review. I cannot quote exact commissions, fee percentages, or rebate amounts—those depend on the specific transaction, local rules, and written representation agreements. I am flagging this for our principal broker Bob Dyson.",
      actionLabel: "Call / Connect with Bob",
      phone: "(858) 353-1200",
      email: "bob@dysonrelo.com"
    };
  }

  // 4. Legal liability, litigation, breach of contract, or suing
  if (
    /can i sue|breach of contract|legal liability|take them to court|arbitration clause|file a dre complaint|is this legally binding|am i legally (obligated|bound)|can the seller keep my deposit/i.test(q)
  ) {
    return {
      reason: 'legal_liability_hard_stop',
      speaker: 'bob',
      handoffText: "This needs Bob's review. This touches on formal contract dispute and legal liability, which exceeds automated AI guidance. I am escalating this directly to Bob Dyson for a confidential review of your documentation.",
      actionLabel: "Call / Connect with Bob",
      phone: "(858) 353-1200",
      email: "bob@dysonrelo.com"
    };
  }

  // 5. Structural tax opinion or IRS audit determination
  if (
    /irs audit|tax opinion|will i get audited|tax shelter|legal tax advice/i.test(q)
  ) {
    return {
      reason: 'tax_opinion_hard_stop',
      speaker: 'charlie',
      handoffText: "This needs Bob's review. Formal tax opinion and IRS compliance exceed automated concierge guidance. I am flagging this for Bob Dyson so our desk can coordinate proper documentation with your tax counsel and CPA.",
      actionLabel: "Call / Connect with Bob",
      phone: "(858) 353-1200",
      email: "bob@dysonrelo.com"
    };
  }

  return null;
}