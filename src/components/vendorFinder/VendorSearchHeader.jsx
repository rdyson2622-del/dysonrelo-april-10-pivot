import React from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';

const QUICK_TRADES = [
  { key: 'moving', label: '🚚 Moving & Van Lines' },
  { key: 'staging', label: '✨ Home Staging' },
  { key: 'home_inspection', label: '🔍 Home Inspection' },
  { key: 'cleaning', label: '🧹 Move Cleaning' },
  { key: 'locksmith', label: '🔐 Locksmith & Security' },
  { key: 'storage', label: '📦 Secure Storage' },
  { key: 'plumbing', label: '🔧 Plumbing' },
  { key: 'hvac', label: '❄️ Climate / HVAC' },
];

export default function VendorSearchHeader({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onSelectIndustry,
}) {
  return (
    <div 
      className="p-5 sm:p-7 rounded-3xl border text-left shadow-2xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #18140c 0%, #0a0a0a 100%)',
        borderColor: 'rgba(212,175,55,0.45)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black font-sans">
              SUBSCRIBER VENDOR FINDER
            </span>
            <span className="text-[10px] text-white/50 font-mono">
              FIDUCIARY VENDOR ARCHITECTURE
            </span>
          </div>
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Vetted National Providers &amp; On-Demand Local Allocation
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl leading-relaxed">
            Search by trade, service need, or destination. Access curated national partners with guaranteed pricing caps and request rapid local dispatch.
          </p>
        </div>
      </div>

      {/* SEARCH-FIRST INPUT BAR */}
      <div className="mt-5 space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by trade, service, or keyword (e.g. movers, staging, inspection, deep clean, locks, storage)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-black/80 border-2 border-[#D4AF37]/50 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* QUICK TRADES ROW */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#D4AF37]" /> Quick Trades:
          </span>
          {QUICK_TRADES.map((trade) => {
            const isSelected = selectedIndustry === trade.key;
            return (
              <button
                key={trade.key}
                type="button"
                onClick={() => onSelectIndustry(trade.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-black shadow-md'
                    : 'bg-black/60 text-white/80 border border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                {trade.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}