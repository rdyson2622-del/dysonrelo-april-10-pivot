import React, { useState } from 'react';
import { 
  X, Phone, Mail, User, ShieldCheck, CheckCircle2, 
  Send, Sparkles, Lock, ArrowRight, Radio, Award
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import { fireLeadConversion } from '@/lib/googleAdsConversions';

export default function CopilotContactCaptureModal({
  isOpen,
  onClose,
  propertyAddress = '742 Vista Del Mar, La Jolla, CA',
  dossierSnapshot = null,
  mlsId = null,
  onCaptureSuccess
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digitsOnly = phone.replace(/[^\d+]/g, '');
    if (!digitsOnly || digitsOnly.replace(/\D/g, '').length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const normalizedEmail = email ? email.trim().toLowerCase() : '';
      const trimmedName = fullName ? fullName.trim() : '';
      const consentText = 'Free subscription for personal research and report storage. By entering your number, you agree to receive requested reports. Reply STOP anytime. We never sell personal data.';

      // 1. Persist to CopilotReportRequest (Held status, zero outbound sends)
      await base44.entities.CopilotReportRequest.create({
        phone: digitsOnly,
        email: normalizedEmail || undefined,
        full_name: trimmedName || undefined,
        address: propertyAddress,
        status: 'held',
        delivery_held: true,
        source: 'copilot_command_center',
        requested_at: now,
        notes: 'Direct mobile report request held pending concierge verification. Outbound delivery held.'
      });

      // 2. Upsert CopilotVisitor (match on normalized phone or email)
      let visitor = null;
      try {
        if (digitsOnly) {
          const byPhone = await base44.entities.CopilotVisitor.filter({ phone: digitsOnly }, '-created_date', 1);
          if (byPhone && byPhone.length > 0) {
            visitor = byPhone[0];
          }
        }
        if (!visitor && normalizedEmail) {
          const byEmail = await base44.entities.CopilotVisitor.filter({ email: normalizedEmail }, '-created_date', 1);
          if (byEmail && byEmail.length > 0) {
            visitor = byEmail[0];
          }
        }

        if (visitor) {
          await base44.entities.CopilotVisitor.update(visitor.id, {
            last_seen_at: now,
            consent_text: consentText,
            consent_at: now,
            ...(trimmedName && !visitor.name ? { name: trimmedName } : {}),
            ...(normalizedEmail && !visitor.email ? { email: normalizedEmail } : {}),
            ...(digitsOnly && !visitor.phone ? { phone: digitsOnly } : {})
          });
        } else {
          visitor = await base44.entities.CopilotVisitor.create({
            name: trimmedName || undefined,
            phone: digitsOnly || undefined,
            email: normalizedEmail || undefined,
            source: 'copilot',
            last_seen_at: now,
            consent_text: consentText,
            consent_at: now
          });
        }
      } catch (vErr) {
        console.warn('Visitor upsert non-blocking error:', vErr);
      }

      // 3. Create CopilotPropertyTouch
      try {
        const smallSnapshot = dossierSnapshot ? {
          shortAddress: dossierSnapshot.shortAddress || propertyAddress.split(',')[0],
          listPrice: dossierSnapshot.listPrice || null,
          compsSummary: dossierSnapshot.compsSummary ? String(dossierSnapshot.compsSummary).slice(0, 160) : null,
          risksSummary: dossierSnapshot.risksSummary ? String(dossierSnapshot.risksSummary).slice(0, 160) : null
        } : {
          address: propertyAddress
        };

        await base44.entities.CopilotPropertyTouch.create({
          visitor_id: visitor?.id || undefined,
          address: propertyAddress,
          mls_id: mlsId || undefined,
          dossier_snapshot_json: smallSnapshot,
          report_requested: true,
          created_at: now
        });
      } catch (tErr) {
        console.warn('Property touch non-blocking error:', tErr);
      }

      // Save checked-in contact identity so they are recognized up top upon return
      if (trimmedName || digitsOnly || normalizedEmail) {
        try {
          const { saveCheckedInContact } = await import('@/lib/copilotContactSession');
          saveCheckedInContact({
            name: trimmedName,
            phone: digitsOnly,
            email: normalizedEmail
          });
        } catch (_) {}
      }

      fireLeadConversion();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onCaptureSuccess?.({
          name: trimmedName || 'Verified Buyer',
          phone: digitsOnly,
          email: normalizedEmail || '',
          address: propertyAddress,
        });
        onClose();
      }, 2000);
    } catch (e) {
      console.error('Error submitting contact capture:', e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#0e0e0e] border border-[#D4AF37]/60 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden text-left relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37] via-[#f7e092] to-[#D4AF37]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                Report Request Recorded
              </h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                Your fiduciary property report request for <span className="text-[#D4AF37] font-semibold">{propertyAddress}</span> has been logged with our research desk. Delivery is queued for mobile verification.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs text-stone-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Zero obligation · No marketing spam · Fiduciary research</span>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <DysonVerticalBadge height={36} />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                    ZERO-PRESSURE AUDIT DELIVERY
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    NO FEE
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Text Me My Property Audit Report
                </h3>
                <p className="text-xs text-stone-300">
                  Instant mobile delivery for <span className="text-[#D4AF37] font-medium">{propertyAddress}</span>. No broker pressure to join.
                </p>
              </div>
            </div>

            {/* Value Highlights Pill */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Lender Compliance Discovery</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Geotechnical &amp; Bluff Risks</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Unvarnished Adjusted Comps</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <Radio className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>VIP Daily News &amp; Library Access</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="flex items-center bg-[#141414] rounded-xl border border-white/15 focus-within:border-[#D4AF37] px-3 py-2">
                    <User className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-[#D4AF37] font-bold mb-1 flex items-center justify-between">
                    <span>Mobile Phone Number *</span>
                    <span className="text-[9px] text-stone-400 font-normal">For direct text report</span>
                  </label>
                  <div className="flex items-center bg-[#141414] rounded-xl border border-[#D4AF37]/50 focus-within:border-[#D4AF37] px-3 py-2 shadow-inner">
                    <Phone className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(858) 555-0199"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="flex items-center bg-[#141414] rounded-xl border border-white/15 focus-within:border-[#D4AF37] px-3 py-2">
                    <Mail className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For daily video intelligence summary"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600"
                    />
                  </div>
                </div>
              </div>

              {/* Fair-Use & Privacy Notice */}
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[9px] text-stone-400 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 text-stone-300 font-semibold text-[9.5px]">
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  <span>Complimentary Subscription &amp; Fair Use Policy</span>
                </div>
                <p>
                  Free subscription for personal research and report storage. To preserve system performance for all subscribers, excessive or automated lookups may pause access until the next monthly cycle. By entering your number, you agree to receive your requested reports via SMS/email. Reply STOP anytime. We never sell personal data.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !phone.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#e8c84a] to-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Queuing Audit...</span>
                ) : (
                  <>
                    <span>Text Me My Report &amp; Unlock News</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-2.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-[9px] text-stone-500 font-mono">
          <span>Bob Dyson Principal Broker</span>
          <span>Zero Obligation · Free Service</span>
        </div>
      </div>
    </div>
  );
}