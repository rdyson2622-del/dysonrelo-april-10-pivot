import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, 
  FileText, MessageSquare, ArrowRight, Scale, Check,
  ChevronDown, ChevronUp
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotEscrowView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal,
  onSelectSubject,
  activeSubject
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property';
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState(false);
  const [expandedTrapIdx, setExpandedTrapIdx] = useState(null);

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

      {/* ── CARD 1: PARTNERSHIP UNDER REFERRAL AGREEMENT (ONE-LINER ACCORDION) ── */}
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
            onSelectSubject?.(next ? 'escrow-partnership' : null);
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
                Fiduciary Partnership Anchored in Referral Agreement
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              Ongoing Diligence
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
              CoPilot does not close the transaction or replace your escrow officer. Through our formal referral agreement, we stay actively engaged alongside you and your agent as an extra set of analytical eyes—helping track deadlines, title exceptions, and contract protections.
            </p>
          </div>
        )}
      </div>

      {/* ── CARD 2: CORE ESCROW & DEPOSIT GUARDRAILS (ONE-LINER ACCORDION) ── */}
      <div
        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
          isGuardrailsOpen 
            ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
            : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            const next = !isGuardrailsOpen;
            setIsGuardrailsOpen(next);
            onSelectSubject?.(next ? 'compliance' : null);
          }}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
          aria-expanded={isGuardrailsOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                  GUARDRAILS
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-[9px] text-stone-400 font-sans">
                  California Standards
                </span>
              </div>
              <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                isGuardrailsOpen ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
              }`}>
                Core Escrow &amp; Deposit Guardrails
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
              3 Protections
            </span>
            <div className={`p-1 rounded-md transition-colors ${
              isGuardrailsOpen ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
            }`}>
              {isGuardrailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {isGuardrailsOpen && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-2.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-[#161616] border border-white/5 space-y-1">
                <span className="text-[9.5px] text-stone-400 block font-sans">EARNEST MONEY NORM</span>
                <span className="text-white font-medium text-xs">Up to 3% (Civ. Code § 1675)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161616] border border-white/5 space-y-1">
                <span className="text-[9.5px] text-stone-400 block font-sans">CONTINGENCY RELEASES</span>
                <span className="text-white font-medium text-xs">Affirmative Written Notice</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161616] border border-white/5 space-y-1">
                <span className="text-[9.5px] text-stone-400 block font-sans">TITLE DISCOVERY</span>
                <span className="text-white font-medium text-xs">Schedule B Exception Review</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 3: KEY ESCROW MILESTONES & TRAPS (UNIFORM ONE-LINER ACCORDIONS) ── */}
      <div className="space-y-1.5 pt-0.5">
        {traps.map((t, idx) => {
          const isSelected = expandedTrapIdx === idx;
          return (
            <div 
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isSelected 
                  ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                  : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  const next = isSelected ? null : idx;
                  setExpandedTrapIdx(next);
                  onSelectSubject?.(next !== null ? { id: `escrow-trap-${idx}`, trapIdx: idx, ...t } : null);
                }}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                aria-expanded={isSelected}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                        MILESTONE {idx + 1}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-[9px] text-stone-400 font-sans truncate">
                        {t.statute}
                      </span>
                    </div>
                    <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                      isSelected ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                    }`}>
                      {t.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                    {t.statute}
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
                    {t.desc}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#181818] border border-white/5 flex items-center gap-2 text-xs text-stone-300 font-sans">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span><strong>Advisory Note:</strong> {t.guidance}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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