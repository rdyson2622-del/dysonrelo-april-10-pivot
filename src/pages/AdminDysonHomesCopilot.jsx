import React, { useState } from 'react';
import { 
  Search, Mic, ShieldCheck, Sparkles, DollarSign, AlertTriangle, 
  TrendingUp, CheckCircle2, Phone, MessageSquare, ArrowRight, 
  Smartphone, Monitor, Copy, Check, ExternalLink, Play, Radio,
  Lock, Share2, Compass, Home, Info, ChevronRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CopilotPropertyDossier from '@/components/copilot/CopilotPropertyDossier';
import SlideOneTanOverview from '@/components/admin/copilot/SlideOneTanOverview';
import SlideTwoTanThreeCards from '@/components/admin/copilot/SlideTwoTanThreeCards';
import SlideThreeObsidianExecutive from '@/components/admin/copilot/SlideThreeObsidianExecutive';
import SlideFourPrivateWealth from '@/components/admin/copilot/SlideFourPrivateWealth';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// Sample properties for instant 1-click preview
const SAMPLE_PROPERTIES = [
  {
    address: '742 Vista Del Mar, La Jolla, CA 92037',
    price: 3450000,
    beds: 4,
    baths: 4.5,
    sqft: 3820,
    dom: 64,
    compsPrice: 3200000,
    rebate: 21562,
    risks: [
      '64 days on market — seller price reduction of $150k pending',
      'Coastal Commission permitting boundary: strict exterior remodel restrictions',
      'Recent neighborhood comp sold 7.2% below asking price'
    ],
    pros: [
      'Unobstructed ocean sunset view easements protected by deed',
      'High walkability score to Bird Rock village'
    ],
    listingOffice: 'Independent Coastal Brokerage',
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required (no short-term Airbnb)',
      'Dual A/C units are 14 years old — approaching replacement lifecycle'
    ],
    pros: [
      'Camelback Mountain view corridor',
      'Zero state income tax migration corridor'
    ],
    listingOffice: 'Southwest Luxury Realty',
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County tax reassessment will trigger ~18% property tax escalation next cycle',
      'Flash flood zone buffer near greenbelt easement'
    ],
    pros: [
      'Top-rated Eanes ISD school district feeder pattern',
      'Complete 2024 interior kitchen & plumbing remodel'
    ],
    listingOffice: 'Westlake Premier Estates',
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
];

