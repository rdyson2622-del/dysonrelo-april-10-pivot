import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Newspaper, GitBranch, ClipboardList, MapPin, 
  Building2, SendHorizontal, Sparkles, Calendar, Mail, MessageSquare,
  Calculator, CloudSun, Mic, Brain, Monitor, Plug, Megaphone,
  FileText, LayoutDashboard, Shield, ShieldCheck, Users, DollarSign, Layers
} from 'lucide-react';

export const MAJOR_SUBJECTS = [
  { id: 'all', label: 'All', icon: Sparkles, color: '#D4AF37' },
  { id: 'ai', label: 'AI & Systems', shortLabel: 'AI', icon: Brain, color: '#e8c84a' },
  { id: 'operations', label: 'Relo & Ops', shortLabel: 'Relo', icon: Mail, color: '#38bdf8' },
  { id: 'network', label: 'Agents & Network', shortLabel: 'Network', icon: Users, color: '#34d399' },
  { id: 'news', label: 'News & PR', shortLabel: 'News', icon: Newspaper, color: '#ef4444' },
  { id: 'growth', label: 'Growth & Outreach', shortLabel: 'Growth', icon: Megaphone, color: '#ec4899' },
  { id: 'executive', label: 'Executive & Strategy', shortLabel: 'Executive', icon: LayoutDashboard, color: '#D4AF37' },
];

