import React, { useState } from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, CheckCircle2, X, MessageSquare, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';

export default function RealtorReturnCompanion({ activeSearch, onClose }) {
  const [minimized, setMinimized] = useState(false);

  if (!activeSearch) return null;

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl border text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer"
          style={{
            background: '#0a0a0a',
            borderColor: GOLD,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span>Active {activeSearch.engineName || 'MLS'} Search: {activeSearch.location || 'Nationwide'}</span>
          <span className="text-[10px] text-[#D4AF37] underline ml-1">Expand Return Hub</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className="rounded-2xl p-4 shadow-2xl border relative text-left"
        style={{
          background: '#0a0a0a',
          borderColor: GOLD,
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37]">
              {activeSearch.engineName || 'Realtor.com'} Search Active in New Tab
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="text-[10px] text-white/60 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              Minimize
            </button>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1 rounded cursor-pointer"
              title="Close companion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Value explanation */}
        <div className="space-y-1.5 text-xs">
          <p className="font-semibold text-white">
            Keep this DysonRelo tab open while searching {activeSearch.location ? `in ${activeSearch.location}` : 'properties'}.
          </p>
          <p className="text-[11px] text-white/70 leading-relaxed">
            When you spot a home you like on {activeSearch.engineName || 'MLS'}, do NOT click "Contact Agent" (that sells your info to 3 random paying agents). Subscribe and paste the address below for independent fiduciary agent vetting &amp; escrow auditing.
          </p>
        </div>

        {/* 1-Click Paste & Vet Box */}
        <div className="mt-2.5 pt-2 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const addr = e.target.address.value.trim();
              if (addr) {
                window.location.href = `/solutions?q=${encodeURIComponent('Please vet the listing agent and check relocation milestones for: ' + addr)}`;
              }
            }}
            className="flex items-center gap-1.5 bg-[#181818] border border-[#D4AF37]/50 rounded-xl p-1"
          >
            <input
              name="address"
              type="text"
              placeholder="Paste listing address here..."
              className="bg-transparent text-xs text-white px-2.5 py-1 w-full focus:outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] text-black font-bold text-[11px] px-3 py-1 rounded-lg shrink-0 hover:brightness-110 cursor-pointer"
            >
              Vet Agent
            </button>
          </form>
        </div>

        {/* Quick Return Action Buttons */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col gap-2">
          <Link
            to="/relocation-intake"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110 cursor-pointer shadow"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              color: '#0a0a0a',
            }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Start Full Relocation Intake &amp; Plan
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/solutions"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#181818] border border-white/10 text-[11px] font-medium text-white hover:border-[#D4AF37] transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
              Ask Charlie About an Address
            </Link>

            {activeSearch.url && (
              <a
                href={activeSearch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-[#181818] border border-white/10 text-[11px] text-white/70 hover:text-white transition-colors"
                title="Switch back to Realtor.com search"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Search Tab</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}