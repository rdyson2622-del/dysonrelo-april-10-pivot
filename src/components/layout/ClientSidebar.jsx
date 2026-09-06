import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Zap, Phone, Map, Search, MessageCircle, ChevronDown,
  Newspaper, Archive, DollarSign, Shield, Building2, Home, TrendingUp,
  Star, ArrowRight, ClipboardList, Sparkles, Workflow, FileSignature, Send, UserCog
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import RelocationManagementModal from './RelocationManagementModal';
import SendingAgentModal from '@/components/directory/SendingAgentModal';
import ReceivingAgentModal from '@/components/directory/ReceivingAgentModal';
const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

const authorityLinks = [
  { label: '55-Year Legacy', to: '/bob-dyson' },
  { label: 'The 1927 Parallel', to: '/Explainers#1927' },
  { label: '21 AI Assistants', to: '/ai-assistants' },
];

// Collapsible section header — collapsed by default, expands its children on click.
function CollapsibleGroup({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="mb-1">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:bg-white/10"
        style={{ color: GOLD, background: open ? 'rgba(212,175,55,0.15)' : 'transparent', border: '1px solid rgba(212,175,55,0.3)' }}>
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />}
          {title}
        </span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform" style={{ color: GOLD, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {open && <div className="mt-1 flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}

