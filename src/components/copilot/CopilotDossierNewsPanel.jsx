import React, { useState, useRef } from 'react';
import { 
  Scale, ShieldAlert, Shield, DollarSign, Waves, Clock, Radio, 
  Maximize2, Minimize2, Newspaper, Sparkles, Play, Pause,
  Share2, Volume2, VolumeX, ChevronRight, MessageSquare, BookOpen, FileText,
  ArrowLeft, X, RotateCcw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CopilotSolutionsVault from './CopilotSolutionsVault';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const STUDIO_POSTER_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d5e0cb3f1_Screenshot2026-09-14at81551PM.png';

// Approved canonical daily show URL
const DEFAULT_SHOW_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/75165cedb_san-diego-housing-inventory-remains-constrained-amid-sustained-price-resilience.mp4';
const DEFAULT_SHOW_HEADLINE = 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience';

export default function CopilotDossierNewsPanel({
  property,
  dossierData,
  activeView = 'dossier', // 'dossier' | 'news' | 'solutions'
  onViewChange,
  isExploded = false,
  onToggleExplode,
  onExplodeItem,
  onPromptClick,
  onOpenCaptureModal,
  isSubscriber = false,
  topOffset = 480,
  onBackToSearch,
  onClear,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  // Fetch real broadcast data if available
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['copilotFeaturedNewsBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 5),
    staleTime: 60 * 1000,
  });

  const { data: completedArticles = [] } = useQuery({
    queryKey: ['copilotFeaturedNewsArticle'],
    queryFn: () => base44.entities.DnnArticle.filter({ production_status: 'complete' }, '-updated_date', 5),
    staleTime: 60 * 1000,
  });

  const bestArticle = completedArticles.find(a =>
    a.video_url &&
    !a.video_url.startsWith('heygen:pending:') &&
    (a.video_url.includes('.mp4') || a.video_url.includes('.webm'))
  );

  const bestBroadcast = broadcasts.find(b =>
    (b.compositedVideoUrl || b.videoUrl) &&
    !String(b.compositedVideoUrl || b.videoUrl).startsWith('creatomate:pending:')
  );

  let playUrl = DEFAULT_SHOW_URL;
  let headline = DEFAULT_SHOW_HEADLINE;
  let showName = 'DNN Daily Broadcast';

  if (bestArticle) {
    playUrl = bestArticle.video_url;
    headline = bestArticle.headline || DEFAULT_SHOW_HEADLINE;
  } else if (bestBroadcast) {
    const compUrl = bestBroadcast.compositedVideoUrl;
    playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:')) ? compUrl : (bestBroadcast.videoUrl || DEFAULT_SHOW_URL);
    headline = bestBroadcast.headlines?.[0] || bestBroadcast.show_name || DEFAULT_SHOW_HEADLINE;
    showName = bestBroadcast.show_name || 'DNN Daily Broadcast';
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const [viewHistory, setViewHistory] = useState(['dossier']);

  // Track intelligence view navigation history
  React.useEffect(() => {
    if (activeView) {
      setViewHistory(prev => {
        if (prev[prev.length - 1] === activeView) return prev;
        return [...prev, activeView];
      });
    }
  }, [activeView]);

  // Back button function strictly pertains ONLY to the Intelligence side of this page
  const handleIntelligenceBack = () => {
    if (isExploded) {
      onToggleExplode?.();
      return;
    }
    if (activeView === 'solutions' || activeView === 'news') {
      onViewChange?.('dossier');
      return;
    }
    if (viewHistory.length > 1) {
      const copy = [...viewHistory];
      copy.pop();
      const prev = copy[copy.length - 1] || 'dossier';
      setViewHistory(copy);
      onViewChange?.(prev);
    } else {
      onViewChange?.('dossier');
    }
  };

  const handleClear = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (_) {}
      setIsPlaying(false);
    }
    onViewChange?.(null);
    onClear?.();
  };

  return (
    <div 
      className={`flex flex-col h-full bg-[#080808] text-white scrollbar-thin ${
        isExploded 
          ? 'fixed inset-0 z-50 p-4 sm:p-6 overflow-y-auto bg-black/95 backdrop-blur-xl' 
          : 'p-3 sm:p-4 pb-6 space-y-4 overflow-y-auto'
      }`}
    >
      {/* ── FULL SCREEN FLOATING RETURN TO DIALOGUE BAR ── */}
      {isExploded && (
        <div className="sticky top-0 z-50 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 py-2.5 bg-[#0a0a0a]/95 border-b border-[#D4AF37]/40 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleIntelligenceBack}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#1c1c1c] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Back</span>
            </button>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase hidden sm:inline">
              FULL SCREEN THEATER
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleExplode?.()}
            className="px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-stone-200 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 border border-white/20"
            title="Return from full screen to page size"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Dialogue</span>
          </button>
        </div>
      )}

      {/* ── HEADER: aligns video top edge with the Bob/Charlie/You roster row on the left ── */}
      <div className="h-[62px] sm:h-[70px] shrink-0 flex items-center justify-center relative px-1">
        <span className="text-white text-[28px] sm:text-[32px] font-normal tracking-wide whitespace-nowrap">
          Intelligence
        </span>

        {isExploded && (
          <button
            type="button"
            onClick={() => onToggleExplode?.()}
            className="absolute right-1 px-3 py-1 rounded-lg bg-white text-black hover:bg-stone-200 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            title="Return from full screen to page size"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Return</span>
          </button>
        )}
      </div>

      {/* ── NEWS BROADCAST PLACEHOLDER ABOVE ALL TEXT (SEARCH / AUDIT / CONTROLS) ── */}
      <div
        className="relative w-[39%] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/50 group shrink-0"
        style={{
          aspectRatio: '16/9',
          background: '#000',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        }}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          key={playUrl}
          src={playUrl}
          poster={STUDIO_POSTER_URL}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          style={{ display: 'block', background: '#000' }}
        />
      </div>

      {/* ── TOP CONTROLS & VIEW SWITCHER: Back button on far left, controls grouped on the right ── */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 mt-4">
        <button
          type="button"
          onClick={handleIntelligenceBack}
          className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1 shadow-sm active:bg-white active:text-black"
          title="Back"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Back</span>
        </button>

        {/* Unified Button Group: Search, Audit, Solutions, Daily News & Full Screen */}
        <div className="flex items-center bg-[#141414] p-0.5 rounded-md border border-white/10 gap-0.5">
          <button
            type="button"
            onClick={() => {
              if (onBackToSearch) {
                onBackToSearch();
              } else {
                handleIntelligenceBack();
              }
            }}
            className="px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 text-stone-400 hover:text-white hover:bg-white/10 active:bg-white active:text-black"
          >
            <span>← Search</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange?.('dossier')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'dossier'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Saved Audits</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange?.('solutions')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'solutions'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Saved Solutions</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange?.('news')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'news'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Daily News</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleExplode?.()}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ml-0.5 ${
              isExploded
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
            title={isExploded ? "Return from full screen to page size" : "Expand chat + dossier canvas to full viewport"}
          >
            {isExploded ? (
              <>
                <X className="w-3 h-3 text-black stroke-[2.5]" />
                <span>Return to Dialogue</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Full screen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 text-stone-400 hover:text-white hover:bg-white/10 active:bg-white active:text-black ml-0.5"
            title="Clear content from the screen"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW: REAL ESTATE SOLUTIONS & INTELLIGENCE VAULT
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'solutions' && (
        <CopilotSolutionsVault 
          onPromptClick={onPromptClick} 
          onExplodePlaybook={(item) => onExplodeItem?.(item)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW A: FIDUCIARY PROPERTY AUDIT & INTELLIGENCE
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'dossier' && (
        <div className="space-y-4">
          {/* Charlie's Opening Statement Banner */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-r from-[#141414] via-[#111111] to-[#121212] p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                  FIDUCIARY AUDIT COMPLETE
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                I've audited {dossierData.shortAddress}. Can we help?
              </h2>
              <p className="text-xs text-stone-300">
                {dossierData.marketSummary} Ask questions on the left or tap below to text the full report to your mobile.
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onOpenCaptureModal) {
                    onOpenCaptureModal();
                  } else {
                    onPromptClick?.("Text full report to my mobile");
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#ede0cc] hover:bg-[#e5d6c0] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-[#ede0cc]"
              >
                <span>Text Me Report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Property Audit Header Label */}
          <div className="pb-1 flex items-center justify-between">
            <span className="text-[10.5px] font-bold tracking-widest text-white uppercase font-mono">
              PROPERTY AUDIT • {dossierData.shortAddress.toUpperCase()} {dossierData.city ? `(${dossierData.city.toUpperCase()})` : ''}
            </span>
          </div>

          {/* Card 1: Honest Comps */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-white" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                HONEST COMPS
              </h3>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Sold 30–90 days | Within 0.75 mi | Adjusted to current market
            </p>

            <div className="space-y-1.5 pt-1 text-[11.5px] font-mono">
              {dossierData.comps.map((comp, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/10 gap-2">
                  <span className="font-bold text-white w-32 sm:w-36 truncate">{comp.address}</span>
                  <span className="text-stone-400">{comp.distance}</span>
                  <span className="text-stone-400">{comp.specs}</span>
                  <span className="text-stone-300">{comp.soldPrice}</span>
                  <span className="text-white font-bold">{comp.adjPrice}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold text-white pt-1">
              {dossierData.compsSummary}
            </p>
          </div>

          {/* Card 2: Hidden Risks */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-white" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                HIDDEN RISKS
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {dossierData.risks.map((risk, idx) => {
                const IconComp = idx === 0 ? Scale : idx === 1 ? Waves : Clock;
                return (
                  <div key={risk.id || idx} className="flex items-start gap-2.5">
                    <IconComp className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{risk.title}</h4>
                      <p className="text-stone-400 text-[11px]">{risk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-semibold text-white pt-1">
              {dossierData.risksSummary}
            </p>
          </div>

          {/* Card 3: Transaction Compliance & Discovery */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                COMPLIANCE &amp; DISCOVERY
              </h3>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Case-by-case legal &amp; lender review | {dossierData.complianceBasis || 'Specific property issue audit'}
            </p>

            <div className="bg-[#181818] border border-white/10 rounded-lg p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-white">
                Transaction Review
              </span>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold font-mono text-white">
                  {dossierData.complianceProtocol || 'Individual Discovery'}
                </div>
                <div className="text-[10px] text-stone-400 font-mono">
                  {dossierData.complianceStatus || 'State, Fed & Lender Regs'}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 pt-0.5 leading-relaxed">
              All transaction terms, concessions, or credits require individual discovery checked against state, federal, and lender regulations.
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW B: DAILY NEWS & STORY INTELLIGENCE
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'news' && (
        <div className={`space-y-4 ${isExploded ? 'max-w-5xl mx-auto w-full' : ''}`}>
          {/* Broadcast Story Headline & Real-Time Engagement */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div>
                <span className="text-[9.5px] font-mono tracking-widest text-white uppercase font-bold flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-white" />
                  MORNING BROADCAST · REAL-TIME FIDUCIARY DELIVERY
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                  {headline}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 shrink-0">
                1080p MP4 Broadcast
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xs text-stone-300 leading-relaxed">
              DNN Intelligence tracks migration flows, interest rate movements, and inventory squeezes across California and destination luxury markets. Watch Charlie Simmons and Bob Dyson break down today's story.
            </p>

            {/* Real-Time Interactive Inquiry Buttons (Connects to Dialogue Engine) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                INTERACT WITH THIS STORY (REAL-TIME RESPONSE):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPromptClick?.("Bob, how does today's inventory news affect our offer strategy?")}
                  className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  <span>Ask Bob: Impact on Offer Strategy</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPromptClick?.("Charlie, summarize this broadcast in bullet points")}
                  className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Charlie: Bullet Summary</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPromptClick?.("How do contract protections and lender regulations apply during an inventory freeze?")}
                  className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>Contract Shield in Freeze?</span>
                </button>
              </div>
            </div>
          </div>

          {/* Additional News Briefs Feed */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white font-mono">
                TODAY'S ADDITIONAL BRIEFS
              </span>
              <span className="text-[9px] text-stone-500 font-mono">DNN AI BUREAU</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div 
                onClick={() => onPromptClick?.("Tell me more about coastal zoning restrictions")}
                className="p-3 rounded-xl bg-[#121212] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[8.5px] text-stone-400 mb-1">
                  <span className="text-emerald-400 font-mono font-bold">ZONING &amp; SOIL</span>
                  <span>SAN DIEGO</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-white leading-snug">
                  California Coastal Commission Bluff Setback Protocols Tightened
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                  New soil stability mandates require un-waivable geotechnical audits before title transfer in coastal zones.
                </p>
              </div>

              <div 
                onClick={() => onPromptClick?.("What are the latest mortgage interest rate adjustments?")}
                className="p-3 rounded-xl bg-[#121212] border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[8.5px] text-stone-400 mb-1">
                  <span className="text-white font-mono font-bold">RATES &amp; ESCROW</span>
                  <span>NATIONAL</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-white leading-snug">
                  Conforming Jumbo Rate Spread Stabilizes at 6.45%
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                  How high-net-worth buyers are structuring fiduciary contingency shields and lender compliance discovery.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}