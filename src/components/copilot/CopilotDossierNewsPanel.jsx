import React, { useState, useRef } from 'react';
import { 
  Scale, ShieldAlert, Shield, DollarSign, Waves, Clock, Radio, 
  Maximize2, Minimize2, Newspaper, Sparkles, Play, Pause,
  Share2, Volume2, VolumeX, ChevronRight, ChevronDown, ChevronUp,
  MessageSquare, BookOpen, FileText, ArrowLeft, X, RotateCcw, GitBranch, ShieldCheck, Home
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CopilotSolutionsVault from './CopilotSolutionsVault';
import CopilotVettingView from './CopilotVettingView';
import CopilotRoadmapView from './CopilotRoadmapView';
import CopilotEscrowView from './CopilotEscrowView';
import CopilotVisualSnippetCard from './CopilotVisualSnippetCard';
import CopilotDynamicStage from './CopilotDynamicStage';
import CopilotUniversalVoicePills from './CopilotUniversalVoicePills';
import { resolveIntegratedSubject } from './subjectVisualRegistry';
import { getDoorAudioBriefing } from './doorAudioBriefings';
import { stopAllCopilotAudio } from '@/lib/copilotAudioController';

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
  onAuditAddress,
  onOpenCaptureModal,
  isSubscriber = false,
  topOffset = 480,
  onBackToSearch,
  onClear,
  pushedSnippet,
  onDismissSnippet,
  activeExplainer = null,
  doorSelectionVersion = 0,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVaultSubject, setSelectedVaultSubject] = useState(null);
  const [openAuditAccordions, setOpenAuditAccordions] = useState({});
  const videoRef = useRef(null);

  React.useEffect(() => {
    setSelectedVaultSubject(null);
    setOpenAuditAccordions({});
  }, [activeView, doorSelectionVersion]);

  const toggleAuditAccordion = (key) => {
    setOpenAuditAccordions(prev => {
      const willBeOpen = !prev[key];
      if (willBeOpen) {
        setSelectedVaultSubject(key);
      } else {
        setSelectedVaultSubject(null);
      }
      return {
        ...prev,
        [key]: willBeOpen
      };
    });
  };

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
  const currentView = activeView || 'dossier';
  const voiceSubject = selectedVaultSubject
    ? resolveIntegratedSubject(selectedVaultSubject, currentView, property, dossierData)
    : null;
  const voiceBriefing = getDoorAudioBriefing(currentView);
  const voiceText = voiceSubject?.spokenText || voiceBriefing.spokenText;
  const voiceSpeaker = voiceSubject?.speaker || voiceBriefing.speaker;

  const handleViewSwitch = (view) => {
    stopAllCopilotAudio();
    setSelectedVaultSubject(null);
    onViewChange?.(view);
  };

  const handleIntelligenceBack = () => {
    stopAllCopilotAudio();
    if (isExploded) {
      onToggleExplode?.();
      return;
    }
    if (currentView !== 'dossier') {
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
    stopAllCopilotAudio();
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (_) {}
      setIsPlaying(false);
    }
    setSelectedVaultSubject(null);
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
        <div className="absolute right-1 hidden sm:block">
          <CopilotUniversalVoicePills text={voiceText} defaultSpeaker={voiceSpeaker} />
        </div>

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
      <div className="flex justify-center sm:hidden -mt-3">
        <CopilotUniversalVoicePills text={voiceText} defaultSpeaker={voiceSpeaker} />
      </div>

      {/* ── DYNAMIC INTELLIGENCE STAGE: CONTEXT-AWARE VISUAL / VIDEO STAGE ── */}
      <CopilotDynamicStage
        activeView={currentView}
        selectedSubject={selectedVaultSubject}
        activeExplainer={activeExplainer}
        dossierData={dossierData}
        property={property}
        playUrl={playUrl}
        headline={headline}
        onPromptClick={onPromptClick}
        onToggleExplode={onToggleExplode}
      />

      {/* ── TOP CONTROLS & VIEW SWITCHER: Frozen Left Trio (Back, Search, Clear) + Scrollable Doors ── */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10 mt-4">
        {/* Frozen Trio: Back, Search, Clear (never scrolled, shrink-0) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleIntelligenceBack}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] hover:bg-white/10 text-[#D4AF37] hover:text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:bg-white active:text-black shrink-0 whitespace-nowrap"
            title="Back to previous view"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onBackToSearch) {
                onBackToSearch();
              } else {
                handleIntelligenceBack();
              }
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap"
            title="Return to property address search"
          >
            <span>← Search</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white active:bg-white active:text-black border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0 whitespace-nowrap"
            title="Clear content from the screen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
            <span>Clear</span>
          </button>
        </div>

        {/* Scrollable Doors + Full Screen View Switcher */}
        <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-white/15 gap-1 overflow-x-auto scrollbar-thin min-w-0">
          <button
            type="button"
            onClick={() => handleViewSwitch('dossier')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'dossier'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewSwitch('vetting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'vetting'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Vetting</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewSwitch('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'roadmap'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewSwitch('escrow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'escrow'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewSwitch('solutions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'solutions'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewSwitch('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'news'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>News</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleExplode?.()}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ml-0.5 ${
              isExploded
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
            title={isExploded ? "Return from full screen to page size" : "Expand chat + dossier canvas to full viewport"}
          >
            {isExploded ? (
              <>
                <X className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Return</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="copilot-intelligence-content space-y-4 shrink-0">
      {/* ── PUSHED VISUAL SNIPPET (FROM LEFT-SIDE CHAT OPERATOR) ── */}
      {pushedSnippet && (
        <CopilotVisualSnippetCard
          snippet={pushedSnippet}
          onDismiss={onDismissSnippet}
          onPromptClick={onPromptClick}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW: AGENT VETTING STANDARDS DESK (PROGRESSIVE ACCORDION)
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'vetting' && (
        <CopilotVettingView
          propertyAddress={dossierData?.fullAddress || property}
          onPromptClick={onPromptClick}
          onOpenCaptureModal={onOpenCaptureModal}
          onSelectSubject={(subj) => setSelectedVaultSubject(subj)}
          activeSubject={selectedVaultSubject}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW: TRANSACTION MOVE ROADMAP
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'roadmap' && (
        <CopilotRoadmapView
          propertyAddress={dossierData?.fullAddress || property}
          onPromptClick={onPromptClick}
          onOpenCaptureModal={onOpenCaptureModal}
          onSelectSubject={(subj) => setSelectedVaultSubject(subj)}
          activeSubject={selectedVaultSubject}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW: ESCROW & TITLE CONTINGENCY SHIELD
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'escrow' && (
        <CopilotEscrowView
          propertyAddress={dossierData?.fullAddress || property}
          onPromptClick={onPromptClick}
          onOpenCaptureModal={onOpenCaptureModal}
          onSelectSubject={(subj) => setSelectedVaultSubject(subj)}
          activeSubject={selectedVaultSubject}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW: REAL ESTATE SOLUTIONS & INTELLIGENCE VAULT (PROGRESSIVE ACCORDION)
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'solutions' && (
        <CopilotSolutionsVault 
          onPromptClick={onPromptClick} 
          onExplodePlaybook={(item) => onExplodeItem?.(item)}
          onSelectSubject={(subj) => setSelectedVaultSubject(subj)}
          activeSubject={selectedVaultSubject}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW A: FIDUCIARY PROPERTY AUDIT & INTELLIGENCE (UNIFORM ACCORDION LIST)
          ───────────────────────────────────────────────────────────── */}
      {activeView === 'dossier' && (
        <div className="space-y-1.5 pt-0.5 text-left font-sans">
          {/* ── ACCORDION 1: ADVISORY PROPERTY OVERVIEW & VERIFIED ATTRIBUTES ── */}
          {(() => {
            const isExpanded = !!openAuditAccordions['overview'];
            return (
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                    : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAuditAccordion('overview')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          PROPERTY OVERVIEW
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] text-stone-400 font-sans truncate">
                          {dossierData.shortAddress || property}
                        </span>
                      </div>
                      <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                        isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                      }`}>
                        {dossierData.isMlsEmpty ? "Listing Record Search" : `Property Overview · ${dossierData.shortAddress}`}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                      {dossierData.listPrice || (dossierData.isMlsEmpty ? 'Search' : 'Verified')}
                    </span>
                    <div className={`p-1 rounded-md transition-colors ${
                      isExpanded ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {dossierData.marketSummary}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenCaptureModal) onOpenCaptureModal();
                          else onPromptClick?.("Text full report to my mobile");
                        }}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-center"
                      >
                        <span>Text Me Report</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Ambiguous Property Selector */}
                    {dossierData.isAmbiguous && dossierData.ambiguousOptions && dossierData.ambiguousOptions.length > 0 && (
                      <div className="rounded-lg border border-[#D4AF37]/40 bg-[#181818] p-3 space-y-2">
                        <span className="text-[11px] font-semibold text-white block">
                          Select verified record for {dossierData.shortAddress}:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                          {dossierData.ambiguousOptions.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                if (onAuditAddress) onAuditAddress(opt.fullAddress);
                                else onPromptClick?.(opt.fullAddress);
                              }}
                              className="p-2 rounded bg-[#222222] hover:bg-[#2c2c2c] border border-white/10 hover:border-[#D4AF37] text-left transition-all cursor-pointer group"
                            >
                              <div className="text-xs font-bold text-white group-hover:text-[#D4AF37] font-mono">
                                {opt.street}
                              </div>
                              <div className="text-[10.5px] text-stone-400">
                                {opt.city}, {opt.state} {opt.zip}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Attributes Grid */}
                    {dossierData.isVerified && (
                      <div className="rounded-lg border border-white/10 bg-[#161616] p-3 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[11px] font-bold text-white font-mono uppercase">
                            {dossierData.listing?.status || 'Active'} {dossierData.listing?.propertyType || ''}
                          </span>
                          {dossierData.listPrice && (
                            <span className="text-xs font-bold font-mono text-[#D4AF37]">
                              {dossierData.listPrice}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                          {dossierData.ids?.apn && (
                            <div className="p-2 rounded bg-white/5 border border-white/5">
                              <span className="text-[9.5px] text-stone-400 block font-sans">APN</span>
                              <span className="text-white font-bold">{dossierData.ids.apn}</span>
                            </div>
                          )}
                          {(dossierData.building?.livingArea || dossierData.sqft) && (
                            <div className="p-2 rounded bg-white/5 border border-white/5">
                              <span className="text-[9.5px] text-stone-400 block font-sans">LIVING AREA</span>
                              <span className="text-white font-bold">
                                {Number(dossierData.building?.livingArea || dossierData.sqft).toLocaleString()} sf
                              </span>
                            </div>
                          )}
                          {(dossierData.building?.yearBuilt || dossierData.yearBuilt) && (
                            <div className="p-2 rounded bg-white/5 border border-white/5">
                              <span className="text-[9.5px] text-stone-400 block font-sans">YEAR BUILT</span>
                              <span className="text-white font-bold">{dossierData.building?.yearBuilt || dossierData.yearBuilt}</span>
                            </div>
                          )}
                          {dossierData.valuation?.estimatedValue && (
                            <div className="p-2 rounded bg-white/5 border border-white/5">
                              <span className="text-[9.5px] text-stone-400 block font-sans">EST. VALUE</span>
                              <span className="text-white font-bold">
                                ~${Number(dossierData.valuation.estimatedValue).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {(dossierData.listing?.listingNumber || dossierData.listing?.daysOnMarket !== undefined || dossierData.listing?.listingUrl) && (
                          <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-stone-400 pt-1 border-t border-white/5">
                            {dossierData.listing?.listingNumber && (
                              <span>MLS#: <strong className="text-white">{dossierData.listing.listingNumber}</strong></span>
                            )}
                            {dossierData.listing?.daysOnMarket !== undefined && dossierData.listing?.daysOnMarket !== '' && (
                              <span>DOM: <strong className="text-white">{dossierData.listing.daysOnMarket} days</strong></span>
                            )}
                            {dossierData.listing?.listingUrl && (
                              <a 
                                href={dossierData.listing.listingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#D4AF37] hover:underline flex items-center gap-1 ml-auto"
                              >
                                <span>Public Listing</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── ACCORDION 2: COPILOT PARTNERSHIP WITH YOUR AGENT ── */}
          {(() => {
            const isExpanded = !!openAuditAccordions['partnership'];
            return (
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                    : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAuditAccordion('partnership')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          PARTNERSHIP
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] text-stone-400 font-sans">
                          Referral Agreement
                        </span>
                      </div>
                      <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                        isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                      }`}>
                        CoPilot Partnership with Your Agent
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                      Fiduciary Advisory
                    </span>
                    <div className={`p-1 rounded-md transition-colors ${
                      isExpanded ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-xs text-stone-300 leading-relaxed font-sans pt-1">
                      Under our structured referral agreement, CoPilot remains actively involved throughout your purchase alongside your matched buyer's agent—providing continuous market intelligence, second-look comps, and contingency tracking to empower your decisions.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => onPromptClick?.("Bob, how does CoPilot stay involved alongside my agent throughout escrow?")}
                        className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span>Ask Bob about agent partnership →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── ACCORDION 3: HONEST COMPS ── */}
          {(() => {
            const isExpanded = !!openAuditAccordions['comps'];
            const compCount = dossierData.comps?.length || 0;
            return (
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                    : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAuditAccordion('comps')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          HONEST COMPS
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] text-stone-400 font-sans">
                          0.75 mi Radius
                        </span>
                      </div>
                      <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                        isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                      }`}>
                        Honest Comps · Verified Comparable Sales
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                      {compCount} Verified
                    </span>
                    <div className={`p-1 rounded-md transition-colors ${
                      isExpanded ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      Recent verified sales within 0.75 mi · Adjusted for square footage &amp; condition
                    </p>

                    {compCount > 0 ? (
                      <div className="space-y-1.5 pt-0.5 text-[11.5px] font-mono">
                        {dossierData.comps.map((comp, idx) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/5 gap-2">
                            <span className="font-medium text-white w-32 sm:w-36 truncate">{comp.address}</span>
                            <span className="text-stone-400">{comp.distance}</span>
                            <span className="text-stone-400">{comp.specs}</span>
                            <span className="text-stone-300">{comp.soldPrice}</span>
                            <span className="text-white font-semibold">{comp.adjPrice}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2.5 px-3 rounded-lg bg-[#161616] border border-white/5 text-xs text-stone-300 space-y-1">
                        <p className="text-white font-medium">
                          {dossierData.inputType === 'mls' || dossierData.isMlsEmpty
                            ? "No listing records found for this MLS#."
                            : "Property and listing verified. Comparable sales currently unavailable."}
                        </p>
                        <p className="text-stone-400 text-[11px]">
                          {dossierData.inputType === 'mls' || dossierData.isMlsEmpty
                            ? "Try the full street address or paste the listing URL for a more reliable lookup."
                            : (dossierData.compsSummary || "Subject property record verified via registry. Independent discovery with local desk recommended.")}
                        </p>
                      </div>
                    )}

                    {compCount > 0 && dossierData.compsSummary && (
                      <p className="text-xs text-stone-300 pt-1 font-sans leading-relaxed">
                        {dossierData.compsSummary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── ACCORDION 4: HIDDEN RISKS ── */}
          {(() => {
            const isExpanded = !!openAuditAccordions['risks'];
            const riskCount = dossierData.risks?.length || 0;
            return (
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                    : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAuditAccordion('risks')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          HIDDEN RISKS
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] text-stone-400 font-sans">
                          Topography, Bluff &amp; Permits
                        </span>
                      </div>
                      <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                        isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                      }`}>
                        Hidden Risks &amp; Environmental Factors
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                      {riskCount} Factors
                    </span>
                    <div className={`p-1 rounded-md transition-colors ${
                      isExpanded ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-3 animate-in fade-in duration-150">
                    <div className="space-y-2 text-xs pt-1">
                      {dossierData.risks.map((risk, idx) => {
                        const IconComp = idx === 0 ? Scale : idx === 1 ? Waves : Clock;
                        return (
                          <div key={risk.id || idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#161616] border border-white/5">
                            <IconComp className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-white">{risk.title}</h4>
                              <p className="text-stone-400 text-[11px] leading-relaxed mt-0.5">{risk.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {dossierData.risksSummary && (
                      <p className="text-xs text-stone-300 pt-1 font-sans leading-relaxed">
                        {dossierData.risksSummary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── ACCORDION 5: COMPLIANCE AND DISCOVERY ── */}
          {(() => {
            const isExpanded = !!openAuditAccordions['compliance'];
            return (
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#D4AF37]/50 bg-[#161512] shadow-md' 
                    : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAuditAccordion('compliance')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer group gap-2"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          COMPLIANCE &amp; DISCOVERY
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] text-stone-400 font-sans">
                          State, Fed &amp; Lender Regs
                        </span>
                      </div>
                      <h3 className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                        isExpanded ? 'text-[#D4AF37] font-semibold' : 'text-white group-hover:text-stone-200'
                      }`}>
                        Compliance and Discovery Standards
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
                      Civ. Code § 1675
                    </span>
                    <div className={`p-1 rounded-md transition-colors ${
                      isExpanded ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-stone-400 group-hover:text-white'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-3 animate-in fade-in duration-150">
                    <p className="text-[11px] text-stone-400 pt-1 font-sans">
                      Guidance for independent legal, title, and lender review · {dossierData.complianceBasis || 'Specific property issue audit'}
                    </p>

                    <div className="bg-[#161616] border border-white/5 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        Transaction Review
                      </span>
                      <div className="text-right">
                        <div className="text-xs font-medium font-mono text-white">
                          {dossierData.complianceProtocol || 'Individual Discovery'}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {dossierData.complianceStatus || 'State, Fed & Lender Regs'}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                      All transaction terms, concessions, or credits require individual discovery checked against state, federal, and lender regulations with your licensed representation.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
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
                <span className="text-[10px] text-stone-400 flex items-center gap-1.5 font-sans">
                  <Radio className="w-3 h-3 text-[#D4AF37]" />
                  Morning Broadcast · Market Intelligence
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-white mt-1 leading-snug">
                  {headline}
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 shrink-0 font-sans">
                Daily Video Update
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              DNN Intelligence tracks migration flows, interest rate movements, and inventory dynamics across California and destination luxury markets. Watch Charlie Simmons and Bob Dyson break down today's story.
            </p>

            {/* Real-Time Interactive Inquiry Buttons (Connects to Dialogue Engine) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-stone-400 block font-sans">
                Explore Questions on this Story:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleIntelligenceBack()}
                  className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span>Return to Dialogue</span>
                </button>

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
              <span className="text-xs font-semibold text-white">
                Today's Additional Briefs
              </span>
              <span className="text-[10px] text-stone-400 font-sans">DNN Market Desk</span>
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

    </div>
  );
}