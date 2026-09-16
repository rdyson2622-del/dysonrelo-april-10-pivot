import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import {
  normalizeEmail,
  findUnsubscribeRecordByToken,
  submitUnsubscribe
} from '@/lib/copilotUnsubscribe';

export default function CopilotUnsubscribe() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [tokenRecord, setTokenRecord] = useState(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');

    if (urlEmail) {
      setEmail(urlEmail.trim());
    }

    if (urlToken) {
      setToken(urlToken.trim());
      setIsLoadingToken(true);
      findUnsubscribeRecordByToken(urlToken.trim())
        .then((record) => {
          if (record) {
            setTokenRecord(record);
            if (record.email && !urlEmail) {
              setEmail(record.email);
            }
            if (record.marketing_suppressed) {
              setIsSuccess(true);
              setConfirmedEmail(record.email);
            }
          }
        })
        .finally(() => {
          setIsLoadingToken(false);
        });
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const normalized = normalizeEmail(email);

    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (tokenRecord && tokenRecord.email && normalizeEmail(tokenRecord.email) !== normalized) {
      const confirmChange = window.confirm(
        `This unsubscribe link was addressed to ${tokenRecord.email}. Would you like to unsubscribe ${normalized} instead?`
      );
      if (!confirmChange) return;
    }

    setIsSubmitting(true);
    try {
      await submitUnsubscribe({
        email: normalized,
        token: token || undefined,
        source: token ? 'email_token_link' : 'copilot_footer'
      });
      setConfirmedEmail(normalized);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err?.message || 'Could not process unsubscribe request. Please try again.');
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
          Email Preferences
        </span>
      </header>

      {/* Main Content Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-12">
        <div className="rounded-2xl bg-[#121212] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Dyson &amp; Dyson Fiduciary Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Manage Communications
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              We respect your inbox. You can unsubscribe from all promotional broadcasts and marketing updates below at any time.
            </p>
          </div>

          {isLoadingToken ? (
            <div className="py-8 text-center text-stone-400 text-xs font-mono">
              Verifying unsubscribe token...
            </div>
          ) : isSuccess ? (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Marketing communications successfully suppressed</span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed pl-6">
                  <strong className="text-white">{confirmedEmail}</strong> has been removed from all marketing campaigns, market newsletters, and promotional announcements.
                </p>
              </div>

              <div className="rounded-xl bg-stone-900/60 border border-white/10 p-4 text-xs text-stone-400 space-y-2">
                <p className="font-semibold text-stone-300">
                  Transactional Notice:
                </p>
                <p className="leading-relaxed">
                  Critical transactional messages regarding active property purchase agreements, escrow milestones, or direct inquiries you explicitly initiate with a broker specialist may still apply where required by law.
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
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs border border-white/15 transition-all"
                >
                  Unsubscribe a different address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="unsub-email" className="block text-xs font-medium text-stone-300 font-mono uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    id="unsub-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl bg-black/60 border border-white/20 pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-lg p-2.5">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'Suppressing...' : 'Confirm Unsubscribe'}
                </button>
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs text-center border border-white/15 transition-all"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-white/10">
                Submitting this form immediately marks your record with marketing_suppressed=true. No further marketing emails will be sent.
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