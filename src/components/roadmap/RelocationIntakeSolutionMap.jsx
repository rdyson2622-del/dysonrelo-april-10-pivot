import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';

const GOLD = '#D4AF37';

const FLOW = {
  stages: [
    { id: 'info',      title: 'Your Info' },
    { id: 'move',      title: 'Your Move' },
    { id: 'priorities', title: 'Priorities' },
    { id: 'confirm',   title: 'Confirm' },
    { id: 'agent',     title: 'Phase 2: Agent Match' },
    { id: 'property',  title: 'Phase 3: Property Search' },
    { id: 'community', title: 'Phase 4: Community Research' },
    { id: 'diligence', title: 'Phase 5: Due Diligence' },
  ],
};

const DETAILS = {
  info:      'We capture your name, contact, current city, and family size — the foundation of your relocation profile.',
  move:      'Your destination, timeline, and budget define the parameters of your search.',
  priorities: 'Schools, commute, walkability, safety — we learn what matters most to your family.',
  confirm:   'We review your full profile together before anything is dispatched.',
  agent:     'We vet 20+ agents in your destination market and hand-select your local expert.',
  property:  'AI-powered matching surfaces properties that fit your exact criteria.',
  community: 'We zero in on the right neighborhoods before you commit to a home.',
  diligence: 'Environmental, structural, and zoning research — so you know exactly what you are buying.',
};

export default function RelocationIntakeSolutionMap() {
  const [selectedStage, setSelectedStage] = useState(null);
  const { statuses, activeStageId } = useAnimatedDemoStatuses(FLOW.stages);
  const focusId = selectedStage || activeStageId;
  const focusStage = FLOW.stages.find(s => s.id === focusId) || FLOW.stages[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40`, color: GOLD }}>
          ● Live Demo
        </span>
      </div>
      <h3 className="text-lg font-bold mb-5" style={{ color: GOLD }}>Your Relocation Roadmap</h3>

      <FlowRoadmapLine
        stages={FLOW.stages}
        stageStatuses={statuses}
        color={GOLD}
        activeStageId={activeStageId}
        onSelect={(id) => setSelectedStage(id)}
        compact
      />

      {/* Detail panel for the focused stage */}
      <div className="mt-5 rounded-2xl px-5 py-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>
          Step {FLOW.stages.findIndex(s => s.id === focusStage.id) + 1}
        </p>
        <p className="font-bold mb-1" style={{ color: '#fff' }}>{focusStage.title}</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
          {DETAILS[focusStage.id]}
        </p>
      </div>

      <p className="text-[10px] text-gray-500 mt-3 text-center">
        Tap any node to focus on that step. This is a live demo — real requests light up green as they complete.
      </p>
    </motion.div>
  );
}