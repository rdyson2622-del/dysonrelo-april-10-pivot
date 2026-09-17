import React from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, UserCheck, 
  Scale, MessageSquare, ArrowRight, Sparkles, HelpCircle 
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotVettingView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property';

  const standards = [
    {
      title: 'Zero Dual Agency',
      desc: 'Never accept representation from the listing agent. Fiduciaries must have 100% undivided loyalty to the buyer.',
      check: 'Strict Buyer Loyalty'
    },
    {
      title: 'Local Sales Verification',
      desc: 'Proof of at least 8 closed transactions within 1.5 miles over the last 18 months, verified via MLS records.',
      check: 'Hyper-Local Track Record'
    },
    {
      title: 'Deposit Defense Record',
      desc: 'Active mastery of contingency release timelines (loan, appraisal, physical) with zero forfeited earnest deposits.',
      check: 'EMD Protection Shield'
    },
    {
      title: 'Transparent Compensation',
      desc: 'Written buyer-broker agreement detailing broker fees, credits, and zero hidden transaction fees where allowed by law.',
      check: 'Clear Written Terms'
    }
  ];

  const interviewQuestions = [
    {
      q: "Bob, what are the top 3 traps when a buyer uses the listing agent?",
      label: "Dual Agency Traps",
      asker: "bob"
    },
    {
      q: "Charlie, how do I negotiate the buyer-broker commission in California?",
      label: "Commission Transparency",
      asker: "charlie"
    },
    {
      q: `Bob, how do we verify an agent's recent sales around ${shortAddr}?`,
      label: "Verify Local Comps Proof",
      asker: "bob"
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-r from-[#141414] via-[#111111] to-[#121212] p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
              EXECUTION DOOR · FIDUCIARY MATCH
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Independent Agent Vetting Desk
          </h2>
          <p className="text-xs text-stone-300">
            Never accept dual agency. Vet representation for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span> with unvarnished fiduciary standards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("I want a vetted fiduciary buyer agent match for this property");
          }}
          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 border border-white"
        >
          <span>Request Fiduciary Match</span>
          <span>→</span>
        </button>
      </div>

      {/* 4 Non-Negotiable Standards Grid */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
              The 4 Non-Negotiable Fiduciary Standards
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-400">Dyson Fiduciary Protocol</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {standards.map((std, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#181818] border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{std.title}</span>
                </h4>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                  {std.check}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {std.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison: Dual Agency Trap vs. Independent Fiduciary */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Scale className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
            Dual Agency Trap vs. Independent Fiduciary
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Listing Agent "Double End"</span>
            </div>
            <ul className="space-y-1 text-stone-300 text-[11px] list-disc list-inside">
              <li>Listing agent already has fiduciary duty to the seller</li>
              <li>Cannot reveal minimum acceptable price or flaws</li>
              <li>Collects full commission with inherent conflict of interest</li>
              <li>No aggressive inspection or credit renegotiation</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Independent Buyer Fiduciary</span>
            </div>
            <ul className="space-y-1 text-stone-300 text-[11px] list-disc list-inside">
              <li>100% undivided loyalty exclusively to you as buyer</li>
              <li>Aggressive comps audit to challenge inflated asking prices</li>
              <li>Defends earnest money deposit at every contingency deadline</li>
              <li>Where allowed by law, rebate closing credit structured</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Immediate Dialogue Prompts */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block font-bold">
          ACTIVATE CHARLIE &amp; BOB ON AGENT VETTING:
        </span>
        <div className="flex flex-wrap gap-2">
          {interviewQuestions.map((item, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => onPromptClick?.(item.q)}
              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
              <span>{item.label}</span>
              <span className="text-[9px] text-stone-400 font-mono">({item.asker})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}