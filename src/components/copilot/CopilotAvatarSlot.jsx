import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Mic, MicOff, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { CHARLIE_COPILOT_LIVE_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';

export const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';
export const CHARLIE_DESK_LOOP = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';
export const BOB_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png';

const MAX_SESSION_SECONDS = 300; // 5-minute soft cap

/**
 * Format elapsed seconds to MM:SS
 */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * CopilotAvatarSlot
 * 
 * Persistent Avatar Slot for Copilot Pages 2 & 3 (Chat column only).
 * - Default face: Charlie Simmons with gold trim and "The Face of CoPilot" branding
 * - Gemini Live Duplex Voice integration (model: gemini-2.5-flash-preview-native-audio-dialog, voice: Algieba)
 * - setupComplete before mic streaming, 16kHz PCM downsampling, native audio parts playback
 * - Server barge-in / interruptibility built-in
 * - Visible Talk/Mic toggle, End Session kill switch, and soft session timer with 5m cap
 * - Automatic pause/resume logic: when a prompt-pill MP4 explainer is triggered,
 *   live voice audio and mic stream pause to prevent double-audio, then resume upon video completion
 * - First-tap mic permission UX with clear inline permission status
 * - Page 3 dossier remains isolated text/cards only
 */
export default function CopilotAvatarSlot({
  activeExplainer = null,
  onClearExplainer,
  onVoiceTranscript,
  size = 'vertical', // 'vertical' (Page 2 & 3 chat column), 'compact', or 'normal'
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Gemini Live state
  const [voiceStatus, setVoiceStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [voiceSpeaker, setVoiceSpeaker] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [micPermissionState, setMicPermissionState] = useState('idle'); // idle, requesting, denied, granted

  const videoRef = useRef(null);
  const geminiClientRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const wasLiveBeforeExplainer = useRef(false);

  // Handle activeExplainer video transitions & pause live voice if active
  useEffect(() => {
    if (activeExplainer?.videoUrl) {
      // If a live session is running, pause live audio to prevent double-audio
      if (geminiClientRef.current && (voiceStatus === 'listening' || voiceStatus === 'speaking' || voiceStatus === 'connecting')) {
        wasLiveBeforeExplainer.current = true;
        geminiClientRef.current.pause();
      }

      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeExplainer, voiceStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (geminiClientRef.current) {
        geminiClientRef.current.stop();
        geminiClientRef.current = null;
      }
    };
  }, []);

  // Timer ticker while live voice is active
  useEffect(() => {
    const isLive = voiceStatus === 'listening' || voiceStatus === 'speaking';
    if (isLive && !activeExplainer) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setSessionSeconds((prev) => {
            const next = prev + 1;
            if (next >= MAX_SESSION_SECONDS) {
              // Gracefully end session at soft cap
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
  }, [voiceStatus, activeExplainer]);

  // Handle Explainer Video finish / close
  const handleCloseExplainer = () => {
    if (onClearExplainer) {
      onClearExplainer();
    }
    // Resume live session if it was active before the explainer
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

  // Live Duplex Voice Controls
  const startVoiceSession = async () => {
    setVoiceError(null);
    setMicPermissionState('requesting');

    // Dismiss active explainer if open
    if (activeExplainer && onClearExplainer) {
      onClearExplainer();
    }

    // Stop existing client if any
    if (geminiClientRef.current) {
      geminiClientRef.current.stop();
      geminiClientRef.current = null;
    }

    // Check microphone availability
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
        setVoiceError('Microphone access blocked. Please enable microphone permissions in your browser bar.');
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
    if (reason) {
      setVoiceError(reason);
    }
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

  const isLiveActive = voiceStatus === 'connecting' || voiceStatus === 'listening' || voiceStatus === 'speaking';

  // ── 1. RENDER: EXPLAINER VIDEO ACTIVE (Charlie or Bob) ──
  if (activeExplainer?.videoUrl) {
    const isBob = activeExplainer.speaker === 'bob';

    return (
      <div 
        className={`w-full rounded-2xl overflow-hidden border border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)] bg-black transition-all ${className}`}
      >
        {/* Header Bar inside video slot */}
        <div className="px-2.5 py-1.5 bg-[#121212] border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`w-2 h-2 rounded-full ${isBob ? 'bg-[#D4AF37]' : 'bg-[#10b981]'} animate-pulse shrink-0`} />
            <span className="font-bold text-white text-[10.5px] truncate">
              {activeExplainer.speakerName || (isBob ? 'Bob Dyson' : 'Charlie Simmons')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseExplainer}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Return to Charlie"
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
            onEnded={handleCloseExplainer}
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
              onClick={handleCloseExplainer}
              className="text-[9.5px] text-[#D4AF37] hover:underline font-semibold cursor-pointer shrink-0"
            >
              Done →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. RENDER: GEMINI LIVE DUPLEX ACTIVE (Charlie Live in Avatar Slot) ──
  if (isLiveActive) {
    const isSpeaking = voiceStatus === 'speaking';
    const isConnecting = voiceStatus === 'connecting';
    const isListening = voiceStatus === 'listening';

    return (
      <div 
        className={`w-full rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/80 shadow-[0_8px_30px_rgba(212,175,55,0.25)] p-2.5 flex flex-col items-center text-center space-y-2 transition-all relative ${className}`}
      >
        {/* Top Live Badge & Session Timer with 5m Soft Cap */}
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

        {/* Charlie Avatar with Live Pulsing Audio Ring */}
        <div className="relative shrink-0 pt-0.5">
          <div 
            className={`w-18 h-18 sm:w-19 sm:h-19 rounded-full p-0.5 overflow-hidden bg-black shadow-lg transition-all ${
              isSpeaking 
                ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.7)] scale-105'
                : isListening 
                ? 'border-2 border-[#10b981] ring-3 ring-[#10b981]/40'
                : 'border-2 border-amber-500/70'
            }`}
          >
            <img 
              src={CHARLIE_HEADSHOT} 
              alt="Charlie Simmons — Gemini Live Duplex" 
              className="w-full h-full object-cover scale-105 rounded-full"
            />
          </div>

          {/* Audio Visualizer Wave indicator */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/90 border border-white/20 text-[9px] font-mono text-white flex items-center gap-1 shadow-md whitespace-nowrap">
            {isSpeaking ? (
              <span className="flex items-center gap-0.5 text-[#D4AF37]">
                <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#D4AF37] animate-pulse delay-150" />
                <span className="text-[9px] font-bold ml-0.5">Voice</span>
              </span>
            ) : isListening ? (
              <span className="flex items-center gap-1 text-[#10b981]">
                <Mic className="w-2.5 h-2.5" />
                <span className="text-[9px] font-bold">Barge-in on</span>
              </span>
            ) : (
              <span className="text-amber-400 text-[9px]">Connecting</span>
            )}
          </div>
        </div>

        {/* Identity & Status Line */}
        <div className="space-y-0.5 w-full pt-1">
          <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
            Charlie Simmons
          </h3>
          <p className="text-[10px] text-stone-300 font-medium truncate">
            {isConnecting 
              ? 'Waking Algieba native audio...' 
              : isSpeaking 
              ? 'Speaking · Tap mic or speak to interrupt' 
              : 'Listening · Speak out loud anytime'}
          </p>
        </div>

        {/* Live Controls: Mic Mute Toggle & End Session Kill Switch */}
        <div className="w-full grid grid-cols-2 gap-1.5 pt-1">
          {/* Mic Toggle Button */}
          <button
            type="button"
            onClick={toggleMicMute}
            className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm ${
              isMicMuted
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-stone-200'
            }`}
            title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMicMuted ? <MicOff className="w-3 h-3 text-amber-400" /> : <Mic className="w-3 h-3 text-[#10b981]" />}
            <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* End Session Kill Switch */}
          <button
            type="button"
            onClick={() => endVoiceSession()}
            className="py-1.5 px-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
            title="Immediately terminate Gemini Live voice session"
          >
            <Square className="w-3 h-3 fill-current text-red-400" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    );
  }

  // ── 3. RENDER: DEFAULT IDLE CHARLIE AVATAR SLOT WITH TALK LIVE TRIGGER ──
  return (
    <div 
      className={`w-full rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(0,0,0,0.9)] p-2.5 flex flex-col items-center text-center space-y-1.5 transition-all relative ${className}`}
    >
      {/* Charlie prominent portrait with gold trim */}
      <div className="relative shrink-0 pt-0.5">
        <div className="w-18 h-18 sm:w-19 sm:h-19 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden bg-black shadow-lg ring-2 ring-[#D4AF37]/20">
          <img 
            src={CHARLIE_HEADSHOT} 
            alt="Charlie Simmons — The Face of CoPilot" 
            className="w-full h-full object-cover scale-105 rounded-full"
          />
        </div>
        {/* Online green indicator */}
        <span className="w-3 h-3 rounded-full bg-[#10b981] absolute bottom-0.5 right-0.5 ring-2 ring-[#0c0c0c] shadow-sm animate-pulse" />
      </div>

      {/* "The Face of CoPilot" in logo typography */}
      <div className="w-full">
        <div className="inline-flex items-baseline justify-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-[#D4AF37]/40 shadow-inner">
          <span 
            className="text-[10px] text-white/90 font-serif tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            The Face of
          </span>
          <span 
            className="text-xs font-serif italic text-[#D4AF37] font-semibold tracking-normal"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            CoPilot
          </span>
        </div>
      </div>

      {/* Identity & Status */}
      <div className="space-y-0.5 w-full">
        <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
          Charlie Simmons
        </h3>
        <p className="text-[10px] text-stone-300 font-medium">
          Voice &amp; Market Concierge <span className="text-[#10b981] font-semibold">• Ready</span>
        </p>
      </div>

      {/* Error or Mic Permission notice if applicable */}
      {voiceError && (
        <div className="w-full p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-[9.5px] text-red-200 flex items-start gap-1 text-left">
          <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
          <span className="flex-1">{voiceError}</span>
        </div>
      )}

      {/* Talk Live Button & Permission State */}
      <div className="w-full pt-0.5">
        <button
          type="button"
          onClick={startVoiceSession}
          disabled={micPermissionState === 'requesting'}
          className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md group disabled:opacity-50"
          title="Start live 2-way Gemini duplex voice conversation"
        >
          {micPermissionState === 'requesting' ? (
            <>
              <RefreshCw className="w-3 h-3 text-[#D4AF37] animate-spin" />
              <span>Checking Mic...</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Talk Live</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}