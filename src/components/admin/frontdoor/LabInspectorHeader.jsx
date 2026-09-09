import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Laptop, Smartphone, Eye } from 'lucide-react';

export default function LabInspectorHeader({
  deviceView,
  setDeviceView,
  showAnnotations,
  setShowAnnotations,
  activeLabView = 'front_door',
  setActiveLabView,
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          FRONT DOOR LAB
        </span>
        <span className="text-xs text-white/70 hidden sm:inline">
          Interactive Prototype: National MLS + 6AM Daily News + Charlie Concierge
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Lab View Switcher */}
        {setActiveLabView && (
          <div className="flex items-center bg-[#181818] p-0.5 rounded-lg border border-[#D4AF37]/50 shadow-inner">
            <button
              onClick={() => setActiveLabView('front_door')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeLabView === 'front_door'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Public Front Door
            </button>
            <button
              onClick={() => setActiveLabView('client_backside')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeLabView === 'client_backside'
                  ? 'bg-[#10b981] text-black shadow-sm'
                  : 'text-[#fce38a] hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Client Backside DEMO</span>
            </button>
            <Link
              to="/admin/app-store-mockup?tab=app_store_catalog"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[#D4AF37] hover:text-white hover:bg-white/10 transition-all cursor-pointer border-l border-white/20 ml-1 pl-2"
              title="View the 10 DysonRelo Platform Apps & Specifications"
            >
              <span>📱 10 App Catalog</span>
            </Link>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#1c1c1c] p-0.5 rounded-lg border border-[#333]">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              deviceView === 'desktop' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              deviceView === 'mobile' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>

        {/* Annotations Toggle */}
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
            showAnnotations ? 'bg-[#222] border-[#D4AF37] text-[#D4AF37]' : 'bg-[#181818] border-[#333] text-white/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {showAnnotations ? 'Hide Design Notes' : 'Show Design Notes'}
        </button>

        <Link
          to="/portal"
          className="text-xs text-white/60 hover:text-white px-2 py-1 underline ml-2"
        >
          Back to Current Portal
        </Link>
      </div>
    </header>
  );
}