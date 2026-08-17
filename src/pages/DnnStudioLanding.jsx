import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const STUDIO_BG = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/47405e279_DNNSTUDIOANDLANDINGPAGE00.png";
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

const PILLS = [
  { label: 'NEWS',         path: '/dnn-news' },
  { label: 'RELOCATION',   path: '/relocation-intake' },
  { label: 'INTELLIGENCE', path: '/solutions' },
];

export default function DnnStudioLanding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#0A0B0F' }}>
      {/* ── Studio background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${STUDIO_BG})` }}
      />
      {/* Subtle dark gradient for pill legibility at the bottom */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,11,15,0.85) 0%, rgba(10,11,15,0.25) 35%, transparent 60%)' }} />

      {/* ── Top bar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
          </span>
          <img src={DYSON_LOGO} alt="Dyson & Dyson" style={{ height: '34px', width: 'auto', opacity: 0.9 }} />
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/portal')}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}
            >
              Switch Portal
            </button>
          ) : (
            <>
              <button onClick={() => base44.auth.redirectToLogin()} className="text-xs text-gray-400 hover:text-white">Sign In</button>
              <button onClick={() => navigate('/subscribe')} className="text-xs px-3 py-1.5 rounded-lg gold-btn">Get Started</button>
            </>
          )}
        </div>
      </header>

      {/* ── Three gold pills — centered, ~20% up from bottom ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-5" style={{ bottom: '20%' }}>
        {PILLS.map((pill) => (
          <button
            key={pill.label}
            onClick={() => navigate(pill.path)}
            className="px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base font-black tracking-[0.18em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: 'rgba(197,160,89,0.18)',
              border: `1.5px solid ${GOLD}`,
              color: GOLD,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `0 0 24px rgba(212,175,55,0.35), inset 0 0 12px rgba(212,175,55,0.08)`,
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* ── Tagline under pills ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 text-center" style={{ bottom: '12%' }}>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
          DNN Real Estate News · The Intelligence Environment
        </p>
      </div>
    </div>
  );
}