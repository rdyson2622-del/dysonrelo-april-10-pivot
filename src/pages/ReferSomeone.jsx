import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  { value: 'relocation_client', label: 'Client Relocating', sub: 'Buyer / Seller', icon: Home },
  { value: 'agent', label: 'Real Estate Agent', sub: 'Vetted Network', icon: Star },
  { value: 'vendor', label: 'Vendor / Partner', sub: 'Lender, Mover, Title', icon: Wrench },
  { value: 'other', label: 'Something Else', sub: 'Custom Introduction', icon: MoreHorizontal },
];

export default function ReferSomeone() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.referred_name.trim() && form.referred_email.trim();
  const isRelocationClient = form.referral_type === 'relocation_client';

  // Absolute foolproof exit: tries browser back first; if still on /refer, goes to portal
  const handleBack = () => {
    if (window.history && window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/portal');
    }
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
          STICKY TOP BAR — CLEAR EXIT & STUDIO BUTTONS (CANNOT BE TRAPPED)
          ======================================================== */}
      <header className="sticky top-0 z-50 px-3 sm:px-6 py-2.5 border-b border-[#0a0a0a]/15 bg-[#ede0cc]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back</span>
          </button>

          {/* Center Brand / Studio */}
          <Link
            to="/portal"
            className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#0a0a0a] hover:text-[#854d0e] transition-colors"
          >
            <Compass className="w-4 h-4 text-[#854d0e]" />
            <span className="hidden sm:inline">DysonRelo Studio</span>
            <span className="sm:hidden font-mono text-[11px]">DysonRelo</span>
          </Link>

          {/* Close / Exit to Portal */}
          <Link
            to="/portal"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-[#854d0e] text-white hover:bg-[#0a0a0a] transition-all shadow-sm active:scale-95"
            title="Close and return to Studio Portal"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </Link>

        </div>
      </header>

      {/* ========================================================
          MAIN VIEWPORT
          - PORTRAIT: Simple, proper, direct form with zero clutter
          - LANDSCAPE: Rich 2-column editorial concierge experience
          ======================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto py-5 sm:py-8 px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS CONFIRMATION */}
        {done ? (
          <div 
            className="max-w-lg mx-auto my-6 sm:my-12 p-6 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200"
            style={{ background: WARM_PAPER }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#10b981]/15 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Referral Received
              </h2>
              <p className="text-xs sm:text-sm text-[#44382c] max-w-md mx-auto leading-relaxed">
                Thank you. Bob Dyson and our senior fiduciary relocation desk will personally review your introduction for <strong className="text-[#854d0e]">{form.referred_name}</strong> and reach out with white-glove care.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 border border-black/10 text-xs text-[#44382c] space-y-1.5 text-left max-w-md mx-auto">
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
                <span className="text-[#0a0a0a]/50">Desk Review:</span>
                <span className="text-[#10b981] font-semibold">Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => { setForm(EMPTY); setDone(false); }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-black transition-all shadow cursor-pointer hover:brightness-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Refer Another Contact
              </button>
              <Link
                to="/portal"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-[#0a0a0a] bg-black/5 hover:bg-black/10 border border-black/15 transition-all text-center"
              >
                Exit to Studio
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================
              ACTIVE REFERRAL WORKSPACE
              ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* ----------------------------------------------------
                LANDSCAPE-ONLY COLUMN: FULL EDITORIAL INTRO
                (Hidden on mobile portrait to keep portrait proper and fast)
                ---------------------------------------------------- */}
            <div className="hidden lg:block lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Fiduciary Concierge Introduction</span>
                </div>

                <h1 
                  className="text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Refer Someone to DysonRelo
                </h1>

                <p className="text-base font-semibold text-[#854d0e]">
                  We Don't Sell Real Estate. We Vet &amp; Orchestrate.
                </p>

                <p className="text-sm text-[#44382c] leading-relaxed">
                  We represent your client, friend, or partner with an independent fiduciary shield across all 50 states — zero buyer fees, vetted local top agents, and complete peace of mind.
                </p>
              </div>

              {/* Fiduciary Pillars Card */}
              <div className="p-5 rounded-2xl border border-[#0a0a0a]/15 shadow-sm space-y-3" style={{ background: WARM_PAPER }}>
                <div className="text-xs font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>The Dyson Fiduciary Shield:</span>
                </div>

                <ul className="space-y-2 text-xs text-[#44382c] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>100% Free to Buyers &amp; Movers:</strong> We charge zero buyer fees. Compensation is handled independently.</span>
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
                    <span>Direct Concierge Desk:</span>
                  </div>
                  <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                    (858) 353-1200
                  </a>
                </div>
              </div>

              {/* Bob Dyson Quote */}
              <div className="italic text-xs text-[#554433] border-l-2 border-[#D4AF37] pl-3 py-1">
                "You are absolutely going to love our stressless Concierge Approach to transacting your real estate ventures."
                <span className="block font-sans not-italic font-bold text-[#0a0a0a] mt-1">— Bob Dyson</span>
              </div>
            </div>

            {/* ----------------------------------------------------
                FORM COLUMN (MOBILE-FIRST PROPER & SIMPLE)
                ---------------------------------------------------- */}
            <div className="w-full lg:col-span-7">
              
              {/* Mobile Header (Concise & Clean) */}
              <div className="lg:hidden text-left mb-4 space-y-1">
                <h1 
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Refer Someone
                </h1>
                <p className="text-xs text-[#554433]">
                  We'll take great care of them with independent fiduciary representation and zero buyer fees.
                </p>
              </div>

              {/* Main Form Card on Warm Paper */}
              <div 
                className="rounded-3xl p-4 sm:p-7 border border-[#0a0a0a]/15 shadow-lg space-y-4 text-left"
                style={{
                  background: WARM_PAPER,
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(212,175,55,0.2)',
                }}
              >
                
                {/* 1. Category Switcher */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#854d0e] block">
                    Who are you referring?
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map(({ value, label, sub, icon: Icon }) => {
                      const active = form.referral_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('referral_type', value)}
                          className={`flex items-start gap-2 p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer border ${
                            active
                              ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow font-bold'
                              : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/15 hover:border-[#D4AF37]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-[#D4AF37]' : 'text-[#854d0e]'}`} />
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm block font-bold leading-tight">
                              {label}
                            </span>
                            <span className={`text-[10px] block leading-tight mt-0.5 ${active ? 'text-white/70' : 'text-[#554433]'}`}>
                              {sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Referral Form */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#0a0a0a]/80">Their Full Name *</span>
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
                      <span className="text-[11px] font-bold text-[#0a0a0a]/80">Their Email Address *</span>
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

                  {/* Phone & Current City / Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#0a0a0a]/80">Their Phone (optional)</span>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={form.referred_phone}
                        onChange={e => set('referred_phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#0a0a0a]/80">
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

                  {/* Destination City & State (if relocating client) */}
                  {isRelocationClient && (
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="col-span-2 space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]/80">Destination City</span>
                        <input
                          type="text"
                          placeholder="e.g. Scottsdale or Austin"
                          value={form.destination_city}
                          onChange={e => set('destination_city', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]/80">State</span>
                        <input
                          type="text"
                          placeholder="AZ"
                          maxLength={2}
                          value={form.destination_state}
                          onChange={e => set('destination_state', e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] uppercase transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Referrer Info */}
                  <div className="pt-1.5 border-t border-[#0a0a0a]/10 space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#854d0e] block">
                      Your Info (Optional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

                  {/* Notes */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#0a0a0a]/80">Notes or context (optional)</span>
                    <textarea
                      rows={2}
                      placeholder="Special criteria, timeline, or circumstances..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] resize-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Buttons: Submit & Cancel */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="w-full py-3 px-6 rounded-full font-bold text-sm text-black flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Submitting Referral…</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 text-black" />
                          <span>Send Referral</span>
                          <ArrowRight className="w-4 h-4 text-black ml-0.5" />
                        </>
                      )}
                    </button>

                    {/* Exit Link */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-xs font-semibold text-[#554433] hover:text-[#0a0a0a] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Cancel &amp; Return to Previous Page</span>
                      </button>
                    </div>

                  </div>
                </form>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-3 border-t border-[#0a0a0a]/10 text-center text-[11px] text-[#554433]">
        The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118 · Independent Fiduciary Relocation Network
      </footer>

    </div>
  );
}