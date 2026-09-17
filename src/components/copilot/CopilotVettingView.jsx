import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, UserCheck, 
  Scale, MessageSquare, ArrowRight, FileText, Check,
  Lock, Phone, CheckCircle2, Shield, Clock, AlertCircle,
  ChevronDown, ChevronUp, Video, Headphones, Sparkles
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export const VETTING_SUBJECTS = [
  {
    id: 'vetting-agent-selection',
    category: 'selection',
    categoryLabel: 'Agent Advisory',
    format: 'Video Guide (2 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/a4a2013f3_bobanswer_6a5d2e96818523aa87495089.mp4',
    title: 'Independent Agent Selection: Fiduciary Buyer Representation',
    shortHeader: 'Independent Agent Selection: Fiduciary Representation',
    subtitle: 'Guiding dedicated buyer representation with zero listing loyalty',
    summary: 'Guiding your search for dedicated buyer representation equipped with independent market intelligence. Listing agents owe their primary contractual duty to the seller; pairing with a dedicated, top-tier independent buyer specialist guarantees that all market analysis, pricing advice, and offer terms advocate strictly for your net advantage.',
    keyRule: 'Never rely on the listing agent for pricing advice or repair negotiation—independent representation is essential.',
    promptQuery: "Bob, how does Dyson & Dyson select and vet an independent buyer's agent?",
    speaker: 'bob'
  },
  {
    id: 'vetting-referral-agreement',
    category: 'structure',
    categoryLabel: 'Partnership Structure',
    format: 'Fiduciary Blueprint',
    formatType: 'doc',
    title: 'Our Role Alongside Your Agent: Supported by the Referral Agreement',
    shortHeader: 'Our Role Alongside Your Agent: Supported by Referral Agreement',
    subtitle: 'Ongoing fiduciary intelligence partner at zero additional cost to you',
    summary: 'CoPilot is not just a passive search tool, nor do we replace your licensed agent or make final transaction decisions. When you match with a top local specialist through Dyson, our formal referral agreement establishes CoPilot as your ongoing intelligence partner. We remain actively involved throughout your purchase—providing second-opinion comps, contingency tracking, and strategic analysis alongside your agent, at zero additional cost to you.',
    keyRule: 'CoPilot stays with you from first comp audit to closing deed recording under standard broker co-op split.',
    promptQuery: 'Explain how the referral agreement allows CoPilot to assist me alongside my local buyer agent at zero cost.',
    speaker: 'charlie'
  },
  {
    id: 'vetting-agent-standards',
    category: 'benchmarks',
    categoryLabel: 'Advisory Benchmarks',
    format: 'Video Guide (3 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/6f622bb1c_charlie_avatar_clean_vet.mp4',
    title: "Key Standards to Look for in a Buyer's Agent",
    shortHeader: "Buyer Agent Standards: 4 Essential Fiduciary Benchmarks",
    subtitle: 'Undivided loyalty, local sales track record, contingency diligence, transparent terms',
    summary: 'Before entering into a representation agreement, every buyer must verify four non-negotiable standards: undivided fiduciary loyalty with zero dual agency obligations, proven neighborhood transaction depth, proactive contingency and deposit diligence, and crystal-clear written compensation terms complying with CA DRE rules.',
    keyRule: 'Verify recent local sales volume and ensure strict affirmative contingency removal protocols are practiced.',
    promptQuery: 'Charlie, walk me through the 4 key benchmarks for vetting an independent buyer agent.',
    speaker: 'charlie'
  },
  {
    id: 'vetting-dual-agency',
    category: 'risks',
    categoryLabel: 'Representation Risks',
    format: 'Comparative Audit',
    formatType: 'doc',
    title: 'Understanding Dual Agency vs. Independent Representation',
    shortHeader: 'Dual Agency Risks: Listing Agent Duties vs Independent Representation',
    subtitle: 'Why working directly with the listing agent compromises your negotiating power',
    summary: 'When a buyer works directly with the listing agent, the agent becomes a dual agent or facilitator. Under California law, a dual agent cannot advocate exclusively for the lowest price or best repair credits because they owe concurrent confidentiality and fiduciary duties to the seller. Independent representation provides 100% undivided advocacy for your pricing and terms.',
    keyRule: 'In dual agency, neither party gets exclusive advocacy. Independent representation preserves total leverage.',
    promptQuery: 'Bob, what are the legal and financial risks of allowing the listing agent to represent me as a dual agent?',
    speaker: 'bob'
  },
  {
    id: 'vetting-advisory-gate',
    category: 'compliance',
    categoryLabel: 'Advisory Partnership',
    format: 'Client Agreement',
    formatType: 'doc',
    title: 'Client Advisory Partnership',
    shortHeader: 'Client Advisory Partnership',
    subtitle: 'Independent buyer advocacy backed by our California referral agreement',
    summary: 'CoPilot operates as your dedicated analytical partner throughout your home purchase under our licensed California referral structure. We pair you with an independent, vetted local buyer agent while providing continuous valuation second-looks, title review, and contingency tracking at zero additional cost to you.',
    keyRule: 'Non-exclusive confirmation activates dedicated broker desk intelligence with zero conflict of interest.',
    promptQuery: 'Charlie, why do I need to confirm non-exclusive representation before deploying broker review?',
    speaker: 'charlie'
  },
  {
    id: 'vetting-interview-checklist',
    category: 'checklist',
    categoryLabel: 'Interview Guide',
    format: 'Video Guide (3 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/3400475d9_bobanswer_6a5d2e96818523aa8749508e.mp4',
    title: 'Agent Interview Checklist: Key Questions for Local Agents',
    shortHeader: 'Agent Interview Checklist: Critical Questions for Candidate Agents',
    subtitle: 'Direct questions to verify track record, contingency handling, and fiduciary alignment',
    summary: 'A curated checklist of high-yield questions for candidate agents: How do you handle appraisal shortfalls? Do you practice dual agency? What off-market comps justify this price? How do you coordinate with CoPilot under our referral agreement?',
    keyRule: 'Interview at least two local specialists and demand written verification of their earnest deposit defense strategies.',
    promptQuery: "Bob, what specific questions should I ask when interviewing local buyer agents?",
    speaker: 'bob'
  }
];

