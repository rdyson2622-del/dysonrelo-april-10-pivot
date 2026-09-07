import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2 } from 'lucide-react';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';

const GOLD = '#D4AF37';
const STORAGE_KEY = 'dyson_voice_greeted';

/**
 * FirstVisitVoiceGreeting — on a visitor's very first landing on /portal,
 * slides out a small voice panel and has Charlie speak first (V2V), then
 * listens for a spoken reply. Only ever fires once per browser.
 */
export default function FirstVisitVoiceGreeting() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('ready');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, '1');
      setOpen(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed bottom-6 right-6 z-50 w-[320px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs font-black tracking-widest uppercase flex items-center gap-2" style={{ color: GOLD }}>
            <Volume2 className="w-4 h-4" /> Charlie · Voice Concierge
          </p>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-6 h-6 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] px-4 pt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          🎤 Charlie will speak first — allow microphone access if your browser asks. Needs a mic on desktop.
        </p>
        <div className="h-[280px]">
          <TalkingOrb
            status={status}
            setStatus={setStatus}
            onTranscript={() => {}}
            onSpeaker={() => {}}
            onSessionId={() => {}}
            autoStart
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}