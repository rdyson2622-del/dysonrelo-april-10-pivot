import { useState, useEffect, useMemo, useRef } from 'react';

const STEP_MS = 2200;
const FLAG_MS = 3500;
const HOLD_MS = 3000;

/**
 * useAnimatedDemoStatuses — when no real projects exist (model/dummy mode),
 * this cycles through an animated "live" demo of the flow so visitors see
 * what to expect: a marker walks the line, completed steps light up green
 * behind it, a 401 stop fires and gets cleared, then everything completes
 * and it loops.
 *
 * Returns { statuses, activeStageId } — same shape as useStageStatuses output
 * plus the stage the animation is currently focused on.
 */
export function useAnimatedDemoStatuses(stages) {
  const [frame, setFrame] = useState(0);
  const timerRef = useRef();

  const frames = useMemo(() => {
    if (!stages || stages.length === 0) return [];

    const list = [];
    const cur = {};
    // Show the 401 flag roughly 60% through the flow
    const flagIdx = Math.max(0, Math.min(stages.length - 1, Math.floor(stages.length * 0.6)));
    const now = new Date().toISOString();

    for (let i = 0; i < stages.length; i++) {
      const sid = stages[i].id;

      // Stage starts running (gold pulse)
      cur[sid] = { status: 'running', flag_type: 'none', created_date: now, duration_ms: STEP_MS };
      list.push({ statuses: { ...cur }, duration: STEP_MS, activeStage: sid });

      // 401 flag on the chosen stage
      if (i === flagIdx) {
        cur[sid] = {
          status: 'flagged',
          flag_type: 'auth_401',
          flag_reason: 'LinkedIn token expired — re-auth required',
          created_date: now,
        };
        list.push({ statuses: { ...cur }, duration: FLAG_MS, activeStage: sid });
        // Flag cleared — resume
        cur[sid] = { status: 'running', flag_type: 'none', flag_cleared: true, created_date: now, duration_ms: STEP_MS };
        list.push({ statuses: { ...cur }, duration: STEP_MS, activeStage: sid });
      }

      // Stage completes (green)
      cur[sid] = { status: 'completed', flag_type: 'none', created_date: now, duration_ms: STEP_MS };
      list.push({
        statuses: { ...cur },
        duration: STEP_MS,
        activeStage: i < stages.length - 1 ? stages[i + 1].id : sid,
      });
    }

    // Hold all-completed, then loop back to start
    list.push({ statuses: { ...cur }, duration: HOLD_MS, activeStage: stages[0].id });
    return list;
  }, [stages]);

  useEffect(() => {
    if (frames.length === 0) return;

    let idx = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      setFrame(idx);
      const f = frames[idx];
      idx = (idx + 1) % frames.length;
      timerRef.current = setTimeout(tick, f?.duration || STEP_MS);
    };

    tick();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [frames]);

  const current = frames[frame] || frames[0];
  return {
    statuses: current?.statuses || {},
    activeStageId: current?.activeStage || null,
  };
}