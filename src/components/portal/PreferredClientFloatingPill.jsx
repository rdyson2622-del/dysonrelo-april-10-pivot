import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getCheckedInUser } from '@/lib/copilotContactSession';
import CopilotPreferredClientModal from '@/components/copilot/CopilotPreferredClientModal';

const GOLD = '#D4AF37';

/**
 * PreferredClientFloatingPill — persistent bottom-right CTA on every AppLayout
 * page inviting visitors to become a Preferred Client (no expense, no password).
 * Hides itself once the visitor is already recognized as a Preferred Client.
 */
export default function PreferredClientFloatingPill() {
  const [isPreferred, setIsPreferred] = useState(() => !!getCheckedInUser()?.isPreferredClient);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setIsPreferred(!!getCheckedInUser()?.isPreferredClient);
    window.addEventListener('dyson_copilot_contact_updated', refresh);
    return () => window.removeEventListener('dyson_copilot_contact_updated', refresh);
  }, []);

  if (isPreferred) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-lg transition-transform hover:scale-105"
        style={{ background: GOLD, color: '#0a0a0a', border: '1px solid rgba(0,0,0,0.15)' }}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <span>Make Me a Preferred Client So I Can Save All My Data<br />At No Expense</span>
      </button>
      <CopilotPreferredClientModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onClaimSuccess={() => setIsPreferred(true)}
      />
    </>
  );
}