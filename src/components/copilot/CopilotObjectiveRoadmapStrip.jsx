import React from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { OBJECTIVE_ROADMAPS } from './copilotObjectiveRoadmaps';

const statusStyle = {
  pending: 'border-white/25 text-stone-400',
  in_progress: 'border-status-progress text-status-progress',
  completed: 'border-status-complete text-status-complete',
  paused: 'border-status-stop text-status-stop'
};

export default function CopilotObjectiveRoadmapStrip({ door = 'dossier', project }) {
  if (door === 'news' || door === 'dnn') return null;
  const template = OBJECTIVE_ROADMAPS[door] || OBJECTIVE_ROADMAPS.solutions;
  const milestones = project?.milestones || template.milestones.map((title, index) => ({ id: `model-${index}`, title, status: 'pending' }));
  return <div className="overflow-x-auto border-t border-white/10 pt-2 scrollbar-thin" aria-label={`${project ? 'Tracked' : 'Model'} objective roadmap`}>
    <div className="mb-1.5 flex items-center justify-between text-[8px] font-mono text-stone-400">
      <span>{project ? 'LIVE OBJECTIVE ROADMAP' : 'MODEL ROADMAP · DISCUSS TO TRACK'}</span>
      <span>{project?.title || template.title}</span>
    </div>
    <div className="flex min-w-max items-start">
      {milestones.map((item, index) => <div key={item.id} className="relative w-24 text-center">
        {index < milestones.length - 1 && <span className={`absolute left-1/2 top-2 h-0.5 w-full ${item.status === 'completed' ? 'bg-status-complete' : 'bg-white/15'}`} />}
        <span className={`relative z-10 mx-auto flex h-4 w-4 items-center justify-center rounded-full border bg-dyson-black ${statusStyle[item.status] || statusStyle.pending}`}>
          {item.status === 'completed' ? <Check className="h-2.5 w-2.5" /> : item.status === 'paused' ? <Pause className="h-2 w-2" /> : item.status === 'in_progress' ? <Play className="h-2 w-2" /> : index + 1}
        </span>
        <span className="mt-1 block px-1 text-[8px] leading-tight text-stone-300">{item.title}</span>
      </div>)}
    </div>
  </div>;
}