import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Clock, CheckCircle2, Plus, History } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { getTalkToUsPortal } from '@/lib/talkToUsPortals';

const GOLD = '#D4AF37';

// The "hidden roadmap" — appears the moment a request is sent and fills in
// live so the visitor sees "we understand your request" right away, before
// the real milestone roadmap (tailored to their actual issue) replaces it.
const BUILDING_STAGES = [
  { id: 'received', title: 'Request Received' },
  { id: 'understood', title: 'We Understand' },
  { id: 'roadmap', title: 'Building Roadmap' },
  { id: 'ready', title: 'Ready' },
];

function stagesToStatuses(stages) {
  const statuses = {};
  (stages || []).forEach(s => { statuses[s.id] = { status: s.status, created_date: new Date().toISOString() }; });
  return statuses;
}

/** One completed request's roadmap — used for the just-submitted result and the history library. */
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
 * request in their own words (a tall, unhurried textarea so they can see
 * their own copy before sending). The moment they submit, a roadmap appears
 * and fills in live — "Request Received" → "We Understand" → "Building
 * Roadmap" — then swaps to the real, tailored milestone roadmap + answer.
 * Every request is saved to the visitor's own request history (their
 * "library of discussions", shown above when they're logged in) and admins
 * get an immediate text alert.
 */
export default function IssueRequestSolutionMap({ portalRole = 'general' }) {
  const portal = getTalkToUsPortal(portalRole);
  const [user, setUser] = useState(null);
  const [text, setText] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [buildingStatuses, setBuildingStatuses] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const buildTimerRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Library of discussions — this visitor's own past requests, in this portal.
  const { data: history = [] } = useQuery({
    queryKey: ['myRealEstateRequests', user?.id, portal.context],
    queryFn: () => base44.entities.RealEstateRequest.filter({ user_id: user.id, context: portal.context }, '-created_date', 15),
    enabled: !!user,
  });

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(buildTimerRef.current); }, []);

  const startNew = () => {
    setResult(null);
    setError('');
    setText('');
  };

  const needsContact = !user;
  const canSubmit = text.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError('');
    setResult(null);
    setElapsedMs(0);

    // Hidden roadmap appears instantly — "we understand your request".
    setBuildingStatuses({ received: 'completed', understood: 'running', roadmap: 'pending', ready: 'pending' });
    buildTimerRef.current = setTimeout(() => {
      setBuildingStatuses({ received: 'completed', understood: 'completed', roadmap: 'running', ready: 'pending' });
    }, 900);

    const start = Date.now();
    timerRef.current = setInterval(() => setElapsedMs(Date.now() - start), 100);
    try {
      const res = await base44.functions.invoke('realEstateIssueRoadmap', {
        request_text: text.trim(),
        context: portal.context,
        portal_role: portalRole,
        audience: portal.audience,
        full_name: needsContact ? contactName.trim() : undefined,
        email: needsContact ? contactEmail.trim() : undefined,
      });
      if (res.data?.success) {
        setBuildingStatuses({ received: 'completed', understood: 'completed', roadmap: 'completed', ready: 'completed' });
        setTimeout(() => {
          setResult(res.data.request);
          setBuildingStatuses(null);
          setText('');
        }, 400);
      } else {
        setError(res.data?.error || 'Something went wrong. Please try again.');
        setBuildingStatuses(null);
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setBuildingStatuses(null);
    }
    clearInterval(timerRef.current);
    clearTimeout(buildTimerRef.current);
    setSubmitting(false);
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
        <Sparkles className="w-3.5 h-3.5" /> {portal.panelTitle}
      </p>

      {/* Library of discussions — this visitor's own request history */}
      {history.length > 0 && (
        <div className="mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[9px] font-black tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <History className="w-3 h-3" /> Your Requests
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={startNew}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap"
              style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}`, color: GOLD }}
            >
              <Plus className="w-3 h-3" /> New
            </button>
            {history.map(item => (
              <button
                key={item.id}
                onClick={() => { setResult(item); setError(''); setText(''); }}
                className="shrink-0 px-2.5 py-1.5 rounded-full text-[10px] whitespace-nowrap max-w-[160px] truncate"
                style={{
                  background: result?.id === item.id ? `${GOLD}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${result?.id === item.id ? GOLD : 'rgba(255,255,255,0.1)'}`,
                  color: result?.id === item.id ? GOLD : 'rgba(255,255,255,0.7)',
                }}
                title={item.request_text}
              >
                {item.request_text}
              </button>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <>
          {needsContact && (
            <div className="flex gap-2 mb-2">
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                disabled={submitting}
                className="flex-1 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Your email"
                disabled={submitting}
                className="flex-1 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={portal.placeholder}
            rows={8}
            disabled={submitting}
            className="w-full bg-transparent text-sm text-white resize-none outline-none rounded-lg p-3 placeholder-stone-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', minHeight: '190px' }}
          />
          {needsContact && (
            <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sharing your name and email just helps us follow up with your roadmap — it's optional, and never required to send your message. Prefer to talk it through privately? Call us at (858) 353-1200.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending… {(elapsedMs / 1000).toFixed(1)}s</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Send My Request</>
            )}
          </button>
        </>
      )}

      {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}

      {/* Human acknowledgment first — buys time while the roadmap builds */}
      {buildingStatuses && (
        <div className="mt-4">
          <div className="rounded-lg p-3 mb-3" style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Thanks — we've received your request and understand the issue. We're building your roadmap now and will follow up shortly with next steps and options.
            </p>
          </div>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
            We're On It
          </p>
          <FlowRoadmapLine stages={BUILDING_STAGES} stageStatuses={buildingStatuses} color={GOLD} onSelect={() => {}} compact />
        </div>
      )}

      {result && (
        <div className="mt-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5" style={{ color: '#4ade80' }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Your Roadmap
            </p>
            <button onClick={startNew} className="text-[10px] font-bold flex items-center gap-1" style={{ color: GOLD }}>
              <Plus className="w-3 h-3" /> New Request
            </button>
          </div>
          <RequestRoadmapCard item={result} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {result.user_id
              ? "You're logged in, so this is saved to your account — our team has been notified and will follow up there."
              : result.email
              ? `We've saved this under ${result.email} — our team has been notified and will follow up soon.`
              : <>We don't have a way to reach you on this one — call us at (858) 353-1200 to talk it through, or send a new request with your email so we can follow up.</>}
          </p>
        </div>
      )}
    </div>
  );
}