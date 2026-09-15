import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, X, Mic, MicOff, 
  Square, AlertCircle, RefreshCw, Briefcase, Sparkles 
} from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { CHARLIE_COPILOT_LIVE_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';

export const BOB_HEADSHOT = 'https://files2.heygen.ai/talking_photo/31b79a86784e495090472af2e7b9407c/5c0bde249fe348bb8b9dfb07299f608c.WEBP?Expires=1789606882&Signature=YUNW1j0tU8LsI1vb0JnPSMwCFFhUwdI2U1MoECnlYvthEhenxAfg-ws0S6jibQKfxBhXSRobys8qEkDXU-WvfEi4rH1Sej4yZCwxgjlxPNNv9XjJgaTpZDeeMYzQC8A5cLTT3-l~u5Jy~zeoIlaRFJGM2yu4vTRxo2Ul0fPWg4dK-10LrLqrsFrxEITI1uvRsyfP5ysTm1J7HaW9pCVY~1~1z2HB1zmNuMsVYcCowXhZWfyyOAsPySSciYJfIkFN6Xw16C~n7mK1B5twxKAPjW-yV0Cq8H~wCvqAUr9BbBZpTut1jy1kHtWCEmRiju1M-sQOb4ymWXlvLHxP71xlpA__&Key-Pair-Id=K38HBHX5LX3X2H';
export const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';

const MAX_SESSION_SECONDS = 300;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * CopilotDynamicSpeakerBox
 * 
 * An animated speaker box for Bob Dyson or Charlie Simmons.
 * - Resting state: compact circular avatar with name and title.
 * - Active state: automatically enlarges 2.5x to 3x while speaking or playing an explainer video,
 *   then smoothly glides back to resting size upon video completion or voice session end.
 */
export default function CopilotDynamicSpeakerBox({
  speaker = 'charlie', // 'bob' | 'charlie'
  activeExplainer = null,
  onClearExplainer,
  onTriggerExplainer,
  onVoiceTranscript,
  variant = 'card', // 'card' (Page 3) | 'rail' (Team Sidebar Rail)
  isSpeakingOverride = false,
  className = '',
}) {
  const isBob = speaker === 'bob';
  const headshot = isBob ? BOB_HEADSHOT : CHARLIE_HEADSHOT;
  const name = isBob ? 'Bob Dyson' : 'Charlie Simmons';
  const title = isBob ? 'Principal & Fiduciary' : 'Concierge';
  const subtitle = isBob ? 'Principal Broker' : 'The Voice of CoPilot';

  // Video State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);

  // Gemini Live Duplex Voice State (Charlie only)
  const [voiceStatus, setVoiceStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [voiceSpeaker, setVoiceSpeaker] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [micPermissionState, setMicPermissionState] = useState('idle');

  const geminiClientRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const wasLiveBeforeExplainer = useRef(false);

  // Check if THIS speaker is currently speaking or has an active video explainer
  const isThisExplainerActive = Boolean(
    activeExplainer?.videoUrl && 
    (activeExplainer.speaker === speaker || (!activeExplainer.speaker && !isBob))
  );

  const isLiveVoiceActive = !isBob && (voiceStatus === 'connecting' || voiceStatus === 'listening' || voiceStatus === 'speaking');
  
  // Total enlarged state
  const isEnlarged = isThisExplainerActive || isLiveVoiceActive || isSpeakingOverride;

  // Handle active video explainer playback
  useEffect(() => {
    if (isThisExplainerActive) {
      if (geminiClientRef.current && isLiveVoiceActive) {
        wasLiveBeforeExplainer.current = true;
        geminiClientRef.current.pause();
      }
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = isBob ? 1.15 : 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isThisExplainerActive, isBob]);

  // Teardown
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (geminiClientRef.current) {
        geminiClientRef.current.stop();
        geminiClientRef.current = null;
      }
    };
  }, []);

  // Live session timer
  useEffect(() => {
    if (isLiveVoiceActive && !isThisExplainerActive) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setSessionSeconds((prev) => {
            const next = prev + 1;
            if (next >= MAX_SESSION_SECONDS) {
              endVoiceSession('Session soft cap reached (5 min).');
              return MAX_SESSION_SECONDS;
            }
            return next;
          });
        }, 1000);
      }
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isLiveVoiceActive, isThisExplainerActive]);

  const handleFinishExplainer = () => {
    if (onClearExplainer) {
      onClearExplainer();
    }
    if (wasLiveBeforeExplainer.current && geminiClientRef.current) {
      geminiClientRef.current.resume();
      wasLiveBeforeExplainer.current = false;
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isVideoMuted;
    setIsVideoMuted(!isVideoMuted);
  };

  // Live Duplex Voice Controls (Charlie)
  const startVoiceSession = async () => {
    if (isBob) return;
    setVoiceError(null);
    setMicPermissionState('requesting');

    if (activeExplainer && onClearExplainer) onClearExplainer();
    if (geminiClientRef.current) {
      geminiClientRef.current.stop();
      geminiClientRef.current = null;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setMicPermissionState('denied');
      setVoiceError('Microphone not supported on this browser.');
      return;
    }

    try {
      setVoiceStatus('connecting');
      setSessionSeconds(0);
      setIsMicMuted(false);

      const client = new GeminiLiveSessionClient({
        systemPrompt: CHARLIE_COPILOT_LIVE_PROMPT,
        voice: CHARLIE_VOICE_NAME,
        onStatusChange: (status) => {
          setVoiceStatus(status);
          if (status === 'listening' || status === 'speaking') {
            setMicPermissionState('granted');
          }
        },
        onTranscript: (t) => {
          if (onVoiceTranscript) onVoiceTranscript(t);
        },
        onSpeaker: (spk) => setVoiceSpeaker(spk),
        onError: (err) => {
          setVoiceError(err);
          setVoiceStatus('error');
        },
      });

      geminiClientRef.current = client;
      await client.start();
      setMicPermissionState('granted');
    } catch (e) {
      console.warn('Voice session initiation error:', e);
      if (e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError') {
        setMicPermissionState('denied');
        setVoiceError('Microphone blocked. Please grant mic permission in your browser.');
      } else {
        setVoiceError(e?.message || 'Failed to start Gemini Live voice session.');
      }
      setVoiceStatus('error');
      if (geminiClientRef.current) {
        geminiClientRef.current.stop();
        geminiClientRef.current = null;
      }
    }
  };

  const endVoiceSession = (reason = null) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (geminiClientRef.current) {
      geminiClientRef.current.stop();
      geminiClientRef.current = null;
    }
    setVoiceStatus('ready');
    setVoiceSpeaker(null);
    setIsMicMuted(false);
    wasLiveBeforeExplainer.current = false;
    if (reason) setVoiceError(reason);
  };

  const toggleMicMute = () => {
    if (!geminiClientRef.current) return;
    if (isMicMuted) {
      geminiClientRef.current.unmute();
      setIsMicMuted(false);
    } else {
      geminiClientRef.current.mute();
      setIsMicMuted(true);
    }
  };

  // ── 1. ACTIVE VIDEO EXPLAINER (Double/Triple Enlarge with Pop-out) ──
  if (isThisExplainerActive) {
    return (
      <div 
        className={`relative z-40 transition-all duration-300 ease-out ${
          variant === 'rail' 
            ? 'w-[230px] sm:w-[250px] -ml-2 -mr-32 my-1' 
            : 'w-full sm:w-[270px] lg:w-[280px]'
        } ${className}`}
      >
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(0,0,0,0.95)] bg-black animate-in fade-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="px-2.5 py-1.5 bg-[#121212] border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full ${isBob ? 'bg-[#D4AF37]' : 'bg-[#10b981]'} animate-pulse shrink-0`} />
              <span className="font-bold text-white text-[10.5px] truncate">
                {activeExplainer.speakerName || name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleFinishExplainer}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close and return"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={activeExplainer.videoUrl}
              autoPlay
              playsInline
              controls={false}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.playbackRate = isBob ? 1.15 : 1.0;
                }
              }}
              onPlay={() => {
                if (videoRef.current) {
                  videoRef.current.playbackRate = isBob ? 1.15 : 1.0;
                }
              }}
              onEnded={handleFinishExplainer}
              className="w-full h-full object-cover"
            />

            {/* Quick Overlay Controls */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs text-white">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleVideoPlay}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={toggleVideoMute}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                  aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                >
                  {isVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinishExplainer}
                className="text-[9.5px] text-[#D4AF37] hover:underline font-semibold cursor-pointer shrink-0"
              >
                Done →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. CHARLIE LIVE VOICE ACTIVE (Enlarged Duplex Station) ──
  if (isLiveVoiceActive) {
    const isSpeaking = voiceStatus === 'speaking';
    const isConnecting = voiceStatus === 'connecting';
    const isListening = voiceStatus === 'listening';

    return (
      <div 
        className={`relative z-40 transition-all duration-300 ease-out ${
          variant === 'rail' 
            ? 'w-[220px] sm:w-[240px] -ml-2 -mr-28 my-1' 
            : 'w-full sm:w-[260px] lg:w-[270px]'
        } ${className}`}
      >
        <div className="w-full rounded-xl bg-[#0c0c0c] border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(212,175,55,0.3)] p-2.5 flex flex-col items-center text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Live Timer */}
          <div className="w-full flex items-center justify-between text-[10px] px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
              <span className="text-[#D4AF37] font-bold tracking-wider uppercase text-[9.5px]">
                {isConnecting ? 'CONNECTING...' : isSpeaking ? 'CHARLIE SPEAKING' : 'CHARLIE LISTENING'}
              </span>
            </div>
            <span className="text-stone-400 font-semibold">
              {formatTime(sessionSeconds)} <span className="text-stone-600">/ 05:00</span>
            </span>
          </div>

          {/* Animated Circle */}
          <div className="relative shrink-0 pt-0.5">
            <div 
              className={`w-14 h-14 aspect-square rounded-full p-0.5 overflow-hidden bg-black shadow-lg transition-all ${
                isSpeaking 
                  ? 'border-2 border-[#D4AF37] ring-3 ring-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.7)] scale-105'
                  : isListening 
                  ? 'border-2 border-[#10b981] ring-2 ring-[#10b981]/40'
                  : 'border-2 border-amber-500/70'
              }`}
            >
              <img src={CHARLIE_HEADSHOT} alt="Charlie Simmons" className="w-full h-full object-cover scale-105 rounded-full" />
            </div>

            {/* Audio Wave Indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-black/90 border border-white/20 text-[8px] font-mono text-white flex items-center gap-0.5 shadow-md whitespace-nowrap">
              {isSpeaking ? (
                <span className="flex items-center gap-0.5 text-[#D4AF37]">
                  <span className="w-0.5 h-1.5 bg-[#D4AF37] animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-[#D4AF37] animate-pulse delay-75" />
                  <span className="w-0.5 h-1 bg-[#D4AF37] animate-pulse delay-150" />
                  <span className="text-[8px] font-bold ml-0.5">Voice</span>
                </span>
              ) : isListening ? (
                <span className="flex items-center gap-0.5 text-[#10b981]">
                  <Mic className="w-2 h-2" />
                  <span className="text-[8px] font-bold">Barge-in</span>
                </span>
              ) : (
                <span className="text-amber-400 text-[8px]">Connecting</span>
              )}
            </div>
          </div>

          {/* Identity & Status */}
          <div className="space-y-0.5 w-full pt-0.5">
            <h3 className="text-[11.5px] font-bold text-white tracking-wide leading-tight">
              Charlie Simmons
            </h3>
            <p className="text-[9px] text-stone-300 font-medium truncate leading-tight">
              {isConnecting ? 'Waking native audio...' : isSpeaking ? 'Speaking · Interrupt anytime' : 'Listening · Speak out loud'}
            </p>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-2 gap-1 pt-0.5">
            <button
              type="button"
              onClick={toggleMicMute}
              className={`py-1 px-1 rounded-md border text-[10px] font-semibold flex items-center justify-center gap-0.5 transition-all cursor-pointer shadow-sm ${
                isMicMuted ? 'bg-amber-950/70 border-amber-500/60 text-amber-300' : 'bg-white/5 hover:bg-white/10 border-white/15 text-stone-200'
              }`}
            >
              {isMicMuted ? <MicOff className="w-2.5 h-2.5 text-amber-400" /> : <Mic className="w-2.5 h-2.5 text-[#10b981]" />}
              <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={() => endVoiceSession()}
              className="py-1 px-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-[10px] font-bold flex items-center justify-center gap-0.5 transition-all cursor-pointer shadow-md"
            >
              <Square className="w-2.5 h-2.5 fill-current text-red-400" />
              <span>End</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2B. ACTIVE SPEAKING OVERRIDE (For 3-Way Demo Turn-Taking) ──
  if (isSpeakingOverride) {
    return (
      <div 
        className={`relative z-40 transition-all duration-300 ease-out ${
          variant === 'rail' 
            ? 'w-[220px] sm:w-[240px] -ml-2 -mr-28 my-1' 
            : 'w-full sm:w-[240px]'
        } ${className}`}
      >
        <div className={`w-full rounded-xl bg-[#0c0c0c] border-2 ${
          isBob ? 'border-[#D4AF37] shadow-[0_12px_40px_rgba(212,175,55,0.4)]' : 'border-emerald-500 shadow-[0_12px_40px_rgba(16,185,129,0.3)]'
        } p-2.5 flex flex-col items-center text-center space-y-2 animate-in fade-in zoom-in-95 duration-200`}>
          <div className="w-full flex items-center justify-between text-[10px] px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBob ? 'bg-[#D4AF37]' : 'bg-emerald-400'} animate-ping`} />
              <span className={`${isBob ? 'text-[#D4AF37]' : 'text-emerald-400'} font-bold tracking-wider uppercase text-[9.5px]`}>
                {isBob ? 'BOB DYSON SPEAKING' : 'CHARLIE SIMMONS SPEAKING'}
              </span>
            </div>
            <span className="text-stone-400 font-semibold text-[9px] uppercase font-mono">
              {isBob ? 'BROKER' : 'AI VOICE'}
            </span>
          </div>

          <div className="relative shrink-0 pt-0.5">
            <div className={`w-14 h-14 aspect-square rounded-full border-2 ${
              isBob ? 'border-[#D4AF37] ring-3 ring-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.7)]' : 'border-emerald-400 ring-3 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
            } p-0.5 overflow-hidden bg-black scale-105 transition-all`}>
              <img src={headshot} alt={name} className="w-full h-full object-cover scale-105 rounded-full" />
            </div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-black/90 border border-white/20 text-[8px] font-mono text-white flex items-center gap-1 shadow-md whitespace-nowrap">
              <Sparkles className={`w-2 h-2 ${isBob ? 'text-[#D4AF37]' : 'text-emerald-400'} animate-spin`} />
              <span className={isBob ? 'text-[#D4AF37]' : 'text-emerald-400'}>Answering Live</span>
            </div>
          </div>

          <div className="space-y-0.5 w-full pt-0.5">
            <h3 className="text-[11.5px] font-bold text-white tracking-wide leading-tight">
              {name}
            </h3>
            <p className="text-[9px] text-stone-300 font-medium truncate leading-tight">
              {title} · {subtitle}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. RESTING COMPACT STATE (Standard Size) ──
  if (variant === 'rail') {
    return (
      <div 
        className={`w-full flex flex-col items-center text-center space-y-1 transition-all duration-300 group cursor-pointer ${className}`}
        onClick={() => {
          if (isBob && onTriggerExplainer) {
            onTriggerExplainer("Bob's Take: Escrow & Deal Traps");
          } else if (!isBob) {
            startVoiceSession();
          }
        }}
        title={isBob ? "Tap to hear Bob's fiduciary take" : "Tap to talk with Charlie"}
      >
        {/* Avatar Photo */}
        <div className="relative">
          <div className={`w-10 h-10 aspect-square rounded-full overflow-hidden border ${
            isBob ? 'border-[#D4AF37]/80 group-hover:border-[#D4AF37]' : 'border-emerald-500/80 group-hover:border-emerald-400'
          } bg-black shadow-md shrink-0 transition-transform group-hover:scale-105`}>
            <img 
              src={headshot} 
              alt={name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <span 
            className={`w-2 h-2 rounded-full absolute bottom-0 right-0 ring-1.5 ring-[#0c0c0c] shadow ${
              isBob ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'
            }`} 
          />
        </div>

        {/* Text Details */}
        <div className="w-full space-y-0.5">
          <h4 className="text-[10px] font-bold text-white tracking-wide truncate leading-tight group-hover:text-[#D4AF37] transition-colors">
            {name}
          </h4>
          <span className="text-[7.5px] text-stone-300 font-medium block leading-tight">
            {title}
          </span>
          <span className={`text-[6.5px] block leading-none font-mono ${
            isBob ? 'text-[#D4AF37]/90' : 'text-[#D4AF37] font-serif italic'
          }`}>
            {subtitle}
          </span>
        </div>
      </div>
    );
  }

  // ── 4. RESTING COMPACT CARD (For Page 3 Side-by-Side Upper Left - 10% reduced size) ──
  return (
    <div 
      className={`w-full rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[0_6px_20px_rgba(0,0,0,0.8)] p-2 flex flex-col items-center text-center space-y-1 transition-all duration-300 shrink-0 relative group min-h-[158px] justify-between ${className}`}
    >
      {/* Circle Photo */}
      <div className="relative shrink-0 pt-0.5">
        <div className={`w-11 h-11 aspect-square rounded-full border-2 ${
          isBob ? 'border-[#D4AF37]' : 'border-emerald-500'
        } p-0.5 overflow-hidden bg-black shadow-md ring-1.5 ring-white/10 group-hover:scale-105 transition-transform`}>
          <img 
            src={headshot} 
            alt={name} 
            className="w-full h-full object-cover object-center scale-105 rounded-full"
          />
        </div>
        <span 
          className={`w-2 h-2 rounded-full absolute bottom-0 right-0 ring-1.5 ring-[#0c0c0c] shadow-sm ${
            isBob ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'
          }`} 
        />
      </div>

      {/* Name + Title + Subtitle (All Pure White, Line 3 Enlarged) */}
      <div className="space-y-0.5 w-full">
        <h4 className="text-[10.5px] font-bold text-white tracking-wide leading-tight truncate">
          {name}
        </h4>
        <p className="text-[8.5px] text-white font-medium leading-tight truncate">
          {title}
        </p>
        <span className="text-[9px] block leading-tight text-white font-medium truncate">
          {subtitle}
        </span>
      </div>

      {/* Action Button (All Pure White Text & Icons) */}
      <div className="w-full pt-0.5">
        {isBob ? (
          <button
            type="button"
            onClick={() => {
              if (onTriggerExplainer) onTriggerExplainer("Bob's Take: Escrow & Deal Traps");
            }}
            className="w-full py-1 px-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white text-white text-[9px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm group-hover:bg-white/10"
            title="Hear Bob Dyson's solutions take"
          >
            <Briefcase className="w-2.5 h-2.5 text-white" />
            <span className="text-white">Bob's Take</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startVoiceSession}
            disabled={micPermissionState === 'requesting'}
            className="w-full py-1 px-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white text-white text-[9px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm group-hover:bg-white/10 disabled:opacity-50"
            title="Start live 2-way Gemini voice conversation"
          >
            {micPermissionState === 'requesting' ? (
              <>
                <RefreshCw className="w-2.5 h-2.5 text-white animate-spin" />
                <span className="text-white">Checking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-2.5 h-2.5 text-white" />
                <span className="text-white">Talk Live</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}