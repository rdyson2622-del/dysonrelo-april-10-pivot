import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Check, ArrowRight, ShieldCheck, Sparkles, 
  Lock, Mic, Compass, Calendar, 
  Mail, Calculator, CloudSun, BookOpen, Play, Pause, 
  Users, Phone, Volume2, VolumeX, RotateCcw, Tv
} from 'lucide-react';
import { 
  MINI_APP_EXPLAINERS, 
  CHARLIE_DNN_DESK_PHOTO, 
  CHARLIE_DNN_DESK_VIDEO 
} from '@/lib/miniAppExplainers';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

const ICON_MAP = {
  Mic,
  Compass,
  Calendar,
  Mail,
  Calculator,
  CloudSun,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Play,
  Users,
  ArrowRight,
  Phone,
};

export default function MiniAppExplainerModal({
  appId,
  isOpen,
  onClose,
  onSubscribeClick,
}) {
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const explainer = MINI_APP_EXPLAINERS.find((e) => e.id === appId) || MINI_APP_EXPLAINERS[0];
  const IconComponent = ICON_MAP[explainer?.iconName] || Sparkles;

  const isVideoDesk = Boolean(explainer?.charlieVideoUrl);

  // Manage voice audio/video playback when modal opens or changes
  useEffect(() => {
    if (!isOpen || !explainer) {
      cleanupPlayback();
      return;
    }

    // Reset playback state
    setIsPlaying(false);

    // Give browser a microtask tick after modal mounts on user click gesture
    const timer = setTimeout(() => {
      startPlayback();
    }, 150);

    return () => {
      clearTimeout(timer);
      cleanupPlayback();
    };
  }, [isOpen, appId]);

  const cleanupPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
    }
  };

  const startPlayback = () => {
    if (isVideoDesk && videoRef.current) {
      const v = videoRef.current;
      v.muted = isMuted;
      v.currentTime = 0;
      v.play()
        .then(() => {
          setIsPlaying(true);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: true } }));
          }
        })
        .catch((err) => {
          console.warn('Video autoplay prevented:', err);
          setIsPlaying(false);
        });
      return;
    }

    if (explainer?.charlieAudioUrl) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(explainer.charlieAudioUrl);
        audio.preload = 'auto';
        audio.muted = isMuted;

        audio.onplay = () => {
          setIsPlaying(true);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: true } }));
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audio.onpause = () => {
          setIsPlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audio.onerror = () => {
          setIsPlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audioRef.current = audio;
        audio.play().catch((err) => {
          console.warn('Audio autoplay blocked by browser policy:', err);
          setIsPlaying(false);
        });
      } catch (err) {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (isVideoDesk && videoRef.current) {
      const v = videoRef.current;
      if (v.paused) {
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        v.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      startPlayback();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isVideoDesk && videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const restartPlayback = () => {
    if (isVideoDesk && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      startPlayback();
    }
  };

  if (!isOpen || !appId) return null;

  const handleSubscribe = () => {
    cleanupPlayback();
    onClose();
    if (onSubscribeClick) {
      onSubscribeClick();
    } else {
      navigate('/subscribe');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container — SIGNATURE DYSON TAN BACKDROP */}
      <div 
        className="w-full max-w-2xl rounded-3xl p-5 sm:p-7 border-2 shadow-2xl text-left relative max-h-[94vh] overflow-y-auto space-y-5 text-[#0a0a0a]"
        style={{
          background: TAN_BG,
          borderColor: '#854d0e',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(133,77,14,0.4) transparent',
        }}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#0a0a0a]/15">
          <div className="flex items-start gap-3 sm:gap-3.5">
            {/* App Icon Squircle */}
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center shadow-lg relative shrink-0"
              style={{
                boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
              }}
            >
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" />
              {explainer.badgeCount && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#ff3b30] text-white text-[10px] font-black flex items-center justify-center border-2 border-black shadow">
                  {explainer.badgeCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-[#D4AF37]">
                  {explainer.badge || 'MINI APP'}
                </span>
                <span className="text-[10px] font-bold text-[#854d0e] uppercase tracking-wider">
                  1ST TIME VIEWER • READ-ONLY EXPLAINER
                </span>
              </div>

              {/* Title format: 2. Roadmaps (/client-roadmap) */}
              <h2 
                className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-tight mt-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {explainer.number}. {explainer.title} <span className="text-sm font-sans font-normal text-[#554433]">({explainer.route})</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cleanupPlayback();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0a0a0a] flex items-center justify-center cursor-pointer transition-all shrink-0"
            title="Close Explainer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            CHARLIE AT HIS DNN NEWS STUDIO DESK (EXPLAINER PRESENTER)
            Plays CHARLIE- INTRO DNN NEWS.mp4 or speaks the app's script
            ======================================================== */}
        <div 
          className="rounded-2xl border overflow-hidden shadow-xl text-white relative transition-all"
          style={{
            background: 'linear-gradient(160deg, #16130e 0%, #0a0a0a 100%)',
            borderColor: isPlaying ? GOLD : 'rgba(212,175,55,0.45)',
            boxShadow: isPlaying 
              ? '0 0 25px rgba(212,175,55,0.3), 0 8px 24px rgba(0,0,0,0.8)' 
              : '0 6px 20px rgba(0,0,0,0.7)',
          }}
        >
          {/* Top Subtle Gold Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none z-20" />

          <div className="flex flex-col sm:flex-row items-stretch">
            {/* Visual Desk Box (Video or Studio Still with Animated Equalizer) */}
            <div 
              onClick={togglePlay}
              className="relative w-full sm:w-[220px] aspect-[16/9] sm:aspect-auto bg-black shrink-0 cursor-pointer group overflow-hidden border-b sm:border-b-0 sm:border-r border-white/10"
              title={isPlaying ? "Pause Charlie" : "Play Charlie Explainer Voice"}
            >
              {isVideoDesk ? (
                <video
                  ref={videoRef}
                  src={CHARLIE_DNN_DESK_VIDEO}
                  playsInline
                  preload="auto"
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <img
                  src={CHARLIE_DNN_DESK_PHOTO}
                  alt="Charlie Simmons at DNN Studio Desk"
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isPlaying ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

              {/* Status Pill Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md border ${
                  isPlaying 
                    ? 'bg-[#D4AF37] text-black border-black' 
                    : 'bg-black/80 text-[#D4AF37] border-[#D4AF37]/50'
                }`}>
                  {isPlaying ? (
                    <>
                      <Volume2 className="w-2.5 h-2.5 fill-black" />
                      <span>Speaking</span>
                      <span className="flex items-center gap-0.5 ml-0.5">
                        <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>Tap to Listen</span>
                    </>
                  )}
                </span>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white z-10">
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981]'}`} />
                  <span>Charlie Simmons</span>
                </span>
                <span className="text-[#D4AF37] text-[8px] uppercase tracking-wider">
                  DNN News Desk
                </span>
              </div>
            </div>

            {/* Speaking Controls & Script Spoken Text */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-left">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                      Charlie's Spoken Audio Explainer
                    </span>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-black border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#1a1710] cursor-pointer transition-all"
                      title={isPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-black border border-white/15 hover:border-white/40 text-white/80 cursor-pointer transition-all"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                    <button
                      type="button"
                      onClick={restartPlayback}
                      className="p-1.5 rounded-lg bg-black border border-white/15 hover:border-white/40 text-white/80 cursor-pointer transition-all"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spoken Quote Block */}
                <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white/90 leading-relaxed font-sans italic relative">
                  <span className="text-[#D4AF37] font-bold not-italic mr-1.5">Charlie:</span>
                  <span>"{explainer.charlieScript}"</span>
                </div>
              </div>

              {/* Live Audio State Indicator */}
              <div className="flex items-center justify-between text-[9.5px] text-white/60 pt-1 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#10b981] animate-ping' : 'bg-white/40'}`} />
                  <span>{isPlaying ? 'Authentic Charlie voice playing…' : 'Spoken introduction ready'}</span>
                </span>
                <span className="text-[#D4AF37] font-semibold">
                  0-Second CDN Audio
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            EXACT BULLET POINT COPY SPECIFICATION (FROM SCREENSHOT)
            ======================================================== */}
        <div className="space-y-3.5 text-xs sm:text-sm text-[#0a0a0a] leading-relaxed">
          
          {/* Bullet 1: Subtitle */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#854d0e] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Subtitle:</strong>{' '}
              <span className="text-[#332211] font-medium">{explainer.subtitle}</span>
            </div>
          </div>

          {/* Bullet 2: The Problem Unsubscribed Viewers Face */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#dc2626] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">The Problem Unsubscribed Viewers Face:</strong>{' '}
              <span className="text-[#443322] leading-relaxed">{explainer.theProblem}</span>
            </div>
          </div>

          {/* Bullet 3: The Fiduciary Solution */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#10b981] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">The Fiduciary Solution:</strong>{' '}
              <span className="text-[#223322] leading-relaxed">{explainer.theFiduciarySolution}</span>
            </div>
          </div>

          {/* Bullet 4: Unsubscribed Viewer Access */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#854d0e] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Unsubscribed Viewer Access:</strong>{' '}
              <span className="text-[#443322] leading-relaxed">{explainer.unsubscribedAccess}</span>
            </div>
          </div>

          {/* Bullet 5: Subscriber Unlock */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#b45309] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Subscriber Unlock:</strong>{' '}
              <span className="text-[#2b1f13] leading-relaxed">{explainer.subscriberUnlock}</span>
            </div>
          </div>

        </div>

        {/* Read-Only Notice Box */}
        <div className="p-3.5 rounded-2xl bg-black/5 border border-black/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#854d0e] shrink-0" />
            <span className="text-[#554433]">
              <strong>Read-Only Mode:</strong> Full interactive actions activate automatically after selecting your portal and subscribing.
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-2 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              cleanupPlayback();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#0a0a0a]/25 text-[#0a0a0a] hover:bg-black/10 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Close Explainer</span>
          </button>

          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-[#1f1f1f] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pick Your Portal &amp; Subscribe to Unlock</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

      </div>
    </div>
  );
}