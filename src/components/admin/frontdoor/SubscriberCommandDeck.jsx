import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  Building2, Star, Briefcase, Handshake, Wrench, Home,
  ArrowRight, CheckCircle2, Clock, MessageSquare, Mic, 
  ShieldCheck, Sparkles, User, FileText, ChevronRight,
  History, Compass, ExternalLink, Phone
} from 'lucide-react';
import RetainedDialogueModal from './RetainedDialogueModal';

const GOLD = '#D4AF37';

const SUBSCRIBER_PROFILES = {
  client: {
    id: 'client',
    roleLabel: 'Relocation Client',
    badge: 'Private Relo Workspace #104',
    icon: Home,
    greetingMessage: 'Your Scottsdale, AZ escrow is progressing on schedule.',
    activeStatus: 'Active Purchase: 2840 Silverleaf Sunset Ridge ($8.95M)',
    urgentFocus: 'Escrow Milestone #4: Physical Inspection Contingency Due in 4 Days (Friday, 5:00 PM)',
    portalDest: '/home',
    portalName: 'Client Command Workspace',
    actions: [
      {
        id: 'act-1',
        title: 'Review Active Milestones & Deadlines',
        desc: 'Inspection report upload, HOA docs review, and loan approval tracker.',
        btnText: 'Open Escrow Roadmap',
        dest: '/home',
        badge: 'Priority',
        color: '#10b981',
      },
      {
        id: 'act-2',
        title: 'Vet Any Destination Listing or Agent',
        desc: 'Paste a link from Realtor, Zillow, or Homes.com for instant fiduciary audit.',
        btnText: 'Audit a Property',
        scrollTarget: 'hero-search-bar',
        badge: 'Free Tool',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Talk with Charlie (Pre-Briefed on Your File)',
        desc: 'Ask about Maricopa County tax calculations, school districts, or utility setup.',
        btnText: 'Speak with Charlie',
        actionType: 'voice',
        badge: 'Voice AI',
        color: '#60a5fa',
      },
    ],
  },
  agent: {
    id: 'agent',
    roleLabel: 'Active Relo Agent',
    badge: 'Vetted Receiving Agent #82 • Scottsdale Desk',
    icon: Star,
    greetingMessage: '1 New Corporate Relocation Transferee is assigned to your bureau.',
    activeStatus: 'Incoming Client Handoff: Marcus Vance (VP Engineering, $3.5M–$4.5M Budget)',
    urgentFocus: 'Action Required: Confirm receipt and schedule initial discovery call within 24h.',
    portalDest: '/agent-command-center',
    portalName: 'Agent Command Center',
    actions: [
      {
        id: 'act-1',
        title: 'Accept & Open Transferee Workfile',
        desc: 'Review buyer criteria, pre-approved lender letter, and contact info.',
        btnText: 'Open Client Workfile',
        dest: '/agent-command-center',
        badge: 'New Lead',
        color: '#10b981',
      },
      {
        id: 'act-2',
        title: 'Escrow Friction & BackOffice Audit',
        desc: 'Check live milestone alerts on your 2 pending Dyson client escrows.',
        btnText: 'Inspect Escrows',
        dest: '/agent-command-center',
        badge: 'Compliance',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Today’s 6AM DNN Real Estate News',
        desc: 'Watch Charlie & Bob’s daily broadcast and share private-label video to your sphere.',
        btnText: 'Open News Broadcast',
        dest: '/dnn-news',
        badge: 'Daily',
        color: '#f87171',
      },
    ],
  },
  referral_agent: {
    id: 'referral_agent',
    roleLabel: 'Referral Licensee',
    badge: 'Protected 25% Referral Network #412',
    icon: Handshake,
    greetingMessage: 'Your Miller Family referral in Denver is clear to close!',
    activeStatus: 'Denver Purchase: $1.85M • Clear-To-Close Issued Yesterday',
    urgentFocus: 'Referral Fee Payout: $11,562.50 scheduled for release upon closing on Sep 24.',
    portalDest: '/partner-benefits',
    portalName: 'Referral Partner Portal',
    actions: [
      {
        id: 'act-1',
        title: 'Check Referral Fee Payout Tracker',
        desc: 'View locked 25% agreement, closing date, and escrow accounting statement.',
        btnText: 'View $11,562 Payout File',
        dest: '/partner-benefits',
        badge: 'Escrow Active',
        color: '#10b981',
      },
      {
        id: 'act-2',
        title: 'Submit a New Buyer or Seller Referral',
        desc: 'Introduce another relocating client — we handle 100% of showings & paperwork.',
        btnText: 'Submit New Referral',
        dest: '/refer',
        badge: '25% Payout',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Personalized Daily News for Your Clients',
        desc: 'Send today’s DNN market broadcast with your name and contact info attached.',
        btnText: 'Client News Blast',
        dest: '/dnn-news',
        badge: 'Marketing',
        color: '#60a5fa',
      },
    ],
  },
  hr: {
    id: 'hr',
    roleLabel: 'Corporate HR & Relo',
    badge: 'Enterprise Corporate Suite • Talent Relo Desk',
    icon: Building2,
    greetingMessage: 'All 3 Q3 employee relocation transfers are tracking ahead of schedule.',
    activeStatus: 'Active Transferees: Austin (accepted), Boulder (inspection), Nashville (touring)',
    urgentFocus: 'Zero Corporate Invoices: $0 management fees billed • Estimated corporate savings: $42,000',
    portalDest: '/corporate-relo',
    portalName: 'Corporate Relo Executive Suite',
    actions: [
      {
        id: 'act-1',
        title: 'View Transferee Moving Milestone Ledger',
        desc: 'Real-time visibility into executive start dates, moving trucks, and housing closings.',
        btnText: 'Open Executive Dashboard',
        dest: '/corporate-relo',
        badge: 'Real-Time',
        color: '#10b981',
      },
      {
        id: 'act-2',
        title: 'Initiate a New Employee Relocation',
        desc: 'Submit a new hire or executive transfer for immediate destination concierge onboarding.',
        btnText: 'Launch Employee Move',
        dest: '/relocation-intake',
        badge: 'Zero-Fee',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Corporate Policy & Expense Compliance',
        desc: 'Download compliance audit logs and direct-bill moving receipts.',
        btnText: 'Expense Reports',
        dest: '/corporate-relo',
        badge: 'Audit Ready',
        color: '#a78bfa',
      },
    ],
  },
  broker: {
    id: 'broker',
    roleLabel: 'Broker / Owner',
    badge: 'Brokerage Firm Portal • Wisdom Properties (#1 Pilot)',
    icon: Briefcase,
    greetingMessage: 'Brokermint BackOffice sync active • 48 agents rostered.',
    activeStatus: 'Transaction Audit: 12 Active Escrows • 1 Appraisal Contingency Flagged',
    urgentFocus: 'AI Friction Alert: Escrow #2026-88 appraisal deadline approaching in 48 hours.',
    portalDest: '/brokerage',
    portalName: 'Brokerage Enterprise Gateway',
    actions: [
      {
        id: 'act-1',
        title: 'Inspect Escrow Friction Alerts',
        desc: 'AI proactively detected 1 appraisal timeline risk before client notification was required.',
        btnText: 'Review Escrow Audit',
        dest: '/brokerage/audit',
        badge: 'Risk Alert',
        color: '#f87171',
      },
      {
        id: 'act-2',
        title: 'Manage Agent Roster & Referral Pipeline',
        desc: 'Review outbound referral commissions and assign incoming corporate transferees.',
        btnText: 'View Agent Pipeline',
        dest: '/brokerage/agents',
        badge: 'Roster Sync',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Firm Co-Branded Media & Daily News',
        desc: 'Deploy private-label DNN daily video broadcast to your entire buyer/seller CRM.',
        btnText: 'Media Distribution',
        dest: '/brokerage/marketing',
        badge: 'Co-Branded',
        color: '#60a5fa',
      },
    ],
  },
  vendor: {
    id: 'vendor',
    roleLabel: 'Vetted Service Vendor',
    badge: 'Certified Concierge Partner • Maricopa & Coastal Desk',
    icon: Wrench,
    greetingMessage: '2 Relocating Families have requested vetted white-glove moving quotes.',
    activeStatus: 'Active Inquiries: North Scottsdale delivery dates for October 2–10',
    urgentFocus: 'Vetting Status: 100% Certified Fiduciary Partner (No kickbacks, direct introductions).',
    portalDest: '/search',
    portalName: 'Vendor Hub & Leads',
    actions: [
      {
        id: 'act-1',
        title: 'Respond to Client Service Requests',
        desc: 'Submit competitive rates directly into the client’s milestone action ledger.',
        btnText: 'View Moving Inquiries',
        dest: '/search',
        badge: 'Qualified',
        color: '#10b981',
      },
      {
        id: 'act-2',
        title: 'Update Territory Coverage & Licenses',
        desc: 'Keep your insurance, bond, and licensing verified for top-tier client placement.',
        btnText: 'Compliance Profile',
        dest: '/search',
        badge: 'Verified',
        color: GOLD,
      },
      {
        id: 'act-3',
        title: 'Direct Desk Coordination Line',
        desc: 'Connect directly with Bob Dyson and Charlie regarding client schedule changes.',
        btnText: 'Contact Concierge',
        dest: '/connect',
        badge: 'Direct Line',
        color: '#a78bfa',
      },
    ],
  },
};

