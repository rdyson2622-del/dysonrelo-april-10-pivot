import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, MapPin, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const GOLD = '#D4AF37';

// Dummy sample stages — same pattern as the Transparency page's sample roadmap.
// Goes live (replaced by real SubscriberRoadmap items) once the user submits a request.
const SAMPLE_STAGES = [
  { id: 'request', title: 'Request Sent' },
  { id: 'reviewed', title: 'Reviewed' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
];
const SAMPLE_STATUSES = {
  request: { status: 'completed' },
  reviewed: { status: 'completed' },
  in_progress: { status: 'running' },
  done: { status: 'pending' },
};

/**
 * PlanOfActionStrip — collapsed-by-default roadmap strip that lives under the
 * "Talk to us" pill. Shows a dummy sample roadmap for the current subject until
 * the user has an actual live SubscriberRoadmap item, then shows theirs instead.
 * The free-account gate lives here (on expand), never on the chat input itself.
 */
export default function PlanOfActionStrip({ subject = 'This Page' }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(null);
  const [hasLive, setHasLive] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user) return setIsAuthed(false);
      setIsAuthed(true);
      base44.entities.SubscriberRoadmap.filter({ subscriber_id: user.id }, '-requested_at', 20)
        .then(rows => setHasLive(rows.some(r => !r.is_dummy)))
        .catch(() => {});
    }).catch(() => setIsAuthed(false));
  }, []);

  const handleToggle = () => {
    if (isAuthed === false) {
      navigate('/subscribe');
      return;
    }
    setOpen(v => !v);
  };

  return (
    <div
      className="w-[340px] max-w-[calc(100vw-3rem)] rounded-xl overflow-hidden"
      style={{ background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(212,175,55,0.35)' }}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black tracking-widest uppercase"
        style={{ color: GOLD }}
      >
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          Plan of Action — {subject}
        </span>
        {isAuthed === false ? (
          <Lock className="w-3.5 h-3.5 shrink-0" />
        ) : open ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          {!hasLive && (
            <p className="text-[10px] text-white/40 mb-2">
              Sample roadmap — submit a request above to make this live and track it here.
            </p>
          )}
          <FlowRoadmapLine
            stages={SAMPLE_STAGES}
            stageStatuses={SAMPLE_STATUSES}
            color={GOLD}
            activeStageId={null}
            onSelect={() => {}}
            compact
          />
        </div>
      )}
    </div>
  );
}