import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, MessageSquare, ArrowRight, ShieldCheck, FileText
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotRoadmapView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : '742 Vista Del Mar';
  const [activeStep, setActiveStep] = useState(1);

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

      {/* ── CARD 2: ACTIVE PARTNERSHIP UNDER THE REFERRAL AGREEMENT ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12120f] border border-[#D4AF37]/40 text-stone-300 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs sm:text-[13px]">
          <FileText className="w-4 h-4 shrink-0 text-[#D4AF37]" />
          <span>Active Partnership Under the Referral Agreement</span>
        </div>
        <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed font-sans">
          Our referral agreement formally anchors CoPilot's ongoing role: we remain by your side from offer through closing, providing analytical backup to your chosen agent without interfering with their direct representation.
        </p>
      </div>

      {/* ── CARD 3: 7-PHASE TRANSACTION SEQUENCE ── */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <GitBranch className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              7-Phase Transaction Sequence
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-sans">Typical 30-Day Escrow</span>
        </div>

        <div className="space-y-3 pt-1">
          {phases.map((p) => {
            const isSelected = activeStep === p.num;
            return (
              <div 
                key={p.num}
                onClick={() => setActiveStep(p.num)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#181818] border-[#D4AF37]/50 shadow-sm' 
                    : 'bg-[#151515] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-full text-xs font-sans font-bold flex items-center justify-center shrink-0 bg-[#D4AF37] text-black shadow-sm">
                      {p.num}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {p.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-xs font-sans">
                    <span className="text-stone-400 hidden sm:inline">{p.timing}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                      isSelected
                        ? 'bg-[#222222] border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-stone-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-stone-300 pl-9 mt-2 leading-relaxed font-sans">
                  {p.desc}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 pl-9 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Ask Charlie about Phase {p.num}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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