import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, BookOpen, Video, Headphones, FileText, 
  CheckCircle2, ArrowRight, Sparkles, Scale, Shield, Clock,
  Search, ExternalLink
} from 'lucide-react';

export const SOLUTIONS_LIBRARY = [
  {
    id: 'prop-19-tax-portability',
    category: 'tax',
    categoryLabel: 'Tax & Prop 19',
    format: 'Tax & Planning Guide',
    formatType: 'doc',
    title: 'Prop 19 Property Tax Base Transfer for California Homeowners',
    shortHeader: 'California Prop 19: Tax Base Portability Rules',
    subtitle: 'Transfer Your Low Prop 13 Tax Base Anywhere in CA',
    summary: 'Homeowners aged 55+, severely disabled, or wildfire victims can transfer their original low property tax base up to 3 times to any replacement home of equal or greater value statewide. When downsizing or relocating, only the incremental difference above the original sales price is added to your existing base.',
    keyRule: 'Saves affluent downsizers and relocators tens of thousands of dollars annually in ad valorem property taxes.',
    promptQuery: 'How does Prop 19 tax base portability work when relocating in California?',
    speaker: 'charlie'
  },
  {
    id: '1031-exchange-timeline',
    category: 'tax',
    categoryLabel: 'Tax & Prop 19',
    format: 'Audio Brief (6 min)',
    formatType: 'audio',
    title: 'The 45-Day Identification Trap in 1031 Tax-Deferred Exchanges',
    shortHeader: '1031 Exchanges: 45-Day Identification & 180-Day Close',
    subtitle: 'Safe Harbor Intermediaries & Multi-Property Replacement',
    summary: 'The 45-day replacement property window is absolute with zero IRS grace periods. Bob Dyson explains how to pre-identify candidates and secure backup underwrites before relinquishing property closes to prevent unexpected capital gains liabilities.',
    keyRule: 'Identification must be in writing, unambiguous, and delivered to the Qualified Intermediary before midnight on Day 45.',
    promptQuery: 'How do we navigate the 45-day 1031 exchange deadline without getting trapped?',
    speaker: 'bob'
  },
  {
    id: 'trust-probate-sales',
    category: 'estate',
    categoryLabel: 'Estate & Trust',
    format: 'Advisory Guide',
    formatType: 'doc',
    title: 'Trust & Estate Real Estate Sales: IAEA vs Court Confirmation',
    shortHeader: 'Trust & Estate Sales: IAEA Authority vs Court Confirmation',
    subtitle: 'Fiduciary Authority & Notice of Proposed Action (NOPA)',
    summary: 'Selling or buying a trust or probate property requires verifying whether the executor has Full Authority under the Independent Administration of Estates Act (IAEA) or Limited Authority requiring formal court confirmation and 10% overbid proceedings.',
    keyRule: 'Full IAEA authority allows closing without court confirmation if a 15-day Notice of Proposed Action is served without objection.',
    promptQuery: 'What are the legal differences between buying a property under IAEA authority versus court confirmation?',
    speaker: 'bob'
  },
  {
    id: 'contingency-shields-escrow',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'Video Guide (3 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/94b83e0f7_reqa_6a5272697665dffe7b165e0d_bob.mp4',
    title: 'The 3 Escrow Traps Listing Agents Use to Lock In Earnest Money',
    shortHeader: 'Escrow Traps: Protecting Your 3% Earnest Deposit',
    subtitle: 'Bob Dyson on California Form RPA Protections',
    summary: 'Listing agents frequently pressure buyers into premature loan and appraisal contingency removals. Bob Dyson details how to draft strict 21-day contingency shields to preserve your 3% deposit until final underwriter approval.',
    keyRule: 'Never waive appraisal or loan contingencies until the bank underwriter issues formal written loan commitment.',
    promptQuery: "Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?",
    speaker: 'bob'
  },
  {
    id: 'lender-compliance-discovery',
    category: 'compliance',
    categoryLabel: 'Closing Compliance',
    format: 'Video Guide (3 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/3400475d9_bobanswer_6a5d2e96818523aa8749508e.mp4',
    title: 'How Fiduciary Discovery Verifies Contract & Lender Compliance',
    shortHeader: 'Lender Compliance: Fiduciary Discovery & Settlement Audits',
    subtitle: 'Escrow Settlement Discovery & Protective Contract Audits',
    summary: 'Under California broker guidelines, our fiduciary desk audits your settlement statement, title exceptions, and loan documents to ensure all seller concessions, credits, and disclosures align with lender guidelines.',
    keyRule: 'Full disclosure and independent broker review ensure zero hidden lender non-compliance or unverified title clouds before closing.',
    promptQuery: 'How does Dyson & Dyson handle transaction discovery and lender compliance?',
    speaker: 'bob'
  },
  {
    id: 'coastal-bluff-setbacks',
    category: 'coastal',
    categoryLabel: 'Coastal & Soil',
    format: 'Advisory Guide',
    formatType: 'doc',
    title: 'California Coastal Commission Bluff Setback Protocols',
    shortHeader: 'Coastal Hazards: 75-Year Bluff Retreat & Geotechnical Borings',
    subtitle: 'Geotechnical Audits & Slope Stability',
    summary: 'Properties along La Jolla, Del Mar, Malibu, and Newport coastlines face stringent 75-year erosion setback requirements. An unvarnished geotechnical boring review must precede any non-contingent offer.',
    keyRule: 'Standard home inspectors do not inspect soil shear strength or ancient landslide planes; dedicated geotechnical core studies are required.',
    promptQuery: 'What are the coastal bluff setback and soil stability risks in California?',
    speaker: 'charlie'
  },
  {
    id: 'title-clouds-unrecorded-easements',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'Advisory Guide',
    formatType: 'doc',
    title: 'Unrecorded Easements & Boundary Encroachments in Luxury Parcels',
    shortHeader: 'Title Diligence: ALTA Extended Title vs Standard CLTA',
    subtitle: 'ALTA Extended Title Policies vs Standard CLTA',
    summary: 'Standard CLTA owner policies omit unrecorded mechanic liens, boundary line disputes, and prescriptive easements. We mandate ALTA Extended Title audits with boundary survey stakes for luxury parcel protection.',
    keyRule: 'Standard title insurance does not protect against off-record easements or neighbor fence encroachments.',
    promptQuery: 'Why is an ALTA extended title policy essential for luxury properties?',
    speaker: 'bob'
  },
  {
    id: 'multiple-offer-bluff',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'Advisory Guide',
    formatType: 'doc',
    title: 'How to Counter the "We Have Multiple Offers" Listing Agent Bluff',
    shortHeader: 'Offer Strategy: Countering Phantom Competing Offers',
    subtitle: 'Demanding Signed Broker Certifications Under DRE Rules',
    summary: 'Unscrupulous agents fabricate phantom competing offers to push buyers above list price. Under California DRE fiduciary guidelines, we require signed agent confirmations and counter with escalating cap clauses.',
    keyRule: 'An escalation addendum must require written proof of the competing bona fide written offer.',
    promptQuery: "How do you detect and defeat listing agent bluffing in multiple offer situations?",
    speaker: 'bob'
  },
  {
    id: 'broker-vs-salesperson',
    category: 'representation',
    categoryLabel: 'Fiduciary Duty',
    format: 'Video Guide (2 min)',
    formatType: 'video',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/a4a2013f3_bobanswer_6a5d2e96818523aa87495089.mp4',
    title: 'Licensed Broker Fiduciary Representation vs Franchise Sales Agent',
    shortHeader: 'Broker Supervision: 55+ Years Fiduciary Advisory vs Salesperson',
    subtitle: 'Why Tier 1 Fiduciary Supervision Matters',
    summary: 'Most agents at retail brokerages are independent contractor salespersons with zero personal liability and minimal transaction depth. Dyson & Dyson provides direct California Broker supervision backed by over 55 years of national transaction leadership.',
    keyRule: 'A true fiduciary is legally obligated to prioritize your net financial outcome over transaction commission.',
    promptQuery: 'What is the legal difference between a licensed broker fiduciary and a standard sales agent?',
    speaker: 'bob'
  }
];

