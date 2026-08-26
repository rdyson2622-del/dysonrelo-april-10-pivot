import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatInterface from '@/components/charlie/ChatInterface';
import PlanOfActionStrip from './PlanOfActionStrip';

const GOLD = '#D4AF37';

// Subject label for the Plan of Action strip, per page. Falls back to "This Page".
const SUBJECT_BY_PATH = {
  '/home': 'Your Relocation',
  '/dashboard': 'Your Dashboard',
  '/relocation-intake': 'Relocation Services',
  '/CityGuide': 'City Guide',
  '/city-guide': 'City Guide',
  '/real-estate-answers': 'Real Estate Answers',
  '/solve-my-story': 'Solve My Story',
  '/GeminiSession': 'Gemini Session',
  '/communications-explainer': 'Communications',
  '/master-show-sheet': 'My Roadmap',
  '/solutions': 'Solutions',
  '/roadmaps': 'Solutions',
};

/**
 * TalkToUsPill — shared, de-emphasized bottom-center "Talk to us" trigger.
 * Opens the SAME ChatInterface (brain/knowledge base) that FloatingCharlie uses —
 * only the trigger UI and position change. Pairs with a collapsed Plan of Action
 * roadmap strip stacked above it. Meant to be the one habit-forming widget used
 * across every portal, starting here on the Client portal.
 */
export default function TalkToUsPill() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const subject = SUBJECT_BY_PATH[location.pathname] || 'This Page';

  return (
    <>
      {/* Chat panel — anchored above the pill, bottom-center */}
      <AnimatePresence>
        {isOpen && !expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
            style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}
          >
            <ChatInterface
              onClose={() => setIsOpen(false)}
              expanded={false}
              onToggleExpand={() => setExpanded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded full-screen chat */}
      <AnimatePresence>
        {isOpen && expanded && (
          <ChatInterface
            expanded={true}
            onToggleExpand={() => setExpanded(false)}
            onClose={() => { setIsOpen(false); setExpanded(false); }}
          />
        )}
      </AnimatePresence>

      {/* Bottom-center dock: Plan of Action strip stacked above the pill */}
      {!expanded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <PlanOfActionStrip subject={subject} />
          <button
            onClick={() => setIsOpen(v => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, color: GOLD, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
          >
            {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            Talk to us
          </button>
        </div>
      )}
    </>
  );
}