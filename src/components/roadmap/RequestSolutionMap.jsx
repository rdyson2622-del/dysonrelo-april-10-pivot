import React from 'react';
import { getFlow, WORKFLOW_DESKS } from '@/lib/departmentWorkflows';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const DESK_COLORS = Object.fromEntries(WORKFLOW_DESKS.map(d => [d.id, d.color]));

/**
 * RequestSolutionMap — the REAL Roadmap for a subscriber's request.
 *
 * The animated dummy demo lives on the entry page (SolutionMapEntry) to
 * introduce the map and the process. Once the client subscribes — so we have
 * their contact info — the dummy goes away and THIS real flow chart replaces
 * it, tied to their actual request.
 *
 * Stage statuses are derived from the SubscriberRoadmap record's own status
 * (which the client is allowed to read). No admin-only WorkflowAction data,
 * no animated dummy fallback. Per-segment real timers are the next build-out.
 */
function deriveStageStatuses(stages, item) {
  const statuses = {};
  const total = stages.length;
  if (total === 0) return statuses;
  const now = new Date().toISOString();
  const status = item.status;

  if (status === 'completed') {
    stages.forEach(s => { statuses[s.id] = { status: 'completed', created_date: now }; });
    return statuses;
  }
  if (status === 'cancelled') {
    stages.forEach(s => { statuses[s.id] = { status: 'pending', created_date: now }; });
    return statuses;
  }
  if (status === 'flagged') {
    const current = Math.min(total - 1, Math.max(0, Math.floor(total * 0.6)));
    stages.forEach((s, i) => {
      if (i < current) statuses[s.id] = { status: 'completed', created_date: now };
      else if (i === current) statuses[s.id] = { status: 'flagged', flag_reason: item.flag_reason || 'Held for review', created_date: now };
      else statuses[s.id] = { status: 'pending', created_date: now };
    });
    return statuses;
  }

  // requested, queued, in_progress — walk the line based on overall status
  let progress = 0;
  if (status === 'queued') progress = 0.15;
  else if (status === 'in_progress') progress = 0.5;
  const current = Math.min(total - 1, Math.floor(progress * total));
  stages.forEach((s, i) => {
    if (i < current) statuses[s.id] = { status: 'completed', created_date: now };
    else if (i === current) statuses[s.id] = { status: 'running', created_date: now };
    else statuses[s.id] = { status: 'pending', created_date: now };
  });
  return statuses;
}

export default function RequestSolutionMap({ item }) {
  const deskId = item.desk_id || 'knowledge';
  const flow = getFlow(deskId);
  const stages = flow?.stages || [];
  const color = DESK_COLORS[deskId] || '#D4AF37';

  if (stages.length === 0) return null;

  const stageStatuses = deriveStageStatuses(stages, item);
  const activeStageId = stages.find(s => stageStatuses[s.id]?.status === 'running')?.id || null;

  return (
    <div className="rounded-xl p-3 mb-2" style={{ background: '#0a0a0a', border: `1px solid ${color}30` }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-black tracking-widest uppercase" style={{ color }}>
          ● Your Roadmap
        </span>
        <span className="text-[9px] text-gray-500 ml-auto">{item.desk_name || deskId}</span>
      </div>
      <FlowRoadmapLine
        stages={stages}
        stageStatuses={stageStatuses}
        color={color}
        activeStageId={activeStageId}
        onSelect={() => {}}
        compact
      />
    </div>
  );
}