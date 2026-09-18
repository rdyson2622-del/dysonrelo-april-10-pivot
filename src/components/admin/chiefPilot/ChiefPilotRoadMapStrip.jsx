import React from 'react';

export const CALLE_PHASES = ['Discovery', 'Property Search', 'Agent Match', 'Offer', 'Escrow', 'Move', 'Close'];

export default function ChiefPilotRoadMapStrip({ current = 'Property Search', compact = false }) {
  return (
    <div className={`grid grid-cols-7 overflow-hidden rounded-lg border border-white/10 ${compact ? 'mt-3' : 'mt-6'}`}>
      {CALLE_PHASES.map((phase, index) => <div key={phase} className={`min-w-0 border-r border-white/10 px-1 py-3 text-center last:border-r-0 ${phase === current ? 'bg-dyson-gold text-dyson-text-dark' : 'bg-white/[0.03] text-dyson-taupe'}`}><span className="block text-[9px]">{index + 1}</span><span className={`mt-1 block truncate ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{phase}</span></div>)}
    </div>
  );
}