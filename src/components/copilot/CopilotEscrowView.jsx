import React from 'react';
import { 
  ShieldCheck, AlertTriangle, 
  FileText, MessageSquare, ArrowRight, Scale, Check
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
      title: 'Active Contingency Release Protocol',
      statute: 'California RPA Guidelines',
      desc: 'Contingencies do not automatically expire. Under California purchase contracts, the seller must issue a 48-hour Notice to Buyer to Perform before cancellation rights apply.',
      guidance: 'Verify loan and inspection conditions in writing with your agent before releasing contingencies.'
    },
    {
      title: 'Liquidated Damages Ceiling (3%)',
      statute: 'Cal. Civ. Code § 1675',
      desc: 'In residential purchases up to 4 units, statutory liquidated damages are generally capped at 3% of the purchase price if default terms are invoked.',
      guidance: 'Ensure your initial earnest deposit aligns with statutory norms unless specifically structured otherwise.'
    },
    {
      title: 'Preliminary Title Review & Exceptions',
      statute: 'Schedule B Discovery',
      desc: 'Easements, mineral reservations, solar equipment liens, and CC&Rs are detailed in Schedule B exceptions.',
      guidance: 'Review preliminary title reports promptly with your agent and title officer within standard inspection windows.'
    },
    {
      title: 'Wire Safety & Fraud Prevention',
      statute: 'Closing Security Protocol',
      desc: 'Title and escrow instructions should always be verified directly by telephone before initiating any wire transfers.',
      guidance: 'Always confirm wiring details using a verified, independently sourced phone number for your escrow officer.'
    },
    {
      title: 'Statutory Disclosures & Review Periods',
      statute: 'Cal. Civ. Code § 1102.3',
      desc: 'If seller disclosures (TDS/SPQ) are delivered late or amended, statutory rescission rights grant specific review windows.',
      guidance: 'Track document receipt dates carefully to preserve review and cancellation privileges.'
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Escrow &amp; Deposit Advisory
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
            Deposit &amp; Title Diligence
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Clear transaction guardrails for <span className="text-[#D4AF37] font-medium">{shortAddr}</span>, ensuring earnest funds and contract rights remain thoroughly protected.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("Send me the escrow & title diligence checklist for this property");
          }}
          className="px-4 py-2 rounded-full bg-white hover:bg-stone-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <span>Email Diligence Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Referral Agreement Partnership Callout */}
      <div className="p-3.5 rounded-lg bg-[#141310] border border-[#D4AF37]/25 text-xs text-stone-300 space-y-1">
        <div className="flex items-center gap-1.5 text-[#D4AF37] font-medium text-[11.5px]">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Fiduciary Partnership Anchored in the Referral Agreement</span>
        </div>
        <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
          CoPilot does not close the transaction or replace your escrow officer. Through our formal referral agreement, we stay actively engaged alongside you and your agent as an extra set of analytical eyes—helping track deadlines, title exceptions, and contract protections.
        </p>
      </div>

      {/* Escrow Health Metrics Card */}
      <div className="rounded-xl border border-white/10 bg-[#111111] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              Core Escrow &amp; Deposit Guardrails
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-sans">California Standards</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5 text-xs">
          <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
            <span className="text-[10px] text-stone-400 block font-sans">EARNEST MONEY NORM</span>
            <span className="text-white font-medium text-xs">Up to 3% (Civ. Code 1675)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
            <span className="text-[10px] text-stone-400 block font-sans">CONTINGENCY RELEASES</span>
            <span className="text-white font-medium text-xs">Affirmative Written Notice</span>
          </div>
          <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
            <span className="text-[10px] text-stone-400 block font-sans">TITLE DISCOVERY</span>
            <span className="text-white font-medium text-xs">Schedule B Exception Review</span>
          </div>
        </div>
      </div>

      {/* Critical Escrow Considerations */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              Key Escrow Milestones to Review with Your Agent
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-sans">Transaction Diligence</span>
        </div>

        <div className="space-y-2 pt-0.5">
          {traps.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#161616] border border-white/5 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-medium text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] font-sans flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{t.title}</span>
                </h4>
                <span className="text-[9.5px] text-stone-400 bg-white/5 px-2 py-0.5 rounded font-sans self-start sm:self-auto">
                  {t.statute}
                </span>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed pl-5.5 font-sans">
                {t.desc}
              </p>

              <div className="text-[11px] text-stone-300 pl-5.5 pt-0.5 flex items-center gap-1.5 font-sans">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span><strong>Advisory Note:</strong> {t.guidance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogue Prompts */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] text-stone-400 block font-medium">
          Ask Charlie &amp; Bob About Escrow Protections:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPromptClick?.(`Bob, what should I verify in the preliminary title report Schedule B exceptions?`)}
            className="px-3 py-1.5 rounded-lg bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Title Schedule B Exceptions</span>
            <span className="text-[10px] text-stone-500 font-mono">(bob)</span>
          </button>

          <button
            type="button"
            onClick={() => onPromptClick?.(`Charlie, how does a Notice to Buyer to Perform work under California law?`)}
            className="px-3 py-1.5 rounded-lg bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>Notice to Perform Guidelines</span>
            <span className="text-[10px] text-stone-500 font-mono">(charlie)</span>
          </button>
        </div>
      </div>

    </div>
  );
}