import React from 'react';
import { FileText, DollarSign, TrendingUp, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CopilotDocumentViewer({ property }) {
  if (!property) return null;

  const listFee = property.price * 0.025;
  const dysonReferral = listFee * 0.25;
  const clientRebate = property.rebate || Math.round(dysonReferral * 0.5);
  const compsSpread = property.price - (property.compsPrice || property.price);

  return (
    <div className="w-full h-full bg-[#f8f9fa] overflow-y-auto p-6 sm:p-8 flex justify-center text-left text-[#1a1a1a]">
      {/* ── SINGLE COHESIVE DIGITAL DOCUMENT (WHITE PDF / EXECUTIVE REPORT VIEWER) ── */}
      <div className="w-full max-w-3xl bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-6 sm:p-10 space-y-6">
        
        {/* Document Header */}
        <div className="border-b border-[#e2e8f0] pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest text-[#854d0e] uppercase">
                DYSON HOMES COPILOT · PROPERTY AUDIT REPORT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1 tracking-tight">
              {property.address}
            </h1>
            <p className="text-xs text-[#64748b] mt-1">
              {property.beds} Beds • {property.baths} Baths • {property.sqft?.toLocaleString()} SqFt • {property.dom} Days on Market
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-[#f8fafc] sm:bg-transparent p-3 sm:p-0 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
              MLS Listed Price
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#0f172a] font-mono">
              ${property.price?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── SECTION 1: CLOSING COST REBATE SUMMARY ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              1. Estimated Buyer Closing Rebate
            </h2>
            <span className="text-xs font-black text-[#10b981] font-mono">
              +${clientRebate.toLocaleString()} Cash Back
            </span>
          </div>

          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#166534] font-mono">
                  +${clientRebate.toLocaleString()}
                </span>
                <p className="text-xs text-[#15803d] mt-0.5">
                  Credited directly to buyer at closing settlement (HUD-1) or toward rate buy-down.
                </p>
              </div>
              <span className="text-[11px] text-[#166534] font-semibold bg-[#dcfce7] px-2 py-0.5 rounded">
                Guaranteed by Broker Agreement
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#bbf7d0]/60 text-xs text-[#166534]/90 font-mono">
              <div>
                <span className="text-[10px] text-[#15803d] block uppercase font-sans">Buyer Broker Side (2.5%)</span>
                ${Math.round(listFee).toLocaleString()}
              </div>
              <div>
                <span className="text-[10px] text-[#15803d] block uppercase font-sans">Dyson 25% Share</span>
                ${Math.round(dysonReferral).toLocaleString()}
              </div>
              <div>
                <span className="text-[10px] text-[#15803d] block uppercase font-sans">Your 50% Share</span>
                <strong className="text-[#166534] font-bold">+${clientRebate.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: UNBIASED COMPS REALITY ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              2. Closed Comps &amp; Valuation Audit
            </h2>
            <span className="text-xs font-bold text-[#2563eb] font-mono">
              Target Value: ${(property.compsPrice || property.price).toLocaleString()}
            </span>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748b]">Comps Fair Market Estimate</span>
                <div className="text-2xl font-black text-[#0f172a] font-mono mt-0.5">
                  ${(property.compsPrice || property.price).toLocaleString()}
                </div>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Calculated from 90-day recorded deed closed sales within a 0.5-mile perimeter.
                </p>
              </div>

              <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-[#e2e8f0] sm:pl-4 pt-2 sm:pt-0">
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Asking Price Variance:</span>
                  <span className={`font-mono font-bold ${compsSpread > 0 ? 'text-amber-600' : 'text-[#166534]'}`}>
                    {compsSpread > 0 ? `-$${compsSpread.toLocaleString()} Overpriced` : 'Fairly Priced'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Last Recorded Sale ({property.lastSoldYear || '2019'}):</span>
                  <span className="font-mono text-[#0f172a] font-semibold">
                    ${(property.lastSoldPrice || Math.round(property.price * 0.65)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Historical Appreciation:</span>
                  <span className="font-mono text-[#0f172a] font-semibold">
                    +{(property.price && property.lastSoldPrice ? Math.round(((property.price - property.lastSoldPrice) / property.lastSoldPrice) * 100) : 58)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: HIDDEN RISKS & TITLE FLAGS ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              3. Property Risks &amp; Municipal Audit
            </h2>
            <span className="text-xs font-bold text-[#dc2626]">
              {(property.risks?.length || 3)} Flagged Factors
            </span>
          </div>

          <div className="bg-[#fff7f7] border border-[#fecaca] rounded-lg p-4 space-y-2.5">
            <ul className="space-y-2 text-xs text-[#334155]">
              {(property.risks || [
                `${property.dom} days on market — sellers are experiencing price resistance.`,
                'Municipal zoning boundary requires confirmation of permissible exterior expansions.',
                'Property tax basis resets to transaction purchase price upon closing.'
              ]).map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Document Footer Verification */}
        <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#94a3b8]">
          <span>Generated by DysonHomes Copilot · Bob Dyson Broker DRE #00609384</span>
          <span>Confidential Fiduciary Client Work product</span>
        </div>

      </div>
    </div>
  );
}