import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Play, RotateCcw, Volume2 } from 'lucide-react';

const GOLD = '#D4AF37';

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
};

const SCRIPTS = [
  {
    speaker: 'charlie',
    text: `Let me tell you about Bob Dyson. Bob started his career as a corporate jet pilot and Chief Pilot for the Governor of Oklahoma — at just twenty years old. But flying wasn't his only talent. Bob strategically acquired over one thousand properties across multiple states while building Red Carpet Corporation of America, managing more than sixteen hundred offices nationwide.`,
  },
  {
    speaker: 'charlie',
    text: `After selling that company, Bob founded Dyson and Dyson Concierge Relocation Services and established Dyson News Network — DNN — which delivers real estate intelligence to millions. That foundation of expertise, refined over fifty-five-plus years, is what Dyson and Dyson brings to every client today.`,
  },
  {
    speaker: 'charlie',
    text: `Today, Bob leads a team that combines hands-on real estate expertise with cutting-edge AI to serve families nationwide. And me? I'm Charlie — his AI concierge, here to guide you through every step of your relocation journey. We don't sell real estate. We manage your entire move.`,
  },
];

export default function BobDysonCharlieCircle() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const audioRef = useRef(null);

  const playSegment = useCallback(async (segmentIdx) => {
    const seg = SCRIPTS[segmentIdx];
    if (!seg) { setEnded(true); setPlaying(false); return; }
    setLoading(true);
    setPlaying(true);
    setEnded(false);
    try {
      const res = await base44.functions.invoke('charlieSpeak', { text: seg.text });
      const { audio, mimeType } = res?.data || {};
      if (audio && audioRef.current) {
        const binary = atob(audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: mimeType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('TTS error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setIdx(0);
    setEnded(false);
    setTimeout(() => playSegment(0), 200);
  };

  const handleAudioEnded = () => {
    if (idx < SCRIPTS.length - 1) {
      const next = idx + 1;
      setIdx(next);
      playSegment(next);
    } else {
      setEnded(true);
      setPlaying(false);
    }
  };

  const replay = () => {
    setIdx(0);
    setEnded(false);
    playSegment(0);
  };

  const seg = SCRIPTS[idx];

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Hear Charlie talk about Bob Dyson"
        className="fixed top-20 right-6 z-40 w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `3px solid ${GOLD}` }}>
          <span className="w-full h-full flex items-center justify-center text-4xl">🎩</span>
        </span>
        <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-5 h-5 ml-0.5" style={{ color: '#000' }} />
        </span>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: '#0d0d0d', color: GOLD, border: `1px solid ${GOLD}` }}>
          MEET CHARLIE
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        onClick={() => { setOpen(false); setPlaying(false); if (audioRef.current) audioRef.current.pause(); }}
        style={{ background: 'rgba(10,10,10,0.35)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
      />
      <div
        className="relative rounded-3xl px-8 pt-4 pb-6 flex flex-col items-center"
        style={{
          background: 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={() => { setOpen(false); setPlaying(false); if (audioRef.current) audioRef.current.pause(); }}
          aria-label="Close"
          className="self-end -mr-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: GOLD }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          <div
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{ border: `4px solid ${GOLD}`, background: '#0d0d0d', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
          >
            <div className="w-full h-full flex items-center justify-center text-6xl">🎩</div>
          </div>
          {(loading || playing) && (
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'rgba(0,0,0,0.7)', border: `2px solid ${GOLD}` }}>
              <Volume2 className="w-5 h-5" style={{ color: GOLD }} />
            </div>
          )}
          {ended && (
            <button onClick={replay} aria-label="Replay"
              className="absolute inset-0 rounded-full flex items-center justify-center transition-all hover:bg-black/30">
              <span className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
                <RotateCcw className="w-6 h-6" style={{ color: GOLD }} />
              </span>
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
          {SPEAKER_LABELS[seg?.speaker] || ''}
        </p>

        <div className="flex gap-1.5 mt-3">
          {SCRIPTS.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: i <= idx ? GOLD : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>

        <audio ref={audioRef} onEnded={handleAudioEnded} />
      </div>
    </div>
  );
}