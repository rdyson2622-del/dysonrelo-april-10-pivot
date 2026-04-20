import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Zap, Settings, Phone, Map, GitCompare, Users, Search, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'My Dashboard',     path: '/',                 icon: LayoutDashboard },
  { label: 'My Roadmap',       path: '/RelocationRoadmap',   icon: Map },
  { label: 'City Guide',       path: '/CityGuide',           icon: MapPin },
  { label: 'Gemini Session',   path: '/GeminiSession',    icon: Zap },
];

const authorityLinks = [
  { label: '55-Year Legacy', to: '/bob-dyson' },
  { label: 'The 1927 Parallel', to: '/Explainers#1927' },
  { label: '21 AI Assistants', to: '/ai-assistants' },
];

export default function ClientSidebar() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user?.email) return;
      base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1).then(clients => {
        if (clients.length > 0) {
          const id = clients[0].id;
          setClientId(id);
          // Count admin replies not yet seen (simple: count admin messages)
          base44.entities.ChatMessage.filter({ client_id: id, role: 'admin' }, '-created_date', 10).then(msgs => {
            setUnreadCount(msgs.length);
          });
        }
      });
    });
  }, []);

  return (
    <aside className="w-56 shrink-0 flex flex-col min-h-screen overflow-y-auto"
      style={{ background: '#0d0d0d', borderRight: '1px solid rgba(212,175,55,0.15)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        </Link>
        <p className="text-xs mt-2 tracking-widest font-semibold" style={{ color: GOLD }}>
          CLIENT PORTAL
        </p>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 space-y-1">
        {/* Communications Hub — first nav item, most prominent */}
        <Link to="/chat">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: unreadCount > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(212,175,55,0.12)',
              border: unreadCount > 0 ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(212,175,55,0.35)',
              color: unreadCount > 0 ? '#ef4444' : GOLD,
            }}>
            <div className="relative shrink-0">
              <MessageCircle className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black animate-pulse"
                  style={{ background: '#ef4444', color: '#fff' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="flex-1">
              {unreadCount > 0 ? `${unreadCount} New Reply` : 'Communications Hub'}
            </span>
            <span className="text-[10px] opacity-50">→</span>
          </div>
        </Link>
        {unreadCount === 0 && (
          <p className="text-[10px] px-2 pb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Questions? We reply within 1 hour.
          </p>
        )}

        {/* My Dashboard */}
        {(() => {
          const item = navItems[0];
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link to={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'text-black' : 'hover:bg-white/5'}`}
                style={{ background: active ? GOLD : 'transparent', color: active ? '#000' : '#fff' }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })()}
      </nav>

      {/* Quick Links */}
      <div className="px-3 pb-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[2px] px-2 font-bold" style={{ color: GOLD }}>
          Quick Links
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/search" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/search' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/search' ? '#000' : '#fff' }}>
            <Search className="w-3.5 h-3.5" /> Search Homes
          </Link>
          <Link to="/PropertyComparison" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/PropertyComparison' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/PropertyComparison' ? '#000' : '#fff' }}>
            <GitCompare className="w-3.5 h-3.5" /> Compare Homes
          </Link>
          <Link to="/RelocationRoadmap" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/RelocationRoadmap' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/RelocationRoadmap' ? '#000' : '#fff' }}>
            <Map className="w-3.5 h-3.5" /> My Roadmap
          </Link>
          <Link to="/FindAgent" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/FindAgent' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/FindAgent' ? '#000' : '#fff' }}>
            <Users className="w-3.5 h-3.5" /> Vet Agents
          </Link>
          <Link to="/CityGuide" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/CityGuide' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/CityGuide' ? '#000' : '#fff' }}>
            <MapPin className="w-3.5 h-3.5" /> City Guide
          </Link>
          <Link to="/GeminiSession" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: location.pathname === '/GeminiSession' ? GOLD : 'rgba(255,255,255,0.05)', color: location.pathname === '/GeminiSession' ? '#000' : '#fff' }}>
            <Zap className="w-3.5 h-3.5" /> Gemini Session
          </Link>
        </div>
      </div>

      {/* Heritage & Authority */}
      <div className="pt-4 border-t mx-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="text-[10px] uppercase tracking-[2px] mb-3 px-2 font-bold" style={{ color: GOLD }}>
          Our Authority
        </div>
        <nav className="space-y-1">
          {authorityLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="block px-2 py-1 text-sm transition-colors hover:text-[#D4AF37]"
              style={{ color: '#fff' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Human Help */}
      <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <p className="text-xs font-bold tracking-widest mb-1" style={{ color: GOLD }}>NEED A HUMAN?</p>
        <p className="text-xs mb-2" style={{ color: '#fff' }}>We're here Mon–Sat, 9am–7pm PT</p>
        <a href="tel:+18583531200" className="flex items-center gap-2 group">
          <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
          <span className="text-sm font-bold tracking-wide group-hover:underline" style={{ color: '#fff' }}>
            (858) 353-1200
          </span>
        </a>
        <p className="text-xs mt-1" style={{ color: '#fff' }}>Dyson Relo Direct Line</p>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 pb-8 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
        <Link to="/admin">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
            style={{ color: '#fff' }}>
            <Settings className="w-4 h-4 shrink-0" />
            Admin Panel
          </div>
        </Link>
      </div>

    </aside>
  );
}