// BroadcastShow — public full-screen DNN Charlie Desk Studio hero.
// LOCKED: PRIMARY STILL ONLY (0f55cd52a_DNNStudioLandingPage.png).
// Full-bleed 16:9, object-contain, black background (NO white bars),
// NO scale>1, NO PiP box, NO code overlay, NO 56c7 MP4 as live hero.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const HERO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function BroadcastShow() {
  const navigate = useNavigate();
  const [content, setContent] = useState({ headline: 'Temporarily Under Construction', subheadline: 'Returning Soon', cta_label: '', cta_url: '' });

  useEffect(() => {
    base44.entities.EntryPortalContent.list().then(rows => {
      const rec = rows.find(r => r.is_live !== false);
      if (rec) setContent(rec);
    }).catch(() => {});
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: '#000', overflow: 'hidden' }}
    >
      {/* Close */}
      <button
        onClick={() => { window.location.href = '/'; }}
        aria-label="Close"
        className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}
      >
        <X className="w-6 h-6" />
      </button>

      {/* DNN bug */}
      <div
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}
      >
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          DNN Studio
        </span>
      </div>

      {/* LOCKED hero: PRIMARY STILL only, full-bleed contain on black */}
      <div className="absolute inset-0 z-10" style={{ background: '#000' }}>
        <img
          src={HERO_STILL}
          alt="DNN Charlie Desk Studio"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ background: '#000', transform: 'none' }}
        />
      </div>

      {/* Editable headline/subheadline/CTA — imposed over bottom of the studio image */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center gap-2 px-4"
        style={{ height: '16%' }}
      >
        <span
          className="text-2xl sm:text-4xl font-black tracking-[0.25em] uppercase text-center pointer-events-none"
          style={{ color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
        >
          {content.headline || 'Temporarily Under Construction'}
        </span>
        {content.subheadline && (
          <span className="text-sm sm:text-base font-medium text-center pointer-events-none" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            {content.subheadline}
          </span>
        )}
        {content.cta_label && content.cta_url && (
          <button
            onClick={() => navigate(content.cta_url)}
            className="mt-1 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all hover:scale-105 pointer-events-auto"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            {content.cta_label}
          </button>
        )}
      </div>
    </div>
  );
}