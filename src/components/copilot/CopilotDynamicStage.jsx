import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Radio, Scale, Shield, 
  GitBranch, ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, Video, Sparkles, Maximize2
} from 'lucide-react';

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

  // If a video changes (e.g. explainer or news), pause previous
  useEffect(() => {
    setIsPlaying(false);
  }, [selectedSubject, activeExplainer, activeView]);

  // Determine what type of content to show in the stage:
  // 1. Explicit video from active explainer
  // 2. Selected subject from Solutions Vault (video OR specialized visual diagram)
  // 3. View-based visual/video (News = DNN Broadcast; Vetting = Vetting standards; Roadmap = 7-phase sequence; Escrow = Deposit shield; Audit = Property snapshot)

  // A. Check if an active video is requested
  const hasActiveExplainerVideo = Boolean(activeExplainer?.videoUrl);
  const isSelectedSubjectVideo = Boolean(selectedSubject?.videoUrl);
  const isNewsView = activeView === 'news';

  const videoToPlay = hasActiveExplainerVideo 
    ? activeExplainer.videoUrl 
    : (isSelectedSubjectVideo ? selectedSubject.videoUrl : (isNewsView ? playUrl : null));

  const videoTitle = hasActiveExplainerVideo 
    ? (activeExplainer.label || activeExplainer.topic || 'Video Explainer')
    : (isSelectedSubjectVideo ? selectedSubject.title : headline || 'DNN Daily Broadcast');

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
        className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/50 group shrink-0 transition-all duration-300"
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
        <div className="absolute top-1.5 left-1.5 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/85 text-[8.5px] font-mono text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
            <span className="truncate max-w-[150px]">{videoTitle}</span>
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
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c180e] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about Prop 19"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <FileText className="w-2.5 h-2.5 text-[#D4AF37]" />
              PROP 19 TAX TRANSFER
            </span>
            <span className="text-emerald-400 font-bold">SAVE ~$27K/YR</span>
          </div>

          <div className="flex items-center justify-between text-[8.5px] my-auto gap-1">
            <div className="bg-black/70 p-1.5 rounded border border-white/10 text-center flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">PRIOR BASE</span>
              <span className="font-bold text-white font-mono">$650,000</span>
            </div>
            <span className="text-[#D4AF37] text-[10px] font-bold">➔</span>
            <div className="bg-[#1c160c] p-1.5 rounded border border-[#D4AF37]/40 text-center flex-1">
              <span className="text-[7px] text-[#D4AF37] block font-mono">NEW CA HOME</span>
              <span className="font-bold text-white font-mono">$2,850,000</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Transfer tax base up to 3 times</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // 1031 Exchange 45-Day Timeline Diagram
    if (sId === '1031-exchange-timeline') {
      return (
        <div 
          onClick={() => onPromptClick?.("Bob, what are the strict deadlines in a 1031 exchange?")}
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about 1031 Exchange"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
              1031 SAFE HARBOR
            </span>
            <span className="text-amber-400 font-bold">ZERO EXTENSIONS</span>
          </div>

          <div className="flex items-center justify-between text-[8px] my-auto gap-1">
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">DAY 0</span>
              <span className="font-bold text-white">Sale Close</span>
            </div>
            <span className="text-stone-500 text-[9px]">➔</span>
            <div className="bg-red-950/60 p-1 rounded border border-red-500/40 text-center flex-1">
              <span className="text-[7px] text-red-300 block font-mono">DAY 45</span>
              <span className="font-bold text-white">Identify 3</span>
            </div>
            <span className="text-stone-500 text-[9px]">➔</span>
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">DAY 180</span>
              <span className="font-bold text-white">Close</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Strict midnight identification rule</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Bob →</span>
          </div>
        </div>
      );
    }

    // Coastal Bluff Setback & Geotechnical Study
    if (sId === 'coastal-bluff-setbacks') {
      return (
        <div 
          onClick={() => onPromptClick?.("What are the coastal bluff setback and geotechnical soil stability requirements?")}
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#121614] via-[#0f1110] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Click to ask about Coastal Bluff Setback"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
              COASTAL COMMISSION
            </span>
            <span className="text-emerald-400 font-bold">75-YR RETREAT</span>
          </div>

          <div className="flex items-center justify-between text-[8px] my-auto gap-1 text-center">
            <div className="bg-black/70 p-1 rounded border border-white/10 flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">SETBACK</span>
              <span className="font-bold text-white">25–40 Ft</span>
            </div>
            <div className="bg-black/70 p-1 rounded border border-white/10 flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">SOIL TEST</span>
              <span className="font-bold text-white">Core Boring</span>
            </div>
            <div className="bg-black/70 p-1 rounded border border-white/10 flex-1">
              <span className="text-[7px] text-stone-400 block font-mono">PERMITS</span>
              <span className="font-bold text-white">Un-waivable</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Geotechnical core audit required</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Vetting: Referral Agreement Partnership Diagram
    if (sId === 'vetting-referral-agreement') {
      return (
        <div 
          onClick={() => onPromptClick?.("Explain how the referral agreement allows CoPilot to assist me alongside my local buyer agent at zero cost.")}
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181611] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Referral Agreement Partnership Structure"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-[#D4AF37]" />
              REFERRAL ALLIANCE
            </span>
            <span className="text-emerald-400 font-bold">$0 EXTRA FEE</span>
          </div>

          <div className="flex items-center justify-between text-[7.5px] my-auto gap-1">
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
              <span className="text-[6.5px] text-stone-400 block font-mono">BUYER</span>
              <span className="font-bold text-white">Full Fiduciary</span>
            </div>
            <span className="text-[#D4AF37] text-[9px]">➔</span>
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
              <span className="text-[6.5px] text-stone-400 block font-mono">LOCAL AGENT</span>
              <span className="font-bold text-white">Dedicated</span>
            </div>
            <span className="text-[#D4AF37] text-[9px]">➔</span>
            <div className="bg-[#1c160c] p-1 rounded border border-[#D4AF37]/40 text-center flex-1">
              <span className="text-[6.5px] text-[#D4AF37] block font-mono">COPILOT</span>
              <span className="font-bold text-white">Analytics</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Active partner through closing</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Vetting: Dual Agency Risk vs Independent Representation
    if (sId === 'vetting-dual-agency') {
      return (
        <div 
          onClick={() => onPromptClick?.("Bob, what are the legal and financial risks of allowing the listing agent to represent me as a dual agent?")}
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181212] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Dual Agency vs Independent Representation"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <Scale className="w-2.5 h-2.5 text-[#D4AF37]" />
              DUAL AGENCY RISK
            </span>
            <span className="text-rose-400 font-bold">CONFLICT RISK</span>
          </div>

          <div className="flex items-center justify-between text-[7.5px] my-auto gap-1">
            <div className="bg-rose-950/40 p-1 rounded border border-rose-500/30 text-center flex-1">
              <span className="text-[6.5px] text-rose-300 block font-mono">LISTING AGENT</span>
              <span className="font-bold text-white">Seller Loyalty</span>
            </div>
            <span className="text-stone-500 text-[9px]">VS</span>
            <div className="bg-emerald-950/40 p-1 rounded border border-emerald-500/30 text-center flex-1">
              <span className="text-[6.5px] text-emerald-300 block font-mono">BUYER AGENT</span>
              <span className="font-bold text-white">100% Loyalty</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Never compromise your price advocacy</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Bob →</span>
          </div>
        </div>
      );
    }

    // Vetting: Advisory Agreement Gate Verification
    if (sId === 'vetting-advisory-gate') {
      return (
        <div 
          onClick={() => onPromptClick?.("Charlie, why do I need to confirm non-exclusive representation before deploying broker review?")}
          className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
          style={{ aspectRatio: '16/9' }}
          title="Client Advisory Agreement Gate"
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-[#D4AF37]" />
              ADVISORY FIREWALL
            </span>
            <span className="text-[#D4AF37] font-bold">CA DRE COMPLIANCE</span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[7.5px] my-auto">
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center">
              <span className="text-[6.5px] text-stone-400 block font-mono">DECLARATION</span>
              <span className="font-bold text-white">Non-Exclusive</span>
            </div>
            <div className="bg-black/70 p-1 rounded border border-white/10 text-center">
              <span className="text-[6.5px] text-stone-400 block font-mono">BROKER REVIEW</span>
              <span className="font-bold text-white">Human Oversight</span>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
            <span className="truncate">Zero upfront cost · Licensed DRE #02303118</span>
            <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Charlie →</span>
          </div>
        </div>
      );
    }

    // Default Visual Card for any other selected subject
    return (
      <div 
        onClick={() => onPromptClick?.(selectedSubject.promptQuery || selectedSubject.title)}
        className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c180e] via-[#121212] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
          <span className="font-bold flex items-center gap-1 truncate max-w-[140px]">
            <Sparkles className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
            {selectedSubject.categoryLabel || 'FIDUCIARY PLAYBOOK'}
          </span>
          <span className="text-stone-300">{selectedSubject.speaker === 'bob' ? 'Bob Dyson' : 'Charlie'}</span>
        </div>

        <div className="my-auto px-1">
          <h4 className="text-[9.5px] font-bold text-white line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
            {selectedSubject.title}
          </h4>
          <p className="text-[8px] text-stone-400 line-clamp-1 mt-0.5 font-sans">
            {selectedSubject.subtitle}
          </p>
        </div>

        <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
          <span className="truncate">Active In Dialogue</span>
          <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask {selectedSubject.speaker === 'bob' ? 'Bob' : 'Charlie'} →</span>
        </div>
      </div>
    );
  }

  // C. View-Specific Visual Stages (When no specific subject is selected)

  // 1. VETTING VIEW STAGE
  if (activeView === 'vetting') {
    return (
      <div 
        onClick={() => onPromptClick?.("Charlie, what are the four vetting standards for an independent buyer's agent?")}
        className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181611] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
        style={{ aspectRatio: '16/9' }}
        title="Agent Vetting Standards Desk"
      >
        <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
          <span className="font-bold flex items-center gap-1">
            <Shield className="w-2.5 h-2.5 text-[#D4AF37]" />
            AGENT VETTING DESK
          </span>
          <span className="text-emerald-400 font-bold">FIDUCIARY PARTNER</span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[7.5px] my-auto">
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">REPRESENTATION</span>
            <span className="text-white font-bold">Zero Dual Agency</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">STRUCTURE</span>
            <span className="text-white font-bold">Referral Agreement</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">ESCROW ROLE</span>
            <span className="text-white font-bold">CoPilot By Your Side</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">FEE TO BUYER</span>
            <span className="text-[#D4AF37] font-bold">$0 Extra Cost</span>
          </div>
        </div>

        <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
          <span className="truncate">Independent local agent vetting</span>
          <span className="text-[#D4AF37] group-hover:underline shrink-0">Explore Vetting →</span>
        </div>
      </div>
    );
  }

  // 2. ROADMAP VIEW STAGE
  if (activeView === 'roadmap') {
    return (
      <div 
        onClick={() => onPromptClick?.("Explain the 7 transaction phases of the Move Roadmap")}
        className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181611] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
        style={{ aspectRatio: '16/9' }}
        title="7-Phase Move Roadmap"
      >
        <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
          <span className="font-bold flex items-center gap-1">
            <GitBranch className="w-2.5 h-2.5 text-[#D4AF37]" />
            MOVE ROADMAP SEQUENCE
          </span>
          <span className="text-white font-bold">7 PHASES</span>
        </div>

        <div className="flex items-center justify-between text-[7px] my-auto gap-0.5 px-0.5 font-mono">
          <div className="text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center mx-auto text-[7px]">1</span>
            <span className="text-stone-400 block mt-0.5 text-[6.5px]">Audit</span>
          </div>
          <span className="text-stone-600">➔</span>
          <div className="text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[7px]">2</span>
            <span className="text-stone-400 block mt-0.5 text-[6.5px]">Agent</span>
          </div>
          <span className="text-stone-600">➔</span>
          <div className="text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[7px]">3</span>
            <span className="text-stone-400 block mt-0.5 text-[6.5px]">Offer</span>
          </div>
          <span className="text-stone-600">➔</span>
          <div className="text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[7px]">4</span>
            <span className="text-stone-400 block mt-0.5 text-[6.5px]">Escrow</span>
          </div>
          <span className="text-stone-600">➔</span>
          <div className="text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center mx-auto text-[7px]">7</span>
            <span className="text-emerald-400 block mt-0.5 text-[6.5px]">Close</span>
          </div>
        </div>

        <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
          <span className="truncate">CoPilot tracks every milestone</span>
          <span className="text-[#D4AF37] group-hover:underline shrink-0">Open Phase 1 →</span>
        </div>
      </div>
    );
  }

  // 3. ESCROW VIEW STAGE
  if (activeView === 'escrow') {
    return (
      <div 
        onClick={() => onPromptClick?.("Bob, how does the 21-day loan and appraisal contingency shield protect our 3% deposit?")}
        className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
        style={{ aspectRatio: '16/9' }}
        title="Escrow & Title Contingency Shield"
      >
        <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
          <span className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-[#D4AF37]" />
            ESCROW DEPOSIT SHIELD
          </span>
          <span className="text-emerald-400 font-bold">3% PROTECTED</span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[7.5px] my-auto">
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">CONTINGENCY</span>
            <span className="text-white font-bold">Affirmative Written</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">APPRAISAL GAP</span>
            <span className="text-white font-bold">Renegotiation Shield</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">SCHEDULE B</span>
            <span className="text-white font-bold">ALTA Extended Title</span>
          </div>
          <div className="bg-black/60 p-1 rounded border border-white/10">
            <span className="text-stone-400 block font-mono text-[6.5px]">ESCROW ADVICE</span>
            <span className="text-[#D4AF37] font-bold">Bob Dyson Supervision</span>
          </div>
        </div>

        <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
          <span className="truncate">Never waive prematurely</span>
          <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask Bob →</span>
        </div>
      </div>
    );
  }

  // 4. DOSSIER (AUDIT) VIEW STAGE
  return (
    <div 
      onClick={() => onPromptClick?.(`Summarize comps and environmental risks for ${dossierData.shortAddress || property || 'this property'}`)}
      className="relative w-[44%] max-w-[300px] min-w-[210px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-[#D4AF37]/60 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181611] via-[#111111] to-[#0a0a0a] cursor-pointer group hover:border-[#D4AF37] transition-all"
      style={{ aspectRatio: '16/9' }}
      title="Property Audit Dossier Snapshot"
    >
      <div className="flex items-center justify-between text-[8px] font-mono text-[#D4AF37] border-b border-white/10 pb-1">
        <span className="font-bold flex items-center gap-1 truncate max-w-[140px]">
          <Scale className="w-2.5 h-2.5 text-[#D4AF37]" />
          AUDIT: {dossierData.shortAddress || property || 'LA JOLLA'}
        </span>
        <span className="text-emerald-400 font-bold">{dossierData.listPrice || 'ACTIVE'}</span>
      </div>

      <div className="flex items-center justify-between text-[8px] my-auto gap-1">
        <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
          <span className="text-[6.5px] text-stone-400 block font-mono">COMPS</span>
          <span className="font-bold text-white font-mono">{dossierData.comps?.length || 3} Verified</span>
        </div>
        <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
          <span className="text-[6.5px] text-stone-400 block font-mono">GEO RISK</span>
          <span className="font-bold text-amber-400 font-mono">Bluff Setback</span>
        </div>
        <div className="bg-black/70 p-1 rounded border border-white/10 text-center flex-1">
          <span className="text-[6.5px] text-stone-400 block font-mono">EST. VAL</span>
          <span className="font-bold text-white font-mono">~$3.85M</span>
        </div>
      </div>

      <div className="text-[7.5px] text-stone-300 flex items-center justify-between border-t border-white/10 pt-1 font-sans">
        <span className="truncate">Independent Fiduciary Analysis</span>
        <span className="text-[#D4AF37] group-hover:underline shrink-0">Ask in Dialogue →</span>
      </div>
    </div>
  );
}