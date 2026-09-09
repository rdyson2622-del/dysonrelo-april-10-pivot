import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';

const GOLD = '#D4AF37';

// Curated reliable royalty-free smooth jazz / lounge stream
const AMBIENCE_STREAM_URL = 'https://streaming.exclusive.radio/er/smoothjazz/icecast.audio';
const BACKUP_STREAM_URL = 'https://stream.zeno.fm/f3wvbbqmdg8uv';

export default function StudioAmbiencePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDucked, setIsDucked] = useState(false);
  const [volume, setVolume] = useState(0.22); // Warm, relaxed ambient volume
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Initialize audio element with Web Audio / standard HTML5 audio
  useEffect(() => {
    const audio = new Audio();
    audio.src = AMBIENCE_STREAM_URL;
    audio.preload = 'none';
    audio.volume = 0.22;
    audioRef.current = audio;

    // Error fallback to secondary stream
    audio.onerror = () => {
      if (audio.src === AMBIENCE_STREAM_URL) {
        audio.src = BACKUP_STREAM_URL;
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      }
    };

    // Auto-ducking listener: drops music volume when Charlie speaks or mic opens
    const handleSpeechActive = (event) => {
      const active = Boolean(event.detail?.active);
      setIsDucked(active);

      if (!audioRef.current) return;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const targetVol = active ? 0.03 : 0.22; // Duck down to 3% whisper or fade back to 22%
      const step = active ? -0.04 : 0.03;

      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) {
          clearInterval(fadeIntervalRef.current);
          return;
        }
        let currentVol = audioRef.current.volume;
        currentVol += step;
        if ((step > 0 && currentVol >= targetVol) || (step < 0 && currentVol <= targetVol)) {
          audioRef.current.volume = targetVol;
          clearInterval(fadeIntervalRef.current);
        } else {
          audioRef.current.volume = Math.max(0, Math.min(1, currentVol));
        }
      }, 50);
    };

    window.addEventListener('charlie-speech-active', handleSpeechActive);

    return () => {
      window.removeEventListener('charlie-speech-active', handleSpeechActive);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = isDucked ? 0.03 : volume;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play restricted or failed:', err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={togglePlay}
        className={`flex items-center gap-1.5 px-2.5 py-0.5 h-7 rounded-full text-[10px] font-bold border transition-all cursor-pointer shadow-sm shrink-0 ${
          isPlaying
            ? 'bg-[#1a1508] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
            : 'bg-[#141414] border-white/20 text-white/80 hover:text-white hover:border-[#D4AF37]/50'
        }`}
        title={isPlaying ? 'Pause Lounge Ambience' : 'Play Smooth Jazz Lounge Ambience'}
      >
        {isPlaying ? (
          <>
            {/* Spinning vinyl / active music waves */}
            <Disc3 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="flex items-center gap-1">
              <span>Lounge</span>
              {/* Minimal equalizer animation */}
              <span className="flex items-end gap-0.5 h-3 ml-0.5">
                <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all ${isDucked ? 'h-1 opacity-50' : 'h-2.5 animate-pulse'}`} />
                <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all ${isDucked ? 'h-1 opacity-50' : 'h-3.5 animate-pulse delay-75'}`} />
                <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all ${isDucked ? 'h-1 opacity-50' : 'h-2 animate-pulse delay-150'}`} />
              </span>
            </span>
            {isDucked && (
              <span className="text-[9px] font-normal uppercase text-[#D4AF37]/70 hidden sm:inline">
                (Ducked)
              </span>
            )}
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Concierge Lounge</span>
            <span className="sm:hidden">Lounge</span>
          </>
        )}
      </button>
    </div>
  );
}