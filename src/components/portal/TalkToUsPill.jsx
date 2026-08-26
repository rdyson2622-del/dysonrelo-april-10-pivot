import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import IssueRequestSolutionMap from '@/components/roadmap/IssueRequestSolutionMap';
import { getTalkToUsPortal } from '@/lib/talkToUsPortals';

const GOLD = '#D4AF37';

/**
 * TalkToUsPill — the one persistent pill docked bottom-center on every
 * portal and every page. It never navigates the visitor away from what
 * they're doing — it's a floating panel over the current page, so they
 * never lose their place; the X closes it and they're exactly where they
 * were. Its label and the panel behind it are portal-aware: it reads which
 * portal the visitor is in (client, agent, vendor, HR, brokerage) so both
 * the copy and the LLM's response speak to the right audience.
 */
export default function TalkToUsPill() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [roleKey, setRoleKey] = useState(() => sessionStorage.getItem('dyson_role') || 'general');

  useEffect(() => {
    const onRoleChange = () => setRoleKey(sessionStorage.getItem('dyson_role') || 'general');
    window.addEventListener('dyson_role_change', onRoleChange);
    return () => window.removeEventListener('dyson_role_change', onRoleChange);
  }, []);

  // Corporate Relo is a public HR landing page — force that portal's voice
  // even if no role has been assigned in this session yet.
  const effectiveRole = location.pathname === '/corporate-relo' ? 'hr' : roleKey;
  const portal = getTalkToUsPortal(effectiveRole);

  return (
    <>
      {/* Panel — anchored above the pill, bottom-center, elongated so a
          visitor can see their own copy before sending it. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[440px] max-w-[calc(100vw-2rem)]"
            style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}
          >
            <div className="flex justify-end mb-1.5">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
              >
                <X className="w-3 h-3" /> Close — Back to Page
              </button>
            </div>
            <IssueRequestSolutionMap portalRole={effectiveRole} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The pill itself — always there, bottom-center, small, its label
          tailored to the portal the visitor is currently in. */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsOpen(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, color: GOLD, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
        >
          {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          {portal.pillLabel}
        </button>
      </div>
    </>
  );
}