import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const GOLD = '#D4AF37';

// ✅ LOCKED FINAL LOOK — replaces the old 8/29 static-photo composite. This is
// the real finished show produced by the Creatomate pipeline (dnnCreatomateRender)
// — studio backdrop + gold-bordered Charlie/Bob video boxes + bullet panel.
// Do not change without the builder's explicit sign-off.
const LOCKED_SHOW_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/75165cedb_san-diego-housing-inventory-remains-constrained-amid-sustained-price-resilience.mp4';
const LOCKED_SHOW_HEADLINE = 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience';

export default function AdminDnnCharlieStudioSolution() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <div className="max-w-5xl mx-auto pt-10 px-6 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Locked Approved Studio Look
          </p>
        </div>

        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
          ✅ LOCKED FINAL LOOK — Approved 9/1, do not change without sign-off
        </p>
        <div className="rounded-xl overflow-hidden mb-2" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
          <video src={LOCKED_SHOW_URL} controls className="w-full" style={{ display: 'block' }} />
        </div>
        <p className="text-[11px] text-gray-500 mb-8">{LOCKED_SHOW_HEADLINE}</p>
      </div>
    </div>
  );
}