import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Users, UserCheck, ShieldCheck, ArrowRight, Eye, RefreshCw, 
  Sparkles, Building2, Phone, MessageCircle, Mic, CheckCircle2,
  Sliders, Globe, ExternalLink, Compass, Shield, Database, Lock
} from 'lucide-react';
import SubscriberCommandCard from '@/components/admin/frontdoor/SubscriberCommandCard';

const GOLD = '#D4AF37';

const SUBSCRIBER_ROLES = [
  {
    id: 'family',
    title: 'Family / Buyer Subscriber Desk',
    subtitle: 'Luxury Presence Client Backside Model',
    icon: Users,
    badge: 'Core Primary',
    color: '#D4AF37',
    description: 'Personal single-client desk replacing the public marketing doors. Displays active move file, live roadmap, and 3 focused execution buttons.',
    dest: '/home',
    roadmapDest: '/RelocationRoadmap',
    defaultMove: 'San Jose, CA → Scottsdale, AZ',
    actions: ['Continue your move', 'Talk with Charlie', 'Vet listing / refer'],
  },
  {
    id: 'agent',
    title: 'Active Relocation Agent Desk',
    subtitle: 'Vetted Receiving Agent Workspace',
    icon: UserCheck,
    badge: 'Affiliate Desk',
    color: '#3b82f6',
    description: 'Direct pipeline of incoming pre-vetted buyer/seller handoffs, live escrow milestone ledger, and 25% referral payouts.',
    dest: '/agent-command-center',
    roadmapDest: '/agent-command-center',
    defaultMove: '2 Incoming Relocation Referrals Active',
    actions: ['Open Agent Command Center', 'Talk with Charlie', 'Submit Referral Handoff'],
  },
  {
    id: 'broker',
    title: 'Broker / Owner Firm Desk',
    subtitle: 'Wisdom Properties Institutional Suite',
    icon: Building2,
    badge: 'Institutional',
    color: '#8b5cf6',
    description: 'Multi-agent production oversight, BackOffice/Brokermint sync, proactive escrow friction audits, and co-branded luxury presence.',
    dest: '/brokerage',
    roadmapDest: '/brokerage/escrow',
    defaultMove: 'Wisdom Properties • 14 Escrows in Progress',
    actions: ['Open Brokerage Portal', 'Audit Live Escrows', 'Manage Agent Roster'],
  },
  {
    id: 'hr',
    title: 'Corporate HR & Relo Desk',
    subtitle: 'Enterprise Talent Mobility Suite',
    icon: Shield,
    badge: 'B2B Enterprise',
    color: '#10b981',
    description: 'Zero corporate management fee dashboard tracking employee move milestones, policy adherence, and executive family packages.',
    dest: '/corporate-relo',
    roadmapDest: '/corporate-relo',
    defaultMove: '3 Transferee Employee Relocations Active',
    actions: ['Open Corporate Suite', 'Talk with Charlie', 'Add Moving Employee'],
  },
  {
    id: 'visitor',
    title: 'Public Cold Visitor (Unsubscribed)',
    subtitle: 'Marketing Three-Door Homepage',
    icon: Globe,
    badge: 'Public Front Door',
    color: '#6b7280',
    description: 'Standard public front door: architectural hero, search destinations pill, and public entry doors for cold visitors.',
    dest: '/',
    roadmapDest: '/relocation-intake',
    defaultMove: 'Public Marketing View',
    actions: ['Explore Destinations', 'Talk with Charlie', 'Sign In / Register'],
  },
];

export default function AdminSubscriberBacksideStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exchange'); // 'exchange' | 'simulator' | 'config' | 'database'
  const [selectedRole, setSelectedRole] = useState('family');
  const [testClientName, setTestClientName] = useState('Bob Dyson');
  const [testMoveLine, setTestMoveLine] = useState('San Jose, CA → Scottsdale, AZ');
  const [overrideActiveMove, setOverrideActiveMove] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);

  // Fetch real RelocationClient records from database
  const { data: realClients, isLoading: loadingClients, refetch: refetchClients } = useQuery({
    queryKey: ['adminStudioRelocationClients'],
    queryFn: async () => {
      const res = await base44.entities.RelocationClient.list('-created_date', 10);
      return res || [];
    },
  });

  // Fetch real DnnSubscribers
  const { data: realSubscribers, isLoading: loadingSubscribers, refetch: refetchSubscribers } = useQuery({
    queryKey: ['adminStudioSubscribers'],
    queryFn: async () => {
      const res = await base44.entities.DnnSubscriber.list('-created_date', 10);
      return res || [];
    },
  });

  const currentRoleConfig = SUBSCRIBER_ROLES.find(r => r.id === selectedRole) || SUBSCRIBER_ROLES[0];

  // Set view-as mode in localStorage and test on live FrontDoor
  const handleLaunchLive = (roleId) => {
    if (roleId === 'visitor') {
      localStorage.removeItem('dyson_view_as');
      localStorage.setItem('dyson_subscriber_mode', 'false');
    } else {
      localStorage.setItem('dyson_view_as', roleId);
      localStorage.setItem('dyson_subscriber_mode', 'true');
      if (testClientName) localStorage.setItem('dyson_test_subscriber_name', testClientName);
      if (overrideActiveMove && testMoveLine) localStorage.setItem('dyson_test_move_line', testMoveLine);
      else localStorage.removeItem('dyson_test_move_line');
    }

    setStatusNotice(`View-As switched to ${roleId.toUpperCase()}. Opening Live Front Door...`);
    setTimeout(() => {
      navigate('/portal');
    }, 600);
  };

  const handleSelectRealClient = (client) => {
    setTestClientName(client.full_name || 'Subscriber');
    const move = client.current_city && client.destination_city 
      ? `${client.current_city} → ${client.destination_city}` 
      : (client.destination_city ? `Destination: ${client.destination_city}` : 'San Jose, CA → Scottsdale, AZ');
    setTestMoveLine(move);
    setOverrideActiveMove(true);
    setStatusNotice(`Selected live client: ${client.full_name} (${move})`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP HEADER */}
        <div className="p-6 rounded-3xl bg-[#0f0f0f] border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-black tracking-widest uppercase bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BOB'S SUBSCRIBER BACKSIDE STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Review, Exchange &amp; Build Portal Subscriber Desks
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
              UX model is Luxury Presence subscriber backside patterns: logged-in Family/Buyer subscribers land directly in their personal role-based desk with active move line &amp; 3 focused buttons, while cold visitors keep the public 3-door homepage.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleLaunchLive(selectedRole)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-black flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
            >
              <Eye className="w-4 h-4" />
              <span>Test on Live Front Door</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* STATUS FLASH NOTICE */}
        {statusNotice && (
          <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981] text-[#10b981] text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{statusNotice}</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          </div>
        )}

        {/* STUDIO TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'exchange', label: '1. Exchange / Switcher', icon: Sliders },
            { id: 'simulator', label: '2. Live Backside Simulator', icon: Eye },
            { id: 'database', label: '3. Real Database Feed', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-[#1e1910] text-[#D4AF37] border border-[#D4AF37] shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXCHANGE / ROLE SWITCHER */}
        {activeTab === 'exchange' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBSCRIBER_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#18140c] border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                        : 'bg-[#111111] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
                          style={{
                            background: isSelected ? 'rgba(212,175,55,0.2)' : '#1a1a1a',
                            borderColor: isSelected ? GOLD : 'rgba(255,255,255,0.1)',
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: role.color }} />
                        </div>
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: isSelected ? GOLD : 'rgba(255,255,255,0.1)',
                            color: isSelected ? '#000' : '#fff',
                          }}
                        >
                          {role.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white font-serif leading-tight">
                          {role.title}
                        </h3>
                        <p className="text-[11px] text-[#fce38a] font-mono mt-0.5">
                          {role.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-white/65 leading-relaxed">
                        {role.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                          Top Activity Line &amp; Buttons:
                        </span>
                        <p className="text-[11px] text-white font-mono truncate">
                          Active: {role.defaultMove}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {role.actions.map((act, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black shadow'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {isSelected ? 'Active Simulator' : 'Select'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunchLive(role.id)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold transition-all cursor-pointer"
                        title={`Test ${role.title} on Front Door`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LIVE SIMULATION CONTROLS */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-4 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                Live Data Overrides for Simulation:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">
                    Subscriber First Name / Family Name:
                  </label>
                  <input
                    type="text"
                    value={testClientName}
                    onChange={(e) => setTestClientName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    placeholder="e.g. Bob Dyson"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/70 uppercase block mb-1">
                    Active Relocation Move Line (RelocationClient simulation):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={testMoveLine}
                      onChange={(e) => {
                        setTestMoveLine(e.target.value);
                        setOverrideActiveMove(true);
                      }}
                      className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="e.g. San Jose, CA → Scottsdale, AZ"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTestMoveLine('No active move — start one');
                        setOverrideActiveMove(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 text-[10px] font-bold whitespace-nowrap hover:bg-white/20 text-white cursor-pointer"
                    >
                      Empty State
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE BACKSIDE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 text-left">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Active Simulator Target:
                </span>
                <h3 className="text-lg font-bold font-serif text-white">
                  {currentRoleConfig.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchLive(selectedRole)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 shadow hover:brightness-110 cursor-pointer"
              >
                <span>Launch Live on Front Door</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SIDE-BY-SIDE SIMULATION CONTAINER */}
            <div className="flex flex-col lg:flex-row w-full rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#0a0a0a]">
              
              {/* LEFT RAIL: PERSONAL FAMILY DESK (NOT MARKETING) */}
              <aside className="w-full lg:w-[320px] p-5 border-b lg:border-b-0 lg:border-r border-[#D4AF37]/40 bg-[#0e0e0e] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    <span>SUBSCRIBER ACTIVE FILE</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold font-serif text-white leading-tight">
                      Welcome back, {testClientName.split(' ')[0]}
                    </h2>
                    <p className="text-xs text-[#fce38a] font-medium mt-0.5">
                      Active: {testMoveLine}
                    </p>
                  </div>

                  {/* ACTIVE MOVE COLLABORATION CARD */}
                  <div className="p-3 rounded-2xl bg-[#18140c] border border-[#D4AF37] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-[#D4AF37] uppercase">Your Move Collaboration</span>
                      <span className="text-[#10b981] font-mono">Active Live</span>
                    </div>
                    <p className="text-[11px] text-white/80 leading-snug">
                      Your fiduciary team and destination specialist are actively monitoring your move file.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(currentRoleConfig.roadmapDest)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold text-black flex items-center justify-between shadow"
                      style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                    >
                      <span>Continue your move</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* THREE FOCUSED DESK ACTION BUTTONS */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] px-0.5">
                      Your Desk Actions:
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => navigate('/talking-app')}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-xs font-bold text-white">Talk with Charlie</span>
                      </div>
                      <span className="text-[8.5px] font-mono text-[#D4AF37] px-1.5 py-0.2 rounded bg-[#D4AF37]/15">Voice AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/refer')}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="text-xs font-bold text-white">Vet a listing / refer</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/dnn-news')}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs font-bold text-white">DNN 6AM Daily News</span>
                      </div>
                      <span className="text-[8px] text-white/50">Daily</span>
                    </button>
                  </div>
                </div>

                {/* BOTTOM CONCIERGE DIRECT CONTACT */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="p-2 rounded-xl bg-[#121212] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase text-[#D4AF37]">Concierge Desk Direct</div>
                      <div className="text-xs font-mono font-bold text-white">(858) 353-1200</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href="tel:+18583531200" className="px-2 py-1 rounded bg-[#1e1e1e] text-[9px] font-bold text-white flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-[#D4AF37]" /> Call
                      </a>
                      <a href="sms:+18583531200" className="px-2 py-1 rounded bg-[#1e1e1e] text-[9px] font-bold text-white flex items-center gap-1">
                        <MessageCircle className="w-2.5 h-2.5 text-[#D4AF37]" /> Text
                      </a>
                    </div>
                  </div>

                  <div className="text-[8.5px] text-white/50 flex items-center justify-between">
                    <span>All 50 States</span>
                    <span>CA DRE #02303118</span>
                  </div>
                </div>
              </aside>

              {/* RIGHT CANVAS: HERO COMMAND CARD */}
              <div className="flex-1 p-6 bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-full max-w-xl">
                  <SubscriberCommandCard
                    currentUser={{
                      full_name: testClientName,
                      email: 'client@example.com',
                      role: 'user',
                      portal_role: selectedRole === 'family' ? 'client' : selectedRole,
                    }}
                    onSearch={() => {}}
                    searchQuery=""
                    setSearchQuery={() => {}}
                    onSwitchToVisitorView={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REAL DATABASE FEED */}
        {activeTab === 'database' && (
          <div className="space-y-6 text-left">
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Live Database Records (RelocationClient &amp; DnnSubscriber)
                </h3>
                <p className="text-xs text-white/60">
                  Select any actual database record to test how their personal Family desk renders on the live front door.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  refetchClients();
                  refetchSubscribers();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* RelocationClient Records */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111111]">
              <div className="px-4 py-2.5 bg-[#181818] border-b border-white/10 text-xs font-bold text-[#D4AF37] uppercase">
                RelocationClient Entities (Live Moves)
              </div>
              <div className="divide-y divide-white/10">
                {realClients && realClients.length > 0 ? (
                  realClients.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{c.full_name || 'Unnamed Client'}</span>
                        <span className="text-[10px] text-white/60 block truncate font-mono">{c.email || 'No email'}</span>
                        <span className="text-[10.5px] text-[#fce38a] font-medium block">
                          {c.current_city ? `${c.current_city} → ${c.destination_city || 'TBD'}` : (c.destination_city || 'No destination specified')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectRealClient(c)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shrink-0"
                      >
                        Simulate as this Client
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-white/50 text-center">
                    No RelocationClient records found. You can add one in Clients admin.
                  </div>
                )}
              </div>
            </div>

            {/* DnnSubscriber Records */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111111]">
              <div className="px-4 py-2.5 bg-[#181818] border-b border-white/10 text-xs font-bold text-[#D4AF37] uppercase">
                DnnSubscriber Entities (Subscribed Users)
              </div>
              <div className="divide-y divide-white/10">
                {realSubscribers && realSubscribers.length > 0 ? (
                  realSubscribers.slice(0, 6).map((s) => (
                    <div key={s.id} className="p-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{s.full_name || s.email}</span>
                        <span className="text-[10px] text-white/60 block font-mono">{s.email}</span>
                        <span className="text-[10px] text-white/40 block truncate">{s.source || 'Front Door Subscriber'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTestClientName(s.full_name || s.email.split('@')[0]);
                          setStatusNotice(`Simulating as subscriber ${s.email}`);
                          setTimeout(() => setStatusNotice(null), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                      >
                        Set Name
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-white/50 text-center">
                    No DnnSubscriber records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}