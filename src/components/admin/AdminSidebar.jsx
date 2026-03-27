import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search, SendHorizontal, Flag, BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Fingerprint } from 'lucide-react';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search },
  { label: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Fingerprint },
  { label: 'Listing Owners Info', path: '/admin/owners', icon: Home },
  { label: 'Listing Outreach Campaigns', path: '/admin/outreach-campaigns', icon: SendHorizontal },
  { label: 'Clients', path: '/admin/clients', icon: UserCheck },
  { label: 'Presentation Library', path: '/admin/presentation-library', icon: FileText },
  { label: 'Communications', path: '/admin/communications', icon: MessageCircle },
  { label: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag },
  { label: 'Referral Management', path: '/admin/referrals', icon: LinkIcon },
  { label: "Charlie's Scripts", path: '/admin/charlie-scripts', icon: ScrollText },
  { label: 'Business Plan', path: '/business-plan', icon: BookOpen },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageCode, setPageCode] = useState('');

  const handlePageJump = (e) => {
    e.preventDefault();
    if (!pageCode.trim()) return;

    // Parse page code (e.g., "1C" → page 1, or just "14" → page 14)
    const match = pageCode.toUpperCase().match(/^(\d+)([A-Z])?$/);
    if (match) {
      const pageNum = match[1];
      const pageData = PAGE_REGISTRY[pageNum];
      if (pageData) {
        navigate(pageData.path);
        setPageCode('');
      }
    }
  };

  return (
    <aside className="w-64 flex flex-col min-h-screen shrink-0 frosted-dark" style={{ background: '#000', borderRight: '1px solid rgba(212,175,55,0.12)' }}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{ background: '#000', borderBottom: '1px solid #D4AF3733' }}>
        <Link to="/home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="font-black text-sm tracking-tight" style={{ color: '#fff' }}>CONCIERGE</h1>
          <p className="text-xs tracking-widest font-light" style={{ color: '#D4AF37' }}>ADMIN PANEL</p>
        </div>
      </div>

      {/* Quick Page Jump */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <form onSubmit={handlePageJump} className="flex gap-2">
          <input
            type="text"
            value={pageCode}
            onChange={(e) => setPageCode(e.target.value.toUpperCase())}
            placeholder="Go to page (e.g., 1C, 14)"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: '#fff',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Type page # or code (1-31, 1A, 14B)</p>
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
      <div className="p-3 space-y-1 pb-20" style={{ background: '#000', borderTop: '1px solid #1a1a1a' }}>
        <Link
          to="/gemini"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          <span className="text-base">👁️</span>
          Preview Client Flow
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#aaa' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Client Dashboard
        </Link>
        <Link
          to="/chat"
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