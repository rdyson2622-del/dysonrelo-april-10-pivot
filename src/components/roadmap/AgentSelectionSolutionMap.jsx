import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';

const GOLD = '#D4AF37';

const FLOW = {
  stages: [
    { id: 'profile',   title: 'Relocation Profile' },
    { id: 'vetting',   title: 'Deep Market Vetting' },
    { id: 'shortlist', title: 'Your Shortlist' },
    { id: 'agreement', title: 'Buyer Broker Agreement' },
  ],
};

const DETAILS = {
  profile:   'We learn your destination, timeline, budget, lifestyle priorities, and communication style before anything else.',
  vetting:   'We research 20+ agents in your destination market — DRE records, production history, reviews, and personality fit.',
  shortlist: 'You receive 3–5 hand-selected finalists. No pitches. No competitions. Just a clear recommendation and your choice.',
  agreement: 'Once you select your agent, you formalize the relationship. This unlocks your full City Guide, property tools, and concierge access.',
};

export default function AgentSelectionSolutionMap() {
  const [selectedStage, setSelectedStage] = useState(null);
  const { statuses, activeStageId } = useAnimatedDemoStatuses(FLOW.stages);
  const focusId = selectedStage || activeStageId;
  const focusStage = FLOW.stages.find(s => s.id === focusId) || FLOW.stages[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl p-8"
      style={{ background: '#000', border: `1px solid ${GOLD}33` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40`, color: GOLD }}>
          ● Live Demo
        </span>
      </div>
      <h3 className="text-xl font-bold mb-6" style={{ color: GOLD }}>Our 4-Step Agent Selection Process</h3>

      <FlowRoadmapLine
        stages={FLOW.stages}
        stageStatuses={statuses}
        color={GOLD}
        activeStageId={activeStageId}
        onSelect={(id) => setSelectedStage(id)}
      />

      {/* Detail panel for the focused stage */}
      <div className="mt-6 rounded-2xl px-5 py-4"
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