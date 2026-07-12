import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2 } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const PATHS = [
  {
    icon: Home,
    label: 'I am an Existing or Potential Client',
    sub: 'Full relocation management, real estate answers, city guides, and concierge service — always free to you.',
    badge: 'CLIENT CONCIERGE',
    dest: '/home',
    roleKey: 'client',
    featured: true,
  },
  {
    icon: Star,
    label: 'I am an Active Real Estate Agent or Broker',
    sub: 'Join our vetted national network and receive managed, pre-qualified relocation clients.',
    badge: 'RELOCATION AGENT NETWORK',
    dest: '/find-agent',
    roleKey: 'agent',
  },
  {
    icon: Handshake,
    label: 'I am an Inactive Real Estate Agent or Broker',
    sub: 'Send us your out-of-state client. We manage everything — your 25% referral fee is protected.',
    badge: 'REFERRAL AGENT NETWORK',
    dest: '/partner-benefits',
    roleKey: 'referral_agent',
  },
  {
    icon: Wrench,
    label: 'I am a Real Estate Vendor',
    sub: 'Movers, inspectors, contractors, and service providers supporting our relocations.',
    badge: 'VENDOR UTILITY',
    dest: '/search',
    roleKey: 'vendor',
  },
  {
    icon: Building2,
    label: 'I am a Corporate Relocation / HR Manager',
    sub: 'White-glove employee relocation with zero management fees. See how the model works.',
    badge: 'CORPORATE RELO / HR',
    dest: '/corporate-relo',
    roleKey: 'client',
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    sessionStorage.setItem('dyson_role', path.roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path.dest);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: '#0a0a0a' }}>

      {/* Logo */}
      <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-16 w-auto mb-6" />

      {/* Headline */}
      <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
        Welcome to Dyson &amp; Dyson
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
        Select your path. Your experience will be tailored exclusively to your needs.
      </p>

      {/* Path Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PATHS.map((path, i) => {
          const Icon = path.icon;
          return (
            <button
              key={i}
              onClick={() => handleSelect(path)}
              className="group flex flex-col items-start text-left p-7 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: path.featured
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                border: `1px solid ${path.featured ? 'rgba(212,175,55,0.55)' : 'rgba(255,255,255,0.22)'}`,
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

              <h2 className="text-white font-bold leading-snug mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}>
                {path.label}
              </h2>

              <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {path.sub}
              </p>

              <div className="mt-auto flex items-center gap-2 text-xs font-bold transition-all group-hover:gap-3"
                style={{ color: GOLD }}>
                Enter <span>→</span>
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