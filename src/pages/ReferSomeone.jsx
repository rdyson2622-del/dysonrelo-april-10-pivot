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
const CARD_BG = '#f5ebd9';
const INPUT_BG = '#ffffff';

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
  { value: 'relocation_client', label: 'Someone Relocating', sub: 'Buyer / Seller', icon: Home },
  { value: 'agent', label: 'A Real Estate Agent', sub: 'Vetted Network', icon: Star },
  { value: 'vendor', label: 'A Vendor / Specialist', sub: 'Lender, Mover, Title', icon: Wrench },
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

  // Reliable, guaranteed exit
  const handleExit = () => {
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
          STICKY TOP NAVIGATION (TAN BACKGROUND)
          ======================================================== */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 border-b border-[#0a0a0a]/15 bg-[#ede0cc]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Return to Portal Button */}
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#0a0a0a] text-white hover:bg-[#1f1f1f] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Return to Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Return to Portal</span>
          </button>

          {/* DRE Credential */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#554433] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Dyson Fiduciary Network · CA DRE #02303118</span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#854d0e] text-white hover:bg-[#0a0a0a] transition-all cursor-pointer shadow-sm active:scale-95"
            title="Close this page"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>

        </div>
      </header>

      {/* ========================================================
          MAIN TAN VIEWPORT
          ======================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS STATE */}
        {done ? (
          <div 
            className="max-w-lg mx-auto my-8 p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-lg text-center space-y-6"
            style={{ background: CARD_BG }}
          >
            <div className="w-16 h-16 rounded-full bg-[#10b981]/15 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Referral Received
              </h2>
              <p className="text-sm text-[#44382c] max-w-md mx-auto leading-relaxed">
                Thank you. Bob Dyson and our senior fiduciary relocation desk will personally review your introduction for <strong className="text-[#854d0e]">{form.referred_name}</strong> and reach out with white-glove care.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#ede0cc] border border-[#0a0a0a]/15 text-xs text-[#44382c] space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#0a0a0a]/50">Referred:</span>
                <span className="font-semibold text-[#0a0a0a]">{form.referred_name} ({form.referred_email})</span>
              </div>
              {form.destination_city && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">Target Destination:</span>
                  <span className="font-semibold text-[#854d0e]">{form.destination_city}, {form.destination_state}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#0a0a0a]/50">Fiduciary Review:</span>
                <span className="text-[#10b981] font-semibold">Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setForm(EMPTY); setDone(false); }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-black transition-all shadow cursor-pointer hover:brightness-105"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Refer Another Contact
              </button>
              <button
                type="button"
                onClick={handleExit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-[#0a0a0a] bg-black/5 hover:bg-black/10 border border-black/15 transition-all cursor-pointer"
              >
                Return to Portal
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE REFERRAL FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: EDITORIAL FIDUCIARY INTRO */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Fiduciary Concierge Introduction</span>
                </div>

                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Refer Someone to DysonRelo
                </h1>

                <p className="text-base font-semibold text-[#854d0e]">
                  We'll Orchestrate Their Entire Move
                </p>

                <p className="text-xs sm:text-sm text-[#44382c] leading-relaxed">
                  We represent your client or friend with an independent fiduciary shield — zero buyer fees, vetted local top agents, and complete peace of mind.
                </p>
              </div>

              {/* HOW WE TREAT YOUR REFERRAL (TAN CARD, NOT BLACK!) */}
              <div 
                className="p-5 sm:p-6 rounded-3xl border-2 border-[#D4AF37]/60 shadow-md space-y-3.5"
                style={{ background: CARD_BG }}
              >
                <div className="text-xs font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>How We Treat Your Referral:</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#44382c] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>Zero Sales Pressure:</strong> We never blast or sell lead contacts to generic broker pools.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>Fiduciary Agent Vetting:</strong> We audit local license history, volume, and reputation before making any introduction.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5 stroke-[3]" />
                    <span><strong>Personal Executive Oversight:</strong> Bob Dyson's desk monitors every milestone from first call to keys.</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-[#0a0a0a]/15 flex items-center justify-between text-xs text-[#554433]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#854d0e]" />
                    <span>Direct Concierge Desk:</span>
                  </div>
                  <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                    (858) 353-1200
                  </a>
                </div>
              </div>

              {/* Quote */}
              <div className="hidden lg:block italic text-xs text-[#554433] border-l-2 border-[#D4AF37] pl-3 py-1">
                "You are absolutely going to love our stressless Concierge Approach to transacting your real estate ventures."
                <span className="block font-sans not-italic font-bold text-[#0a0a0a] mt-1">— Bob Dyson</span>
              </div>
            </div>

            {/* RIGHT COLUMN: THE REFERRAL FORM (WARM TAN CONTAINER, NOT BLACK!) */}
            <div className="w-full lg:col-span-7">
              <div 
                className="rounded-3xl p-5 sm:p-8 border-2 border-[#D4AF37]/40 shadow-xl space-y-6 text-left"
                style={{
                  background: CARD_BG,
                }}
              >
                
                {/* 1. WHO ARE YOU REFERRING? */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                    1. Who are you referring?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TYPES.map(({ value, label, sub, icon: Icon }) => {
                      const active = form.referral_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('referral_type', value)}
                          className={`flex items-start gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                            active
                              ? 'border-[#D4AF37] shadow-md'
                              : 'bg-white/80 text-[#0a0a0a] border-[#0a0a0a]/15 hover:border-[#D4AF37]'
                          }`}
                          style={{
                            background: active ? 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' : '#ffffff',
                            color: active ? '#000000' : '#0a0a0a',
                          }}
                        >
                          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-black' : 'text-[#854d0e]'}`} />
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm block font-bold leading-tight">
                              {label}
                            </span>
                            <span className={`text-[10px] block leading-tight mt-0.5 ${active ? 'text-black/80 font-medium' : 'text-[#554433]'}`}>
                              {sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. THEIR CONTACT DETAILS */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                      2. Their Contact Details
                    </label>

                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]">Full Name *</span>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Sarah Jenkins"
                          value={form.referred_name}
                          onChange={e => set('referred_name', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
                          style={{ background: INPUT_BG }}
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]">Email Address *</span>
                        <input
                          required
                          type="email"
                          placeholder="sarah@example.com"
                          value={form.referred_email}
                          onChange={e => set('referred_email', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
                          style={{ background: INPUT_BG }}
                        />
                      </div>
                    </div>

                    {/* Phone & Current City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]">Phone Number (optional)</span>
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={form.referred_phone}
                          onChange={e => set('referred_phone', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
                          style={{ background: INPUT_BG }}
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0a0a0a]">
                          {form.referral_type === 'agent' ? 'Brokerage Firm' : form.referral_type === 'vendor' ? 'Company Name' : 'Current City (optional)'}
                        </span>
                        <input
                          type="text"
                          placeholder={form.referral_type === 'agent' ? 'e.g. Compass, Sotheby\'s' : form.referral_type === 'vendor' ? 'e.g. Apex Title, MovePro' : 'e.g. San Jose, CA'}
                          value={form.referred_company}
                          onChange={e => set('referred_company', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
                          style={{ background: INPUT_BG }}
                        />
                      </div>
                    </div>

                    {/* Destination Target City & State (if relocating client) */}
                    {isRelocationClient && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <span className="text-[11px] font-bold text-[#0a0a0a]">Destination Target City</span>
                          <input
                            type="text"
                            placeholder="e.g. Scottsdale or Austin"
                            value={form.destination_city}
                            onChange={e => set('destination_city', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
                            style={{ background: INPUT_BG }}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-[#0a0a0a]">State</span>
                          <input
                            type="text"
                            placeholder="AZ"
                            maxLength={2}
                            value={form.destination_state}
                            onChange={e => set('destination_state', e.target.value.toUpperCase())}
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 uppercase transition-all shadow-sm"
                            style={{ background: INPUT_BG }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. YOUR INFO (OPTIONAL) */}
                  <div className="pt-2 border-t border-[#0a0a0a]/15 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#854d0e] block">
                      3. Your Info (Optional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={form.referrer_name}
                        onChange={e => set('referrer_name', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                        style={{ background: INPUT_BG }}
                      />
                      <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={form.referrer_email}
                        onChange={e => set('referrer_email', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                        style={{ background: INPUT_BG }}
                      />
                    </div>
                  </div>

                  {/* Notes / Special Circumstances */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#0a0a0a]">Notes or special circumstances (optional)</span>
                    <textarea
                      rows={3}
                      placeholder="e.g. Looking for homes near great schools, needs 1031 exchange guidance, prefers quiet neighborhood..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#0a0a0a]/20 text-[#0a0a0a] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37] resize-none transition-all shadow-sm"
                      style={{ background: INPUT_BG }}
                    />
                  </div>

                  {/* Submit and Cancel Actions */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-black flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleExit}
                        className="text-xs font-semibold text-[#554433] hover:text-[#0a0a0a] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Cancel &amp; Return to Portal</span>
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
      <footer className="py-4 border-t border-[#0a0a0a]/10 text-center text-xs text-[#554433]">
        The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118 · Independent Fiduciary Relocation Network
      </footer>

    </div>
  );
}