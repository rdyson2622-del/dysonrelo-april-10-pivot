import React from 'react';
import { 
  Truck, Sparkles, Search, ShieldCheck, Wrench, Lock, 
  Layers, Home, Paintbrush, Hammer, Fan, Droplet, Trees
} from 'lucide-react';

const INDUSTRY_ICONS = {
  moving: Truck,
  staging: Sparkles,
  home_inspection: Search,
  cleaning: Sparkles,
  plumbing: Droplet,
  hvac: Fan,
  electrical: Wrench,
  locksmith: Lock,
  storage: Layers,
  landscaping: Trees,
  painting: Paintbrush,
  handyman: Hammer,
};

export default function IndustrySelector({
  industries = [],
  selectedIndustry,
  onSelectIndustry,
  searchQuery = '',
}) {
  const filteredIndustries = industries.filter((ind) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ind.label?.toLowerCase().includes(q) ||
      ind.key?.toLowerCase().includes(q) ||
      ind.consumer_blurb?.toLowerCase().includes(q)
    );
  });

  const activeIndustryObj = industries.find((i) => i.key === selectedIndustry);

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            STEP 1: SELECT TRADE INDUSTRY
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white">
            Relocation Trade Categories
          </h2>
        </div>
        <span className="text-[11px] text-white/50">
          {filteredIndustries.length} active trade{filteredIndustries.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Horizontal pill grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filteredIndustries.map((ind) => {
          const isSelected = selectedIndustry === ind.key;
          const Icon = INDUSTRY_ICONS[ind.key] || Wrench;

          return (
            <button
              key={ind.key}
              type="button"
              onClick={() => onSelectIndustry(ind.key)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg scale-[1.02]'
                  : 'bg-[#0d0d0d] text-white border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#14120b]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                )}
              </div>
              <div className="mt-2">
                <div className="font-bold text-xs leading-snug">
                  {ind.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Industry Consumer Blurb Banner */}
      {activeIndustryObj?.consumer_blurb && (
        <div className="p-3 rounded-2xl bg-[#14120b] border border-[#D4AF37]/30 text-xs text-white/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#D4AF37]">{activeIndustryObj.label} Policy: </strong>
            {activeIndustryObj.consumer_blurb}
          </div>
        </div>
      )}
    </div>
  );
}