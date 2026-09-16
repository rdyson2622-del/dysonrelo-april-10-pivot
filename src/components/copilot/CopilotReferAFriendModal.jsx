import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, UserPlus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function CopilotReferAFriendModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setError('');
    setIsSubmitting(false);
    onClose();
    // Reset form shortly after closing
    setTimeout(() => {
      setIsSuccess(false);
      setFriendName('');
      setFriendEmail('');
      setFriendPhone('');
      setNotes('');
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = friendName.trim();
    if (!trimmedName) {
      setError('Please provide your friend’s name.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await base44.entities.CopilotReferral.create({
        friend_name: trimmedName,
        friend_email: friendEmail.trim() || undefined,
        friend_phone: friendPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        source: 'copilot_footer',
        referrer_name: user?.full_name || undefined,
        referrer_email: user?.email || undefined,
        status: 'received'
      });
      setIsSuccess(true);
    } catch (err) {
      console.warn('Referral submission error:', err);
      setError('Could not submit at this moment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md bg-[#111111] text-[#f5f5f5] rounded-2xl shadow-2xl border border-white/15 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="refer-friend-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#D4AF37]" />
            <h2 id="refer-friend-title" className="text-sm sm:text-base font-semibold text-white tracking-tight font-sans">
              Refer a Friend
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-[13px] font-sans">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Thank you</h3>
              <p className="text-stone-300 leading-relaxed text-xs max-w-xs mx-auto">
                We’ve received your referral note. Our fiduciary concierge team will keep this on file with care.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-stone-400 text-xs leading-relaxed">
                Connect someone exploring luxury or coastal real estate with independent fiduciary guidance.
              </p>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11.5px] font-medium text-stone-300 block">
                  Friend’s Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-stone-500 text-xs outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-medium text-stone-300 block">
                    Email <span className="text-stone-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-stone-500 text-xs outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-medium text-stone-300 block">
                    Phone <span className="text-stone-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-stone-500 text-xs outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11.5px] font-medium text-stone-300 block">
                  Short Note <span className="text-stone-500 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Target market, property type, or specific question..."
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-stone-500 text-xs outline-none focus:border-[#D4AF37] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-1.5 rounded-lg text-stone-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}