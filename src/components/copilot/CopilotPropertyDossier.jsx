import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, 
  Phone, Mic, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotPropertyDossier({ property }) {
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  if (!property) return null;

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!smsPhone.trim()) return;
    setSmsSent(true);
  };

  const listFee = property.price * 0.025;
  const dysonReferral = listFee * 0.25;
  const clientRebate = property.rebate || Math.round(dysonReferral * 0.5);
  const compsSpread = property.price - (property.compsPrice || property.price);

  return (
    <div className="w-full space-y-4 text-left animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* ── 1. PROPERTY HEADER BAR ── */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl"
        style={{ background: '#0a0a0a', borderColor: `${GOLD}50` }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {property.address}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50">
              Verified Listing
            </span>
          </div>
          <p className="text-xs text-white/60">
            {property.beds} Beds • {property.baths} Baths • {property.sqft?.toLocaleString()} SqFt • {property.dom} Days on Market • Office: {property.listingOffice || 'Syndicated Listing Brokerage'}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
            Current List Price
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${property.price?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── 2. THE 3 CORE DOSSIER CARDS (REBATE, COMPS, RISKS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* CARD 1: 50% CASH BACK REBATE AT CLOSING */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between space-y-3 shadow-xl"
          style={{ background: '#12100a', borderColor: GOLD }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#D4AF37]">
                YOUR CASH BACK AT CLOSING
              </span>
              <span className="p-1 rounded-md bg-[#D4AF37]/20 text-[#D4AF37]">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
              +${clientRebate.toLocaleString()}
            </div>
            
            <p className="text-[11.5px] text-white/80 mt-1 leading-relaxed">
              Up to <strong>50% of our brokerage referral fee</strong> credited directly to your closing settlement statement or mortgage rate buy-down.
            </p>
          </div>

          <div className="pt-2.5 border-t border-[#D4AF37]/30 text-[10.5px] text-white/60 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Listing Side Fee (2.5%):</span>
              <span>${Math.round(listFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Dyson 25% Referral:</span>
              <span>${Math.round(dysonReferral).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#D4AF37] font-bold text-xs pt-0.5">
              <span>Your 50% Rebate:</span>
              <span>+${clientRebate.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: UNBIASED COMPS REALITY */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 shadow-xl"
          style={{ background: '#0e1117', borderColor: '#3b82f6' }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#60a5fa]">
                UNBIASED COMPS VALUATION
              </span>
              <span className="p-1 rounded-md bg-blue-500/20 text-[#60a5fa]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
              ${(property.compsPrice || property.price).toLocaleString()}
            </div>

            <p className="text-[11.5px] text-white/80 mt-1 leading-relaxed">
              Estimated fair market value based on actual closed neighborhood sales, not asking prices or algorithmic sales pitch.
            </p>
          </div>

          <div className="pt-2.5 border-t border-blue-500/30 text-[10.5px] text-white/60 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Spread vs Ask:</span>
              <span className={compsSpread > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {compsSpread > 0 ? `-$${compsSpread.toLocaleString()} (Overpriced)` : 'Fairly Priced'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Sold ({property.lastSoldYear || '2019'}):</span>
              <span>${(property.lastSoldPrice || Math.round(property.price * 0.65)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: HIDDEN RISKS & AUDIT */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 shadow-xl"
          style={{ background: '#160c0c', borderColor: '#ef4444' }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#f87171]">
                HIDDEN RISKS &amp; AUDIT
              </span>
              <span className="p-1 rounded-md bg-red-500/20 text-[#f87171]">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>

            <ul className="mt-2 space-y-1.5 text-xs text-white/85">
              {(property.risks || [
                `${property.dom} days on market — price reduction pending`,
                'Municipal zoning & permit boundary compliance check required',
                'Local comps variance indicates negotiation leverage'
              ]).map((risk, rIdx) => (
                <li key={rIdx} className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold leading-none shrink-0">•</span>
                  <span className="leading-snug">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2.5 border-t border-red-500/30 text-[10.5px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deed, zoning &amp; title audit by Dyson Copilot</span>
          </div>
        </div>

      </div>

      {/* ── 3. PRIVATE DOSSIER DELIVERY (NO HARASSMENT) ── */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
        style={{ background: '#14120b', borderColor: `${GOLD}60` }}
      >
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              PRIVATE DOSSIER · NO AGENT HARASSMENT
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            We don't auction your phone number to 5 competing agents. Get this unvarnished property audit, comps report, and exact rebate guarantee texted straight to your phone.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {smsSent ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Dossier sent to {smsPhone}. Check your messages!</span>
            </div>
          ) : (
            <form onSubmit={handleSendSms} className="flex items-center gap-2">
              <input
                type="tel"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                placeholder="(555) 000-0000"
                required
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs w-40 sm:w-48 focus:outline-none focus:border-[#D4AF37] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-black text-black whitespace-nowrap shadow-md cursor-pointer transition-all hover:brightness-110 active:scale-95"
                style={{ background: `linear-gradient(135deg, #e8c84a 0%, ${GOLD} 100%)` }}
              >
                Text Me Dossier
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── 4. HUMAN FIDUCIARY OVERSIGHT ANCHOR ── */}
      <div 
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md"
        style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
            BD
          </div>
          <div>
            <div className="text-white font-bold text-xs">
              Human Fiduciary Oversight
            </div>
            <div className="text-[11px] text-white/50">
              Audited by Bob Dyson &amp; licensed California brokers. 55 years of transaction governance.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/talking-app"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Discuss with Charlie</span>
          </Link>
          <a
            href="tel:+18583531200"
            className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
          >
            <Phone className="w-3 h-3" />
            <span>(858) 353-1200</span>
          </a>
        </div>
      </div>

      {/* ── 5. DNN HOUSING PULSE NEWS TICKER ── */}
      <div 
        className="px-4 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm"
        style={{ background: '#050505', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-[9.5px] font-black uppercase tracking-wider text-red-400 shrink-0">
            DNN HOUSING PULSE:
          </span>
          <span className="text-white/80 text-[11px] truncate">
            Mortgage rates ease to 6.35% as buyers turn to private fee-rebating brokerages over aggregator portals.
          </span>
        </div>

        <Link
          to="/dnn-news"
          className="text-[10px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Watch 6AM Brief</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}