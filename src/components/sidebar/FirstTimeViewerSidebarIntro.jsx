import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles } from 'lucide-react';

const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const GOLD = '#D4AF37';

// Authentic Charlie Simmons HeyGen Ruben voice greeting (instant 0-second CDN playback)
const CHARLIE_GREETING_AUDIO = "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=83b6de7f-60bc-4d1f-b68d-6950b71bc107.wav";

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const audioRef = useRef(null);

  // Initialize or cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
    };
  }, []);

  const toggleVoice = (e) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
      return;
    }

    // Play Charlie's authentic spoken remarks
    try {
      if (!audioRef.current) {
        const audio = new Audio(CHARLIE_GREETING_AUDIO);
        audio.preload = 'auto';

        audio.onplay = () => {
          setIsPlaying(true);
          setHasPlayedOnce(true);
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
      } else {
        audioRef.current.currentTime = 0;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error or blocked by autoplay policy:', err);
          setIsPlaying(false);
        });
      }
    } catch (err) {
      console.error('Failed to trigger Charlie greeting audio:', err);
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5 ${className}`}
      style={{
        background: 'linear-gradient(160deg, #16130e 0%, #0c0b08 100%)',
        borderColor: isPlaying ? GOLD : `${GOLD}80`,
        boxShadow: isPlaying 
          ? '0 0 25px rgba(212,175,55,0.35), 0 8px 24px rgba(0,0,0,0.8)' 
          : '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Top Subtle Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* Charlie at Desk Studio Photo with Click-to-Hear Audio Trigger */}
      <div 
        onClick={toggleVoice}
        className="relative rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md aspect-[16/9] w-full bg-black group cursor-pointer"
        title={isPlaying ? "Click to pause Charlie's voice" : "Click to hear Charlie speak his welcome message"}
      >
        <img 
          src={CHARLIE_DESK_PHOTO} 
          alt="Charlie Simmons at DNN Studio Desk" 
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            isPlaying ? 'scale-105' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        {/* Play/Speaking Badge in Center or Corner */}
        <div className="absolute top-2 right-2 z-10">
          <div 
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1.5 shadow-lg border transition-all ${
              isPlaying 
                ? 'bg-[#D4AF37] text-black border-black animate-pulse'
                : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-2.5 h-2.5 fill-black" />
                <span className="uppercase tracking-wider text-[8px] font-black">Playing</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-[#D4AF37]" />
                <span className="uppercase tracking-wider text-[8px] font-black text-[#D4AF37]">Click to Hear</span>
              </>
            )}
          </div>
        </div>

        {/* Discreet Name Overlay on Desk */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
          <span className="flex items-center gap-1 drop-shadow">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
            <span>Charlie Simmons</span>
          </span>
          <span className="text-[#D4AF37] drop-shadow text-[8.5px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <span>AI Concierge</span>
          </span>
        </div>
      </div>

      {/* Charlie Welcome Message */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 
            className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Welcome to Dyson &amp; Dyson
          </h3>
        </div>
        
        <p className="text-[11px] font-semibold text-[#D4AF37] leading-snug">
          I'm Charlie Simmons, your AI Concierge.
        </p>
        
        <p className="text-[10px] sm:text-[10.5px] text-white/85 leading-relaxed font-normal pt-0.5">
          You are viewing our platform in Guest Mode. Explore our concierge mini-apps and fiduciary intelligence below without sales pressure.
        </p>
      </div>

      {/* Prominent Voice Greeting Button */}
      <button
        type="button"
        onClick={toggleVoice}
        className={`w-full py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 ${
          isPlaying
            ? 'bg-[#2a2211] border-[#D4AF37] text-[#D4AF37]'
            : 'bg-[#15120c] hover:bg-[#1d1911] border-[#D4AF37]/60 hover:border-[#D4AF37] text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
            <span className="text-[11px]">Pause Charlie's Greeting</span>
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold">
              {hasPlayedOnce ? "Replay Charlie's Greeting" : "Hear Charlie's Welcome Greeting"}
            </span>
          </>
        )}
      </button>

      {/* Subtle Link for Subscribed Users */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9.5px]">
        <span className="text-white/45">Already subscribed?</span>
        <button
          type="button"
          onClick={() => {
            if (onSwitchToSubscriber) {
              onSwitchToSubscriber();
            } else {
              sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
              window.location.reload();
            }
          }}
          className="text-[#D4AF37] hover:text-[#e8c84a] font-semibold transition-colors cursor-pointer"
        >
          Show Subscriber Card →
        </button>
      </div>
    </div>
  );
}