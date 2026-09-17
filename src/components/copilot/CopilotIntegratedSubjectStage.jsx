import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw,
  Scale, Shield, ShieldCheck, ShieldAlert, GitBranch, Radio, 
  Home, FileText, Clock, AlertTriangle, CheckCircle2, Lock, 
  Phone, Waves, Sparkles, DollarSign, UserCheck, MessageSquare, Mic
} from 'lucide-react';
import { stopAllCopilotAudio, registerActiveMedia, subscribeToStopAllAudio } from '@/lib/copilotAudioController';
import { CHARLIE_AVATAR, BOB_AVATAR } from './doorAudioBriefings';

export default function CopilotIntegratedSubjectStage({
  subject,
  dossierData = {},
  property = '',
  onPromptClick,
  onToggleExplode
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioPlayerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const durationRef = useRef(20);

  const isBob = subject.speaker === 'bob';

  // Stop audio whenever the active subject changes
  useEffect(() => {
    stopPlayback();
    setProgress(0);
    setHasEnded(false);
  }, [subject.id]);

  // Subscribe to global audio stoppage events
  useEffect(() => {
    const unsub = subscribeToStopAllAudio(() => {
      stopPlayback();
    });
    return () => {
      unsub();
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (_) {}
    }
    setIsPlaying(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    setIsMuted(prev => {
      const next = !prev;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.volume = next ? 0 : 0.70;
      }
      return next;
    });
  };

  const handleReplay = (e) => {
    e?.stopPropagation();
    stopPlayback();
    setProgress(0);
    startPlayback();
  };

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    stopAllCopilotAudio();

    // 1. If subject has a dedicated pre-rendered audio asset, play it
    if (subject.audioUrl) {
      try {
        let audio = audioPlayerRef.current;
        if (!audio) {
          audio = new Audio();
          audioPlayerRef.current = audio;
        } else {
          audio.pause();
        }

        registerActiveMedia(audio);
        audio.src = subject.audioUrl;
        audio.currentTime = 0;
        const targetRate = isBob ? 0.95 : 1.0;
        audio.playbackRate = targetRate;
        audio.defaultPlaybackRate = targetRate;
        audio.volume = isMuted ? 0 : 0.70;

        audio.onplay = () => {
          setIsPlaying(true);
          setHasEnded(false);
          setProgress(0);
        };

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            setProgress(Math.min(100, (audio.currentTime / audio.duration) * 100));
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          setHasEnded(true);
          setProgress(100);
        };

        audio.onerror = () => {
          fallbackSpeechSynthesis();
        };

        audio.play().catch(() => fallbackSpeechSynthesis());
        return;
      } catch (_) {
        fallbackSpeechSynthesis();
        return;
      }
    }

    fallbackSpeechSynthesis();
  };

  // 2. Fallback Speech Synthesis with STRICT MALE VOICE SELECTION for Charlie and Bob
  const fallbackSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToSpeak = subject.spokenText || subject.title || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Fiduciary cadence: Bob = measured, calm broker 0.95x; Charlie = articulate concierge 1.0x
      utterance.rate = isBob ? 0.95 : 1.0;
      utterance.pitch = isBob ? 0.88 : 1.02;
      utterance.volume = isMuted ? 0 : 0.70;

      // Filter exclusively for MALE English voices (strictly excluding all female names)
      const voices = window.speechSynthesis.getVoices() || [];
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      
      const isFemale = (name) => /female|woman|samantha|victoria|karen|susan|zira|cynthia|jenny|aria|ava|emma|allison|fiona|moira|tessa|veena/i.test(name);
      const maleVoices = englishVoices.filter(v => !isFemale(v.name));

      const selectMale = () => {
        const vList = window.speechSynthesis.getVoices() || [];
        const eng = vList.filter(v => v.lang.startsWith('en'));
        const m = eng.filter(v => !isFemale(v.name));
        if (isBob) {
          const deep = m.find(v => /david|george|daniel|guy|oliver|tom|james|en-us-standard-b|en-us-standard-d|en-us-standard-j|male/i.test(v.name));
          if (deep) return deep;
          if (m.length > 0) return m[0];
        } else {
          const crisp = m.find(v => /alex|daniel|aaron|arthur|ryan|fred|google uk english male|en-gb/i.test(v.name));
          if (crisp) return crisp;
          if (m.length > 0) return m[0];
        }
        return null;
      };

      const matchedMale = selectMale();
      if (matchedMale) {
        utterance.voice = matchedMale;
      } else if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          const v = selectMale();
          if (v) utterance.voice = v;
        };
      }

      const wordCount = (textToSpeak.trim().match(/\S+/g) || []).length;
      const estimatedSecs = Math.max(7, Math.round(wordCount / (isBob ? 2.2 : 2.5)));
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
          if (p >= 100) clearInterval(progressIntervalRef.current);
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

  const wordCount = ((subject.spokenText || '').trim().match(/\S+/g) || []).length;
  const estimatedSeconds = Math.max(6, Math.round(wordCount / (isBob ? 2.2 : 2.5)));

  // Category Icon Resolver
  const CategoryIcon = (() => {
    const cat = (subject.categoryLabel || '').toLowerCase();
    if (cat.includes('overview') || cat.includes('property')) return Home;
    if (cat.includes('partnership') || cat.includes('alliance')) return FileText;
    if (cat.includes('comp')) return Scale;
    if (cat.includes('risk') || cat.includes('soil')) return ShieldAlert;
    if (cat.includes('compliance') || cat.includes('statut')) return ShieldCheck;
    if (cat.includes('vetting') || cat.includes('agent')) return Shield;
    if (cat.includes('roadmap') || cat.includes('phase')) return GitBranch;
    if (cat.includes('escrow') || cat.includes('contingenc')) return ShieldCheck;
    if (cat.includes('tax') || cat.includes('prop 19')) return DollarSign;
    if (cat.includes('1031')) return Clock;
    if (cat.includes('news') || cat.includes('broadcast')) return Radio;
    return Sparkles;
  })();

  return (
    <div 
      className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/60 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#181510] via-[#101010] to-[#080808] transition-all group select-none"
      style={{ aspectRatio: '16/9' }}
      title={`${subject.title} · Voice & Visual Briefing`}
    >
      {/* ── TOP HEADER ROW: CATEGORY LABEL, AUDIO PLAYBACK CONTROLS ── */}
      <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-mono border-b border-white/10 pb-1.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <CategoryIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="font-bold text-white uppercase tracking-wider truncate">
            {subject.categoryLabel || 'INTELLIGENCE'}
          </span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-[9px] text-[#D4AF37] font-sans truncate hidden sm:inline">
            {subject.speakerName}
          </span>
        </div>

        {/* Media Controls Group: Waveform, Play/Stop, Mute, Replay */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Subtle Audio Waveform Indicator */}
          <div className="flex items-end gap-0.5 h-3 px-1 shrink-0" title={isPlaying ? "Audio Briefing Active" : "Audio Paused"}>
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-100 ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1 opacity-30'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${isPlaying ? 'h-2.5 animate-pulse delay-100' : 'h-1 opacity-30'}`} />
          </div>

          {/* Explicit Text-Labeled Play / Stop Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 font-bold text-[9px] tracking-wider shadow-sm ${
              isPlaying
                ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/50'
                : 'bg-[#D4AF37] hover:bg-[#e8c84a] text-black'
            }`}
            title={isPlaying ? "Stop voice briefing" : "Tap to listen to voice briefing"}
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

          {/* Explicit Text-Labeled Mute / Off Button */}
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

          {/* Replay Button */}
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

      {/* ── CENTER BODY: TAILORED VISUAL DIAGRAM / METRICS FOR THIS SUBJECT ── */}
      <div className="my-auto px-1 py-1">
        {/* 1. Audit: Property Overview */}
        {subject.visualType === 'audit_overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center font-mono">
            <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">APN</span>
              <span className="font-bold text-white text-[11px] truncate block">{subject.visualData?.apn || '351-120-04'}</span>
            </div>
            <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">LIVING AREA</span>
              <span className="font-bold text-white text-[11px]">{Number(subject.visualData?.sqft || 3400).toLocaleString()} sf</span>
            </div>
            <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">YEAR BUILT</span>
              <span className="font-bold text-white text-[11px]">{subject.visualData?.yearBuilt || 1998}</span>
            </div>
            <div className="bg-[#1c160c] p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/40">
              <span className="text-[8px] text-[#D4AF37] block uppercase">EST. VALUE</span>
              <span className="font-bold text-white text-[11px]">{subject.visualData?.listPrice || '$3.85M'}</span>
            </div>
          </div>
        )}

        {/* 2. Partnership Structure Alliance */}
        {subject.visualType === 'partnership_alliance' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-1.5 text-center">
              <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10 flex-1">
                <span className="text-[8px] text-stone-400 block font-mono">BUYER</span>
                <span className="font-bold text-white text-[10.5px]">100% Loyalty</span>
              </div>
              <span className="text-[#D4AF37] text-xs font-bold">➔</span>
              <div className="bg-black/70 p-1.5 sm:p-2 rounded-lg border border-white/10 flex-1">
                <span className="text-[8px] text-stone-400 block font-mono">LOCAL AGENT</span>
                <span className="font-bold text-white text-[10.5px]">Vetted Specialist</span>
              </div>
              <span className="text-[#D4AF37] text-xs font-bold">➔</span>
              <div className="bg-[#1c160c] p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/40 flex-1">
                <span className="text-[8px] text-[#D4AF37] block font-mono">COPILOT</span>
                <span className="font-bold text-white text-[10.5px]">Analytics &amp; Escrow</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-[9px] font-mono text-[#D4AF37] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full inline-block">
                California Referral Agreement · $0 Added Cost to Buyer
              </span>
            </div>
          </div>
        )}

        {/* 3. Honest Comps Spread */}
        {subject.visualType === 'comps_spread' && (
          <div className="space-y-1 font-mono text-[10px] sm:text-[10.5px]">
            <div className="flex items-center justify-between bg-black/60 px-2 py-1 rounded border border-white/10 text-stone-300">
              <span className="text-white font-semibold">0.35 mi · 4,100 sf</span>
              <span className="text-stone-400">Sold: $3.62M</span>
              <span className="text-white font-bold">Adj: $3.58M</span>
            </div>
            <div className="flex items-center justify-between bg-black/60 px-2 py-1 rounded border border-white/10 text-stone-300">
              <span className="text-white font-semibold">0.52 mi · 3,250 sf</span>
              <span className="text-stone-400">Sold: $3.45M</span>
              <span className="text-white font-bold">Adj: $3.50M</span>
            </div>
            <div className="flex items-center justify-between bg-black/60 px-2 py-1 rounded border border-white/10 text-stone-300">
              <span className="text-white font-semibold">0.71 mi · 3,900 sf</span>
              <span className="text-stone-400">Sold: $3.78M</span>
              <span className="text-white font-bold">Adj: $3.72M</span>
            </div>
          </div>
        )}

        {/* 4. Geotechnical & Hazard Risks */}
        {subject.visualType === 'geo_risk' && (
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">BLUFF SETBACK</span>
              <span className="font-bold text-amber-400 text-xs">25–40 Ft</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">SOIL TEST</span>
              <span className="font-bold text-white text-xs">Core Boring</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">RETREAT RULE</span>
              <span className="font-bold text-emerald-400 text-xs">75-Yr Life</span>
            </div>
          </div>
        )}

        {/* 5. Statutory Compliance & Discovery Shield */}
        {subject.visualType === 'compliance_shield' && (
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">CIV. CODE §1675</span>
              <span className="font-bold text-emerald-400 text-xs">3% EMD Cap</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">FORM RPA</span>
              <span className="font-bold text-white text-xs">48-Hr Notice</span>
            </div>
            <div className="bg-black/70 p-2 rounded-lg border border-white/10">
              <span className="text-[8px] text-stone-400 block uppercase">TITLE REVIEW</span>
              <span className="font-bold text-[#D4AF37] text-xs">Schedule B</span>
            </div>
          </div>
        )}

        {/* 6. Vetting: Agent Selection */}
        {subject.visualType === 'vetting_selection' && (
          <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">REPRESENTATION</span>
              <span className="text-white font-bold">Zero Dual Agency</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">STRUCTURE</span>
              <span className="text-white font-bold">Referral Alliance</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">ADVOCACY</span>
              <span className="text-white font-bold">100% Price Defense</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">FEE TO BUYER</span>
              <span className="text-[#D4AF37] font-bold">$0 Extra Cost</span>
            </div>
          </div>
        )}

        {/* 7. Vetting: Dual Agency Risk */}
        {subject.visualType === 'vetting_dual_agency' && (
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-1.5">
            <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-500/30 text-center flex-1">
              <span className="text-[8px] text-rose-300 block font-mono">LISTING AGENT</span>
              <span className="font-bold text-white text-[11px]">Seller Loyalty</span>
              <span className="text-[8px] text-stone-400 block mt-0.5">Dual Agency Risk</span>
            </div>
            <span className="text-stone-500 text-xs font-bold">VS</span>
            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-center flex-1">
              <span className="text-[8px] text-emerald-300 block font-mono">BUYER AGENT</span>
              <span className="font-bold text-white text-[11px]">100% Loyalty</span>
              <span className="text-[8px] text-[#D4AF37] block mt-0.5">Dedicated Advocacy</span>
            </div>
          </div>
        )}

        {/* 8. Vetting: 4 Essential Standards */}
        {subject.visualType === 'vetting_standards' && (
          <div className="grid grid-cols-2 gap-1.5 text-[9.5px] sm:text-[10px] font-mono">
            <div className="bg-black/60 p-1.5 rounded border border-white/10">
              <span className="text-[#D4AF37] font-bold block">1. Undivided Loyalty</span>
              <span className="text-stone-400 text-[8.5px]">Zero Dual Agency</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded border border-white/10">
              <span className="text-[#D4AF37] font-bold block">2. Local Sales Depth</span>
              <span className="text-stone-400 text-[8.5px]">Neighborhood Comp Track</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded border border-white/10">
              <span className="text-[#D4AF37] font-bold block">3. Contingency Diligence</span>
              <span className="text-stone-400 text-[8.5px]">Affirmative 48-hr CR</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded border border-white/10">
              <span className="text-[#D4AF37] font-bold block">4. Transparent Terms</span>
              <span className="text-stone-400 text-[8.5px]">Standard Co-op Split</span>
            </div>
          </div>
        )}

        {/* 9. Move Roadmap: Active Phase Milestone */}
        {subject.visualType === 'roadmap_phase' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] gap-1 font-mono">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isCurrent = subject.visualData?.phaseNum === num;
                return (
                  <div key={num} className="text-center flex-1">
                    <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center mx-auto text-[9px] transition-all ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-black ring-2 ring-white scale-110 shadow-md'
                        : 'bg-white/10 text-stone-300'
                    }`}>
                      {num}
                    </span>
                    <span className={`block mt-1 text-[7.5px] truncate ${isCurrent ? 'text-[#D4AF37] font-bold' : 'text-stone-400'}`}>
                      {num === 1 ? 'Audit' : num === 2 ? 'Agent' : num === 3 ? 'Offer' : num === 4 ? 'Escrow' : num === 5 ? 'Inspect' : num === 6 ? 'Appraise' : 'Close'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="bg-black/60 px-2 py-1 rounded-lg border border-white/10 flex items-center justify-between text-[9.5px]">
              <span className="text-stone-300 font-sans truncate">
                Milestone: <strong className="text-white">{subject.visualData?.title}</strong>
              </span>
              <span className="text-[#D4AF37] font-mono shrink-0 font-bold ml-2">
                {subject.visualData?.timing}
              </span>
            </div>
          </div>
        )}

        {/* 10. Escrow Guardrail */}
        {subject.visualType === 'escrow_guardrail' && (
          <div className="space-y-1.5">
            <div className="bg-black/60 p-2 rounded-lg border border-white/10 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-[8px] font-mono text-stone-400 uppercase">{subject.visualData?.statute || 'CALIFORNIA RPA'}</span>
                <h5 className="font-bold text-white text-[11px] leading-tight">{subject.visualData?.title}</h5>
              </div>
              <span className="text-emerald-400 font-bold font-mono text-[9.5px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                Fiduciary Guardrail
              </span>
            </div>
            <p className="text-[9.5px] text-stone-300 font-sans line-clamp-1 px-1">
              {subject.visualData?.desc}
            </p>
          </div>
        )}

        {/* 11. Prop 19 Tax Transfer */}
        {subject.visualType === 'prop19_tax' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] my-auto gap-2">
              <div className="bg-black/70 p-1.5 rounded-lg border border-white/10 text-center flex-1">
                <span className="text-[8px] text-stone-400 block font-mono">PRIOR BASE</span>
                <span className="font-bold text-white font-mono text-xs">$650,000</span>
              </div>
              <span className="text-[#D4AF37] text-xs font-bold">➔</span>
              <div className="bg-[#1c160c] p-1.5 rounded-lg border border-[#D4AF37]/40 text-center flex-1">
                <span className="text-[8px] text-[#D4AF37] block font-mono">NEW CA HOME</span>
                <span className="font-bold text-white font-mono text-xs">$2,850,000</span>
              </div>
              <span className="text-[#D4AF37] text-xs font-bold">➔</span>
              <div className="bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30 text-center flex-1">
                <span className="text-[8px] text-emerald-400 block font-mono">SAVINGS</span>
                <span className="font-bold text-emerald-300 font-mono text-xs">~$27K/YR</span>
              </div>
            </div>
            <span className="text-[9px] text-stone-400 font-sans block text-center">
              Transfer lower property tax base up to 3 times for homeowners 55+
            </span>
          </div>
        )}

        {/* 12. 1031 Exchange Safe Harbor */}
        {subject.visualType === '1031_exchange' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] gap-1.5">
              <div className="bg-black/70 p-1.5 rounded-lg border border-white/10 text-center flex-1">
                <span className="text-[8px] text-stone-400 block font-mono">DAY 0</span>
                <span className="font-bold text-white text-[11px]">Sale Close</span>
              </div>
              <span className="text-stone-500 text-xs">➔</span>
              <div className="bg-red-950/60 p-1.5 rounded-lg border border-red-500/40 text-center flex-1">
                <span className="text-[8px] text-red-300 block font-mono">DAY 45</span>
                <span className="font-bold text-white text-[11px]">Identify 3</span>
              </div>
              <span className="text-stone-500 text-xs">➔</span>
              <div className="bg-black/70 p-1.5 rounded-lg border border-white/10 text-center flex-1">
                <span className="text-[8px] text-stone-400 block font-mono">DAY 180</span>
                <span className="font-bold text-white text-[11px]">Purchase Close</span>
              </div>
            </div>
            <span className="text-[9px] text-amber-400 font-mono block text-center">
              Strict statutory deadlines · Zero IRS extensions allowed
            </span>
          </div>
        )}

        {/* 13. News Broadcast */}
        {subject.visualType === 'news_broadcast' && (
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">COASTAL INVENTORY</span>
              <span className="text-white font-bold text-[11px]">Constrained &amp; Resilient</span>
            </div>
            <div className="bg-black/60 p-1.5 rounded-lg border border-white/10">
              <span className="text-stone-400 block font-mono text-[8px] uppercase">RATE TRACK</span>
              <span className="text-white font-bold text-[11px]">Jumbo Spread 6.45%</span>
            </div>
          </div>
        )}

        {/* Default Fallback Card */}
        {(!subject.visualType || subject.visualType === 'custom_card') && (
          <div className="px-1 text-center space-y-1">
            <h4 className="text-xs sm:text-[13px] font-bold text-white line-clamp-1 leading-snug">
              {subject.title}
            </h4>
            <p className="text-[10px] text-stone-400 line-clamp-2 font-sans">
              {subject.subtitle || subject.spokenText}
            </p>
          </div>
        )}
      </div>

      {/* ── BOTTOM FOOTER ROW: AUDIO PROGRESS, TEASER COPY & PROMPT BUTTON ── */}
      <div className="shrink-0 space-y-1 pt-1 border-t border-white/10 font-sans">
        {/* Progress bar line during audio playback */}
        {isPlaying && (
          <div className="w-full bg-white/10 h-0.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#D4AF37] h-full transition-all duration-150" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-2 pt-0.5">
          {/* Speaker Badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <img 
              src={subject.avatar || CHARLIE_AVATAR} 
              alt={subject.speakerName} 
              className="w-4 h-4 rounded-full object-cover border border-[#D4AF37]/50 shrink-0" 
            />
            <span className="text-stone-300 font-medium truncate max-w-[170px] sm:max-w-[210px]">
              {subject.speakerName}
            </span>
          </div>

          {/* Consumer Action Button: Allows user to text or verbally respond */}
          <button
            type="button"
            onClick={() => onPromptClick?.(subject.promptQuery || subject.title)}
            className="px-2.5 py-0.5 rounded-md bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-semibold text-[10px] sm:text-[10.5px] flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            title={`Send to dialogue: "${subject.promptQuery || subject.title}"`}
          >
            <MessageSquare className="w-2.5 h-2.5 fill-current" />
            <span>{subject.buttonLabel || 'Ask →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}