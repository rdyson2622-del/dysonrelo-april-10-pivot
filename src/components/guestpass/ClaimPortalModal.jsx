import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';
const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' };

/**
 * ClaimPortalModal — the "Progressive Profiling" claim flow. We already
 * have the agent's DRE#, phone, and email from the ListingProspect record;
 * all they add is a password. Register + verify email code, then convert
 * the preview into a permanent Relo Agent partner record and drop them
 * into the live portal.
 */
export default function ClaimPortalModal({ open, onClose, prospect, token }) {
  const [step, setStep] = useState('password'); // password | otp
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = prospect?.agent_email;

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError("We don't have an email on file for you yet — please text or call us to activate your portal.");
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not start your account. Please try again.');
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);

      await base44.functions.invoke('listingProspectPreview', { action: 'claim', token });
      await base44.auth.updateMe({ portal_role: 'agent' });

      sessionStorage.setItem('dyson_role', 'agent');
      localStorage.setItem('dyson_portal', JSON.stringify({ roleKey: 'agent', dest: '/find-agent' }));
      window.location.href = '/find-agent';
    } catch (err) {
      setError(err.message || 'Invalid verification code.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" style={{ background: '#161616', border: `1px solid ${GOLD}40` }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-base">
            {step === 'otp' ? <ShieldCheck className="w-4 h-4" style={{ color: GOLD }} /> : <Lock className="w-4 h-4" style={{ color: GOLD }} />}
            {step === 'otp' ? 'Verify Your Email' : 'Activate My Free Relo Portal'}
          </DialogTitle>
        </DialogHeader>

        {step === 'password' ? (
          <form onSubmit={handleSetPassword} className="space-y-3">
            <p className="text-sm text-white/70 leading-relaxed">
              We already have your DRE# and contact info on file. Set a secure password to claim your dashboard
              and start the vetting process for your {prospect?.listing_address ? <span style={{ color: GOLD }}>{prospect.listing_address}</span> : 'listing'} client.
            </p>
            {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm outline-none rounded-lg p-3 placeholder-stone-500"
              style={inputStyle}
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm outline-none rounded-lg p-3 placeholder-stone-500"
              style={inputStyle}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up…</> : 'Approve Partnership'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/70">We sent a code to {email}. Enter it below to activate your portal.</p>
            {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || otpCode.length < 6}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</> : 'Verify & Enter My Portal'}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}