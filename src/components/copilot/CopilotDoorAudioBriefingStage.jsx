import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Sparkles, ArrowRight, ShieldCheck, Scale, Shield, GitBranch,
  Radio, CheckCircle2, Edit3, FileText
} from 'lucide-react';
import { getDoorAudioBriefing } from './doorAudioBriefings';
import { stopAllCopilotAudio, subscribeToStopAllAudio, registerActiveMedia } from '@/lib/copilotAudioController';
import CopilotScriptRewriteModal from './CopilotScriptRewriteModal';

/**
 * CopilotDoorAudioBriefingStage
 * 
 * Standardized Voice Briefing & Visual Stage for the 5 Core Execution Doors:
 * 1. Property Audit (Charlie Simmons - Concierge / Data)
 * 2. Agent Vetting (Bob Dyson - Fiduciary Standards)
 * 3. Move Roadmap (Charlie Simmons - Process / Navigation)
 * 4. Escrow Watch (Bob Dyson - Fiduciary Protection)
 * 5. DNN News (Charlie Simmons & Bob Dyson - Market Desk)
 * 
 * User-Choice Mode:
 * - NO uninvited autoplay on door click (eliminates overlapping voices & blaring audio).
 * - User clicks "Play Briefing" when they choose to listen.
 * - Single-voice guarantee: starting any briefing terminates all other audio across the app.
 * - Never auto-repeats: stops completely when finished.
 * - Direct "Rewrite Script" access to customize the voice-over script for each door.
 */
