import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, ArrowLeft, Search, SendHorizontal, Flag, BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Fingerprint, Target, Megaphone, Share2, List, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search },
  { label: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Fingerprint },
  { label: 'Listing Owners Info', path: '/admin/owners', icon: Home },
  { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline', icon: SendHorizontal },
  { label: 'Compose SMS', path: '/admin/compose-sms', icon: SendHorizontal },
  { label: 'Batch SMS Logs', path: '/admin/batch-sms-log', icon: List },
  { label: 'New Opt-Ins', path: '/admin/opt-ins', icon: Zap },
  { label: 'Outreach Campaigns (Legacy)', path: '/admin/outreach-campaigns', icon: MessageCircle },
  { label: 'Clients', path: '/admin/clients', icon: UserCheck },
  { label: 'Presentation Library', path: '/admin/presentation-library', icon: FileText },
  { label: 'Communications', path: '/admin/communications', icon: MessageCircle },
  { label: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag },
  { label: 'Referral Management', path: '/admin/referrals', icon: LinkIcon },
  { label: "Charlie's Scripts", path: '/admin/charlie-scripts', icon: ScrollText },
  { label: 'Target Audiences', path: '/admin/target-audiences', icon: Target },
  { label: 'Marketing Campaigns', path: '/admin/marketing-campaigns', icon: Megaphone },
  { label: 'Campaign Roadmap', path: '/admin/campaign-roadmap', icon: BarChart3 },
  { label: 'Social Media Launch', path: '/admin/social-launch', icon: Share2 },
  { label: 'Business Plan', path: '/business-plan', icon: BookOpen },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageCode, setPageCode] = useState('');

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

      {/* Active Campaigns Widget */}
      <div className="mx-3 mb-4 p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <Link to="/admin/active-campaigns" className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>📡 Live Campaigns</span>
          <ArrowRight className="w-3 h-3" style={{ color: '#D4AF37' }} />
        </Link>
        <div className="space-y-2">
          {activeCampaigns.length > 0 ? (
            activeCampaigns.slice(0, 3).map(camp => (
              <div key={camp.city} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: '#ccc' }}>{camp.city}</span>
                  <span style={{ color: camp.inProgress ? '#D4AF37' : 'rgba(255,255,255,0.5)' }} className="font-semibold text-xs">
                    {camp.inProgress ? '⏳ Sending' : '⏸ Pending'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full transition-all" 
                    style={{ 
                      width: `${camp.inProgress ? camp.progress : 0}%`, 
                      background: camp.inProgress ? 'linear-gradient(90deg, #D4AF37, #e8c84a)' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-0.5">
                  {camp.unsent} unsent of {camp.total}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">No pending campaigns</p>
          )}
        </div>
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