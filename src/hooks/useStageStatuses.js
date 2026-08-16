import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * useStageStatuses — queries the latest WorkflowAction per stage for a desk.
 * Returns a map of stage_id → { status, flag_type, created_date, duration_ms, output }
 *
 * Status lighting:
 *   pending   = no action yet (dim)
 *   running   = in flight (lit up / pulsing)
 *   completed = done (green)
 *   flagged   = 401 / error / stop (red)
 *   detour    = direction change (yellow) — set when a stage is re-run after a flag clear
 */
export function useStageStatuses(deskId) {
  const { data: actions = [] } = useQuery({
    queryKey: ['workflowActions', deskId, 'statuses'],
    queryFn: () => base44.entities.WorkflowAction.filter({ desk_id: deskId }, '-created_date', 100),
    refetchInterval: 4000,
    enabled: !!deskId,
  });

  const stageStatuses = {};
  actions.forEach(a => {
    const existing = stageStatuses[a.stage_id];
    if (!existing || new Date(a.created_date) > new Date(existing.created_date)) {
      stageStatuses[a.stage_id] = a;
    }
  });

  return stageStatuses;
}

/**
 * useAllDeskStatuses — queries ALL WorkflowActions across all desks.
 * Returns a map of desk_id → { stageStatuses, totals }
 */
export function useAllDeskStatuses() {
  const { data: actions = [] } = useQuery({
    queryKey: ['workflowActions', 'all', 'statuses'],
    queryFn: () => base44.entities.WorkflowAction.list('-created_date', 200),
    refetchInterval: 5000,
  });

  const deskMap = {};
  actions.forEach(a => {
    if (!deskMap[a.desk_id]) deskMap[a.desk_id] = {};
    const existing = deskMap[a.desk_id][a.stage_id];
    if (!existing || new Date(a.created_date) > new Date(existing.created_date)) {
      deskMap[a.desk_id][a.stage_id] = a;
    }
  });

  // Compute totals per desk
  const totals = {};
  Object.entries(deskMap).forEach(([deskId, stages]) => {
    let active = 0, completed = 0, flagged = 0, pending = 0;
    Object.values(stages).forEach(a => {
      if (a.status === 'running') active++;
      else if (a.status === 'completed') completed++;
      else if (a.status === 'flagged') flagged++;
    });
    totals[deskId] = { active, completed, flagged, pending, total: Object.keys(stages).length };
  });

  return { deskMap, totals };
}