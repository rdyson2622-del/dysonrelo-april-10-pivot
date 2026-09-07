import React, { useState, useEffect } from 'react';
import VoiceGreetingWidget from '@/components/portal/VoiceGreetingWidget';

const STORAGE_KEY = 'dyson_voice_greeted';

/**
 * FirstVisitVoiceGreeting — on a visitor's very first landing on /portal,
 * Charlie speaks first (V2V), then a right-side transcript drawer slides
 * out. Only ever fires once per browser.
 */
export default function FirstVisitVoiceGreeting() {
  const [open, setOpen] = useState(false);

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
  return <VoiceGreetingWidget onClose={() => setOpen(false)} />;
}