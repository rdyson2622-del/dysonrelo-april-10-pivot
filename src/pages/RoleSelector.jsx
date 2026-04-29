import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Wrench } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const PATHS = [
  {
    icon: Home,
    label: 'I am a Homeowner / Consumer',
    sub: 'Relocation concierge, city guides, agent matching, and escrow management.',
    badge: 'CLIENT CONCIERGE',
    dest: '/dashboard',
    roleKey: 'consumer',
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.04) 100%)',
    border: 'rgba(212,175,55,0.5)',
  },
  {
    icon: Briefcase,
    label: 'I am an Agent / Lender',
    sub: 'PRN tools, skip trace, lead loop, lender pairing, and referral pipeline.',
    badge: 'PRN ENTERPRISE',
    dest: '/find-agent',
    roleKey: 'agent',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
    border: 'rgba(255,255,255,0.3)',
  },
  {
    icon: Wrench,
    label: 'I am a Service Vendor',
    sub: 'Property ownership verification, job site lookup, and contractor data access.',
    badge: 'VENDOR UTILITY',
    dest: '/search',
    roleKey: 'vendor',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
    border: 'rgba(255,255,255,0.2)',
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    // Store role preference in sessionStorage so sidebar can read it
    sessionStorage.setItem('dyson_role', path.roleKey);
    navigate(path.dest);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: '#0a0a0a' }}>

      {/* Logo */}
      <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-16 w-auto mb-6" />

      {/* Headline */}
      <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
        Welcome to the Ecosystem
      </p>
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '0.05em',
        textAlign: 'center',
        lineHeight: 1.15,
        marginBottom: '0.5rem',
      }}>
        How Are You Here Today?
      </h1>
      <p className="text-sm mb-12 text-center max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Select your path. Your portal will be tailored exclusively to your needs.
      </p>

      {/* Path Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5">
        {PATHS.map((path) => {
          const Icon = path.icon;
          return (
            <button
              key={path.roleKey}
              onClick={() => handleSelect(path)}
              className="group flex flex-col items-start text-left p-7 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: path.gradient,
                border: `1px solid ${path.border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all"
                style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.3)` }}>
                <Icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>

              <span className="text-[9px] font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>
                {path.badge}
              </span>

              <h2 className="text-white font-bold text-base leading-snug mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}>
                {path.label}
              </h2>

              <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {path.sub}
              </p>

              <div className="mt-auto flex items-center gap-2 text-xs font-bold transition-all group-hover:gap-3"
                style={{ color: GOLD }}>
                Enter Portal <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-12 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
        Dyson &amp; Dyson · 55 Years of Relocation Management
      </p>
    </div>
  );
}