export default function SubscriberCommandDeck({ currentUser, onSimulateRoleChange }) {
  const navigate = useNavigate();
  
  // Resolve initial subscriber role
  const resolvedRole = currentUser?.portal_role === 'brokerage_admin' ? 'broker' : 
                       (currentUser?.portal_role || 'client');

  const [activeRoleKey, setActiveRoleKey] = useState(resolvedRole);
  const [isDialogueModalOpen, setIsDialogueModalOpen] = useState(false);
  const [sessionLogs, setSessionLogs] = useState([]);

  // Fetch real logs if available
  useEffect(() => {
    if (currentUser?.id) {
      base44.entities.TalkingSessionLog.filter({ user_id: currentUser.id }, '-started_at', 5)
        .then((logs) => {
          if (logs && logs.length > 0) {
            const formatted = logs.map(l => ({
              id: l.id,
              date: l.started_at ? new Date(l.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent Session',
              type: 'voice',
              channel: 'Charlie Voice Concierge',
              title: l.roadmap_generated ? 'Real Estate Roadmap Session' : 'Charlie Voice Inquiry',
              summary: l.transcript?.[0]?.text || 'Live spoken session with Charlie',
              turns: l.transcript || [],
              actionTaken: l.roadmap_generated ? 'Generated custom relocation roadmap.' : null,
            }));
            setSessionLogs(formatted);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const profile = SUBSCRIBER_PROFILES[activeRoleKey] || SUBSCRIBER_PROFILES.client;
  const RoleIcon = profile.icon;
  const subscriberName = currentUser?.full_name || 'Bob Dyson';

  const handleRoleTabClick = (roleKey) => {
    setActiveRoleKey(roleKey);
    onSimulateRoleChange?.(roleKey);
  };

  const handleActionClick = (action) => {
    if (action.scrollTarget) {
      const elem = document.getElementById(action.scrollTarget);
      const input = document.getElementById('hero-search-input');
      if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (input) setTimeout(() => input.focus(), 350);
      return;
    }
    if (action.actionType === 'voice') {
      const voiceBtn = document.querySelector('button[title="Talk with Charlie"]') || document.getElementById('charlie-voice-pill');
      if (voiceBtn) {
        voiceBtn.click();
      } else {
        navigate('/talking-app');
      }
      return;
    }
    if (action.dest) {
      navigate(action.dest);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#D4AF37]/50 text-white shadow-2xl relative z-30">
      
      {/* 1. SUBSCRIBER ROLE SELECTOR STRIP (Switch between all 6 portals instantly) */}
      <div className="px-3 sm:px-6 py-2 bg-[#111111] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
            Subscriber Command Center
          </span>
          <span className="text-white/40 text-[10px] hidden sm:inline">•</span>
          <span className="text-white/70 text-[10px] hidden sm:inline">
            Recognized Subscriber View
          </span>
        </div>

        {/* 6 Portal Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[9.5px] text-white/50 uppercase tracking-wide mr-1 font-bold whitespace-nowrap">
            Portal View:
          </span>
          {[
            { key: 'client', label: 'Buyer / Client', icon: Home },
            { key: 'agent', label: 'Active Agent', icon: Star },
            { key: 'referral_agent', label: 'Referral 25%', icon: Handshake },
            { key: 'hr', label: 'Corporate HR', icon: Building2 },
            { key: 'broker', label: 'Broker / Owner', icon: Briefcase },
            { key: 'vendor', label: 'Vetted Vendor', icon: Wrench },
          ].map(tab => {
            const isCurrent = activeRoleKey === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleRoleTabClick(tab.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  isCurrent 
                    ? 'bg-[#D4AF37] text-black shadow-md scale-105' 
                    : 'bg-[#1e1e1e] text-white/70 hover:text-white hover:bg-[#282828] border border-white/10'
                }`}
              >
                <TabIcon className="w-3 h-3 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. RECOGNITION HEADER & PERSONALIZED GREETING */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left: Subscriber Identity & Salutation */}
          <div className="flex items-start gap-3 sm:gap-4 text-left">
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #1c180f 0%, #0d0d0d 100%)',
                borderColor: `${GOLD}90`
              }}
            >
              <RoleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  {profile.badge}
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  DRE #02303118 Verified
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Welcome back, {subscriberName}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block shadow-md" title="Active & Authenticated" />
              </h2>

              <p className="text-xs sm:text-sm text-[#fce38a] font-medium leading-relaxed">
                {profile.greetingMessage}
              </p>
            </div>
          </div>

          {/* Right: Retained Dialogue Button & Direct Workspace Entry */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            
            {/* RETAINED DIALOGUE DRAWER TRIGGER */}
            <button
              type="button"
              onClick={() => setIsDialogueModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#161616] hover:bg-[#202020] hover:border-[#D4AF37] transition-all text-xs font-bold text-white shadow-md cursor-pointer group"
              title="Open your retained conversations, transcripts, and advice logs"
            >
              <History className="w-4 h-4 text-[#D4AF37] group-hover:rotate-[-20deg] transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Retained Dialogue
                </div>
                <div className="text-[8.5px] text-white/50">
                  {sessionLogs.length > 0 ? `${sessionLogs.length} Sessions Logged` : 'Prior Conversations'}
                </div>
              </div>
              <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 ml-1">
                Open
              </span>
            </button>

            {/* DIRECT WORKSPACE ENTRY */}
            <button
              type="button"
              onClick={() => navigate(profile.portalDest)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              }}
            >
              <span>Enter {profile.portalName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. ACTIVE FILE STATUS BANNER (WHY THEY CAME BACK TODAY) */}
        <div 
          className="mt-4 p-3 sm:p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner"
          style={{ 
            background: 'linear-gradient(90deg, #161208 0%, #0d0d0d 100%)',
            borderColor: `${GOLD}50` 
          }}
        >
          <div className="space-y-0.5 text-left">
            <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Current Status in Progress:</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white">
              {profile.activeStatus}
            </div>
            <div className="text-[11px] text-[#fce38a] font-medium">
              {profile.urgentFocus}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-white/60 font-mono hidden sm:inline">
              Fiduciary Supervision Active
            </span>
            <button
              type="button"
              onClick={() => navigate(profile.portalDest)}
              className="px-3 py-1 rounded-lg bg-[#222] hover:bg-[#D4AF37] hover:text-black border border-white/20 text-[11px] font-bold text-white transition-all cursor-pointer flex items-center gap-1"
            >
              <span>View Full File</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. PREMEDITATED CHOICES & NEXT ACTION STEPS (THE 3 EXECUTION CARDS) */}
        <div className="mt-4 pt-3 border-t border-white/10 text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5 flex items-center justify-between">
            <span>Premeditated Action Steps for Today:</span>
            <span className="text-[9px] text-white/40 lowercase">select any card to execute immediately</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profile.actions.map((act) => (
              <div
                key={act.id}
                onClick={() => handleActionClick(act)}
                className="p-3.5 rounded-xl border border-white/10 bg-[#121212] hover:border-[#D4AF37] hover:bg-[#18160f] transition-all cursor-pointer flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border"
                      style={{ 
                        background: `${act.color}20`, 
                        borderColor: `${act.color}50`, 
                        color: act.color 
                      }}
                    >
                      {act.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {act.title}
                  </h4>
                  <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px]">
                  <span className="font-bold text-[#D4AF37] group-hover:underline">
                    {act.btnText}
                  </span>
                  <ChevronRight className="w-3 h-3 text-white/40 group-hover:text-[#D4AF37]" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RETAINED DIALOGUE MODAL */}
      <RetainedDialogueModal
        isOpen={isDialogueModalOpen}
        onClose={() => setIsDialogueModalOpen(false)}
        subscriberRole={activeRoleKey}
        subscriberName={subscriberName}
        realLogs={sessionLogs}
      />
    </div>
  );
}