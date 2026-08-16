import React from 'react';
import { Building2 } from 'lucide-react';

const GOLD = '#D4AF37';

export default function WisdomSectionPlaceholder({ title, description, icon: Icon }) {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
          {Icon ? <Icon className="w-6 h-6" style={{ color: GOLD }} /> : <Building2 className="w-6 h-6" style={{ color: GOLD }} />}
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Wisdom Properties</p>
          <h1 className="text-3xl font-serif text-white">{title}</h1>
        </div>
      </div>

      <div className="rounded-2xl p-8 max-w-3xl" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
        <p className="text-gray-300 text-lg leading-relaxed mb-4">{description}</p>
        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-sm text-gray-500">
            This section is ready for configuration. Connect Back Office by Bold Trail and other data sources to populate live escrow, listing, and agent records.
          </p>
        </div>
      </div>
    </div>
  );
}