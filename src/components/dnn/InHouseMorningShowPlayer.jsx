import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, SkipForward } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { DNN_STING_URL } from '@/components/dnn/DnnStingVideo';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0f097ef2_generated_image.png';
const BOB_HEADSHOT = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';

/**
 * In-house morning show player — no HeyGen, no Creatomate.
 * Studio background + dual host plates + Google TTS per scene.
 */
export default function InHouseMorningShowPlayer({
  introScript = '',
  contentScript = '',
  outroScript = '',
  bullets = [],
  headline = 'DNN Morning Intelligence',
  onEnded,
}) {
  const scenes = useMemo(() => ([
    { id: 'intro', role: 'charlie', label: 'Charlie Simmons · DNN News Desk', text: introScript },
    { id: 'content', role: 'bob', label: 'Bob Dyson · Reporting', text: contentScript, showBullets: true },
    { id: 'outro', role: 'charlie', label: 'Charlie Simmons · DNN News Desk', text: outroScript },
  ].filter((s) => (s.text || '').trim())), [introScript, contentScript, outroScript]);

  const [stingPhase, setStingPhase] = useState('intro'); // intro | null | outro
  const [sceneIdx, setSceneIdx] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | loading | playing | error
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const audioRef = useRef(null);
  const stingRef = useRef(null);
  const objectUrlRef = useRef(null);

  const current = scenes[sceneIdx];

  const cleanupAudioUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => () => cleanupAudioUrl(), []);

  useEffect(() => {
    if (stingPhase !== 'intro') return undefined;
    const timer = setTimeout(() => {
      const v = stingRef.current;
      if (!v) return;
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => setStingPhase(null));
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [stingPhase]);

  useEffect(() => {
    if (stingPhase !== null) return undefined;
    if (!current?.text) {
      setStingPhase('outro');
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      setStatus('loading');
      setError('');
      cleanupAudioUrl();
      try {
        const res = await base44.functions.invoke('charlieSpeak', {
          text: current.text,
          speaker: current.role,
        });
        const { audio, mimeType } = res?.data || {};
        if (!audio) throw new Error(res?.data?.error || 'No audio returned');
        if (cancelled) return;

        const binary = atob(audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: mimeType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        const el = audioRef.current;
        if (!el) return;
        el.src = url;
        el.onended = () => {
          if (sceneIdx + 1 < scenes.length) setSceneIdx((i) => i + 1);
          else setStingPhase('outro');
        };
        setStatus('playing');
        try {
          await el.play();
          setBlocked(false);
        } catch {
          setBlocked(true);
          setStatus('idle');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err?.message || 'Voice synthesis failed');
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [stingPhase, sceneIdx, current, scenes.length]);

  const handleStingEnded = () => {
    if (stingPhase === 'intro') setStingPhase(null);
    else if (stingPhase === 'outro') onEnded?.();
  };

  const skipScene = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }
    if (sceneIdx + 1 < scenes.length) setSceneIdx((i) => i + 1);
    else setStingPhase('outro');
  };

  const resume = async () => {
    try {
      await audioRef.current?.play();
      setBlocked(false);
      setStatus('playing');
    } catch {
      setBlocked(true);
    }
  };

  const charlieActive = current?.role === 'charlie' && stingPhase === null;
  const bobActive = current?.role === 'bob' && stingPhase === null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16 / 9', background: '#000' }}>
      <audio ref={audioRef} />

      {stingPhase && (
        <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: '#000' }}>
          <video
            ref={stingRef}
            key={stingPhase}
            src={DNN_STING_URL}
            autoPlay
            playsInline
            onEnded={handleStingEnded}
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleStingEnded}
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}`, color: GOLD }}
          >
            {stingPhase === 'outro' ? 'Close' : 'Skip sting'}
          </button>
        </div>
      )}

      <img src={STUDIO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Headline / lower-third */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-3">
        <div className="rounded-xl px-3 py-2 max-w-[70%]" style={{ background: 'rgba(0,0,0,0.72)', border: `1px solid ${GOLD}55` }}>
          <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>DNN Morning Brief</p>
          <p className="text-sm font-bold text-white leading-snug mt-0.5">{headline}</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'loading' && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', color: GOLD }}>
              Synthesizing voice…
            </span>
          )}
          {stingPhase === null && (
            <button
              type="button"
              onClick={skipScene}
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.7)', color: GOLD, border: `1px solid ${GOLD}55` }}
            >
              <SkipForward className="w-3 h-3" /> Skip scene
            </button>
          )}
        </div>
      </div>

      {/* Whiteboard bullets during Bob */}
      {bobActive && bullets?.length > 0 && (
        <div
          className="absolute z-10 rounded-xl p-4"
          style={{
            top: '18%',
            left: '28%',
            right: '28%',
            background: 'rgba(255,255,255,0.92)',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
        >
          <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: '#111' }}>Solutions desk</p>
          <ul className="space-y-1.5">
            {bullets.slice(0, 5).map((b) => (
              <li key={b} className="text-sm font-semibold leading-snug" style={{ color: '#111' }}>• {b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Charlie plate — lower left */}
      <HostPlate
        photo={CHARLIE_HEADSHOT}
        label="Charlie Simmons · DNN News Desk"
        active={charlieActive}
        talking={charlieActive && status === 'playing'}
        position="left"
      />

      {/* Bob plate — lower right */}
      <HostPlate
        photo={BOB_HEADSHOT}
        label="Bob Dyson · Reporting"
        active={bobActive}
        talking={bobActive && status === 'playing'}
        position="right"
      />

      {blocked && (
        <button
          type="button"
          onClick={resume}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <span className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
            <Play className="w-7 h-7 ml-0.5" style={{ color: '#000' }} fill="#000" />
          </span>
          <span className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>Tap to start broadcast</span>
        </button>
      )}

      {status === 'error' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 rounded-xl px-4 py-2 text-xs" style={{ background: 'rgba(127,29,29,0.9)', color: '#fecaca' }}>
          {error || 'Voice failed'} — check GEMINI_API_KEY / Google TTS
        </div>
      )}

      {status === 'playing' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', border: `1px solid ${GOLD}33` }}>
          <Pause className="w-3 h-3" style={{ color: GOLD }} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: GOLD }}>
            {current?.label || 'On air'} · in-house
          </span>
        </div>
      )}
    </div>
  );
}

function HostPlate({ photo, label, active, talking, position }) {
  return (
    <div
      className="absolute z-10"
      style={{
        bottom: '3%',
        [position === 'left' ? 'left' : 'right']: '1.5%',
        width: '22%',
        opacity: active ? 1 : 0.55,
        transform: active ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: `2px solid ${active ? GOLD : 'rgba(212,175,55,0.35)'}`,
          boxShadow: active
            ? `0 8px 40px rgba(0,0,0,0.7), 0 0 ${talking ? 28 : 16}px rgba(212,175,55,${talking ? 0.55 : 0.3})`
            : '0 8px 24px rgba(0,0,0,0.45)',
          background: '#000',
        }}
      >
        <div className="w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
          <img
            src={photo}
            alt={label}
            className="w-full h-full object-cover"
            style={{
              transform: talking ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.35s ease',
            }}
          />
        </div>
        <div
          className="px-2 py-1 flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', borderTop: `1px solid rgba(212,175,55,0.5)` }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${talking ? 'animate-pulse' : ''}`}
            style={{ background: talking ? '#ef4444' : '#64748b' }}
          />
          <span className="text-[8px] md:text-[10px] font-black tracking-[0.12em] uppercase truncate" style={{ color: GOLD }}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
