import React, { useState, useRef, useEffect } from 'react';
import { 
  DollarSign, Copy, Check, ArrowDown, Monitor, Smartphone
} from 'lucide-react';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

const TAN_BG = '#ede0cc';

// Four locked uploaded PNG assets in exact order
const LOCKED_PAGES = [
  {
    id: 'page-1',
    number: '1',
    title: 'Page 1: Landing',
    url: 'https://dysonhomes.com',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a6fa3abd7_dysonhomes-page1-landing-LOCKED.png',
    alt: 'DysonHomes Copilot Page 1 Landing'
  },
  {
    id: 'page-2',
    number: '2',
    title: 'Page 2: Chat Empty',
    url: 'https://dysonhomes.com/chat',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/b1a35db81_dysonhomes-page2-chat-empty-LOCKED.png',
    alt: 'DysonHomes Copilot Page 2 Chat Empty'
  },
  {
    id: 'page-3',
    number: '3',
    title: 'Page 3: Chat + Dossier',
    url: 'https://dysonhomes.com/dossier',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0432c81ce_dysonhomes-page3-chat-dossier-LOCKED.png',
    alt: 'DysonHomes Copilot Page 3 Chat Dossier'
  },
  {
    id: 'team-rail',
    number: '4',
    title: 'Public Read-Only Team Rail',
    url: 'https://dysonhomes.com/team',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/e28f5a5ef_dysonhomes-public-readonly-team-rail-FIXED.png',
    alt: 'DysonHomes Public Read-Only Team Rail'
  }
];

