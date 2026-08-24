import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const GOLD = '#D4AF37';

function stagesToStatuses(stages) {
  const statuses = {};
  (stages || []).forEach(s => { statuses[s.id] = { status: s.status, created_date: new Date().toISOString() }; });
  return statuses;
}

/** One completed request's roadmap — used both for the just-submitted result and the shared feed. */
function RequestRoadmapCard({ item }) {
  const stages = (item.roadmap_stages || []).map(s => ({ id: s.id, title: s.title }));
  if (stages.length === 0) return null;
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-white font-semibold leading-snug flex-1 pr-3">{item.request_text}</p>
        {item.duration_ms != null && (
          <span className="text-[10px] font-black shrink-0 flex items-center gap-1" style={{ color: GOLD }}>
            <Clock className="w-3 h-3" /> {(item.duration_ms / 1000).toFixed(1)}s
          </span>
        )}
      </div>
      <FlowRoadmapLine stages={stages} stageStatuses={stagesToStatuses(item.roadmap_stages)} color={GOLD} onSelect={() => {}} compact />
      {item.solution && <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.solution}</p>}
    </div>
  );
}

/**
 * IssueRequestSolutionMap — a visitor describes a real estate issue or
 * request; Gemini generates an instant roadmap + solution, shown live with
 * an elapsed timer. Completed requests appear below for anyone else viewing
 * the page (e.g. an HR manager watching alongside the employee) — fully
 * transparent, real time.
 */
export default function IssueRequestSolutionMap({ context = 'general' }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const { data: feed = [] } = useQuery({
    queryKey: ['realEstateRequestFeed', context],
    queryFn: () => base44.entities.RealEstateRequest.filter({ context, status: 'completed' }, '-updated_date', 5),
    refetchInterval: 8000,
  });

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    setResult(null);
    setElapsedMs(0);
    const start = Date.now();
    timerRef.current = setInterval(() => setElapsedMs(Date.now() - start), 100);
    try {
      const res = await base44.functions.invoke('realEstateIssueRoadmap', { request_text: text.trim(), context });
      if (res.data?.success) {
        setResult(res.data.request);
        setText('');
      } else {
        setError(res.data?.error || 'Something went wrong. Please try again.');
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    }
    clearInterval(timerRef.current);
    setSubmitting(false);
  };

  const otherFeed = feed.filter(f => f.id !== result?.id);

  return (
    <div className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
        <Sparkles className="w-3.5 h-3.5" /> Tell Us Your Real Estate Issue or Request
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your situation — e.g. 'My deal is stuck in escrow' or 'I need an agent in Austin for my transferring employee'"
        rows={3}
        disabled={submitting}
        className="w-full bg-transparent text-sm text-white resize-none outline-none rounded-lg p-3 placeholder-stone-500"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !text.trim()}
        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Building your roadmap… {(elapsedMs / 1000).toFixed(1)}s</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Get My Instant Roadmap</>
        )}
      </button>

      {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}

      {result && (
        <div className="mt-4">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: '#4ade80' }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Your Roadmap
          </p>
          <RequestRoadmapCard item={result} />
        </div>
      )}

      {otherFeed.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Live — Other Recent Requests
          </p>
          <div className="space-y-3">
            {otherFeed.map(item => <RequestRoadmapCard key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
  );
}