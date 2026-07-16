import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2 } from 'lucide-react';
import LandingBroadcastPlayer from '@/components/dnn/LandingBroadcastPlayer';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const INTEL_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/67bc7aa5a_generated_image.png';
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
    label: 'I am an Inactive but licensed Real Estate Agent or Broker',
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
    roleKey: 'hr',
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(true);

  // Deep-link hash redirect — e.g. 1dnn.com/#news goes straight to the news page
  // (social media teaser links). Takes priority over saved portal redirect.
  useEffect(() => {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const deepLinks = { news: '/dnn-news', relocation: '/home', intelligence: '/solve-my-story' };
    if (deepLinks[hash]) {
      navigate(deepLinks[hash], { replace: true });
      return;
    }

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

  const handleEnter = () => {
    setShowPlayer(false);
    // Scroll to path selection
    setTimeout(() => {
      document.getElementById('path-selection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelect = (path) => {
    sessionStorage.setItem('dyson_role', path.roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path.dest);
  };

  return (
    <div className="bg-black">
      {/* ── Hero: Live DNN Broadcast Player (both boxes, stings, logos baked in) ── */}
      {showPlayer && <LandingBroadcastPlayer onEnter={handleEnter} />}

      {/* ── Path Selection ── */}
      <section id="path-selection" className="flex flex-col items-center px-6 pt-2 pb-8 bg-black">

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

        <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Dyson &amp; Dyson · 55 Years of Relocation Management
        </p>

        {/* Three-logo footer row */}
        <div className="mt-6 flex items-center justify-center gap-16 md:gap-32">
          <img src={DNN_LOGO} alt="DNN" className="w-auto object-contain" style={{ height: '60px' }} />
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="w-auto object-contain" style={{ height: '60px' }} />
          <img src={INTEL_LOGO} alt="Real Estate Intelligence" className="w-auto object-contain" style={{ height: '120px' }} />
        </div>
      </section>
    </div>
  );
}