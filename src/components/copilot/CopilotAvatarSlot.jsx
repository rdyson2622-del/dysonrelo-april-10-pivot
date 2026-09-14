import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Mic, Radio, Square, Sparkles, CheckCircle2 } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

export const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';
export const CHARLIE_DESK_LOOP = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';
export const BOB_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png';

/**
 * CopilotAvatarSlot
 * 
 * Persistent Avatar Slot for Pages 2 & 3 (Chat column only).
 * - Default face: Charlie (circle / talking-head look with gold trim)
 * - Idle state: still portrait with subtle pulse / online dot
 * - Active state: plays canned explainer MP4 in-place when a mapped prompt pill is clicked
 * - Bob-in-the-box: appears ONLY for Bob's solutions take / Bob's explainer moments
 * - When video finishes, automatically returns to idle Charlie
 * - Live voice (additive): supports Gemini Live spoken V2V in the same slot
 */
export default function CopilotAvatarSlot({
  activeExplainer = null,
  onClearExplainer,
  onVoiceTranscript,
  size = 'normal', // 'normal' (Page 2) or 'compact' (Page 3)
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [voiceSpeaker, setVoiceSpeaker] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const videoRef = useRef(null);
  const geminiClientRef = useRef(null);

  // Auto-play when activeExplainer changes
  useEffect(() => {
    if (activeExplainer?.videoUrl && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeExplainer]);

  // Clean up voice client on unmount
  useEffect(() => {
    return () => {
      if (geminiClientRef.current) {
        geminiClientRef.current.stop();
        geminiClientRef.current = null;
      }
    };
  }, []);

  const handleVideoEnded = () => {
    if (onClearExplainer) {
      onClearExplainer();
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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Live voice integration
  const startVoice = async () => {
    // If a video is playing, dismiss it first
    if (activeExplainer && onClearExplainer) {
      onClearExplainer();
    }
    setVoiceError(null);
    if (geminiClientRef.current) {
      geminiClientRef.current.stop();
    }

    try {
      const client = new GeminiLiveSessionClient({
        onStatusChange: (status) => setVoiceStatus(status),
        onTranscript: (t) => onVoiceTranscript && onVoiceTranscript(t),
        onSpeaker: (spk) => setVoiceSpeaker(spk),
        onError: (err) => setVoiceError(err),
      });
      geminiClientRef.current = client;
      await client.start();
    } catch (e) {
      setVoiceError('Voice connection failed. Tap to retry.');
      setVoiceStatus('ready');
    }
  };

  const endVoice = () => {
    if (geminiClientRef.current) {
      geminiClientRef.current.stop();
      geminiClientRef.current = null;
    }
    setVoiceStatus('ready');
    setVoiceSpeaker(null);
  };

  const isVoiceActive = voiceStatus === 'listening' || voiceStatus === 'speaking' || voiceStatus === 'connecting';

  // ── RENDER: EXPLAINER VIDEO ACTIVE (Charlie or Bob) ──
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
            onClick={onClearExplainer}
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
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />

          {/* Quick Overlay Controls */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs text-white">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
            </div>

            <button
              type="button"
              onClick={onClearExplainer}
              className="text-[9.5px] text-[#D4AF37] hover:underline font-semibold cursor-pointer shrink-0"
            >
              Done →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: LIVE VOICE ACTIVE (GEMINI LIVE) ──
  if (isVoiceActive) {
    return (
      <div 
        className={`w-full rounded-2xl p-4 bg-[#111111] border border-[#D4AF37]/60 shadow-xl flex items-center justify-between gap-4 select-none ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden bg-black shadow-lg">
              <img 
                src={CHARLIE_HEADSHOT} 
                alt="Charlie" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="w-3 h-3 rounded-full bg-[#10b981] absolute bottom-0 right-0 ring-2 ring-black animate-ping" />
            <span className="w-3 h-3 rounded-full bg-[#10b981] absolute bottom-0 right-0 ring-2 ring-black" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Charlie Simmons</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#10b981]/20 text-[#10b981] font-bold">
                {voiceStatus === 'speaking' ? 'Speaking' : voiceStatus === 'listening' ? 'Listening' : 'Connecting'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300 truncate">
              {voiceStatus === 'speaking' ? 'Charlie is answering...' : 'Speak out loud now — interruptible'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={endVoice}
          className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>End</span>
        </button>
      </div>
    );
  }

  // ── RENDER: DEFAULT IDLE CHARLIE AVATAR SLOT ──
  const isCompact = size === 'compact';
  const isVertical = size === 'vertical';

  // Vertical rectangular card (Page 2 upper-right slot, reduced by 20%)
  if (isVertical) {
    return (
      <div 
        className={`w-full rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(0,0,0,0.9)] p-2.5 flex flex-col items-center text-center space-y-1.5 transition-all relative ${className}`}
      >
        {/* Charlie prominent portrait with gold trim (reduced 20%) */}
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

        {/* "The Face of CoPilot" in logo style */}
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

        {/* Talk Live Button */}
        <div className="w-full pt-0.5">
          <button
            type="button"
            onClick={startVoice}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md group"
            title="Start live 2-way voice conversation"
          >
            <Mic className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Talk Live</span>
          </button>
        </div>
      </div>
    );
  }

  // Horizontal card (compact or standard)
  return (
    <div 
      className={`rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/40 shadow-lg ${
        isCompact ? 'p-3 flex items-center justify-between' : 'p-4 flex flex-col sm:flex-row items-center justify-between gap-4'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Charlie circle with gold ring */}
        <div className="relative shrink-0">
          <div className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden bg-black shadow-md`}>
            <img 
              src={CHARLIE_HEADSHOT} 
              alt="Charlie — Copilot AI Concierge" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-black" />
        </div>

        {/* Identity & Status */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-tight">
              Charlie Simmons
            </h3>
            <div className="inline-flex items-baseline gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/30">
              <span className="text-[10px] text-white/90 font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                The Face of
              </span>
              <span className="text-[11px] font-serif italic text-[#D4AF37] font-medium" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                CoPilot
              </span>
            </div>
          </div>
          <p className="text-[10.5px] text-stone-400 leading-tight mt-0.5 truncate">
            Voice &amp; Market Concierge • Ready
          </p>
        </div>
      </div>

      {/* Voice Trigger Pill / Idle status */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={startVoice}
          className="px-3 py-1.5 rounded-full bg-[#181818] hover:bg-[#222222] border border-[#D4AF37]/50 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          title="Start live 2-way voice conversation"
        >
          <Mic className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Talk Live</span>
          <span className="sm:hidden">Voice</span>
        </button>
      </div>
    </div>
  );
}