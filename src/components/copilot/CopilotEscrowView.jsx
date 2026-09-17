import React from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, AlertTriangle, 
  FileText, CheckCircle2, MessageSquare, ArrowRight, Scale 
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotEscrowView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property';

  const traps = [
    {
      title: 'Active Contingency Removal Requirement',
      statute: 'California RPA Clause 14',
      desc: 'Contingencies DO NOT automatically expire. The seller must issue a 48-hour Notice to Buyer to Perform before cancelling or claiming deposit.',
      protection: 'Never sign form CR until lender & inspector verify in writing.'
    },
    {
      title: '3% Liquidated Damages Ceiling',
      statute: 'Cal. Civ. Code § 1675',
      desc: 'In residential purchases up to 4 units, seller retention of earnest money is legally capped at 3% of the purchase price.',
      protection: 'Ensure initial deposit does not exceed 3% without specific fiduciary counsel.'
    },
    {
      title: 'Title Preliminary Report Traps',
      statute: 'Schedule B Exceptions',
      desc: 'Unrecorded easements, solar equipment UCC liens, and HOA special assessments often hide in title Schedule B exceptions.',
      protection: 'Fiduciary review of preliminary title report within first 7 days.'
    },
    {
      title: 'Wire Fraud Interception Risk',
      statute: 'Title Cyber Security Protocol',
      desc: 'Hackers spoof escrow officer emails with fraudulent wire instructions right before closing or deposit deadlines.',
      protection: 'Always call the verified, independently sourced title telephone number.'
    },
    {
      title: 'TDS / SPQ Late Delivery Rescission',
      statute: 'Cal. Civ. Code § 1102.3',
      desc: 'If seller delivers property disclosures late or amended, buyer automatically receives 5 days to rescind and reclaim full deposit.',
      protection: 'Track disclosure receipt date to preserve statutory right to cancel.'
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-r from-[#141414] via-[#111111] to-[#121212] p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
              EXECUTION DOOR · DEPOSIT DEFENSE
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Escrow &amp; Title Contingency Shield
          </h2>
          <p className="text-xs text-stone-300">
            Fiduciary earnest money protection &amp; title defense for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("Text me the Escrow Contingency Defense checklist for this property");
          }}
          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 border border-white"
        >
          <span>Text Escrow Checklist</span>
          <span>→</span>
        </button>
      </div>

      {/* Escrow Health Card */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
              Fiduciary Deposit Defense Status
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            SHIELD ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
          <div className="p-2.5 rounded bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-sans">EARNEST MONEY LIMIT</span>
            <span className="text-white font-bold text-sm">3% Max (Civ. Code 1675)</span>
          </div>
          <div className="p-2.5 rounded bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-sans">CONTINGENCY EXPIRY</span>
            <span className="text-white font-bold text-sm">Affirmative Written Only</span>
          </div>
          <div className="p-2.5 rounded bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-sans">TITLE DEFENSE</span>
            <span className="text-white font-bold text-sm">Schedule B Exception Audit</span>
          </div>
        </div>
      </div>

      {/* The 5 Escrow Traps */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
              The 5 Critical Escrow &amp; Deposit Traps
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-400">California RPA Guardrails</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {traps.map((t, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#181818] border border-white/10 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{t.title}</span>
                </h4>
                <span className="text-[9.5px] font-mono text-stone-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 self-start sm:self-auto">
                  {t.statute}
                </span>
              </div>

              <p className="text-[11px] text-stone-300 leading-relaxed pl-5.5">
                {t.desc}
              </p>

              <div className="text-[10.5px] text-emerald-300 pl-5.5 pt-1 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span><strong>Fiduciary Rule:</strong> {t.protection}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Dialogue Prompts */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block font-bold">
          ASK BOB DYSON ABOUT ESCROW &amp; TITLE:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, how do we protect our deposit if our lender delays loan approval past Day 21 on ${shortAddr}?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Lender Delay Protection</span>
            <span className="text-[9px] text-stone-400 font-mono">(bob)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, what should I look for in the preliminary title report Schedule B exceptions?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Title Schedule B Traps</span>
            <span className="text-[9px] text-stone-400 font-mono">(bob)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Charlie, how does a Notice to Buyer to Perform work under California law?`)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3 h-3 text-emerald-400" />
            <span>Notice to Perform Rules</span>
            <span className="text-[9px] text-stone-400 font-mono">(charlie)</span>
          </button>
        </div>
      </div>
    </div>
  );
}