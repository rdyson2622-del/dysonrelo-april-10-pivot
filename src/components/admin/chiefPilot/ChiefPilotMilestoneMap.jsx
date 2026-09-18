import React from 'react';

export default function ChiefPilotMilestoneMap({ milestones, isLiveObjective = false }) {
  const tone = isLiveObjective ? 'bg-status-progress' : 'bg-dyson-gold-deep';
  return (
    <section className="mt-10 border-t border-black/15 pt-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">Subject milestone map</h3>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${isLiveObjective ? 'bg-status-progress/15 text-dyson-text-dark' : 'bg-dyson-gold-deep/15 text-dyson-gold-deep'}`}>{isLiveObjective ? 'ACTIVE OBJECTIVE' : 'DUMMY SAMPLE'}</span>
      </div>
      <div className="relative mt-7 flex items-start">
        <div className={`absolute left-[5%] right-[5%] top-2 h-0.5 opacity-40 ${tone}`} />
        {milestones.map((milestone, index) => <div key={milestone} className="relative z-10 flex min-w-0 flex-1 flex-col items-center px-1 text-center"><span className={`h-4 w-4 rounded-full border-2 border-dyson-cream ${tone}`} /><span className="mt-3 text-[10px] leading-4 text-dyson-text-dark/75">{index + 1}. {milestone}</span></div>)}
      </div>
    </section>
  );
}