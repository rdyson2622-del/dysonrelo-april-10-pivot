import React, { useState } from 'react';
import { 
  Search, Sparkles, BookOpen, Video, Headphones, FileText, 
  Scale, ShieldAlert, DollarSign, Waves, ArrowRight, CheckCircle2,
  Lock, ExternalLink, HelpCircle, Briefcase
} from 'lucide-react';

export const SOLUTIONS_LIBRARY = [
  {
    id: 'hud1-rebate-line-204',
    category: 'rebates',
    categoryLabel: 'Closing Rebates',
    format: 'VIDEO HOW-TO (3 MIN)',
    formatType: 'video',
    title: 'How to Legally Receive Thousands on HUD-1 Line 204',
    subtitle: 'DOJ-Approved Buyer Commission Rebate Mechanics',
    summary: 'The U.S. Department of Justice explicitly protects buyer commission rebates. In California, Dyson & Dyson credits up to 1.5% of the purchase price directly on line 204 of your closing statement.',
    keyRule: 'Credit is applied directly against your closing costs, loan discount points, or down payment reduction.',
    promptQuery: 'How do closing rebates work on line 204 of the HUD-1 statement?',
    speaker: 'bob'
  },
  {
    id: 'contingency-shields-escrow',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'PODCAST CLIP (5 MIN)',
    formatType: 'audio',
    title: 'The 3 Escrow Traps Listing Agents Use to Lock In Earnest Money',
    subtitle: 'Bob Dyson on California Form RPA Protections',
    summary: 'Listing agents frequently pressure buyers into premature loan and appraisal contingency removals. Bob Dyson details how to draft strict 21-day contingency shields to preserve your 3% deposit.',
    keyRule: 'Never waive appraisal contingencies until the underwriter issues formal loan approval.',
    promptQuery: "Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?",
    speaker: 'bob'
  },
  {
    id: 'coastal-bluff-setbacks',
    category: 'coastal',
    categoryLabel: 'Coastal & Soil',
    format: 'FIDUCIARY PROTOCOL',
    formatType: 'doc',
    title: 'California Coastal Commission Bluff Setback Protocols',
    subtitle: 'Un-waivable Geotechnical Audits & Slope Stability',
    summary: 'Properties along La Jolla, Del Mar, Malibu, and Newport coastlines face stringent 75-year erosion setback requirements. An unvarnished geotechnical boring review must precede any non-contingent offer.',
    keyRule: 'Standard home inspectors do not inspect soil shear strength or ancient landslide planes.',
    promptQuery: 'What are the coastal bluff setback and soil stability risks in California?',
    speaker: 'charlie'
  },
  {
    id: 'prop-19-tax-portability',
    category: 'tax',
    categoryLabel: 'Tax & Prop 19',
    format: 'LEGAL MEMO & GUIDE',
    formatType: 'doc',
    title: 'Prop 19 Property Tax Base Transfer for California Homeowners',
    subtitle: 'Transfer Your Low Prop 13 Tax Base Anywhere in CA',
    summary: 'Homeowners aged 55+, severely disabled, or wildfire victims can transfer their original low property tax base up to 3 times to any replacement home of equal or greater value statewide.',
    keyRule: 'Saves affluent downsizers and relocators tens of thousands of dollars annually in ad valorem property taxes.',
    promptQuery: 'How does Prop 19 tax base portability work when relocating in California?',
    speaker: 'charlie'
  },
  {
    id: 'multiple-offer-bluff',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'VIDEO HOW-TO (4 MIN)',
    formatType: 'video',
    title: 'How to Counter the "We Have Multiple Offers" Listing Agent Bluff',
    subtitle: 'Demanding Signed Broker Certifications Under DRE Rules',
    summary: 'Unscrupulous agents fabricate phantom competing offers to push buyers above list price. Under California DRE fiduciary guidelines, we require signed agent confirmations and counter with escalating cap clauses.',
    keyRule: 'An escalation addendum must require proof of the competing bona fide written offer.',
    promptQuery: "How do you detect and defeat listing agent bluffing in multiple offer situations?",
    speaker: 'bob'
  },
  {
    id: 'title-clouds-unrecorded-easements',
    category: 'escrow',
    categoryLabel: 'Escrow & Contracts',
    format: 'FIDUCIARY PROTOCOL',
    formatType: 'doc',
    title: 'Unrecorded Easements & Boundary Encroachments in Luxury Parcels',
    subtitle: 'ALTA Extended Title Policies vs Standard CLTA',
    summary: 'Standard CLTA owner policies omit unrecorded mechanic liens, boundary line disputes, and prescriptive easements. We mandate ALTA Extended Title audits with current boundary survey stakes.',
    keyRule: 'Standard title insurance does not protect against off-record easements or neighbor fence encroachments.',
    promptQuery: 'Why is an ALTA extended title policy essential for luxury properties?',
    speaker: 'bob'
  },
  {
    id: '1031-exchange-timeline',
    category: 'tax',
    categoryLabel: 'Tax & Prop 19',
    format: 'PODCAST CLIP (6 MIN)',
    formatType: 'audio',
    title: 'The 45-Day Identification Trap in 1031 Tax-Deferred Exchanges',
    subtitle: 'Safe Harbor Intermediaries & Multi-Property Replacement',
    summary: 'The 45-day replacement property window is absolute with zero IRS grace periods. Bob Dyson explains how to pre-identify candidates and secure backup underwrites before relinquishing property closes.',
    keyRule: 'Identification must be in writing, unambiguous, and delivered to the Qualified Intermediary before midnight on Day 45.',
    promptQuery: 'How do we navigate the 45-day 1031 exchange deadline without getting trapped?',
    speaker: 'bob'
  },
  {
    id: 'broker-vs-salesperson',
    category: 'representation',
    categoryLabel: 'Fiduciary Duty',
    format: 'EXECUTIVE BRIEF',
    formatType: 'doc',
    title: 'Licensed Broker Fiduciary Representation vs Franchise Sales Agent',
    subtitle: 'Why Tier 1 Fiduciary Supervision Matters',
    summary: 'Most agents at large retail brokerages are independent contractor salespersons with zero personal liability and minimal transaction depth. Dyson & Dyson provides direct California Broker supervision (License #00609384).',
    keyRule: 'A true fiduciary is legally obligated to prioritize your net financial outcome over transaction commission.',
    promptQuery: 'What is the legal difference between a licensed broker fiduciary and a standard sales agent?',
    speaker: 'charlie'
  }
];

