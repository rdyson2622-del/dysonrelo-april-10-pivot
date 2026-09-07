import React, { useState, useEffect } from 'react';
import VoiceGreetingWidget from '@/components/portal/VoiceGreetingWidget';
import { base44 } from '@/api/base44Client';

const VISITED_KEY = 'dyson_portal_visited';
const SESSION_SHOWN_KEY = 'dyson_voice_greeted_session';

/**
 * FirstVisitVoiceGreeting — on every landing on /portal (once per browser
 * tab session), Charlie speaks a welcome/welcome-back greeting out loud
 * automatically — no tap required for the greeting itself. Only the
 * two-way mic conversation still requires a tap ("Start Talking"), since
 * mobile browsers block microphone access without a real user gesture.
 */
export default function FirstVisitVoiceGreeting() {
  const [open, setOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [visitorName, setVisitorName] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_SHOWN_KEY)) return;
    const returning = !!localStorage.getItem(VISITED_KEY);
    localStorage.setItem(VISITED_KEY, '1');
    sessionStorage.setItem(SESSION_SHOWN_KEY, '1');
    base44.auth.me().then((u) => setVisitorName(u?.full_name?.split(' ')[0] || null)).catch(() => {});
    const t = setTimeout(() => {
      setIsReturning(returning);
      setOpen(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;
  return <VoiceGreetingWidget onClose={() => setOpen(false)} isReturning={isReturning} visitorName={visitorName} />;
}