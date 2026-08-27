import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FindAProWidget from '@/components/portal/FindAProWidget';
import PropertyPlatformSearch from '@/components/portal/PropertyPlatformSearch';
import LockedToolsDrawer from '@/components/portal/LockedToolsDrawer';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO BACKGROUND — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// Verified real studio still: Charlie seated at desk with laptop + "DNN Real
// Estate News" US-map backdrop, Bob standing to the right in frame, native
// 16:9. Same URL used on Admin.jsx and BroadcastShow.jsx.
// ══════════════════════════════════════════════════════════════════════════
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
// Animated silent placeholder — real HeyGen render of Charlie at the DNN desk (Show 2),
// muted + looped so visitors see movement/life in the studio while the daily show is finished.
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

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
  { label: 'NEWS',         path: '/broadcast-show',     icon: Newspaper },
  { label: 'RELOCATION',   path: '/relocation-intake',  icon: MapPin },
  { label: 'INTELLIGENCE', path: '/solutions',          icon: Sparkles },
  { label: 'TRANSPARENCY', path: '/transparency',       icon: ShieldCheck },
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
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Locked DNN Studio hero — the ONLY studio visual on this page */}
          <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ef4444', color: '#ef4444' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
            <video
              src={STUDIO_LOOP_VIDEO}
              poster={STUDIO_STILL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Square nav boxes — matches the box style used on all other pages, centered beside the studio box */}
          <div className="flex flex-row md:flex-col justify-center gap-3 md:w-56">
            {PILLS.map((pill) => (
              <button
                key={pill.label}
                onClick={() => navigate(pill.path)}
                className="flex-1 md:flex-none flex flex-col items-center justify-center gap-2 px-2 py-6 text-[10px] sm:text-xs font-black tracking-[0.08em] text-center leading-tight transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: '#0a0a0a',
                  border: `1.5px solid ${GOLD}`,
                  color: GOLD,
                  boxShadow: `0 0 24px rgba(212,175,55,0.35), inset 0 0 12px rgba(212,175,55,0.08)`,
                }}
              >
                <pill.icon className="w-5 h-5" style={{ color: GOLD }} />
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        <p
          className="text-center mt-8 text-lg sm:text-xl italic font-semibold tracking-wide"
          style={{ color: GOLD }}
        >
          "We provide a lifetime workspace designed to maximize your real estate opportunities.
        </p>
        <p className="text-center mt-1 text-lg sm:text-xl italic font-semibold tracking-wide" style={{ color: GOLD }}>
          No sales pitches, just real-time solutions and a clear path to execute results."
        </p>
        <p className="text-center mt-2 text-sm sm:text-base italic" style={{ color: GOLD }}>
          — Bob Dyson
        </p>

        <div className="mt-12 rounded-2xl p-6" style={{ background: '#111', border: `1px solid rgba(212,175,55,0.3)` }}>
          <FindAProWidget />
        </div>

        <div className="mt-6 rounded-2xl p-6" style={{ background: '#111', border: `1px solid rgba(212,175,55,0.3)` }}>
          <PropertyPlatformSearch />
        </div>
      </div>

      <LockedToolsDrawer />
    </div>
  );
}