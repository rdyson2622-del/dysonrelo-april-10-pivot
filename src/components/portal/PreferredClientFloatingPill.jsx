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
export default function PreferredClientFloatingPill({ engaged = false }) {
  const [isPreferred, setIsPreferred] = useState(() => !!getCheckedInUser()?.isPreferredClient);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const refresh = () => setIsPreferred(!!getCheckedInUser()?.isPreferredClient);
    window.addEventListener('dyson_copilot_contact_updated', refresh);
    return () => window.removeEventListener('dyson_copilot_contact_updated', refresh);
  }, []);

  // Engagement trigger: only reveal once the user has left the landing door
  // (asked something / picked a mode) or scrolled past the first section —
  // never block the screen on initial load.
  useEffect(() => {
    const content = document.getElementById('chief-pilot-content');
    if (!content) return;
    const onScroll = () => { if (content.scrollTop > 200) setScrolled(true); };
    content.addEventListener('scroll', onScroll);
    return () => content.removeEventListener('scroll', onScroll);
  }, []);

  if (isPreferred || !(engaged || scrolled)) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-bold shadow-lg transition-transform sm:w-auto sm:rounded-full sm:px-4 sm:py-2.5 sm:hover:scale-105"
          style={{ background: GOLD, color: '#0a0a0a', border: '1px solid rgba(0,0,0,0.15)' }}
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="sm:hidden">Preferred Client — Free</span>
          <span className="hidden sm:inline">Make Me a Preferred Client So I Can Save All My Data<br />At No Expense</span>
        </button>
      </div>
      <CopilotPreferredClientModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onClaimSuccess={() => setIsPreferred(true)}
      />
    </>
  );
}