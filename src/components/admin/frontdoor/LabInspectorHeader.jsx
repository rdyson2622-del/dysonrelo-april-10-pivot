import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Laptop, Smartphone, Eye } from 'lucide-react';

export default function LabInspectorHeader({
  deviceView,
  setDeviceView,
  showAnnotations,
  setShowAnnotations,
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