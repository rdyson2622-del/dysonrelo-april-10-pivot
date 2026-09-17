import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Sparkles, ArrowRight, ShieldCheck, Scale, Shield, GitBranch,
  CheckCircle2
} from 'lucide-react';
import { DOOR_AUDIO_BRIEFINGS } from './doorAudioBriefings';

/**
 * CopilotDoorAudioBriefingStage
 * 
 * Standardized Voice Briefing & Visual Stage for the 4 Core Execution Doors:
 * 1. Property Audit (Charlie Simmons - Concierge / Data)
 * 2. Agent Vetting (Bob Dyson - Fiduciary Standards)
 * 3. Move Roadmap (Charlie Simmons - Process / Navigation)
 * 4. Escrow Watch (Bob Dyson - Fiduciary Protection)
 * 
 * Features:
 * - Direct audio playback with smooth stop on door change (no overlapping noise)
 * - Subtle rhythmic waveform animation when audio is playing
 * - One-tap accessible Play / Pause, Mute / Unmute, and Replay controls
 * - Speaker persona avatar with glowing activity indicator
 * - Synchronized visual diagram matching each door's subject matter
 */
export default function CopilotDoorAudioBriefingStage({
  activeDoor = 'dossier',
  dossierData = {},
  property = '',
  onPromptClick,
  onToggleExplode
}) {
  const briefing = DOOR_AUDIO_BRIEFINGS[activeDoor] || DOOR_AUDIO_BRIEFINGS.dossier;
  const isBob = briefing.speaker === 'bob';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const mediaRef = useRef(null);

  // Gracefully stop previous audio when switching execution doors
  useEffect(() => {
    if (mediaRef.current) {
      try {
        mediaRef.current.pause();
        mediaRef.current.currentTime = 0;
      } catch (_) {}
    }
    setIsPlaying(false);
    setHasEnded(false);
    setProgress(0);

    // Short settling delay before starting door audio briefing
    const timer = setTimeout(() => {
      if (mediaRef.current) {
        mediaRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be restricted until user interacts with page
            setIsPlaying(false);
          });
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      if (mediaRef.current) {
        try {
          mediaRef.current.pause();
        } catch (_) {}
      }
    };
  }, [activeDoor]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!mediaRef.current) return;
    if (mediaRef.current.paused || hasEnded) {
      if (hasEnded) {
        mediaRef.current.currentTime = 0;
        setHasEnded(false);
      }
      mediaRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!mediaRef.current) return;
    mediaRef.current.muted = !mediaRef.current.muted;
    setIsMuted(mediaRef.current.muted);
  };

  const handleReplay = (e) => {
    e?.stopPropagation();
    if (!mediaRef.current) return;
    mediaRef.current.currentTime = 0;
    setHasEnded(false);
    mediaRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const handleTimeUpdate = () => {
    if (!mediaRef.current) return;
    const cur = mediaRef.current.currentTime || 0;
    const dur = mediaRef.current.duration || 1;
    setProgress(Math.min(100, (cur / dur) * 100));
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setProgress(100);
  };

  const DoorIcon = activeDoor === 'vetting' ? Shield
    : activeDoor === 'roadmap' ? GitBranch
    : activeDoor === 'escrow' ? ShieldCheck
    : Scale;

  return (
    <div 
      className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#080808] transition-all group select-none"
      style={{ aspectRatio: '16/9' }}
      title={`${briefing.doorName} Audio Briefing`}
    >
      {/* Hidden Media Element (Plays verified briefing audio) */}
      <video
        ref={mediaRef}
        key={briefing.audioUrl}
        src={briefing.audioUrl}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* ── TOP HEADER ROW: DOOR IDENTITY, SPEAKER BADGE & CONTROLS ── */}
      <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-mono border-b border-white/10 pb-1.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <DoorIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="font-bold text-white uppercase tracking-wider truncate">
            {briefing.doorName}
          </span>
        </div>

        {/* Media Controls Group: Play/Pause, Mute, Waveform */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Subtle Audio Waveform Indicator */}
          <div className="flex items-end gap-0.5 h-3 px-1.5 shrink-0" title={isPlaying ? "Audio Briefing Active" : "Audio Paused"}>
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-100 ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-2.5 animate-pulse delay-100' : 'h-1 opacity-30'}`} />
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1"
            title={isPlaying ? "Pause briefing" : "Play briefing"}
          >
            {isPlaying ? (
              <Pause className="w-2.5 h-2.5 fill-current text-[#D4AF37]" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-current text-white" />
            )}
            <span className="text-[9px] font-bold tracking-wider">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute briefing" : "Mute briefing"}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-rose-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-stone-300" />
            )}
          </button>

          {hasEnded && (
            <button
              type="button"
              onClick={handleReplay}
              className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Restart briefing"
            >
              <RotateCcw className="w-3 h-3 text-[#D4AF37]" />
            </button>
          )}
        </div>
      </div>

      {/* ── CENTER BODY: DOOR-SPECIFIC VISUAL DIAGRAM ── */}
      <div className="my-auto px-1 py-1">
        {/* 1. AGENT VETTING DIAGRAM */}
        {activeDoor === 'vetting' && (
          <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">REPRESENTATION</span>
              <span className="text-white font-bold">Zero Dual Agency</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">STRUCTURE</span>
              <span className="text-white font-bold">Referral Agreement</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">ESCROW ROLE</span>
              <span className="text-white font-bold">CoPilot By Your Side</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">FEE TO BUYER</span>
              <span className="text-[#D4AF37] font-bold">$0 Extra Cost</span>
            </div>
          </div>
        )}

        {/* 2. MOVE ROADMAP SEQUENCE */}
        {activeDoor === 'roadmap' && (
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] gap-1 px-1 font-mono">
            <div className="text-center">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center mx-auto text-[9px]">1</span>
              <span className="text-stone-400 block mt-1 text-[8.5px]">Audit</span>
            </div>
            <span className="text-stone-600 text-xs">➔</span>
            <div className="text-center">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[9px]">2</span>
              <span className="text-stone-400 block mt-1 text-[8.5px]">Agent</span>
            </div>
            <span className="text-stone-600 text-xs">➔</span>
            <div className="text-center">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[9px]">3</span>
              <span className="text-stone-400 block mt-1 text-[8.5px]">Offer</span>
            </div>
            <span className="text-stone-600 text-xs">➔</span>
            <div className="text-center">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center mx-auto text-[9px]">4</span>
              <span className="text-stone-400 block mt-1 text-[8.5px]">Escrow</span>
            </div>
            <span className="text-stone-600 text-xs">➔</span>
            <div className="text-center">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center mx-auto text-[9px]">7</span>
              <span className="text-emerald-400 block mt-1 text-[8.5px]">Close</span>
            </div>
          </div>
        )}

        {/* 3. ESCROW DEPOSIT SHIELD */}
        {activeDoor === 'escrow' && (
          <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">CONTINGENCY</span>
              <span className="text-white font-bold">Affirmative Written</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">APPRAISAL GAP</span>
              <span className="text-white font-bold">Renegotiation Shield</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">SCHEDULE B</span>
              <span className="text-white font-bold">ALTA Extended Title</span>
            </div>
            <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8.5px] uppercase">ESCROW ADVICE</span>
              <span className="text-[#D4AF37] font-bold">Bob Dyson Supervision</span>
            </div>
          </div>
        )}

        {/* 4. DOSSIER (PROPERTY AUDIT) SNAPSHOT */}
        {activeDoor === 'dossier' && (
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] gap-2 text-center font-mono">
            <div className="bg-black/70 p-2 sm:p-2.5 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block mb-0.5">COMPS</span>
              <span className="font-bold text-white text-xs sm:text-[13px]">{dossierData.comps?.length || 3} Verified</span>
            </div>
            <div className="bg-black/70 p-2 sm:p-2.5 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block mb-0.5">GEO RISK</span>
              <span className="font-bold text-amber-400 text-xs sm:text-[13px]">Bluff Setback</span>
            </div>
            <div className="bg-black/70 p-2 sm:p-2.5 rounded-lg border border-white/10 flex-1">
              <span className="text-[8.5px] text-stone-400 block mb-0.5">EST. VAL</span>
              <span className="font-bold text-white text-xs sm:text-[13px]">~$3.85M</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM FOOTER: SPEAKER AVATAR, TIME PROGRESS & ACTION LINK ── */}
      <div className="border-t border-white/10 pt-1.5 text-[10px] sm:text-[11px] font-sans shrink-0">
        {/* Progress bar line */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#e8c84a] to-[#D4AF37] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Speaker Identity Tag */}
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src={briefing.avatar} 
              alt={briefing.speakerName} 
              className="w-5 h-5 rounded-full object-cover border border-white/20"
            />
            <span className="text-stone-300 font-medium truncate max-w-[160px]">
              {briefing.speakerName} Briefing
            </span>
          </div>

          <button
            type="button"
            onClick={() => onPromptClick?.(briefing.promptQuery)}
            className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer text-[10px] sm:text-[11px]"
          >
            <span>Ask {isBob ? 'Bob' : 'Charlie'} →</span>
          </button>
        </div>
      </div>
    </div>
  );
}