export default function CopilotSolutionsVault({ onPromptClick, onExplodePlaybook }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Solutions' },
    { id: 'escrow', label: 'Escrow & Traps' },
    { id: 'rebates', label: 'Closing Rebates' },
    { id: 'coastal', label: 'Coastal & Soil' },
    { id: 'tax', label: 'Tax & Prop 19' },
    { id: 'representation', label: 'Fiduciary Duty' },
  ];

  const filteredSolutions = SOLUTIONS_LIBRARY.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery = 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.keyRule.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* ── HEADER BANNER ── */}
      <div className="rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#17140b] via-[#101010] to-[#14120e] p-3.5 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                FIDUCIARY INTELLIGENCE &amp; SOLUTIONS VAULT
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Real Estate Knowledge, Playbooks &amp; Legal Shields
            </h2>
            <p className="text-xs text-stone-300">
              Most consumers move once every 5 to 7 years. Our curated vault eliminates the guesswork—covering HUD-1 rebates, contract traps, coastal hazards, and tax portability.
            </p>
          </div>

          <div className="text-[10px] text-stone-400 font-mono shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{SOLUTIONS_LIBRARY.length} Active Playbooks</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY FILTER ── */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solutions, podcast how-tos, escrow traps, Prop 19, rebates..."
            className="w-full bg-[#121212] border border-white/15 focus:border-[#D4AF37] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-stone-500 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-stone-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── SOLUTIONS CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {filteredSolutions.map((sol) => {
          const isBob = sol.speaker === 'bob';

          return (
            <div
              key={sol.id}
              className="rounded-xl bg-[#121212] border border-white/10 hover:border-[#D4AF37]/60 p-3.5 space-y-2.5 flex flex-col justify-between transition-all shadow-lg group hover:bg-[#151412]"
            >
              <div className="space-y-1.5">
                {/* Format & Speaker Tag */}
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="font-mono font-bold text-[#D4AF37] tracking-wider flex items-center gap-1">
                    {sol.formatType === 'video' ? (
                      <Video className="w-3 h-3 text-red-400" />
                    ) : sol.formatType === 'audio' ? (
                      <Headphones className="w-3 h-3 text-sky-400" />
                    ) : (
                      <FileText className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{sol.format}</span>
                  </span>

                  <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                    isBob 
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isBob ? 'Bob Dyson (Broker)' : 'Charlie (AI Voice)'}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {sol.title}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                    {sol.subtitle}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-xs text-stone-300 leading-relaxed">
                  {sol.summary}
                </p>

                {/* Key Fiduciary Rule */}
                <div className="bg-[#181818] border border-white/10 rounded-lg p-2 text-[10.5px] text-stone-300 font-mono flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Rule:</strong> {sol.keyRule}</span>
                </div>
              </div>

              {/* Action Buttons: Explode Protocol & Ask in Dialogue */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => onExplodePlaybook?.(sol)}
                  className="text-[10px] text-[#D4AF37] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  title="Explode this playbook to full screen"
                >
                  <span>⛶ Explode</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPromptClick?.(sol.promptQuery)}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/15 hover:border-[#D4AF37] text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <span>Ask {isBob ? 'Bob' : 'Charlie'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSolutions.length === 0 && (
        <div className="text-center py-8 bg-[#121212] rounded-xl border border-white/10 p-6 space-y-2">
          <HelpCircle className="w-8 h-8 text-stone-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No exact playbook found</h4>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            You can type your exact question directly into the dialogue engine on the left, and Bob or Charlie will prepare a bespoke answer.
          </p>
        </div>
      )}

    </div>
  );
}