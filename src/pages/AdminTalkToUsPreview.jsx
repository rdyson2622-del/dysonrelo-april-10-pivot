import React from 'react';
import TalkToUsPill from '@/components/portal/TalkToUsPill';

const GOLD = '#D4AF37';

/**
 * AdminTalkToUsPreview — full page-size, real-time preview of the universal
 * "Talk to us" pill exactly as it appears on every portal page. Click it,
 * type a request, and watch the same answer + milestone roadmap a visitor
 * would see, without navigating away from admin.
 */
export default function AdminTalkToUsPreview() {
  return (
    <div className="min-h-screen p-10" style={{ background: '#0d0d0d' }}>
      <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
        Live Widget Preview
      </p>
      <h1 className="text-2xl font-bold text-white mb-3">"Talk to us" Pill</h1>
      <p className="text-sm max-w-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
        This is the exact same pill docked bottom-center on every portal and every page.
        Click it below, type a real estate request, and the panel shows the answer plus a
        live roadmap of the proposed milestones — right in place, no page change.
      </p>
      <TalkToUsPill />
    </div>
  );
}