export const ADMIN_DEPT_MINI_APPS = [
  // ── AI & INTELLIGENT SYSTEMS ──
  {
    id: 'charlie',
    label: 'Charlie AI',
    copy: 'Voice Concierge',
    icon: Mic,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    badgeCount: 'V2V',
    subject: 'ai',
    subjectLabel: 'AI & Systems',
  },
  {
    id: 'specialists',
    label: 'AI Specialists',
    copy: 'Library Canon',
    icon: Brain,
    iconColor: '#c084fc',
    bgGradient: 'from-[#4c1d95] via-[#2e1065] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
    subject: 'ai',
    subjectLabel: 'AI & Systems',
    defaultPath: '/admin/library-specialists',
  },
  {
    id: 'grok_viewer',
    label: 'Grok Viewer',
    copy: 'Screen Vision',
    icon: Monitor,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
    subject: 'ai',
    subjectLabel: 'AI & Systems',
    defaultPath: '/admin/claude-screen-viewer',
  },
  {
    id: 'connect_ai',
    label: 'Connect AI',
    copy: 'Integrations',
    icon: Plug,
    iconColor: '#fbbf24',
    bgGradient: 'from-[#78350f] via-[#451a03] to-[#0a0a0a]',
    border: 'border-[#fbbf24]/60',
    subject: 'ai',
    subjectLabel: 'AI & Systems',
    defaultPath: '/connect',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    copy: 'Atlas & Roadmap',
    icon: GitBranch,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
    subject: 'ai',
    subjectLabel: 'AI & Systems',
  },

  // ── RELO & DAILY OPERATIONS ──
  {
    id: 'calendar',
    label: 'Calendar',
    copy: 'Moves & Dates',
    icon: Calendar,
    iconColor: '#a855f7',
    bgGradient: 'from-[#581c87] via-[#3b0764] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
    subject: 'operations',
    subjectLabel: 'Relo & Ops',
  },
  {
    id: 'email',
    label: 'Email Desk',
    copy: 'bob@dysonrelo.com',
    icon: Mail,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
    badgeCount: 'LIVE',
    subject: 'operations',
    subjectLabel: 'Relo & Ops',
  },
  {
    id: 'text',
    label: 'Text / SMS',
    copy: 'Twilio (858) 353-1200',
    icon: MessageSquare,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    subject: 'operations',
    subjectLabel: 'Relo & Ops',
  },
  {
    id: 'corporate_relo',
    label: 'Corp Relo HR',
    copy: 'B2B Relocation',
    icon: Building2,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#1e3a8a] via-[#172554] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
    subject: 'operations',
    subjectLabel: 'Relo & Ops',
    defaultPath: '/admin/corporate-relo',
  },
  {
    id: 'operations',
    label: 'Operations',
    copy: 'Compliance & Audits',
    icon: ShieldCheck,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    subject: 'operations',
    subjectLabel: 'Relo & Ops',
    defaultPath: '/admin/compliance-review',
  },

  // ── NEWS & MEDIA DESK ──
  {
    id: 'dnn',
    label: 'DNN News',
    copy: 'Studio Broadcast',
    icon: Newspaper,
    iconColor: '#ef4444',
    bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
    border: 'border-[#ef4444]/60',
    badgeCount: 3,
    subject: 'news',
    subjectLabel: 'News & PR',
  },
  {
    id: 'pr_media',
    label: 'PR & Media',
    copy: 'Press Kit CRM',
    icon: Newspaper,
    iconColor: '#f97316',
    bgGradient: 'from-[#7c2d12] via-[#431407] to-[#0a0a0a]',
    border: 'border-[#f97316]/60',
    subject: 'news',
    subjectLabel: 'News & PR',
    defaultPath: '/admin/media-crm',
  },

  // ── AGENTS & NETWORK ──
  {
    id: 'agents',
    label: 'Agent Desk',
    copy: 'Workfiles Roster',
    icon: ClipboardList,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#172554] via-[#0f172a] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
    badgeCount: 2,
    subject: 'network',
    subjectLabel: 'Agents & Network',
  },
  {
    id: 'affiliate_recruiting',
    label: 'Recruiting',
    copy: 'Affiliate Pipeline',
    icon: Users,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#022c22] to-[#0a0a0a]',
    border: 'border-[#34d399]/60',
    subject: 'network',
    subjectLabel: 'Agents & Network',
    defaultPath: '/admin/affiliate-recruiting',
  },
  {
    id: 'vetting',
    label: 'Vetting Desk',
    copy: 'Agents & Lenders',
    icon: Shield,
    iconColor: '#a855f7',
    bgGradient: 'from-[#581c87] via-[#2e1065] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
    subject: 'network',
    subjectLabel: 'Agents & Network',
    defaultPath: '/admin/dnn/agent-vetting',
  },

  // ── GROWTH & OUTREACH ──
  {
    id: 'marketing_hub',
    label: 'Marketing Hub',
    copy: 'Campaigns & SMS',
    icon: Megaphone,
    iconColor: '#ec4899',
    bgGradient: 'from-[#831843] via-[#500724] to-[#0a0a0a]',
    border: 'border-[#ec4899]/60',
    subject: 'growth',
    subjectLabel: 'Growth & Outreach',
    defaultPath: '/admin/marketing-campaigns-hub',
  },
  {
    id: 'listing_outreach',
    label: 'MLS Outreach',
    copy: 'Listing Agent CRM',
    icon: MapPin,
    iconColor: '#f59e0b',
    bgGradient: 'from-[#78350f] via-[#451a03] to-[#0a0a0a]',
    border: 'border-[#f59e0b]/60',
    badgeCount: 1,
    subject: 'growth',
    subjectLabel: 'Growth & Outreach',
  },
  {
    id: 'wisdom',
    label: 'Wisdom Relo',
    copy: 'Escrow & Audit',
    icon: Building2,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    subject: 'growth',
    subjectLabel: 'Growth & Outreach',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    copy: 'Campaigns & Drops',
    icon: SendHorizontal,
    iconColor: '#ec4899',
    bgGradient: 'from-[#831843] via-[#500724] to-[#0a0a0a]',
    border: 'border-[#ec4899]/60',
    subject: 'growth',
    subjectLabel: 'Growth & Outreach',
  },

  // ── EXECUTIVE & STRATEGY ──
  {
    id: 'admin_dashboard',
    label: 'Admin Console',
    copy: 'Metrics & Tools',
    icon: LayoutDashboard,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#3b2d11] via-[#1f1608] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    subject: 'executive',
    subjectLabel: 'Executive & Strategy',
    defaultPath: '/admin',
  },
  {
    id: 'business_plan',
    label: 'Business Plan',
    copy: 'Economics & Roadmap',
    icon: FileText,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#422006] via-[#291404] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    subject: 'executive',
    subjectLabel: 'Executive & Strategy',
    defaultPath: '/admin/business-plan',
  },
  {
    id: 'calculator',
    label: 'Calculator',
    copy: 'Mortgage & Relo',
    icon: Calculator,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#064e3b] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    subject: 'executive',
    subjectLabel: 'Executive & Strategy',
  },
  {
    id: 'weather',
    label: 'Weather',
    copy: 'Relo Climates',
    icon: CloudSun,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
    subject: 'executive',
    subjectLabel: 'Executive & Strategy',
  },
  {
    id: 'finance',
    label: 'Finance',
    copy: 'Revenue & Quotas',
    icon: DollarSign,
    iconColor: '#fbbf24',
    bgGradient: 'from-[#713f12] via-[#3f2207] to-[#0a0a0a]',
    border: 'border-[#fbbf24]/60',
    subject: 'executive',
    subjectLabel: 'Executive & Strategy',
    defaultPath: '/admin/dnn/revenue',
  },
];

