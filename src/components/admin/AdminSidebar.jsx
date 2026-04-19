import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search, SendHorizontal, Flag, BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Fingerprint, Target, Megaphone, Share2, List, Zap, Brain, AlertTriangle, ChevronDown, ChevronRight as ChevronRightIcon, Calendar, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';
import AdminCommsBadge from '@/components/admin/AdminCommsBadge';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
  
  { label: 'QUICK SEARCHES', isHeader: true },
  { label: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search },
  { label: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Fingerprint },
  { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline', icon: SendHorizontal },
  { label: 'Compose SMS', path: '/admin/compose-sms', icon: SendHorizontal },
  { label: 'Owner Response Board', path: '/admin/owner-kanban', icon: LayoutDashboard },
  { label: 'Batch SMS Logs', path: '/admin/batch-sms-log', icon: List },

  { label: 'MARKETING CAMPAIGNS', isHeader: true },
  { label: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns', icon: Calendar },
  { label: 'Video SMS Campaign', path: '/admin/video-sms-campaign', icon: Video },
  { label: 'Video Library', path: '/admin/video-library', icon: Video },
  { label: 'Outreach Analytics', path: '/admin/outreach-analytics', icon: BarChart3 },
  { label: 'SMS Sequences', path: '/admin/sms-sequences', icon: MessageCircle },

  { label: 'RESULTS', isHeader: true },
  { label: 'Listing Owners Info', path: '/admin/owners', icon: Home },
  { label: 'Clients', path: '/admin/clients', icon: UserCheck },

  { label: 'OPERATIONS', isHeader: true },
  { label: 'Presentation Library', path: '/admin/presentation-library', icon: FileText },
  { label: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag },
  { label: 'Referral Management', path: '/admin/referrals', icon: LinkIcon },

  { label: "CHARLIE'S BRAIN", isGroup: true, groupKey: 'charlie', children: [
    { label: "Scripts", path: '/admin/charlie-scripts', icon: ScrollText },
    { label: "Knowledge Base", path: '/admin/charlie-knowledge-base', icon: Brain },
    { label: "Escalations", path: '/admin/charlie-escalations', icon: AlertTriangle },
    { label: "Voice Presentation", path: '/charlie-voice', icon: MessageCircle },
  ]},
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageCode, setPageCode] = useState('');
  const [openGroups, setOpenGroups] = useState(() => {
    // Auto-open Charlie group if on a charlie page
    return { charlie: true };
  });

  const toggleGroup = (key) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  // Fetch listing owners and batch logs
  const { data: owners = [] } = useQuery({
    queryKey: ['listingOwners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 2000),
    refetchInterval: 5000,
  });

  const { data: batchLogs = [] } = useQuery({
    queryKey: ['batchSmsLogs'],
    queryFn: () => base44.entities.BatchSMSLog.list('-sent_at', 100),
    refetchInterval: 5000,
  });

  // Calculate campaign status by city
  const activeCampaigns = useMemo(() => {
    const now = new Date();
    const cityMap = {};

    // Group owners by city
    owners.forEach(owner => {
      const city = owner.property_city?.trim() || 'Unknown';
      if (!cityMap[city]) {
        cityMap[city] = { total: 0, unsent: 0, inProgress: false, progress: 0 };
      }
      cityMap[city].total++;
      if (owner.phone && owner.contact_status === 'not_contacted') {
        cityMap[city].unsent++;
      }
    });

    // Mark cities with active batch sends
    batchLogs.forEach(log => {
      if (cityMap[log.city]) {
        const sentAt = new Date(log.sent_at);
        const elapsedMs = now - sentAt;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const totalMinutes = log.sent_count * 3;
        const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);
        
        if (remainingMinutes > 0) {
          const estimatedSent = Math.min(log.sent_count, Math.floor(elapsedMinutes / 3));
          cityMap[log.city].inProgress = true;
          cityMap[log.city].progress = Math.min(100, Math.round((estimatedSent / log.sent_count) * 100));
        }
      }
    });

    // Return only cities with unsent messages or active sends, sorted by unsent count
    return Object.entries(cityMap)
      .filter(([_, data]) => data.unsent > 0 || data.inProgress)
      .map(([city, data]) => ({
        city,
        total: data.total,
        unsent: data.unsent,
        inProgress: data.inProgress,
        progress: data.progress,
      }))
      .sort((a, b) => b.unsent - a.unsent);
  }, [owners, batchLogs]);

  const handlePageJump = (e) => {
    e.preventDefault();
    if (!pageCode.trim()) return;

    // Try number match first (e.g., "22", "1C")
    const match = pageCode.toUpperCase().match(/^(\d+)([A-Z])?$/);
    if (match) {
      const pageNum = match[1];
      const pageData = PAGE_REGISTRY[pageNum];
      if (pageData) {
        navigate(pageData.path);
        setPageCode('');
        return;
      }
    }

    // Try name search (e.g., "comm" → Communications)
    const query = pageCode.toLowerCase();
    const found = Object.values(PAGE_REGISTRY).find(p => p.name.toLowerCase().includes(query));
    if (found) {
      navigate(found.path);
      setPageCode('');
    }
  };

  // Live name-search suggestions
  const suggestions = pageCode.trim() && !/^\d/.test(pageCode)
    ? Object.entries(PAGE_REGISTRY).filter(([, p]) => p.name.toLowerCase().includes(pageCode.toLowerCase())).slice(0, 4)
    : [];

  return (
    <aside className="w-64 flex flex-col h-screen shrink-0 overflow-y-auto frosted-dark" style={{ background: '#000', borderRight: '1px solid rgba(212,175,55,0.12)' }}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{ background: '#000', borderBottom: '1px solid #D4AF3733' }}>
        <Link to="/home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="font-black text-sm tracking-tight" style={{ color: '#fff' }}>CONCIERGE</h1>
          <p className="text-xs tracking-widest font-light" style={{ color: '#D4AF37' }}>ADMIN PANEL</p>
        </div>
      </div>

      {/* Communication Hub Widget — top priority */}
      <div className="pt-3 pb-1">
        <AdminCommsBadge />
      </div>

      {/* Nav */}
      <nav className="py-2 px-3 space-y-1">
        {navItems.map((item, idx) => {
          // Header items (gold sections)
          if (item.isHeader) {
            return (
              <div key={idx} className="mt-3 pt-2 first:mt-0 first:pt-0">
                <p className="text-xs font-bold tracking-[0.25em] px-3 py-1" style={{ color: '#D4AF37' }}>{item.label}</p>
              </div>
            );
          }

          // Group items (Charlie's Brain)
          if (item.isGroup) {
            const isOpen = openGroups[item.groupKey];
            const isChildActive = item.children?.some(c => location.pathname === c.path);
            return (
              <div key={idx}>
                <button
                  onClick={() => toggleGroup(item.groupKey)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: isChildActive ? 'rgba(167,139,250,0.1)' : 'transparent',
                    color: '#A78BFA',
                  }}
                >
                  <Brain className="w-4 h-4" />
                  <span className="flex-1 text-left tracking-wide">{item.label}</span>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />}
                </button>
                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-3" style={{ borderColor: 'rgba(167,139,250,0.25)' }}>
                    {item.children.map(child => {
                      const isActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                          style={{
                            background: isActive ? 'rgba(167,139,250,0.15)' : 'transparent',
                            color: isActive ? '#A78BFA' : '#fff',
                          }}
                        >
                          <child.icon className="w-3.5 h-3.5" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular nav items
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

      {/* Recent Batch SMS Widget */}
      <div className="mx-3 mb-4 p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <Link to="/admin/batch-sms-log" className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>📡 Recent SMS Batches</span>
          <ArrowRight className="w-3 h-3" style={{ color: '#D4AF37' }} />
        </Link>
        <div className="space-y-2">
          {batchLogs.length > 0 ? (
            batchLogs.slice(0, 4).map(log => (
              <div key={log.id} className="text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#fff' }} className="truncate max-w-[120px]">{log.city || 'Unknown'}</span>
                  <span style={{ color: '#D4AF37' }} className="font-semibold ml-1 flex-shrink-0">
                    ✓ {log.sent_count || 0} sent
                  </span>
                </div>
                <div style={{ color: '#fff' }} className="mt-0.5">
                  {log.sent_at ? new Date(log.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  {log.failed_count > 0 && <span style={{ color: '#ef4444' }}> · {log.failed_count} failed</span>}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#fff' }} className="text-xs">No batches sent yet</p>
          )}
        </div>
      </div>

      {/* Quick Page Jump */}
      <div className="mx-3 mb-3 relative">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#fff' }}>Quick Page Jump</p>
        <form onSubmit={handlePageJump} className="flex gap-2">
          <input
            type="text"
            value={pageCode}
            onChange={(e) => setPageCode(e.target.value)}
            placeholder="Page # or name…"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: '#fff', outline: 'none' }}
          />
          <button type="submit" className="px-3 py-2 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {suggestions.length > 0 && (
        <div className="mt-1 rounded-lg overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
          {suggestions.map(([num, page]) => (
            <button key={num} type="button"
              onClick={() => { navigate(page.path); setPageCode(''); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
              <span className="font-black shrink-0" style={{ color: '#D4AF37' }}>#{num}</span>
              <span className="truncate" style={{ color: '#fff' }}>{page.name}</span>
            </button>
          ))}
        </div>
        )}
      </div>

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
          style={{ color: '#fff' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Client Dashboard
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#fff' }}
        >
          <MessageCircle className="w-4 h-4" />
          Client Chat
        </Link>
      </div>
    </aside>
  );
}