import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2 } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

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

  // Subscribed visitors go straight to their portal — unless they explicitly
  // asked for the landing page (logo click adds ?choose=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('choose')) return;
    try {
      const saved = JSON.parse(localStorage.getItem('dyson_portal'));
      if (saved?.dest) {
        sessionStorage.setItem('dyson_role', saved.roleKey || 'client');
        window.dispatchEvent(new Event('dyson_role_change'));
        navigate(saved.dest, { replace: true });
      }
    } catch {}
  }, [navigate]);

  const handleSelect = (path) => {
    sessionStorage.setItem('dyson_role', path.roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path.dest);
  };

  return (
    <div className="bg-black">
      {/* ── Hero: DNN Studio backdrop, full screen, clean ── */}
      <section
        className="relative h-screen"
        style={{
          backgroundImage: `url('${STUDIO_BG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

        {/* Three pills — positioned just below the studio desk/map area */}
        <div className="absolute left-0 right-0 flex items-center justify-start gap-4 md:gap-6 pl-[18%]"
          style={{ top: '60%' }}>
          {['News', 'Relocation', 'Intelligence'].map((word) => (
            <div
              key={word}
              className="flex items-center justify-center px-6 md:px-8 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(212,180,106,0.12) 0%, rgba(212,180,106,0.04) 100%)',
                border: '1px solid rgba(212,180,106,0.45)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                minWidth: '7rem',
                maxWidth: '12rem',
                height: '3.25rem',
              }}
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{
                  color: '#d4b46a',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  fontSize: word.length > 6 ? '1.15rem' : '1.5rem',
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-8">
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.5rem, 3.75vw, 2.4rem)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.05em',
              textAlign: 'center',
              lineHeight: 1.15,
              marginBottom: '0.5rem',
            }}
          >
            How Are You Here Today?
          </h1>
          <p className="text-sm text-center max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Select your path. Your experience will be tailored exclusively to your needs.
          </p>
        </div>
      </section>

      {/* ── Path Selection ── */}
      <section className="flex flex-col items-center px-6 pt-8 pb-16 bg-black">

        <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PATHS.map((path, i) => {
            const Icon = path.icon;
            return (
              <button
                key={i}
                onClick={() => handleSelect(path)}
                className="group flex flex-col items-start text-left p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                style={{
                  background: path.featured
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                  border: `1px solid ${path.featured ? 'rgba(212,175,55,0.55)' : 'rgba(255,255,255,0.22)'}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 transition-all"
                  style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.3)` }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>

                <span className="text-[8px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>
                  {path.badge}
                </span>

                <h2 className="text-white font-bold leading-snug mb-3"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}>
                  {path.label}
                </h2>

                <p className="text-[11px] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {path.sub}
                </p>

                <div className="mt-auto flex items-center gap-2 text-[11px] font-bold transition-all group-hover:gap-3"
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
      </section>
    </div>
  );
}