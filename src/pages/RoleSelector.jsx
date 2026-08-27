import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const INTEL_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/67bc7aa5a_generated_image.png';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const STUDIO_WITH_ANCHORS = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/80129619f_Screenshot2026-08-01at31026PM.png';
const DNN_STUDIO_PHOTO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

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
    dest: '/agent-command-center',
    roleKey: 'agent',
  },
  {
    icon: Handshake,
    label: 'I am an Inactive but licensed Real Estate Agent or Broker',
    sub: 'Send us your out-of-state client. We manage everything — your 25% referral fee is protected.',
    badge: 'INACTIVE LICENSED AGENTS',
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
  {
    icon: Briefcase,
    label: 'I am a Brokerage Subscriber',
    sub: 'Manage your firm\'s escrow, listings, agents, and marketing through the Broker/Agent Portal.',
    badge: 'BROKER/AGENT PORTAL',
    dest: '/brokerage',
    roleKey: 'brokerage_admin',
  },
];

const PORTAL_DESTS = Object.fromEntries(PATHS.map(path => [path.roleKey, path.dest]));

export default function RoleSelector() {
  const navigate = useNavigate();
  const [assignedRole, setAssignedRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessReady, setAccessReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('dyson_portal')); } catch {}

    base44.auth.me().then(user => {
      const admin = user?.role === 'admin';
      const assigned = admin ? null : (user?.portal_role || saved?.roleKey || null);
      setIsAdmin(admin);
      setAssignedRole(assigned);
      if (assigned) {
        sessionStorage.setItem('dyson_role', assigned);
        window.dispatchEvent(new Event('dyson_role_change'));
      }
      setAccessReady(true);
      if (!params.get('choose') && assigned) {
        navigate(PORTAL_DESTS[assigned] || saved?.dest || '/home', { replace: true });
      }
    }).catch(() => {
      const assigned = saved?.roleKey || null;
      setAssignedRole(assigned);
      setAccessReady(true);
      if (!params.get('choose') && assigned) navigate(PORTAL_DESTS[assigned], { replace: true });
    });
  }, [navigate]);

  const handleSelect = (path) => {
    const selected = !isAdmin && assignedRole
      ? PATHS.find(item => item.roleKey === assignedRole)
      : path;
    sessionStorage.setItem('dyson_role', selected.roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(selected.dest);
  };

  const visiblePaths = isAdmin || !assignedRole
    ? PATHS
    : PATHS.filter(path => path.roleKey === assignedRole);

  if (!accessReady) return <div className="min-h-screen bg-black" />;

  return (
    <div className="bg-black">
      {/* ── Hero: DNN Studio backdrop, full screen, clean ── */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          src={STUDIO_LOOP_VIDEO}
          poster={DNN_STUDIO_PHOTO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        {/* Three pills — direct routing to News / Relocation / Intelligence */}
        <div className="absolute left-0 right-0 flex items-center justify-center gap-8 md:gap-16 px-6"
          style={{ bottom: '18%' }}>
          {[
            { word: 'News', dest: '/broadcast-show', sub: "Today's Clips" },
            { word: 'Relocation', dest: '/relocation-intake', sub: 'Free Access' },
            { word: 'Intelligence', dest: '/real-estate-answers', sub: 'Tell Your Story' },
          ].map((pill) => (
            <button
              key={pill.word}
              onClick={() => navigate(pill.dest)}
              className="flex flex-col items-center justify-center px-6 md:px-8 py-2 rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:opacity-90 cursor-pointer group"
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
                  fontSize: pill.word.length > 6 ? '1.15rem' : '1.5rem',
                }}
              >
                {pill.word}
              </span>
              <span
                className="text-[8px] tracking-[0.2em] uppercase mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: '#d4b46a' }}
              >
                {pill.sub}
              </span>
            </button>
          ))}
        </div>

        <div className="absolute left-0 right-0 flex flex-col items-center px-6" style={{ bottom: '6%' }}>
          <p className="text-xl md:text-2xl text-center whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Cormorant Garamond, serif' }}>
            {assignedRole && !isAdmin
              ? 'Return to your subscribed portal below.'
              : 'Select your path below and your experience will be tailored exclusively to your needs.'}
          </p>
        </div>
      </section>

      {/* ── Path Selection ── */}
      <section className="flex flex-col items-center px-6 pt-2 pb-8 bg-black">

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePaths.map((path, i) => {
            const Icon = path.icon;
            return (
              <button
                key={i}
                onClick={() => handleSelect(path)}
                className="group flex flex-col items-start text-left p-7 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  minHeight: '260px',
                  background: '#ede0cc',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all"
                  style={{ background: '#0a0a0a', border: `2px solid ${GOLD}` }}>
                  <Icon className="w-6 h-6" style={{ color: GOLD }} />
                </div>

                <span className="text-[10px] font-black tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded-full"
                  style={{ color: '#0a0a0a', background: GOLD }}>
                  {path.badge}
                </span>

                <h2 className="font-bold leading-snug mb-3"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#0a0a0a' }}>
                  {path.label}
                </h2>

                <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'rgba(10,10,10,0.65)' }}>
                  {path.sub}
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-bold transition-all group-hover:gap-3"
                  style={{ color: '#0a0a0a' }}>
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