import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, CheckCircle2, ArrowLeft, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import {
  normalizeEmail,
  normalizePhone,
  submitStopContact
} from '@/lib/copilotUnsubscribe';

export default function CopilotStopContact() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState({ email: '', phone: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlEmail = params.get('email');
    const urlPhone = params.get('phone');
    if (urlEmail) setEmail(urlEmail.trim());
    if (urlPhone) setPhone(urlPhone.trim());
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const normEmail = normalizeEmail(email);
    const normPhone = normalizePhone(phone);

    if (!normEmail && !normPhone) {
      setErrorMessage('Please provide either an email address or a phone number.');
      return;
    }

    if (normEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (normPhone && normPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    if (!isConfirmed) {
      setErrorMessage('Please check the confirmation box to confirm your request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitStopContact({
        email: normEmail || undefined,
        phone: normPhone || undefined,
        reason: reason.trim() || undefined,
        requestType: reason.toLowerCase().includes('complaint') ? 'marketing_complaint' : 'stop_contact',
        source: 'copilot_stop_contact'
      });

      setConfirmedDetails({ email: normEmail, phone: normPhone });
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err?.message || 'Could not process suppression request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Return to Copilot</span>
        </Link>
        <span className="text-[11px] text-stone-500 font-mono uppercase tracking-wider">
          Marketing Suppression
        </span>
      </header>

      {/* Main Form Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-10">
        <div className="rounded-2xl bg-[#121212] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Dyson &amp; Dyson Fiduciary Policy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Stop Contacting Me
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              We respect your boundaries and privacy. Tell us which email address or phone number to suppress from promotional and marketing outreach.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>We won't market-contact you</span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed pl-6">
                  {confirmedDetails.email && confirmedDetails.phone ? (
                    <>
                      <strong className="text-white">{confirmedDetails.email}</strong> and <strong className="text-white">{confirmedDetails.phone}</strong> have been marked with marketing suppressed.
                    </>
                  ) : confirmedDetails.email ? (
                    <>
                      <strong className="text-white">{confirmedDetails.email}</strong> has been marked with marketing suppressed.
                    </>
                  ) : (
                    <>
                      <strong className="text-white">{confirmedDetails.phone}</strong> has been marked with marketing suppressed.
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-stone-900/60 border border-white/10 p-4 text-xs text-stone-400 space-y-2">
                <p className="font-semibold text-stone-300">
                  Transactional / Support Notice:
                </p>
                <p className="leading-relaxed">
                  Transactional and support messages regarding an active transaction, legal disclosure requirement, or a direct inquiry you explicitly initiate with a broker specialist may still apply where permitted by law.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-semibold text-xs transition-all shadow-md"
                >
                  Return to DysonHomes Copilot
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                    setPhone('');
                    setReason('');
                    setIsConfirmed(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs border border-white/15 transition-all cursor-pointer"
                >
                  Submit another address or number
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-stone-400 text-xs leading-relaxed">
                Provide at least one contact method (email or phone). Both are optional individually, but at least one must be provided.
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="stop-email" className="block text-xs font-medium text-stone-300 font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-stone-500 font-normal normal-case text-[11px]">(optional if phone provided)</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    id="stop-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl bg-black/60 border border-white/20 pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label htmlFor="stop-phone" className="block text-xs font-medium text-stone-300 font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Phone Number</span>
                  <span className="text-stone-500 font-normal normal-case text-[11px]">(optional if email provided)</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    id="stop-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full rounded-xl bg-black/60 border border-white/20 pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Reason / Complaint Notes (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="stop-reason" className="block text-xs font-medium text-stone-300 font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Reason / Complaint Notes</span>
                  <span className="text-stone-500 font-normal normal-case text-[11px]">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    id="stop-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Let us know why you wish to stop contact or report an issue..."
                    className="w-full rounded-xl bg-black/60 border border-white/20 p-3 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300 leading-relaxed select-none">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-black text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>
                    I confirm that I want to stop receiving promotional communications and marketing messages from DysonHomes Copilot.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? 'Recording Request...' : 'Stop Contacting Me'}</span>
                </button>
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs text-center border border-white/15 transition-all"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-white/10">
                Your request is recorded immediately upon submission. No automated emails or SMS will be dispatched.
              </p>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full pt-6 border-t border-white/10 text-center text-xs text-stone-500">
        <p>The Dyson &amp; Dyson Companies, Inc. Ca. DRE #02303118</p>
      </footer>
    </div>
  );
}