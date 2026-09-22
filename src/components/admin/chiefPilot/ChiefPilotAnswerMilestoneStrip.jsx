import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

// Compact "you're here" roadmap shown inline under one answer — a connected
// line with circle nodes, highlighting the milestone that answer relates to.
// Not animated, not a demo — reflects the actual relevantPhase classified
// for this specific message.
export default function ChiefPilotAnswerMilestoneStrip({ milestones, relevantPhase }) {
  if (!milestones?.length || !relevantPhase) return null;
  const matchIndex = milestones.findIndex(title => title.toLowerCase() === relevantPhase.toLowerCase());
  if (matchIndex === -1) return null;
  const progress = milestones.length > 1 ? (matchIndex / (milestones.length - 1)) * 100 : 0;

  return (
    <div className="mt-3 overflow-x-auto">
      <div className="relative" style={{ height: 28, minWidth: milestones.length * 78 }}>
        <div className="absolute rounded-full" style={{ top: '50%', left: '14px', right: '14px', height: '2px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute rounded-full" style={{ top: '50%', left: '14px', height: '2px', transform: 'translateY(-50%)', background: '#D4AF37', width: `calc((100% - 28px) * ${progress / 100})` }} />
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {milestones.map((title, index) => {
            const isMatch = index === matchIndex;
            const isPast = index < matchIndex;
            const Icon = isPast ? CheckCircle2 : Circle;
            return (
              <div key={title} className="relative shrink-0 group" style={{ zIndex: 10 }}>
                <div className="flex items-center justify-center rounded-full transition-all"
                  style={{ width: isMatch ? 22 : 16, height: isMatch ? 22 : 16, background: isMatch ? 'rgba(212,175,55,0.2)' : isPast ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.06)', border: `2px solid ${isMatch || isPast ? '#D4AF37' : '#555'}`, boxShadow: isMatch ? '0 0 10px #D4AF3799' : 'none' }}>
                  <Icon className="w-2.5 h-2.5" style={{ color: isMatch || isPast ? '#D4AF37' : '#777' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between px-1 mt-1" style={{ minWidth: milestones.length * 78 }}>
        {milestones.map((title, index) => (
          <p key={title} className="text-center shrink-0 text-[9px] font-semibold" style={{ width: 70, color: index === matchIndex ? '#D4AF37' : '#777' }}>{title}</p>
        ))}
      </div>
    </div>
  );
}