import React from 'react';
import { getFlow, WORKFLOW_DESKS } from '@/lib/departmentWorkflows';
import { useStageStatuses } from '@/hooks/useStageStatuses';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const DESK_COLORS = Object.fromEntries(WORKFLOW_DESKS.map(d => [d.id, d.color]));

/**
 * RequestSolutionMap — ties a single SubscriberRoadmap request to its desk's
 * Solution Map. Shows the course of events (stages) with per-segment seconds
 * timers underneath, so the client can watch progress the moment they submit.
 *
 * Real WorkflowActions drive the statuses/timers when they exist; otherwise the
 * animated demo cycles so the client sees what's coming (same model/demo pattern
 * used across the app).
 */
export default function RequestSolutionMap({ item }) {
  const deskId = item.desk_id || 'knowledge';
  const flow = getFlow(deskId);
  const stages = flow?.stages || [];
  const color = DESK_COLORS[deskId] || '#D4AF37';

  const { stageStatuses, isModelMode } = useStageStatuses(deskId);
  const demo = useAnimatedDemoStatuses(stages);

  if (stages.length === 0) return null;

  const stageStatusesToUse = isModelMode ? demo.statuses : stageStatuses;
  const activeStageId = isModelMode ? demo.activeStageId : null;

  return (
    <div className="rounded-xl p-3 mb-2" style={{ background: '#0a0a0a', border: `1px solid ${color}30` }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-black tracking-widest uppercase animate-pulse" style={{ color }}>
          {isModelMode ? '● Live Demo — Your Solution Map' : '● Live — Your Solution Map'}
        </span>
        <span className="text-[9px] text-gray-500 ml-auto">{item.desk_name || deskId}</span>
      </div>
      <FlowRoadmapLine
        stages={stages}
        stageStatuses={stageStatusesToUse}
        color={color}
        activeStageId={activeStageId}
        onSelect={() => {}}
        compact
      />
    </div>
  );
}