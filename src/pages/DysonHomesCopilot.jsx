import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import SlideFourPrivateWealth from '@/components/admin/copilot/SlideFourPrivateWealth';
import GrokPageTwoChatCanvas from '@/components/admin/copilot/GrokPageTwoChatCanvas';
import GrokPageThreeSplitCanvas from '@/components/admin/copilot/GrokPageThreeSplitCanvas';
import CopilotPublicReadOnlyTeamRail from '@/components/admin/copilot/CopilotPublicReadOnlyTeamRail';

const TAN_BG = '#ede0cc';

export default function DysonHomesCopilot({ initialPage }) {
  const location = useLocation();
  const navigate = useNavigate();

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);

  const scrollToSection = (ref, pageNum, path) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (path && window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
  };

  useEffect(() => {
    // If an initial page prop or hash is present, scroll there on mount
    const hash = window.location.hash;
    const pathname = location.pathname;

    if (initialPage === 1 || hash === '#page-1' || hash === '#landing' || pathname === '/landing') {
      scrollToSection(page1Ref, 1);
    } else if (initialPage === 2 || hash === '#page-2' || hash === '#chat' || pathname === '/chat' || pathname === '/copilot-chat') {
      scrollToSection(page2Ref, 2);
    } else if (initialPage === 3 || hash === '#page-3' || hash === '#dossier' || pathname === '/dossier' || pathname === '/copilot-dossier') {
      scrollToSection(page3Ref, 3);
    } else if (initialPage === 4 || hash === '#page-4' || hash === '#team' || hash === '#team-rail' || pathname === '/team' || pathname === '/team-rail') {
      scrollToSection(page4Ref, 4);
    }
  }, [initialPage, location.pathname]);

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-8 select-none" style={{ background: TAN_BG }}>
      
      {/* ── TOP STICKY NAVIGATION RAIL ── */}
      <nav className="p-3 sm:p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-3 sticky top-3 z-50 backdrop-blur-md max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase font-mono">
            DYSON HOMES COPILOT
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection(page1Ref, 1, '/')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Page 1: Landing</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection(page2Ref, 2, '/chat')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Page 2: Chat Empty</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection(page3Ref, 3, '/dossier')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Page 3: Chat + Dossier</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection(page4Ref, 4, '/team')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">4</span>
            <span>Page 4: Team Rail</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>
        </div>
      </nav>

      {/* ── 4 VERIFIED LOCKED PAGES (IN ORDER) ── */}
      <main className="space-y-12 w-full flex flex-col items-center">
        
        {/* ── PAGE 1: LANDING ── */}
        <section id="page-1" ref={page1Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <SlideFourPrivateWealth
              onRunAudit={() => {
                scrollToSection(page3Ref, 3, '/dossier');
              }}
              onGoToChatCanvas={() => {
                scrollToSection(page2Ref, 2, '/chat');
              }}
            />
          </div>
        </section>

        {/* ── PAGE 2: CHAT CANVAS ── */}
        <section id="page-2" ref={page2Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <GrokPageTwoChatCanvas
              onAskAddress={() => {
                scrollToSection(page3Ref, 3, '/dossier');
              }}
              onBackToLanding={() => {
                scrollToSection(page1Ref, 1, '/');
              }}
            />
          </div>
        </section>

        {/* ── PAGE 3: CHAT + DOSSIER ── */}
        <section id="page-3" ref={page3Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <GrokPageThreeSplitCanvas
              onBackToSearch={() => {
                scrollToSection(page1Ref, 1, '/');
              }}
            />
          </div>
        </section>

        {/* ── PAGE 4: TEAM RAIL ── */}
        <section id="page-4" ref={page4Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <CopilotPublicReadOnlyTeamRail
              onAskAddress={() => {
                scrollToSection(page3Ref, 3, '/dossier');
              }}
              onBackToLanding={() => {
                scrollToSection(page1Ref, 1, '/');
              }}
            />
          </div>
        </section>

      </main>
    </div>
  );
}