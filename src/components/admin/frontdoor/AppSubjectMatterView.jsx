import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Mic, Home, Building, Users, Play, ShieldCheck, 
  BookOpen, Phone, MessageSquare, ArrowRight, CheckCircle2, 
  ExternalLink, Compass, Download, DollarSign, FileText, X,
  MapPin, Clock, Star, AlertCircle
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function AppSubjectMatterView({ app, onClose, onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [calcSalePrice, setCalcSalePrice] = useState(1500000);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const Icon = app.icon;

  const handleOpenPage = () => {
    if (onNavigate) {
      onNavigate(app.route);
    } else if (app.route?.startsWith('tel:')) {
      window.open(app.route);
    } else if (app.route) {
      navigate(app.route);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col justify-start rounded-2xl overflow-hidden border shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left"
      style={{
        background: '#0e0e0e',
        borderColor: `${GOLD}60`,
      }}
    >
      {/* ========================================================
          APP SUBJECT MATTER TOP BAR
          ======================================================== */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0"
        style={{
          background: 'linear-gradient(180deg, #181510 0%, #0e0e0e 100%)',
          borderColor: `${GOLD}40`,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Apple Squircle Icon Tile */}
          <div 
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-[16px] pointer-events-none" />
            <Icon className="w-6 h-6 drop-shadow" style={{ color: app.iconColor }} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider ${app.badgeColor}`}>
                {app.badge}
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                FULL APPLICATION VIEW
              </span>
            </div>
            <h2 
              className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight truncate mt-0.5"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {app.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenPage}
            className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            title="Open live page full screen"
          >
            <span>Open Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10"
              title="Return to Hero Estate"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          SCROLLABLE SUBJECT MATTER CONTENT BODY
          ======================================================== */}
      <div 
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-white max-h-[620px]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212,175,55,0.4) transparent',
        }}
      >
        {/* Subtitle / Value Proposition Banner */}
        <div className="p-3.5 rounded-2xl bg-[#16140f] border border-[#D4AF37]/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#D4AF37] block">
              PRIMARY FIDUCIARY FUNCTION
            </span>
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              {app.tagline}
            </p>
          </div>
          <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
            Route: {app.route}
          </span>
        </div>

        {/* 1. CHARLIE AI SPECIFIC SUBJECT MATTER */}
        {app.id === 'charlie_voice' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#10b981]/50 text-center space-y-3 shadow-inner">
              <div className="w-16 h-16 rounded-full bg-[#064e3b] border-2 border-[#10b981] mx-auto flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 text-[#10b981] animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini Live Spoken Voice Concierge</h3>
                <p className="text-[11px] text-white/60 max-w-md mx-auto mt-0.5">
                  Natural 2-way real-time voice debriefs with zero typing. Ask Charlie about tax differentials, school test scores, or vetted agents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`px-5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer shadow-md ${
                  isVoiceActive
                    ? 'bg-[#10b981] text-black animate-pulse'
                    : 'bg-[#181818] text-[#10b981] border border-[#10b981]'
                }`}
              >
                {isVoiceActive ? '● Listening... Tap to End' : 'Tap to Start Spoken Session'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase">Ask About Schools</span>
                <p className="text-white/70 text-[11px]">"Compare public vs private schools in Scottsdale and Paradise Valley."</p>
              </div>
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase">Ask About Taxes</span>
                <p className="text-white/70 text-[11px]">"How much will I save moving $800k income from California to Texas or Arizona?"</p>
              </div>
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase">Ask About Agents</span>
                <p className="text-white/70 text-[11px]">"Which vetted buyer's agent has closed the most sales in Silverleaf this year?"</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. FAMILY RELO / ROADMAP SPECIFIC SUBJECT MATTER */}
        {app.id === 'family_relo' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#D4AF37]/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Fiduciary Move Roadmap</span>
                </h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#10b981] text-black">
                  Active Client File
                </span>
              </div>

              {/* 3 Interactive Roadmap Phases */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#151515] border border-[#10b981]/50 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs">Phase 1: Independent Agent Vetting</span>
                    <p className="text-[11px] text-white/60">Top 1% vetted destination broker selected. No dual agency, fiduciary buyer representation guaranteed.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#151515] border border-[#D4AF37]/50 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs">Phase 2: Escrow &amp; Contract Audit</span>
                    <p className="text-[11px] text-white/60">Contract contingencies, preliminary title review, and repair request negotiations vetted by our California legal desk.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#151515] border border-white/10 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs">Phase 3: White-Glove Logistics &amp; Move-In</span>
                    <p className="text-[11px] text-white/60">Vetted moving carriers, utility activation, vehicle transport, and walk-through verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CORPORATE HR SPECIFIC SUBJECT MATTER */}
        {app.id === 'corporate_hr' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-black border border-[#e8c84a]/50 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#e8c84a]">Executive Move Packages</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Tailored relocation management for senior leadership and key technical hires. Zero vendor markup, direct carrier accountability.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/15 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-white/80">Lump Sum Assistance</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Help employees maximize their relocation stipends with pre-negotiated preferred vendor pricing across movers, storage, and short-term rentals.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. AGENT NETWORK / REFERRAL LEAD SPECIFIC SUBJECT MATTER */}
        {(app.id === 'agent_network' || app.id === 'refer_lead') && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#D4AF37]/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span>25% Referral Fee Payout Calculator</span>
                </h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#D4AF37] text-black">
                  Direct Escrow Payout
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/70">Estimated Sale Price:</span>
                  <span className="font-mono font-bold text-[#D4AF37] text-sm">${calcSalePrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="500000"
                  max="10000000"
                  step="250000"
                  value={calcSalePrice}
                  onChange={(e) => setCalcSalePrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10 text-center">
                    <span className="text-[9px] text-white/50 block">Typical 3% Commission</span>
                    <span className="font-mono font-bold text-white text-xs">${(calcSalePrice * 0.03).toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1a170d] border border-[#D4AF37] text-center">
                    <span className="text-[9px] text-[#D4AF37] font-bold block">Your 25% Referral Payout</span>
                    <span className="font-mono font-bold text-[#10b981] text-sm sm:text-base">${(calcSalePrice * 0.03 * 0.25).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. 6AM DNN NEWS SPECIFIC SUBJECT MATTER */}
        {app.id === 'dnn_news' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#ef4444]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse" />
                  <span className="font-bold text-white text-xs">Today's 6AM Broadcast Desk</span>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#ef4444] text-white">
                  LIVE AIRING
                </span>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#111] border border-white/10 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80" 
                  alt="DNN Studio"
                  className="w-full h-full object-cover opacity-60"
                />
                <button
                  type="button"
                  onClick={handleOpenPage}
                  className="absolute w-14 h-14 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
              </div>

              <div className="text-[11px] text-white/70 space-y-1">
                <p className="font-semibold text-white">Featured Today: Federal Reserve Rates &amp; California Outflow Surge</p>
                <p>Anchors Charlie AI and Bob Dyson discuss mortgage rates, 1031 timeline strategies, and Arizona housing supply.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. MY LIBRARY SPECIFIC SUBJECT MATTER */}
        {app.id === 'my_library' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#3b82f6]/50 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-[#60a5fa] block">Secure Stored Files (3)</span>
              
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-[#151515] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#60a5fa]" />
                    <span className="font-semibold text-white text-[11px]">Grant_Deed_Recorded_LosGatos.pdf</span>
                  </div>
                  <span className="text-[9px] text-[#10b981] font-bold">Verified</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#151515] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#60a5fa]" />
                    <span className="font-semibold text-white text-[11px]">1031_Exchange_Tax_Filing_2026.pdf</span>
                  </div>
                  <span className="text-[9px] text-[#D4AF37] font-bold">Active</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#151515] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#60a5fa]" />
                    <span className="font-semibold text-white text-[11px]">Charlie_AI_Session_Transcripts.txt</span>
                  </div>
                  <span className="text-[9px] text-white/50">3 Turns</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. TRANSPARENCY SPECIFIC SUBJECT MATTER */}
        {app.id === 'transparency' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#10b981]/50 space-y-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>The Concierge Advantage vs. Lead Portals</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#141414] border border-[#10b981]/40 space-y-1">
                  <span className="font-bold text-[#10b981] block">DysonRelo Concierge</span>
                  <ul className="space-y-1 text-white/80 text-[10.5px]">
                    <li>✓ Fiduciary duty to the buyer</li>
                    <li>✓ Independent agent vetting</li>
                    <li>✓ Zero fees charged to buyers</li>
                    <li>✓ Full escrow auditing</li>
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10 space-y-1 opacity-70">
                  <span className="font-bold text-white/60 block">Traditional Portals</span>
                  <ul className="space-y-1 text-white/60 text-[10.5px]">
                    <li>✗ Sells user info to 5+ agents</li>
                    <li>✗ No vetting or accountability</li>
                    <li>✗ Advertisers pay for placement</li>
                    <li>✗ Zero transaction protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. STRATEGY SPECIFIC SUBJECT MATTER */}
        {app.id === 'strategy_solutions' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#e8c84a]/50 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-[#e8c84a] block">State Tax Migration Differential</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-[#161616] border border-red-500/30">
                  <span className="text-[9px] text-white/50 block">California</span>
                  <span className="font-bold text-red-400">13.3% Top Rate</span>
                </div>
                <div className="p-2 rounded-xl bg-[#161616] border border-[#10b981]/40">
                  <span className="text-[9px] text-white/50 block">Arizona</span>
                  <span className="font-bold text-[#10b981]">2.5% Flat Rate</span>
                </div>
                <div className="p-2 rounded-xl bg-[#161616] border border-[#10b981]/40">
                  <span className="text-[9px] text-white/50 block">Texas / Florida</span>
                  <span className="font-bold text-[#10b981]">0% Income Tax</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. CONCIERGE DIRECT SPECIFIC SUBJECT MATTER */}
        {app.id === 'concierge_direct' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-black border border-[#D4AF37]/50 text-center space-y-3">
              <Phone className="w-10 h-10 text-[#D4AF37] mx-auto animate-bounce" />
              <div>
                <h3 className="text-base font-bold text-white font-mono">(858) 353-1200</h3>
                <p className="text-white/60 text-[11px]">California Corporate Relocation Desk &bull; Bob Dyson Direct</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="tel:+18583531200"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs shadow-md"
                >
                  Call Now
                </a>
                <a
                  href="sms:+18583531200"
                  className="px-5 py-2 rounded-xl bg-[#202020] border border-[#10b981] text-[#10b981] font-bold text-xs"
                >
                  Send SMS
                </a>
              </div>
            </div>
          </div>
        )}

        {/* General App Purpose Copy */}
        <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-1.5 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
            DETAILED PURPOSE &amp; VALUE
          </span>
          <p className="text-white/80 leading-relaxed text-[11.5px]">
            {app.purpose}
          </p>
          <div className="pt-2 flex items-center justify-between text-[10px] text-white/50">
            <span>Target Audience: <strong className="text-white/90">{app.targetAudience}</strong></span>
            <button
              type="button"
              onClick={handleOpenPage}
              className="text-[#D4AF37] font-bold hover:underline cursor-pointer"
            >
              Launch Live App →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}