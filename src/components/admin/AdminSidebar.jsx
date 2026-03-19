import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search, SendHorizontal, Flag, BookOpen, MessageCircle, FileText, Link as LinkIcon } from 'lucide-react';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Overview', path: '/Admin', icon: LayoutDashboard },
  { label: 'Search Listing Profiles', path: '/AdminSearchProfiles', icon: Search },
  { label: 'Listing Owners Info', path: '/AdminOwners', icon: Home },
  { label: 'Listing Outreach Campaigns', path: '/AdminOutreachCampaigns', icon: SendHorizontal },
  { label: 'Clients', path: '/AdminClients', icon: UserCheck },
  { label: 'Message Templates', path: '/AdminTemplates', icon: FileText },
  { label: 'Communications', path: '/AdminCommunications', icon: MessageCircle },
  { label: 'Flagged Messages', path: '/AdminFlaggedConversations', icon: Flag },
  { label: 'Referral Management', path: '/AdminReferrals', icon: LinkIcon },
  { label: 'Business Plan', path: '/BusinessPlan', icon: BookOpen },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex flex-col min-h-screen shrink-0 frosted-dark" style={{ background: '#000', borderRight: '1px solid rgba(212,175,55,0.12)' }}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{ background: '#000', borderBottom: '1px solid #D4AF3733' }}>
        <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="font-black text-sm tracking-tight" style={{ color: '#fff' }}>CONCIERGE</h1>
          <p className="text-xs tracking-widest font-light" style={{ color: '#D4AF37' }}>ADMIN PANEL</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: isActive ? '#D4AF37' : '#fff',
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Preview & Back */}
      <div className="p-3 space-y-1" style={{ background: '#000', borderTop: '1px solid #1a1a1a' }}>
        <Link
          to="/GeminiSession"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          <span className="text-base">👁️</span>
          Preview Client Flow
        </Link>
        <Link
          to="/Dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#aaa' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Client Dashboard
        </Link>
        <Link
          to="/Chat"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#aaa' }}
        >
          <MessageCircle className="w-4 h-4" />
          Client Chat
        </Link>
      </div>
    </aside>
  );
}