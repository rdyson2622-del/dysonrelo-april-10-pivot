import React from 'react';
import { Newspaper } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { getFlow } from '@/lib/departmentWorkflows';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';

const GOLD = '#D4AF37';
const DNN_COLOR = '#38bdf8';

/**
 * DnnNewsSolutionMap — a live animated Roadmap showing the DNN News
 * production flow (Write → Render → Publish → Audience). Displayed on the
 * consumer DNN News page above the briefs so visitors see how each story
 * is produced before it reaches them.
 */
export default function DnnNewsSolutionMap() {
  const flow = getFlow('dnn');
  const { statuses, activeStageId } = useAnimatedDemoStatuses(flow?.stages);

  if (!flow) return null;

  return (
    <div className="mb-8">
      <div className="rounded-xl p-3 sm:p-4 mx-auto" style={{ background: '#1a1a1a', border: `1px solid rgba(56,189,248,0.30)`, maxWidth: '420px' }}>
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-4 h-4" style={{ color: DNN_COLOR }} />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: DNN_COLOR }}>
            DNN News Roadmap
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase animate-pulse ml-auto" style={{ color: GOLD }}>
            ● Live
          </span>
        </div>
        <FlowRoadmapLine
          stages={flow.stages}
          stageStatuses={statuses}
          color={DNN_COLOR}
          activeStageId={activeStageId}
          onSelect={() => {}}
          compact
        />
      </div>
    </div>
  );
}