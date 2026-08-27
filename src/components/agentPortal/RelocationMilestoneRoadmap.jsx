import React from 'react';
import { Map, Check } from 'lucide-react';
import { STATUS_CONFIG, GOLD } from './relocationProjectStatus';

const STAGE_ORDER = [
  'needs_destination_agent',
  'agent_vetting_in_progress',
  'agent_assigned',
  'house_hunting',
  'in_escrow',
  'closed',
];

/**
 * RelocationMilestoneRoadmap — horizontal milestone tracker showing where
 * this client's file sits across the relocation pipeline stages.
 */
export default function RelocationMilestoneRoadmap({ status }) {
  const currentIndex = STAGE_ORDER.indexOf(status);

  return (
    <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-2" style={{ color: GOLD }}>
        <Map className="w-3.5 h-3.5" /> Relocation Roadmap
      </p>
      <div className="flex items-center">
        {STAGE_ORDER.map((key, i) => {
          const cfg = STATUS_CONFIG[key];
          const done = i < currentIndex;
          const active = i === currentIndex;
          const color = done || active ? cfg.color : 'rgba(255,255,255,0.2)';
          return (
            <React.Fragment key={key}>
              <div className="flex flex-col items-center text-center" style={{ width: '90px' }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: done ? color : active ? `${color}22` : 'transparent',
                    border: `2px solid ${color}`,
                  }}
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <cfg.icon className="w-3.5 h-3.5" style={{ color: active ? color : 'rgba(255,255,255,0.3)' }} />
                  )}
                </div>
                <p
                  className="text-[10px] mt-2 leading-tight font-semibold"
                  style={{ color: done || active ? '#fff' : 'rgba(255,255,255,0.35)' }}
                >
                  {cfg.label}
                </p>
              </div>
              {i < STAGE_ORDER.length - 1 && (
                <div className="flex-1 h-[2px] -mt-6" style={{ background: i < currentIndex ? STATUS_CONFIG[STAGE_ORDER[i + 1]].color : 'rgba(255,255,255,0.15)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}