// Subtle gold-bordered suite box wrapper — collapsible
function SuiteBox({ title, open, onToggle, children }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid rgba(212,175,55,0.55)`, background: 'rgba(212,175,55,0.06)' }}>
        <button onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2"
          style={{ borderBottom: open ? '1px solid rgba(212,175,55,0.2)' : 'none' }}>
          <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD, textShadow: '0 0 8px rgba(212,175,55,0.4)' }}>
            {title}
          </p>
          <ChevronDown className="w-3 h-3 shrink-0 transition-transform" style={{ color: GOLD, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
        {open && (
          <div className="flex flex-col gap-0.5 p-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function NavLink({ to, icon: Icon, label, badge, location }) {
  const active = location.pathname === to;
  return (
    <Link to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
      style={{ background: active ? GOLD : 'transparent', color: active ? '#000' : '#fff' }}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: active ? '#000' : GOLD }} />}
      <span className="flex-1">{label}</span>
      {badge}
    </Link>
  );
}

// Indented sub-item under a collapsible group — lights up gold when it's the current page
function SubLink({ to, label, location }) {
  const active = location.pathname === to;
  return (
    <Link to={to}
      className="flex items-center gap-1.5 pl-8 pr-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all hover:bg-white/10"
      style={{ color: active ? '#000' : 'rgba(212,175,55,0.75)', background: active ? GOLD : 'transparent' }}>
      {label}
    </Link>
  );
}

export default function ClientSidebar({ onToggle }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showRelocationModal, setShowRelocationModal] = useState(false);
  const [showSendingModal, setShowSendingModal] = useState(false);
  const [showReceivingModal, setShowReceivingModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [portalRole, setPortalRole] = useState(null);
  const [subscribed, setSubscribed] = useState(!!localStorage.getItem('dyson_portal'));

  // All header categories start collapsed — expand only when clicked
  const [openGroups, setOpenGroups] = useState({});
  const toggleGroup = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const stored = sessionStorage.getItem('dyson_role');
    if (stored) setPortalRole(stored);

    base44.auth.me().then(user => {
      if (!user?.email) return;
      setUserRole(user.role);
      base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1).then(clients => {
        if (clients.length > 0) {
          const id = clients[0].id;
          base44.entities.ChatMessage.filter({ client_id: id, role: 'admin' }, '-created_date', 10).then(msgs => {
            setUnreadCount(msgs.length);
          });
        }
      });
    });

    // Listen for admin role-switch events from the top nav pills
    const onRoleChange = () => {
      const updated = sessionStorage.getItem('dyson_role');
      setPortalRole(updated || 'client');
      setSubscribed(!!localStorage.getItem('dyson_portal'));
    };
    window.addEventListener('dyson_role_change', onRoleChange);
    return () => window.removeEventListener('dyson_role_change', onRoleChange);
  }, []);

  // Agent/Vendor suites only appear when that portal pill is explicitly active
  const isAgent = userRole === 'agent' || portalRole === 'agent';
  const isReferralAgent = portalRole === 'referral_agent';
  const isVendor = (userRole === 'vendor' || portalRole === 'vendor') && !isAgent;
  const isAdmin = userRole === 'admin';
  // HR portal persists across every page once selected, not just while on /corporate-relo
  const isHR = portalRole === 'hr' || location.pathname === '/corporate-relo';
  // Pure client: no professional path selected
  const isClientOnly = !isAgent && !isVendor;

  const PORTAL_LABELS = {
    client: 'CLIENT PORTAL',
    agent: 'RELOCATION AGENT PORTAL',
    referral_agent: 'INACTIVE LICENSED AGENTS PORTAL',
    vendor: 'VENDOR PORTAL',
    hr: 'YOUR CORPORATE HR PORTAL',
  };
  const portalLabel = PORTAL_LABELS[portalRole]
    || (location.pathname === '/corporate-relo' ? 'YOUR CORPORATE HR PORTAL' : 'CLIENT PORTAL');

  return (
    <aside className="w-56 shrink-0 flex flex-col h-full overflow-hidden"
      style={{ background: '#0d0d0d', borderRight: '1px solid rgba(212,175,55,0.15)' }}>

      {/* Logo */}
      <div className="shrink-0 px-5 py-5 border-b flex flex-col items-center text-center" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <button onClick={onToggle} title="Toggle sidebar" className="mx-auto">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto" />
        </button>
        <p className="text-xs mt-2 tracking-widest font-semibold" style={{ color: GOLD }}>
          {portalLabel}
        </p>
      </div>

      {/* ── Command Center + Relocation Services group ── */}
      <div className="shrink-0 px-4 py-3 flex flex-col gap-1.5" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        {/* Subscribed HR/Client Command Center — promoted above Relocation Services, matching the Agent Command Center pattern */}
        {subscribed && isHR && (
          <Link to="/corporate-relo"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:opacity-90"
            style={{ color: '#000', background: GOLD }}>
            <ClipboardList className="w-3.5 h-3.5 shrink-0" style={{ color: '#000' }} />
            HR COMMAND CENTER
          </Link>
        )}
        {subscribed && isClientOnly && !isHR && (
          <Link to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:opacity-90"
            style={{ color: '#000', background: GOLD }}>
            <ClipboardList className="w-3.5 h-3.5 shrink-0" style={{ color: '#000' }} />
            CLIENT COMMAND CENTER
          </Link>
        )}
        {isAgent && (
          <Link to="/agent-command-center"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:bg-white/10"
            style={{ color: '#000', background: GOLD }}>
            <ClipboardList className="w-3.5 h-3.5 shrink-0" style={{ color: '#000' }} />
            AGENT COMMAND CENTER
          </Link>
        )}

        {/* My Command Center — renamed/promoted to the top of the list */}
        <CollapsibleGroup
          title={(isHR ? 'HR Command Center' : isClientOnly ? 'My Command Center' : 'Communications').toUpperCase()}
          icon={ClipboardList}
          open={!!openGroups.portal}
          onToggle={() => toggleGroup('portal')}
        >
          <Link to="/communications-explainer"
            className="flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all hover:bg-white/10"
            style={{ background: location.pathname === '/communications-explainer' ? GOLD : 'transparent', color: location.pathname === '/communications-explainer' ? '#000' : 'rgba(212,175,55,0.75)' }}>
            <div className="relative shrink-0">
              <MessageCircle className="w-3.5 h-3.5" style={{ color: location.pathname === '/communications-explainer' ? '#000' : GOLD }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black animate-pulse"
                  style={{ background: '#ef4444', color: '#fff' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 ? `${unreadCount} New Reply` : 'Communications Hub'}
          </Link>

          <button
            onClick={() => window.dispatchEvent(new Event('open_talk_to_us'))}
            className="flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all hover:bg-white/10 text-left"
            style={{ color: 'rgba(212,175,55,0.75)' }}>
            <MessageCircle className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
            Talk to Us / My Requests
          </button>
        </CollapsibleGroup>

        {isReferralAgent ? (
          <CollapsibleGroup title="RELOCATION SERVICES" icon={Star} open={!!openGroups.relo} onToggle={() => toggleGroup('relo')}>
            <SubLink to="/referral-agent-explainer" label="Opportunities" location={location} />
            <SubLink to="/referral-process" label="The Referral Process" location={location} />
            <SubLink to="/referral-forms" label="Referral Forms" location={location} />
            <SubLink to="/admin/referral-agent-contacts" label="My Referral Contacts" location={location} />
            <SubLink to="/communications-explainer" label="Communication Hub" location={location} />
          </CollapsibleGroup>
        ) : isHR ? (
          <CollapsibleGroup title="RELOCATION SERVICES" icon={Star} open={!!openGroups.relo} onToggle={() => toggleGroup('relo')}>
            <SubLink to="/corporate-relo" label="Overview" location={location} />
            <SubLink to="/RelocationRoadmap" label="My Roadmaps" location={location} />
            <SubLink to="/CityGuide" label="City Guide" location={location} />
            <SubLink to="/real-estate-answers" label="Real Estate Answers" location={location} />
            <SubLink to="/communications-explainer" label="Communication Hub" location={location} />
            <SubLink to="/solve-my-story" label="Solve My Story" location={location} />
            <SubLink to="/solutions" label="Real Time Real Estate Solutions" location={location} />
            <SubLink to="/corporate-relo" label="Real Estate News" location={location} />
          </CollapsibleGroup>
        ) : (
          <CollapsibleGroup title="RELOCATION SERVICES" icon={Star} open={!!openGroups.relo} onToggle={() => toggleGroup('relo')}>
            <SubLink to="/relocation-intake" label="Overview" location={location} />
            <SubLink to="/RelocationRoadmap" label="My Roadmaps" location={location} />
            <SubLink to="/CityGuide" label="City Guide" location={location} />
            <SubLink to="/real-estate-answers" label="Real Estate Answers" location={location} />
            <SubLink to="/communications-explainer" label="Communication Hub" location={location} />
            <SubLink to="/solve-my-story" label="Solve My Story" location={location} />
            <SubLink to="/solutions" label="Real Time Real Estate Solutions" location={location} />
            <SubLink to="/dnn-news" label="Real Estate News" location={location} />
          </CollapsibleGroup>
        )}

        {isAgent && (
          <>
            <button
              onClick={() => setShowSendingModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:bg-white/10 text-left"
              style={{ color: GOLD, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
              I AM A REFERRAL SENDING AGENT
            </button>
            <button
              onClick={() => setShowReceivingModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition-all hover:bg-white/10 text-left"
              style={{ color: GOLD, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
              I AM A REFERRAL RECEIVING AGENT
            </button>
          </>
        )}
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto flex flex-col">

        {/* ══ AGENT PATH: 3-SUITE LAYOUT ══ */}
        {isAgent && (
          <>
            {/* SUITE 2: Client Retention Loop — admin only */}
            {isAdmin && (
              <SuiteBox title="🤝 Client Retention Loop" open={!!openGroups.retention} onToggle={() => toggleGroup('retention')}>
                <NavLink to="/agent-invited-clients" icon={TrendingUp} location={location} label="Track My Referrals" />
                <NavLink to="/financial-services" icon={DollarSign} location={location} label="Lender-Solve Status" />
              </SuiteBox>
            )}
            <SuiteBox title="🏠 My Personal Real Estate" open={!!openGroups.agentPersonal} onToggle={() => toggleGroup('agentPersonal')}>
              <NavLink to="/RelocationRoadmap" icon={Map} location={location} label="My Roadmap" />
              <NavLink to="/solve-my-story" icon={Home} location={location} label="Solve My Story" />
              <NavLink to="/CityGuide" icon={MapPin} location={location} label="City Guide" />
              <NavLink to="/GeminiSession" icon={Zap} location={location} label="Gemini Session" />
            </SuiteBox>
          </>
        )}

        {/* ══ VENDOR PATH ══ */}
        {isVendor && !isAgent && (
          <>
            <SuiteBox title="🔧 Vendor Utility" open={!!openGroups.vendorUtility} onToggle={() => toggleGroup('vendorUtility')}>
              <NavLink to="/search" icon={Search} location={location} label="Property Search" />
              {isAdmin && (
                <NavLink to="/admin/skip-trace" icon={Building2} location={location} label="Verified Owner Data" />
              )}
            </SuiteBox>
            <SuiteBox title="🏠 My Personal Real Estate" open={!!openGroups.vendorPersonal} onToggle={() => toggleGroup('vendorPersonal')}>
              <NavLink to="/RelocationRoadmap" icon={Map} location={location} label="My Roadmap" />
              <NavLink to="/solve-my-story" icon={Home} location={location} label="Solve My Story" />
              <NavLink to="/CityGuide" icon={MapPin} location={location} label="City Guide" />
              <NavLink to="/GeminiSession" icon={Zap} location={location} label="Gemini Session" />
            </SuiteBox>
          </>
        )}

        {/* DNN Section */}
        {!isHR && (
          <div className="px-3 pb-4 pt-2">
            <CollapsibleGroup title="Dyson News Network" icon={Newspaper} open={!!openGroups.dnn} onToggle={() => toggleGroup('dnn')}>
              {!isClientOnly && <SubLink to="/dnn-news" label="DNN News" location={location} />}
              <SubLink to="/dnn-archive" label="Broadcast Archive" location={location} />
              <SubLink to="/my-agent" label="Vette an Agent" location={location} />
              <SubLink to="/financial-services" label="Select a Lender" location={location} />
            </CollapsibleGroup>
          </div>
        )}

        {/* Heritage & Authority */}
        <div className="pt-3 border-t mx-3 px-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <CollapsibleGroup title="Our Authority" icon={Shield} open={!!openGroups.authority} onToggle={() => toggleGroup('authority')}>
            {authorityLinks.map(({ label, to }) => (
              <SubLink key={label} to={to} label={label} location={location} />
            ))}
          </CollapsibleGroup>
        </div>

        {/* Human Help */}
        <div className="mx-3 mt-3 mb-3 rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-xs font-bold tracking-widest mb-1" style={{ color: GOLD }}>NEED A HUMAN?</p>
          <p className="text-xs mb-2" style={{ color: '#fff' }}>Mon–Sat, 9am–7pm PT</p>
          <a href="tel:+18583531200" className="flex items-center gap-2 group">
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
            <span className="text-sm font-bold tracking-wide group-hover:underline" style={{ color: '#fff' }}>
              (858) 353-1200
            </span>
          </a>
        </div>

      </div>

      <RelocationManagementModal isOpen={showRelocationModal} onClose={() => setShowRelocationModal(false)} />
      {showSendingModal && <SendingAgentModal onClose={() => setShowSendingModal(false)} />}
      {showReceivingModal && <ReceivingAgentModal onClose={() => setShowReceivingModal(false)} />}
    </aside>
  );
}