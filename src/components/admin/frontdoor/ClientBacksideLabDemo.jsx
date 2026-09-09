import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, MicOff, BookOpen, Phone, MessageCircle, 
  X, ChevronRight, Sparkles, Volume2, ShieldCheck, 
  Layers, Compass, Newspaper, ArrowRight, UserCheck
} from 'lucide-react';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo() {
  const navigate = useNavigate();
  const [commandText, setCommandText] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap microphone to start live Voice-to-Voice with Charlie');

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceStatus('Charlie is listening (Live V2V)... "Hello! How can I help with your move today?"');
    } else {
      setIsVoiceActive(false);
      setVoiceStatus('Tap microphone to start live Voice-to-Voice with Charlie');
    }
  };

  const handleCommandSubmit = (e) => {
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

  const CORE_ACTIONS = [
    {
      id: 'request',
      title: 'Start or update a relocation request',
      desc: 'Set or update destination, budget & home criteria',
      path: '/relocation-intake',
    },
    {
      id: 'strategy',
      title: 'Ask for a strategy or solution',
      desc: 'Tax migration, 1031 exchange, or custom relocation plan',
      path: '/solutions',
    },
    {
      id: 'vet',
      title: 'Search/vet a property or agent',
      desc: 'Independent fiduciary audit of any listing link or agent',
      path: '/refer',
    },
    {
      id: 'library',
      title: 'Open My Library',
      desc: 'All stored contracts, files & history live behind this tap',
      action: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      title: 'View/update a Roadmap',
      desc: 'Step-by-step milestones, deadlines & escrow tracking',
      path: '/RelocationRoadmap',
    },
    {
      id: 'news',
      title: 'Get news/market effects',
      desc: '6AM daily real estate broadcast & interest rate pulse',
      path: '/dnn-news',
    },
    {
      id: 'concierge',
      title: 'Contact concierge',
      desc: 'Direct call or text with Bob Dyson fiduciary desk',
      action: () => window.open('tel:+18583531200'),
    },
  ];

  return (
    <div className="w-full text-left">
      {/* ========================================================
          CLEAN WIDESCREEN LANDSCAPE MODEL
          Designed for Landscape ("See the Big Picture")
          Tan backdrop (#ede0cc), black command elements, gold accents
          ======================================================== */}
      <div 
        className="w-full rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl border border-[#0a0a0a]/20 text-[#0a0a0a] space-y-6"
        style={{
          background: TAN_BG,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        
        {/* ========================================================
            1. TOP BAR: LAB IDENTIFIER, BRAND & MY LIBRARY BUTTON
            ======================================================== */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#0a0a0a]/15">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
              DEMO / LAB
            </span>
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#0a0a0a]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              DysonRelo Concierge
            </span>
            <span className="hidden sm:inline text-xs text-[#854d0e] font-semibold border-l border-[#0a0a0a]/20 pl-2">
              Landscape Master Model
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#0a0a0a]">
              <span className="text-[#854d0e] font-sans font-bold">Fiduciary Desk:</span>
              <a href="tel:+18583531200" className="hover:underline font-bold">(858) 353-1200</a>
            </div>

            {/* ONE MY LIBRARY BUTTON: STORED DATA LIVES BEHIND HERE */}
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: '#0a0a0a',
                color: GOLD,
                border: `1.5px solid ${GOLD}`,
              }}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>My Library</span>
            </button>
          </div>
        </header>

        {/* ========================================================
            2. THE PROMINENT SEARCH / COMMAND PILL + EQUAL V2V METHOD
            Wide, central, high-impact landscape command bar
            ======================================================== */}
        <section className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* 3) ONE PROMINENT SEARCH/COMMAND PILL */}
            <div className="lg:col-span-8">
              <form 
                onSubmit={handleCommandSubmit}
                className="flex items-center gap-2 p-2 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-xl text-white focus-within:ring-2 focus-within:ring-[#D4AF37]"
              >
                <div className="flex items-center gap-2.5 w-full pl-4 py-1">
                  <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={commandText}
                    onChange={(e) => setCommandText(e.target.value)}
                    placeholder="Type what you need…"
                    className="w-full bg-transparent text-sm text-white placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-xs font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0 shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
                  }}
                >
                  Go
                </button>
              </form>
            </div>

            {/* 4) TALK WITH CHARLIE AS EQUAL METHOD BESIDE THE PILL */}
            <div className="lg:col-span-4">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-full py-2.5 px-4 rounded-full border-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 ${
                  isVoiceActive 
                    ? 'bg-[#10b981] border-[#10b981] text-black font-black' 
                    : 'bg-[#0a0a0a] border-[#10b981] text-white hover:bg-[#151515]'
                }`}
              >
                <Mic className={`w-4 h-4 ${isVoiceActive ? 'text-black animate-bounce' : 'text-[#10b981] animate-pulse'}`} />
                <span className="text-xs font-bold">
                  {isVoiceActive ? 'Charlie Live (Tap to End)' : 'Talk with Charlie (Voice)'}
                </span>
              </button>
            </div>
          </div>

          {/* Voice Feedback / Spoken Line */}
          {isVoiceActive && (
            <div className="p-3 rounded-xl bg-[#0a0a0a] text-white border border-[#10b981] text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping shrink-0" />
                <span className="text-[#10b981] font-semibold italic">{voiceStatus}</span>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/talking-app')}
                className="text-[11px] text-[#D4AF37] underline font-bold whitespace-nowrap hover:text-white"
              >
                Full Studio Voice →
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            3. LANDSCAPE TWO-COLUMN LAYOUT:
            LEFT: Plain Thumb-Tap List of What DysonRelo Does
            RIGHT: Live Horizon & Fiduciary V2V Voice Deck
            ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          
          {/* LEFT: 5) PLAIN THUMB-TAP LIST TITLED WHAT DYSONRELO IS BUILT TO DO FOR THEM */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#0a0a0a]/15">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#854d0e]">
                What DysonRelo Is Built To Do For You:
              </h2>
              <span className="text-[10px] text-[#44382c] font-medium">7 Direct Capabilities</span>
            </div>

            <div className="space-y-2">
              {CORE_ACTIONS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.action) item.action();
                    else if (item.path) navigate(item.path);
                  }}
                  className="w-full p-3 rounded-xl bg-[#0a0a0a] hover:bg-[#151515] text-white border border-[#D4AF37]/40 shadow-md flex items-center justify-between text-left cursor-pointer transition-all hover:border-[#D4AF37] group active:scale-[0.99]"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-semibold">{idx + 1}.</span>
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-white/60 truncate pl-4 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CLEAN LANDSCAPE OVERVIEW & FIDUCIARY COVERAGE */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            
            {/* Voice Concierge Feature Card */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-md space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Charlie AI Relocation Concierge</span>
                </span>
                <span className="text-[10px] text-[#10b981] font-bold">Voice-To-Voice</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Direct conversational AI trained on 55+ years of nationwide real estate relocation, tax migration, and independent agent vetting.
              </p>
              <button
                type="button"
                onClick={() => navigate('/talking-app')}
                className="w-full py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#10b981] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Mic className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Launch Full Studio Voice Session →</span>
              </button>
            </div>

            {/* My Library Callout Card */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-md space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Stored Data &amp; Archives</span>
                </span>
                <span className="text-[10px] text-white/50 font-mono">Behind One Click</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                No cluttered cards on your landing page. All contracts, escrow documents, and research blueprints stay neatly archived in your Library.
              </p>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="w-full py-2 rounded-lg text-xs font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow hover:brightness-110 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open My Library</span>
              </button>
            </div>

            {/* Fiduciary Direct Contact Card */}
            <div className="p-3 rounded-xl bg-[#0a0a0a] text-white border border-white/10 text-xs flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#854d0e] font-black">Direct Desk</div>
                <div className="font-mono text-xs font-bold text-white">(858) 353-1200</div>
              </div>
              <div className="flex items-center gap-2">
                <a href="tel:+18583531200" className="px-2.5 py-1 rounded bg-[#181818] border border-[#D4AF37] text-[11px] font-bold text-white hover:bg-[#252525]">
                  Call
                </a>
                <a href="sms:+18583531200" className="px-2.5 py-1 rounded bg-[#181818] border border-[#D4AF37] text-[11px] font-bold text-white hover:bg-[#252525]">
                  Text
                </a>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================
            4. CLEAN FOOTER
            ======================================================== */}
        <footer className="pt-3 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#44382c]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Fiduciary Representation across all 50 States · Zero fees to buyers &amp; employers</span>
          </div>
          <div className="font-mono text-[#0a0a0a] text-[11px]">
            The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118
          </div>
        </footer>

      </div>

      {/* ========================================================
          6) ONE "MY LIBRARY" PANEL STUB (STORED DATA LIVES BEHIND THAT CLICK ONLY)
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-2xl p-6 border space-y-4 shadow-2xl text-left bg-[#0a0a0a] border-[#D4AF37] text-white relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h2 className="text-base font-bold text-white">My Library (DEMO / LAB)</h2>
                  <p className="text-xs text-white/50">Stored data lives exclusively behind this click</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1c1c1c] text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#D4AF37]">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">
                Stored Data Panel
              </p>
              <p className="text-xs text-white/60 leading-relaxed px-4">
                This is the single archive drawer where contracts, escrow documents, search history, and research blueprints are stored. The main landing page stays 100% clean and free of cluttered cards.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-black cursor-pointer shadow hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}