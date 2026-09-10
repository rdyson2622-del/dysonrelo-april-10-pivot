import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, Mic } from 'lucide-react';

const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const BOB_PHOTO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

// Authentic Charlie Simmons HeyGen Ruben voice greeting (instant 0-second CDN playback)
const CHARLIE_GREETING_AUDIO = "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=2b2fe5ab-819c-4d92-a6b7-8ce1f65f86df.wav";

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const audioRef = useRef(null);

  // V2V live session tracking
  const [v2vState, setV2vState] = useState('ready');
  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    const handleState = (e) => {
      if (e?.detail?.status) {
        setV2vState(e.detail.status);
      }
    };
    const handleSpeaker = (e) => {
      setSpeaker(e?.detail?.speaker || null);
    };

    window.addEventListener('v2v-session-state', handleState);
    window.addEventListener('v2v-speaker-change', handleSpeaker);

    return () => {
      window.removeEventListener('v2v-session-state', handleState);
      window.removeEventListener('v2v-speaker-change', handleSpeaker);
    };
  }, []);

  const isV2VActive = v2vState === 'listening' || v2vState === 'speaking' || v2vState === 'connecting';
  const userSpeaking = isV2VActive && (speaker === 'user' || v2vState === 'listening');
  const charlieSpeaking = isV2VActive && (speaker === 'assistant' || v2vState === 'speaking');

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

  const handleToggleV2V = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-charlie-v2v'));
    }
  };

  return (
    <div 
      className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2 ${className}`}
      style={{
        background: 'linear-gradient(160deg, #16130e 0%, #0c0b08 100%)',
        borderColor: (isPlaying || isV2VActive) ? GOLD : `${GOLD}80`,
        boxShadow: (isPlaying || isV2VActive)
          ? '0 0 25px rgba(212,175,55,0.35), 0 8px 24px rgba(0,0,0,0.8)' 
          : '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Top Subtle Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* ========================================================
          1. TOP BOX: BOB DYSON (HEADSHOT IN BLACK SHIRT)
          Same size as Charlie's box with name in lower-left corner
          ======================================================== */}
      <div 
        onClick={handleToggleV2V}
        className={`relative rounded-xl overflow-hidden border shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 ${
          userSpeaking 
            ? 'border-2 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.01]' 
            : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
        }`}
        title={isV2VActive ? "Connected to Charlie V2V — Click to stop" : "Click to start live V2V conversation with Charlie"}
      >
        <img 
          src={BOB_PHOTO} 
          alt="Bob Dyson" 
          className={`w-full h-full object-cover object-[center_18%] transition-transform duration-500 ${
            userSpeaking ? 'scale-105' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Top-left: Role badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span 
            className="px-2 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 shadow-sm"
          >
            SUBSCRIBER • HR DESK
          </span>
        </div>

        {/* Top-right: Speaking / Live V2V status */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <div 
            className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold flex items-center gap-1 shadow-lg border transition-all ${
              userSpeaking 
                ? 'bg-emerald-500 text-black border-black animate-pulse'
                : isV2VActive
                ? 'bg-black/80 text-emerald-400 border-emerald-500/60'
                : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
            }`}
          >
            {userSpeaking ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                <span className="uppercase tracking-wider text-[7.5px] font-black">Speaking</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                </span>
              </>
            ) : isV2VActive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="uppercase tracking-wider text-[7.5px] font-black">V2V Active</span>
              </>
            ) : (
              <>
                <Mic className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span className="uppercase tracking-wider text-[7.5px] font-black text-[#D4AF37]">Tap to Talk</span>
              </>
            )}
          </div>
        </div>

        {/* Lower Left Corner: Bob Dyson Name Tag (Matching Charlie's layout) */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
          <span className="flex items-center gap-1 drop-shadow">
            <span className={`w-1.5 h-1.5 rounded-full ${userSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
            <span>Bob Dyson</span>
          </span>
          <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <span>HR Relocation</span>
          </span>
        </div>
      </div>

      {/* ========================================================
          V2V CONNECTION STATUS STRIP (COMPACT)
          ======================================================== */}
      <div className="flex items-center justify-between px-2.5 py-1 rounded-full bg-black/85 border border-[#D4AF37]/50 text-[8.5px] font-bold text-[#D4AF37] shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isV2VActive ? (charlieSpeaking ? 'bg-[#D4AF37] animate-ping' : 'bg-emerald-400 animate-ping') : 'bg-[#10b981]'}`} />
          <span>{isV2VActive ? (charlieSpeaking ? 'Charlie Speaking…' : 'Listening to You…') : 'Real-Time V2V Direct Link'}</span>
        </span>
        <button
          type="button"
          onClick={handleToggleV2V}
          className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            isV2VActive 
              ? 'bg-red-500/30 text-red-300 border border-red-500/40 hover:bg-red-500/40' 
              : 'bg-[#D4AF37] text-black hover:bg-[#e8c84a]'
          }`}
        >
          {isV2VActive ? 'Stop V2V' : 'Start V2V'}
        </button>
      </div>

      {/* ========================================================
          2. BOTTOM BOX: CHARLIE SIMMONS IN THE STUDIO
          ======================================================== */}
      <div 
        onClick={toggleVoice}
        className={`relative rounded-xl overflow-hidden border shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 ${
          charlieSpeaking
            ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-[1.01]'
            : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
        }`}
        title={isPlaying ? "Click to pause Charlie's voice" : "Click to hear Charlie speak his welcome message"}
      >
        <img 
          src={CHARLIE_DESK_PHOTO} 
          alt="Charlie Simmons at DNN Studio Desk" 
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            (isPlaying || charlieSpeaking) ? 'scale-105' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top-left: Studio tag */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span 
            className="px-2 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-wider bg-black/80 text-red-400 border border-red-500/50 shadow-sm flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            LIVE • DNN STUDIO
          </span>
        </div>
        
        {/* Play/Speaking Badge in Corner */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <div 
            className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold flex items-center gap-1 shadow-lg border transition-all ${
              (isPlaying || charlieSpeaking)
                ? 'bg-[#D4AF37] text-black border-black animate-pulse'
                : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
            }`}
          >
            {(isPlaying || charlieSpeaking) ? (
              <>
                <Square className="w-2 h-2 fill-black" />
                <span className="uppercase tracking-wider text-[7.5px] font-black">Speaking</span>
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
            <span className={`w-1.5 h-1.5 rounded-full ${(isPlaying || charlieSpeaking) ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
            <span>Charlie Simmons</span>
          </span>
          <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <span>AI Concierge</span>
          </span>
        </div>
      </div>

      {/* Prominent Voice Greeting Button (Text removed to pick up sidebar vertical space) */}
      <button
        type="button"
        onClick={toggleVoice}
        className={`w-full py-1.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 ${
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
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9.5px]">
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