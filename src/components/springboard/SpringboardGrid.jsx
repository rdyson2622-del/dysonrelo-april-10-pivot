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
  // First-time visitor / cold entry: 3 doors (Family / HR / Agents) + News + Charlie + Concierge
  first_time_user: [
    {
      id: 'family_relo',
      label: 'Family Relo',
      sub: 'Explore Move',
      badge: 'Door 1',
      iconName: 'Home',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1c1917] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/60',
      path: '/relocation-intake',
    },
    {
      id: 'corporate_hr',
      label: 'Corporate HR',
      sub: 'Move Packages',
      badge: 'Door 2',
      iconName: 'Building',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#292524] via-[#141414] to-[#0a0a0a]',
      border: 'border-[#e8c84a]/50',
      path: '/corporate-relo',
    },
    {
      id: 'agent_broker',
      label: 'Agent / Broker',
      sub: 'PRN Network',
      badge: 'Door 3',
      iconName: 'Users',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/50',
      path: '/broker-portal',
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
      id: 'ask_charlie',
      label: 'Charlie AI',
      sub: 'Live Voice AI',
      badge: 'Live',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/talking-app',
    },
    {
      id: 'concierge_desk',
      label: 'Concierge',
      sub: 'Direct Line',
      badge: 'Direct',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  // First-time sidebar: specifically the 3 doors + News + Charlie + Concierge
  first_time_sidebar: [
    {
      id: 'door_family',
      label: 'Family Relo',
      sub: 'Explore Move',
      badge: 'Free',
      iconName: 'Home',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1c1917] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/60',
      path: '/relocation-intake',
    },
    {
      id: 'door_hr',
      label: 'Corporate HR',
      sub: 'Move Packages',
      badge: 'Zero Fee',
      iconName: 'Building',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#292524] via-[#141414] to-[#0a0a0a]',
      border: 'border-[#e8c84a]/50',
      path: '/corporate-relo',
    },
    {
      id: 'door_agent',
      label: 'Agent / Broker',
      sub: 'PRN Network',
      badge: '25% Fee',
      iconName: 'Users',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/50',
      path: '/broker-portal',
    },
    {
      id: 'app_news',
      label: 'DNN News',
      sub: '6 AM Market',
      badge: 'Daily',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'app_charlie',
      label: 'Charlie AI',
      sub: 'Live Voice',
      badge: 'Live',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/talking-app',
    },
    {
      id: 'app_desk',
      label: 'Concierge',
      sub: '(858) 353-1200',
      badge: 'Desk',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  // Returning verified subscriber gets the full personal 8-app grid
  client_subscriber: [
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
      id: 'roadmap',
      label: 'Roadmaps',
      sub: 'Phases & Steps',
      badge: 'Active',
      iconName: 'Compass',
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
      id: 'concierge',
      label: 'Fiduciary',
      sub: 'Direct Desk',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
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
  ],
  corporate_hr: [
    {
      id: 'hr_relo',
      label: 'Relo Desk',
      sub: 'Employee Plans',
      badge: 'Corporate',
      iconName: 'Building',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/corporate-relo',
    },
    {
      id: 'employee_roadmap',
      label: 'Roadmaps',
      sub: 'Phase Tracking',
      iconName: 'Compass',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#1c1917] via-[#121212] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      path: '/client-roadmap',
    },
    {
      id: 'lenders',
      label: 'Lenders',
      sub: 'Executive Rates',
      iconName: 'DollarSign',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/financial-services',
    },
    {
      id: 'charlie_hr',
      label: 'Charlie AI',
      sub: 'Policy Answers',
      badge: 'Live',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/60',
      path: '/talking-app',
    },
    {
      id: 'dnn_market',
      label: 'DNN News',
      sub: 'Market Reports',
      badge: 'Daily',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'account_rep',
      label: 'Direct Rep',
      sub: 'Fiduciary Desk',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  partner_agent: [
    {
      id: 'refer_client',
      label: 'Submit Lead',
      sub: '25% Net Fee',
      badge: '25%',
      iconName: 'ShieldCheck',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/refer',
    },
    {
      id: 'agent_roster',
      label: 'Client Roster',
      sub: 'Track Escrows',
      badge: 'Active',
      iconName: 'Users',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/40',
      path: '/agent-command-center',
    },
    {
      id: 'master_agreement',
      label: 'Agreement',
      sub: 'PRN Contract',
      badge: 'Signed',
      iconName: 'FileText',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/admin/master-agreement',
    },
    {
      id: 'charlie_agent',
      label: 'Charlie AI',
      sub: 'Agent Intel',
      badge: 'Live',
      iconName: 'Mic',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/60',
      path: '/talking-app',
    },
    {
      id: 'dnn_agent_news',
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
      id: 'broker_desk',
      label: 'Broker Desk',
      sub: 'Fiduciary Support',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
  brokerage: [
    {
      id: 'escrow_audit',
      label: 'Doc Audit',
      sub: 'Escrow Review',
      badge: 'Live',
      iconName: 'ShieldCheck',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/brokerage/audit',
    },
    {
      id: 'escrows',
      label: 'Escrows',
      sub: 'Transactions',
      badge: 'Active',
      iconName: 'Shield',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/brokerage/escrow',
    },
    {
      id: 'listings',
      label: 'Listings',
      sub: 'Seller Files',
      iconName: 'Building',
      iconColor: '#e8c84a',
      bgGradient: 'from-[#1c1917] via-[#121212] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      path: '/brokerage/listings',
    },
    {
      id: 'buying_clients',
      label: 'Buyers',
      sub: 'Buyer Roster',
      iconName: 'Compass',
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/40',
      path: '/brokerage/buying-clients',
    },
    {
      id: 'agents',
      label: 'Agents',
      sub: 'Company Roster',
      iconName: 'Users',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/brokerage/agents',
    },
    {
      id: 'referrals',
      label: 'Referrals',
      sub: 'Agent Network',
      badge: '25%',
      iconName: 'DollarSign',
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/brokerage/referrals',
    },
    {
      id: 'dnn_broker_news',
      label: 'DNN News',
      sub: 'Daily Market',
      badge: '6 AM',
      iconName: 'Play',
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'broker_phone',
      label: 'Direct Desk',
      sub: 'Fiduciary Support',
      iconName: 'Phone',
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: 'tel:+18583531200',
    },
  ],
};

export default function SpringboardGrid({ 
  buttons, 
  columns = 4, 
  variant = 'default', // 'default' | 'sidebar'
  theme = 'light', // 'light' | 'dark'
  onAction,
  onEditButton,
  onDeleteButton,
  isEditMode = false
}) {
  const isDark = theme === 'dark' || variant === 'sidebar';
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

  const gapClass = variant === 'sidebar' ? 'gap-2.5 sm:gap-3 py-1' : 'gap-3 sm:gap-4 py-1';
  const iconContainerSize = variant === 'sidebar' ? 'w-14 h-14 rounded-2xl' : 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl';

  return (
    <div className={`grid ${gridColsClass} ${gapClass}`}>
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
                className={`${iconContainerSize} bg-gradient-to-br ${btn.bgGradient || 'from-[#1a1a1a] to-[#0a0a0a]'} border ${btn.border || 'border-[#D4AF37]/50'} shadow-md group-hover:shadow-xl group-hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
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
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform group-hover:scale-110" 
                  style={{ color: btn.iconColor || '#D4AF37' }} 
                />
              </div>

              {/* App Label */}
              <span className={`mt-1.5 text-xs font-bold transition-colors leading-tight truncate max-w-[84px] ${
                isDark 
                  ? 'text-white group-hover:text-[#D4AF37]' 
                  : 'text-[#0a0a0a] group-hover:text-[#854d0e]'
              }`}>
                {btn.label}
              </span>
              {/* Secondary micro-label */}
              {btn.sub && (
                <span className={`text-[9px] leading-none mt-0.5 truncate max-w-[88px] ${
                  isDark ? 'text-white/60' : 'text-[#554433]'
                }`}>
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