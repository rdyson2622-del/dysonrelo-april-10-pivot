import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Radio, Scale, Shield, 
  GitBranch, ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, Video, Sparkles, Maximize2
} from 'lucide-react';
import CopilotDoorAudioBriefingStage from './CopilotDoorAudioBriefingStage';

const DNN_STUDIO_POSTER = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d5e0cb3f1_Screenshot2026-09-14at81551PM.png';

export default function CopilotDynamicStage({
  activeView = 'dossier',
  selectedSubject = null,
  activeExplainer = null,
  dossierData = {},
  property = '',
  playUrl = '',
  headline = '',
  onPromptClick,
  onToggleExplode
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Determine what type of content to show in the stage:
  // 1. Explicit video from active explainer
  // 2. Selected subject from Solutions Vault (video OR specialized visual diagram)
  // 3. View-based visual/video (News = DNN Broadcast; Vetting = Vetting standards; Roadmap = 7-phase sequence; Escrow = Deposit shield; Audit = Property snapshot)

  const hasActiveExplainerVideo = Boolean(activeExplainer?.videoUrl);
  const isSelectedSubjectVideo = Boolean(selectedSubject?.videoUrl);
  const isNewsView = activeView === 'news';

  const videoToPlay = hasActiveExplainerVideo 
    ? activeExplainer.videoUrl 
    : (isSelectedSubjectVideo ? selectedSubject.videoUrl : (isNewsView ? playUrl : null));

  const videoTitle = hasActiveExplainerVideo 
    ? (activeExplainer.label || activeExplainer.topic || 'Video Explainer')
    : (isSelectedSubjectVideo ? selectedSubject.title : headline || 'DNN Daily Broadcast');

  // Option A (Auto-play with Audio): Immediately speaks unmuted when videoToPlay is active
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current && videoToPlay) {
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Unmuted video autoplay attempt:', err);
            // Graceful fallback if browser requires user interaction before unmuted autoplay
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, [videoToPlay, activeView]);

  // Toggle play/pause for video
  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // If there's a video to play for this subject or news, render video player
  if (videoToPlay) {
    return (
      <div
        className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/50 group shrink-0 transition-all duration-300"
        style={{
          aspectRatio: '16/9',
          background: '#000',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        }}
      >
        <video
          ref={videoRef}
          key={videoToPlay}
          src={videoToPlay}
          poster={DNN_STUDIO_POSTER}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          style={{ display: 'block', background: '#000' }}
        />
        {/* Subtle pill tag indicating subject */}
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="truncate max-w-[200px]">{videoTitle}</span>
          </span>
        </div>
      </div>
    );
  }

  // B. Selected Subject from Vault (Visual Diagram)
  if (selectedSubject) {
    const sId = selectedSubject.id;

    // Prop 19 Tax Base Transfer Diagram
    if (sId === 'prop-19-tax-portability') {
      return (
        <div 
          onClick={() => onPromptClick?.("Explain Prop 19 tax base transfer rules")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c180e] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about Prop 19"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              PROP 19 TAX TRANSFER
            </span>
            <span className="text-emerald-400 font-bold">SAVE ~$27K/YR</span>
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-[12px] my-auto gap-2">
            <div className="bg-black/70 p-2 sm:p-2.5 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">PRIOR BASE</span>
              <span className="font-bold text-white font-mono text-xs sm:text-[13px]">$650,000</span>
            </div>
            <span className="text-[#D4AF37] text-sm font-bold">➔</span>
            <div className="bg-[#1c160c] p-2 sm:p-2.5 rounded-lg border border-[#D4AF37]/40 text-center flex-1">
              <span className="text-[8.5px] text-[#D4AF37] block font-mono">NEW CA HOME</span>
              <span className="font-bold text-white font-mono text-xs sm:text-[13px]">$2,850,000</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Transfer tax base up to 3 times</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // 1031 Exchange 45-Day Timeline Diagram
    if (sId === '1031-exchange-timeline') {
      return (
        <div 
          onClick={() => onPromptClick?.("Bob, what are the strict deadlines in a 1031 exchange?")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about 1031 Exchange"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              1031 SAFE HARBOR
            </span>
            <span className="text-amber-400 font-bold">ZERO EXTENSIONS</span>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] my-auto gap-1.5">
            <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">DAY 0</span>
              <span className="font-bold text-white text-xs">Sale Close</span>
            </div>
            <span className="text-stone-500 text-xs">➔</span>
            <div className="bg-red-950/60 p-1.5 sm:p-2 rounded-lg border border-red-500/40 text-center flex-1">
              <span className="text-[8.5px] text-red-300 block font-mono">DAY 45</span>
              <span className="font-bold text-white text-xs">Identify 3</span>
            </div>
            <span className="text-stone-500 text-xs">➔</span>
            <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">DAY 180</span>
              <span className="font-bold text-white text-xs">Close</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Strict midnight identification rule</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Bob →</span>
          </div>
        </div>
      );
    }

    // Coastal Bluff Setback & Geotechnical Study
    if (sId === 'coastal-bluff-setbacks') {
      return (
        <div 
          onClick={() => onPromptClick?.("What are the coastal bluff setback and geotechnical soil stability requirements?")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#121614] via-[#0f1110] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about Coastal Bluff Setback"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              COASTAL COMMISSION
            </span>
            <span className="text-emerald-400 font-bold">75-YR RETREAT</span>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] my-auto gap-1.5 text-center">
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">SETBACK</span>
              <span className="font-bold text-white text-xs">25–40 Ft</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">SOIL TEST</span>
              <span className="font-bold text-white text-xs">Core Boring</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">PERMITS</span>
              <span className="font-bold text-white text-xs">Un-waivable</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Geotechnical core audit required</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Vetting: Referral Agreement Partnership Diagram
    if (sId === 'vetting-referral-agreement') {
      return (
        <div 
          onClick={() => onPromptClick?.("Explain how the referral agreement allows CoPilot to assist me alongside my local buyer agent at zero cost.")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181611] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Referral Agreement Partnership Structure"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              REFERRAL ALLIANCE
            </span>
            <span className="text-emerald-400 font-bold">$0 EXTRA FEE</span>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] my-auto gap-1.5">
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">BUYER</span>
              <span className="font-bold text-white text-xs">Full Fiduciary</span>
            </div>
            <span className="text-[#D4AF37] text-xs font-bold">➔</span>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">LOCAL AGENT</span>
              <span className="font-bold text-white text-xs">Dedicated</span>
            </div>
            <span className="text-[#D4AF37] text-xs font-bold">➔</span>
            <div className="bg-[#1c160c] p-2 rounded-lg border border-[#D4AF37]/40 text-center flex-1">
              <span className="text-[8.5px] text-[#D4AF37] block font-mono">COPILOT</span>
              <span className="font-bold text-white text-xs">Analytics</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Active partner through closing</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Vetting: Dual Agency Risk vs Independent Representation
    if (sId === 'vetting-dual-agency') {
      return (
        <div 
          onClick={() => onPromptClick?.("Bob, what are the legal and financial risks of allowing the listing agent to represent me as a dual agent?")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181212] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Dual Agency vs Independent Representation"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
              DUAL AGENCY RISK
            </span>
            <span className="text-rose-400 font-bold">CONFLICT RISK</span>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] my-auto gap-1.5">
            <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-500/30 text-center flex-1">
              <span className="text-[8.5px] text-rose-300 block font-mono">LISTING AGENT</span>
              <span className="font-bold text-white text-xs">Seller Loyalty</span>
            </div>
            <span className="text-stone-500 text-xs font-bold">VS</span>
            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-center flex-1">
              <span className="text-[8.5px] text-emerald-300 block font-mono">BUYER AGENT</span>
              <span className="font-bold text-white text-xs">100% Loyalty</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Never compromise your price advocacy</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Bob →</span>
          </div>
        </div>
      );
    }

    // Vetting: Advisory Agreement Gate Verification (Secure Partnership Stage)
    if (sId === 'vetting-advisory-gate') {
      return (
        <div 
          onClick={() => onPromptClick?.("Charlie, why do I need to confirm non-exclusive representation before deploying broker review?")}
          className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Client Advisory Partnership Alliance"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              ADVISORY ALLIANCE
            </span>
            <span className="text-emerald-400 font-bold">$0 CLIENT COST</span>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] my-auto gap-1.5">
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">BUYER</span>
              <span className="font-bold text-white text-xs">100% Loyalty</span>
            </div>
            <span className="text-[#D4AF37] text-xs font-bold">➔</span>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10 text-center flex-1">
              <span className="text-[8.5px] text-stone-400 block font-mono">LOCAL AGENT</span>
              <span className="font-bold text-white text-xs">Dedicated</span>
            </div>
            <span className="text-[#D4AF37] text-xs font-bold">➔</span>
            <div className="bg-[#1c160c] p-2 rounded-lg border border-[#D4AF37]/40 text-center flex-1">
              <span className="text-[8.5px] text-[#D4AF37] block font-mono">COPILOT</span>
              <span className="font-bold text-white text-xs">Analytics</span>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
            <span className="truncate">Independent buyer advocacy · CA referral agreement</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Default Visual Card for any other selected subject
    return (
      <div 
        onClick={() => onPromptClick?.(selectedSubject.promptQuery || selectedSubject.title)}
        className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c180e] via-[#121212] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] border-b border-white/10 pb-1.5">
          <span className="font-bold flex items-center gap-1.5 truncate max-w-[180px]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {selectedSubject.categoryLabel || 'FIDUCIARY PLAYBOOK'}
          </span>
          <span className="text-stone-300">{selectedSubject.speaker === 'bob' ? 'Bob Dyson' : 'Charlie'}</span>
        </div>

        <div className="my-auto px-1.5">
          <h4 className="text-xs sm:text-[13px] font-bold text-white line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
            {selectedSubject.title}
          </h4>
          <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-1 mt-1 font-sans">
            {selectedSubject.subtitle}
          </p>
        </div>

        <div className="text-[10px] sm:text-[11px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1.5 font-sans">
          <span className="truncate">Active In Dialogue</span>
          <span className="text-[#D4AF37] group-hover:underline shrink-0 font-medium">Ask {selectedSubject.speaker === 'bob' ? 'Bob' : 'Charlie'} →</span>
        </div>
      </div>
    );
  }

  // C. View-Specific Audio Briefing & Visual Stages for Active Execution Doors
  // (Property Audit, Agent Vetting, Move Roadmap, Escrow Watch, DNN News)
  return (
    <CopilotDoorAudioBriefingStage
      activeDoor={activeView || 'dossier'}
      dossierData={dossierData}
      property={property}
      onPromptClick={onPromptClick}
      onToggleExplode={onToggleExplode}
    />
  );
}