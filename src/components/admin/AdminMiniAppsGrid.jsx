import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Newspaper, GitBranch, ClipboardList, MapPin, 
  Building2, SendHorizontal, Calendar, Mail, MessageSquare,
  Calculator, CloudSun, Mic, Brain, Monitor, Plug, Megaphone,
  FileText, LayoutDashboard, Shield, ShieldCheck, Users, DollarSign
} from 'lucide-react';

export const ADMIN_DEPT_MINI_APPS = [
  // Row 1: Core AI & Voice
  {
    id: 'charlie',
    label: 'Charlie AI',
    copy: 'Voice Concierge',
    icon: Mic,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    badgeCount: 'V2V',
  },
  {
    id: 'specialists',
    label: 'AI Specialists',
    copy: 'Library Canon',
    icon: Brain,
    iconColor: '#c084fc',
    bgGradient: 'from-[#4c1d95] via-[#2e1065] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
  },
  {
    id: 'grok_viewer',
    label: 'Grok Viewer',
    copy: 'Screen Vision',
    icon: Monitor,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
  },

  // Row 2: Connect & Workflows
  {
    id: 'connect_ai',
    label: 'Connect AI',
    copy: 'Integrations',
    icon: Plug,
    iconColor: '#fbbf24',
    bgGradient: 'from-[#78350f] via-[#451a03] to-[#0a0a0a]',
    border: 'border-[#fbbf24]/60',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    copy: 'Atlas & Roadmap',
    icon: GitBranch,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    copy: 'Moves & Dates',
    icon: Calendar,
    iconColor: '#a855f7',
    bgGradient: 'from-[#581c87] via-[#3b0764] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
  },

  // Row 3: Communications & Operations
  {
    id: 'email',
    label: 'Email Desk',
    copy: 'bob@dysonrelo.com',
    icon: Mail,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
    badgeCount: 'LIVE',
  },
  {
    id: 'text',
    label: 'Text / SMS',
    copy: 'Twilio (858) 353-1200',
    icon: MessageSquare,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
  },
  {
    id: 'corporate_relo',
    label: 'Corp Relo HR',
    copy: 'B2B Relocation',
    icon: Building2,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#1e3a8a] via-[#172554] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
  },

  // Row 4: Compliance & News
  {
    id: 'operations',
    label: 'Operations',
    copy: 'Compliance & Audits',
    icon: ShieldCheck,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
  },
  {
    id: 'dnn',
    label: 'DNN News',
    copy: 'Studio Broadcast',
    icon: Newspaper,
    iconColor: '#ef4444',
    bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
    border: 'border-[#ef4444]/60',
    badgeCount: 3,
  },
  {
    id: 'pr_media',
    label: 'PR & Media',
    copy: 'Press Kit CRM',
    icon: Newspaper,
    iconColor: '#f97316',
    bgGradient: 'from-[#7c2d12] via-[#431407] to-[#0a0a0a]',
    border: 'border-[#f97316]/60',
  },

  // Row 5: Agents & Recruiting
  {
    id: 'agents',
    label: 'Agent Desk',
    copy: 'Workfiles Roster',
    icon: ClipboardList,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#172554] via-[#0f172a] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
    badgeCount: 2,
  },
  {
    id: 'affiliate_recruiting',
    label: 'Recruiting',
    copy: 'Affiliate Pipeline',
    icon: Users,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#022c22] to-[#0a0a0a]',
    border: 'border-[#34d399]/60',
  },
  {
    id: 'vetting',
    label: 'Vetting Desk',
    copy: 'Agents & Lenders',
    icon: Shield,
    iconColor: '#a855f7',
    bgGradient: 'from-[#581c87] via-[#2e1065] to-[#0a0a0a]',
    border: 'border-[#a855f7]/60',
  },

  // Row 6: Growth & MLS
  {
    id: 'marketing_hub',
    label: 'Marketing Hub',
    copy: 'Campaigns & SMS',
    icon: Megaphone,
    iconColor: '#ec4899',
    bgGradient: 'from-[#831843] via-[#500724] to-[#0a0a0a]',
    border: 'border-[#ec4899]/60',
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
  },
  {
    id: 'wisdom',
    label: 'Wisdom Relo',
    copy: 'Escrow & Audit',
    icon: Building2,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#06281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
  },

  // Row 7: Campaigns & Tools
  {
    id: 'marketing',
    label: 'Marketing',
    copy: 'Campaigns & Drops',
    icon: SendHorizontal,
    iconColor: '#ec4899',
    bgGradient: 'from-[#831843] via-[#500724] to-[#0a0a0a]',
    border: 'border-[#ec4899]/60',
  },
  {
    id: 'admin_dashboard',
    label: 'Admin Console',
    copy: 'Metrics & Tools',
    icon: LayoutDashboard,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#3b2d11] via-[#1f1608] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
  },
  {
    id: 'business_plan',
    label: 'Business Plan',
    copy: 'Economics & Roadmap',
    icon: FileText,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#422006] via-[#291404] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
  },

  // Row 8: Finance & Utilities
  {
    id: 'calculator',
    label: 'Calculator',
    copy: 'Mortgage & Relo',
    icon: Calculator,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#064e3b] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
  },
  {
    id: 'weather',
    label: 'Weather',
    copy: 'Relo Climates',
    icon: CloudSun,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/60',
  },
  {
    id: 'finance',
    label: 'Finance',
    copy: 'Revenue & Quotas',
    icon: DollarSign,
    iconColor: '#fbbf24',
    bgGradient: 'from-[#713f12] via-[#3f2207] to-[#0a0a0a]',
    border: 'border-[#fbbf24]/60',
  },
];

export default function AdminMiniAppsGrid({ className = '', onSelectApp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDept = new URLSearchParams(location.search).get('dept');

  const handleClick = (app) => {
    if (onSelectApp) {
      onSelectApp(app.id);
    }
    navigate(`/admin?dept=${app.id}`);
  };

  return (
    <div className={`space-y-2 select-none ${className}`}>
      {/* Direct Mini Apps Header without categories */}
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
        <span>DEPARTMENT MINI APPS:</span>
        <span className="text-white/40 font-mono text-[9.5px]">({ADMIN_DEPT_MINI_APPS.length})</span>
      </div>

      {/* Pure 3-Column Squircle Mini App Grid */}
      <div className="grid grid-cols-3 gap-y-3.5 gap-x-2 px-0.5">
        {ADMIN_DEPT_MINI_APPS.map((app) => {
          const Icon = app.icon;
          const isActive = currentDept === app.id;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => handleClick(app)}
              className="flex flex-col items-center text-center group cursor-pointer focus:outline-none transition-transform active:scale-90"
              title={`${app.label} · ${app.copy}`}
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
    </div>
  );
}