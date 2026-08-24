import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO BACKGROUND — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// This is the ONE VERIFIED correct studio still: real photo, Charlie seated
// at the desk with laptop + "DNN Real Estate News" US-map backdrop, Bob
// standing to the right in frame, native 16:9 (no cropping/AI needed).
// This exact URL is also used live on the RoleSelector hero (/portal).
// If the studio image ever looks wrong anywhere in the app again, the fix
// is to point that component at THIS constant — never generate a new one.
// ══════════════════════════════════════════════════════════════════════════
const STUDIO_BG = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png";
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

// 10-second HeyGen proof render — Charlie test clip, posted here for review only.
const HEYGEN_TEST_CLIP = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/202d15260_charlie-desk-test.mp4";

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
  const [isPlayingWithSound, setIsPlayingWithSound] = useState(false);
  const videoRef = useRef(null);

  const handlePlayWithSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play();
    setIsPlayingWithSound(true);
  };

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
      {/* ── Studio background — HeyGen test render as the full-screen hero video ── */}
      <video
        ref={videoRef}
        src={HEYGEN_TEST_CLIP}
        poster={STUDIO_BG}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Click-to-unmute overlay — browsers block autoplay with sound, so Charlie's
          voice only starts once the visitor explicitly opts in. */}
      {!isPlayingWithSound && (
        <button
          onClick={handlePlayWithSound}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black tracking-widest uppercase transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
            color: '#000',
            boxShadow: '0 4px 20px rgba(212,175,55,0.5)',
          }}
        >
          <Volume2 className="w-4 h-4" /> Tap for Sound
        </button>
      )}
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