export default function CopilotSolutionsVault({ 
  onPromptClick, 
  onExplodePlaybook,
  onSelectSubject,
  activeSubject = null
}) {
  const [expandedId, setExpandedId] = useState(activeSubject?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (item) => {
    if (expandedId === item.id) {
      // Collapse
      setExpandedId(null);
      if (onSelectSubject) onSelectSubject(null);
    } else {
      // Expand and push to the Dynamic Stage in upper right!
      setExpandedId(item.id);
      if (onSelectSubject) onSelectSubject(item);
    }
  };

  const filteredSolutions = SOLUTIONS_LIBRARY.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.shortHeader.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      
      {/* ── HEADER BANNER: CALM & COMPACT ── */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-3 sm:p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] font-sans text-stone-400">
                Advisory Playbook Vault
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
              Real Estate Solutions &amp; Strategic Playbooks
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Tap any subject header below to review the protocol. Selecting a header updates your upper Intelligence visual stage.
            </p>
          </div>

          <div className="text-[10px] text-stone-400 font-mono shrink-0 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{SOLUTIONS_LIBRARY.length} Playbooks</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter solutions (e.g. Prop 19, 1031 Exchange, Trust Sales, Escrow Traps)..."
          className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder:text-stone-500 outline-none transition-all shadow-inner font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── PROGRESSIVE DISCLOSURE ACCORDION LIST ── */}
      <div className="space-y-1.5 pt-0.5">
        {filteredSolutions.map((sol) => {
          const isExpanded = expandedId === sol.id;
          const isBob = sol.speaker === 'bob';

          return (
            <div
              key={sol.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                  : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              {/* Header Button (Visible by Default) */}
              <button
                type="button"
                onClick={() => toggleAccordion(sol)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Format icon */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    sol.formatType === 'video' 
                      ? 'bg-red-500/10 text-red-400' 
                      : sol.formatType === 'audio' 
                        ? 'bg-sky-500/10 text-sky-400' 
                        : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {sol.formatType === 'video' ? (
                      <Video className="w-3 h-3" />
                    ) : sol.formatType === 'audio' ? (
                      <Headphones className="w-3 h-3" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                        {sol.categoryLabel}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-[9px] text-stone-400 font-sans">
                        {isBob ? 'Bob Dyson' : 'Charlie'}
                      </span>
                    </div>
                    <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                      isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                    }`}>
                      {sol.shortHeader || sol.title}
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

              {/* Expanded Body: Content Story */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-white/5 space-y-2.5 animate-in fade-in duration-150">
                  
                  {/* Subtitle */}
                  <p className="text-[11px] text-[#D4AF37] font-sans font-medium">
                    {sol.subtitle}
                  </p>

                  {/* Summary / Content Story */}
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {sol.summary}
                  </p>

                  {/* Key Fiduciary Takeaway */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs text-stone-200 font-sans flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-[11.5px] font-medium block">Key Takeaway:</strong>
                      <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">{sol.keyRule}</p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onExplodePlaybook?.(sol)}
                      className="text-[10.5px] text-stone-400 hover:text-white flex items-center gap-1 font-sans cursor-pointer transition-colors"
                      title="Explode this playbook to full screen"
                    >
                      <span>⛶ Explode View</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPromptClick?.(sol.promptQuery)}
                        className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <span>Ask {isBob ? 'Bob Dyson' : 'Charlie'} in Dialogue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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