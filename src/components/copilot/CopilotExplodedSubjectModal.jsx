import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Maximize2, Minimize2, Radio, Scale, BookOpen, ShieldAlert, 
  DollarSign, Waves, Clock, CheckCircle2, ArrowRight, Play, Pause, 
  Volume2, VolumeX, MessageSquare, Sparkles, Video, Headphones, 
  FileText, ArrowLeft, Shield, Share2, HelpCircle
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import { SOLUTIONS_LIBRARY } from './CopilotSolutionsVault';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const STUDIO_POSTER_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/cd821f5a9_Screenshot2026-09-09at110438AM.png';

/**
 * CopilotExplodedSubjectModal
 * 
 * Immersive full-screen takeover view for Page 2 when a video, news broadcast,
 * story brief, solution playbook, or property audit needs maximum screen real estate.
 * 
 * Specially designed for portrait cell phone users to eliminate horizontal scroll
 * and cramped columns, while offering one-tap return via an "X" or on video completion.
 */
export default function CopilotExplodedSubjectModal({
  isOpen,
  onClose,
  subjectType = 'news', // 'news' | 'solutions' | 'dossier' | 'story' | 'solution'
  activeView = 'news',
  onViewChange,
  selectedItem = null,
  onSelectItem,
  dossierData,
  property,
  videoUrl,
  headline,
  showName,
  onPromptClick,
  onOpenCaptureModal,
  isSubscriber = false,
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const videoRef = useRef(null);
  const modalContainerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when exploded
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
      setVideoCompleted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTab = selectedItem?.category ? 'solutions' : (activeView || subjectType || 'news');

  const handleReturnToCommunication = (queryToSend = null) => {
    onClose();
    if (queryToSend && onPromptClick) {
      setTimeout(() => {
        onPromptClick(queryToSend);
      }, 150);
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  return (
    <div 
      className="fixed inset-0 z-[50000] bg-black/95 backdrop-blur-2xl text-white flex flex-col overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Full-Screen Focus Theater"
    >
      {/* ── TOP STICKY BAR: BRAND, TAB SWITCHER & PROMINENT 'X' RETURN BUTTON ── */}
      <header className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#D4AF37]/40 bg-[#0a0a0a] flex items-center justify-between gap-2 shrink-0 shadow-2xl z-30">
        
        {/* Left: Dyson Brand Badge + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <DysonVerticalBadge height={32} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase truncate">
                PAGE 2 · FULL-SCREEN THEATER
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block truncate">
              Maximum resolution for mobile &amp; deep analysis · Press Esc or X to return
            </p>
          </div>
        </div>

        {/* Center: Quick Switcher Tabs (Search as #1, Audit, Solutions, Daily News) */}
        <div className="hidden md:flex items-center bg-[#141414] p-1 rounded-xl border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => handleReturnToCommunication()}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 text-stone-400 hover:text-white"
          >
            <span>← Search</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedItem) onSelectItem?.(null);
              onViewChange?.('dossier');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'dossier' && !selectedItem
                ? 'bg-white/15 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Property Audit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedItem) onSelectItem?.(null);
              onViewChange?.('solutions');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'solutions'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Solutions Vault</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedItem) onSelectItem?.(null);
              onViewChange?.('news');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'news' && !selectedItem
                ? 'bg-white/15 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Daily News</span>
          </button>
        </div>

        {/* Right: HIGH VISIBILITY 'X' RETURN TO COMMUNICATION BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleReturnToCommunication()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#e8c84a] to-[#D4AF37] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer active:scale-95"
            title="Return to 3-Way Dialogue Engine"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="whitespace-nowrap">Return to Dialogue</span>
          </button>
        </div>
      </header>

      {/* ── MAIN SCROLLABLE CONTENT BODY ── */}
      <div 
        ref={modalContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 pb-32"
      >
        
        {/* ── OPTION A: SPECIFIC SELECTED SOLUTION PLAYBOOK ── */}
        {selectedItem?.category ? (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Back button to all solutions */}
            <button
              type="button"
              onClick={() => onSelectItem?.(null)}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1.5 font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 w-fit cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to All Solutions</span>
            </button>

            {/* Playbook Hero Header */}
            <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1c180e] via-[#101010] to-[#0c0c0c] p-5 sm:p-7 shadow-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-[#D4AF37] tracking-wider uppercase px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{selectedItem.format}</span>
                </span>
                
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  selectedItem.speaker === 'bob'
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedItem.speaker === 'bob' ? 'Bob Dyson (Broker Supervision)' : 'Charlie Simmons (Voice & Concierge)'}
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-wide leading-tight">
                {selectedItem.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#D4AF37] font-mono">
                {selectedItem.subtitle}
              </p>
              
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm leading-relaxed text-stone-200">
                {selectedItem.summary}
              </div>

              <div className="p-4 rounded-xl bg-[#1a160d] border border-[#D4AF37]/60 text-xs sm:text-sm text-stone-200 font-mono flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs uppercase tracking-wider block">Mandatory Fiduciary Rule:</strong>
                  <p className="mt-1">{selectedItem.keyRule}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleReturnToCommunication(selectedItem.promptQuery)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#e8c84a] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask in CoPilot Dialogue ({selectedItem.speaker === 'bob' ? 'Bob Dyson' : 'Charlie'}) →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReturnToCommunication()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <span>Close &amp; Return</span>
                </button>
              </div>
            </div>
          </div>

        ) : currentTab === 'news' ? (
          
          /* ── OPTION B: DAILY NEWS & VIDEO THEATER (1080P WIDESCREEN) ── */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Full 16:9 Cinema Player */}
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37] group bg-black"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Top Badges */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-[#D4AF37]/60 backdrop-blur-md pointer-events-none">
                <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#D4AF37]">
                  FULL THEATER
                </span>
                <span className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
              </div>

              <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-black/80 border border-[#D4AF37]/50 backdrop-blur-md pointer-events-none">
                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#D4AF37]">
                  {showName || 'DNN Daily Broadcast'}
                </span>
              </div>

              {/* Video Tag */}
              <video
                ref={videoRef}
                key={videoUrl}
                src={videoUrl}
                poster={STUDIO_POSTER_URL}
                controls
                autoPlay
                playsInline
                preload="metadata"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setVideoCompleted(true)}
                className="w-full h-full object-cover"
                style={{ display: 'block', background: '#000' }}
              />
            </div>

            {/* Video Completed Prompt Notice */}
            {videoCompleted && (
              <div className="p-4 rounded-xl border-2 border-emerald-500 bg-[#0e1a14] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>BROADCAST COMPLETE · CHARLIE &amp; BOB ARE READY</span>
                  </div>
                  <p className="text-xs text-stone-200">
                    Would you like to ask Bob Dyson or Charlie Simmons questions about today's market update?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReturnToCommunication("Charlie, summarize this broadcast in bullet points")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0"
                >
                  Return to Dialogue Now →
                </button>
              </div>
            )}

            {/* Broadcast Details & Executive Summary */}
            <div className="rounded-xl bg-[#121212] border border-white/10 p-4 sm:p-6 space-y-4">
              <div className="space-y-1 border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                  MORNING BROADCAST · REAL-TIME FIDUCIARY DELIVERY
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {headline || 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                DNN Intelligence tracks migration flows, interest rate movements, and inventory squeezes across California and destination luxury markets. Watch Charlie Simmons and Bob Dyson break down today's story.
              </p>

              {/* Inquiry Action Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                  ONE-TAP ACTIONS (RETURNS TO DIALOGUE ENGINE):
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleReturnToCommunication("Bob, how does today's inventory news affect our offer strategy?")}
                    className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Bob: Impact on Offer Strategy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReturnToCommunication("Charlie, summarize this broadcast in bullet points")}
                    className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-white/15 text-stone-200 hover:text-white border border-white/15 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Charlie: Bullet Summary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReturnToCommunication("How does fiduciary due diligence protect buyers during an inventory freeze?")}
                    className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-white/15 text-stone-200 hover:text-white border border-white/15 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Contingency Shields?</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Briefs Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] font-mono block">
                EXPANDED NEWS BRIEFS (TAP TO INQUIRE)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleReturnToCommunication("Tell me more about California Coastal Commission bluff setback protocols")}
                  className="p-4 rounded-xl bg-[#121212] border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[9px] text-stone-400 mb-1 font-mono">
                    <span className="text-emerald-400 font-bold">ZONING &amp; SOIL</span>
                    <span>SAN DIEGO</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] leading-snug">
                    California Coastal Commission Bluff Setback Protocols Tightened
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-3">
                    New soil stability mandates require un-waivable geotechnical audits before title transfer in coastal zones.
                  </p>
                </div>

                <div
                  onClick={() => handleReturnToCommunication("What are the latest mortgage interest rate adjustments and spread?")}
                  className="p-4 rounded-xl bg-[#121212] border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[9px] text-stone-400 mb-1 font-mono">
                    <span className="text-yellow-400 font-bold">RATES &amp; ESCROW</span>
                    <span>NATIONAL</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] leading-snug">
                    Conforming Jumbo Rate Spread Stabilizes at 6.45%
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-3">
                    How high-net-worth buyers are using fiduciary discovery to verify lender compliance and lock in protective contingency shields.
                  </p>
                </div>
              </div>
            </div>
          </div>

        ) : currentTab === 'solutions' ? (

          /* ── OPTION C: SOLUTIONS VAULT IN EXPLODED THEATER ── */
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#17140b] via-[#101010] to-[#121212] p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  EXPANDED SOLUTIONS VAULT · {SOLUTIONS_LIBRARY.length} ACTIVE PLAYBOOKS
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                Fiduciary Playbooks, Legal Shields &amp; Tax Portability
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Tap any playbook below to review its fiduciary mechanics or ask Bob Dyson and Charlie Simmons directly.
              </p>
            </div>

            {/* Full Grid of Playbooks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOLUTIONS_LIBRARY.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem?.(item)}
                  className="rounded-xl bg-[#121212] border border-white/10 hover:border-[#D4AF37] p-4 space-y-3 cursor-pointer group transition-all shadow-lg hover:bg-[#161512]"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{item.format}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-stone-300 font-mono text-[9px]">
                      {item.speaker === 'bob' ? 'Bob Dyson' : 'Charlie'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#D4AF37] font-semibold">
                      View Full Protocol →
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReturnToCommunication(item.promptQuery);
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-[11px] transition-all cursor-pointer"
                    >
                      Ask in Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (

          /* ── OPTION D: PROPERTY AUDIT & INTELLIGENCE IN EXPLODED THEATER ── */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header Banner */}
            <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#17140b] via-[#101010] to-[#121212] p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  FULL-SCREEN FIDUCIARY AUDIT DOSSIER
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                  {dossierData?.shortAddress || '742 Vista Del Mar'}, {dossierData?.city || 'La Jolla'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300">
                  {dossierData?.marketSummary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCaptureModal) {
                    onOpenCaptureModal();
                  } else {
                    handleReturnToCommunication("Text full report to my mobile");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#e8c84a] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer shrink-0"
              >
                <span>Text Report to Mobile</span>
                <span>→</span>
              </button>
            </div>

            {/* Comps Matrix */}
            <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  HONEST COMPS MATRIX (UNVARNISHED DATA)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-mono text-stone-300">
                  <thead>
                    <tr className="border-b border-white/20 text-[#D4AF37] uppercase text-[10px]">
                      <th className="py-2">Address</th>
                      <th className="py-2">Distance</th>
                      <th className="py-2">Specs</th>
                      <th className="py-2">Sold Price</th>
                      <th className="py-2 text-right">Adjusted Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossierData?.comps?.map((comp, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 font-bold text-white">{comp.address}</td>
                        <td className="py-2 text-stone-400">{comp.distance}</td>
                        <td className="py-2 text-stone-400">{comp.specs}</td>
                        <td className="py-2 text-stone-300">{comp.soldPrice}</td>
                        <td className="py-2 text-right text-[#D4AF37] font-bold">{comp.adjPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs font-semibold text-[#D4AF37] pt-2">
                {dossierData?.compsSummary}
              </p>
            </div>

            {/* Hidden Risks and Rebate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hidden Risks Audit</span>
                </div>
                <div className="space-y-3 text-xs">
                  {dossierData?.risks?.map((risk, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/50 border border-white/5">
                      <h4 className="font-bold text-white">{risk.title}</h4>
                      <p className="text-stone-400 mt-1">{risk.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span>Lender &amp; Fiduciary Compliance Audit</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Pre-Offer Fiduciary Verification | California DRE #00609384
                  </p>
                  <div className="p-4 rounded-xl bg-black border border-[#D4AF37]/50 flex items-center justify-between mt-2">
                    <span className="text-xs sm:text-sm font-semibold text-white">Earnest Deposit Contingency</span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100% Protected</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleReturnToCommunication("Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?")}
                  className="w-full py-2.5 rounded-xl bg-[#181818] hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 font-semibold text-xs transition-all cursor-pointer"
                >
                  Ask Bob About Lender Compliance →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── MOBILE PORTRAIT FLOATING BOTTOM RETURN BAR (Always accessible to thumb) ── */}
      <footer className="md:hidden px-4 py-3 bg-[#0a0a0a]/95 border-t border-[#D4AF37]/30 backdrop-blur-lg flex items-center justify-between gap-3 shrink-0">
        <span className="text-[10px] text-stone-400 font-mono truncate">
          Viewing Full-Screen
        </span>
        <button
          type="button"
          onClick={() => handleReturnToCommunication()}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
          <span>Exit to Dialogue</span>
        </button>
      </footer>
    </div>
  );
}