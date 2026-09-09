import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Shield, Building2, Users, Megaphone, Star,
  ArrowLeft, Loader2, Home, PanelLeftClose, PanelLeftOpen, FileSearch, ShoppingBag, Handshake
} from 'lucide-react';
import BrokerageOnboarding from '@/components/brokerage/BrokerageOnboarding';
import BrokerageAlertBanner from '@/components/brokerage/BrokerageAlertBanner';
import ReferralFloatingPill from '@/components/portal/ReferralFloatingPill';

const GOLD = '#D4AF37';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',                  icon: LayoutDashboard, path: '/brokerage' },
  { id: 'escrow',     label: 'Escrows',                     icon: Shield,          path: '/brokerage/escrow' },
  { id: 'audit',      label: 'Doc Audit',                   icon: FileSearch,      path: '/brokerage/audit' },
  { id: 'listings',   label: 'Listing Clients',             icon: Building2,       path: '/brokerage/listings' },
  { id: 'buying',     label: 'Buying Clients',              icon: ShoppingBag,     path: '/brokerage/buying-clients' },
  { id: 'agents',     label: 'Company Agents and Other Agents', icon: Users,       path: '/brokerage/agents' },
  { id: 'referrals',  label: 'My Agent Referrals',          icon: Handshake,       path: '/brokerage/referrals' },
  { id: 'marketing',  label: 'Marketing Campaigns',         icon: Megaphone,       path: '/brokerage/marketing' },
  { id: 'luxury',     label: 'Luxury Presence Website',     icon: Star,            path: '/brokerage/luxury' },
];

