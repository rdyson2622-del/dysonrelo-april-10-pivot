import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, MessageSquare, ArrowRight, Shield 
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotRoadmapView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property';
  const [activeStep, setActiveStep] = useState(1);

  const phases = [
    {
      num: 1,
      title: 'Property Discovery & Risk Audit',
      timing: 'Day 0',
      status: 'In Progress (Copilot)',
      desc: 'Verify public records, unvarnished comps, geotechnical/bluff hazard zones, tax base, and permit histories.',
      trap: 'Relying on list price without checking 90-day adjusted sales.'
    },
    {
      num: 2,
      title: 'Fiduciary Agent Selection & Agreement',
      timing: 'Pre-Offer',
      status: 'Ready to Assign',
      desc: 'Pair with an independent fiduciary buyer broker with zero listing conflict, backed by written representation terms.',
      trap: 'Signing an open-ended buyer broker agreement without cancellation rights.'
    },
    {
      num: 3,
      title: 'Targeted Offer & Contingency Drafting',
      timing: 'Offer Day',
      status: 'Pending',
      desc: 'Draft purchase agreement specifying strict loan, appraisal, and physical inspection contingency protections.',
      trap: 'Waiving inspection or appraisal contingencies in a shifting market.'
    },
    {
      num: 4,
      title: 'Escrow Opening & Earnest Money Deposit',
      timing: 'Days 1–3',
      status: 'Pending',
      desc: 'Wire earnest money deposit (typically 3% in CA) directly to bonded escrow; verify wire instructions verbally to block fraud.',
      trap: 'Wire fraud interception via compromised email accounts.'
    },
    {
      num: 5,
      title: 'Physical, Geotech & Title Inspections',
      timing: 'Days 1–17',
      status: 'Pending',
      desc: 'Hire independent inspectors for structure, roof, sewer lateral, electrical, and geotechnical review if coastal.',
      trap: 'Missing the 17-day contractual deadline to request seller repair credits.'
    },
    {
      num: 6,
      title: 'Appraisal & Financing Contingency Clear',
      timing: 'Days 17–21',
      status: 'Pending',
      desc: 'Lender completes underwriting and appraisal. Negotiate price adjustments if appraisal shortfalls arise.',
      trap: 'Removing loan contingency before receiving lender written final commitment.'
    },
    {
      num: 7,
      title: 'Final Walkthrough, Funding & Recording',
      timing: 'Days 25–30',
      status: 'Pending',
      desc: 'Inspect repairs, verify condition matches contract, wire balance of funds, and record grant deed with county recorder.',
      trap: 'Failing to test all major mechanical systems before signing closing escrow documents.'
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-r from-[#141414] via-[#111111] to-[#121212] p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
              EXECUTION DOOR · MILESTONE TRACKER
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Transaction Move Roadmap
          </h2>
          <p className="text-xs text-stone-300">
            7-Phase fiduciary execution plan for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span> from discovery to keys.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("Text me the full step-by-step transaction roadmap for this home");
          }}
          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 border border-white"
        >
          <span>Send Full Roadmap</span>
          <span>→</span>
        </button>
      </div>

      {/* 7-Phase Milestone List */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
              7-Phase Deal Execution Timeline
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-400">Standard 30-Day Escrow</span>
        </div>

        <div className="space-y-2 pt-1">
          {phases.map((p) => {
            const isSelected = activeStep === p.num;
            return (
              <div 
                key={p.num}
                onClick={() => setActiveStep(p.num)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#181818] border-cyan-400/60 ring-1 ring-cyan-400/30' 
                    : 'bg-[#141414] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full text-[11px] font-mono font-bold flex items-center justify-center ${
                      p.num === 1 
                        ? 'bg-cyan-500 text-black' 
                        : 'bg-white/10 text-stone-300'
                    }`}>
                      {p.num}
                    </span>
                    <h4 className="text-xs sm:text-[13px] font-bold text-white">
                      {p.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    <span className="text-stone-400 hidden sm:inline">{p.timing}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      p.num === 1 
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' 
                        : 'bg-white/5 text-stone-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-300 pl-7.5 mt-1 leading-relaxed">
                  {p.desc}
                </p>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 pl-7.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-[10.5px] text-rose-300 font-sans flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                      <span><strong>Key Trap:</strong> {p.trap}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPromptClick?.(`Charlie, advise on Phase ${p.num} (${p.title}) for ${shortAddr}`);
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <MessageSquare className="w-3 h-3 text-cyan-300" />
                      <span>Ask Charlie about Phase {p.num}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Dialogue Prompts */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block font-bold">
          ACTIVATE CHARLIE &amp; BOB ON MILESTONES:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, what are the most critical contingency removal dates on ${shortAddr}?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Contingency Deadlines Checklist</span>
            <span className="text-[9px] text-stone-400 font-mono">(bob)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Charlie, what happens if our appraisal comes in lower than the purchase price?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-cyan-300" />
            <span>Appraisal Shortfall Protocol</span>
            <span className="text-[9px] text-stone-400 font-mono">(charlie)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, how do we negotiate repair credits vs price reductions after inspection?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Repair Credit Strategy</span>
            <span className="text-[9px] text-stone-400 font-mono">(bob)</span>
          </button>
        </div>
      </div>
    </div>
  );
}