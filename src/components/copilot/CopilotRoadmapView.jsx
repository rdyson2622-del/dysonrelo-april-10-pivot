import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, ChevronDown, ChevronUp, MessageSquare, ArrowRight, ShieldCheck, FileText
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotRoadmapView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal,
  onSelectSubject,
  activeSubject
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : '742 Vista Del Mar';
  const [activeStep, setActiveStep] = useState(null);
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);

  const phases = [
    {
      num: 1,
      title: 'Property Discovery & Market Assessment',
      timing: 'Day 0',
      status: 'Active Review',
      desc: 'Verify public records, recent adjusted comps, natural hazard zones, tax base details, and historical permits with CoPilot.',
      trap: 'Relying strictly on asking price without evaluating 90-day neighborhood comps.'
    },
    {
      num: 2,
      title: 'Agent Pairing & Referral Agreement Alignment',
      timing: 'Pre-Offer',
      status: 'Ready to Pair',
      desc: 'Match with a vetted independent buyer’s agent. Our formal referral agreement establishes CoPilot as your ongoing intelligence partner alongside your agent throughout escrow.',
      trap: 'Signing an open-ended representation agreement without reviewing terms.'
    },
    {
      num: 3,
      title: 'Offer Strategy & Contingency Formulation',
      timing: 'Offer Phase',
      status: 'Next Step',
      desc: 'Work with your agent and CoPilot data to structure clean loan, appraisal, and physical inspection contingency protections.',
      trap: 'Waiving property inspection contingencies without thorough specialized discovery.'
    },
    {
      num: 4,
      title: 'Escrow Opening & Earnest Money Verification',
      timing: 'Days 1–3',
      status: 'Milestone',
      desc: 'Deposit earnest funds directly with the bonded escrow holder; confirm wire instructions via independent verbal phone verification.',
      trap: 'Wire fraud interception via unverified email instructions.'
    },
    {
      num: 5,
      title: 'Comprehensive Physical & Title Review',
      timing: 'Days 1–17',
      status: 'Milestone',
      desc: 'Engage certified inspectors for structure, roof, sewer, electrical, and title Schedule B exceptions with continuous CoPilot second-look analysis.',
      trap: 'Failing to submit formal repair or credit requests prior to contractual deadlines.'
    },
    {
      num: 6,
      title: 'Appraisal & Financing Confirmation',
      timing: 'Days 17–21',
      status: 'Milestone',
      desc: 'Lender completes underwriting and valuation. Your agent and CoPilot review any appraisal gaps to negotiate solutions calmly.',
      trap: 'Releasing financing contingencies before receiving final lender loan commitment.'
    },
    {
      num: 7,
      title: 'Final Walkthrough & Closing Funding',
      timing: 'Days 25–30',
      status: 'Closing',
      desc: 'Perform walkthrough inspection, verify agreed repairs, wire closing funds, and record the grant deed with the county.',
      trap: 'Closing without verifying mechanical systems and agreed seller repair work.'
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      
      {/* ── CARD 1: MILESTONE SEQUENCE HEADER ── */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              MILESTONE SEQUENCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Transaction Move Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            A guided 7-phase sequence for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span>, with CoPilot supporting you and your agent at every milestone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("Email me the full transaction move roadmap for this property");
          }}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-200 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>Email Full Roadmap</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* ── CARD 2: ACTIVE PARTNERSHIP UNDER THE REFERRAL AGREEMENT (ONE-LINER ACCORDION) ── */}
      <div
        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
          isPartnershipOpen 
            ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
            : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            const next = !isPartnershipOpen;
            setIsPartnershipOpen(next);
            onSelectSubject?.(next ? 'roadmap-partnership' : null);
          }}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
          aria-expanded={isPartnershipOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                  PARTNERSHIP
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-[9px] text-stone-400 font-sans">
                  Referral Agreement
                </span>
              </div>
              <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                isPartnershipOpen ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
              }`}>
                Active Partnership Under the Referral Agreement
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              Fiduciary Anchor
            </span>
            <div className={`p-1 rounded-md transition-colors ${
              isPartnershipOpen ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
            }`}>
              {isPartnershipOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {isPartnershipOpen && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-2 animate-in fade-in duration-150">
            <p className="text-xs text-stone-300 leading-relaxed font-sans pt-1">
              Our referral agreement formally anchors CoPilot's ongoing role: we remain by your side from offer through closing, providing analytical backup to your chosen agent without interfering with their direct representation.
            </p>
          </div>
        )}
      </div>

      {/* ── CARD 3: 7-PHASE TRANSACTION SEQUENCE (UNIFORM ONE-LINER ACCORDIONS) ── */}
      <div className="space-y-1.5 pt-0.5">
        {phases.map((p) => {
          const isSelected = activeStep === p.num;
          return (
            <div 
              key={p.num}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isSelected 
                  ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                  : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  const next = isSelected ? null : p.num;
                  setActiveStep(next);
                  onSelectSubject?.(next !== null ? { id: `roadmap-phase-${p.num}`, phaseNum: p.num, title: p.title, timing: p.timing } : null);
                }}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                aria-expanded={isSelected}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {p.num}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                        PHASE {p.num} · {p.timing}
                      </span>
                    </div>
                    <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                      isSelected ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                    }`}>
                      {p.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                    {p.status}
                  </span>
                  <div className={`p-1 rounded-md transition-colors ${
                    isSelected ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                  }`}>
                    {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isSelected && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-xs text-stone-300 leading-relaxed font-sans pt-1">
                    {p.desc}
                  </p>

                  <div className="mt-2 p-2.5 rounded-lg bg-[#181818] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs text-stone-300 font-sans flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span><strong>Key Consideration:</strong> {p.trap}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPromptClick?.(`Charlie, advise on Phase ${p.num} (${p.title}) for ${shortAddr}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                      <span>Ask Charlie</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advisory Prompts */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <span className="text-xs text-stone-400 block font-medium">
          Ask Charlie &amp; Bob About Transaction Timing:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, what are the most critical contingency dates to track on ${shortAddr}?`)}
            className="px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Contingency Deadlines Overview</span>
            <span className="text-[10px] text-stone-500 font-mono">(bob)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Charlie, how do we handle appraisal shortfalls if the valuation comes in low?`)}
            className="px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Appraisal Shortfall Protocol</span>
            <span className="text-[10px] text-stone-500 font-mono">(charlie)</span>
          </button>
        </div>
      </div>

    </div>
  );
}