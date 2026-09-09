import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, CheckCircle2, Loader2, ArrowLeft, Home, 
  Wrench, Star, MoreHorizontal, ShieldCheck, Phone, 
  Sparkles, X, Compass, Check, ArrowRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const WARM_PAPER = '#faf6ee';

const EMPTY = {
  referral_type: 'relocation_client',
  referred_name: '',
  referred_email: '',
  referred_phone: '',
  referred_company: '',
  destination_city: '',
  destination_state: '',
  referrer_name: '',
  referrer_email: '',
  notes: '',
};

const TYPES = [
  { value: 'relocation_client', label: 'Someone Relocating', icon: Home, short: 'Client Move' },
  { value: 'agent', label: 'Real Estate Agent', icon: Star, short: 'Top Agent' },
  { value: 'vendor', label: 'Vendor / Specialist', icon: Wrench, short: 'Lender / Mover' },
  { value: 'other', label: 'Something Else', icon: MoreHorizontal, short: 'Partnership' },
];

const COPY = {
  relocation_client: { 
    headline: "We'll Orchestrate Their Entire Move", 
    subhead: "We represent your client or friend with an independent fiduciary shield — zero buyer fees, vetted local top agents, and complete peace of mind.",
  },
  agent: { 
    headline: "Recommend an Elite Agent", 
    subhead: "Know a top-tier producer with exceptional fiduciary integrity? We'll review their credentials for our national referral and partner network.",
  },
  vendor: { 
    headline: "Introduce a Relocation Specialist", 
    subhead: "Connect a proven lender, mover, title officer, or property inspector who provides high-touch luxury service.",
  },
  other: { 
    headline: "Share an Opportunity or Introduction", 
    subhead: "Tell us who they are and how we can best assist them.",
  },
};

