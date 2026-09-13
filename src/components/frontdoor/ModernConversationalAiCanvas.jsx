import React, { useState } from 'react';
import { 
  Search, Mic, ShieldCheck, ArrowRight, DollarSign, CheckCircle2, 
  AlertTriangle, Phone, Sparkles, Send, Lock, Compass, HelpCircle, 
  FileText, Check, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#D4AF37';
const PROHIBITED_REBATE_STATES = ['AL', 'AK', 'IA', 'KS', 'LA', 'MS', 'MO', 'OK', 'OR', 'TN'];

// Sample quick properties for 1-click test
const QUICK_PROPERTIES = [
  { address: '742 Vista Del Mar, La Jolla, CA 92037', price: 3450000, state: 'CA' },
  { address: '2840 Silverleaf Sunset Ridge, Scottsdale, AZ 85253', price: 2150000, state: 'AZ' },
  { address: '4920 Preston Hollow Estate, Dallas, TX 75225', price: 2850000, state: 'TX' },
  { address: '744 Alpine Ridge, Boulder, CO 80302', price: 1850000, state: 'CO' },
  { address: '112 Port Royal Coastal Vista, Naples, FL 34102', price: 4200000, state: 'FL' },
];

export default function ModernConversationalAiCanvas({ onOpenVoice }) {
  const navigate = useNavigate();
  const [inputAddress, setInputAddress] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [baaStatus, setBaaStatus] = useState(null); // 'yes' | 'no' | null
  const [financingStatus, setFinancingStatus] = useState(null); // 'cash' | 'preapproved' | 'planning' | null
  const [timeline, setTimeline] = useState(null); // '30_days' | '60_days' | 'browsing' | null
  const [mobilePhone, setMobilePhone] = useState('');
  const [smsDispatched, setSmsDispatched] = useState(false);

  // Parse state from address string
  const detectState = (addr) => {
    if (!addr) return 'CA';
    const upper = addr.toUpperCase();
    for (const st of ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']) {
      // Look for state code surrounded by spaces or commas
      const regex = new RegExp(`(?:,\\s*|\\s+)${st}(?:\\s+|,|$)`);
      if (regex.test(upper)) return st;
    }
    return 'CA'; // fallback default
  };

  const handleStartAnalysis = (addressToAnalyze, priceOverride = null) => {
    const targetAddr = (addressToAnalyze || inputAddress).trim();
    if (!targetAddr) return;

    const detectedState = detectState(targetAddr);
    const isProhibited = PROHIBITED_REBATE_STATES.includes(detectedState);
    const estPrice = priceOverride || 1950000;
    
    // Financial calculations:
    // Total gross buyer-broker commission (approx 2.5%):
    const buyerBrokerComm = Math.round(estPrice * 0.025);
    // DysonRelo 40% Referral Fee Pool:
    const reloFeePool = Math.round(buyerBrokerComm * 0.40);
    // 50% credited back directly to Buyer's Escrow Closing Costs:
    const buyerRebateCredit = isProhibited ? 0 : Math.round(reloFeePool * 0.50);
    // 50% retained by DysonRelo corporate brokerage:
    const dysonRetained = reloFeePool - buyerRebateCredit;

    setActiveSession({
      address: targetAddr,
      state: detectedState,
      isProhibited,
      price: estPrice,
      buyerBrokerComm,
      reloFeePool,
      buyerRebateCredit,
      dysonRetained,
    });

    // Reset interaction steps
    setBaaStatus(null);
    setFinancingStatus(null);
    setTimeline(null);
    setSmsDispatched(false);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!mobilePhone.trim()) return;
    setSmsDispatched(true);
  };

  return (
    <div className="w-full text-center space-y-8 select-none">
      
      {/* ── 1. MINIMALIST HIGH-PRESTIGE HERO CANVAS ── */}
      <div className="max-w-4xl mx-auto space-y-5 px-4 pt-4 sm:pt-8">
        
        {/* Brand Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0a0a] border border-[#D4AF37]/70 text-[#D4AF37] text-[11px] font-black uppercase tracking-widest shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>DYSONHOMES COPILOT • HUMAN &amp; AI-ASSISTED</span>
        </div>

        {/* Main Headline */}
        <h1 
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0a0a0a] leading-[1.12]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Never Buy Unrepresented. <br />
          <span style={{ color: '#854d0e' }}>
            Get an Independent Fiduciary + Thousands Back at Closing.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#2a241b] max-w-2xl mx-auto font-medium leading-relaxed">
          Type an address, city, or tap the microphone to talk with Charlie. We vet the listing, assign your independent advocate, and credit up to 50% of our broker referral fee directly to your escrow closing costs.
        </p>

        {/* ── 2. CONVERSATIONAL SEARCH BAR (ADDRESS + CHARLIE MIC) ── */}
        <div className="max-w-2xl mx-auto pt-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleStartAnalysis(inputAddress);
            }}
            className="flex items-center rounded-2xl sm:rounded-full p-2 bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl transition-all"
          >
            <div className="flex items-center gap-2.5 flex-1 pl-3 sm:pl-4">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="Paste any address or city (e.g. 742 Vista Del Mar, La Jolla, CA)..."
                className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold outline-none placeholder:text-white/40"
              />
            </div>

            <div className="flex items-center gap-1.5 pr-1 shrink-0">
              {/* Integrated Charlie Microphone Button */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenVoice) onOpenVoice();
                  else navigate('/talking-app');
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-black border border-[#10b981]/60 text-[#10b981] hover:bg-[#10b981]/20 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Talk with Charlie (Voice AI Duplex Session)"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-black text-black bg-[#D4AF37] hover:brightness-110 active:scale-95 cursor-pointer shadow-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
              >
                Run Copilot
              </button>
            </div>
          </form>

          {/* Trust Microcopy */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#524436] font-medium pt-3">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span>100% Free &amp; Confidential. We never sell your data or expose you to cold calls from listing agents.</span>
          </div>

          {/* 1-Click Quick Samples */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
            <span className="text-[#0a0a0a]/60 text-[10.5px] font-bold uppercase tracking-wider mr-1">
              Test Sample:
            </span>
            {QUICK_PROPERTIES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputAddress(p.address);
                  handleStartAnalysis(p.address, p.price);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm truncate max-w-[240px] ${
                  activeSession?.address === p.address
                    ? 'bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]'
                    : 'bg-[#faf6ee] text-[#0a0a0a] border border-[#0a0a0a]/20 hover:border-[#D4AF37]'
                }`}
              >
                {p.address.split(',')[0]} (${(p.price / 1000000).toFixed(2)}M)
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── 3. FOCUSED CONVERSATIONAL CANVAS & REBATE PREVIEW ── */}
      {activeSession && (
        <div className="max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-5 sm:p-8 rounded-3xl bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl text-left space-y-6">
            
            {/* Header: Address & State Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  CHARLIE FIDUCIARY AUDIT REPORT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {activeSession.address}
                </h3>
              </div>

              {/* State Status Pill */}
              <div className="px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 bg-[#141414]">
                {activeSession.isProhibited ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">State: {activeSession.state} (Full Concierge Advocacy)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[#10b981]">State: {activeSession.state} (Rebate Authorized by Law)</span>
                  </>
                )}
              </div>
            </div>

            {/* Instant Rebate Calculation Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Estimated Home Value</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                  ${activeSession.price.toLocaleString()}
                </div>
                <span className="text-[10.5px] text-white/60">Approx. 2.5% buyer-broker fee: ${activeSession.buyerBrokerComm.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/50 space-y-1">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">40% Broker Referral Pool</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#D4AF37]">
                  ${activeSession.reloFeePool.toLocaleString()}
                </div>
                <span className="text-[10.5px] text-white/60">Pre-negotiated corporate referral fee</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#10b981]/50 space-y-1">
                <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                  {activeSession.isProhibited ? 'Full Closing Concierge' : 'Your Closing Escrow Rebate'}
                </span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#10b981]">
                  {activeSession.isProhibited ? 'Full Fiduciary' : `+$${activeSession.buyerRebateCredit.toLocaleString()}`}
                </div>
                <span className="text-[10.5px] text-white/60">
                  {activeSession.isProhibited 
                    ? 'State rules prohibit direct fee sharing; complete fiduciary concierge provided.' 
                    : 'Credited directly on your closing HUD-1 settlement.'}
                </span>
              </div>

            </div>

            {/* ── GUARDRAIL 1: THE BAA PRE-FLIGHT CHECK (PROTECTING AGAINST LAWSUITS) ── */}
            <div className="p-5 rounded-2xl bg-[#12100a] border border-[#D4AF37]/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  GUARDRAIL 1 · BAA PRE-FLIGHT QUALIFICATION (POST-NAR RULE COMPLIANCE)
                </span>
              </div>

              <p className="text-sm text-white/90 font-serif leading-relaxed italic">
                “Are you already bound by a signed exclusive representation agreement with another agent for this property?”
              </p>

              {baaStatus === null && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setBaaStatus('yes')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1f1912] hover:bg-[#2b2216] border border-amber-500/50 text-amber-300 transition-all cursor-pointer"
                  >
                    Yes, I have already signed with another agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaaStatus('no')}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#10b981] text-black hover:brightness-110 transition-all cursor-pointer shadow-md"
                  >
                    No, I am completely unrepresented for this home
                  </button>
                </div>
              )}

              {/* BAA Answer: YES */}
              {baaStatus === 'yes' && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2 animate-in fade-in">
                  <p className="font-semibold leading-relaxed">
                    “Under industry rules, we can't step between you and your signed agent. However, keep our number saved for any future properties or out-of-market moves.”
                  </p>
                  <div className="text-[11px] text-amber-300/80">
                    DysonRelo respects exclusive agency agreements and procures representations with full integrity.
                  </div>
                  <button
                    type="button"
                    onClick={() => setBaaStatus(null)}
                    className="text-[10.5px] text-[#D4AF37] underline hover:text-white"
                  >
                    Change answer
                  </button>
                </div>
              )}

              {/* BAA Answer: NO (CLEARED GREEN LIGHT) */}
              {baaStatus === 'no' && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-[#10b981]/50 text-emerald-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-[#10b981]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>“Terrific. Let's calculate your closing credit and assign your independent fiduciary.”</span>
                  </div>
                  <p className="text-white/80 text-[11.5px] leading-relaxed">
                    Zero procuring-cause dispute. You are fully eligible for unvarnished buyer representation and your 50% referral fee closing credit.
                  </p>
                </div>
              )}
            </div>

            {/* ── GUARDRAIL 2: THE AGENT VALUE EQUATION (FINANCING STATUS & TIMELINE) ── */}
            {baaStatus === 'no' && (
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    GUARDRAIL 2 · PURCHASING POWER &amp; TIMELINE CALIBRATION
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Financing Status */}
                  <div className="space-y-2">
                    <span className="text-white/70 font-semibold block">Financing Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'cash', label: 'Cash Buyer' },
                        { id: 'preapproved', label: 'Mortgage Pre-Approved' },
                        { id: 'planning', label: 'Planning to Finance' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFinancingStatus(f.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                            financingStatus === f.id
                              ? 'bg-[#D4AF37] text-black shadow-sm'
                              : 'bg-black text-white/70 hover:text-white border border-white/15'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Purchase Timeline */}
                  <div className="space-y-2">
                    <span className="text-white/70 font-semibold block">Purchase Timeline:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: '30_days', label: 'Ready in 30 Days' },
                        { id: '60_days', label: 'Ready in 60 Days' },
                        { id: 'browsing', label: 'Just Browsing' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTimeline(t.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                            timeline === t.id
                              ? 'bg-[#D4AF37] text-black shadow-sm'
                              : 'bg-black text-white/70 hover:text-white border border-white/15'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Vetted Agent Dispatch Preview Card */}
                {financingStatus && timeline && (
                  <div className="p-3.5 rounded-xl bg-black/70 border border-[#D4AF37]/50 space-y-1.5 text-xs animate-in fade-in">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                      OUTBOUND SMS DISPATCH PREVIEW TO VETTED AGENT
                    </span>
                    <div className="font-mono text-[11px] text-[#e8c84a] bg-[#111] p-2.5 rounded-lg border border-white/10 leading-relaxed">
                      “DysonRelo Fiduciary Match: {financingStatus === 'cash' ? 'Cash buyer' : financingStatus === 'preapproved' ? 'Pre-approved buyer' : 'Qualified financing'}, ready in {timeline === '30_days' ? '30 days' : timeline === '60_days' ? '60 days' : 'early stages'}, looking at {activeSession.address}. No existing BAA signed. Tap to accept 40% referral terms and receive client dossier.”
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. CONFIRMATION & TEXT BRIEF DELIVERY ── */}
            {baaStatus === 'no' && (
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#10b981]/40 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#10b981]" />
                    <span>Receive Official Fiduciary Match Brief &amp; Closing Credit Confirmation</span>
                  </h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    We will SMS you your official rebate certificate and the confidential comps dossier for this address.
                  </p>
                </div>

                {smsDispatched ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-[#10b981] text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>
                      Dispatched! Check your phone for your official Fiduciary Match Brief and ${activeSession.buyerRebateCredit.toLocaleString()} closing credit confirmation.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handlePhoneSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                    <input
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="Your mobile phone number..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs outline-none placeholder:text-white/40 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-black text-xs transition-all cursor-pointer shadow-md shrink-0"
                    >
                      Text My Brief
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Reset / Close Session */}
            <div className="text-right pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="text-xs text-white/50 hover:text-white underline cursor-pointer"
              >
                Close Audit &amp; Start Another Search
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}