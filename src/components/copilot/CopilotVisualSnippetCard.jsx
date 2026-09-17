import React from 'react';
import { 
  FileText, AlertTriangle, CheckCircle2, XCircle, 
  Scale, Shield, ArrowRight, X, Sparkles, BookOpen
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotVisualSnippetCard({ snippet, onDismiss, onPromptClick }) {
  if (!snippet) return null;

  const { type, title, subtitle, badge, data } = snippet;

  return (
    <div className="rounded-xl border border-[#D4AF37]/50 bg-[#141310] p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
      
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-sans tracking-wide text-[#D4AF37] uppercase">
              {badge || 'Pushed from Left Panel · Fiduciary Inspection'}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss snippet"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── 1. CLAUSE COMPARISON (Defective vs. Protective) ── */}
      {type === 'clause_comparison' && data && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Defective / Risky Clause */}
            <div className="p-3.5 rounded-lg bg-[#181212] border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-medium text-xs">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Defective / Risky Clause</span>
              </div>
              <p className="text-[11px] font-mono text-stone-300 bg-black/40 p-2.5 rounded border border-white/5 leading-relaxed">
                "{data.defectiveClause}"
              </p>
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                <strong className="text-rose-300">The Trap:</strong> {data.trapExplanation}
              </p>
            </div>

            {/* Protective Fiduciary Alternative */}
            <div className="p-3.5 rounded-lg bg-[#111613] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Protective Fiduciary Standard</span>
              </div>
              <p className="text-[11px] font-mono text-stone-200 bg-black/40 p-2.5 rounded border border-white/5 leading-relaxed">
                "{data.protectiveClause}"
              </p>
              <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
                <strong className="text-emerald-300">Why It Works:</strong> {data.protectiveExplanation}
              </p>
            </div>
          </div>

          {data.takeaway && (
            <div className="p-3 rounded-lg bg-[#181818] border border-white/10 text-xs text-stone-300 flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{data.takeaway}</span>
            </div>
          )}
        </div>
      )}

      {/* ── 2. TITLE EXCEPTION REVIEW (Schedule B) ── */}
      {type === 'title_exception' && data && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#161616] border border-white/10 space-y-2">
            <span className="text-[10px] text-stone-400 font-sans">
              Preliminary Report Item #{data.itemNumber || '14'} · {data.exceptionType || 'Schedule B Exception'}
            </span>
            <p className="text-xs font-mono text-stone-200 bg-black/50 p-2.5 rounded border border-white/5 leading-relaxed">
              "{data.exceptionText}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[10px] text-stone-400 block">Impact on Ownership</span>
                <span className="text-stone-300 text-[11px]">{data.impact}</span>
              </div>
              <div className="p-2 rounded bg-black/30 border border-white/5">
                <span className="text-[10px] text-[#D4AF37] block">Required Action</span>
                <span className="text-stone-300 text-[11px]">{data.recommendedAction}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. COASTAL BLUFF SETBACK & GEOTECHNICAL MATRIX ── */}
      {type === 'bluff_setback' && data && (
        <div className="space-y-3 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
              <span className="text-[10px] text-stone-400 block">MANDATED SETBACK</span>
              <span className="text-white font-medium text-xs">{data.setback || '25–40 Feet'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
              <span className="text-[10px] text-stone-400 block">EROSION TIMELINE</span>
              <span className="text-white font-medium text-xs">{data.timeline || '75-Year Projected Retreat'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
              <span className="text-[10px] text-stone-400 block">REQUIRED STUDY</span>
              <span className="text-white font-medium text-xs">{data.study || 'Geotechnical Boring & Shear Test'}</span>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed p-3 rounded-lg bg-[#161616] border border-white/5">
            {data.advisoryNotes}
          </p>
        </div>
      )}

      {/* ── 4. PROP 19 TAX CALCULATION & SAVINGS ── */}
      {type === 'prop19_calc' && data && (
        <div className="space-y-3 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
              <span className="text-[10px] text-stone-400 block">ORIGINAL TAX BASE</span>
              <span className="text-white font-medium text-xs">{data.originalBase || '$650,000 (~$8,100/yr)'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#161616] border border-white/5 space-y-1">
              <span className="text-[10px] text-stone-400 block">NEW REPLACEMENT COST</span>
              <span className="text-white font-medium text-xs">{data.replacementCost || '$2,800,000'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#161616] border border-[#D4AF37]/30 space-y-1">
              <span className="text-[10px] text-[#D4AF37] block font-medium">ANNUAL TAX SAVINGS</span>
              <span className="text-[#D4AF37] font-semibold text-xs">{data.annualSavings || '~$26,000 / year'}</span>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed p-3 rounded-lg bg-[#161616] border border-white/5">
            {data.summary || 'Under California Prop 19, qualified homeowners aged 55+ can transfer their original taxable value statewide up to 3 times, adding only the difference between original and new sale prices.'}
          </p>
        </div>
      )}

      {/* ── 5. GENERIC VISUAL SNIPPET FALLBACK ── */}
      {(!['clause_comparison', 'title_exception', 'bluff_setback', 'prop19_calc'].includes(type)) && data && (
        <div className="p-3.5 rounded-lg bg-[#161616] border border-white/10 text-xs text-stone-300 space-y-2">
          {data.body && <p className="leading-relaxed font-sans">{data.body}</p>}
          {data.items && (
            <ul className="space-y-1.5 text-[11px] text-stone-400 font-sans pl-2">
              {data.items.map((it, idx) => (
                <li key={idx}>• {it}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Footer action */}
      {data?.followUpPrompt && onPromptClick && (
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-stone-400 font-sans">
            Have questions about this breakdown?
          </span>
          <button
            type="button"
            onClick={() => onPromptClick(data.followUpPrompt)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Ask Follow-up in Dialogue</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
          </button>
        </div>
      )}

    </div>
  );
}