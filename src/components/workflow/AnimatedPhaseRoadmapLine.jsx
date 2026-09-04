import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

/**
 * AnimatedPhaseRoadmapLine — a self-running dummy demo that moves through
 * all 8 relocation phases in sequence, lighting each one up green as it
 * completes and gold (pulsing) as it's the active step, then loops.
 */
export default function AnimatedPhaseRoadmapLine({ phases, color = '#D4AF37' }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % (phases.length + 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [phases.length]);

  const progress = (Math.min(activeStep, phases.length) / phases.length) * 100;

  return (
    <div className="overflow-x-auto">
      <div className="relative" style={{ height: 52, minWidth: phases.length * 90 }}>
        <div className="absolute rounded-full" style={{ top: '50%', left: '20px', right: '20px', height: '3px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)' }} />
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            top: '50%', left: '20px', height: '3px', transform: 'translateY(-50%)',
            background: `linear-gradient(90deg, #22c55e 0%, ${color} 100%)`,
            width: `calc((100% - 40px) * ${progress / 100})`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {phases.map((p, idx) => {
            const isDone = idx < activeStep;
            const isActive = idx === activeStep;
            const cfg = isDone
              ? { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: CheckCircle2, glow: false, spin: false }
              : isActive
              ? { color: '#D4AF37', bg: 'rgba(212,175,55,0.18)', icon: Loader2, glow: true, spin: true }
              : { color: '#555', bg: 'rgba(85,85,85,0.12)', icon: Circle, glow: false, spin: false };
            const Icon = cfg.icon;
            return (
              <div key={p.number} className="relative group shrink-0" style={{ zIndex: 10 }}>
                <div
                  className="rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    width: isActive ? 38 : 34, height: isActive ? 38 : 34,
                    background: cfg.bg, border: `2.5px solid ${cfg.color}`,
                    boxShadow: cfg.glow ? `0 0 16px ${cfg.color}, 0 0 4px ${cfg.color}` : 'none',
                  }}
                >
                  <Icon className={`w-4 h-4 ${cfg.spin ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: '#1a1a1a', border: `1px solid ${cfg.color}40`, color: '#fff' }}>
                  Phase {p.number} · {p.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between px-1 mt-2" style={{ minWidth: phases.length * 90 }}>
        {phases.map((p, idx) => {
          const isDone = idx < activeStep;
          const isActive = idx === activeStep;
          const labelColor = isDone ? '#22c55e' : isActive ? color : '#777';
          return (
            <p key={p.number} className="text-[9px] font-bold text-center shrink-0" style={{ width: 80, color: labelColor }}>
              Phase {p.number}
            </p>
          );
        })}
      </div>
    </div>
  );
}