export default function ReferSomeone() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.referred_name.trim() && form.referred_email.trim();
  const activeCopy = COPY[form.referral_type] || COPY.other;
  const isRelocationClient = form.referral_type === 'relocation_client';

  // Reliable navigation back to portal or home
  const handleExit = () => {
    if (window.history && window.history.length > 1) {
      navigate(-1);
      setTimeout(() => {
        if (window.location.pathname.includes('/refer')) {
          navigate('/portal');
        }
      }, 150);
    } else {
      navigate('/portal');
    }
  };

  const handleHardHome = () => {
    navigate('/portal');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    let referrer_role = null;
    try { referrer_role = sessionStorage.getItem('dyson_role') || null; } catch {}
    
    await base44.entities.ReferralLead.create({
      referral_type: form.referral_type,
      referred_name: form.referred_name.trim(),
      referred_email: form.referred_email.trim(),
      referred_phone: form.referred_phone.trim(),
      referred_company: form.referred_company.trim(),
      destination_city: isRelocationClient ? form.destination_city.trim() : '',
      destination_state: isRelocationClient ? form.destination_state.trim() : '',
      referrer_name: form.referrer_name.trim() || 'Anonymous',
      referrer_email: form.referrer_email.trim(),
      referrer_role,
      notes: form.notes.trim(),
      source: 'Referral Page',
      status: 'new',
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen text-[#0a0a0a] flex flex-col justify-between" style={{ background: TAN_BG }}>
      
      {/* ========================================================
          TOP NAVIGATION BAR (TAN BACKDROP THEMED)
          ======================================================== */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 border-b border-[#0a0a0a]/15 bg-[#ede0cc]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Studio Portal Return */}
          <button
            type="button"
            onClick={handleHardHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Return to Studio Portal"
          >
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="tracking-wide">STUDIO PORTAL</span>
          </button>

          {/* Fiduciary Credential Badge */}
          <div className="flex items-center gap-1.5 text-xs text-[#554433] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span className="hidden sm:inline font-mono">CA DRE #02303118 · Fiduciary Management</span>
            <span className="sm:hidden font-mono text-[11px]">DRE #02303118</span>
          </div>

          {/* Unmissable Exit Button */}
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37] hover:bg-[#151515] transition-all shadow-sm cursor-pointer active:scale-95"
            title="Exit this page"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>EXIT</span>
            <X className="w-3.5 h-3.5 stroke-[3] ml-0.5" />
          </button>

        </div>
      </header>

      {/* ========================================================
          MAIN VIEWPORT (RESPONSIVE: SIMPLE PORTRAIT / EDITORIAL LANDSCAPE)
          ======================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS CONFIRMATION VIEW */}
        {done ? (
          <div 
            className="max-w-xl mx-auto my-6 sm:my-12 p-6 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200"
            style={{ background: WARM_PAPER }}
          >
            <div className="w-16 h-16 rounded-full bg-[#10b981]/15 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 
                className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Referral Received
              </h2>
              <p className="text-xs sm:text-sm text-[#44382c] max-w-md mx-auto leading-relaxed">
                Thank you for trusting Dyson &amp; Dyson. Bob Dyson and our senior fiduciary desk will personally review your introduction for <strong className="text-[#854d0e]">{form.referred_name}</strong> and reach out with white-glove care.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 border border-black/10 text-xs text-[#44382c] space-y-1.5 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#0a0a0a]/50">Referred:</span>
                <span className="font-semibold text-[#0a0a0a] truncate max-w-[200px]">{form.referred_name} ({form.referred_email})</span>
              </div>
              {form.destination_city && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">Destination:</span>
                  <span className="font-semibold text-[#854d0e]">{form.destination_city}, {form.destination_state}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#0a0a0a]/50">Fiduciary Desk:</span>
                <span className="text-[#10b981] font-semibold">Assigned for Audit</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setForm(EMPTY); setDone(false); }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-black transition-all shadow cursor-pointer hover:brightness-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Refer Another Contact
              </button>
              <button
                type="button"
                onClick={handleHardHome}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-[#0a0a0a] bg-black/5 hover:bg-black/10 border border-black/15 transition-all cursor-pointer"
              >
                Exit to Studio Portal
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
              ACTIVE REFERRAL FORM:
              - PORTRAIT (mobile): Clean, uncluttered, simple single column
              - LANDSCAPE (desktop/tablet): Dual-column editorial layout
              ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ----------------------------------------------------
                COLUMN 1: EDITORIAL & FIDUCIARY INTRO
                (Hidden or simplified on mobile portrait, rich on landscape)
                ---------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
              
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Fiduciary Concierge Introduction</span>
                </div>

                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Refer Someone to DysonRelo
                </h1>

                <p className="text-sm sm:text-base font-semibold text-[#854d0e]">
                  {activeCopy.headline}
                </p>

                <p className="text-xs sm:text-sm text-[#44382c] leading-relaxed">
                  {activeCopy.subhead}
                </p>
              </div>

              {/* Landscape Fiduciary Pillars Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#0a0a0a]/15 shadow-sm space-y-3" style={{ background: WARM_PAPER }}>
                <div className="text-xs font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>The Dyson Fiduciary Shield:</span>
                </div>

                <ul className="space-y-2 text-xs text-[#44382c] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>100% Free to Buyers &amp; Movers:</strong> We charge zero buyer fees. Our compensation is handled independently.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>No Generic Agent Pools:</strong> We never sell contacts. We independently audit local agent sales and interview candidates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>Executive Oversight:</strong> Bob Dyson personally tracks every milestone from initial search to closing.</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-[#0a0a0a]/10 flex items-center justify-between text-xs text-[#554433]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#854d0e]" />
                    <span>Fiduciary Desk:</span>
                  </div>
                  <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                    (858) 353-1200
                  </a>
                </div>
              </div>

              {/* Direct Quote */}
              <div className="hidden lg:block italic text-xs text-[#554433] border-l-2 border-[#D4AF37] pl-3 py-1">
                "You are absolutely going to love our stressless Concierge Approach to transacting your real estate ventures."
                <span className="block font-sans not-italic font-bold text-[#0a0a0a] mt-1">— Bob Dyson</span>
              </div>

            </div>

            {/* ----------------------------------------------------
                COLUMN 2: CLEAN, CRISP FORM CARD ON WARM PAPER
                (Proper & simple for portrait, polished for landscape)
                ---------------------------------------------------- */}
            <div className="lg:col-span-7">
              <div 
                className="rounded-3xl p-5 sm:p-7 md:p-8 border border-[#0a0a0a]/15 shadow-xl space-y-5 text-left"
                style={{
                  background: WARM_PAPER,
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(212,175,55,0.25)',
                }}
              >
                
                {/* 1. Category Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                      Who Are You Referring?
                    </label>
                    <span className="text-[11px] text-[#554433] hidden sm:inline">Select category</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map(({ value, label, icon: Icon, short }) => {
                      const active = form.referral_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('referral_type', value)}
                          className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                            active
                              ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-md font-bold'
                              : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/15 hover:border-[#D4AF37]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#D4AF37]' : 'text-[#854d0e]'}`} />
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm block leading-tight font-semibold truncate">
                              {label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Referral Details Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                      Contact Details
                    </label>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#0a0a0a]/80">Their Full Name *</span>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={form.referred_name}
                        onChange={e => set('referred_name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#0a0a0a]/80">Their Email Address *</span>
                      <input
                        required
                        type="email"
                        placeholder="sarah@example.com"
                        value={form.referred_email}
                        onChange={e => set('referred_email', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone & Company/Current City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#0a0a0a]/80">Phone Number (optional)</span>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={form.referred_phone}
                        onChange={e => set('referred_phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#0a0a0a]/80">
                        {form.referral_type === 'agent' ? 'Brokerage Firm' : form.referral_type === 'vendor' ? 'Company Name' : 'Current City (optional)'}
                      </span>
                      <input
                        type="text"
                        placeholder={form.referral_type === 'agent' ? 'e.g. Compass, Sotheby\'s' : form.referral_type === 'vendor' ? 'e.g. Apex Title, MovePro' : 'e.g. Los Gatos, CA'}
                        value={form.referred_company}
                        onChange={e => set('referred_company', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Destination City & State for Relocation Client */}
                  {isRelocationClient && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 space-y-1">
                        <span className="text-xs font-semibold text-[#0a0a0a]/80">Destination Target City</span>
                        <input
                          type="text"
                          placeholder="e.g. Scottsdale or Austin"
                          value={form.destination_city}
                          onChange={e => set('destination_city', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#0a0a0a]/80">State</span>
                        <input
                          type="text"
                          placeholder="e.g. AZ"
                          maxLength={2}
                          value={form.destination_state}
                          onChange={e => set('destination_state', e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] uppercase transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Referrer Info */}
                  <div className="pt-2 border-t border-[#0a0a0a]/10 space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                      Your Info (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={form.referrer_name}
                        onChange={e => set('referrer_name', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                      />
                      <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={form.referrer_email}
                        onChange={e => set('referrer_email', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Notes / Special Circumstances */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#0a0a0a]/80">Notes or special circumstances (optional)</span>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking for homes near great schools, needs 1031 exchange guidance..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] resize-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Action Buttons: Submit & Cancel */}
                  <div className="pt-3 space-y-2.5">
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-black flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Routing Referral to Fiduciary Desk…</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 text-black" />
                          <span>Submit Referral to Bob Dyson Desk</span>
                          <ArrowRight className="w-4 h-4 text-black ml-1" />
                        </>
                      )}
                    </button>

                    {/* Secondary Bottom Exit Button */}
                    <button
                      type="button"
                      onClick={handleExit}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#554433] hover:text-[#0a0a0a] bg-black/5 hover:bg-black/10 border border-black/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#854d0e]" />
                      <span>Cancel &amp; Return to Studio Portal</span>
                    </button>

                    <p className="text-[11px] text-[#554433] text-center pt-1">
                      All introductions are handled confidentially under California DRE #02303118 fiduciary oversight.
                    </p>
                  </div>
                </form>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Simple Footer */}
      <footer className="py-4 border-t border-[#0a0a0a]/10 text-center text-xs text-[#554433]">
        The Dyson &amp; Dyson Companies, Inc. · Independent Relocation Concierge &amp; Fiduciary Network
      </footer>

    </div>
  );
}