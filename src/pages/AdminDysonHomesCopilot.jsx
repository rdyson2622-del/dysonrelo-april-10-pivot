import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, DollarSign, Copy, Check, Lock,
  ArrowDown, Monitor, Smartphone
} from 'lucide-react';
import SlideFourPrivateWealth from '@/components/admin/copilot/SlideFourPrivateWealth';
import GrokPageTwoChatCanvas from '@/components/admin/copilot/GrokPageTwoChatCanvas';
import GrokPageThreeSplitCanvas from '@/components/admin/copilot/GrokPageThreeSplitCanvas';
import CopilotPublicReadOnlyTeamRail from '@/components/admin/copilot/CopilotPublicReadOnlyTeamRail';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

const TAN_BG = '#ede0cc';

export default function AdminDysonHomesCopilot() {
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [activeTab, setActiveTab] = useState('vertical_scroll'); // vertical_scroll | dnn_sponsor | admin_specs
  const [copiedScript, setCopiedScript] = useState(false);

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const [analyzedProperty, setAnalyzedProperty] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#page-1' || hash === '#landing') scrollToSection(page1Ref);
    else if (hash === '#page-2' || hash === '#team' || hash === '#team-rail' || hash === '#chat') scrollToSection(page2Ref);
    else if (hash === '#page-3' || hash === '#dossier') scrollToSection(page3Ref);
  }, []);

  const copySponsorScript = () => {
    const text = `Today's housing market report is brought to you by DysonHomes Copilot at DysonHomes.com. Before you click 'Contact Agent' on any online home search site or aggregator, paste the address into DysonHomes.com to see unvarnished comps, hidden property risks, and claim your buyer closing cost rebate. Human and AI assisted real estate intelligence at DysonHomes.com.`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-6 select-none" style={{ background: TAN_BG }}>
      
      {/* ─────────────────────────────────────────────────────────────
          ADMIN LABORATORY INSPECTOR BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="p-4 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
              ADMIN LAB · VERTICAL SCROLL
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-white tracking-wide">
                DysonHomes
              </span>
              <CopilotSweepLogo size="sm" />
              <span className="text-sm font-bold text-white tracking-wide">
                Lab
              </span>
            </div>
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
            Locked 3-page vertical scroll: Page 1 Landing, Page 2 Team Rail &amp; Chat, Page 3 Chat + Dossier.
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
          VERTICAL SCROLL JUMP BAR
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vertical_scroll' && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              VERTICAL SCROLL LAB (IN ORDER):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSection(page1Ref)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Page 1: Landing</span>
              <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(page2Ref)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Page 2: Team Rail</span>
              <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(page3Ref)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Page 3: Chat + Dossier</span>
              <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VERTICAL SCROLL CONTENT (PAGES 1 -> 2 -> 3 -> 4)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vertical_scroll' && (
        <div className="space-y-10 w-full flex flex-col items-center">
          
          {/* ══════════════════════════════════════════════════════════
              PAGE 1 — LANDING (Slide 4 Private Wealth)
              ══════════════════════════════════════════════════════════ */}
          <section id="page-1" ref={page1Ref} className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-7xl'} space-y-2 scroll-mt-20`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  PAGE 1 — LANDING
                </span>
                <span className="text-xs text-[#0a0a0a]/70 font-medium">
                  Dark Charcoal + Champagne Gold • DD Vertical Badge • Sweep Logo
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#854d0e]">https://dysonhomes.com</span>
            </div>

            <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
              {/* Browser bar */}
              <div className="px-4 py-2 bg-[#141414] border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="px-6 py-0.5 rounded-full bg-black/60 border border-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  <span>https://dysonhomes.com</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">PAGE 1</span>
              </div>

              <SlideFourPrivateWealth
                onRunAudit={(addr) => {
                  if (addr) setAnalyzedProperty(addr);
                }}
                onOpenDossier={(addr) => {
                  if (addr) setAnalyzedProperty(addr);
                  scrollToSection(page3Ref);
                }}
                onGoToChatCanvas={() => {
                  scrollToSection(page2Ref);
                }}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              PAGE 2 — TEAM RAIL (Public See-Only Fiduciary Roster + Chat)
              ══════════════════════════════════════════════════════════ */}
          <section id="page-2" ref={page2Ref} className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-7xl'} space-y-2 scroll-mt-20`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  PAGE 2 — TEAM RAIL &amp; CHAT
                </span>
                <span className="text-xs text-[#0a0a0a]/70 font-medium">
                  Public See-Only Fiduciary Team Rail + Live Chat
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#854d0e]">https://dysonhomes.com/team</span>
            </div>

            <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
              {/* Browser bar */}
              <div className="px-4 py-2 bg-[#141414] border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="px-6 py-0.5 rounded-full bg-black/60 border border-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  <span>https://dysonhomes.com/team</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">PAGE 2</span>
              </div>

              <CopilotPublicReadOnlyTeamRail
                onAskAddress={(addr) => {
                  if (addr) setAnalyzedProperty(addr);
                  scrollToSection(page3Ref);
                }}
                onBackToLanding={() => {
                  scrollToSection(page1Ref);
                }}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              PAGE 3 — CHAT + DOSSIER (after address)
              ══════════════════════════════════════════════════════════ */}
          <section id="page-3" ref={page3Ref} className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-7xl'} space-y-2 scroll-mt-20`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  PAGE 3 — CHAT + DOSSIER
                </span>
                <span className="text-xs text-[#0a0a0a]/70 font-medium">
                  Sticky Charlie Chat • Dossier with THREE TAN FILL Boxes
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#854d0e]">https://dysonhomes.com/dossier</span>
            </div>

            <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
              {/* Browser bar */}
              <div className="px-4 py-2 bg-[#141414] border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="px-6 py-0.5 rounded-full bg-black/60 border border-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  <span>https://dysonhomes.com/dossier</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">PAGE 3</span>
              </div>

              <GrokPageThreeSplitCanvas
                property={analyzedProperty}
                onBackToSearch={() => {
                  scrollToSection(page1Ref);
                }}
              />
            </div>
          </section>

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
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
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