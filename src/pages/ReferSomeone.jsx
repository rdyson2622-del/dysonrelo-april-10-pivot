import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, CheckCircle2, Loader2, ArrowLeft, Home, 
  Wrench, Star, MoreHorizontal, ShieldCheck, Phone, 
  Sparkles, X, Compass
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

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
  { value: 'relocation_client', label: 'Someone Relocating', icon: Home, subtitle: 'Moving buyer or seller' },
  { value: 'agent', label: 'A Real Estate Agent', icon: Star, subtitle: 'For our vetted network' },
  { value: 'vendor', label: 'A Vendor / Specialist', icon: Wrench, subtitle: 'Lender, mover, title, inspector' },
  { value: 'other', label: 'Something Else', icon: MoreHorizontal, subtitle: 'Custom partnership' },
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

  // Bulletproof Exit Handler
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
    <div className="min-h-screen relative text-[#0a0a0a] overflow-x-hidden" style={{ background: TAN_BG }}>
      
      {/* ========================================================
          STICKY TOP NAVIGATION BAR WITH PROMINENT EXIT & HOME
          Visible on both portrait & landscape at all times
          ======================================================== */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 bg-[#0a0a0a] text-white border-b border-[#D4AF37]/40 shadow-lg backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Studio / Portal Home Button */}
          <button
            type="button"
            onClick={handleHardHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            style={{
              background: '#151515',
              color: GOLD,
              border: `1.2px solid ${GOLD}`,
            }}
            title="Return to Studio Portal"
          >
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="tracking-wide">STUDIO PORTAL</span>
          </button>

          {/* Center Badge: Fiduciary Network */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Fiduciary Network · CA DRE #02303118</span>
          </div>

          {/* Right: Unmissable EXIT Button */}
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer hover:brightness-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
              color: '#000',
            }}
            title="Exit this page"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>EXIT</span>
            <X className="w-3.5 h-3.5 stroke-[3] ml-0.5" />
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================
            SUCCESS CONFIRMATION VIEW
            ======================================================== */}
        {done ? (
          <div className="max-w-xl mx-auto my-6 sm:my-12 p-6 sm:p-10 rounded-3xl bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 
                className="text-2xl sm:text-4xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Referral Received
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                Thank you for trusting Dyson &amp; Dyson. Bob Dyson and our senior fiduciary desk will personally review your referral for <strong className="text-[#D4AF37]">{form.referred_name}</strong> and reach out with white-glove care.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1.5 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-white/40">Referred:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{form.referred_name} ({form.referred_email})</span>
              </div>
              {form.destination_city && (
                <div className="flex justify-between">
                  <span className="text-white/40">Destination:</span>
                  <span className="font-semibold text-[#D4AF37]">{form.destination_city}, {form.destination_state}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/40">Fiduciary Desk:</span>
                <span className="text-[#10b981] font-semibold">Assigned for Audit</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setForm(EMPTY); setDone(false); }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-black transition-all shadow cursor-pointer hover:brightness-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Refer Another Contact
              </button>
              <button
                type="button"
                onClick={handleHardHome}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
              >
                Exit to Studio Portal
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
              ACTIVE REFERRAL FORM:
              - LANDSCAPE (md/lg): Dual-column editorial layout
              - PORTRAIT (mobile): Clean, uncluttered, simple single column
              ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: EDITORIAL EXPLAINER & FIDUCIARY PROMISE */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Fiduciary Concierge Introduction</span>
                </div>

                <h1 
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Refer Someone to DysonRelo
                </h1>

                <p className="text-xs sm:text-base font-semibold text-[#854d0e]">
                  {activeCopy.headline}
                </p>

                <p className="text-xs sm:text-sm text-[#44382c] leading-relaxed">
                  {activeCopy.subhead}
                </p>
              </div>

              {/* Fiduciary Pillars: visible on landscape, compact on mobile */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/40 shadow-lg space-y-2.5">
                  <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                    <span>How We Treat Your Referral:</span>
                  </div>

                  <ul className="space-y-2 text-xs text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      <span><strong>Zero Sales Pressure:</strong> We never sell lead contacts to generic broker pools.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      <span><strong>Fiduciary Agent Vetting:</strong> We audit local license history, volume, and reputation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      <span><strong>Executive Oversight:</strong> Bob Dyson monitors every milestone from first call to keys.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 border border-black/10 text-xs text-[#554433]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#854d0e]" />
                    <span>Direct Concierge Desk:</span>
                  </div>
                  <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                    (858) 353-1200
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REFINED REFERRAL FORM CARD */}
            <div className="lg:col-span-7">
              <div 
                className="rounded-3xl p-4 sm:p-7 md:p-8 bg-[#0a0a0a] text-white border-2 border-[#D4AF37]/70 shadow-2xl space-y-5 text-left"
                style={{
                  boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.3)',
                }}
              >
                {/* 1. Category Switcher */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    1. Who are you referring?
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map(({ value, label, icon: Icon }) => {
                      const active = form.referral_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('referral_type', value)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                            active
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md'
                              : 'bg-white/5 text-white/90 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-black' : 'text-[#D4AF37]'}`} />
                          <span className="text-xs sm:text-sm font-medium leading-tight">
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                      2. Their Contact Details
                    </label>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-white/60">Full Name *</span>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={form.referred_name}
                        onChange={e => set('referred_name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-white/60">Email Address *</span>
                      <input
                        required
                        type="email"
                        placeholder="sarah@example.com"
                        value={form.referred_email}
                        onChange={e => set('referred_email', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Company/Brokerage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-white/60">Phone Number (optional)</span>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={form.referred_phone}
                        onChange={e => set('referred_phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      />
                    </div>

                    {(form.referral_type === 'agent' || form.referral_type === 'vendor') ? (
                      <div className="space-y-1">
                        <span className="text-[11px] text-white/60">
                          {form.referral_type === 'agent' ? 'Brokerage Firm' : 'Company Name'}
                        </span>
                        <input
                          type="text"
                          placeholder={form.referral_type === 'agent' ? 'e.g. Compass, Sotheby\'s' : 'e.g. Apex Title, MovePro'}
                          value={form.referred_company}
                          onChange={e => set('referred_company', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[11px] text-white/60">Current City (optional)</span>
                        <input
                          type="text"
                          placeholder="e.g. San Jose, CA"
                          value={form.referred_company}
                          onChange={e => set('referred_company', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Destination City & State for Relocation Client */}
                  {isRelocationClient && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 space-y-1">
                        <span className="text-[11px] text-white/60">Destination Target City</span>
                        <input
                          type="text"
                          placeholder="e.g. Scottsdale or Austin"
                          value={form.destination_city}
                          onChange={e => set('destination_city', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-white/60">State</span>
                        <input
                          type="text"
                          placeholder="e.g. AZ"
                          maxLength={2}
                          value={form.destination_state}
                          onChange={e => set('destination_state', e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] uppercase transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Referrer Info */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                      3. Your Info (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={form.referrer_name}
                        onChange={e => set('referrer_name', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                      <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={form.referrer_email}
                        onChange={e => set('referrer_email', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>

                  {/* Notes / Special Circumstances */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-white/60">Notes or special circumstances (optional)</span>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking for homes near great schools, needs 1031 exchange guidance..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white/5 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] resize-none transition-all"
                    />
                  </div>

                  {/* Action Buttons: Submit & Explicit Exit */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-black flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
                        </>
                      )}
                    </button>

                    {/* Secondary Bottom Exit Button */}
                    <button
                      type="button"
                      onClick={handleExit}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Cancel &amp; Return to Studio Portal</span>
                    </button>

                    <p className="text-[10px] text-white/50 text-center">
                      Submissions are confidential and handled directly under CA DRE #02303118 fiduciary oversight.
                    </p>
                  </div>
                </form>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}