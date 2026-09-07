import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2, Briefcase, ArrowLeft, Newspaper, MapPinned, Sparkles, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';
import CommandPills from '@/components/layout/CommandPills';
import FirstVisitVoiceGreeting from '@/components/portal/FirstVisitVoiceGreeting';

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
    icon: Building2,
    label: 'I am a Corporate Relocation / HR Manager',
    sub: 'White-glove employee relocation with zero management fees. See how the model works.',
    badge: 'CORPORATE RELO / HR',
    dest: '/corporate-relo',
    roleKey: 'hr',
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
    icon: Briefcase,
    label: 'I am a Brokerage Subscriber',
    sub: 'Manage your firm\'s escrow, listings, agents, and marketing through the Broker/Agent Portal.',
    badge: 'BROKER/AGENT PORTAL',
    dest: '/brokerage',
    roleKey: 'brokerage_admin',
  },
];

const PORTAL_DESTS = Object.fromEntries(PATHS.map(path => [path.roleKey, path.dest]));

const INTEL_BOXES = [
  { label: 'NEWS', path: '/dnn-news', icon: Newspaper },
  { label: 'RELOCATION', path: '/relocation-intake', icon: MapPinned },
  { label: 'INTELLIGENCE', path: '/solutions', icon: Sparkles },
  { label: 'TRANSPARENCY', path: '/transparency', icon: ShieldCheck },
];

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
      {/* ── Admin escape bar — lets admin navigate back out to any other portal from here ── */}
      {isAdmin && (
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0d0d0d' }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1" />
          <CommandPills />
        </div>
      )}

      <FirstVisitVoiceGreeting />

      <ClientHeroMockup />

      {/* ── Path Selection ── */}
      <section className="flex flex-col items-center px-6 pt-2 pb-8" style={{ background: '#ede0cc' }}>

        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10">
          {/* Left: role entry boxes — centered under the copy column above */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
              {visiblePaths.map((path, i) => {
                const Icon = path.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(path)}
                    className="group flex flex-col items-start text-left rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                    style={{
                      minHeight: '179px',
                      padding: '20px',
                      background: '#0a0a0a',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                    }}
                  >
                    <div className="rounded-full flex items-center justify-center mb-2 transition-all"
                      style={{ width: '45px', height: '45px', background: '#ede0cc', border: `2px solid ${GOLD}` }}>
                      <Icon style={{ width: '17.5px', height: '17.5px', color: '#0a0a0a' }} />
                    </div>

                    <span className="font-black tracking-[0.15em] uppercase mb-1.5 rounded-full"
                      style={{ fontSize: '8.25px', padding: '3px 8px', color: '#0a0a0a', background: GOLD }}>
                      {path.badge}
                    </span>

                    <h2 className="font-bold leading-snug mb-1.5"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9625rem', color: '#fff' }}>
                      {path.label}
                    </h2>

                    <p className="leading-relaxed mb-3" style={{ fontSize: '9px', color: '#ffffff' }}>
                      {path.sub}
                    </p>

                    <div className="mt-auto flex items-center gap-2 font-bold transition-all group-hover:gap-3"
                      style={{ fontSize: '12.5px', color: GOLD }}>
                      Enter <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: enlarged Intelligence Bureau boxes — vertically centered under the studio photo */}
          <div className="w-full md:w-1/2 shrink-0 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: '420px' }}>
              {INTEL_BOXES.map(({ label, path, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-95"
                  style={{
                    height: '110px',
                    background: '#0a0a0a',
                    border: `2px solid ${GOLD}`,
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  }}
                >
                  <Icon className="w-7 h-7 shrink-0" style={{ color: GOLD }} />
                  <span className="text-xs font-black tracking-[0.1em] text-center" style={{ color: GOLD }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs" style={{ color: 'rgba(10,10,10,0.35)' }}>
          Dyson &amp; Dyson · 55 Years of Relocation Management
        </p>

        {/* Three-logo footer row — single dark pill backdrop so the dark logo tiles have a proper resting surface */}
        <div className="mt-6 flex items-center justify-center gap-16 md:gap-32 px-10 md:px-16 py-1.5 rounded-full mx-auto"
          style={{ background: '#0a0a0a', border: `1px solid rgba(212,175,55,0.25)`, width: 'fit-content' }}>
          <img src={DNN_LOGO} alt="DNN" className="w-auto object-contain block" style={{ height: '41px' }} />
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="w-auto object-contain block" style={{ height: '41px' }} />
          <img src={INTEL_LOGO} alt="Real Estate Intelligence" className="w-auto object-contain block" style={{ height: '64px' }} />
        </div>
      </section>
    </div>
  );
}