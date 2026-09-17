import React from 'react';
import { Check, Minus } from 'lucide-react';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';

const stages = [
  { id: 'audit', number: 1, title: 'Audit' },
  { id: 'agent', number: 2, title: 'Agent' },
  { id: 'offer', number: 3, title: 'Offer' },
  { id: 'escrow', number: 4, title: 'Escrow' },
  { id: 'close', number: 7, title: 'Close' }
];
const signals = {
  pending: { label: 'Waiting', node: 'border-dyson-taupe text-dyson-taupe', road: 'bg-dyson-taupe' },
  running: { label: 'In progress', node: 'border-status-progress text-status-progress', road: 'bg-status-progress' },
  completed: { label: 'Complete', node: 'border-status-complete text-status-complete', road: 'bg-status-complete' },
  flagged: { label: 'Stop', node: 'border-status-stop text-status-stop', road: 'bg-status-stop' }
};

export default function CopilotRoadmapPreview() {
  const { statuses } = useAnimatedDemoStatuses(stages);
  return (
    <div className="w-full py-2 font-mono">
      <p className="mb-3 text-center text-[8px] text-dyson-taupe">Demo map · Illustrative, not your transaction status</p>
      <ol className="grid grid-cols-5" aria-label="Illustrative transaction roadmap">
        {stages.map((stage, index) => {
          const status = statuses[stage.id]?.status || 'pending';
          const signal = signals[status];
          return (
            <li key={stage.id} className="relative min-w-0 text-center" aria-label={`${stage.title}: ${signal.label}`}>
              {index < stages.length - 1 && <span aria-hidden="true" className={`absolute left-1/2 top-2.5 h-1 w-full ${signal.road}`} />}
              <span className={`relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 bg-dyson-black text-[9px] font-bold ${signal.node}`}>
                {status === 'completed' ? <Check className="h-3 w-3" /> : status === 'flagged' ? <Minus className="h-3 w-3" /> : stage.number}
              </span>
              <span className="mt-1 block text-[9px] text-dyson-text">{stage.title}</span>
              <span className={`block text-[7px] ${signal.node}`}>{signal.label}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex justify-center gap-3 text-[7px]" aria-label="Status key">
        <span className="text-status-complete">Green · Complete</span>
        <span className="text-status-progress">Yellow · In progress</span>
        <span className="text-status-stop">Red · Stop</span>
      </div>
    </div>
  );
}