export default function CopilotVettingView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal,
  onSelectSubject,
  activeSubject = null
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : '742 Vista Del Mar';
  const [expandedId, setExpandedId] = useState(activeSubject?.id || null);

  // Gate lifecycle: 'browse' | 'gate' | 'confirmed'
  const [gateState, setGateState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('dyson_copilot_advisory_agreed') === 'true') {
          return 'confirmed';
        }
      } catch (_) {}
    }
    return 'browse';
  });

  const [hasNoExclusive, setHasNoExclusive] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const toggleAccordion = (item) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      if (onSelectSubject) onSelectSubject(null);
    } else {
      setExpandedId(item.id);
      if (onSelectSubject) onSelectSubject(item);
    }
  };

  const handleAgreeAndSubmit = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    if (!hasNoExclusive) {
      setValidationError('Please confirm you are not currently under an exclusive representation agreement.');
      return;
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid mobile number so Bob Dyson’s desk can review your file.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();

      await base44.entities.CopilotReportRequest.create({
        phone: cleanPhone,
        full_name: fullName.trim() || undefined,
        address: propertyAddress || '742 Vista Del Mar, La Jolla, CA',
        status: 'held',
        delivery_held: true,
        source: 'advisory_agreement_gate',
        requested_at: now,
        notes: `CLIENT ADVISORY AGREEMENT CONFIRMED. Non-exclusive representation certified by client for ${shortAddr}. Held for Bob Dyson team review.`
      }).catch(err => console.warn('Non-blocking report request create error:', err));

      try {
        localStorage.setItem('dyson_copilot_advisory_agreed', 'true');
        localStorage.setItem('dyson_copilot_client_name', fullName.trim());
      } catch (_) {}

      setGateState('confirmed');
    } catch (err) {
      console.warn('Advisory agreement error:', err);
      setGateState('confirmed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interviewQuestions = [
    {
      q: "Why do I need to confirm I am not under an exclusive agreement with another broker?",
      label: "Why Confirm Non-Exclusive?",
      asker: "charlie"
    },
    {
      q: "Does CoPilot act as my licensed agent or do we pair with a local agent?",
      label: "Are You My Agent?",
      asker: "bob"
    },
    {
      q: "Bob, what are the key differences between using the listing agent versus an independent buyer's agent?",
      label: "Representation Risks",
      asker: "bob"
    },
    {
      q: `Bob, what questions should I ask when interviewing local agents for ${shortAddr}?`,
      label: "Agent Interview Checklist",
      asker: "bob"
    }
  ];

  return (
    <div className="space-y-3 animate-in fade-in duration-200 text-left text-white font-sans">
      
      {/* ── HEADER BANNER: CALM & COMPACT ── */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-3 sm:p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] font-sans text-stone-400">
                Agent Vetting &amp; Advisory Desk
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
              Independent Buyer Representation &amp; Partnership Standards
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Tap any subject header below to review the protocol. Selecting a header updates your upper Intelligence visual stage.
            </p>
          </div>

          <div className="text-[10px] text-stone-400 font-mono shrink-0 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{VETTING_SUBJECTS.length} Protocols</span>
          </div>
        </div>
      </div>

      {/* ── PROGRESSIVE DISCLOSURE ACCORDION LIST ── */}
      <div className="space-y-1.5 pt-0.5">
        {VETTING_SUBJECTS.map((item) => {
          const isExpanded = expandedId === item.id;
          const isBob = item.speaker === 'bob';

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                  : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              {/* Header Button (Visible by Default) */}
              <button
                type="button"
                onClick={() => toggleAccordion(item)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Format icon */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    item.formatType === 'video' 
                      ? 'bg-red-500/10 text-red-400' 
                      : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {item.formatType === 'video' ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-[9px] text-stone-400 font-sans">
                        {isBob ? 'Bob Dyson' : 'Charlie'}
                      </span>
                    </div>
                    <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                      isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                    }`}>
                      {item.shortHeader || item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-sans px-2 py-0.5 rounded transition-all ${
                    isExpanded ? 'bg-[#D4AF37] text-black font-semibold' : 'text-stone-400 group-hover:text-stone-200'
                  }`}>
                    {isExpanded ? 'Active in Stage' : 'View'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-white shrink-0" />
                  )}
                </div>
              </button>

              {/* Expanded Body: Detailed Content Story */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-white/5 space-y-3 animate-in fade-in duration-150">
                  
                  {/* Subtitle */}
                  <p className="text-[11px] text-[#D4AF37] font-medium font-sans">
                    {item.subtitle}
                  </p>

                  {/* ── 1. ITEM: AGENT SELECTION ── */}
                  {item.id === 'vetting-agent-selection' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/10 gap-3">
                        <span className="text-xs text-stone-300 font-sans">
                          Ready to match with an independent local specialist for {shortAddr}?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (gateState === 'confirmed') {
                              onPromptClick?.("I would like to review my agent pairing status with Bob Dyson");
                            } else {
                              // Expand the advisory gate item
                              const gateItem = VETTING_SUBJECTS.find(v => v.id === 'vetting-advisory-gate');
                              if (gateItem) {
                                toggleAccordion(gateItem);
                                setGateState('gate');
                              }
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                        >
                          <span>{gateState === 'confirmed' ? 'Agent Status' : 'Connect with an Agent'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── 2. ITEM: REFERRAL AGREEMENT PARTNERSHIP ── */}
                  {item.id === 'vetting-referral-agreement' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-center">
                          <span className="text-[10px] text-stone-400 block font-mono">ALLIANCE</span>
                          <span className="text-white font-medium text-[11px]">Buyer + Agent + Dyson</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-center">
                          <span className="text-[10px] text-stone-400 block font-mono">INDEPENDENT</span>
                          <span className="text-white font-medium text-[11px]">Zero Listing Loyalty</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-[#D4AF37]/30 text-center">
                          <span className="text-[10px] text-[#D4AF37] block font-mono">COST TO BUYER</span>
                          <span className="text-[#D4AF37] font-semibold text-[11px]">$0 Extra Fee</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 3. ITEM: 4 STANDARDS ── */}
                  {item.id === 'vetting-agent-standards' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Undivided Representation</span>
                            </span>
                            <span className="text-[9.5px] text-stone-400 bg-white/5 px-1.5 py-0.5 rounded">No Dual Agency</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Ensuring your agent works exclusively for your interests with no dual duties to the seller.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Local Sales Track Record</span>
                            </span>
                            <span className="text-[9.5px] text-stone-400 bg-white/5 px-1.5 py-0.5 rounded">Neighborhood</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Proven recent transaction history and pricing familiarity in the immediate neighborhood.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Contingency &amp; Deposit Care</span>
                            </span>
                            <span className="text-[9.5px] text-stone-400 bg-white/5 px-1.5 py-0.5 rounded">3% Deposit</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Careful guidance through inspection, appraisal, and loan contingencies to safeguard your deposit.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Clear, Transparent Terms</span>
                            </span>
                            <span className="text-[9.5px] text-stone-400 bg-white/5 px-1.5 py-0.5 rounded">Written Terms</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            A straightforward written agreement outlining services and cooperating broker split.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 4. ITEM: DUAL AGENCY VS INDEPENDENT ── */}
                  {item.id === 'vetting-dual-agency' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                        <div className="p-3 rounded-lg bg-[#181212] border border-rose-500/20 space-y-1.5">
                          <span className="text-rose-400 font-medium text-xs block">Listing Agent Dual Role</span>
                          <ul className="space-y-1 text-stone-300 text-[11px] leading-relaxed">
                            <li>• Owes pre-existing contractual duties to the seller</li>
                            <li>• Cannot advocate for a lower purchase price</li>
                            <li>• Repair &amp; credit negotiations naturally compromised</li>
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-[#111613] border border-emerald-500/20 space-y-1.5">
                          <span className="text-emerald-400 font-medium text-xs block">Independent Buyer Representation</span>
                          <ul className="space-y-1 text-stone-200 text-[11px] leading-relaxed">
                            <li>• 100% undivided loyalty exclusively to you</li>
                            <li>• Independent comps testing if price is justified</li>
                            <li>• CoPilot remains active alongside you through closing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 5. ITEM: ADVISORY AGREEMENT GATE FORM ── */}
                  {item.id === 'vetting-advisory-gate' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>

                      {gateState === 'confirmed' ? (
                        <div className="p-3.5 rounded-lg bg-[#14130d] border border-[#D4AF37]/30 space-y-2 text-xs font-sans">
                          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-white font-semibold">Advisory Partnership Confirmed · Active Through Closing</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#D4AF37]">CA DRE #02303118</span>
                          </div>
                          <p className="text-stone-300 text-[11px] leading-relaxed">
                            Your independent representation status is certified. Bob Dyson and our advisory desk are reviewing your file for <strong className="text-white">{shortAddr}</strong> alongside your local agent.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <a
                              href="tel:8583531200"
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Bob Dyson · (858) 353-1200</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onPromptClick?.(`Charlie, what are the next steps for ${shortAddr}?`)}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
                            >
                              Ask Charlie Next Steps
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleAgreeAndSubmit} className="p-3.5 rounded-lg bg-black/50 border border-white/10 space-y-3 text-xs font-sans">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-[#161616] rounded-lg border border-white/10 focus:border-[#D4AF37] px-3 py-1.5 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-mono text-stone-300 mb-1">
                                Mobile Phone Number *
                              </label>
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(858) 555-0199"
                                className="w-full bg-[#161616] rounded-lg border border-white/10 focus:border-[#D4AF37] px-3 py-1.5 text-xs text-white outline-none font-medium"
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                            <input
                              type="checkbox"
                              checked={hasNoExclusive}
                              onChange={(e) => {
                                setHasNoExclusive(e.target.checked);
                                if (e.target.checked) setValidationError('');
                              }}
                              className="mt-0.5 w-4 h-4 rounded border-stone-600 bg-stone-900 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                            />
                            <span className="text-[11px] text-stone-200 leading-relaxed">
                              I confirm I am not currently under an exclusive representation agreement with another broker for this property.
                            </span>
                          </label>

                          {validationError && (
                            <p className="text-amber-300 text-[11px] flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{validationError}</span>
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={isSubmitting || !hasNoExclusive}
                            className="w-full py-2 px-4 rounded-lg bg-white hover:bg-stone-200 disabled:opacity-40 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            {isSubmitting ? (
                              <span>Confirming...</span>
                            ) : (
                              <>
                                <span>Agree &amp; Proceed</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ── 6. ITEM: INTERVIEW CHECKLIST & PROMPTS ── */}
                  {item.id === 'vetting-interview-checklist' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                      
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-stone-400 block font-mono uppercase tracking-wider">
                          One-Tap Interview Questions for Dialogue:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {interviewQuestions.map((qItem, qIdx) => (
                            <button
                              key={qIdx}
                              type="button"
                              onClick={() => onPromptClick?.(qItem.q)}
                              className="px-2.5 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                              <span>{qItem.label}</span>
                              <span className="text-[9px] text-stone-500 font-mono">({qItem.asker})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Fiduciary Takeaway */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs text-stone-200 font-sans flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-[11px] font-medium block">Key Takeaway:</strong>
                      <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">{item.keyRule}</p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-stone-500 font-sans">
                      Dyson &amp; Dyson Advisory Standard
                    </span>

                    <button
                      type="button"
                      onClick={() => onPromptClick?.(item.promptQuery)}
                      className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Ask {isBob ? 'Bob Dyson' : 'Charlie'} in Dialogue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}