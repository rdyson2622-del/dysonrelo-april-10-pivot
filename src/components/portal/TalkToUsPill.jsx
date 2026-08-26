import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import IssueRequestSolutionMap from '@/components/roadmap/IssueRequestSolutionMap';
import { getTalkToUsPortal } from '@/lib/talkToUsPortals';

const GOLD = '#D4AF37';

/**
 * TalkToUsPill — the one persistent pill docked bottom-center on every
 * portal and every page. Clicking it (or "Communications" in the portal
 * sidebar) opens a full-height sidebar drawer on the right — a solid panel
 * docked to the edge, never layered over the center of the page the
 * visitor was reading. Closing it returns them exactly where they were;
 * nothing here ever navigates them away. The drawer's label and copy are
 * portal-aware: it reads which portal the visitor is in (client, agent,
 * vendor, HR, brokerage) so both the copy and the LLM's response speak to
 * the right audience.
 */
export default function TalkToUsPill() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [roleKey, setRoleKey] = useState(() => sessionStorage.getItem('dyson_role') || 'general');

  useEffect(() => {
    const onRoleChange = () => setRoleKey(sessionStorage.getItem('dyson_role') || 'general');
    const onOpenRequest = () => setIsOpen(true);
    window.addEventListener('dyson_role_change', onRoleChange);
    window.addEventListener('open_talk_to_us', onOpenRequest);
    return () => {
      window.removeEventListener('dyson_role_change', onRoleChange);
      window.removeEventListener('open_talk_to_us', onOpenRequest);
    };
  }, []);

  // Corporate Relo is a public HR landing page — force that portal's voice
  // even if no role has been assigned in this session yet.
  const effectiveRole = location.pathname === '/corporate-relo' ? 'hr' : roleKey;
  const portal = getTalkToUsPortal(effectiveRole);

  return (
    <>
      {/* Full-height drawer — docked to the right edge, solid background,
          so it never layers over the center of the page underneath it. */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[30vw] min-w-[320px] max-w-[90vw] flex flex-col"
              style={{ background: '#0d0d0d', borderRight: `1px solid ${GOLD}55`, boxShadow: '8px 0 30px rgba(0,0,0,0.5)' }}
            >
              <div className="shrink-0 flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                <p className="text-xs font-black tracking-widest uppercase flex items-center gap-2" style={{ color: GOLD }}>
                  <MessageCircle className="w-4 h-4" /> Communications
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
                >
                  <X className="w-3 h-3" /> Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <IssueRequestSolutionMap portalRole={effectiveRole} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* The pill itself — docked upper-left, right where the drawer slides
          out from, so it never fights with scrolling page copy. Its label
          is tailored to the portal the visitor is currently in. */}
      <div className="fixed top-20 left-6 z-50">
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