export default function AdminDysonHomesCopilot({ initialPage }) {
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [activeTab, setActiveTab] = useState('vertical_scroll'); // vertical_scroll | dnn_sponsor | admin_specs
  const [copiedScript, setCopiedScript] = useState(false);

  const sectionRefs = {
    'page-1': useRef(null),
    'page-2': useRef(null),
    'page-3': useRef(null),
    'team-rail': useRef(null)
  };

  const scrollToSection = (id) => {
    const ref = sectionRefs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (initialPage === 1) scrollToSection('page-1');
    else if (initialPage === 2) scrollToSection('page-2');
    else if (initialPage === 3) scrollToSection('page-3');
    else if (initialPage === 4) scrollToSection('team-rail');
    else {
      const hash = window.location.hash.replace('#', '');
      if (sectionRefs[hash]) {
        scrollToSection(hash);
      }
    }
  }, [initialPage]);

  const copySponsorScript = () => {
    const text = `Today's housing market report is brought to you by DysonHomes Copilot at DysonHomes.com. Before you click 'Contact Agent' on any online home search site or aggregator, paste the address into DysonHomes.com to see unvarnished comps, hidden property risks, and claim your buyer closing cost rebate. Human and AI assisted real estate intelligence at DysonHomes.com.`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-6 select-none" style={{ background: TAN_BG }}>
      
      {/* ─────────────────────────────────────────────────────────────
          ADMIN LABORATORY INSPECTOR BAR (Admin Chrome)
          ───────────────────────────────────────────────────────────── */}
      <header className="p-4 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
              ADMIN LAB · VERTICAL SCROLL
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-wide">
                DysonHomes
              </span>
              <img
                src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/acf69797f_copilot-sweep-logo.png"
                alt="copilot"
                style={{ height: '64px', width: 'auto' }}
                className="inline-block object-contain"
              />
              <span className="text-xl font-bold text-white tracking-wide">
                Lab
              </span>
            </div>
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
            Locked vertical scroll order: Page 1 (Landing), Page 2 (Chat Empty), Page 3 (Chat + Dossier), Page 4 (Public Read-Only Team Rail).
          </p>
        </div>

        {/* View Controls & Jump Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain status pill */}
          <div className="px-3 py-1.5 rounded-xl bg-[#141414] border border-[#D4AF37]/40 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-white/80 font-mono text-[11px]">DysonHomes.com</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">READY</span>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('vertical_scroll')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vertical_scroll' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Vertical Scroll Lab
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dnn_sponsor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dnn_sponsor' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              DNN News Sponsor Hook
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin_specs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin_specs' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Architecture &amp; Economics
            </button>
          </div>

          {/* Viewport switch */}
          {activeTab === 'vertical_scroll' && (
            <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                }`}
                title="Mobile Phone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          VERTICAL SCROLL JUMP BAR (Admin Chrome)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vertical_scroll' && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              VERTICAL SCROLL LAB (LOCKED PAGES):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {LOCKED_PAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => scrollToSection(p.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">
                  {p.number}
                </span>
                <span>{p.title}</span>
                <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VERTICAL SCROLL CONTENT (FOUR LOCKED PNGS EXACTLY ONCE, FULL CONTENT WIDTH)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vertical_scroll' && (
        <div className="space-y-12 w-full flex flex-col items-center">
          {LOCKED_PAGES.map((p) => (
            <section
              key={p.id}
              id={p.id}
              ref={sectionRefs[p.id]}
              className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'w-full'} space-y-2 scroll-mt-24`}
            >
              {/* Header Label Bar */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider">
                    {p.title}
                  </span>
                  <span className="text-[11px] text-[#0a0a0a]/70 font-medium">
                    Locked Presentation
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#854d0e]">{p.url}</span>
              </div>

              {/* Exact Locked Uploaded PNG Embed Only */}
              <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a] w-full">
                <img
                  src={p.image}
                  alt={p.alt}
                  className="w-full h-auto block select-none"
                  loading="lazy"
                />
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DNN SPONSOR BROADCAST INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dnn_sponsor' && (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  LEGAL SAFE-HARBOR MEDIA HOOK
                </span>
                <h2 className="text-xl font-bold text-white">
                  DNN News Broadcast "Presented By" Sponsor Integration
                </h2>
              </div>
              <button
                type="button"
                onClick={copySponsorScript}
                className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 cursor-pointer shadow-md"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied Script' : 'Copy Broadcast Script'}</span>
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              To avoid trademark disputes with national real estate portal aggregators, our daily news broadcast and social videos use generic, protective language ("online real estate portals" and "national home search sites").
            </p>

            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#10b981] block">
                APPROVED 15-SECOND DNN SPONSOR BUMPER SCRIPT
              </span>
              <p className="text-sm text-white font-serif leading-relaxed italic bg-black/60 p-3 rounded-xl border border-white/10">
                “Today’s housing market report is brought to you by DysonHomes Copilot at <strong>DysonHomes.com</strong>. Before you click ‘Contact Agent’ on any online home search site, paste the address into <strong>DysonHomes.com</strong> to see unvarnished comps, hidden property risks, and claim your buyer closing cost rebate. Real estate intelligence without the sales pitch.”
              </p>
              <div className="flex justify-between items-center text-[10px] text-white/40 pt-1">
                <span>Presenter: Charlie Simmons or Bob Dyson</span>
                <span className="text-[#D4AF37] font-semibold">Destination: https://dysonhomes.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: SYSTEM ARCHITECTURE & ECONOMICS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'admin_specs' && (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                BUSINESS BLUEPRINT
              </span>
              <h2 className="text-xl font-bold text-white">
                DysonHomes.com 1-Man Scalable Operating Model
              </h2>
              <p className="text-xs text-white/70 mt-1">
                How all internal admin modules power this sleek front-facing consumer experience without operational overhead.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Economics Per Closed Buyer</span>
                </h3>
                <div className="space-y-1.5 text-white/70 text-[11px]">
                  <p>• <strong>Average Purchase Price:</strong> $1,500,000</p>
                  <p>• <strong>Buyer Broker Commission (2.5%):</strong> $37,500</p>
                  <p>• <strong>Dyson Referral Fee (25%):</strong> $9,375</p>
                  <p>• <strong>50% Buyer Closing Rebate:</strong> <span className="text-emerald-400 font-bold">$4,687</span> (Credited on closing HUD-1)</p>
                  <p>• <strong>Dyson Net Retained Revenue:</strong> <span className="text-[#D4AF37] font-bold">$4,688</span> (Pure profit, zero inventory)</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>GoDaddy &amp; Custom Domain Plan</span>
                </h3>
                <div className="space-y-1.5 text-white/70 text-[11px]">
                  <p>• <strong>Consumer Landing URL:</strong> DysonHomes.com (Unused GoDaddy asset)</p>
                  <p>• <strong>Enterprise/Internal Domain:</strong> DysonRelo.com (Keeps all 12 admin apps intact)</p>
                  <p>• <strong>DNS Routing:</strong> CNAME pointer to Base44 hosting cluster</p>
                  <p>• <strong>Public Persona:</strong> Charlie Simmons (Gemini Voice AI) + Bob Dyson oversight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}