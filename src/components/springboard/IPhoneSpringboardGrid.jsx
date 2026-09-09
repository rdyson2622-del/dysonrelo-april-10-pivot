import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, Home, Building, Users, ArrowRight, 
  Play, ShieldCheck, BookOpen, Phone, Compass, 
  Sparkles, FileText, Search, MessageSquare,
  Calendar, Mail, Calculator, CloudSun
} from 'lucide-react';
import MiniAppModal from '@/components/miniapps/MiniAppModal';

export const IPHONE_DEFAULT_APPS = [
  {
    id: 'charlie',
    label: 'Charlie AI',
    copy: 'Live 2-Way Voice',
    icon: Mic,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#0d281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/50',
    badgeCount: 1, // Red iOS badge count like screenshot
    route: '/talking-app',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    copy: 'Move Milestones',
    icon: Compass,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/50',
    badgeCount: 3,
    route: '/client-roadmap',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    copy: 'Move Dates & Sync',
    icon: Calendar,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#1e3a8a] via-[#172554] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/50',
    isMiniApp: true,
    route: '/calendar',
  },
  {
    id: 'email',
    label: 'Email',
    copy: 'Connect & Inbox',
    icon: Mail,
    iconColor: '#fb923c',
    bgGradient: 'from-[#9a3412] via-[#7c2d12] to-[#0a0a0a]',
    border: 'border-[#ea580c]/50',
    badgeCount: 1,
    isMiniApp: true,
    route: '/email',
  },
  {
    id: 'calculator',
    label: 'Calculator',
    copy: 'Mortgage & Relo',
    icon: Calculator,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#064e3b] to-[#0a0a0a]',
    border: 'border-[#10b981]/50',
    isMiniApp: true,
    route: '/calculator',
  },
  {
    id: 'weather',
    label: 'Weather',
    copy: 'Local & Target',
    icon: CloudSun,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-[#38bdf8]/50',
    isMiniApp: true,
    route: '/weather',
  },
  {
    id: 'strategy',
    label: 'Strategy',
    copy: 'Tax & Solutions',
    icon: Sparkles,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#2b2210] via-[#17130b] to-[#0a0a0a]',
    border: 'border-[#e8c84a]/50',
    route: '/solutions',
  },
  {
    id: 'vet',
    label: 'Vet Listing',
    copy: 'Fiduciary Audit',
    icon: ShieldCheck,
    iconColor: '#34d399',
    bgGradient: 'from-[#064e3b] via-[#0a1f16] to-[#0a0a0a]',
    border: 'border-[#10b981]/50',
    route: '/refer',
  },
  {
    id: 'library',
    label: 'My Library',
    copy: 'Vault & Deeds',
    icon: BookOpen,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#10223d] via-[#0c1626] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/50',
    badgeCount: 4,
    route: '/media',
  },
  {
    id: 'news',
    label: '6AM News',
    copy: 'Daily Market Pulse',
    icon: Play,
    iconColor: '#ef4444',
    bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
    border: 'border-[#ef4444]/50',
    badgeCount: 11,
    route: '/dnn-news',
  },
  {
    id: 'agent',
    label: 'My Agent',
    copy: 'Vetted Broker',
    icon: Users,
    iconColor: '#93c5fd',
    bgGradient: 'from-[#172554] via-[#0f172a] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/50',
    route: '/my-agent',
  },
  {
    id: 'refer',
    label: 'Refer Lead',
    copy: 'Client & Earn Fee',
    icon: ArrowRight,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/50',
    badgeCount: 2,
    route: '/refer',
  },
  {
    id: 'concierge',
    label: 'Concierge',
    copy: 'Direct Fiduciary',
    icon: Phone,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/50',
    route: 'tel:+18583531200',
  },
];

// Alias for clean terminology
export const MINI_APPS_CATALOG = IPHONE_DEFAULT_APPS;

export default function IPhoneSpringboardGrid({
  apps = IPHONE_DEFAULT_APPS,
  onAppClick,
  columns = 3,
  showCopy = true,
  className = '',
  useModalForMiniApps = true,
}) {
  const navigate = useNavigate();
  const [activeModalApp, setActiveModalApp] = useState(null);

  const handleClick = (app) => {
    if (onAppClick) {
      onAppClick(app);
      return;
    }

    // Interactive in-place modal for the 4 core mini apps when preferred
    if (app.isMiniApp && useModalForMiniApps) {
      setActiveModalApp(app.id);
      return;
    }

    if (app.route?.startsWith('tel:')) {
      window.open(app.route);
    } else if (app.route) {
      navigate(app.route);
    }
  };

  const colClass = columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <>
      <div className={`grid ${colClass} gap-y-4 gap-x-2.5 px-0.5 ${className}`}>
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => handleClick(app)}
              className="flex flex-col items-center text-center group cursor-pointer focus:outline-none select-none transition-transform active:scale-90"
              title={`${app.label} · ${app.copy || ''}`}
            >
              {/* Mini App Squircle Tile */}
              <div 
                className={`w-14 h-14 sm:w-15 sm:h-15 rounded-[18px] bg-gradient-to-br ${app.bgGradient} border ${app.border} relative flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.25)]`}
                style={{
                  boxShadow: '0 6px 18px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2)',
                }}
              >
                {/* Mini App Glass Gloss Sheen (Top Half) */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/8 to-transparent pointer-events-none rounded-t-[18px]" />

                {/* Notification Count Badge */}
                {app.badgeCount && (
                  <span 
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#ff3b30] text-white font-black text-[10px] flex items-center justify-center shadow-lg border-[1.5px] border-black tracking-tight z-10"
                    style={{
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                    }}
                  >
                    {app.badgeCount}
                  </span>
                )}

                {/* Text Badge Fallback */}
                {!app.badgeCount && app.badge && (
                  <span 
                    className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[6.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37] shadow-md z-10"
                  >
                    {app.badge}
                  </span>
                )}

                {/* App Icon */}
                <Icon 
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-200 group-hover:scale-110 drop-shadow" 
                  style={{ color: app.iconColor }} 
                />
              </div>

              {/* Line 1: Mini App Label directly below icon in crisp white font */}
              <span className="mt-1.5 text-[11px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors leading-tight text-center max-w-[80px] truncate">
                {app.label}
              </span>

              {/* Line 2: Copy text below */}
              {showCopy && app.copy && (
                <span className="text-[8.5px] text-white/50 group-hover:text-white/80 leading-tight mt-0.5 text-center max-w-[80px] line-clamp-1">
                  {app.copy}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive In-Place Mini App Modal */}
      {activeModalApp && (
        <MiniAppModal
          appId={activeModalApp}
          isOpen={Boolean(activeModalApp)}
          onClose={() => setActiveModalApp(null)}
        />
      )}
    </>
  );
}