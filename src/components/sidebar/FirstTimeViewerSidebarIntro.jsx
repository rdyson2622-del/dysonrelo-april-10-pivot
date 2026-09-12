import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, LogIn, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const GOLD = '#D4AF37';

import { base44 } from '@/api/base44Client';
const CHARLIE_GREETING_TEXT = "Welcome to Dyson Relocation. I am Charlie Simmons, your AI concierge. All your tools and services are outlined below in your mini apps.";

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber, className = '' }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
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
        audioRef.current = null;
      }
      setIsPlaying(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setIsPlaying(false));
        return;
      }

      base44.functions.invoke('charlieSpeak', { text: CHARLIE_GREETING_TEXT })
        .then((res) => {
          const url = res?.data?.audioUrl;
          if (!url) {
            setIsPlaying(false);
            return;
          }
          const audio = new Audio(url);
          audio.preload = 'auto';
          audioRef.current = audio;

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

          audio.play().catch(() => setIsPlaying(false));
        })
        .catch(() => setIsPlaying(false));
    } catch (err) {
      console.error('Failed to trigger Charlie greeting audio:', err);
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5 ${className}`}
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

      {/* Charlie at Desk Photo Container */}
      <div 
        onClick={toggleVoice}
        className={`relative rounded-xl overflow-hidden border shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 ${
          isPlaying 
            ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-[1.01]' 
            : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
        }`}
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
        
        {/* Play/Speaking Badge in Corner */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <div 
            className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold flex items-center gap-1 shadow-lg border transition-all ${
              isPlaying 
                ? 'bg-[#D4AF37] text-black border-black animate-pulse' 
                : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-2 h-2 fill-black" />
                <span className="uppercase tracking-wider text-[7.5px] font-black">Playing</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span className="uppercase tracking-wider text-[7.5px] font-black text-[#D4AF37]">Click to Hear</span>
              </>
            )}
          </div>
        </div>

        {/* Lower Left Corner: Charlie Simmons Name Tag */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
          <span className="flex items-center gap-1 drop-shadow">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
            <span>Charlie Simmons</span>
          </span>
          <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold flex items-center gap-1">
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
        
        <p className="text-[10px] sm:text-[10.5px] text-white/90 leading-relaxed font-normal pt-0.5">
          We’re here to make your real estate ventures far less stressful and genuinely transparent—more transparent than any traditional real estate process in the market today. Whether you’re moving across the country, buying, selling, or partnering with our network, our concierge orchestrates every step with independent fiduciary vetting, verified professionals, and real-time clarity. Explore our tools freely without sales pressure.
        </p>
      </div>

      {/* Direct Sign In & Access for Subscribed Users */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center justify-between text-[9px] px-1 text-white/80">
              <span className="flex items-center gap-1 truncate max-w-[170px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
                <span className="truncate">Signed in: <strong className="text-white">{user.full_name || user.email}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  logout(false);
                  window.location.href = '/login';
                }}
                className="text-[#D4AF37] hover:underline cursor-pointer shrink-0 ml-1"
                title="Sign out or sign in as a different subscriber"
              >
                Switch
              </button>
            </div>

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
              className="w-full py-1.5 px-3 rounded-xl text-[10px] font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:brightness-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              title="Open Subscriber Desk & Mini Apps"
            >
              <UserCheck className="w-3 h-3 text-black" />
              <span>Open Subscriber Desk →</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate('/login?returnTo=/portal')}
              className="w-full py-1.5 px-3 rounded-xl text-[10px] font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:brightness-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
            >
              <LogIn className="w-3 h-3 text-black" />
              <span>Subscriber Sign In</span>
            </button>
            <div className="flex items-center justify-between text-[9px] text-white/45 px-1">
              <span>First time viewing?</span>
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
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Preview Subscriber Card →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}