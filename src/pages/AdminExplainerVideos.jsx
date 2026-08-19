import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Video, AlertTriangle } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const GOLD = '#D4AF37';

// Fixed node order for every Explainer job — Higgsfield + ElevenLabs pipeline,
// NOT the daily news HeyGen pipeline. Order matters: it's how we spot friction.
export const EXPLAINER_STAGES = [
  { id: 'script_lock', title: 'Script Lock' },
  { id: 'line_split', title: 'Line Split + Timing' },
  { id: 'voice', title: 'ElevenLabs Voice (Charlie + Bob)' },
  { id: 'stills', title: 'Stills' },
  { id: 'higgsfield_pass', title: 'Higgsfield Picture + Mouth Pass' },
  { id: 'cut', title: 'Cut' },
  { id: 'qa', title: 'QA (Roadmap wording, teeth, speaker)' },
  { id: 'post_site', title: 'Post to Site' },
  { id: 'marketing_send', title: 'Marketing Send (Bob approval)' },
];

const CYCLE = ['pending', 'completed', 'flagged'];

const TYPE_LABELS = {
  agent_broker_tc: 'Agent / Broker / TC',
  broker_wisdom: 'Broker (Wisdom)',
};

function firstUnfinishedStageId(stageStatuses) {
  const found = EXPLAINER_STAGES.find(s => (stageStatuses?.[s.id]?.status || 'pending') !== 'completed');
  return found?.id;
}

export default function AdminExplainerVideos() {
  const queryClient = useQueryClient();

  const { data: explainers = [], isLoading } = useQuery({
    queryKey: ['dnnExplainers'],
    queryFn: () => base44.entities.DnnExplainer.list('-created_date', 50),
  });

  const handleCycleStage = async (explainer, stageId) => {
    const current = explainer.stage_statuses?.[stageId]?.status || 'pending';
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    const stage_statuses = {
      ...explainer.stage_statuses,
      [stageId]: { ...explainer.stage_statuses?.[stageId], status: next },
    };
    await base44.entities.DnnExplainer.update(explainer.id, { stage_statuses });
    queryClient.invalidateQueries({ queryKey: ['dnnExplainers'] });
  };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-6 h-6" style={{ color: GOLD }} />
          <h1 className="text-2xl font-serif" style={{ color: GOLD }}>Explainer Videos</h1>
        </div>
        <p className="text-sm text-gray-400 mb-1">
          Separate track from the Daily News show — same Higgsfield + ElevenLabs pipeline, no new HeyGen job.
          Click a node to cycle it through Waiting → Done → Stalled so friction is visible at a glance.
        </p>

        {/* Red light protocol */}
        <div className="rounded-xl p-4 mt-4 mb-6 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#f0b8b8' }}>
            <strong>Red light protocol:</strong> when a node stalls, notify the appropriate agent/broker/TC first. Only escalate to the client if it stays unresolved.
          </p>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Loading explainer jobs…</p>}
        {!isLoading && explainers.length === 0 && (
          <p className="text-sm text-gray-500">No explainer jobs yet.</p>
        )}

        <div className="space-y-5">
          {explainers.map(explainer => (
            <div key={explainer.id} className="rounded-2xl p-5" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-serif text-lg text-white">{explainer.title}</p>
                  <p className="text-xs text-gray-500">{TYPE_LABELS[explainer.explainer_type] || explainer.explainer_type} · {explainer.presenters || 'Charlie + Bob'}</p>
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{
                    background: explainer.script_status === 'locked' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                    color: explainer.script_status === 'locked' ? '#22c55e' : '#888',
                  }}>
                  {explainer.script_status === 'locked' ? 'Script Locked' : 'Script Not Locked'}
                </span>
              </div>
              <FlowRoadmapLine
                stages={EXPLAINER_STAGES}
                stageStatuses={explainer.stage_statuses || {}}
                color={GOLD}
                activeStageId={firstUnfinishedStageId(explainer.stage_statuses)}
                onSelect={(stageId) => handleCycleStage(explainer, stageId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}