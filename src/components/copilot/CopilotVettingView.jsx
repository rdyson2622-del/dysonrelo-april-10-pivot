import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, UserCheck, 
  Scale, MessageSquare, ArrowRight, FileText, Check,
  Lock, Phone, CheckCircle2, Shield, Clock, AlertCircle
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function CopilotVettingView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : '742 Vista Del Mar';

  // Gate lifecycle: 'browse' | 'gate' | 'confirmed'
  const [gateState, setGateState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('dyson_copilot_advisory_agreed') === 'true') {
          return 'confirmed';
        }
      } catch (_) {}
    }
    return 'browse';
  });

  const [hasNoExclusive, setHasNoExclusive] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const standards = [
    {
      title: 'Undivided Buyer Representation',
      desc: 'Ensuring your agent works exclusively for your interests, with no dual obligations to the property seller.',
      tag: 'Dedicated Loyalty'
    },
    {
      title: 'Local Sales Track Record',
      desc: 'Proven recent transaction history and pricing familiarity in the immediate neighborhood.',
      tag: 'Neighborhood Experience'
    },
    {
      title: 'Contingency & Deposit Diligence',
      desc: 'Careful guidance through inspection, appraisal, and financing milestones to safeguard your earnest money.',
      tag: 'Deposit Care'
    },
    {
      title: 'Clear, Transparent Terms',
      desc: 'A straightforward written agreement outlining services, broker compensation, and potential closing credits where permitted by law.',
      tag: 'Written Agreement'
    }
  ];

  const interviewQuestions = [
    {
      q: "Why do I need to confirm I am not under an exclusive agreement with another broker?",
      label: "Why Confirm Non-Exclusive?",
      asker: "charlie"
    },
    {
      q: "Does CoPilot act as my licensed agent or do we pair with a local agent?",
      label: "Are You My Agent?",
      asker: "bob"
    },
    {
      q: "Bob, what are the key differences between using the listing agent versus an independent buyer's agent?",
      label: "Representation Risks",
      asker: "bob"
    },
    {
      q: `Bob, what questions should I ask when interviewing local agents for ${shortAddr}?`,
      label: "Agent Interview Checklist",
      asker: "bob"
    }
  ];

  const handleAgreeAndSubmit = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    if (!hasNoExclusive) {
      setValidationError('Please confirm you are not currently under an exclusive representation agreement.');
      return;
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid mobile number so Bob Dyson’s desk can review your file.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const consentText = 'Client Advisory Agreement: Confirmed non-exclusive representation status. Authorized CoPilot to act as analytical and referral advisory partner under CA DRE #02303118.';

      // Persist to CopilotReportRequest (held status for human verification)
      await base44.entities.CopilotReportRequest.create({
        phone: cleanPhone,
        full_name: fullName.trim() || undefined,
        address: propertyAddress || '742 Vista Del Mar, La Jolla, CA',
        status: 'held',
        delivery_held: true,
        source: 'advisory_agreement_gate',
        requested_at: now,
        notes: `CLIENT ADVISORY AGREEMENT CONFIRMED. Non-exclusive representation certified by client for ${shortAddr}. Held for Bob Dyson team review.`
      }).catch(err => console.warn('Non-blocking report request create error:', err));

      // Record agreement locally
      try {
        localStorage.setItem('dyson_copilot_advisory_agreed', 'true');
        localStorage.setItem('dyson_copilot_client_name', fullName.trim());
      } catch (_) {}

      setGateState('confirmed');
    } catch (err) {
      console.warn('Advisory agreement error:', err);
      setGateState('confirmed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      
      {/* ── CARD 1: AGENT ADVISORY & PARTNERSHIP (MATCHES EXACT SCREENSHOT) ── */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              AGENT ADVISORY &amp; PARTNERSHIP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Independent Agent Selection
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            Guiding your search for dedicated buyer representation for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span>, equipped with independent market intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (gateState === 'confirmed') {
              onPromptClick?.("I would like to review my agent pairing status with Bob Dyson");
            } else {
              setGateState('gate');
            }
          }}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-200 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>{gateState === 'confirmed' ? 'Agent Status' : 'Connect with an Agent'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* ── CARD 2: OUR ROLE ALONGSIDE YOUR AGENT (MATCHES EXACT SCREENSHOT) ── */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#12120f] p-4 sm:p-5 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <FileText className="w-4 h-4 shrink-0 text-[#D4AF37]" />
          <h3 className="text-xs sm:text-[13px] font-bold tracking-wide">
            Our Role Alongside Your Agent: Supported by the Referral Agreement
          </h3>
        </div>
        <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed font-sans">
          CoPilot is not just a passive search tool, nor do we replace your licensed agent or make final transaction decisions. When you match with a top local specialist through Dyson, our formal <strong className="text-white font-medium">referral agreement</strong> establishes CoPilot as your ongoing intelligence partner. We remain actively involved throughout your purchase—providing second-opinion comps, contingency tracking, and strategic analysis alongside your agent, at zero additional cost to you.
        </p>
      </div>

      {/* ── 3-PART ONBOARDING GATE: THE ADVISORY AGREEMENT PANEL (UNFOLDS WHEN TRIGGERED) ── */}
      {gateState === 'gate' && (
        <div className="rounded-2xl border-2 border-[#D4AF37]/60 bg-[#141412] p-5 sm:p-6 space-y-4 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">
                  LEGAL &amp; OPERATIONAL FIREWALL
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Client Advisory Agreement
                </h3>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-mono font-bold">
              CA DRE #02303118
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-[13px] text-stone-300 leading-relaxed font-sans">
            <p>
              To protect your interests, uphold California Department of Real Estate compliance, and prevent tortious interference, CoPilot requires confirmation of representation status before deploying human broker resources or initiating custom agent pairing.
            </p>
          </div>

          {/* 1. The Process */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
              What CoPilot &amp; Bob Dyson's Desk Provide:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11.5px] text-stone-300 font-sans">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Unbiased comps &amp; hazard risk auditing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Pairing with independent local buyer agents</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Continuous oversight via referral agreement</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAgreeAndSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#1c1c1c] rounded-xl border border-white/15 focus:border-[#D4AF37] px-3.5 py-2 text-xs sm:text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-[#D4AF37] font-bold mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(858) 555-0199"
                  className="w-full bg-[#1c1c1c] rounded-xl border border-[#D4AF37]/50 focus:border-[#D4AF37] px-3.5 py-2 text-xs sm:text-sm text-white outline-none font-medium"
                />
              </div>
            </div>

            {/* 2. The Declaration (Mandatory Checkbox) */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasNoExclusive}
                  onChange={(e) => {
                    setHasNoExclusive(e.target.checked);
                    if (e.target.checked) setValidationError('');
                  }}
                  className="mt-1 w-4 h-4 rounded border-stone-600 bg-stone-900 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                />
                <span className="text-xs sm:text-[13px] text-white font-medium leading-relaxed font-sans">
                  <strong>Non-Exclusive Declaration:</strong> I confirm I am not currently under an exclusive listing or buyer representation agreement with another real estate broker.
                </span>
              </label>
            </div>

            {validationError && (
              <p className="text-rose-400 text-xs font-sans flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {/* 3. The Digital Acknowledgment */}
              <button
                type="submit"
                disabled={isSubmitting || !hasNoExclusive}
                className="w-full sm:flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#e8c84a] to-[#D4AF37] hover:brightness-110 disabled:opacity-40 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Recording Agreement...</span>
                ) : (
                  <>
                    <span>Authorize CoPilot Advisory Partnership</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGateState('browse')}
                className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── THE HUMAN INTERRUPTION: "PAUSE FOR BOB" (TRIGGERED POST-AGREEMENT) ── */}
      {gateState === 'confirmed' && (
        <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#14130d] p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Agreement Confirmed · Under Human Fiduciary Review
              </h3>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
              Reviewing File
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-[13px] text-stone-200 leading-relaxed font-sans">
            <p>
              Agreement received. <strong className="text-white">Bob Dyson and his team</strong> are now reviewing your property file for <span className="text-[#D4AF37] font-semibold">{shortAddr}</span>. A licensed team member will reach out shortly to confirm your specific goals before we initiate the deeper back-office protocol.
            </p>
            <p className="text-stone-400 text-xs">
              Under our structured referral agreement, our desk does not charge you a direct advisory fee; our ongoing analytics and coordination are structured through the cooperating broker split.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:8583531200"
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Bob Dyson Desk · (858) 353-1200</span>
            </a>

            <button
              type="button"
              onClick={() => onPromptClick?.(`Charlie, what are the next steps now that my advisory agreement is confirmed for ${shortAddr}?`)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ask Charlie Next Steps</span>
            </button>
          </div>
        </div>
      )}

      {/* ── CARD 3: KEY STANDARDS TO LOOK FOR IN A BUYER'S AGENT (MATCHES EXACT SCREENSHOT) ── */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Key Standards to Look for in a Buyer's Agent
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-sans">Advisory Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {standards.map((std, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0 stroke-[2.5]" />
                  <span>{std.title}</span>
                </h4>
                <span className="text-[10px] text-stone-400 bg-white/5 px-2.5 py-0.5 rounded-md font-sans">
                  {std.tag}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                {std.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARD 4: ADVISORY GUIDANCE (DUAL AGENCY VS INDEPENDENT REPRESENTATION) ── */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Scale className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Understanding Dual Agency vs. Independent Representation
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#161616] border border-white/5 space-y-2">
            <div className="text-stone-300 font-semibold text-xs flex items-center gap-1.5">
              <span>Working with the Listing Agent</span>
            </div>
            <ul className="space-y-1.5 text-stone-400 text-xs leading-relaxed">
              <li>• The listing agent owes existing contractual duties to the seller.</li>
              <li>• They cannot advocate exclusively for a lower price or concessions.</li>
              <li>• Negotiations on repairs and credits may be naturally constrained.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#161616] border border-[#D4AF37]/30 space-y-2">
            <div className="text-[#D4AF37] font-semibold text-xs flex items-center gap-1.5">
              <span>Independent Buyer Representation</span>
            </div>
            <ul className="space-y-1.5 text-stone-300 text-xs leading-relaxed">
              <li>• 100% undivided fiduciary commitment exclusively to you.</li>
              <li>• Rigorous comps analysis to test whether the asking price is justified.</li>
              <li>• CoPilot remains actively involved alongside your agent through closing.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── CARD 5: ADVISORY DIALOGUE PROMPTS ── */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <span className="text-xs text-stone-400 block font-medium">
          Ask Charlie &amp; Bob About Agent Selection &amp; Representation:
        </span>
        <div className="flex flex-wrap gap-2">
          {interviewQuestions.map((item, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => onPromptClick?.(item.q)}
              className="px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{item.label}</span>
              <span className="text-[10px] text-stone-500 font-mono">({item.asker})</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}