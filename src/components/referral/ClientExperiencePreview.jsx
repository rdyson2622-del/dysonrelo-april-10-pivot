import React from 'react';
import { Compass, MapPin, Radio, ShieldCheck, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

const FEATURES = [
  { icon: Compass, label: 'A personal relocation roadmap they can follow step by step' },
  { icon: MapPin, label: 'A vetted destination agent matched to their new city' },
  { icon: Radio, label: 'Ongoing market intelligence and news updates' },
  { icon: ShieldCheck, label: 'Homeowner assistance that continues after the move-in' },
];

export default function ClientExperiencePreview() {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>What Your Referred Clients Experience</p>
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        So you can speak to it confidently when you make the referral, here's what the person you send our way
        actually receives from us.
      </p>
      <div className="grid gap-2.5 mb-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
              <p className="text-xs text-gray-300">{f.label}</p>
            </div>
          );
        })}
      </div>
      <a href="/dnn-news" target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
        style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
        Preview the Client Experience <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}