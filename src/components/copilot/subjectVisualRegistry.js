import React from 'react';
import { 
  Scale, Shield, ShieldCheck, ShieldAlert, GitBranch, Radio, 
  Home, FileText, Clock, AlertTriangle, CheckCircle2, Lock, 
  Phone, Waves, Sparkles, DollarSign, UserCheck
} from 'lucide-react';
import { BOB_AVATAR, CHARLIE_AVATAR } from './doorAudioBriefings';

/**
 * Registry of integrated subject definitions across all categories:
 * - Property Audit (Overview, Partnership, Honest Comps, Hidden Risks, Compliance)
 * - Agent Vetting (Selection, Referral Structure, Standards, Dual Agency, Advisory Alliance)
 * - Move Roadmap (Phases 1-7, Roadmap Partnership)
 * - Escrow Watch (Contingency Notice, 3% Liquidated Damages, Schedule B Title, Wire Fraud, Statutory Review)
 * - Solutions Vault (Prop 19, 1031 Exchange, Bluff Setback, etc.)
 * - DNN News (Broadcast, Bluff Zoning, Rate Spread)
 */

export function resolveIntegratedSubject(subjectInput, activeDoor = 'dossier', property = '', dossierData = {}) {
  const shortAddr = dossierData?.shortAddress || (property ? property.split(',')[0] : '742 Vista Del Mar');
  const listPrice = dossierData?.listPrice || '$3,850,000';
  const sqft = dossierData?.building?.livingArea || dossierData?.sqft || 3400;
  const yearBuilt = dossierData?.building?.yearBuilt || dossierData?.yearBuilt || 1998;
  const apn = dossierData?.ids?.apn || '351-120-04-00';

  // Normalize subjectInput (could be a string key or an object)
  const key = typeof subjectInput === 'string' 
    ? subjectInput 
    : (subjectInput?.id || subjectInput?.key || null);

  // ─────────────────────────────────────────────────────────────
  // 1. PROPERTY AUDIT SUBJECTS
  // ─────────────────────────────────────────────────────────────
  if (key === 'overview' || key === 'audit-overview') {
    return {
      id: 'audit-overview',
      door: 'dossier',
      categoryLabel: 'PROPERTY OVERVIEW',
      title: `Property Overview · ${shortAddr}`,
      subtitle: 'Verified Public Records, APN & County Tax Attributes',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Valuation Desk',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: `Charlie here. We've verified public records for ${shortAddr}. Featuring ${Number(sqft).toLocaleString()} square feet built in ${yearBuilt}, our valuation analysis reviews comparable sales alongside local environmental hazard zones. On screen are the verified attributes, or tap below to explore unvarnished comps.`,
      promptQuery: `Charlie, walk me through the verified property attributes and valuation for ${shortAddr}`,
      visualType: 'audit_overview',
      visualData: { shortAddr, listPrice, sqft, yearBuilt, apn },
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === 'partnership' || key === 'audit-partnership') {
    return {
      id: 'audit-partnership',
      door: 'dossier',
      categoryLabel: 'PARTNERSHIP ALLIANCE',
      title: 'CoPilot Partnership with Your Agent',
      subtitle: 'Structured Referral Agreement · Continuous Involvement at $0 Cost',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Fiduciary Standards',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: `Bob Dyson here. Under our formal referral agreement, CoPilot remains actively involved alongside you and your matched buyer's agent throughout your entire purchase—providing continuous second-look comps, contingency supervision, and contract diligence with zero added fees to you.`,
      promptQuery: 'Bob, how does CoPilot stay involved alongside my agent throughout escrow?',
      visualType: 'partnership_alliance',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'comps' || key === 'audit-comps') {
    const compCount = dossierData?.comps?.length || 3;
    return {
      id: 'audit-comps',
      door: 'dossier',
      categoryLabel: 'HONEST COMPS',
      title: 'Honest Comps · Verified Comparable Sales',
      subtitle: '0.75 mi Radius · Adjusted for Square Footage & Market Shifts',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Valuation Desk',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: `Charlie here. Looking at recent verified sales within zero point seven five miles of ${shortAddr}, adjusted comps indicate current list pricing sits at a premium to closed baselines. We evaluate square footage adjustments and micro-neighborhood condition so you never overpay.`,
      promptQuery: `Charlie, analyze how ${shortAddr} compares against recent neighborhood sales`,
      visualType: 'comps_spread',
      visualData: { compCount, comps: dossierData?.comps || [] },
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === 'risks' || key === 'audit-risks') {
    return {
      id: 'audit-risks',
      door: 'dossier',
      categoryLabel: 'HIDDEN RISKS',
      title: 'Hidden Risks & Environmental Factors',
      subtitle: 'Coastal Bluff Setback, Soil Stability & Permit History',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Fiduciary Standards',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: `Bob Dyson here. In coastal and blufftop properties, geological stability and setback mandates cannot be overlooked. We scrutinize environmental hazard reports and historical permits before you remove your physical inspection contingency.`,
      promptQuery: 'Bob, what hidden geological or permit risks should we watch for on this property?',
      visualType: 'geo_risk',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'compliance' || key === 'audit-compliance') {
    return {
      id: 'audit-compliance',
      door: 'dossier',
      categoryLabel: 'COMPLIANCE & DISCOVERY',
      title: 'Compliance and Discovery Standards',
      subtitle: 'Cal. Civ. Code § 1675 · 3% EMD Statutory Cap & 48-Hr NBP Protocol',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Solutions Take',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: `Bob Dyson here. Under California Civil Code section sixteen seventy-five, seller liquidated damages are strictly capped at three percent on residential purchases. Furthermore, contingencies never expire automatically—the seller must issue a formal forty-eight-hour Notice to Perform.`,
      promptQuery: 'Bob, how does California law protect my earnest money deposit if an escrow issue arises?',
      visualType: 'compliance_shield',
      buttonLabel: 'Ask Bob →'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AGENT VETTING SUBJECTS
  // ─────────────────────────────────────────────────────────────
  if (key === 'vetting-agent-selection') {
    return {
      id: 'vetting-agent-selection',
      door: 'vetting',
      categoryLabel: 'AGENT SELECTION',
      title: 'Independent Agent Selection: Fiduciary Buyer Representation',
      subtitle: 'Guiding dedicated buyer representation with zero listing loyalty',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Fiduciary Standards',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: "Bob Dyson here. The listing agent owes their legal loyalty to the seller's price, not yours. We pair you with an elite local buyer specialist who works strictly for your financial advantage, while our fiduciary desk remains actively involved at your side.",
      promptQuery: "Bob, how does Dyson & Dyson select and vet an independent buyer's agent?",
      visualType: 'vetting_selection',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'vetting-referral-agreement') {
    return {
      id: 'vetting-referral-agreement',
      door: 'vetting',
      categoryLabel: 'PARTNERSHIP STRUCTURE',
      title: 'Our Role Alongside Your Agent: Referral Agreement Alliance',
      subtitle: 'Ongoing fiduciary intelligence partner at zero additional cost to you',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Process Director',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. Under our formal California referral agreement, CoPilot stays with you from the first comp audit through closing recordation. We provide second-look valuation, title review, and contingency tracking alongside your agent at zero added fee.',
      promptQuery: 'Explain how the referral agreement allows CoPilot to assist me alongside my local buyer agent at zero cost.',
      visualType: 'partnership_alliance',
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === 'vetting-agent-standards') {
    return {
      id: 'vetting-agent-standards',
      door: 'vetting',
      categoryLabel: 'VETTING BENCHMARKS',
      title: "Key Standards to Look for in a Buyer's Agent",
      subtitle: '4 Essential Fiduciary Benchmarks: Loyalty, Depth, Contingency Diligence, Transparent Terms',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Process Director',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. We enforce four essential standards: undivided buyer loyalty with zero dual agency, verified local sales track record, proactive affirmative contingency protocols, and transparent written representation terms complying with California regulations.',
      promptQuery: 'Charlie, walk me through the 4 key benchmarks for vetting an independent buyer agent.',
      visualType: 'vetting_standards',
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === 'vetting-dual-agency') {
    return {
      id: 'vetting-dual-agency',
      door: 'vetting',
      categoryLabel: 'REPRESENTATION RISKS',
      title: 'Understanding Dual Agency vs. Independent Representation',
      subtitle: 'Why working directly with the listing agent compromises your negotiating leverage',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Fiduciary Standards',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: 'Bob Dyson here. In dual agency, an agent cannot advocate exclusively for your lowest price or repair credits because they owe concurrent confidentiality duties to the seller. Independent representation guarantees 100% undivided advocacy for your price and terms.',
      promptQuery: 'Bob, what are the legal and financial risks of allowing the listing agent to represent me as a dual agent?',
      visualType: 'vetting_dual_agency',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'vetting-advisory-gate') {
    return {
      id: 'vetting-advisory-gate',
      door: 'vetting',
      categoryLabel: 'ADVISORY ALLIANCE',
      title: 'Client Advisory Partnership',
      subtitle: 'Independent buyer advocacy backed by our California referral agreement',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Process Director',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. Confirming non-exclusive advisory representation activates our dedicated broker desk. We pair you with an independent vetted specialist while CoPilot tracks valuation and contract milestones alongside you through closing.',
      promptQuery: 'Charlie, why do I need to confirm non-exclusive representation before deploying broker review?',
      visualType: 'partnership_alliance',
      buttonLabel: 'Ask Charlie →'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 3. MOVE ROADMAP PHASES
  // ─────────────────────────────────────────────────────────────
  if (key?.startsWith('roadmap-phase-') || (typeof subjectInput === 'object' && subjectInput?.phaseNum)) {
    const num = subjectInput?.phaseNum || parseInt(key.replace('roadmap-phase-', ''), 10) || 1;
    const phaseTitles = [
      'Property Discovery & Market Assessment',
      'Agent Pairing & Referral Agreement Alignment',
      'Offer Strategy & Contingency Formulation',
      'Escrow Opening & Earnest Money Verification',
      'Comprehensive Physical & Title Review',
      'Appraisal & Financing Confirmation',
      'Final Walkthrough & Closing Recordation'
    ];
    const timings = ['Day 0', 'Pre-Offer', 'Offer Phase', 'Days 1–3', 'Days 1–17', 'Days 10–21', 'Days 25–30'];
    const pTitle = phaseTitles[num - 1] || `Phase ${num}`;
    const pTiming = timings[num - 1] || 'Milestone';
    const isBob = num === 2 || num === 4 || num === 5;

    return {
      id: `roadmap-phase-${num}`,
      door: 'roadmap',
      categoryLabel: `ROADMAP · PHASE ${num} OF 7`,
      title: `${num}. ${pTitle}`,
      subtitle: `${pTiming} · CoPilot Supervised Milestone`,
      speaker: isBob ? 'bob' : 'charlie',
      speakerName: isBob ? 'Bob Dyson' : 'Charlie Simmons',
      speakerRole: isBob ? 'Principal Broker Solutions Take' : 'AI Concierge & Process Director',
      avatar: isBob ? BOB_AVATAR : CHARLIE_AVATAR,
      accentColor: isBob ? '#D4AF37' : '#10b981',
      spokenText: isBob
        ? `Bob Dyson here on Phase ${num}: ${pTitle}. At this milestone, verified documentation and strict adherence to contractual timelines safeguard your deposit. CoPilot reviews every condition alongside your agent.`
        : `Charlie here on Phase ${num}: ${pTitle}. Here we coordinate verified data, title review, and inspection scheduling so you stay ahead of every escrow deadline.`,
      promptQuery: `Explain Phase ${num}: ${pTitle} in the Move Roadmap and what milestones I must complete`,
      visualType: 'roadmap_phase',
      visualData: { phaseNum: num, title: pTitle, timing: pTiming },
      buttonLabel: isBob ? 'Ask Bob →' : 'Ask Charlie →'
    };
  }

  if (key === 'roadmap-partnership') {
    return {
      id: 'roadmap-partnership',
      door: 'roadmap',
      categoryLabel: 'ROADMAP ALLIANCE',
      title: 'CoPilot Role Across the 7 Phases',
      subtitle: 'From Day 0 Discovery to Final Deed Recording',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Process Director',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. CoPilot is your ongoing analytical copilot across all seven transaction phases. We work seamlessly alongside your agent to ensure second-look valuation, geotechnical awareness, and contingency protections at every step.',
      promptQuery: 'Charlie, explain how CoPilot stays engaged across all 7 roadmap phases',
      visualType: 'partnership_alliance',
      buttonLabel: 'Ask Charlie →'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 4. ESCROW WATCH TRAPS & SHIELDS
  // ─────────────────────────────────────────────────────────────
  if (key?.startsWith('escrow-trap-') || (typeof subjectInput === 'object' && subjectInput?.trapIdx !== undefined)) {
    const idx = subjectInput?.trapIdx !== undefined ? subjectInput.trapIdx : parseInt(key.replace('escrow-trap-', ''), 10) || 0;
    const trapDefinitions = [
      {
        statute: 'California RPA Guidelines',
        title: 'Active Contingency Release Protocol',
        desc: 'Contingencies never expire automatically. Seller must issue a formal 48-Hour Notice to Perform.',
        speech: 'Bob Dyson here. In California standard contracts, contingencies never automatically expire. The seller must issue a formal forty-eight-hour Notice to Buyer to Perform before cancellation rights apply. Never rush removal until all loan, physical, and title discoveries are satisfied in writing.'
      },
      {
        statute: 'Cal. Civ. Code § 1675',
        title: 'Liquidated Damages Ceiling (3%)',
        desc: 'Statutory damages for buyer default capped at 3% on 1-4 unit residential.',
        speech: 'Bob Dyson here. Under California Civil Code section sixteen seventy-five, liquidated damages for buyer default on one-to-four unit residential purchases are capped at three percent. Never deposit funds exceeding statutory norms without dedicated fiduciary review.'
      },
      {
        statute: 'Schedule B Discovery',
        title: 'Preliminary Title Review & Exceptions',
        desc: 'Unrecorded easements, solar liens, and CC&R restrictions detailed in preliminary title.',
        speech: 'Bob Dyson here. Preliminary title reports reveal critical Schedule B exceptions—including solar liens, utility easements, and setback encumbrances. We inspect these exceptions thoroughly before contingency release.'
      },
      {
        statute: 'Closing Security Protocol',
        title: 'Wire Safety & Fraud Prevention',
        desc: 'Direct verbal phone verification required prior to sending earnest funds.',
        speech: 'Bob Dyson here. Wire fraud interception is real. Never wire earnest money or closing funds based on email instructions without independent telephone verification directly with your escrow officer at a verified phone number.'
      },
      {
        statute: 'Cal. Civ. Code § 1102.3',
        title: 'Statutory Disclosures & Review Periods',
        desc: 'Late or amended seller disclosures grant statutory 5-day rescission privileges.',
        speech: 'Bob Dyson here. Under California law, if seller disclosures are delivered late or amended, statutory rescission rights grant a five-day review window. We track every document delivery date so your cancellation rights remain preserved.'
      }
    ];

    const currentTrap = trapDefinitions[idx] || trapDefinitions[0];
    return {
      id: `escrow-trap-${idx}`,
      door: 'escrow',
      categoryLabel: currentTrap.statute,
      title: currentTrap.title,
      subtitle: currentTrap.desc,
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Solutions Take',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: currentTrap.speech,
      promptQuery: `Bob, explain ${currentTrap.title} and how we protect our earnest money deposit`,
      visualType: 'escrow_guardrail',
      visualData: { idx, ...currentTrap },
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'escrow-partnership') {
    return {
      id: 'escrow-partnership',
      door: 'escrow',
      categoryLabel: 'ESCROW DILIGENCE',
      title: 'Escrow Diligence Alongside Your Agent',
      subtitle: 'Contingency Tracking & Schedule B Title Review at $0 Cost',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Solutions Take',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: 'Bob Dyson here. Once escrow is open, CoPilot tracks every contingency milestone alongside your licensed agent. We review preliminary title exceptions and affirmative removal documents to make sure your earnest money is never placed in jeopardy.',
      promptQuery: 'Bob, how does CoPilot track contingency timelines with my agent during escrow?',
      visualType: 'partnership_alliance',
      buttonLabel: 'Ask Bob →'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 5. SOLUTIONS VAULT SUBJECTS
  // ─────────────────────────────────────────────────────────────
  if (key === 'prop-19-tax-portability') {
    return {
      id: 'prop-19-tax-portability',
      door: 'solutions',
      categoryLabel: 'PROP 19 TAX PORTABILITY',
      title: 'Prop 19 Tax Base Transfer Rules',
      subtitle: 'Transfer your lower property tax base up to 3 times in California',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Valuation Desk',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. Under California Proposition 19, homeowners age 55 and older, or severely disabled individuals, can transfer their existing taxable property base to a replacement home anywhere in California up to three times, often saving tens of thousands of dollars per year.',
      promptQuery: 'Explain Prop 19 tax base transfer rules and estimated annual savings',
      visualType: 'prop19_tax',
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === '1031-exchange-timeline') {
    return {
      id: '1031-exchange-timeline',
      door: 'solutions',
      categoryLabel: '1031 SAFE HARBOR',
      title: '1031 Exchange Strict Deadlines & Rules',
      subtitle: 'Day 45 Identification & Day 180 Closing with Zero Extensions',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Solutions Take',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: 'Bob Dyson here. In a 1031 tax-deferred exchange, timelines are unforgiving. You have exactly 45 calendar days from the sale of your relinquished property to identify up to three replacement properties, and 180 days to close. The IRS allows zero extensions.',
      promptQuery: 'Bob, what are the strict deadlines and common traps in a 1031 exchange?',
      visualType: '1031_exchange',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'coastal-bluff-setbacks') {
    return {
      id: 'coastal-bluff-setbacks',
      door: 'solutions',
      categoryLabel: 'COASTAL COMMISSION',
      title: 'Coastal Bluff Setbacks & Geotechnical Study',
      subtitle: '75-Year Economic Retreat Mandate & Soil Core Borings',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge & Valuation Desk',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. Coastal properties in California are subject to strict Coastal Commission blufftop setback rules requiring 75-year economic life retreat studies. Core soil boring reports must be verified before waiving inspection contingencies.',
      promptQuery: 'What are the coastal bluff setback and geotechnical soil stability requirements?',
      visualType: 'geo_risk',
      buttonLabel: 'Ask Charlie →'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 6. NEWS STORIES
  // ─────────────────────────────────────────────────────────────
  if (key === 'news-broadcast' || key === 'news-main') {
    return {
      id: 'news-broadcast',
      door: 'news',
      categoryLabel: 'DNN MARKET BROADCAST',
      title: 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience',
      subtitle: 'Daily Broadcast · Coastal Inventory & Rate Movements',
      speaker: 'charlie_bob',
      speakerName: 'Charlie & Bob',
      speakerRole: 'DNN Daily Market Desk',
      avatar: CHARLIE_AVATAR,
      accentColor: '#D4AF37',
      spokenText: "Charlie and Bob here at the DNN market desk. Today's broadcast analyzes constrained coastal luxury inventory and mortgage rate stabilization at 6.45%. Watch the broadcast or tap below to explore offer strategies.",
      promptQuery: "Bob, how does today's inventory news affect our offer strategy?",
      visualType: 'news_broadcast',
      buttonLabel: 'Ask Bob →'
    };
  }

  if (key === 'news-bluff') {
    return {
      id: 'news-bluff',
      door: 'news',
      categoryLabel: 'ZONING & SOIL DISCOVERY',
      title: 'California Coastal Commission Bluff Setback Protocols Tightened',
      subtitle: 'New Soil Stability Mandates Prior to Title Transfer',
      speaker: 'charlie',
      speakerName: 'Charlie Simmons',
      speakerRole: 'AI Concierge',
      avatar: CHARLIE_AVATAR,
      accentColor: '#10b981',
      spokenText: 'Charlie here. The California Coastal Commission has issued updated geotechnical standards requiring un-waivable soil stability audits before title transfer in coastal zones. Review how this impacts your due diligence timeline.',
      promptQuery: 'Tell me more about coastal zoning and bluff setback restrictions',
      visualType: 'geo_risk',
      buttonLabel: 'Ask Charlie →'
    };
  }

  if (key === 'news-rates') {
    return {
      id: 'news-rates',
      door: 'news',
      categoryLabel: 'RATES & ESCROW',
      title: 'Conforming Jumbo Rate Spread Stabilizes at 6.45%',
      subtitle: 'Structuring Fiduciary Contingency Shields in Rate Fluctuations',
      speaker: 'bob',
      speakerName: 'Bob Dyson',
      speakerRole: 'Principal Broker Solutions Take',
      avatar: BOB_AVATAR,
      accentColor: '#D4AF37',
      spokenText: 'Bob Dyson here. Jumbo financing spreads have stabilized near 6.45%. In fluctuating rate markets, structuring loan contingency review windows carefully is critical to protecting your earnest money deposit.',
      promptQuery: 'What are the latest mortgage interest rate adjustments and loan contingency traps?',
      visualType: 'compliance_shield',
      buttonLabel: 'Ask Bob →'
    };
  }

  // If a custom subject object was passed that already has title and details, wrap it
  if (typeof subjectInput === 'object' && subjectInput !== null && subjectInput.title) {
    const isBob = subjectInput.speaker === 'bob';
    return {
      id: subjectInput.id || 'custom-subject',
      door: activeDoor || 'dossier',
      categoryLabel: subjectInput.categoryLabel || subjectInput.category || 'FIDUCIARY SUBJECT',
      title: subjectInput.title,
      subtitle: subjectInput.subtitle || subjectInput.shortHeader || subjectInput.keyRule || '',
      speaker: subjectInput.speaker || (isBob ? 'bob' : 'charlie'),
      speakerName: subjectInput.speakerName || (isBob ? 'Bob Dyson' : 'Charlie Simmons'),
      speakerRole: subjectInput.speakerRole || (isBob ? 'Principal Broker Fiduciary Standards' : 'AI Concierge'),
      avatar: isBob ? BOB_AVATAR : CHARLIE_AVATAR,
      accentColor: isBob ? '#D4AF37' : '#10b981',
      spokenText: subjectInput.spokenText || subjectInput.summary || subjectInput.desc || subjectInput.title,
      promptQuery: subjectInput.promptQuery || `Tell me more about ${subjectInput.title}`,
      visualType: subjectInput.visualType || 'custom_card',
      videoUrl: subjectInput.videoUrl || null,
      buttonLabel: isBob ? 'Ask Bob →' : 'Ask Charlie →'
    };
  }

  // Otherwise, return null (indicating door overview should be rendered)
  return null;
}