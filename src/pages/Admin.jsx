import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Home, UserCheck, Search, SendHorizontal, Flag, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Download,
  Brain, AlertTriangle, Sparkles, TrendingUp, Layers, LayoutGrid, Volume2, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';
import VoiceGreetingWidget from '@/components/portal/VoiceGreetingWidget';
import DepartmentSubChoicesView from '@/components/admin/DepartmentSubChoicesView';

const GOLD = '#D4AF37';

const adminSections = [
  {
    heading: 'QUICK SEARCHES',
    color: GOLD,
    modules: [
      { name: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search, description: 'Find and manage property search profiles', color: '#3B82F6' },
      { name: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Search, description: 'Find owner name & contact info by property address via BatchData', color: '#D4AF37' },
      { name: 'Outreach Pipeline', path: '/admin/outreach-pipeline', icon: SendHorizontal, description: 'Monitor outreach workflow stages', color: '#F59E0B' },
      { name: 'Compose SMS', path: '/admin/compose-sms', icon: MessageCircle, description: 'Send SMS campaigns to owners', color: '#06B6D4' },
      { name: 'Owner Response Board', path: '/admin/owner-kanban', icon: Home, description: 'View owner responses and engagement', color: '#10B981' },
      { name: 'Batch SMS Logs', path: '/admin/batch-sms-log', icon: Download, description: 'View sent batch SMS history', color: '#22C55E' },
    ]
  },
  {
    heading: 'MARKETING CAMPAIGNS',
    color: GOLD,
    modules: [
      { name: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns', icon: ScrollText, description: 'Schedule and manage SMS campaigns', color: '#F97316' },
      { name: 'Outreach Analytics', path: '/admin/outreach-analytics', icon: Sparkles, description: 'Track campaign performance metrics', color: '#EC4899' },
      { name: 'SMS Sequences', path: '/admin/sms-sequences', icon: SendHorizontal, description: 'Build multi-step SMS sequences', color: '#06B6D4' },
    ]
  },
  {
    heading: 'RESULTS',
    color: GOLD,
    modules: [
      { name: 'Listing Owners Info', path: '/admin/owners', icon: Home, description: 'View and manage listing owner database', color: '#10B981' },
      { name: 'Clients', path: '/admin/clients', icon: UserCheck, description: 'View relocation leads and track progress', color: '#8B5CF6' },
    ]
  },
  {
    heading: 'OPERATIONS',
    color: GOLD,
    modules: [
      { name: 'Presentation Library', path: '/admin/presentation-library', icon: FileText, description: 'Manage presentations and slide decks', color: '#EC4899' },
      { name: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag, description: 'Review flagged conversations', color: '#EF4444' },
      { name: 'Referral Management', path: '/admin/referrals', icon: LinkIcon, description: 'Track agent referrals and fees', color: '#14B8A6' },
    ]
  },
];

function LiveStatCard({ label, icon: Icon, path, query, filter, accentColor }) {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-stat', label],
    queryFn: query,
    refetchInterval: 30000,
  });

  const items = filter ? data.filter(filter) : data;
  const count = items.length;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate(path)}
      className="rounded-2xl p-4 cursor-pointer transition-all group"
      style={{ background: '#000', border: `1px solid ${accentColor || 'rgba(212,175,55,0.2)'}33` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: accentColor || GOLD }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
      </div>
      <div className="flex items-end justify-between">
        {isLoading ? (
          <div className="w-8 h-7 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
        ) : (
          <p className="text-2xl font-bold" style={{ color: accentColor || '#fff' }}>{count}</p>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold" style={{ color: accentColor || GOLD }}>View →</span>
        </div>
      </div>

      {/* Preview of items */}
      {!isLoading && items.length > 0 && (
        <div className="mt-3 space-y-1">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] rounded-lg px-2 py-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: accentColor || GOLD }} />
              <span className="truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {item._preview}
              </span>
              {item._badge && (
                <span className="ml-auto shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: `${accentColor}22`, color: accentColor }}>
                  {item._badge}
                </span>
              )}
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-[10px] px-2 pt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              +{items.length - 3} more — click to view all
            </p>
          )}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Nothing pending</p>
      )}
    </motion.div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const deptParam = searchParams.get('dept') || 'dnn';

  const [activeView, setActiveView] = useState(() => {
    // If explicitly viewing stats or overview
    return searchParams.get('view') || 'subchoices';
  });
  const [testingVoiceGreeting, setTestingVoiceGreeting] = useState(false);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-1 font-sans" style={{ color: '#854d0e' }}>ADMIN COMMAND CENTER</p>
              <h1 className="display-heading mb-1 whitespace-nowrap" style={{ fontSize: 'clamp(1.15rem, 2.3vw, 1.65rem)', color: '#0a0a0a' }}>
                Dyson &amp; Dyson Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#44382c] font-medium">
                Department Mini Apps &amp; Sub-Choices Workspace
              </p>
            </div>

            {/* View Mode Toggle Pill */}
            <div className="flex items-center bg-[#0a0a0a] p-1 rounded-2xl border border-[#D4AF37]/50 self-start sm:self-auto shadow-md">
              <button
                type="button"
                onClick={() => setActiveView('subchoices')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'subchoices'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Department Sub-Choices</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'overview'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Live Metrics &amp; Charts</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Link
              to="/admin/app-store-mockup?tab=full_mockup"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-transform hover:scale-105"
              style={{ border: '1.5px solid #D4AF37', color: '#000', background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-black" /> 🌟 Platform Apps Specs
            </Link>
            <Link
              to="/admin/front-door-lab"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-black/20 bg-black text-white hover:border-[#D4AF37] shadow-sm"
            >
              ✨ Front Door Lab
            </Link>
            <Link
              to="/admin/workflows"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-black/20 bg-black text-white hover:border-[#D4AF37] shadow-sm"
            >
              🗺️ Master Atlas
            </Link>
            <button
              onClick={() => setTestingVoiceGreeting(true)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-purple-500/50 text-purple-200 bg-black hover:bg-[#1a1a1a] shadow-sm cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Test Voice Greeting
            </button>
          </div>
        </motion.div>

        {/* ── DEPARTMENT SUB-CHOICES VIEW (SHOWN WHEN IN SUBCHOICES MODE) ── */}
        {activeView === 'subchoices' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <DepartmentSubChoicesView 
              deptId={deptParam}
              onSelectDept={(newDept) => {
                navigate(`/admin?dept=${newDept}`);
              }}
            />
          </motion.div>
        )}

        {testingVoiceGreeting && (
          <VoiceGreetingWidget key={Date.now()} onClose={() => setTestingVoiceGreeting(false)} />
        )}

        {/* ── OVERVIEW METRICS & CHARTS (SHOWN WHEN IN OVERVIEW MODE) ── */}
        {activeView === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Summary Dashboard Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Active Listings Chart */}
              <div className="rounded-2xl p-6 shadow-xl" style={{ background: '#000', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5" style={{ color: '#10B981' }} />
                  <h3 className="font-bold text-white">Active Listings by Status</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { status: 'Not Contacted', count: 142 },
                    { status: 'In Progress', count: 87 },
                    { status: 'Interested', count: 54 },
                    { status: 'Converted', count: 23 }
                  ]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Incoming Referrals Chart */}
              <div className="rounded-2xl p-6 shadow-xl" style={{ background: '#000', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: '#EF4444' }} />
                  <h3 className="font-bold text-white">Incoming Referrals Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { week: 'W1', referrals: 12 },
                    { week: 'W2', referrals: 18 },
                    { week: 'W3', referrals: 15 },
                    { week: 'W4', referrals: 28 },
                    { week: 'W5', referrals: 32 },
                    { week: 'W6', referrals: 27 }
                  ]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="referrals" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Live Interactive Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <LiveStatCard
                label="Active Clients"
                icon={UserCheck}
                path="/admin/clients"
                accentColor="#8B5CF6"
                query={() => base44.entities.RelocationClient.list('-created_date', 200)}
                filter={c => !['closed', 'inactive', 'moved'].includes(c.status)}
              />
              <LiveStatCard
                label="Listing Owners"
                icon={Home}
                path="/admin/owners"
                accentColor="#10B981"
                query={async () => {
                  const owners = await base44.entities.ListingOwner.list('-created_date', 200);
                  return owners.map(o => ({ ...o, _preview: o.owner_name || o.property_address, _badge: o.contact_status?.replace('_', ' ') }));
                }}
              />
              <LiveStatCard
                label="Active Campaigns"
                icon={SendHorizontal}
                path="/admin/scheduled-campaigns"
                accentColor="#F97316"
                query={async () => {
                  const campaigns = await base44.entities.ScheduledCampaign.list('-scheduled_for', 100);
                  return campaigns
                    .filter(c => c.status === 'scheduled' || c.status === 'sending')
                    .map(c => ({ ...c, _preview: c.city, _badge: c.status }));
                }}
              />
              <LiveStatCard
                label="Pending Referrals"
                icon={LinkIcon}
                path="/admin/referrals"
                accentColor="#EF4444"
                query={async () => {
                  const refs = await base44.entities.AgentReferral.list('-created_date', 100);
                  return refs
                    .filter(r => r.referral_status === 'proposal_sent' || r.referral_status === 'agreed' || r.referral_status === 'in_process')
                    .map(r => ({ ...r, _preview: r.list_agent_name, _badge: r.referral_status?.replace('_', ' ') }));
                }}
              />
            </motion.div>

            {/* Admin Sections */}
            {adminSections.map((section, sectionIdx) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + sectionIdx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                  <h2 className="text-lg font-bold text-[#0a0a0a]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {section.heading}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(section.modules || section.items || []).map((item) => {
                    const Icon = item.icon || Sparkles;
                    const itemTitle = item.name || item.label;
                    return (
                      <Link
                        key={itemTitle}
                        to={item.path}
                        className="p-4 rounded-xl border border-white/10 hover:border-[#D4AF37] transition-all group block shadow-md"
                        style={{ background: '#0f0f0f' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                            <Icon className="w-4 h-4 text-white group-hover:text-[#D4AF37] transition-colors" />
                          </div>
                          <span 
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5"
                            style={{ color: item.color || '#D4AF37' }}
                          >
                            {item.badge || 'MODULE'}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                          {itemTitle}
                        </h3>
                        <p className="text-xs text-white/60">
                          {item.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-2xl p-6 shadow-xl"
              style={{ background: '#000', border: `1px solid ${GOLD}` }}
            >
              <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>QUICK ACTIONS</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/outreach-campaigns" className="px-4 py-2 rounded-full text-sm font-semibold transition-all" style={{ background: GOLD, color: '#000' }}>
                  + New Campaign
                </Link>
                <Link to="/admin/clients" className="px-4 py-2 rounded-full text-sm font-semibold transition-all" style={{ background: 'rgba(212,175,55,0.2)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
                  View All Clients
                </Link>
                <Link to="/admin/charlie-scripts" className="px-4 py-2 rounded-full text-sm font-semibold transition-all" style={{ background: 'rgba(212,175,55,0.2)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
                  Edit Charlie Scripts
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}