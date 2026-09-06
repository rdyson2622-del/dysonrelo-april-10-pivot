import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';

const GOLD = '#D4AF37';

const FLOW = {
  stages: [
    { id: 'profile',   title: 'Agent Application & Vetting' },
    { id: 'vetting',   title: 'Two-Way Referral Matching' },
    { id: 'shortlist', title: 'Warm Introduction & Handoff' },
    { id: 'agreement', title: 'Referral Agreement & Fee Protection' },
  ],
};

const DETAILS = {
  profile:   'We review your DRE record, production history, market coverage, and communication style before you receive a single referral.',
  vetting:   'Incoming: we send you pre-qualified relocating clients matched to your market. Outgoing: your own relocating clients get placed with a vetted agent anywhere in the country.',
  shortlist: 'No bidding, no competing for the lead. You get a warm introduction with the client\'s full profile already in hand.',
  agreement: 'A signed referral agreement locks in your fee on every deal — both the business we send you and the business you send us.',
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