import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Sparkles, ShieldCheck, BookOpen, Compass, 
  Play, Mic, Phone, Building, FileText, Search,
  Users, MapPin, DollarSign, Award, HelpCircle
} from 'lucide-react';

// Icon catalog for customizable buttons
export const AVAILABLE_ICONS = {
  Home,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Compass,
  Play,
  Mic,
  Phone,
  Building,
  FileText,
  Search,
  Users,
  MapPin,
  DollarSign,
  Award,
  HelpCircle
};

// Preset configurations for different portal roles
export const PORTAL_SPRINGBOARD_PRESETS = {
  first_time_user: [
    {
      id: 'explore_move',
      label: 'Explore Move',
      sub: 'Start Relocation',
      badge: 'Step 1',
      iconName: 'Compass',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1c1917] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/60',
      path: '/relocation-intake',
    },
    {
      id: 'ask_charlie',
      label: 'Ask Charlie',
      sub: 'Instant Answers',
      badge: 'Voice AI',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/talking-app',
    },
    {
      id: 'vet_listing',
      label: 'Vet Listing',
      sub: 'Paste Any Link',
      badge: 'Free Audit',
      iconName: 'ShieldCheck',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/50',
      path: '/search',
    },
    {
      id: 'city_guides',
      label: 'City Guides',
      sub: 'Taxes & Schools',
      iconName: 'MapPin',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#292524] via-[#141414] to-[#0a0a0a]',
      border: 'border-[#e8c84a]/40',
      path: '/city-guide',
    },
    {
      id: 'transparency',
      label: 'Fiduciary',
      sub: 'Zero Referral Bias',
      badge: 'Promise',
      iconName: 'Award',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#111111] to-[#0a0a0a]',
      border: 'border-[#10b981]/60',
      path: '/transparency',
    },
    {
      id: 'dnn_news',
      label: 'DNN News',
      sub: '6 AM Broadcast',
      badge: 'Daily',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'referral_split',
      label: 'Refer & Earn',
      sub: '25% Net Payout',
      badge: '25%',
      iconName: 'DollarSign',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/refer',
    },
    {
      id: 'concierge_desk',
      label: 'Live Desk',
      sub: 'Direct Telephone',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  client_subscriber: [
    {
      id: 'relocate',
      label: 'My Move',
      sub: 'Live Roadmap',
      badge: 'Active',
      iconName: 'Home',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/client-roadmap',
    },
    {
      id: 'strategy',
      label: 'Strategy',
      sub: 'Tax & Solutions',
      iconName: 'Sparkles',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#1c1917] via-[#121212] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      path: '/solutions?prompt=Tax%20migration%20and%201031%20exchange%20strategy&autostart=true',
    },
    {
      id: 'vet',
      label: 'Vet Agent',
      sub: 'Search / Refer',
      iconName: 'ShieldCheck',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/refer',
    },
    {
      id: 'library',
      label: 'My Library',
      sub: 'Deeds & Files',
      badge: 'Vault',
      iconName: 'BookOpen',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/40',
      action: 'modal:library',
    },
    {
      id: 'roadmap',
      label: 'Phases',
      sub: 'Steps & Escrow',
      iconName: 'Compass',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/client-roadmap',
    },
    {
      id: 'news',
      label: 'DNN News',
      sub: 'Market Pulse',
      badge: '6 AM',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'charlie',
      label: 'Charlie AI',
      sub: 'Live Voice',
      badge: 'Live',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/60',
      path: '/talking-app',
    },
    {
      id: 'concierge',
      label: 'Fiduciary',
      sub: 'Direct Desk',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  agent: [
    {
      id: 'workfile',
      label: 'Workfile',
      sub: 'Active Escrows',
      badge: 'Audit',
      iconName: 'FileText',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/agent-command-center',
    },
    {
      id: 'referrals',
      label: 'Referrals',
      sub: '25% Net Payouts',
      badge: 'Incoming',
      iconName: 'DollarSign',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/refer',
    },
    {
      id: 'bureau',
      label: 'DNN Bureau',
      sub: 'Daily Co-Branding',
      badge: 'Broadcast',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'compliance',
      label: 'DRE Audit',
      sub: 'License & ICA',
      badge: 'Verified',
      iconName: 'ShieldCheck',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/40',
      path: '/referral-forms',
    },
  ]
};

export default function SpringboardGrid({ 
  buttons, 
  columns = 4, 
  onAction,
  onEditButton,
  onDeleteButton,
  isEditMode = false
}) {
  const navigate = useNavigate();

  const handleLaunch = (btn) => {
    if (isEditMode && onEditButton) {
      onEditButton(btn);
      return;
    }
    if (btn.action) {
      if (typeof btn.action === 'function') {
        btn.action();
      } else if (btn.action.startsWith('tel:') || btn.action.startsWith('mailto:')) {
        window.open(btn.action);
      } else if (onAction) {
        onAction(btn.action, btn);
      }
    } else if (btn.path) {
      if (btn.path.startsWith('/')) {
        navigate(btn.path);
      } else {
        window.open(btn.path, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const gridColsClass = columns === 3 
    ? 'grid-cols-3' 
    : columns === 2 
    ? 'grid-cols-2' 
    : 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-3 sm:gap-4 py-1`}>
      {buttons.map((btn) => {
        const IconComponent = AVAILABLE_ICONS[btn.iconName] || Home;
        return (
          <div key={btn.id} className="relative group">
            <button
              type="button"
              onClick={() => handleLaunch(btn)}
              className="w-full flex flex-col items-center text-center cursor-pointer focus:outline-none"
            >
              {/* Squircle App Icon Container */}
              <div 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${btn.bgGradient || 'from-[#1a1a1a] to-[#0a0a0a]'} border ${btn.border || 'border-[#D4AF37]/50'} shadow-md group-hover:shadow-xl group-hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
              >
                {/* Glossy top highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />

                {/* Optional Status Badge */}
                {btn.badge && (
                  <span 
                    className={`absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider border leading-none shadow-sm ${
                      btn.badge === 'Live' || btn.badge === 'Voice AI' || btn.badge === 'Promise'
                        ? 'bg-[#10b981] text-black border-black animate-pulse'
                        : btn.badge === '6 AM' || btn.badge === 'Daily'
                        ? 'bg-[#ef4444] text-white border-white/20'
                        : 'bg-[#D4AF37] text-black border-black/40'
                    }`}
                  >
                    {btn.badge}
                  </span>
                )}

                <IconComponent 
                  className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" 
                  style={{ color: btn.iconColor || '#D4AF37' }} 
                />
              </div>

              {/* App Label */}
              <span className="mt-1.5 text-xs font-bold text-[#0a0a0a] group-hover:text-[#854d0e] transition-colors leading-tight truncate max-w-[84px]">
                {btn.label}
              </span>
              {/* Secondary micro-label */}
              {btn.sub && (
                <span className="text-[9px] text-[#554433] leading-none mt-0.5 hidden sm:block truncate max-w-[88px]">
                  {btn.sub}
                </span>
              )}
            </button>

            {/* In Edit Mode: allow deleting button */}
            {isEditMode && onDeleteButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteButton(btn.id);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
                title="Remove App Button"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}