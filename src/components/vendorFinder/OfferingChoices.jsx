import React from 'react';
import { Check, Tag, Sparkles } from 'lucide-react';

export default function OfferingChoices({
  offerings = [],
  selectedOfferings = [],
  onToggleOffering,
  selectedIndustryLabel = '',
}) {
  if (offerings.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-white/50">
        No discrete service packages declared for {selectedIndustryLabel || 'this trade'} yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            STEP 2: SELECT SERVICE OFFERINGS
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white">
            Available Service Scope &amp; Packages ({selectedIndustryLabel})
          </h2>
        </div>
        <span className="text-[11px] text-[#D4AF37] font-semibold">
          {selectedOfferings.length} selected
        </span>
      </div>

      <p className="text-xs text-white/60">
        Select one or more service levels to refine your Top 5 recommendations and pricing caps.
      </p>

      {/* Offering chips/cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {offerings.map((offering) => {
          const isSelected = selectedOfferings.includes(offering.id || offering.title);

          return (
            <button
              key={offering.id || offering.title}
              type="button"
              onClick={() => onToggleOffering(offering.id || offering.title)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#18140c] border-[#D4AF37] text-white shadow-md'
                  : 'bg-black/50 border-white/10 text-white/80 hover:border-white/30 hover:bg-black/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-white leading-snug">
                    {offering.title}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                      : 'border-white/30 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {offering.short_description && (
                  <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                    {offering.short_description}
                  </p>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                <span className="uppercase font-mono tracking-wider text-[#D4AF37]">
                  {offering.kind || 'Service'}
                </span>
                {offering.preferred_vendor_name && (
                  <span className="text-white/60 font-medium truncate max-w-[150px]">
                    {offering.preferred_vendor_name}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}