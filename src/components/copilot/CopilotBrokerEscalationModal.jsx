import React, { useState } from 'react';
import { 
  X, Phone, Mail, User, ShieldCheck, CheckCircle2, 
  ArrowRight, Lock, MessageSquare, AlertCircle
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

export default function CopilotBrokerEscalationModal({
  isOpen,
  onClose,
  initialQuestion = '',
  propertyAddress = '',
  onEscalationSuccess
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState(initialQuestion);
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
      const trimmedName = fullName.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // Create record in CharlieEscalation
      await base44.entities.CharlieEscalation.create({
        consumer_question: notes || initialQuestion || 'Requested direct broker consultation',
        consumer_name: trimmedName || undefined,
        consumer_email: trimmedEmail || undefined,
        handoff_response: "Flagged for Bob Dyson's immediate structural & transaction review.",
        status: 'open',
        priority: 'urgent',
        page_context: propertyAddress ? `Copilot Command Center - ${propertyAddress}` : 'Copilot Command Center',
        notifications_sent: {
          sms: true,
          email: true,
          dashboard: true
        }
      });

      // Also record in CopilotReportRequest if property is attached
      if (propertyAddress) {
        try {
          await base44.entities.CopilotReportRequest.create({
            phone: digitsOnly,
            email: trimmedEmail || undefined,
            full_name: trimmedName || undefined,
            address: propertyAddress,
            status: 'held',
            delivery_held: true,
            source: 'copilot_broker_escalation',
            requested_at: now,
            notes: `Priority callback flagged for Bob Dyson: ${notes || initialQuestion}`
          });
        } catch (_) {}
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onEscalationSuccess?.({
          name: trimmedName || 'Client',
          phone: digitsOnly,
          email: trimmedEmail,
          question: notes || initialQuestion
        });
        onClose();
      }, 2000);
    } catch (err) {
      console.warn('Failed to record escalation:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#0e0e0e] border border-[#D4AF37]/60 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden text-left relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Bar */}
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
                Callback Request Received
              </h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                Bob Dyson has been notified of your inquiry regarding <span className="text-[#D4AF37] font-semibold">{propertyAddress || 'your transaction'}</span>. Our principal desk will connect with you promptly.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs text-stone-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct broker review · No sales pressure · Fiduciary oversight</span>
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
                    PRINCIPAL BROKER REVIEW
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                    PRIORITY
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Connect with Bob Dyson
                </h3>
                <p className="text-xs text-stone-300">
                  Request a direct second-opinion review on legal disclosures, offer terms, or escrow risks.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">
                    Your Name
                  </label>
                  <div className="flex items-center bg-[#141414] rounded-xl border border-white/15 focus-within:border-[#D4AF37] px-3 py-2">
                    <User className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-[#D4AF37] font-bold mb-1 flex items-center justify-between">
                    <span>Mobile Phone Number *</span>
                    <span className="text-[9px] text-stone-400 font-normal">For direct broker call</span>
                  </label>
                  <div className="flex items-center bg-[#141414] rounded-xl border border-[#D4AF37]/50 focus-within:border-[#D4AF37] px-3 py-2 shadow-inner">
                    <Phone className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(858) 353-1200"
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
                      placeholder="For document summaries"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-1">
                    Question or Property Note
                  </label>
                  <div className="flex items-start bg-[#141414] rounded-xl border border-white/15 focus-within:border-[#D4AF37] px-3 py-2">
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe the issue (contingency, title cloud, dual agency concern)..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-stone-600 resize-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Call Affordance */}
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">Need immediate assistance?</span>
                <a
                  href="tel:8583531200"
                  className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1 text-[11.5px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call (858) 353-1200</span>
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !phone.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#e8c84a] to-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Notifying Bob Dyson...</span>
                ) : (
                  <>
                    <span>Submit Priority Callback Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-2.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-[9px] text-stone-500 font-mono">
          <span>The Dyson &amp; Dyson Companies · CA DRE #02303118</span>
          <span>Fiduciary Escalation</span>
        </div>
      </div>
    </div>
  );
}