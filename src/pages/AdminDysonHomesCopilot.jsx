import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ShieldCheck, DollarSign, Copy, Check, Lock,
  ArrowDown, Monitor, Smartphone
} from 'lucide-react';
import SlideFourPrivateWealth from '@/components/admin/copilot/SlideFourPrivateWealth';
import GrokPageTwoChatCanvas from '@/components/admin/copilot/GrokPageTwoChatCanvas';
import GrokPageThreeSplitCanvas from '@/components/admin/copilot/GrokPageThreeSplitCanvas';
import CopilotPublicReadOnlyTeamRail from '@/components/admin/copilot/CopilotPublicReadOnlyTeamRail';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';
import CoastalAddressKeywordExporter from '@/components/admin/copilot/CoastalAddressKeywordExporter';
import DysonHomesDomainDnsCard from '@/components/admin/copilot/DysonHomesDomainDnsCard';
import HighestAndBestUseAnalysisCard from '@/components/admin/copilot/HighestAndBestUseAnalysisCard';

const TAN_BG = '#ede0cc';

export default function AdminDysonHomesCopilot() {
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [activeTab, setActiveTab] = useState('vertical_scroll'); // vertical_scroll | dnn_sponsor | admin_specs | retargeting
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRetargeting, setCopiedRetargeting] = useState(false);

  const location = useLocation();
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [analyzedProperty, setAnalyzedProperty] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');

    if (hash === '#page-1' || hash === '#landing' || pageParam === '1') {
      scrollToSection(page1Ref);
    } else if (
      hash === '#page-2' || 
      hash === '#dossier' || 
      hash === '#team' || 
      hash === '#chat' || 
      pageParam === '2' || 
      pageParam === '3' || 
      pageParam === '4'
    ) {
      scrollToSection(page2Ref);
    }
  }, [location.hash, location.search]);

  const copySponsorScript = () => {
    const text = `Today's housing market report is brought to you by DysonHomes Copilot at DysonHomes.com. Before you click 'Contact Agent' on any online home search site or aggregator, paste the address into DysonHomes.com to see unvarnished comps, hidden property risks, and verify lender compliance shields. Independent human and AI-assisted fiduciary intelligence under California DRE #00609384 at DysonHomes.com.`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyRetargetingPlan = () => {
    const text = `# RETARGETING PLAYBOOK: DYSONHOMES COPILOT & REAL ESTATE PORTALS

## 1. Direct Portal Advertising Mechanics
- Direct Listing Infiltration: Prohibited by portals to protect listing agent relationships.
- Display & In-App Banner Placement: Permitted. Appears directly adjacent or beneath listing details while buyer researches property.
- Channels: Programmatic Private Marketplace (PMP / DSP) via Google Ad Manager/The Trade Desk, and Portal Direct Sponsorship (Realtor.com / CoStar).

## 2. Targeting Parameters: San Diego Coastal Luxury ($1,500,000+)
- Zip Codes: 92037 (La Jolla), 92014 (Del Mar), 92075 (Solana Beach), 92109 (Pacific Beach), 92106 (Point Loma), 92024 (Encinitas).
- Net Worth Overlay: Household Income $350k+ / Net Worth $1.5M+.
- Hook: "Viewing Coastal San Diego? Get the Unvarnished 2nd-Opinion Fiduciary Audit for this Property before you write an offer."
- Destination: DysonHomes.com/dossier

## 3. Retargeting Lifespans & Frequency Capping
- 7–14 Days (Fast-Burn): RECOMMENDED. Luxury buyers evaluate specific homes intensively for 1-2 weeks.
- Frequency Cap: Mandatory limit of 3 to 4 impressions per person per day to avoid budget burn.

## 4. Lean $500/Month Test Budget Blueprint ($16.60/Day)
- Channel A ($250/mo): Hyper-Narrow Micro-Geofence (92037 La Jolla & 92014 Del Mar only). Delivers ~10,000 to 14,000 impressions.
- Channel B ($250/mo): Exact Google Address-Search Due Diligence Match. Captures buyers searching "7414 Fay Ave tax / permits / hazard". Delivers 70 to 100 direct high-intent visits at ~$2.50 to $3.50 CPC.`;
    navigator.clipboard.writeText(text);
    setCopiedRetargeting(true);
    setTimeout(() => setCopiedRetargeting(false), 2000);
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
            Consolidated 2-page flow: Page 1 Landing &amp; Search, Page 2 Fiduciary Command Center (Minions Rail + 3-Way Dialogue + Property Audit).
          </p>
        </div>

        {/* View Controls & Jump Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain status pill */}
          <button
            type="button"
            onClick={() => setActiveTab('domain_dns')}
            className="px-3 py-1.5 rounded-xl bg-[#141414] border border-amber-500/50 hover:border-amber-400 flex items-center gap-2 text-xs transition-all cursor-pointer"
            title="Click to view DysonHomes.com DNS instructions"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white/80 font-mono text-[11px]">DysonHomes.com</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">DNS PENDING</span>
          </button>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10 flex-wrap">
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
              onClick={() => setActiveTab('retargeting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'retargeting' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Google Ads &amp; Retargeting
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('domain_dns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'domain_dns' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Domain DNS Setup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dnn_sponsor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dnn_sponsor' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              DNN Sponsor Hook
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
              VERTICAL SCROLL LAB (2-PAGE CONSOLIDATED FLOW):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSection(page1Ref)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Page 1: Landing &amp; Search</span>
              <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(page2Ref)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Page 2: Fiduciary Command Center</span>
              <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VERTICAL SCROLL CONTENT (2 PAGES)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vertical_scroll' && (
        <div className="space-y-10 w-full flex flex-col items-center">
          
          {/* ══════════════════════════════════════════════════════════
              PAGE 1 — LANDING & SEARCH
              ══════════════════════════════════════════════════════════ */}
          <section id="page-1" ref={page1Ref} className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-7xl'} space-y-2 scroll-mt-20`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  PAGE 1 — LANDING &amp; SEARCH
                </span>
                <span className="text-xs text-[#0a0a0a]/70 font-medium">
                  Search &amp; Preset Lookups • DD Vertical Badge • Sweep Logo
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
                  scrollToSection(page2Ref);
                }}
                onGoToChatCanvas={() => {
                  scrollToSection(page2Ref);
                }}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              PAGE 2 — COMMAND CENTER & DOSSIER (Mini-Apps Rail + 3-Way Dialogue + Fiduciary Dossier)
              ══════════════════════════════════════════════════════════ */}
          <section id="page-2" ref={page2Ref} className={`w-full ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-7xl'} space-y-2 scroll-mt-20`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  PAGE 2 — FIDUCIARY COMMAND CENTER
                </span>
                <span className="text-xs text-[#0a0a0a]/70 font-medium">
                  AI Minions Rail • 3-Way Live Audio Dialogue • Fiduciary Dossier
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
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">PAGE 2</span>
              </div>

              <GrokPageThreeSplitCanvas
                property={analyzedProperty}
                showRail={true}
                onBackToSearch={() => {
                  scrollToSection(page1Ref);
                }}
              />
            </div>
          </section>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB: RETARGETING PLAYBOOK & GOOGLE ADDRESS KEYWORD GENERATOR
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'retargeting' && (
        <div className="max-w-4xl mx-auto space-y-6 text-left">
          {/* Highest & Best Use Analysis Card */}
          <HighestAndBestUseAnalysisCard />

          {/* Automated Coastal Keyword Exporter Component */}
          <CoastalAddressKeywordExporter />

          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  DIGITAL ACQUISITION STRATEGY · GROK BOT READY
                </span>
                <h2 className="text-xl font-bold text-white">
                  Portal Retargeting Playbook (Zillow, Realtor.com, Homes.com)
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  Saved to Admin Library under title <strong className="text-[#D4AF37]">RETARGETING</strong> (ClaudeNode ID synced).
                </p>
              </div>
              <button
                type="button"
                onClick={copyRetargetingPlan}
                className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 cursor-pointer shadow-md transition-all"
              >
                {copiedRetargeting ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRetargeting ? 'Copied for Grok Bot' : 'Copy for Grok Bot'}</span>
              </button>
            </div>

            {/* Core Truth: Direct Banner vs Infiltration */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 space-y-2">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Can You Drop a Flag Directly on Zillow, Homes.com, and Realtor.com?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                <strong>Yes, via adjacent display banners and in-app placements:</strong> You cannot alter the listing description or MLS photos directly (portals protect their listing brokers), but you <em>can</em> programmatically buy the surrounding display banners, rail ads, and mobile units that load while the buyer browses that exact listing.
              </p>
            </div>

            {/* $500/Month Test Blueprint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span>Channel 1: Micro-Geofence Display</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    $100 / MO (RETARGETING ONLY)
                  </span>
                </div>
                <p className="text-stone-300 text-[11.5px] leading-relaxed">
                  Bids exclusively on portal banner inventory inside <strong>92037 (La Jolla)</strong> and <strong>92014 (Del Mar)</strong> to retarget users who have previously visited your site.
                </p>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1 text-[10.5px] text-stone-400">
                  <p>• <strong>Expected Delivery:</strong> ~4,000 to 6,000 retargeted impressions/mo</p>
                  <p>• <strong>CPM:</strong> $18.00 – $25.00</p>
                  <p>• <strong>Ad Copy Hook:</strong> <em>"Viewing Coastal San Diego? Get the Unvarnished 2nd-Opinion Fiduciary Audit before you write an offer."</em></p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span>Channel 2: Google Address Due Diligence Intent</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-bold">
                    $400 / MO (PRIMARY ACQUISITION)
                  </span>
                </div>
                <p className="text-stone-300 text-[11.5px] leading-relaxed">
                  Catches the buyer when they copy the address from Zillow into Google to search <em>"property tax"</em>, <em>"permits"</em>, or <em>"bluff hazard"</em>.
                </p>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1 text-[10.5px] text-stone-400">
                  <p>• <strong>Expected Delivery:</strong> 120 to 160 direct qualified clicks/mo</p>
                  <p>• <strong>CPC:</strong> ~$0.95 to $1.25 per click (long-tail exact match)</p>
                  <p>• <strong>Ad Copy Hook:</strong> <em>"[Address] Fiduciary Audit — Check the 25-ft Setback &amp; Soil Stability Report before offering."</em></p>
                </div>
              </div>
            </div>

            {/* Retargeting Duration & Frequency Capping Rules */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>⏱ Retargeting Lifespan &amp; Frequency Rules</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[#D4AF37] font-bold block mb-0.5">7 – 14 Days (Fast-Burn)</span>
                  <span className="text-stone-300">Recommended. Reaches the buyer immediately while that specific property is top of mind.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white font-bold block mb-0.5">30 Days (Standard)</span>
                  <span className="text-stone-400">Follows them across Forbes, WSJ, and social media for general coastal brand retention.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[#10b981] font-bold block mb-0.5">Frequency Cap: 3-4/Day</span>
                  <span className="text-stone-300">Mandatory setting to prevent ad fatigue and avoid wasting daily budget on repetitive views.</span>
                </div>
              </div>
            </div>

            {/* Safe Harbor Legal Compliance */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-[10px] text-stone-400">
              <span>California DRE #00609384 Fiduciary Standard</span>
              <span className="text-[#D4AF37] font-semibold">100% Conflict-Free Second Opinion</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB: DYSONHOMES.COM DOMAIN & DNS SETUP
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'domain_dns' && (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <DysonHomesDomainDnsCard />
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
                  <p>• <strong>Dyson Referral Management Fee (25%):</strong> $9,375</p>
                  <p>• <strong>Lender &amp; Fiduciary Compliance Audit:</strong> <span className="text-emerald-400 font-bold">Included</span> (Pre-offer due diligence)</p>
                  <p>• <strong>Dyson Net Retained Fee Revenue:</strong> <span className="text-[#D4AF37] font-bold">$9,375</span> (Pure profit, zero inventory)</p>
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