export default function AdminDysonHomesCopilot() {
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [addressInput, setAddressInput] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(SAMPLE_PROPERTIES[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState('consumer_mockup'); // consumer_mockup | dnn_sponsor | admin_specs
  const [selectedCandidate, setSelectedCandidate] = useState('slide_4'); // slide_1 | slide_2 | slide_3 | slide_4

  const handleSelectSample = (property) => {
    setIsAuditing(true);
    setAddressInput(property.address);
    setSmsSent(false);
    setTimeout(() => {
      setSelectedProperty(property);
      setIsAuditing(false);
    }, 450);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsAuditing(true);
    setSmsSent(false);

    // Dynamic mock valuation generator based on input
    setTimeout(() => {
      setSelectedProperty({
        address: addressInput,
        price: 1950000,
        beds: 4,
        baths: 3.5,
        sqft: 3100,
        dom: 38,
        compsPrice: 1890000,
        rebate: 12187,
        risks: [
          'Average sales in this micro-pocket closed 3.5% below initial list price',
          'Check title for easement or municipal zoning updates prior to offer',
          'Property tax basis will recalculate to purchase price upon closing'
        ],
        pros: [
          'High buyer demand area with solid appreciation history',
          'Strong neighborhood school ratings and infrastructure'
        ],
        listingOffice: 'Syndicated Regional Listing',
        lastSoldPrice: 1320000,
        lastSoldYear: 2020
      });
      setIsAuditing(false);
    }, 600);
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!smsPhone) return;
    setSmsSent(true);
  };

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
              ADMIN LAB · CONSUMER ZERO-UI PIVOT
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              DysonHomes Copilot Lab (DysonHomes.com)
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
            Eliminates all portal login walls and friction. The consumer pastes any listing address or link, gets instant comp reality, risk analysis, and exact rebate dollars, backed by Charlie AI and Bob Dyson's licensed brokerage.
          </p>
        </div>

        {/* View Controls & GoDaddy Indicator */}
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
              onClick={() => setActiveTab('consumer_mockup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'consumer_mockup' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Consumer Experience
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
          {activeTab === 'consumer_mockup' && (
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
          TAB 1: LIVE CONSUMER COPILOT MOCKUP (TEST CANDIDATE DESIGNS)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'consumer_mockup' && (
        <div className="space-y-6">
          
          {/* Top Candidate Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-md">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37] text-black">
                ACTIVE LAB PREVIEW
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                Select Design To Simulate in Browser:
              </span>
            </div>

            {/* 4 Exact Slides Switcher */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'slide_4', label: 'Slide 4: Private Wealth (Chosen Candidate)' },
                { id: 'slide_2', label: 'Slide 2: Candidate A (Tan Desktop + 3 Cards)' },
                { id: 'slide_1', label: 'Slide 1: Tan Overview' },
                { id: 'slide_3', label: 'Slide 3: Obsidian Executive Dark' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setSelectedCandidate(btn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                    selectedCandidate === btn.id
                      ? 'bg-[#D4AF37] text-black font-bold ring-1 ring-[#D4AF37]'
                      : 'bg-[#181818] text-white/80 hover:text-white border border-white/10'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#0a0a0a]/80 px-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0a0a0a] text-[#D4AF37] font-bold uppercase text-[10px] tracking-wider border border-[#D4AF37]/40">
                ACTIVE: {
                  selectedCandidate === 'slide_2' ? 'Slide 2 (Candidate A · Tan Desktop with 3 Cards & Pool Villa)' :
                  selectedCandidate === 'slide_1' ? 'Slide 1 (Tan Overview with Sunset Villa)' :
                  selectedCandidate === 'slide_3' ? 'Slide 3 (Obsidian Executive Dark)' :
                  'Slide 4 (Private Wealth Deep Black & Gold)'
                }
              </span>
              <span>
                Live preview for <strong>https://dysonhomes.com</strong>
              </span>
            </div>
            <span className="text-[#854d0e] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Zero UI • Buyer Intelligence &amp; Closing Rebate
            </span>
          </div>

          {/* Frame Container */}
          <div className="flex justify-center w-full">
            <div 
              className={`transition-all duration-300 w-full rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden ${
                viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-6xl'
              }`}
              style={{ background: '#0a0a0a' }}
            >
              {/* Browser URL Bar */}
              <div className="px-4 py-2.5 bg-[#141414] border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="px-6 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  <span>https://dysonhomes.com</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                  {selectedCandidate === 'slide_2' ? 'Candidate A (D&D Logo & Tan Desktop)' :
                   selectedCandidate === 'slide_1' ? 'Slide 1 (Tan Overview)' :
                   selectedCandidate === 'slide_3' ? 'Slide 3 (Obsidian Executive)' :
                   'Slide 4 (Private Wealth)'}
                </span>
              </div>

              {/* ── RENDER EXACT SELECTED SLIDE (FULL-BLEED PAGE BACKGROUND) ── */}
              <div className="w-full">
                {selectedCandidate === 'slide_2' && (
                  <SlideTwoTanThreeCards
                    onRunAudit={(addr) => {
                      setAddressInput(addr);
                      handleCustomSearch({ preventDefault: () => {} });
                    }}
                  />
                )}

                {selectedCandidate === 'slide_1' && (
                  <SlideOneTanOverview
                    onRunAudit={(addr) => {
                      setAddressInput(addr);
                      handleCustomSearch({ preventDefault: () => {} });
                    }}
                  />
                )}

                {selectedCandidate === 'slide_3' && (
                  <SlideThreeObsidianExecutive
                    onRunAudit={(addr) => {
                      setAddressInput(addr);
                      handleCustomSearch({ preventDefault: () => {} });
                    }}
                  />
                )}

                {selectedCandidate === 'slide_4' && (
                  <SlideFourPrivateWealth
                    onRunAudit={(addr) => {
                      setAddressInput(addr);
                      handleCustomSearch({ preventDefault: () => {} });
                    }}
                  />
                )}

                {/* Audit Dossier in smooth scroll — continuous seamless page background */}
                <div 
                  id="copilot-audit-dossier" 
                  className="w-full px-4 sm:px-8 pt-8 pb-14 scroll-mt-6 border-t border-[#d8cab6]/60"
                  style={{ 
                    background: (selectedCandidate === 'slide_1' || selectedCandidate === 'slide_2' || selectedCandidate === 'slide_4') ? '#ede0cc' : '#050505' 
                  }}
                >
                  <div className="max-w-3xl mx-auto space-y-3">
                    <div className="text-center pb-2">
                      <span className="text-[11px] font-bold tracking-widest uppercase text-[#854d0e]">
                        POST-SEARCH AUDIT DOSSIER
                      </span>
                    </div>
                    <CopilotPropertyDossier property={selectedProperty} />
                  </div>
                </div>
              </div>

              {/* DNN Pulse Ticker */}
              <div className="px-4 py-3 bg-[#050505] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                    DNN HOUSING PULSE:
                  </span>
                  <span className="text-white/80 text-[11px] truncate max-w-md">
                    Mortgage rates ease to 6.35% as buyers turn to private fee-rebating brokerages over aggregator portals.
                  </span>
                </div>

                <Link
                  to="/dnn-news"
                  className="text-[10px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>Watch Today's 6AM Brief</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>

          {/* Bottom 4 Slides Selector */}
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/40 text-left flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                THE 4 EXACT SPECIFIED SLIDES
              </span>
              <p className="text-xs text-white/70 mt-0.5">
                Switch directly between all four specific layouts and color palettes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'slide_4', label: '1. Slide 4 (Private Wealth — Active Choice)' },
                { id: 'slide_2', label: '2. Candidate A (Tan Desktop + 3 Cards)' },
                { id: 'slide_1', label: '3. Tan Overview' },
                { id: 'slide_3', label: '4. Obsidian Executive Dark' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCandidate(c.id);
                    window.scrollTo({ top: 140, behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCandidate === c.id
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'bg-white/10 text-white/80 hover:text-white border border-white/10'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

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

            {/* Approved Script Card */}
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

            {/* Organic Funnel Flywheel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-red-400 uppercase">1. Top of Funnel (Media)</div>
                <div className="font-bold text-white text-xs">DNN Real Estate News</div>
                <p className="text-white/60 text-[11px]">
                  Daily market reports, Fed rates, housing updates on LinkedIn, social video &amp; email. Zero ad spend.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase">2. The Conversion Hook</div>
                <div className="font-bold text-white text-xs">DysonHomes.com Copilot</div>
                <p className="text-white/60 text-[11px]">
                  Viewer visits DysonHomes.com, pastes a home they are touring, sees 50% rebate + unvarnished comps.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">3. The Revenue Engine</div>
                <div className="font-bold text-white text-xs">25% Referral Settlement</div>
                <p className="text-white/60 text-[11px]">
                  Dyson pairs buyer with top vetted PRN agent. Dyson collects 25%, credits 50% back to buyer, retains 50%.
                </p>
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
                How all 12 internal admin modules power this sleek front-facing consumer experience without operational overhead.
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

            {/* Connected Admin Modules List */}
            <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                INTEGRATED ADMIN CONSOLE MODULES CONNECTED TO DYSONHOMES COPILOT
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-white/80">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Relocation Call Desk
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ PRN Agent Bureau
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Preferred Vendors
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Charlie Voice AI
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Escrow Audit &amp; HUD-1
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ SMS Dispatch (Twilio)
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ DNN News Engine
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Master Agreement Desk
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}