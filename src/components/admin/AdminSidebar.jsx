import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search, SendHorizontal, Flag, BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, Hash, ExternalLink } from 'lucide-react';
import { SECTION_REGISTRY, getSectionById } from '@/lib/sectionRegistry';
import { PAGE_REGISTRY, getPageByNumber } from '@/lib/pageRegistry';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Overview', path: '/Admin', icon: LayoutDashboard },
  { label: 'Search Listing Profiles', path: '/AdminSearchProfiles', icon: Search },
  { label: 'Listing Owners Info', path: '/AdminOwners', icon: Home },
  { label: 'Listing Outreach Campaigns', path: '/AdminOutreachCampaigns', icon: SendHorizontal },
  { label: 'Clients', path: '/AdminClients', icon: UserCheck },
  { label: 'Presentation Library', path: '/AdminPresentationLibrary', icon: FileText },
  { label: 'Communications', path: '/AdminCommunications', icon: MessageCircle },
  { label: 'Flagged Messages', path: '/AdminFlaggedConversations', icon: Flag },
  { label: 'Referral Management', path: '/AdminReferrals', icon: LinkIcon },
  { label: "Charlie's Scripts", path: '/AdminCharlieScripts', icon: ScrollText },
  { label: 'Business Plan', path: '/BusinessPlan', icon: BookOpen },
];

const GOLD = '#D4AF37';

function JumpSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const num = parseInt(query.trim().replace('#', ''));
    if (!num) return;

    // Try section registry first (100+)
    if (num >= 100) {
      const section = getSectionById(num);
      if (section) {
        setResult({ type: 'section', ...section, id: num });
        setNotFound(false);
        navigate(section.path.includes(':') ? section.path.replace(':clientId', '').replace(':ownerId', '') : section.path);
        setTimeout(() => {
          const el = document.getElementById(section.anchor);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
        return;
      }
    }

    // Try page registry (1–99)
    const page = getPageByNumber(num);
    if (page) {
      setResult({ type: 'page', ...page, id: num });
      setNotFound(false);
      navigate(page.path.includes(':') ? page.path.replace(':clientId', '').replace(':ownerId', '') : page.path);
      return;
    }

    setResult(null);
    setNotFound(true);
  };

  return (
    <div className="px-3 pb-3 pt-2" style={{ borderTop: '1px solid #1a1a1a' }}>
      <p className="text-xs font-bold tracking-widest mb-2" style={{ color: GOLD }}>JUMP TO PAGE #</p>
      <form onSubmit={handleSearch} className="flex gap-1.5">
        <div className="relative flex-1">
          <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: '#555' }} />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setNotFound(false); setResult(null); }}
            placeholder="101, 202..."
            className="w-full pl-6 pr-2 py-1.5 rounded-lg text-xs font-mono"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', outline: 'none' }}
          />
        </div>
        <button type="submit" className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{ background: GOLD, color: '#000' }}>
          Go
        </button>
      </form>
      {result && (
        <div className="mt-2 p-2 rounded-lg text-xs" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
          <p className="font-bold mb-0.5" style={{ color: GOLD }}>#{result.id} — {result.label || result.name}</p>
          {result.file && <p className="font-mono" style={{ color: '#888' }}>{result.file}</p>}
          {result.anchor && <p style={{ color: '#666' }}>anchor: #{result.anchor}</p>}
        </div>
      )}
      {notFound && (
        <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>No section or page found for that ID.</p>
      )}
    </div>
  );
}

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

      {/* Jump Search */}
      <JumpSearch />

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