import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search,
  SendHorizontal, Flag, MessageCircle, FileText, Link as LinkIcon, ScrollText,
  ArrowRight, Fingerprint, List, Brain, AlertTriangle, ChevronDown,
  ChevronRight as ChevronRightIcon, Calendar, Video, Newspaper, Star, Package,
  Edit, Globe, Send, Shield, TrendingUp, FileCheck, DollarSign, BookOpen, Zap,
  Clapperboard, Library, Monitor, Plug, GitBranch, Bot, Map, Building2, UserPlus,
  FileSearch, ShoppingBag, Archive, DoorOpen, ShieldCheck, MapPin, ClipboardList, Megaphone,
  Mail, PhoneCall
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';
import AdminCommsBadge from '@/components/admin/AdminCommsBadge';
import AdminCharlieCard from '@/components/admin/AdminCharlieCard';
import AdminDispatchWidget from '@/components/admin/AdminDispatchWidget';
import AdminSidebarSearch, { buildSearchIndex } from '@/components/admin/AdminSidebarSearch';
import ListingProspectsRepWidget from '@/components/admin/ListingProspectsRepWidget';
import SubscriberInviteModal from '@/components/admin/SubscriberInviteModal';
import AdminWorkingModelsScroll from '@/components/admin/AdminWorkingModelsScroll';
import AdminMiniAppsGrid from '@/components/admin/AdminMiniAppsGrid';
const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// All collapsible section groups
const NAV_SECTIONS = [
  {
    key: 'quick_links',
    label: 'QUICK LINKS',
    children: [
      { isCommsBadge: true },
      { label: '📱 10 PLATFORM APPS & SPRINGBOARD SPECS', path: '/admin/app-store-mockup', icon: Star, highlight: true },
      { isWorkingModelsScroll: true },
      { label: '📞 Relocation Call Desk', path: '/admin/relocation-call-desk', icon: PhoneCall, highlight: true },
      { label: '✉️ Send Subscriber Invite (Email & Text)', path: '/admin/subscriber-invite', icon: Mail, highlight: true },
      { label: '👤 Add Subscriber to Any Portal', path: '/admin/add-subscriber', icon: UserPlus, highlight: true },
      { label: '📋 MLS Listing Agent Outreach', path: '/admin/listing-prospects', icon: MapPin, highlight: true },
      { label: '📜 Master Referral & Relo Mgmt Agreement', path: '/admin/master-agreement', icon: ScrollText, highlight: true },
      { label: '📤 Quick Send (Page/Video → SMS or Email)', path: '/admin/quick-send', icon: Send, highlight: true },
      { label: '🤝 Referral Leads (Accept/Decline + Analytics)', path: '/admin/referral-leads', icon: UserPlus, highlight: true },
    ],
  },
  {
    key: 'dnn',
    label: 'DNN NEWS AND INTELLIGENCE',
    icon: Globe,
    color: '#D4AF37',
    children: [
      { label: '✅ DNN Studio Landing Page (VERIFIED 16:9)', path: '/admin/archived/studio-landing', icon: Archive, highlight: true },
      { label: '🔒 Locked Source Code (Studio Landing)', path: '/admin/dnn/studio-landing-source', icon: FileCheck, highlight: true },
      { label: '✅ Locked Final Look', path: '/admin/dnn/charlie-studio-solution', icon: FileCheck, highlight: true },
      { label: '🎬 Video Preview & Blast', path: '/admin/dnn/video-preview', icon: Video },
      { label: '📚 Daily News Library', path: '/admin/dnn/daily-library', icon: Library, highlight: true },
      { label: '🎬 Show Production Pipeline', path: '/admin/dnn/show-pipeline', icon: Clapperboard },
      { label: '✏️ Script Studio (Template + Preview)', path: '/admin/dnn/script-studio', icon: Edit, highlight: true },
      { label: '⚡ Pipeline Credit Monitor', path: '/admin/heygen-credits', icon: Zap },
      { label: '📊 Production Cost Dashboard', path: '/admin/production-dashboard', icon: BarChart3 },
      { label: '📈 Show Performance', path: '/admin/dnn/show-performance', icon: BarChart3, highlight: true },
      { label: '📊 DNN Flow Chart', path: '/admin/workflows/dnn', icon: GitBranch, highlight: true },
      { label: 'DNN News', path: '/dnn-news', icon: Newspaper },
      { label: '📺 Broadcast Archive', path: '/dnn-archive', icon: Clapperboard },
      { label: 'News Feed (Staging)', path: '/admin/dnn/news-feed', icon: Newspaper },
      { label: 'Market Data Hub', path: '/admin/dnn/market-data', icon: BarChart3 },
      { label: 'Subscriber CRM', path: '/admin/dnn/subscribers', icon: Users },
      { label: 'Communications Hub', path: '/admin/dnn/communications', icon: Send },
      { label: 'Agent Bureau (B2B)', path: '/admin/dnn/agent-bureau', icon: Shield },
      { label: 'Featured Agent Revenue', path: '/admin/dnn/revenue', icon: TrendingUp },
      { label: 'Agent Vetting Process', path: '/admin/dnn/agent-vetting', icon: FileCheck },
      { label: 'Lender Vetting Process', path: '/admin/dnn/lender-vetting', icon: DollarSign },
      { label: 'Bureau Story Hub', path: '/admin/dnn/bureau-stories', icon: BookOpen },
      { label: '🎬 DNN Studio', path: '/admin/dnn/studio', icon: Video },
      { label: '📣 Agent Recruiting Broadcast', path: '/admin/dnn/recruiting', icon: Send },
      { label: '✅ Shard 1 Script Review', path: '/admin/dnn/script-review', icon: FileCheck },
      { label: '🎥 Explainer Videos', path: '/admin/dnn/explainer-videos', icon: Video, highlight: true },
    ],
  },
  {
    key: 'marketing_prep',
    label: 'MARKETING & PREP',
    children: [
      { label: '📊 Marketing Flow Chart', path: '/admin/workflows/marketing', icon: GitBranch, highlight: true },
      { label: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search },
      { label: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Fingerprint },
      { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline', icon: SendHorizontal },
      { label: 'Compose SMS', path: '/admin/compose-sms', icon: SendHorizontal },
      { label: 'Owner Response Board', path: '/admin/owner-kanban', icon: LayoutDashboard },
      { label: 'Batch SMS Logs', path: '/admin/batch-sms-log', icon: List },
      { label: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns', icon: Calendar },
      { label: 'Video SMS Campaign', path: '/admin/video-sms-campaign', icon: Video },
      { label: 'Video Library', path: '/admin/video-library', icon: Video },
      { label: 'Outreach Analytics', path: '/admin/outreach-analytics', icon: BarChart3 },
      { label: 'SMS Sequences', path: '/admin/sms-sequences', icon: MessageCircle },
      { label: 'Agreements', isHeader: true },
      { label: '📜 Master Referral & Relo Mgmt Agreement', path: '/admin/master-agreement', icon: ScrollText, indent: true, highlight: true },
    ],
  },
  {
    key: 'pr',
    label: 'PR & MEDIA',
    children: [
      { label: '📊 Marketing Flow Chart', path: '/admin/workflows/marketing', icon: GitBranch, highlight: true },
      { label: 'Media CRM', path: '/admin/media-crm', icon: Newspaper },
      { label: 'Pitch Tracker', path: '/admin/pitch-tracker', icon: Star },
      { label: 'Press Kit Assets', path: '/admin/press-kit', icon: Package },
      { label: 'Mass Pitch Personalizer', path: '/admin/mass-pitch', icon: Edit },
    ],
  },
  {
    key: 'affiliate_recruiting',
    label: 'AFFILIATE RECRUITING',
    icon: Users,
    color: '#34d399',
    children: [
      { label: '📊 Sales Flow Chart', path: '/admin/workflows/sales', icon: GitBranch, highlight: true },
      { label: 'Recruiting Pipeline', path: '/admin/affiliate-recruiting', icon: Users },
      { label: '↳ Bob Dyson Contact List', path: '/admin/bob-dyson-contacts', icon: Users, indent: true, highlight: true },
      { label: '↳ Top Relocation Agent Prospects for affiliation with Dyson Relo', path: '/admin/roster', icon: List, indent: true },
      { label: '↳ Exodus Pitch Page', path: '/admin/exodus-pitch', icon: ArrowRight, indent: true },
      { label: '↳ Partner Benefits', path: '/admin/partner-benefits', icon: ArrowRight, indent: true },
      { label: '↳ Agent Subscribe Page', path: '/agent-subscribe', icon: Globe, indent: true },
    ],
  },
  {
    key: 'results',
    label: 'CLIENT MARKETING RESULTS',
    children: [
      { label: '📊 Sales Flow Chart', path: '/admin/workflows/sales', icon: GitBranch, highlight: true },
      { label: 'Listing Clients', path: '/admin/clients', icon: Home },
      { label: '↳ Contact Info', path: '/admin/communications', icon: MessageCircle, indent: true },
      { label: 'Private Referral Network (PRN)', isHeader: true },
      { label: 'Agents', path: '/admin/referrals', icon: UserCheck },
      { label: '↳ The Private Referral Network (PRN)', path: '/admin/prn-agent-plan', icon: FileText, indent: true },
      { label: '↳ Top Relocation Agent Prospects for affiliation with Dyson Relo', path: '/admin/roster', icon: List, indent: true },
      { label: '↳ Active Relocation Agents (Full-Time)', path: '/admin/active-relocation-agents', icon: UserCheck, indent: true, highlight: true },
      { label: '↳ Referral Agents (Refer-Only)', path: '/admin/referral-agents', icon: UserCheck, indent: true, highlight: true },
      { label: '↳ Sending Agent Tracker', path: '/admin/sending-agents', icon: ArrowRight, indent: true },
      { label: '↳ Exodus Pitch Page', path: '/admin/exodus-pitch', icon: ArrowRight, indent: true },
      { label: '↳ Partner Benefits', path: '/admin/partner-benefits', icon: ArrowRight, indent: true },
      { label: '[Targeting] Exodus Agent Outreach', path: '/admin/exodus-outreach', icon: ArrowRight, indent: true },
      { label: '⚖ [Management] Referral Fee Agreements', path: '/admin/prn-agreements', icon: ArrowRight, indent: true, highlight: true },
      { label: '📜 Master Referral & Relo Mgmt Agreement', path: '/admin/master-agreement', icon: ScrollText, indent: true, highlight: true },
      { label: '[Tracking] Managed Referral Pipeline', path: '/admin/sending-agents', icon: ArrowRight, indent: true },
      { label: '↳ Contact Info', path: '/admin/communications', icon: MessageCircle, indent: true },
      { label: 'Lenders', path: '/admin/owners', icon: Users },
      { label: '↳ Contact Info', path: '/admin/communications', icon: MessageCircle, indent: true },
    ],
  },
  {
    key: 'relo_management',
    label: 'RELO MANAGEMENT',
    children: [
      { label: '📊 Operations Flow Chart', path: '/admin/workflows/operations', icon: GitBranch, highlight: true },
      { label: '📞 Relocation Call Desk', path: '/admin/relocation-call-desk', icon: PhoneCall, highlight: true },
      { label: 'Relo Management Explainer', path: '/admin/relo-management', icon: Home },
    ],
  },
  {
    key: 'corporate_relo',
    label: 'CORPORATE RELO / HR',
    children: [
      { label: '📊 Operations Flow Chart', path: '/admin/workflows/operations', icon: GitBranch, highlight: true },
      { label: 'HR Explainer Videos & Guidelines', path: '/admin/corporate-relo', icon: Video },
      { label: 'B2B Audience Distribution', path: '/admin/audience-distribution', icon: Send, highlight: true },
      { label: 'Public Corporate Relo Page', path: '/corporate-relo', icon: Globe },
    ],
  },
  {
    key: 'operations',
    label: 'OPERATIONS',
    children: [
      { label: '📊 Operations Flow Chart', path: '/admin/workflows/operations', icon: GitBranch, highlight: true },
      { label: '🛡 Compliance Doc Review', path: '/admin/compliance-review', icon: FileCheck },
      { label: '🎬 Q&A Script Studio', path: '/admin/qa-script-studio', icon: Video },
      { label: 'Presentation Library', path: '/admin/presentation-library', icon: FileText },
      { label: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag },
      { label: 'Referral Management', path: '/admin/referrals', icon: LinkIcon },
    ],
  },
  {
    key: 'creative_lab',
    label: 'CREATIVE LAB',
    children: [
      { label: '📊 Marketing Flow Chart', path: '/admin/workflows/marketing', icon: GitBranch, highlight: true },
      { label: 'New Landing Page', path: '/admin/new-landing-page', icon: Globe },
      { label: '📦 Archived Studio Landing', path: '/admin/archived/studio-landing', icon: Archive, highlight: true },
    ],
  },
  {
    key: 'agent_lender_vetting',
    label: 'AGENT VETTING & LENDER',
    children: [
      { label: '📊 Sales Flow Chart', path: '/admin/workflows/sales', icon: GitBranch, highlight: true },
      { label: 'Looking to Vette an Agent?', path: '/admin/dnn/agent-vetting', icon: Shield },
      { label: 'Looking to Select a Lender?', path: '/admin/dnn/lender-vetting', icon: DollarSign },
    ],
  },
  {
    key: 'charlie',
    label: "CHARLIE'S BRAIN",
    icon: Brain,
    color: '#A78BFA',
    children: [
      { label: '📊 Operations Flow Chart', path: '/admin/workflows/operations', icon: GitBranch, highlight: true },
      { label: 'Scripts', path: '/admin/charlie-scripts', icon: ScrollText },
      { label: 'Knowledge Base', path: '/admin/charlie-knowledge-base', icon: Brain },
      { label: "Bob's Video Answers", path: '/admin/bob-library', icon: Video },
      { label: 'Escalations', path: '/admin/charlie-escalations', icon: AlertTriangle },
      { label: 'Voice Presentation', path: '/charlie-voice', icon: MessageCircle },
      { label: '📞 Voice Concierge (V2V) Analytics', path: '/admin/voice-concierge-analytics', icon: BarChart3, highlight: true },
    ],
  },
  {
    key: 'finance',
    label: 'FINANCE',
    icon: DollarSign,
    color: '#a78bfa',
    children: [
      { label: '📊 Finance Flow Chart', path: '/admin/workflows/finance', icon: GitBranch, highlight: true },
      { label: 'Featured Agent Revenue', path: '/admin/dnn/revenue', icon: TrendingUp },
      { label: 'Production Cost Dashboard', path: '/admin/production-dashboard', icon: BarChart3 },
      { label: 'Pipeline Credit Monitor', path: '/admin/heygen-credits', icon: Zap },
    ],
  },
];

// All child paths for auto-expand detection
const getSectionPaths = (section) =>
  section.children.filter(c => c.path).map(c => c.path);

function loadOpenState() {
  try {
    const saved = localStorage.getItem('adminSidebarOpen');
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveOpenState(state) {
  try { localStorage.setItem('adminSidebarOpen', JSON.stringify(state)); } catch {}
}

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageCode, setPageCode] = useState('');
  const [smsWidgetOpen, setSmsWidgetOpen] = useState(true);
  const [wisdomOpen, setWisdomOpen] = useState(false);

  // Sections that are always open by default (never collapsed on first visit)
  const DEFAULT_OPEN = new Set([]);

  const [openSections, setOpenSections] = useState(() => {
    const saved = loadOpenState();
    const initial = {};
    NAV_SECTIONS.forEach(s => {
      const hasActive = getSectionPaths(s).some(p => location.pathname === p || location.pathname.startsWith(p));
      // DEFAULT_OPEN sections always start open regardless of saved state
      if (DEFAULT_OPEN.has(s.key)) {
        initial[s.key] = true;
      } else {
        initial[s.key] = saved[s.key] !== undefined ? saved[s.key] : hasActive;
      }
    });
    return initial;
  });

  const toggleSection = (key) => {
    setOpenSections(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveOpenState(next);
      return next;
    });
    // User manually toggled — reset the idle timer
    resetIdleTimer();
  };

  // Collapse all sections except the one containing the active route
  const sidebarRef = useRef(null);
  const idleTimerRef = useRef(null);

  const collapseToActive = useCallback(() => {
    setOpenSections(prev => {
      const next = {};
      NAV_SECTIONS.forEach(s => {
        const hasActive = getSectionPaths(s).some(p => location.pathname === p || location.pathname.startsWith(p));
        next[s.key] = hasActive;
      });
      saveOpenState(next);
      return next;
    });
  }, [location.pathname]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      collapseToActive();
    }, 120000); // 2 minutes idle
  }, [collapseToActive]);

  // Collapse to active section after navigation
  useEffect(() => {
    collapseToActive();
  }, [location.pathname, collapseToActive]);

  // Idle timer — collapse after 2 min of no sidebar interaction
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const events = ['mousemove', 'click', 'scroll', 'keydown', 'touchstart'];
    const handler = () => resetIdleTimer();
    events.forEach(e => sidebar.addEventListener(e, handler));
    resetIdleTimer();
    return () => {
      events.forEach(e => sidebar.removeEventListener(e, handler));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const { data: batchLogs = [] } = useQuery({
    queryKey: ['batchSmsLogs'],
    queryFn: () => base44.entities.BatchSMSLog.list('-sent_at', 100),
    refetchInterval: 5000,
  });

  const handlePageJump = (e) => {
    e.preventDefault();
    if (!pageCode.trim()) return;
    const match = pageCode.toUpperCase().match(/^(\d+)([A-Z])?$/);
    if (match) {
      const pageData = PAGE_REGISTRY[match[1]];
      if (pageData) { navigate(pageData.path); setPageCode(''); return; }
    }
    const found = Object.values(PAGE_REGISTRY).find(p => p.name.toLowerCase().includes(pageCode.toLowerCase()));
    if (found) { navigate(found.path); setPageCode(''); }
  };

  const suggestions = pageCode.trim() && !/^\d/.test(pageCode)
    ? Object.entries(PAGE_REGISTRY).filter(([, p]) => p.name.toLowerCase().includes(pageCode.toLowerCase())).slice(0, 4)
    : [];

  return (
    <aside ref={sidebarRef} className="w-[310px] sm:w-[320px] flex flex-col h-screen shrink-0 overflow-y-auto select-none shadow-2xl" style={{ background: '#0a0a0a', borderRight: '1px solid rgba(212,175,55,0.3)' }}>
      {/* Top Brand Header: Dyson & Dyson Logo + The Dyson & Dyson Companies */}
      <div className="p-3.5 pb-2 space-y-1.5 shrink-0 text-center">
        <Link 
          to="/portal" 
          className="block group cursor-pointer transition-transform hover:scale-[1.02] active:scale-98"
          title="The Dyson & Dyson Companies · Return to Portal"
        >
          <div className="flex justify-center items-center py-1">
            <img 
              src={DYSON_LOGO} 
              alt="The Dyson & Dyson Companies" 
              className="h-10 sm:h-12 w-auto object-contain drop-shadow" 
            />
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white tracking-wide mt-1 font-sans">
            The Dyson &amp; Dyson Companies
          </div>
        </Link>

        {/* Signed In Quick Status */}
        <div className="py-1.5 px-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <span className="text-white/90 font-medium truncate">
              Signed In: <strong className="text-white font-bold">Admin Console</strong>
            </span>
          </div>
          <Link
            to="/admin"
            className="text-[10.5px] font-bold text-[#D4AF37] hover:text-white transition-colors shrink-0 flex items-center gap-0.5"
          >
            <span>Console</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Sidebar Search — searches every link in every nav section below */}
      <AdminSidebarSearch items={buildSearchIndex(NAV_SECTIONS)} />

      {/* ── TOP PINNED: 10 PLATFORM APPS & SPRINGBOARD SPECS ── */}
      <div className="px-3 pt-2 pb-1 shrink-0">
        <Link
          to="/admin/app-store-mockup"
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all cursor-pointer shadow-lg active:scale-95 group w-full ${
            location.pathname === '/admin/app-store-mockup'
              ? 'bg-[#2f2510] border-[#D4AF37] ring-1 ring-[#D4AF37]'
              : 'bg-[#221c0e] hover:bg-[#2c2311] border-[#D4AF37]/75 hover:border-[#D4AF37]'
          }`}
          style={{
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
          }}
          title="Open 10 Platform Apps & Springboard Specs Catalog"
        >
          <Star className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-sm leading-none shrink-0">📱</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] truncate">
            10 PLATFORM APPS &amp; SPRINGBOARD SPECS
          </span>
        </Link>
      </div>

      {/* ── VIEW AS: 8 PORTAL ROLES (MOVED ABOVE MINI APPS) ── */}
      <div className="px-3 pt-2.5 pb-2 shrink-0">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-left" style={{ color: '#D4AF37' }}>VIEW PORTAL AS:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'D&D LANDING PAGE', role: 'landing', emoji: '🚪', path: '/' },
            { label: 'CLIENT', role: 'client', emoji: '🏠', path: '/home' },
            { label: 'RELOCATION AGENT', role: 'agent', emoji: '⭐', path: '/agent-command-center' },
            { label: 'REFERRAL AGENT', role: 'referral_agent', emoji: '🤝', path: '/partner-benefits' },
            { label: 'VENDOR', role: 'vendor', emoji: '🔧', path: '/search' },
            { label: 'CORP RELO HR', role: 'corporate_hr', emoji: '🏢', path: '/corporate-relo' },
            { label: 'BROKER PORTAL', role: 'broker', emoji: '💼', path: '/broker-portal' },
            { label: 'FIRST-TIME VISITOR', role: 'first_time_visitor', emoji: '👋', path: '/?visitor=1' },
          ].map(({ label, role, emoji, path }) => (
            <button
              key={role}
              onClick={() => {
                if (role === 'first_time_visitor') {
                  sessionStorage.setItem('dyson_viewer_mode', 'guest');
                  sessionStorage.removeItem('dyson_role');
                  localStorage.removeItem('dyson_view_as_family_subscriber');
                  localStorage.removeItem('dyson_view_as');
                  window.dispatchEvent(new Event('dyson_role_change'));
                  navigate('/?visitor=1');
                  return;
                }
                sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
                sessionStorage.setItem('dyson_role', role);
                window.dispatchEvent(new Event('dyson_role_change'));
                if (path) { navigate(path); return; }
                navigate('/dashboard');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl text-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md group"
              style={{
                background: '#14120b',
                border: '1px solid rgba(212,175,55,0.45)',
                color: '#D4AF37',
              }}
            >
              <span className="text-xl leading-none mb-1 group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-[9.5px] font-black tracking-[0.08em] leading-tight text-[#e8c84a] group-hover:text-[#D4AF37]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 24 DEPARTMENT MINI APPS (BELOW PORTALS) ── */}
      <div className="px-3 pt-2 pb-2 shrink-0">
        <AdminMiniAppsGrid />
      </div>

      <ListingProspectsRepWidget />

      {/* Recent Grok Dispatches — live feed from the Command Center */}
      <AdminDispatchWidget />

      {/* ── CORE ADMIN COMMAND PILLS (UNIFIED GOLD FORMAT) ── */}
      <div className="px-3 pt-2 pb-1 space-y-2 shrink-0">
        {[
          { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: '📜 AI Library Specialists', path: '/admin/library-specialists', icon: Brain },
          { label: '👁️ Grok Screen Viewer', path: '/admin/claude-screen-viewer', icon: Monitor },
          { label: '🔌 Connect AI Assistant', path: '/connect', icon: Plug },
          { label: '🎯 Marketing Campaigns Hub', path: '/admin/marketing-campaigns-hub', icon: Megaphone },
          { label: '📋 Business Plan', path: '/admin/business-plan', icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-md group ${
                isActive
                  ? 'bg-[#251e10] border-2 border-[#D4AF37] text-[#D4AF37] ring-1 ring-[#D4AF37]/60'
                  : 'bg-[#14120b] hover:bg-[#1f190e] border border-[#D4AF37]/45 hover:border-[#D4AF37] text-[#e8c84a] hover:text-[#D4AF37]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Collapsible Sections */}
      <nav className="py-2 px-3 space-y-0.5 flex-1">
        {NAV_SECTIONS.filter(s => s.key !== 'dnn').map(section => {
          const isOpen = openSections[section.key];
          const hasActive = getSectionPaths(section).some(p => location.pathname === p || location.pathname.startsWith(p));
          const SectionIcon = section.icon;
          const sectionColor = section.color || '#D4AF37';
          const borderColor = section.color === '#A78BFA' ? 'rgba(167,139,250,0.25)' : 'rgba(212,175,55,0.2)';

          return (
            <div key={section.key} className="mt-1">
              {/* Section Header — clickable gold toggle */}
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group"
                style={{ background: hasActive && !isOpen ? 'rgba(212,175,55,0.06)' : 'transparent' }}
              >
                <div className="flex items-center gap-2">
                  {SectionIcon && <SectionIcon className="w-3.5 h-3.5" style={{ color: sectionColor }} />}
                  <span className="text-xs font-bold tracking-[0.2em] truncate" style={{ color: sectionColor }}>
                    {section.label}
                  </span>
                  {hasActive && !isOpen && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sectionColor }} />
                  )}
                </div>
                {isOpen
                  ? <ChevronDown className="w-3 h-3 opacity-60" style={{ color: sectionColor }} />
                  : <ChevronRightIcon className="w-3 h-3 opacity-40" style={{ color: sectionColor }} />
                }
              </button>

              {/* Section Children */}
              {isOpen && (
                <div className="mt-0.5 ml-2 pl-3 pb-1 space-y-0.5 border-l" style={{ borderColor }}>
                  {section.children.map((child, ci) => {
                    if (child.isCommsBadge) {
                      return <div key={ci} className="py-1"><AdminCommsBadge /></div>;
                    }
                    if (child.isWorkingModelsScroll) {
                      return <div key={ci} className="py-0.5"><AdminWorkingModelsScroll /></div>;
                    }
                    if (child.isHeader) {
                      return (
                        <div key={ci} className="px-3 pt-3 pb-1">
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>{child.label}</span>
                        </div>
                      );
                    }
                    const isActive = location.pathname === child.path;
                    const childColor = section.color || '#D4AF37';
                    return (
                      <Link
                        key={`${child.path}-${ci}`}
                        to={child.path}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: child.highlight ? 'rgba(212,175,55,0.15)' : (isActive ? `${childColor}22` : 'transparent'),
                          color: child.highlight ? GOLD : (child.indent ? '#ffffff' : (isActive ? childColor : '#ccc')),
                          border: child.highlight ? `1px solid rgba(212,175,55,0.4)` : 'none',
                          marginLeft: child.indent ? '8px' : '0',
                          fontSize: child.indent ? '12px' : '14px',
                          paddingTop: child.indent ? '4px' : undefined,
                          paddingBottom: child.indent ? '4px' : undefined,
                          fontWeight: child.highlight ? 900 : undefined,
                        }}
                      >
                        <child.icon className="w-3 h-3 shrink-0" style={{ opacity: child.indent ? 0.5 : 1 }} />
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Admin Charlie Card */}
      <AdminCharlieCard />

      {/* Recent Batch SMS Widget — collapsible */}
      <div className="mx-3 mb-3 p-3 rounded-lg shrink-0" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setSmsWidgetOpen(v => !v); resetIdleTimer(); }}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ color: '#D4AF37' }}
          >
            {smsWidgetOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />}
            📡 Recent SMS Batches
          </button>
          <Link to="/admin/batch-sms-log" onClick={resetIdleTimer}>
            <ArrowRight className="w-3 h-3 hover:scale-110 transition-transform" style={{ color: '#D4AF37' }} />
          </Link>
        </div>
        {smsWidgetOpen && (
          <div className="space-y-2 mt-2">
            {batchLogs.length > 0 ? (
              batchLogs.slice(0, 3).map(log => (
                <div key={log.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white truncate max-w-[110px]">{log.city || 'Unknown'}</span>
                    <span className="font-semibold ml-1 shrink-0" style={{ color: '#D4AF37' }}>✓ {log.sent_count || 0}</span>
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    {log.sent_at ? new Date(log.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    {log.failed_count > 0 && <span className="text-red-400"> · {log.failed_count} failed</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No batches sent yet</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Page Jump */}
      <div className="mx-3 mb-3 relative shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-slate-400">Quick Page Jump</p>
        <form onSubmit={handlePageJump} className="flex gap-2">
          <input
            type="text"
            value={pageCode}
            onChange={e => setPageCode(e.target.value)}
            placeholder="Page # or name…"
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: '#fff', outline: 'none' }}
          />
          <button type="submit" className="px-3 py-2 rounded-lg"
            style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {suggestions.length > 0 && (
          <div className="mt-1 rounded-lg overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
            {suggestions.map(([num, page]) => (
              <button key={num} type="button"
                onClick={() => { navigate(page.path); setPageCode(''); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-black shrink-0" style={{ color: '#D4AF37' }}>#{num}</span>
                <span className="truncate text-white">{page.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Links */}
      <div className="p-3 space-y-1 pb-6 shrink-0" style={{ borderTop: '1px solid #1a1a1a' }}>
        <Link to="/gemini" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
          <span className="text-base">👁️</span> Preview Client Flow
        </Link>
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" /> Client Dashboard
        </Link>
        <Link to="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/5">
          <MessageCircle className="w-4 h-4" /> Client Chat
        </Link>
      </div>
    </aside>
  );
}