import React from 'react';

// Compact "you're here" strip shown inline under one answer, highlighting the
// milestone that answer relates to. Not animated, not a demo — reflects the
// actual relevantPhase classified for this specific message.
export default function ChiefPilotAnswerMilestoneStrip({ milestones, relevantPhase }) {
  if (!milestones?.length || !relevantPhase) return null;
  const matchIndex = milestones.findIndex(title => title.toLowerCase() === relevantPhase.toLowerCase());
  if (matchIndex === -1) return null;
  return (
    <div className="mt-3 flex items-center gap-1.5 overflow-x-auto">
      {milestones.map((title, index) => {
        const isMatch = index === matchIndex;
        return (
          <span key={title} className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${isMatch ? 'bg-dyson-gold-deep text-black' : 'bg-white/10 text-white/50'}`}>
            {title}
          </span>
        );
      })}
    </div>
  );
}