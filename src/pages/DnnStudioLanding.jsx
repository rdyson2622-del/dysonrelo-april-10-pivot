import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const STUDIO_BG = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/47405e279_DNNSTUDIOANDLANDINGPAGE00.png";
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

const PILLS = [
  { label: 'NEWS',         path: '/dnn-news' },
  { label: 'RELOCATION',   path: '/relocation-intake' },
  { label: 'INTELLIGENCE', path: '/solutions' },
];

const ROLE_LABELS = {
  hr: 'Corp Relo HR',
  client: 'Client',
  agent: 'Relo Agent',
  referral_agent: 'Referral Agent',
  vendor: 'Vendor',
};

const ROLE_HOMES = {
  hr: '/corporate-relo',
  client: '/home',
  agent: '/find-agent',
  referral_agent: '/partner-benefits',
  vendor: '/search',
};

export default function DnnStudioLanding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    const onRoleChange = () => setActiveRole(sessionStorage.getItem('dyson_role') || 'client');
    window.addEventListener('dyson_role_change', onRoleChange);
    return () => window.removeEventListener('dyson_role_change', onRoleChange);
  }, []);

  const roleHome = ROLE_HOMES[activeRole] || '/home';
  const roleLabel = ROLE_LABELS[activeRole] || 'Client';

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
            <>
              <button
                onClick={() => navigate('/portal')}
                className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}
              >
                Switch Portal
              </button>
              <button
                onClick={() => navigate(roleHome)}
                className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
              >
                Enter {roleLabel} →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => base44.auth.redirectToLogin()} className="text-xs text-gray-400 hover:text-white">Sign In</button>
              <button onClick={() => navigate('/subscribe')} className="text-xs px-3 py-1.5 rounded-lg gold-btn">Get Started</button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero title ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 text-center" style={{ bottom: '30%' }}>
        <h1 className="text-3xl sm:text-5xl font-black tracking-[0.15em] text-white" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}>
          DNN REAL ESTATE NEWS
        </h1>
      </div>

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
      <div className="absolute left-1/2 -translate-x-1/2 z-20 text-center" style={{ bottom: '14%' }}>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
          DNN Real Estate News · The Intelligence Environment
        </p>
      </div>

      {/* ── Bottom media player controls ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-3" style={{ background: 'rgba(10,11,15,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}>1</div>
          <div className="flex-1 h-1 rounded-full relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: '35%', background: GOLD }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ left: 'calc(35% - 6px)', background: GOLD, boxShadow: '0 0 8px rgba(212,175,55,0.6)' }} />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="text-gray-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            <button className="hover:opacity-80 transition-opacity" style={{ color: GOLD }}><Play className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-white transition-colors"><Volume2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}