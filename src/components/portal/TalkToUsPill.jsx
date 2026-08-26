import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import IssueRequestSolutionMap from '@/components/roadmap/IssueRequestSolutionMap';

const GOLD = '#D4AF37';

/**
 * TalkToUsPill — the one persistent, small "Talk to us" pill docked bottom-
 * center on every portal and every page (same idea as the fixed News/
 * Relocation/Intelligence/Transparency rail, just bottom-center instead of
 * top-right). Clicking it opens a compact panel where a visitor types their
 * question or issue; submitting it shows the answer AND a live roadmap of
 * the proposed milestones right there in the same panel — no separate chat
 * screen, no digging.
 */
export default function TalkToUsPill() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const context = location.pathname === '/corporate-relo' ? 'corporate_relo' : 'general';

  return (
    <>
      {/* Panel — anchored above the pill, bottom-center */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
            style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}
          >
            <IssueRequestSolutionMap context={context} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The pill itself — always there, bottom-center, small */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsOpen(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, color: GOLD, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
        >
          {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          Talk to us
        </button>
      </div>
    </>
  );
}