export default function AdminMiniAppsGrid({ className = '', onSelectApp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDept = new URLSearchParams(location.search).get('dept');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'by_subject'

  const handleClick = (app) => {
    if (onSelectApp) {
      onSelectApp(app.id);
    }
    navigate(`/admin?dept=${app.id}`);
  };

  const filteredApps = selectedSubject === 'all'
    ? ADMIN_DEPT_MINI_APPS
    : ADMIN_DEPT_MINI_APPS.filter(a => a.subject === selectedSubject);

  return (
    <div className={`space-y-2.5 select-none ${className}`}>
      {/* Header with Mode & Subject Filter */}
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
        <div className="flex items-center gap-1.5">
          <span>DEPARTMENT MINI APPS:</span>
          <span className="text-white/40 font-mono text-[9px]">({ADMIN_DEPT_MINI_APPS.length})</span>
        </div>
        
        {/* View Toggle */}
        <button
          type="button"
          onClick={() => setViewMode(v => v === 'grid' ? 'by_subject' : 'grid')}
          className="text-white/60 hover:text-[#D4AF37] font-semibold text-[9.5px] cursor-pointer flex items-center gap-1 transition-colors"
          title="Toggle between filtered grid and categorized by subject"
        >
          <Layers className="w-3 h-3" />
          <span>{viewMode === 'grid' ? 'By Subject' : 'Filter Grid'}</span>
        </button>
      </div>

      {/* Major Subject Filter Tabs */}
      {viewMode === 'grid' && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 px-0.5" style={{ scrollbarWidth: 'none' }}>
          {MAJOR_SUBJECTS.map((subj) => {
            const isSubjActive = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-2 py-1 rounded-lg text-[9.5px] font-bold shrink-0 transition-all cursor-pointer ${
                  isSubjActive
                    ? 'bg-[#D4AF37] text-black shadow-sm font-black'
                    : 'bg-[#141414] hover:bg-[#202020] text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {subj.shortLabel || subj.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── MODE 1: FILTERED GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-3 gap-y-3 gap-x-2 px-0.5">
          {filteredApps.map((app) => {
            const Icon = app.icon;
            const isActive = currentDept === app.id;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => handleClick(app)}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none transition-transform active:scale-90"
                title={`${app.label} · ${app.copy} (${app.subjectLabel})`}
              >
                {/* Mini App Squircle Tile */}
                <div 
                  className={`w-14 h-14 sm:w-15 sm:h-15 rounded-[18px] bg-gradient-to-br ${app.bgGradient} border ${
                    isActive ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : app.border
                  } relative flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.3)]`}
                  style={{
                    boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Top Half Glass Sheen */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/8 to-transparent pointer-events-none rounded-t-[18px]" />

                  {/* Optional Badge Count */}
                  {app.badgeCount && (
                    <span 
                      className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#ff3b30] text-white font-black text-[9.5px] flex items-center justify-center shadow-lg border-[1.5px] border-black tracking-tight z-10"
                    >
                      {app.badgeCount}
                    </span>
                  )}

                  {/* Icon */}
                  <Icon 
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-200 group-hover:scale-110 drop-shadow" 
                    style={{ color: app.iconColor }} 
                  />
                </div>

                {/* Line 1: Label */}
                <span className={`mt-1.5 text-[11px] font-semibold tracking-tight transition-colors leading-tight text-center max-w-[85px] truncate ${
                  isActive ? 'text-[#D4AF37] font-bold' : 'text-white group-hover:text-[#D4AF37]'
                }`}>
                  {app.label}
                </span>

                {/* Line 2: Copy */}
                <span className="text-[8.5px] text-white/50 group-hover:text-white/80 leading-tight mt-0.5 text-center max-w-[85px] line-clamp-1">
                  {app.copy}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── MODE 2: ORGANIZED BY MAJOR SUBJECT ── */}
      {viewMode === 'by_subject' && (
        <div className="space-y-3.5 px-0.5">
          {MAJOR_SUBJECTS.filter(s => s.id !== 'all').map((subj) => {
            const subjectApps = ADMIN_DEPT_MINI_APPS.filter(a => a.subject === subj.id);
            const SubjIcon = subj.icon;

            return (
              <div key={subj.id} className="p-2.5 rounded-2xl bg-[#0f0e0b] border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 px-1 border-b border-white/5 pb-1.5">
                  <SubjIcon className="w-3.5 h-3.5" style={{ color: subj.color }} />
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: subj.color }}>
                    {subj.label}
                  </span>
                  <span className="text-[9px] text-white/40 ml-auto font-mono">
                    {subjectApps.length} apps
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-y-2.5 gap-x-1.5">
                  {subjectApps.map((app) => {
                    const Icon = app.icon;
                    const isActive = currentDept === app.id;

                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleClick(app)}
                        className="flex flex-col items-center text-center group cursor-pointer focus:outline-none transition-transform active:scale-90"
                      >
                        <div 
                          className={`w-12 h-12 rounded-[15px] bg-gradient-to-br ${app.bgGradient} border ${
                            isActive ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : app.border
                          } relative flex items-center justify-center transition-all group-hover:scale-105`}
                        >
                          <Icon className="w-5 h-5 drop-shadow" style={{ color: app.iconColor }} />
                        </div>
                        <span className={`mt-1 text-[10px] font-semibold truncate max-w-[75px] ${
                          isActive ? 'text-[#D4AF37] font-bold' : 'text-white'
                        }`}>
                          {app.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}