import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Shield, ArrowDown } from 'lucide-react';

export default function CopilotAdminHeaderNav({ onScrollToPage1, onScrollToPage2 }) {
  return (
    <nav className="p-3 sm:p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-3 sticky top-3 z-50 backdrop-blur-md max-w-7xl mx-auto select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase font-mono">
            DYSON HOMES COPILOT
          </span>
        </div>

        {/* Main Admin Quick Access Button */}
        <Link
          to="/admin"
          className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ml-1"
          title="Open Admin Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-black" />
          <span>Admin Dashboard</span>
        </Link>
        <Link
          to="/admin/dysonhomes-copilot"
          className="px-3.5 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#D4AF37]/40 text-[#D4AF37] font-semibold text-xs hidden md:flex items-center gap-1.5 transition-all shadow-sm"
          title="Open Admin Copilot Lab"
        >
          <Shield className="w-3 h-3 text-[#D4AF37]" />
          <span>Copilot Lab</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onScrollToPage1}
          className="px-3.5 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-white font-medium text-xs transition-colors border border-white/15 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5"
        >
          <span className="font-mono text-stone-400 text-xs">1.</span>
          <span>Landing &amp; Search</span>
          <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
        </button>

        <button
          type="button"
          onClick={onScrollToPage2}
          className="px-3.5 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-white font-medium text-xs transition-colors border border-white/15 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5"
        >
          <span className="font-mono text-stone-400 text-xs">2.</span>
          <span>Fiduciary Command Center</span>
          <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
        </button>
      </div>
    </nav>
  );
}