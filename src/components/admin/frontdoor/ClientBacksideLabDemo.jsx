import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, User, Home, Mic, Search, Compass, Tv, ShieldCheck, 
  ArrowRight, History, Calendar, TrendingUp, Plus, CheckCircle2, 
  Clock, Phone, MessageCircle, FileText, MapPin, Layers, AlertCircle, X
} from 'lucide-react';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo() {
  const navigate = useNavigate();
  const [showAddHomeModal, setShowAddHomeModal] = useState(false);
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [newHomeRole, setNewHomeRole] = useState('selling');
  const [userHomes, setUserHomes] = useState([
    {
      id: 'h-1',
      address: '14820 Blossom Hill Rd, Los Gatos, CA 95032',
      type: 'Origin Property (Silicon Valley)',
      status: 'In Escrow / Pending Close',
      statusColor: '#10b981',
      details: 'Primary Residence · 4 Beds · 3.5 Baths',
    },
    {
      id: 'h-2',
      address: '20844 N 110th Way, Scottsdale, AZ 85255',
      type: 'Destination Property (Silverleaf / DC Ranch)',
      status: 'Escrow Milestone Audit Active',
      statusColor: '#D4AF37',
      details: 'Purchasing · Fiduciary Review by Dyson Relo Team',
    },
  ]);

  const handleAddHome = (e) => {
    e.preventDefault();
    if (!newHomeAddress.trim()) return;
    setUserHomes([
      ...userHomes,
      {
        id: `h-${Date.now()}`,
        address: newHomeAddress.trim(),
        type: newHomeRole === 'selling' ? 'Origin Property (Selling)' : 'Destination Candidate',
        status: 'Audit Staged (Demo)',
        statusColor: '#60a5fa',
        details: 'Added via Client Backside Deck',
      },
    ]);
    setNewHomeAddress('');
    setShowAddHomeModal(false);
  };

  return (
    <div className="w-full space-y-4 text-left">
      {/* EXPLICIT DEMO / LAB CALLOUT BANNER */}
      <div 
        className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
        style={{
          background: '#0a0a0a',
          borderColor: GOLD,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span 
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-1.5 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
          >
            <Sparkles className="w-3 h-3 text-black animate-pulse" />
            <span>CLIENT BACKSIDE DEMO · LAB ONLY</span>
          </span>
          <span className="text-[11px] text-white/70 hidden md:inline">
            Review Artifact: Simulated all-about-them subscriber shell with stubbed sample data.
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] text-[#fce38a] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span>STUBBED DEMO DATA • PREVIEW ONLY</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BACKSIDE CONTAINER (Tan Canvas + Black Command Containers) */}
      <div 
        className="w-full rounded-2xl border border-[#D4AF37]/50 overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        style={{ background: TAN_BG }}
      >
        {/* ========================================================
            LEFT SIDEBAR: PERSONAL SUBSCRIBER RAIL
            Black sidebar container with tan pills & gold highlights
            ======================================================== */}
        <aside 
          className="w-full lg:w-[300px] shrink-0 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D4AF37]/40 text-left relative z-10"
          style={{
            background: 'linear-gradient(180deg, #0e0e0e 0%, #080808 100%)',
          }}
        >
          <div className="space-y-3.5">
            {/* 1. Client Profile Header with Photo */}
            <div className="p-3 rounded-xl bg-[#141414] border border-[#D4AF37]/40 space-y-2 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Subscriber Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                  />
                  <span 
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[8px] font-bold text-black"
                    title="Verified Subscriber"
                  >
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-white truncate" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      Robert &amp; Eleanor Sterling
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#D4AF37] font-semibold">
                    VIP Relocating Family Subscriber
                  </p>
                  <p className="text-[9px] text-white/50 font-mono truncate">
                    Client ID: #DY-84920 · Silicon Valley → Scottsdale
                  </p>
                </div>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                <span>Concierge Lead: <strong>Bob Dyson</strong></span>
                <span className="text-[#10b981] font-semibold">Fiduciary Active</span>
              </div>
            </div>

            {/* 2. Personalized Sidebar Navigation Links */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] px-1 flex items-center justify-between">
                <span>Personal Suite Links:</span>
                <span className="text-[8px] text-white/40 font-mono">live routes</span>
              </div>

              {/* My Roadmap Link -> /RelocationRoadmap */}
              <button
                type="button"
                onClick={() => navigate('/RelocationRoadmap')}
                className="w-full group p-2 rounded-lg border border-[#D4AF37] hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: TAN_BG }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10.5px] font-bold text-[#0a0a0a] truncate">My Roadmap</span>
                    <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-[#10b981] font-bold shrink-0">
                      Phase 3 of 8
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-5">
                    Escrow &amp; milestone checklist
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Charlie Voice AI -> /talking-app */}
              <button
                type="button"
                onClick={() => navigate('/talking-app')}
                className="w-full group p-2 rounded-lg border border-[#D4AF37] hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: TAN_BG }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10.5px] font-bold text-[#0a0a0a] truncate">Charlie Concierge</span>
                    <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-[#D4AF37] font-bold shrink-0">
                      Voice AI
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-5">
                    Real-time relocation answers
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Vet a listing / refer -> /refer */}
              <button
                type="button"
                onClick={() => navigate('/refer')}
                className="w-full group p-2 rounded-lg border border-[#D4AF37] hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: TAN_BG }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10.5px] font-bold text-[#0a0a0a] truncate">Vet a Listing / Refer</span>
                    <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-[#38bdf8] font-bold shrink-0">
                      Fiduciary
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-5">
                    Independent contract &amp; agent audit
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* DNN Daily News -> /dnn-news */}
              <button
                type="button"
                onClick={() => navigate('/dnn-news')}
                className="w-full group p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: TAN_BG }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="text-[10.5px] font-bold text-[#0a0a0a] truncate">6AM DNN News</span>
                    <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-red-400 font-bold shrink-0">
                      Daily Brief
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-5">
                    Mortgage, tax &amp; market broadcast
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Solutions Intelligence -> /solutions */}
              <button
                type="button"
                onClick={() => navigate('/solutions')}
                className="w-full group p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: TAN_BG }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10.5px] font-bold text-[#0a0a0a] truncate">Solutions Intelligence</span>
                    <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#0a0a0a] text-white font-bold shrink-0">
                      Library
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-5">
                    Relocation blueprints &amp; maps
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 3. Existing Concierge Links (Call/Text direct) */}
          <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
            <div 
              className="p-2 rounded-lg border border-[#D4AF37]/60 flex items-center justify-between gap-1.5 shadow-sm"
              style={{ background: TAN_BG }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[7.5px] font-black uppercase tracking-wider text-[#854d0e]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Concierge Direct Desk</span>
                </div>
                <div className="text-[11px] font-bold text-[#0a0a0a] font-mono leading-tight">
                  (858) 353-1200
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href="tel:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#0a0a0a] hover:bg-[#202020] text-[8.5px] font-bold text-white transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  <Phone className="w-2 h-2 text-[#D4AF37]" />
                  <span>Call</span>
                </a>
                <a
                  href="sms:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#0a0a0a] hover:bg-[#202020] text-[8.5px] font-bold text-white transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  <MessageCircle className="w-2 h-2 text-[#D4AF37]" />
                  <span>Text</span>
                </a>
              </div>
            </div>

            <div className="text-[8.5px] text-white/50 flex items-center justify-between px-0.5">
              <span>Fiduciary All 50 States</span>
              <span>CA DRE #02303118</span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            RIGHT CANVAS: MAIN COMMAND CARD + RICH LANDING BLOCKS
            ======================================================== */}
        <div className="flex-1 p-4 sm:p-6 space-y-4">
          
          {/* 1. MAIN COMMAND CARD (Black Luxury Box with Gold Highlights) */}
          <div 
            className="p-4 sm:p-6 rounded-2xl border shadow-xl relative overflow-hidden space-y-4"
            style={{
              background: 'linear-gradient(145deg, #12100b 0%, #080808 60%, #151108 100%)',
              borderColor: `${GOLD}75`,
            }}
          >
            {/* Meta Top Line */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span 
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  ACTIVE SUBSCRIBER DESK
                </span>
                <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
                  Fiduciary Relocation Management
                </span>
              </div>
              <span className="text-[9px] text-[#fce38a] font-mono">
                DEMO · STUBBED INSTANCE
              </span>
            </div>

            {/* Welcome Greeting */}
            <div className="space-y-1">
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back, Robert &amp; Eleanor <span className="text-[#D4AF37]">— Relocating Family</span>
              </h2>
              <p className="text-xs text-white/70">
                Your dedicated Dyson Relo command deck is active and monitoring all milestones.
              </p>
            </div>

            {/* Active Relocation Move Line */}
            <div 
              className="p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner"
              style={{
                background: 'linear-gradient(90deg, #18140c 0%, #0f0f0f 100%)',
                borderColor: `${GOLD}50`,
              }}
            >
              <div className="space-y-0.5">
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Active Relocation Line:</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white tracking-wide">
                  San Jose, CA (Silicon Valley) → Scottsdale, AZ (Silverleaf)
                </div>
                <div className="text-[10px] text-white/60">
                  Status: <strong>Contingency Removal Phase</strong> · Co-ordinated with Vetted Receiving Agent
                </div>
              </div>

              <div className="text-[11px] text-[#fce38a] italic font-medium max-w-xs sm:text-right">
                “Welcome back — want your roadmap, or ask me anything?”
              </div>
            </div>

            {/* EXACTLY THREE VISIBLE ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Button 1: Continue /RelocationRoadmap */}
              <button
                type="button"
                onClick={() => navigate('/RelocationRoadmap')}
                className="p-3 rounded-xl font-bold text-xs sm:text-sm text-black flex items-center justify-between shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                }}
              >
                <div className="text-left">
                  <div className="text-[8.5px] uppercase font-black tracking-wider text-black/75">Action 1</div>
                  <div className="font-bold leading-tight">Continue your move</div>
                </div>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Button 2: Ask Charlie /talking-app */}
              <button
                type="button"
                onClick={() => navigate('/talking-app')}
                className="p-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#151515] hover:bg-[#1f1a10] border border-[#D4AF37]/60 hover:border-[#D4AF37] flex items-center justify-between shadow-lg active:scale-95 transition-all cursor-pointer group"
              >
                <div className="text-left">
                  <div className="text-[8.5px] uppercase font-black tracking-wider text-[#D4AF37]">Action 2</div>
                  <div className="font-bold leading-tight flex items-center gap-1 text-white group-hover:text-[#D4AF37] transition-colors">
                    <span>Ask Charlie</span>
                  </div>
                </div>
                <Mic className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
              </button>

              {/* Button 3: Refer /refer */}
              <button
                type="button"
                onClick={() => navigate('/refer')}
                className="p-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#151515] hover:bg-[#1f1a10] border border-white/20 hover:border-[#D4AF37] flex items-center justify-between shadow-lg active:scale-95 transition-all cursor-pointer group"
              >
                <div className="text-left">
                  <div className="text-[8.5px] uppercase font-black tracking-wider text-white/60">Action 3</div>
                  <div className="font-bold leading-tight flex items-center gap-1 text-white group-hover:text-[#D4AF37] transition-colors">
                    <span>Refer / Vet Listing</span>
                  </div>
                </div>
                <Search className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* 2. LANDING BLOCKS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BLOCK A: What you have (Assets / Homes) + Stub "+ Add Home" */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white font-serif">What You Have (Move Properties)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddHomeModal(true)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-black flex items-center gap-1 shadow-sm hover:brightness-110 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add home</span>
                </button>
              </div>

              <div className="space-y-2">
                {userHomes.map((home) => (
                  <div key={home.id} className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="text-[#D4AF37] uppercase">{home.type}</span>
                      <span style={{ color: home.statusColor }}>{home.status}</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{home.address}</div>
                    <div className="text-[10px] text-white/50">{home.details}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK B: Goals (Relocation Criteria & Targets) */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white font-serif">Relocation Goals &amp; Criteria</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Move Target Window</span>
                  <span className="text-white font-semibold block">Autumn 2026</span>
                  <span className="text-[9.5px] text-white/50 block">Before school year start</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Tax Strategy</span>
                  <span className="text-white font-semibold block">0% Income Tax</span>
                  <span className="text-[9.5px] text-white/50 block">Arizona residency filing</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Destination Lifestyle</span>
                  <span className="text-white font-semibold block">Silverleaf Foothills</span>
                  <span className="text-[9.5px] text-white/50 block">Mountain vistas &amp; gated enclave</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-1">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Logistics Package</span>
                  <span className="text-white font-semibold block">Full White-Glove</span>
                  <span className="text-[9.5px] text-white/50 block">Vetted interstate moving firm</span>
                </div>
              </div>
            </div>

            {/* BLOCK C: Roadmap Stages Preview */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white font-serif">Relocation Roadmap (Active Stages)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/RelocationRoadmap')}
                  className="text-[10px] text-[#D4AF37] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Open Full Roadmap</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { step: 'Stage 1', name: 'Intake & Lifestyle Architecture', status: 'Completed', color: '#10b981' },
                  { step: 'Stage 2', name: 'Independent Agent Vetting & Matching', status: 'Completed', color: '#10b981' },
                  { step: 'Stage 3', name: 'Destination Escrow & Milestone Audit', status: 'In Progress (Active)', color: '#D4AF37' },
                  { step: 'Stage 4', name: 'Closing, White-Glove Move & Settling In', status: 'Scheduled', color: '#6b7280' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="font-bold text-white text-[11px] truncate">{s.step}: {s.name}</span>
                    </div>
                    <span className="text-[9.5px] font-mono font-semibold shrink-0" style={{ color: s.color }}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK D: Dialogue & History */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white font-serif">Retained Dialogue &amp; Move Log</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] text-[#D4AF37]">
                    <span className="font-bold">Charlie Spoken Session</span>
                    <span className="text-white/40">Yesterday, 4:15 PM</span>
                  </div>
                  <p className="text-[10.5px] text-white/80 line-clamp-2">
                    “Discussed Silverleaf HOA transfer guidelines and local STEM high school boundaries.”
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] text-[#10b981]">
                    <span className="font-bold">Escrow Audit Notice</span>
                    <span className="text-white/40">Sep 6, 11:30 AM</span>
                  </div>
                  <p className="text-[10.5px] text-white/80 line-clamp-2">
                    “Title commitment and property disclosure pack verified with Arizona closing agent.”
                  </p>
                </div>
              </div>
            </div>

            {/* BLOCK E: Daily News & Solutions Blueprints */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-white font-serif">Daily News &amp; Solutions</h3>
                </div>
                <span className="text-[9px] font-mono text-[#D4AF37]">Intelligence Feed</span>
              </div>

              <div className="space-y-2 text-xs">
                <div 
                  onClick={() => navigate('/dnn-news')}
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 cursor-pointer transition-colors space-y-0.5"
                >
                  <div className="text-[9px] font-bold text-red-400 uppercase">6AM DNN Broadcast Story</div>
                  <div className="text-[11px] font-bold text-white">
                    State-to-State Rate Lock Strategies: Navigating Dual Escrows
                  </div>
                  <div className="text-[9.5px] text-white/50">Spoken by Charlie &amp; Bob Dyson · Click to Watch</div>
                </div>

                <div 
                  onClick={() => navigate('/solutions')}
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 cursor-pointer transition-colors space-y-0.5"
                >
                  <div className="text-[9px] font-bold text-[#D4AF37] uppercase">Solutions Map Blueprint</div>
                  <div className="text-[11px] font-bold text-white">
                    California to Arizona Tax &amp; Homestead Relocation Guide
                  </div>
                  <div className="text-[9.5px] text-white/50">Comprehensive Fiduciary Checklist · Click to Read</div>
                </div>
              </div>
            </div>

            {/* BLOCK F: Market Pulse Placeholder Slots (CRITICAL: NO FAKE PRICES OR DOLLAR SIGNS) */}
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white font-serif">Scottsdale Market Pulse</h3>
                </div>
                <span className="text-[8.5px] font-mono text-white/50 uppercase">No Dollar Estimates · Metric Placeholders</span>
              </div>

              {/* Verified: NO dollar signs or fake prices in any of these slots */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Inventory Status</span>
                  <span className="text-white font-semibold block">Low Active Inventory</span>
                  <span className="text-[9.5px] text-[#10b981] block">High Executive Demand</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Days on Market</span>
                  <span className="text-white font-semibold block">36 Days Average</span>
                  <span className="text-[9.5px] text-[#fce38a] block">Steady Velocity</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">School Index</span>
                  <span className="text-white font-semibold block">Top 5% Statewide</span>
                  <span className="text-[9.5px] text-white/50 block">Scottsdale Unified District</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141414] border border-white/10 space-y-0.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">Climate / Season</span>
                  <span className="text-white font-semibold block">Prime Move Influx</span>
                  <span className="text-[9.5px] text-white/50 block">Peak Relocation Period</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Assurance & Review Note */}
          <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Independent client backside shell review artifact. Links connect to live app workspaces.</span>
            </div>
            <div className="font-mono text-white/50">
              The Dyson &amp; Dyson Companies, Inc.
            </div>
          </div>
        </div>
      </div>

      {/* STUB "+ ADD HOME" MODAL */}
      {showAddHomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 text-left"
            style={{
              background: '#0e0e0e',
              borderColor: GOLD,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white font-serif">Add Property to Move File (Demo Stub)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHomeModal(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHome} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase mb-1">
                  Property Role in Relocation:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewHomeRole('selling')}
                    className={`py-1.5 px-3 rounded-lg border font-bold transition-all ${
                      newHomeRole === 'selling'
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#181818] text-white/70 border-white/20'
                    }`}
                  >
                    Origin (Selling)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHomeRole('buying')}
                    className={`py-1.5 px-3 rounded-lg border font-bold transition-all ${
                      newHomeRole === 'buying'
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#181818] text-white/70 border-white/20'
                    }`}
                  >
                    Destination (Buying)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase mb-1">
                  Property Address or MLS Link:
                </label>
                <input
                  type="text"
                  value={newHomeAddress}
                  onChange={(e) => setNewHomeAddress(e.target.value)}
                  placeholder="e.g. 744 Chautauqua Alpine Ridge, Boulder, CO"
                  className="w-full bg-[#181818] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  autoFocus
                />
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-white/60">
                <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37] inline mr-1" />
                <span>Lab Demo Stub: This saves in local view state so you can test adding assets in the review artifact.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHomeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-bold text-black shadow"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Attach Home (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}