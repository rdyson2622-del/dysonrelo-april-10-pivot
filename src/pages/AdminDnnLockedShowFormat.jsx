import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ LOCKED REFERENCE — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// This is the approved final look & sequence for every DNN broadcast show.
// If a future render looks wrong, compare it against THIS video — it is the
// standard. Studio composite (gold-bordered PIP boxes over the DNN backdrop)
// is hardcoded in dnnCreatomateRender/entry.ts and applies to every show.
// ══════════════════════════════════════════════════════════════════════════
const LOCKED_VIDEO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/75165cedb_san-diego-housing-inventory-remains-constrained-amid-sustained-price-resilience.mp4';
const LOCKED_HEADLINE = 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience';
const LOCKED_DATE = 'Locked 2026-09-01';

const SEQUENCE = [
  { step: '1. Intro', desc: 'Charlie opens solo at the DNN desk — welcomes viewers, teases the story.' },
  { step: '2. Charlie / Opening', desc: 'Charlie introduces the topic and brings in Bob.' },
  { step: '3. Bob / Solutions', desc: 'Bob answers with the market insight and practical advice. Ends naturally — no toss back.' },
  { step: '4. Outro', desc: 'Charlie closes the show and signs off.' },
];

export default function AdminDnnLockedShowFormat() {
  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
          <Lock className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>DNN Studio — Locked Reference</p>
          <h1 className="text-3xl font-serif text-white">Final Look & Sequence of the Show</h1>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}40` }}>
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
        <p className="text-sm text-white">
          This is the <span className="font-bold" style={{ color: GOLD }}>locked, approved</span> studio format — gold-bordered PIP boxes over the DNN backdrop, in the fixed Intro → Charlie → Bob → Outro order. Every future show must match this. Do not regenerate or replace this reference without explicit approval.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden mb-6" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
        <video src={LOCKED_VIDEO_URL} controls className="w-full" style={{ display: 'block' }} />
        <div className="p-4">
          <p className="text-white font-serif text-lg">{LOCKED_HEADLINE}</p>
          <p className="text-xs text-gray-500 mt-1">{LOCKED_DATE}</p>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>Locked Sequence</p>
        <div className="space-y-2">
          {SEQUENCE.map(s => (
            <div key={s.step} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-bold text-white">{s.step}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}