export default function BrokerageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('brokerage_sidebar_collapsed')) || false; }
    catch { return false; }
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      // Not authenticated — send to login, return here after
      base44.auth.redirectToLogin(window.location.pathname);
    });
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('brokerage_sidebar_collapsed', JSON.stringify(next));
      return next;
    });
  };

  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  // Fetch the brokerage record — admin sees the first (Wisdom), brokerage users see their own
  const { data: brokerage, isLoading } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) {
        return await base44.entities.Brokerage.get(userBrokerageId);
      }
      return null;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const isPlatformAdmin = user.role === 'admin';

  // Gate: non-admin users without a brokerage_id must complete onboarding first
  if (!isPlatformAdmin && !userBrokerageId) {
    return <BrokerageOnboarding />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* ── Sidebar (unified sleek shape & design) ── */}
      <aside 
        className="w-[310px] sm:w-[320px] h-screen bg-[#0a0a0a] text-white shrink-0 flex flex-col border-r border-[#D4AF37]/30 shadow-2xl overflow-y-auto select-none"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212,175,55,0.3) transparent',
        }}
      >
        <div className="p-3.5 space-y-3 flex-1">
          
          {/* TOP BRAND HEADER PILL */}
          <div 
            onClick={() => navigate('/brokerage')}
            className="p-2.5 rounded-2xl bg-black border border-[#D4AF37]/40 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
              <span className="font-serif text-base font-bold text-[#D4AF37]">W</span>
            </div>
            <div className="min-w-0">
              <div 
                className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight truncate"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {brokerage?.name || 'Wisdom Properties'}
              </div>
              <div className="text-[8px] font-black uppercase tracking-[0.15em] text-[#D4AF37] truncate">
                BROKERAGE RELOCATION PORTAL
              </div>
            </div>
          </div>

          {/* 55+ YEARS PILL */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full border border-[#D4AF37]/60 bg-black/60 text-[10px] font-black tracking-widest text-[#D4AF37] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>55+ YEARS • BROKERAGE DESK</span>
          </div>

          {/* AUDIT / SEARCH DESTINATIONS CARD */}
          <div 
            className="p-3.5 rounded-2xl text-left text-[#0a0a0a] shadow-md border border-[#D4AF37]/40 space-y-2"
            style={{ background: '#ede0cc' }}
          >
            <div className="text-center space-y-0.5">
              <h2 
                className="text-lg font-bold tracking-tight text-[#0a0a0a] leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Audit Escrow or Listing
              </h2>
              <p className="text-xs italic font-serif font-bold text-[#854d0e]">
                Or Let Us Vet Any Listing For You.
              </p>
            </div>

            <p className="text-[11px] text-center text-[#44382c] leading-snug px-1">
              Enter Escrow #, address, or paste link from MLS, Realtor, or Homes.com
            </p>

            <button
              type="button"
              onClick={() => navigate('/brokerage/audit')}
              className="w-full py-2 px-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <FileSearch className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>CLICK TO AUDIT →</span>
            </button>
          </div>

          {/* SIGNED IN STATUS STRIP */}
          <div className="py-2 px-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
              <span className="text-white/90 font-medium truncate">
                Signed In: <strong className="text-white font-bold">{user?.full_name || 'Wisdom Broker'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/brokerage')}
              className="text-[11px] font-bold text-[#D4AF37] hover:text-white transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Desk</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

          {/* SECTION: BROKERAGE WORKSPACE: select one */}
          <div className="space-y-1.5 pt-1 text-left">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
              <span>BROKERAGE WORKSPACE:</span>
              <span className="text-white/40 normal-case font-normal text-[10px]">select one</span>
            </div>

            {/* Escrow Management & Doc Audit */}
            <div
              onClick={() => navigate('/brokerage/escrow')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">Escrow &amp; Doc Audit</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#10b981] shrink-0">
                    AUDIT LIVE
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#0a0a0a] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Real-time transaction &amp; milestone tracking
              </p>
            </div>

            {/* Listing & Buying Clients */}
            <div
              onClick={() => navigate('/brokerage/listings')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">Listing &amp; Buying Clients</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] shrink-0">
                    PIPELINE
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#0a0a0a] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Active buyer &amp; seller transaction files
              </p>
            </div>

            {/* Company & Affiliate Agents */}
            <div
              onClick={() => navigate('/brokerage/agents')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">Company &amp; Affiliate Agents</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#1d4ed8] text-white shrink-0">
                    ROSTER
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#0a0a0a] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Internal roster &amp; receiving agent bureau
              </p>
            </div>

            {/* My Agent Referrals */}
            <div
              onClick={() => navigate('/brokerage/referrals')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">My Agent Referrals</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37] shrink-0">
                    25% SPLIT
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#0a0a0a] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Track 25% referral commissions &amp; handoffs
              </p>
            </div>

            {/* Luxury Presence Website */}
            <div
              onClick={() => navigate('/brokerage/luxury')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">Luxury Presence Website</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#047857] text-white shrink-0">
                    LIVE SITE
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#0a0a0a] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Custom brokerage portal &amp; luxury brand
              </p>
            </div>
          </div>

          {/* SECTION: CONCIERGE SYSTEMS: direct */}
          <div className="space-y-1.5 pt-1 text-left">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
              <span>CONCIERGE SYSTEMS:</span>
              <span className="text-white/40 normal-case font-normal text-[10px]">direct</span>
            </div>

            {/* Talk with Charlie */}
            <div
              onClick={() => navigate('/talking-app')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">Talk with Charlie</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-white shrink-0">
                    VOICE AI
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#86efac] border border-[#10b981] shrink-0 ml-auto" />
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                Ask anything, vet agents &amp; navigate
              </p>
            </div>

            {/* 6AM DNN News Broadcast */}
            <div
              onClick={() => navigate('/dnn-news')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-[#0a0a0a] truncate">6AM DNN News Broadcast</span>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#dc2626] text-white shrink-0">
                    DAILY
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#854d0e] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto">
                  Open →
                </span>
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                AI Charlie &amp; Bob • Daily Housing Pulse
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM DOCKED: CONCIERGE DIRECT */}
        <div className="p-3 border-t border-white/15 bg-black/90 text-left space-y-2 shrink-0">
          <div 
            className="p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-inner"
            style={{ background: '#ede0cc', color: '#0a0a0a' }}
          >
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>CONCIERGE DIRECT</span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-[#0a0a0a] tracking-tight">
                (858) 353–1200
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="tel:+18583531200"
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
                title="Call Fiduciary Desk"
              >
                <span>Call</span>
              </a>
              <a
                href="sms:+18583531200"
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
                title="Text Fiduciary Desk"
              >
                <span>Text</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 sticky top-0 z-10" style={{ background: '#0a0a0a' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.history?.state?.idx > 0) {
                  navigate(-1);
                } else {
                  navigate('/brokerage');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80 cursor-pointer"
              style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
              Broker/Agent Portal
            </span>
            {isPlatformAdmin && (
              <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
                Admin View
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        {/* Real-time critical alerts — live across all portal pages */}
        <BrokerageAlertBanner />

        {/* Page content */}
        <Outlet />
        <ReferralFloatingPill />
      </main>
    </div>
  );
}