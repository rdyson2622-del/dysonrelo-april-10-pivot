import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO BACKGROUND — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// Verified real studio still: Charlie seated at desk with laptop + "DNN Real
// Estate News" US-map backdrop, Bob standing to the right in frame, native
// 16:9. Same URL used on Admin.jsx and BroadcastShow.jsx.
// ══════════════════════════════════════════════════════════════════════════
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO BACKGROUND — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// This is the ONE VERIFIED correct studio still: real photo, Charlie seated
// at the desk with laptop + "DNN Real Estate News" US-map backdrop, Bob
// standing to the right in frame, native 16:9 (no cropping/AI needed).
// This exact URL is also used live on the RoleSelector hero (/portal).
// If the studio image ever looks wrong anywhere in the app again, the fix
// is to point that component at THIS constant — never generate a new one.
// ══════════════════════════════════════════════════════════════════════════
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

const PILLS = [
  { label: 'NEWS',         path: '/broadcast-show' },
  { label: 'RELOCATION',   path: '/relocation-intake' },
  { label: 'INTELLIGENCE', path: '/solutions' },
  { label: 'TRANSPARENCY', path: '/transparency' },
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
    <div className="relative min-h-screen w-full" style={{ background: '#0A0B0F' }}>
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

      {/* ── Studio hero (left) + rectangular nav boxes (right) ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-1 pb-10">
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {/* Locked DNN Studio hero — the ONLY studio visual on this page */}
          <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ef4444', color: '#ef4444' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
            <img
              src={STUDIO_STILL}
              alt="DNN Real Estate News Studio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rectangular nav boxes — same box style seen on later pages */}
          <div className="flex flex-row md:flex-col gap-3 md:w-56">
            {PILLS.map((pill) => (
              <button
                key={pill.label}
                onClick={() => navigate(pill.path)}
                className="flex-1 md:flex-none px-4 py-5 rounded-xl text-sm sm:text-base font-black tracking-[0.14em] transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
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
        </div>

        <p
          className="text-center mt-6 text-sm sm:text-base font-semibold tracking-wide"
          style={{ color: GOLD }}
        >
          The lifetime real estate working site built to improve your opportunities from your first move to your last.
        </p>
      </div>
    </div>
  );
}