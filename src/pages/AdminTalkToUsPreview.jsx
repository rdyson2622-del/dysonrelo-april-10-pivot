import React, { useState } from 'react';
import TalkToUsPill from '@/components/portal/TalkToUsPill';
import { TALK_TO_US_PORTALS } from '@/lib/talkToUsPortals';

const GOLD = '#D4AF37';

/**
 * AdminTalkToUsPreview — full page-size, real-time preview of the universal
 * "Talk to us" pill exactly as it appears on every portal page. Switch the
 * simulated portal below to see the pill's label, copy, and LLM audience
 * change per portal, without navigating away from admin.
 */
export default function AdminTalkToUsPreview() {
  const [roleKey, setRoleKey] = useState(() => sessionStorage.getItem('dyson_role') || 'general');

  const setRole = (key) => {
    sessionStorage.setItem('dyson_role', key);
    window.dispatchEvent(new Event('dyson_role_change'));
    setRoleKey(key);
  };

  return (
    <div className="min-h-screen p-10" style={{ background: '#0d0d0d' }}>
      <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
        Live Widget Preview
      </p>
      <h1 className="text-2xl font-bold text-white mb-3">"Talk to us" Pill</h1>
      <p className="text-sm max-w-xl mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
        This is the exact same pill docked bottom-center on every portal and every page.
        Switch the simulated portal below, then click the pill — its label, placeholder
        copy, and the audience the LLM is told about all change per portal.
      </p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(TALK_TO_US_PORTALS).map(key => (
          <button
            key={key}
            onClick={() => setRole(key)}
            className="px-3 py-1.5 rounded-full text-xs font-bold capitalize"
            style={{
              background: roleKey === key ? `${GOLD}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${roleKey === key ? GOLD : 'rgba(255,255,255,0.15)'}`,
              color: roleKey === key ? GOLD : 'rgba(255,255,255,0.6)',
            }}
          >
            {key.replace('_', ' ')}
          </button>
        ))}
      </div>

      <TalkToUsPill />
    </div>
  );
}