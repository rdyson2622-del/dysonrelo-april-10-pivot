import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Star, ChevronDown, ChevronRight, Smartphone, Sparkles, 
  Layout, Map, DoorOpen, Building2, ShieldCheck, MessageCircle, 
  ExternalLink, Layers
} from 'lucide-react';

const GOLD = '#D4AF37';

export const WORKING_MODELS = [
  {
    id: 'app_store_catalog',
    title: '10 Apps & Specs Catalog',
    sub: 'DysonRelo modules (Apple-style icons)',
    badge: 'CATALOG',
    path: '/admin/app-store-mockup?tab=app_store_catalog',
    icon: Smartphone,
    iconColor: '#10b981',
  },
  {
    id: 'full_page_mockup',
    title: 'Page + Springboard Mockup',
    sub: 'Full luxury hero + 3-across grid',
    badge: 'MOCKUP',
    path: '/admin/app-store-mockup?tab=full_mockup',
    icon: Layout,
    iconColor: '#D4AF37',
  },
  {
    id: 'pills_inspector',
    title: 'Pill Styles Inspector',
    sub: 'Row pills vs 3x3 squircle grid',
    badge: 'INSPECTOR',
    path: '/admin/app-store-mockup?tab=pills_inspector',
    icon: Sparkles,
    iconColor: '#e8c84a',
  },
  {
    id: 'client_backside',
    title: 'Client Backside Demo',
    sub: 'Verified subscriber workspace',
    badge: 'DEMO',
    path: '/admin/front-door-lab?view=client_backside',
    icon: Star,
    iconColor: '#60a5fa',
  },
  {
    id: 'front_door_lab',
    title: 'Front Door Prototype',
    sub: 'MLS search, News & Charlie AI',
    badge: 'PROTOTYPE',
    path: '/admin/front-door-lab',
    icon: Star,
    iconColor: '#f87171',
  },
  {
    id: 'entry_page_preview',
    title: 'Road Map Entry Page',
    sub: 'Live public front door',
    badge: 'FRONT DOOR',
    path: '/',
    icon: Map,
    iconColor: '#34d399',
  },
  {
    id: 'role_selector',
    title: 'Role Selector Portal',
    sub: 'Visitor persona switcher',
    badge: 'PORTAL',
    path: '/portal?choose=1',
    icon: Layers,
    iconColor: '#a78bfa',
  },
  {
    id: 'brokerage_portal',
    title: 'Brokerage Portal (Wisdom)',
    sub: 'Subscriber #1 operational suite',
    badge: 'SUBSCRIBER',
    path: '/brokerage',
    icon: Building2,
    iconColor: '#D4AF37',
  },
  {
    id: 'entry_portal',
    title: 'First-Time Visitor Portal',
    sub: '6th Door guest experience',
    badge: 'ENTRY',
    path: '/admin/entry-portal',
    icon: DoorOpen,
    iconColor: '#38bdf8',
  },
  {
    id: 'transparency',
    title: 'Transparency Explainer',
    sub: 'Fiduciary advantage vs portals',
    badge: 'ADVANTAGE',
    path: '/admin/transparency',
    icon: ShieldCheck,
    iconColor: '#10b981',
  },
  {
    id: 'talk_to_us',
    title: 'Talk To Us Request Library',
    sub: 'Inbound requests & solutions',
    badge: 'REQUESTS',
    path: '/admin/talk-to-us-requests',
    icon: MessageCircle,
    iconColor: '#f59e0b',
  },
];

export default function AdminWorkingModelsScroll() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const currentPath = location.pathname + location.search;

  return (
    <div className="my-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#0d0d0d] overflow-hidden shadow-lg">
      {/* Scroll Box Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 flex items-center justify-between text-left bg-[#141414] hover:bg-[#1a1a1a] transition-colors cursor-pointer border-b border-white/10"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Layers className="w-3 h-3 text-[#D4AF37] shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] truncate">
            WORKING MODELS SCROLL ({WORKING_MODELS.length})
          </span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-white/50 shrink-0 font-medium">
          <span>{isOpen ? 'scroll to view' : 'expand'}</span>
          {isOpen ? <ChevronDown className="w-2.5 h-2.5 text-[#D4AF37]" /> : <ChevronRight className="w-2.5 h-2.5 text-[#D4AF37]" />}
        </div>
      </button>

      {/* Scrollable Container */}
      {isOpen && (
        <div 
          className="max-h-48 overflow-y-auto p-1.5 space-y-1 select-none"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(212,175,55,0.4) rgba(0,0,0,0.5)',
          }}
        >
          {WORKING_MODELS.map((model) => {
            const Icon = model.icon;
            const isActive = currentPath === model.path || location.pathname === model.path.split('?')[0];

            return (
              <Link
                key={model.id}
                to={model.path}
                className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-[#221c10] border border-[#D4AF37] text-white shadow-sm' 
                    : 'bg-[#121212] hover:bg-[#181818] border border-white/5 text-white/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-6 h-6 rounded-md bg-black/60 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                  >
                    <Icon className="w-3 h-3" style={{ color: model.iconColor }} />
                  </div>

                  <div className="min-w-0 leading-tight">
                    <div className="text-[11px] font-bold truncate group-hover:text-[#D4AF37] transition-colors">
                      {model.title}
                    </div>
                    <div className="text-[8.5px] text-white/45 truncate">
                      {model.sub}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <span className="px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider bg-black border border-[#D4AF37]/50 text-[#D4AF37]">
                    {model.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}