import React from 'react';
import AnimatedPhaseRoadmapLine from '@/components/workflow/AnimatedPhaseRoadmapLine';

export default function ChiefPilotMilestoneMap({ milestones, isLiveObjective = false }) {
  const phases = milestones.map((title, index) => ({ number: index + 1, title }));
  return (
    <section className="mt-3 border-t border-black/15 pt-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-semibold">Subject milestone map</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${isLiveObjective ? 'bg-status-progress/15 text-dyson-text-dark' : 'bg-dyson-gold-deep/15 text-dyson-gold-deep'}`}>{isLiveObjective ? 'ACTIVE OBJECTIVE' : 'DUMMY SAMPLE'}</span>
      </div>
      <div className="mt-3 w-full rounded-xl bg-dyson-black p-3">
        <AnimatedPhaseRoadmapLine phases={phases} compact />
      </div>
    </section>
  );
}