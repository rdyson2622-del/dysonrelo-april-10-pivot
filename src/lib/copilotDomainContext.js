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
Key Diligence Rules for ${shortAddr}:
1. Active Contingency Removal: California Form RPA contingencies never expire automatically. Under contract terms, the seller must issue a 48-hour formal Notice to Buyer to Perform (NBP) before initiating cancellation. The buyer must affirmatively sign Form CR.
2. Statutory Liquidated Damages Cap: Under Cal. Civ. Code § 1675, for 1–4 unit owner-occupied residential properties, the seller's sole liquidated damages remedy for buyer default is capped at 3% of the purchase price.
3. Preliminary Title Schedule B Exceptions: Critical review required for unrecorded utility easements, CC&R architectural restrictions, and solar UCC-1 financing liens.
4. Wire Fraud Defense: All title/escrow wiring instructions must be verbally verified using an independently sourced phone number for the escrow officer prior to wiring earnest money.
5. Statutory TDS/SPQ Windows: Under Cal. Civ. Code § 1102.3, if seller disclosures are delivered or amended late, buyer retains a 3-to-5 day statutory rescission privilege.
`;

    case 'vetting':
      return `
ACTIVE DOOR: AGENT VETTING STANDARDS DESK
Key Diligence Rules for ${shortAddr}:
1. Ongoing Partnership via Referral Agreement: CoPilot does not disappear when an agent is selected. Under our formal referral agreement, CoPilot remains actively involved alongside the buyer and their vetted agent throughout the entire sequence of events (discovery, offer, inspections, escrow, and closing) as an extra layer of strategic analytical support.
2. Dedicated Buyer Loyalty: Educate the buyer on the structural conflicts of listing agent representation (the listing agent owes existing fiduciary duties to the seller to maximize sale price).
3. Vetting Benchmarks: Verify the agent's recent transaction volume in ${city}, deposit protection track record, and transparent written representation agreement terms.
4. CoPilot Role: Strategic intelligence advocate and analytical backup; the buyer makes the final choice, supported by CoPilot and the vetted local agent.
`;

    case 'roadmap':
      return `
ACTIVE DOOR: TRANSACTION MOVE ROADMAP (7-PHASE SEQUENCE)
Milestone Protocol for ${shortAddr}:
- Phase 1 (Discovery & Risk Audit): 90-day adjusted comps, natural hazard zones, and geotechnical exposure.
- Phase 2 (Agent Pairing): Pair with vetted buyer's agent under our formal referral agreement structure.
- Phase 3 (Offer & Contingency Formulation): Draft protective loan, appraisal, and physical inspection contingency clauses.
- Phase 4 (Escrow Opening & Deposit): 3-day earnest money wire with independent verbal phone verification.
- Phase 5 (Physical & Title Review): Days 1–17 specialized structural, sewer, roof, and Schedule B title exception reviews.
- Phase 6 (Appraisal & Financing): Managing appraisal gap negotiations before releasing financing contingencies.
- Phase 7 (Final Walkthrough & Closing): Verifying agreed seller repairs, signing closing statement, and county recording.
`;

    case 'dossier':
    case 'audit':
      return `
ACTIVE DOOR: PROPERTY AUDIT & COMPARATIVE ANALYSIS
Specific Property Context for ${shortAddr}:
- Subject List Price: ${dossierData?.listPrice || 'Under review'}
- Comps Analysis: ${dossierData?.compsSummary || 'Comparing recent adjusted neighborhood sales'}
- Environmental Risks: ${dossierData?.risksSummary || 'Reviewing bluff setback, drainage, and permit notes'}
- Geotechnical & Bluff Setback: California Coastal Commission mandates 75-year projected erosion setbacks and un-waivable soil boring studies along bluff zones.
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
      return '';
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

  return null;
}

/**
 * Detects whether a consumer question "Hits the Wall" (triggers strict human broker escalation).
 * Non-negotiable hard stops:
 * - Exact commissions, rebate percentages, or referral splits
 * - Formal legal/tax liability advice ("can I sue", "is this contract binding", "am I legally obligated")
 * - Complex structural disputes, arbitration, or DRE disputes
 * - Direct request for Bob Dyson or licensed broker intervention
 */
export function detectEscalationTrigger(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  // 1. Direct request to speak with Bob / Broker
  if (
    /talk to bob|speak with bob|have bob call|connect me with bob|broker review|human specialist|speak to a broker|call me/i.test(q)
  ) {
    return {
      reason: 'direct_broker_request',
      speaker: 'bob',
      handoffText: "This requires direct principal broker consultation. I am flagging this for Bob Dyson's immediate personal attention.",
      actionLabel: "Connect with Bob Dyson",
      phone: "(858) 353-1200"
    };
  }

  // 2. Exact commission / fee / rebate percentage demand
  if (
    /exact (commission|fee|percentage|rebate %|split)|how much commission exactly|what is your commission percentage|quote me a commission|exact rebate/i.test(q)
  ) {
    return {
      reason: 'exact_commission_hard_stop',
      speaker: 'charlie',
      handoffText: "I cannot quote exact commissions, fee percentages, or rebate amounts—those depend on the specific transaction, local rules, and written agreements. I am flagging this for our principal broker Bob Dyson to confirm eligibility.",
      actionLabel: "Review Fee & Rebate Terms with Bob",
      phone: "(858) 353-1200"
    };
  }

  // 3. Legal liability, litigation, or suing
  if (
    /can i sue|breach of contract|legal liability|take them to court|arbitration clause|file a dre complaint|is this legally binding/i.test(q)
  ) {
    return {
      reason: 'legal_liability_hard_stop',
      speaker: 'bob',
      handoffText: "This touches on formal contract dispute and legal liability, which exceeds automated AI guidance. I am escalating this directly to Bob Dyson for a confidential review of your documentation.",
      actionLabel: "Review Contract Dispute with Bob Dyson",
      phone: "(858) 353-1200"
    };
  }

  // 4. Structural tax opinion or IRS audit determination
  if (
    /irs audit|tax opinion|will i get audited|tax shelter|legal tax advice/i.test(q)
  ) {
    return {
      reason: 'tax_opinion_hard_stop',
      speaker: 'charlie',
      handoffText: "This requires formal review by your tax counsel and our principal broker. I am flagging this for Bob Dyson so we can coordinate proper documentation with your CPA.",
      actionLabel: "Coordinate Review with Bob Dyson",
      phone: "(858) 353-1200"
    };
  }

  return null;
}