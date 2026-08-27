import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO ASSETS — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// Same still/loop used on DnnStudioLanding.jsx, BroadcastShow.jsx, RoleSelector.jsx.
// ══════════════════════════════════════════════════════════════════════════
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

const PILLS = [
  { label: 'NEWS',         path: '/broadcast-show',     icon: Newspaper },
  { label: 'RELOCATION',   path: '/relocation-intake',  icon: MapPin },
  { label: 'INTELLIGENCE', path: '/solutions',          icon: Sparkles },
  { label: 'TRANSPARENCY', path: '/transparency',       icon: ShieldCheck },
];

/**
 * StudioHeroBanner — the shared DNN Studio hero (looping Charlie-at-desk
 * video + News/Relocation/Intelligence/Transparency nav) reused at the top
 * of every portal's home page, above that portal's own custom content.
 */
export default function StudioHeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 sm:px-6 pt-6 pb-8" style={{ background: '#0A0B0F' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-4">
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

          <div className="flex flex-row md:flex-col justify-center gap-3 md:w-56 w-full">
            {PILLS.map((pill) => (
              <button
                key={pill.label}
                onClick={() => navigate(pill.path)}
                className="flex-1 md:flex-none flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm sm:text-base font-black tracking-[0.14em] transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
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

        <p className="text-center mt-6 text-base sm:text-lg italic font-semibold tracking-wide" style={{ color: GOLD }}>
          "We provide a lifetime workspace designed to maximize your real estate opportunities.
        </p>
        <p className="text-center mt-1 text-base sm:text-lg italic font-semibold tracking-wide" style={{ color: GOLD }}>
          No sales pitches, just real-time solutions and a clear path to execute results."
        </p>
        <p className="text-center mt-2 text-sm italic" style={{ color: GOLD }}>
          — Bob Dyson
        </p>
      </div>
    </div>
  );
}