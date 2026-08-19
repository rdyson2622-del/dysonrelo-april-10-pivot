import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { getSolutionMap } from '@/lib/solutionMaps';

/**
 * SolutionMapDemo — reusable interactive Roadmap for any client page.
 *
 * Props:
 *   mapId     — key into SOLUTION_MAPS or a department flow id (required)
 *   title     — optional override heading above the map
 *   subtitle  — optional subtext below the title
 *   color     — optional override color (defaults to the map's color)
 *   compact   — compact variant (default true for inline page use)
 *   onSelect  — optional callback when a stage is clicked (default: no-op)
 *   navigateTo — optional route to navigate to when the map's CTA is clicked
 *   ctaLabel  — optional CTA button label (if omitted, no CTA rendered)
 *   className — optional wrapper className
 */
export default function SolutionMapDemo({
  mapId,
  title,
  subtitle,
  color,
  compact = true,
  onSelect,
  navigateTo,
  ctaLabel,
  className = '',
}) {
  const navigate = useNavigate();
  const flow = getSolutionMap(mapId);
  const { statuses, activeStageId } = useAnimatedDemoStatuses(flow?.stages || []);

  if (!flow) {
    console.warn(`SolutionMapDemo: no solution map found for id "${mapId}"`);
    return null;
  }

  const lineColor = color || flow.color;
  const heading = title || flow.title;

  return (
    <div className={`rounded-xl p-3 sm:p-4 ${className}`} style={{ background: '#0a0a0a', border: `1px solid ${lineColor}30` }}>
      {heading && (
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase animate-pulse" style={{ color: lineColor }}>
              ● Live Roadmap
            </p>
            <h3 className="text-sm font-serif mt-0.5" style={{ color: '#fff' }}>{heading}</h3>
            {subtitle && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
          </div>
          {ctaLabel && navigateTo && (
            <button
              onClick={() => navigate(navigateTo)}
              className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: `${lineColor}18`, border: `1px solid ${lineColor}50`, color: lineColor }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
      <FlowRoadmapLine
        stages={flow.stages}
        stageStatuses={statuses}
        color={lineColor}
        activeStageId={activeStageId}
        onSelect={onSelect || (() => {})}
        compact={compact}
      />
    </div>
  );
}