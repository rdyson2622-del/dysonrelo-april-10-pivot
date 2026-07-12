import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Play, RotateCcw, Volume2 } from 'lucide-react';

const GOLD = '#D4AF37';

const SCRIPTS = [
  {
    speaker: 'charlie',
    label: 'CHARLIE · PORTAL CONCIERGE',
    text: `What you're looking at here is the backside of the Dyson & Dyson companies. Most people see the front door — the concierge, the relocation roadmap, the news bureau. But behind that front door is an entire workforce of twenty-one AI specialists. Each one owns a single domain. Each one is an expert in exactly one thing. And they all talk to each other — passing insights, triggering actions, and optimizing outcomes together — so you never have to manage the complexity. Let me walk you through who they are and what they do.`,
  },
  {
    speaker: 'charlie',
    label: 'CHARLIE · THE FIRST SEVEN',
    text: `I'm Charlie — your portal concierge. I'm the one you talk to first, every time. Scout scores every lead that comes through the door. Nexus matches you to the right agent in our vetted network. Pulse watches market intelligence in real time. Guardian provides transaction oversight on every deal. Relay handles follow-up automation so nothing falls through the cracks. And Composer generates content — listings, briefs, emails — across the entire ecosystem.`,
  },
  {
    speaker: 'bob',
    label: 'BOB DYSON · THE OPERATIONS LAYER',
    text: `The next layer is what I personally care about. Signal is our notification engine — it makes sure the right person sees the right thing at the right moment. Advisor is our Escrow Simulator — it stress-tests every transaction before it goes live. Keeper is the homeowner assistant that stays with the client long after closing. And Bridge coordinates referrals across the entire partner network.`,
  },
  {
    speaker: 'charlie',
    label: 'CHARLIE · THE INTELLIGENCE LAYER',
    text: `Then we have the intelligence layer. Lens optimizes every profile in the system. Curator builds education pathways so clients learn as they go. Dispatch coordinates all the service providers — movers, utilities, the whole vendor network. Harvest is our credit engine. And Anchor monitors compliance across every transaction, every document, every disclosure — nothing slips.`,
  },
  {
    speaker: 'charlie',
    label: 'CHARLIE · THE ORCHESTRATION LAYER',
    text: `Finally, the orchestration layer. Radar finds opportunities in the market before anyone else does. Conductor orchestrates the entire workflow — all twenty-one of us, working in concert. Herald handles news distribution. Emissary manages email intelligence. And Sentinel is our admin intelligence — the one that watches the watchers. Twenty-one specialists, one ecosystem, and you never have to manage a single one of them. That's the backside of Dyson & Dyson.`,
  },
];

export default function AIAssistantsCharlieCircle() {
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
      const res = await base44.functions.invoke('charlieSpeak', { text: seg.text, speaker: seg.speaker });
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
  const isBob = seg?.speaker === 'bob';

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Hear Charlie explain the 21 AI Assistants"
        className="fixed bottom-6 right-6 z-40 w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95"
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
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden flex items-center justify-center text-6xl"
            style={{
              border: `4px solid ${isBob ? '#60a5fa' : GOLD}`,
              background: isBob ? '#0a0f1e' : '#0d0d0d',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              transition: 'border-color 0.4s ease, background 0.4s ease',
            }}
          >
            {isBob ? '🎤' : '🎩'}
          </div>
          {(loading || playing) && (
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'rgba(0,0,0,0.7)', border: `2px solid ${isBob ? '#60a5fa' : GOLD}` }}>
              <Volume2 className="w-5 h-5" style={{ color: isBob ? '#60a5fa' : GOLD }} />
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

        <p className="mt-4 text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: isBob ? '#60a5fa' : GOLD }}>
          {seg?.label || ''}
        </p>

        <div className="flex gap-1.5 mt-3">
          {SCRIPTS.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: i <= idx ? (SCRIPTS[i].speaker === 'bob' ? '#60a5fa' : GOLD) : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>

        <audio ref={audioRef} onEnded={handleAudioEnded} />
      </div>
    </div>
  );
}