export default function CopilotDoorAudioBriefingStage({
  activeDoor = 'dossier',
  dossierData = {},
  property = '',
  onPromptClick,
  onToggleExplode
}) {
  const [briefing, setBriefing] = useState(() => getDoorAudioBriefing(activeDoor));
  const isBob = briefing.speaker === 'bob';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRewriteModalOpen, setIsRewriteModalOpen] = useState(false);

  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const durationRef = useRef(15);
  const audioPlayerRef = useRef(null);

  // Reload briefing if activeDoor changes or scripts are updated
  useEffect(() => {
    setBriefing(getDoorAudioBriefing(activeDoor));
  }, [activeDoor]);

  useEffect(() => {
    const handleScriptUpdated = (e) => {
      if (!e.detail?.doorId || e.detail.doorId === activeDoor) {
        setBriefing(getDoorAudioBriefing(activeDoor));
      }
    };
    window.addEventListener('dyson_door_scripts_updated', handleScriptUpdated);
    return () => window.removeEventListener('dyson_door_scripts_updated', handleScriptUpdated);
  }, [activeDoor]);

  // Stop all audio on door change and reset state — NO AUTOPLAY
  useEffect(() => {
    stopAllCopilotAudio();
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (_) {}
    }
    setIsPlaying(false);
    setHasEnded(false);
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    return () => {
      stopAllCopilotAudio();
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.currentTime = 0;
        } catch (_) {}
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeDoor]);

  // Global listener: if another audio source fires, reset our playing state
  useEffect(() => {
    return subscribeToStopAllAudio(() => {
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.currentTime = 0;
        } catch (_) {}
      }
      setIsPlaying(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    });
  }, []);

  const stopPlayback = () => {
    stopAllCopilotAudio();
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (_) {}
    }
    setIsPlaying(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const fallbackSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToSpeak = briefing.spokenText || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Fiduciary cadence: Bob = measured, steady broker 0.95x; Charlie = articulate concierge 1.0x
      utterance.rate = isBob ? 0.95 : 1.0;
      utterance.pitch = isBob ? 0.88 : 1.02;
      utterance.volume = isMuted ? 0 : 0.65; // Soft comfortable volume

      // STRICT MALE VOICE SELECTION — Absolutely reject any female system voice
      const selectMaleVoice = () => {
        const voices = window.speechSynthesis.getVoices() || [];
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        const isFemale = (name) => /female|woman|samantha|victoria|karen|susan|zira|cynthia|jenny|aria|ava|emma|allison|fiona|moira|tessa|veena|helena|catherine|serena/i.test(name);
        const maleVoices = englishVoices.filter(v => !isFemale(v.name));

        if (isBob) {
          const deepMale = maleVoices.find(v => /david|george|daniel|guy|oliver|tom|james|en-us-standard-b|en-us-standard-d|en-us-standard-j|male/i.test(v.name));
          if (deepMale) return deepMale;
          if (maleVoices.length > 0) return maleVoices[0];
        } else {
          const crispMale = maleVoices.find(v => /alex|daniel|aaron|arthur|ryan|fred|google uk english male|en-gb/i.test(v.name));
          if (crispMale) return crispMale;
          if (maleVoices.length > 0) return maleVoices[0];
        }
        return null;
      };

      const matchedMale = selectMaleVoice();
      if (matchedMale) {
        utterance.voice = matchedMale;
      } else {
        // If voices aren't loaded yet, attach one-shot handler to ensure male voice is used
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            const v = selectMaleVoice();
            if (v) utterance.voice = v;
          };
        }
      }

      const wordCount = (textToSpeak.trim().match(/\S+/g) || []).length;
      const estimatedSecs = Math.max(8, Math.round(wordCount / (isBob ? 2.2 : 2.5)));
      durationRef.current = estimatedSecs;
      startTimeRef.current = Date.now();

      utterance.onstart = () => {
        setIsPlaying(true);
        setHasEnded(false);
        setProgress(0);

        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const p = Math.min(100, (elapsed / durationRef.current) * 100);
          setProgress(p);
          if (p >= 100) {
            clearInterval(progressIntervalRef.current);
          }
        }, 150);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
        setProgress(100);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech playback failed:', err);
      setIsPlaying(false);
    }
  };

  const startPlayback = () => {
    // 1. Immediately terminate all existing audio/video/speech across the page
    stopAllCopilotAudio();

    // 2. If pre-rendered audio asset is available and script has not been altered, play regenerated audio asset
    if (briefing.audioUrl && !briefing.isCustomized) {
      try {
        let audio = audioPlayerRef.current;
        if (!audio) {
          audio = new Audio();
          audioPlayerRef.current = audio;
        } else {
          audio.pause();
        }

        registerActiveMedia(audio);
        audio.src = briefing.audioUrl;
        audio.currentTime = 0;

        // Calmer, deliberate pace & comfortable volume:
        // Bob Dyson: measured 0.95x-0.96x rate; Charlie: 1.0x; comfortable 0.70 volume
        const targetRate = isBob ? 0.95 : 1.0;
        audio.playbackRate = targetRate;
        audio.defaultPlaybackRate = targetRate;
        audio.volume = isMuted ? 0 : 0.70;

        audio.onplay = () => {
          audio.playbackRate = targetRate;
          setIsPlaying(true);
          setHasEnded(false);
          setProgress(0);
        };

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            const p = Math.min(100, (audio.currentTime / audio.duration) * 100);
            setProgress(p);
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          setHasEnded(true);
          setProgress(100);
          // Never loop or auto-repeat: stops completely
        };

        audio.onerror = (e) => {
          console.warn('Door audio asset error, using synthesis fallback:', e);
          fallbackSpeechSynthesis();
        };

        audio.play().catch((e) => {
          console.warn('Audio play failed, using synthesis fallback:', e);
          fallbackSpeechSynthesis();
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
        fallbackSpeechSynthesis();
        return;
      }
    }

    // Otherwise use custom script synthesis
    fallbackSpeechSynthesis();
  };

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    setIsMuted(prev => {
      const next = !prev;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = next;
        audioPlayerRef.current.volume = next ? 0 : 0.70;
      }
      return next;
    });
  };

  const handleReplay = (e) => {
    e?.stopPropagation();
    setHasEnded(false);
    setProgress(0);
    startPlayback();
  };

  const DoorIcon = activeDoor === 'vetting' ? Shield
    : activeDoor === 'roadmap' ? GitBranch
    : activeDoor === 'escrow' ? ShieldCheck
    : activeDoor === 'news' ? Radio
    : Scale;

  const wordCount = (briefing.spokenText?.trim().match(/\S+/g) || []).length;
  const estimatedSeconds = Math.round(wordCount / (isBob ? 2.2 : 2.5));

  return (
    <>
      <div 
        className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#16140f] via-[#101010] to-[#080808] transition-all group select-none"
        style={{ aspectRatio: '16/9' }}
        title={`${briefing.doorName} Voice Briefing`}
      >
        {/* ── TOP HEADER ROW: DOOR IDENTITY, SPEAKER BADGE & CONTROLS ── */}
        <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-mono border-b border-white/10 pb-1.5 shrink-0 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <DoorIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px] truncate">
              {briefing.doorName}
            </span>
          </div>

          {/* Media Controls Group: Rewrite Script, Play/Pause, Mute */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Rewrite Script Button with inlined custom indicator */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stopPlayback();
                setIsRewriteModalOpen(true);
              }}
              className={`px-2 py-1 rounded-md border transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-medium ${
                briefing.isCustomized
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/25'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border-white/10'
              }`}
              title="Inspect or rewrite the spoken script for this door"
            >
              <Edit3 className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>{briefing.isCustomized ? 'Custom Script' : 'Rewrite Script'}</span>
            </button>

            {/* Subtle Audio Waveform Indicator */}
            <div className="flex items-end gap-0.5 h-3 px-1 shrink-0" title={isPlaying ? "Audio Briefing Active" : "Audio Paused"}>
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-30'}`} />
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1 opacity-30'}`} />
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-100 ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1 opacity-30'}`} />
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-2.5 animate-pulse delay-100' : 'h-1 opacity-30'}`} />
            </div>

            {/* Explicit Text-Labeled Play / Stop Button (Defaults Silent, Never Autoplay) */}
            <button
              type="button"
              onClick={togglePlay}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 font-bold text-[9px] tracking-wider shadow-sm ${
                isPlaying
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/50'
                  : 'bg-[#D4AF37] hover:bg-[#e8c84a] text-black'
              }`}
              title={isPlaying ? "Stop audio briefing" : "Tap to listen to voice briefing"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Tap to Listen</span>
                </>
              )}
            </button>

            {/* Explicit Text-Labeled Mute / Off Button (Not Icon-Only) */}
            <button
              type="button"
              onClick={toggleMute}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-medium"
              title={isMuted ? "Unmute audio briefing" : "Mute / Turn off audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-2.5 h-2.5 text-rose-400" />
                  <span className="text-rose-400 font-semibold">Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-2.5 h-2.5 text-stone-300" />
                  <span>Mute</span>
                </>
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

          {/* 5. DNN NEWS SNAPSHOT */}
          {(activeDoor === 'news' || activeDoor === 'dnn') && (
            <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">BROADCAST</span>
                <span className="text-white font-bold">Charlie &amp; Bob Desk</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">INVENTORY</span>
                <span className="text-white font-bold">Constrained Coastal</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">RATE TRACK</span>
                <span className="text-white font-bold">Jumbo Spread 6.45%</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">FREQUENCY</span>
                <span className="text-[#D4AF37] font-bold">Daily 8:00 AM PT</span>
              </div>
            </div>
          )}

          {/* 6. SOLUTIONS VAULT SNAPSHOT */}
          {activeDoor === 'solutions' && (
            <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">PLAYBOOKS</span>
                <span className="text-white font-bold">12 Fiduciary Models</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">PROP 19</span>
                <span className="text-white font-bold">Tax Base Portability</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">APPRAISALS</span>
                <span className="text-white font-bold">Gap Structuring</span>
              </div>
              <div className="bg-black/60 p-1.5 sm:p-2 rounded-lg border border-white/10">
                <span className="text-stone-400 block font-mono text-[8.5px] uppercase">SUPERVISION</span>
                <span className="text-[#D4AF37] font-bold">Bob Dyson Advisory</span>
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
              <span>Ask {isBob ? 'Bob' : briefing.speaker === 'charlie_bob' ? 'Charlie & Bob' : 'Charlie'} →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Rewrite Modal */}
      <CopilotScriptRewriteModal
        isOpen={isRewriteModalOpen}
        initialDoor={activeDoor}
        onClose={() => setIsRewriteModalOpen(false)}
      />
    </>
  );
}