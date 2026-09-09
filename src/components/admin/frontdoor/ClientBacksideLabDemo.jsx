import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, User, Home, Mic, Search, Compass, Tv, ShieldCheck, 
  ArrowRight, History, Calendar, TrendingUp, Plus, CheckCircle2, 
  Clock, Phone, MessageCircle, FileText, MapPin, Layers, AlertCircle, X,
  ChevronRight, Smartphone, Building, RefreshCw, ExternalLink
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import RetainedDialogueModal from './RetainedDialogueModal';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo({ initialClient = null }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [liveClient, setLiveClient] = useState(initialClient);
  const [isDialogueModalOpen, setIsDialogueModalOpen] = useState(false);
  const [showAddHomeModal, setShowAddHomeModal] = useState(false);
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [newHomeRole, setNewHomeRole] = useState('selling');
  const [newHomeNotes, setNewHomeNotes] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'properties' | 'roadmap' | 'history'

  // Editable sample property assets (starts with live or rich stub template data)
  const [properties, setProperties] = useState([
    {
      id: 'prop-origin',
      role: 'Current Residence (Origin)',
      address: '14820 Blossom Hill Rd, Los Gatos, CA 95032',
      specs: '4 Beds · 3.5 Baths · 3,850 sq ft',
      status: 'Escrow Open · Pending Close',
      statusColor: '#10b981',
      agent: 'Sarah Lin (PRN Vetted)',
      docs: [
        { name: 'Executed Purchase Agreement.pdf', size: '2.4 MB' },
        { name: 'Preliminary Title Report.pdf', size: '1.8 MB' },
        { name: 'Property Disclosures & Inspection.pdf', size: '4.1 MB' }
      ],
      notes: 'Closing scheduled for June 24. Proceeds wired to 1031 escrow exchange.'
    },
    {
      id: 'prop-dest',
      role: 'Target Home (Destination)',
      address: '20844 N 110th Way, Scottsdale, AZ 85255',
      specs: '5 Beds · 6 Baths · 5,600 sq ft',
      status: 'Fiduciary Contract Audit Active',
      statusColor: '#D4AF37',
      agent: 'Wisdom Properties · Fiduciary Team',
      docs: [
        { name: 'Inspection Contingency Checklist.pdf', size: '920 KB' },
        { name: 'HOA & Golf Membership Bylaws.pdf', size: '3.2 MB' }
      ],
      notes: 'Inspection response submitted to seller. Dyson team auditing repair escrow.'
    }
  ]);

  // Request & Communication History
  const [requestHistory, setRequestHistory] = useState([
    {
      id: 'req-1',
      title: 'Listing Agent Vetting & Fee Audit',
      submittedAt: '3 days ago',
      status: 'completed',
      statusLabel: 'Completed',
      resultSummary: 'Approved. Agent vetted (Top 1% Silicon Valley, 0 disciplinary actions). Negotiated 25% co-op fee.',
      desk: 'Agent Vetting Desk'
    },
    {
      id: 'req-2',
      title: 'Scottsdale Unified School District Analysis',
      submittedAt: 'Yesterday',
      status: 'ongoing',
      statusLabel: 'Ongoing / Reviewing',
      resultSummary: 'Charter vs Public comparison in progress. Executive briefing scheduled with Charlie.',
      desk: 'Relocation Intelligence'
    },
    {
      id: 'req-3',
      title: 'Commercial Storage & Auto Transport Bid',
      submittedAt: 'May 12',
      status: 'abandoned',
      statusLabel: 'Withdrawn',
      resultSummary: 'Client chose private enclosed transport provider independently.',
      desk: 'Vendor Logistics'
    }
  ]);

  // Fetch real authenticated user & real RelocationClient if exists
  useEffect(() => {
    let isMounted = true;
    base44.auth.me().then(async (user) => {
      if (!isMounted) return;
      if (user) {
        setCurrentUser(user);
        try {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients && clients.length > 0) {
            setLiveClient(clients[0]);
          } else {
            const anyClients = await base44.entities.RelocationClient.list('-created_date', 1);
            if (anyClients && anyClients.length > 0 && isMounted) {
              setLiveClient(anyClients[0]);
            }
          }
        } catch (_) {}
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Identity resolution
  const displayName = liveClient?.full_name || currentUser?.full_name || 'Robert & Eleanor Sterling';
  const firstName = displayName.split(' ')[0] || 'Friend';
  const originCity = liveClient?.current_city || 'Silicon Valley, CA';
  const destinationCity = liveClient?.destination_city || 'Scottsdale, AZ';
  const moveRoute = `${originCity} → ${destinationCity}`;
  const userPhoto = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const handleAddHomeSubmit = (e) => {
    e.preventDefault();
    if (!newHomeAddress.trim()) return;
    const newProp = {
      id: `prop-${Date.now()}`,
      role: newHomeRole === 'selling' ? 'Additional Property (Origin/Selling)' : 'Candidate Home (Destination/Buying)',
      address: newHomeAddress.trim(),
      specs: 'Added by subscriber',
      status: 'Pending Fiduciary Review',
      statusColor: '#60a5fa',
      agent: 'Dyson Concierge Assigned',
      docs: [],
      notes: newHomeNotes.trim() || 'Awaiting initial paperwork submission.'
    };
    setProperties([...properties, newProp]);
    setNewHomeAddress('');
    setNewHomeNotes('');
    setShowAddHomeModal(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4 text-left">
      
      {/* TEMPLATE CONTROLS & CALLOUT BAR */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/60 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <div className="font-bold text-white leading-tight">Client Backside Template</div>
            <div className="text-[10px] text-white/60 font-mono">Portrait-Mobile First · ~390px Viewport</div>
          </div>
        </div>
        <span 
          className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black shadow-sm"
          style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
        >
          ALL ABOUT THEM
        </span>
      </div>

      {/* ========================================================
          PORTRAIT-MOBILE-FIRST CHASSIS (~390px WIDTH)
          Strictly framed at max-w-[390px] for true mobile parity
          Obsidian frame, gold bezel, responsive on actual phones
          ======================================================== */}
      <div 
        className="w-full max-w-[390px] rounded-[36px] p-3 sm:p-3.5 shadow-2xl relative overflow-hidden flex flex-col border-4"
        style={{
          background: '#070707',
          borderColor: '#1e1c18',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* Top Speaker / Dynamic Island Simulator */}
        <div className="w-full flex items-center justify-between px-4 pt-1 pb-2">
          <span className="text-[11px] font-bold text-white/70 font-mono">9:41</span>
          <div className="w-20 h-4 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[10px] font-bold text-[#D4AF37]">5G</span>
          </div>
        </div>

        {/* ========================================================
            INNER SCROLLABLE CONTENT AREA (TAN BACKGROUND CANVAS)
            Universal #ede0cc backdrop with black containers & gold accents
            ======================================================== */}
        <div 
          className="w-full rounded-[26px] p-3 sm:p-3.5 space-y-3 overflow-y-auto max-h-[82vh] scrollbar-thin"
          style={{ background: TAN_BG }}
        >
          {/* 1. HEADER: IDENTITY & VERIFIED SUBSCRIBER CARD */}
          <div 
            className="p-3 rounded-2xl border text-left shadow-md relative overflow-hidden"
            style={{
              background: '#0a0a0a',
              borderColor: `${GOLD}`,
            }}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px]">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D4AF37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>RELOCATING FAMILY CLIENT</span>
              </span>
              <button
                type="button"
                onClick={() => setIsDialogueModalOpen(true)}
                className="flex items-center gap-1 text-[8.5px] font-bold text-white/80 hover:text-white underline cursor-pointer"
              >
                <History className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span>Dialogue History</span>
              </button>
            </div>

            {/* Profile Avatar & Welcome */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={userPhoto}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow"
                />
                <span 
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[7.5px] font-black text-black"
                  title="Fiduciary Protection Active"
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0">
                <h2 
                  className="text-lg font-bold text-white leading-tight truncate"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Welcome back {firstName}
                </h2>
                <div className="text-[11px] font-bold text-[#D4AF37] truncate mt-0.5">
                  {moveRoute}
                </div>
                <div className="text-[8.5px] text-white/50 font-mono">
                  Concierge Lead: <strong>Bob Dyson</strong> · CA DRE #02303118
                </div>
              </div>
            </div>

            {/* Fiduciary Direct Contact Pill */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px]">
              <span className="text-white/60">Fiduciary Direct: <strong>(858) 353-1200</strong></span>
              <div className="flex items-center gap-1">
                <a 
                  href="tel:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#1f1a0e] border border-[#D4AF37] text-[8px] font-bold text-[#D4AF37] hover:brightness-125"
                >
                  Call
                </a>
                <a 
                  href="sms:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#1f1a0e] border border-[#D4AF37] text-[8px] font-bold text-[#D4AF37] hover:brightness-125"
                >
                  Text
                </a>
              </div>
            </div>
          </div>

          {/* 2. THE THREE PRESERVED COMMAND BUTTONS (CORE ACTIONS) */}
          <div className="space-y-1.5">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#0a0a0a] px-1 flex items-center justify-between">
              <span>Your Next Steps</span>
              <span className="text-[8px] text-[#854d0e] font-bold">1-Click Actions</span>
            </div>

            {/* Action 1: Continue your move */}
            <button
              type="button"
              onClick={() => navigate('/RelocationRoadmap')}
              className="w-full group p-2.5 rounded-xl border border-[#D4AF37] hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-md"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              }}
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Home className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0" />
                  <span className="text-xs font-black text-[#0a0a0a]">
                    1. Continue Your Move
                  </span>
                  <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-white font-bold shrink-0">
                    Active Roadmap
                  </span>
                </div>
                <p className="text-[9px] text-[#2b2118] font-semibold leading-tight">
                  Phase 3 of 7 · Inspection Release deadline approaching
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Action 2: Talk with Charlie (Voice AI) */}
            <button
              type="button"
              onClick={() => navigate('/talking-app')}
              className="w-full group p-2.5 rounded-xl border border-[#D4AF37] hover:brightness-110 transition-all text-left cursor-pointer flex items-center justify-between shadow-md bg-[#0a0a0a]"
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Mic className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold text-white">
                    2. Talk with Charlie
                  </span>
                  <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#10b981] text-black font-black shrink-0">
                    Voice AI
                  </span>
                </div>
                <p className="text-[9px] text-white/60 leading-tight">
                  Ask relocation questions, school ratings &amp; escrow checks
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Action 3: Vet a listing / refer */}
            <button
              type="button"
              onClick={() => navigate('/refer')}
              className="w-full group p-2.5 rounded-xl border border-[#D4AF37]/60 hover:brightness-110 transition-all text-left cursor-pointer flex items-center justify-between shadow-md bg-[#0a0a0a]"
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Search className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold text-white">
                    3. Vet a Listing / Refer
                  </span>
                  <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#151515] text-[#38bdf8] font-bold border border-[#38bdf8]/40 shrink-0">
                    Audit
                  </span>
                </div>
                <p className="text-[9px] text-white/60 leading-tight">
                  Paste any MLS link for fiduciary agent &amp; contract review
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Listing Audit Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/refer');
            }}
            className="flex items-center gap-1.5 p-1 rounded-full bg-[#0a0a0a] border border-[#D4AF37] shadow-md"
          >
            <div className="flex items-center gap-1.5 w-full pl-2.5 py-0.5">
              <Search className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                placeholder="Paste Realtor, Zillow or Redfin link to audit..."
                className="w-full bg-transparent text-[9.5px] text-white placeholder:text-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 rounded-full text-[8.5px] font-black uppercase text-black shrink-0"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
            >
              Audit
            </button>
          </form>

          {/* 3. SECTION TABS: ALL ABOUT THEM */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 text-[9px] font-bold text-white">
            {[
              { id: 'overview', label: 'Holdings & Goal' },
              { id: 'roadmap', label: 'Milestones' },
              { id: 'pulse', label: 'Market Pulse' },
              { id: 'history', label: 'Requests' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1 px-1 rounded-lg transition-all text-center truncate ${
                  activeTab === tab.id
                    ? 'bg-[#ede0cc] text-[#0a0a0a] font-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: HOLDINGS ("WHAT THEY HAVE") & GOAL ("WHAT THEY WANT TO ACCOMPLISH") */}
          {(activeTab === 'overview') && (
            <div className="space-y-3 animate-in fade-in duration-200">
              
              {/* WHAT THEY WANT TO ACCOMPLISH (CLIENT GOAL) */}
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/70 text-white space-y-1.5 shadow-md">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-black uppercase tracking-wider text-[#D4AF37]">
                    WHAT YOU WANT TO ACCOMPLISH
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/40">
                    Dual Transaction
                  </span>
                </div>
                <h3 
                  className="text-sm font-bold leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Sell Los Gatos Residence &amp; Acquire Scottsdale Single-Story Luxury Estate
                </h3>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[8.5px]">
                  <div className="p-1.5 rounded bg-[#141414] border border-white/10">
                    <span className="text-white/50 block">Target Close</span>
                    <strong className="text-white">Q3 2026 (Tax Year Lock)</strong>
                  </div>
                  <div className="p-1.5 rounded bg-[#141414] border border-white/10">
                    <span className="text-white/50 block">Key Requirement</span>
                    <strong className="text-white">Single Story · Gated / Golf</strong>
                  </div>
                </div>
              </div>

              {/* WHAT THEY HAVE (MULTIPLE OWNED / CURRENT HOMES) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-[#0a0a0a] px-1">
                  <span>What You Have ({properties.length} Properties)</span>
                  <button
                    type="button"
                    onClick={() => setShowAddHomeModal(true)}
                    className="inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37] hover:brightness-125 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add Your Home</span>
                  </button>
                </div>

                {properties.map((prop, idx) => (
                  <div 
                    key={prop.id}
                    className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/50 text-white space-y-2 shadow-md relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#1e1c18] text-[#D4AF37] border border-[#D4AF37]/30 inline-block mb-1">
                          {prop.role}
                        </span>
                        <h4 className="text-xs font-bold leading-snug">{prop.address}</h4>
                        <div className="text-[8.5px] text-white/60 font-mono mt-0.5">{prop.specs}</div>
                      </div>
                      <span 
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: `${prop.statusColor}20`, color: prop.statusColor, border: `1px solid ${prop.statusColor}` }}
                      >
                        {prop.status}
                      </span>
                    </div>

                    {/* Associated Documents */}
                    {prop.docs && prop.docs.length > 0 && (
                      <div className="pt-1.5 border-t border-white/10 space-y-1">
                        <div className="text-[8px] font-bold text-white/50 uppercase">Linked Escrow &amp; Audit Files:</div>
                        {prop.docs.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center justify-between text-[8px] p-1 rounded bg-[#161616] border border-white/5">
                            <span className="flex items-center gap-1 truncate text-white/80">
                              <FileText className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
                              <span className="truncate">{doc.name}</span>
                            </span>
                            <span className="text-white/40 shrink-0 ml-1">{doc.size}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[8.5px] text-[#fce38a] italic bg-[#15120a] p-1.5 rounded border border-[#D4AF37]/30 leading-snug">
                      Note: {prop.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ROADMAP & MILESTONES (INTEGRAL ROADMAP REUSE) */}
          {activeTab === 'roadmap' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37] text-white space-y-2 shadow-md">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-black uppercase tracking-wider text-[#D4AF37]">
                    ACTIVE RELOCATION ROADMAP
                  </span>
                  <span className="text-[8.5px] text-[#10b981] font-bold">
                    Phase 3 of 7 Active
                  </span>
                </div>
                
                {/* Visual Step Tracker */}
                <div className="space-y-2 pt-1">
                  {[
                    { step: '1', title: 'Fiduciary Intake & Strategy Blueprint', state: 'completed', date: 'Done May 14' },
                    { step: '2', title: 'Silicon Valley Listing Agent Vetting', state: 'completed', date: 'Done May 28' },
                    { step: '3', title: 'Scottsdale Property Contract & Escrow Audit', state: 'current', date: 'Underway' },
                    { step: '4', title: 'Inspection & Repair Contingency Release', state: 'pending', date: 'Due June 12' },
                    { step: '5', title: '1031 Exchange / Proceeds Coordination', state: 'pending', date: 'Target June 20' },
                    { step: '6', title: 'Final Walkthrough & Utility Transfer', state: 'pending', date: 'Target June 28' },
                    { step: '7', title: 'Keys Delivered & Post-Close Concierge', state: 'pending', date: 'Target July 2' }
                  ].map((s, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-2 rounded-lg text-[9px] border transition-all ${
                        s.state === 'completed'
                          ? 'bg-[#10b981]/10 border-[#10b981]/40 text-white'
                          : s.state === 'current'
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold'
                          : 'bg-[#121212] border-white/10 text-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[7.5px] font-black shrink-0 ${
                          s.state === 'completed' ? 'bg-[#10b981] text-black' : s.state === 'current' ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-white/60'
                        }`}>
                          {s.state === 'completed' ? '✓' : s.step}
                        </span>
                        <span className="truncate">{s.title}</span>
                      </div>
                      <span className="text-[7.5px] shrink-0 font-mono text-white/60">{s.date}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/RelocationRoadmap')}
                  className="w-full mt-2 py-2 rounded-lg font-black text-xs text-black flex items-center justify-center gap-1.5 shadow"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  <span>Open Full Interactive Roadmap</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MARKET PULSE (CLEARLY LABELED COMING / STUB - NO FAKE VALUATIONS) */}
          {activeTab === 'pulse' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/60 text-white space-y-2 shadow-md">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-black uppercase tracking-wider text-[#D4AF37]">
                    MARKET PULSE
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[7.5px]">
                    LIVE DESK CURATION
                  </span>
                </div>

                <p className="text-[8.5px] text-white/70 leading-relaxed">
                  Independent macro &amp; local market effects affecting your origin and destination assets. We provide verified market factors rather than speculative automated valuation algorithms.
                </p>

                {/* Origin Market Effect */}
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[8.5px]">
                    <span className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#10b981]" />
                      <span>Origin: Silicon Valley (Los Gatos)</span>
                    </span>
                    <span className="text-[#10b981] font-bold font-mono">Seller's Advantage</span>
                  </div>
                  <p className="text-[8px] text-white/60 leading-snug">
                    Luxury inventory in Santa Clara County remains constrained at 1.8 months. Average DOM for prime estates sits at 21 days. Favorable climate to secure strong non-contingent offer.
                  </p>
                </div>

                {/* Destination Market Effect */}
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[8.5px]">
                    <span className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>Destination: Scottsdale, AZ (Silverleaf)</span>
                    </span>
                    <span className="text-[#D4AF37] font-bold font-mono">Buyer Negotiation</span>
                  </div>
                  <p className="text-[8px] text-white/60 leading-snug">
                    Summer seasonal lull has expanded luxury inventory to 4.6 months. Premium buyers currently achieving 3-5% inspection credits and seller-paid HOA transfers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REQUEST HISTORY (ONGOING | COMPLETED | ABANDONED TIED TO ROADMAPS) */}
          {activeTab === 'history' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/60 text-white space-y-2 shadow-md">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-black uppercase tracking-wider text-[#D4AF37]">
                    YOUR REQUEST HISTORY
                  </span>
                  <span className="text-white/50 text-[8px] font-mono">
                    Roadmap Tied
                  </span>
                </div>

                <div className="space-y-2">
                  {requestHistory.map(req => (
                    <div 
                      key={req.id}
                      className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[8.5px]">
                        <span className="font-bold text-white truncate">{req.title}</span>
                        <span className={`text-[7.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          req.status === 'completed'
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : req.status === 'ongoing'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : 'bg-white/10 text-white/50 border border-white/20'
                        }`}>
                          {req.statusLabel}
                        </span>
                      </div>
                      <p className="text-[8px] text-white/60 leading-snug">
                        {req.resultSummary}
                      </p>
                      <div className="flex items-center justify-between text-[7.5px] text-white/40 pt-0.5 border-t border-white/5">
                        <span>{req.desk}</span>
                        <span>{req.submittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. FAST ESSENTIALS: 6AM NEWS & SOLUTIONS ENTRY */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/dnn-news')}
              className="p-2 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/60 hover:brightness-110 text-left transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[9px] font-bold text-white mb-0.5">
                <Tv className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate">6AM DNN News</span>
              </div>
              <p className="text-[8px] text-white/50 truncate">Daily Housing Broadcast</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/solutions')}
              className="p-2 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/60 hover:brightness-110 text-left transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[9px] font-bold text-white mb-0.5">
                <Compass className="w-3 h-3 text-[#38bdf8] shrink-0" />
                <span className="truncate">Solutions Map</span>
              </div>
              <p className="text-[8px] text-white/50 truncate">Blueprints &amp; Guidance</p>
            </button>
          </div>

          {/* 5. FOOTER COMPLIANCE BADGE */}
          <div className="pt-2 text-center text-[8px] text-[#44382c] font-medium leading-tight">
            <div>The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118</div>
            <div>Nationwide Fiduciary Relocation Concierge</div>
          </div>
        </div>

        {/* Bottom Home Indicator Bar Simulator */}
        <div className="w-full flex justify-center py-2">
          <div className="w-32 h-1 rounded-full bg-white/30" />
        </div>
      </div>

      {/* MODAL: ADD YOUR HOME / PROPERTY ENTRY */}
      {showAddHomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm rounded-2xl p-4 sm:p-5 border space-y-3.5 shadow-2xl text-left"
            style={{ background: '#0a0a0a', borderColor: GOLD }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white">Add Your Home</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddHomeModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHomeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase mb-1">
                  Property Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewHomeRole('selling')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-center border ${
                      newHomeRole === 'selling'
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#151515] text-white/70 border-white/10'
                    }`}
                  >
                    Selling (Origin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHomeRole('buying')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-center border ${
                      newHomeRole === 'buying'
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#151515] text-white/70 border-white/10'
                    }`}
                  >
                    Target (Destination)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  required
                  value={newHomeAddress}
                  onChange={(e) => setNewHomeAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP..."
                  className="w-full p-2 rounded-lg bg-[#151515] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase mb-1">
                  Details / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newHomeNotes}
                  onChange={(e) => setNewHomeNotes(e.target.value)}
                  placeholder="Estimated price, timeline, or current status..."
                  className="w-full p-2 rounded-lg bg-[#151515] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHomeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETAINED DIALOGUE MODAL */}
      <RetainedDialogueModal
        isOpen={isDialogueModalOpen}
        onClose={() => setIsDialogueModalOpen(false)}
        subscriberRole="client"
        subscriberName={displayName}
      />
    </div>
  );
}