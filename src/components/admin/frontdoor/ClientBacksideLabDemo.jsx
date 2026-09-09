import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, ArrowRight, Phone, MessageCircle, 
  X, FileText, ChevronRight, Sparkles, Compass, ShieldCheck,
  Layers, Newspaper, UserCheck, HelpCircle
} from 'lucide-react';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo() {
  const navigate = useNavigate();
  const [commandText, setCommandText] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSubmitCommand = (e) => {
    e.preventDefault();
    if (!commandText.trim()) return;
    const q = commandText.trim();
    if (q.toLowerCase().includes('roadmap') || q.toLowerCase().includes('move')) {
      navigate('/RelocationRoadmap');
    } else if (q.toLowerCase().includes('voice') || q.toLowerCase().includes('charlie')) {
      navigate('/talking-app');
    } else if (q.toLowerCase().includes('solution') || q.toLowerCase().includes('strategy')) {
      navigate('/solutions');
    } else {
      const clean = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const THUMB_TAP_ITEMS = [
    {
      id: 'relo-request',
      label: 'Start or update a relocation request',
      sub: 'Tell us where you are moving or update your criteria',
      onClick: () => navigate('/relocation-intake'),
    },
    {
      id: 'strategy',
      label: 'Ask for a strategy or solution',
      sub: 'Tax migration, 1031 exchange, or custom gameplan',
      onClick: () => navigate('/solutions'),
    },
    {
      id: 'vet',
      label: 'Search/vet a property or agent',
      sub: 'Independent fiduciary audit of any listing or agent',
      onClick: () => navigate('/refer'),
    },
    {
      id: 'library',
      label: 'Open My Library',
      sub: 'All stored documents, contracts & history behind this tap',
      onClick: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      label: 'View/update a Roadmap',
      sub: 'Step-by-step track of your move milestones',
      onClick: () => navigate('/RelocationRoadmap'),
    },
    {
      id: 'news',
      label: 'Get news/market effects',
      sub: '6AM daily real estate news & interest rate pulse',
      onClick: () => navigate('/dnn-news'),
    },
    {
      id: 'contact',
      label: 'Contact concierge',
      sub: 'Direct call or text with Bob Dyson fiduciary desk',
      onClick: () => setIsContactOpen(true),
    },
  ];

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4 text-left">
      {/* ========================================================
          PORTRAIT MOBILE FIRST LANDING (~390px)
          Clarity > Cosmetics.
          NO sidebar on landing.
          NO stored-data cards, NO assumed active project, NO fake deadlines.
          ======================================================== */}
      <div 
        className="w-full max-w-[390px] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#0a0a0a]/20 text-[#0a0a0a] space-y-5"
        style={{
          background: TAN_BG,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* TOP BAR: LAB LABEL & MY LIBRARY BUTTON */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0a0a0a]/15">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0a0a0a] text-[#D4AF37]">
              DEMO / LAB
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
            style={{
              background: '#0a0a0a',
              color: GOLD,
              border: `1px solid ${GOLD}`,
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>My Library</span>
          </button>
        </div>

        {/* HEADER TITLE */}
        <div className="space-y-0.5">
          <h1 
            className="text-2xl font-bold text-[#0a0a0a] leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            DysonRelo Concierge
          </h1>
          <p className="text-xs text-[#854d0e] font-semibold">
            Independent Fiduciary Relocation Management
          </p>
        </div>

        {/* 3) ONE PROMINENT SEARCH/COMMAND PILL */}
        <form 
          onSubmit={handleSubmitCommand}
          className="flex items-center gap-2 p-1.5 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-lg text-white"
        >
          <div className="flex items-center gap-2 w-full pl-3 py-1">
            <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="Type what you need…"
              className="w-full bg-transparent text-xs text-white placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-full text-xs font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
            }}
          >
            Go
          </button>
        </form>

        {/* 4) TALK WITH CHARLIE AS EQUAL METHOD DIRECTLY UNDER THE PILL */}
        <button
          type="button"
          onClick={() => navigate('/talking-app')}
          className="w-full p-2.5 rounded-full bg-[#141414] hover:bg-[#1f1f1f] border border-[#10b981] text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <Mic className="w-4 h-4 text-[#10b981]" />
          <span className="text-xs font-bold text-white">
            Talk with Charlie <span className="text-[#10b981] font-semibold">(Voice Concierge)</span>
          </span>
        </button>

        {/* 5) PLAIN THUMB-TAP LIST TITLED WHAT DYSONRELO IS BUILT TO DO FOR THEM */}
        <div className="space-y-2 pt-2 border-t border-[#0a0a0a]/15">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#854d0e] px-1">
            What DysonRelo Is Built To Do For You:
          </div>

          <div className="space-y-2">
            {THUMB_TAP_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="w-full p-3 rounded-2xl bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white border border-[#D4AF37]/40 shadow flex items-center justify-between text-left cursor-pointer transition-all active:scale-98 group"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-white/60 truncate mt-0.5">
                    {item.sub}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* COMPLIANCE FOOTER LINE */}
        <div className="pt-2 text-[10px] text-[#44382c] text-center border-t border-[#0a0a0a]/10">
          The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118 · Nationwide
        </div>
      </div>

      {/* 6) ONE "MY LIBRARY" PANEL STUB (STORED DATA LIVES BEHIND THAT CLICK ONLY) */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm rounded-3xl p-5 border space-y-4 shadow-2xl text-left bg-[#0a0a0a] border-[#D4AF37] text-white relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-white">My Library (Lab Stub)</h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1c1c1c] text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#D4AF37]">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">
                Stored Data Lives Here
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed px-3">
                Contracts, escrow records, disclosures, and saved properties are stored behind this Library tap so the landing screen stays 100% clean and uncrowded.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-black cursor-pointer shadow hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT CONCIERGE MODAL */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm rounded-3xl p-5 border space-y-4 shadow-2xl text-left bg-[#0a0a0a] border-[#D4AF37] text-white relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-white">Contact Concierge</h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1c1c1c] text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 py-2 text-center">
              <p className="text-xs text-white/80">
                Direct fiduciary desk for questions, contract audits, or moving coordination.
              </p>
              <div className="font-mono text-base font-bold text-[#D4AF37]">
                (858) 353-1200
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="tel:+18583531200"
                  className="flex-1 py-2 rounded-xl bg-[#181818] border border-[#D4AF37] text-xs font-bold text-white hover:bg-[#252525] flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Call</span>
                </a>
                <a
                  href="sms:+18583531200"
                  className="flex-1 py-2 rounded-xl bg-[#181818] border border-[#D4AF37] text-xs font-bold text-white hover:bg-[#252525] flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Text</span>
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-white/80 bg-[#1c1c1c] hover:bg-[#252525] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}