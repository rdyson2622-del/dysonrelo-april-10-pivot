import React, { useState } from 'react';
import { Shield, Sparkles, X, CheckCircle2, Lock } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import { claimPreferredClient, saveToClientVault } from '@/lib/copilotContactSession';

export default function CopilotPreferredClientModal({
  isOpen,
  onClose,
  pendingItem = null, // Optional discussion/report waiting to be saved
  onClaimSuccess = null
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg('Please provide a mobile number or email to link your private vault.');
      return;
    }

    setIsSubmitting(true);
    try {
      const client = await claimPreferredClient({ name, phone, email });

      // If there was an item waiting to be saved, seamlessly save it now
      if (pendingItem) {
        await saveToClientVault({
          title: pendingItem.title || 'Saved Discussion',
          item_type: pendingItem.item_type || 'discussion',
          address: pendingItem.propertyAddress || '',
          notes: pendingItem.notes || '',
          payload: pendingItem.payload || { messages: pendingItem.messages || [] },
          clientUser: client
        });
      }

      setIsSuccess(true);
      if (onClaimSuccess) onClaimSuccess(client);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    } catch (err) {
      setErrorMsg('Unable to link private vault right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#111111] border border-[#D4AF37]/50 rounded-2xl shadow-2xl p-6 sm:p-7 relative text-left"
        onClick={(e) => e.stopPropagation()}
        style={{ color: '#F3F0E6' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Preferred Client Status Activated
              </h3>
              <p className="text-xs text-stone-300 font-sans">
                Saved to your Private Vault. Your files are now accessible across sessions.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3">
              <DysonVerticalBadge height={32} />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                    PRIVATE CLIENT VAULT
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                  Claim Preferred Client Status
                </h2>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              To securely save discussions, property audits, and fiduciary second-look comps to your personal vault, link your preferred profile below. No passwords, no sales calls.
            </p>

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-medium text-stone-300 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-300 block mb-1">
                  Mobile Number <span className="text-stone-500">(For private vault linking)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(619) 555-0142"
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-300 block mb-1">
                  Email Address <span className="text-stone-500">(Optional backup)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Linking Private Vault...' : 'Activate Preferred Client Vault →'}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  <span>Strictly confidential · The Dyson and Dyson Companies, Inc. · CA DRE #02303118</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}