import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Phone, Clock, DollarSign, Map } from 'lucide-react';

const GOLD = '#D4AF37';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color: GOLD }} />
        <p className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function AdminVoiceConciergeAnalytics() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['talkingSessionLogs'],
    queryFn: () => base44.entities.TalkingSessionLog.list('-started_at', 200),
  });

  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const totalCost = sessions.reduce((sum, s) => sum + (s.estimated_cost_usd || 0), 0);
  const roadmapCount = sessions.filter((s) => s.roadmap_generated).length;

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <p className="text-xs font-black tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>Charlie's Brain</p>
      <h1 className="text-2xl font-bold text-white mb-1">Voice Concierge (V2V) Analytics</h1>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Usage and estimated Gemini Live API cost for the Talking App voice concierge.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Phone} label="Total Calls" value={totalSessions} />
        <StatCard icon={Clock} label="Total Minutes" value={Math.round(totalSeconds / 60)} />
        <StatCard icon={DollarSign} label="Est. Cost (USD)" value={`$${totalCost.toFixed(2)}`} />
        <StatCard icon={Map} label="Roadmaps Generated" value={roadmapCount} />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#111' }}>
              {['Caller', 'Started', 'Duration', 'Turns', 'Roadmap', 'Est. Cost'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-[11px] font-black tracking-widest uppercase" style={{ color: GOLD }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading…</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>No calls yet.</td></tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                  <td className="px-4 py-2.5 text-white">{s.user_name || s.user_email || '—'}</td>
                  <td className="px-4 py-2.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {s.started_at ? new Date(s.started_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {s.duration_seconds ? `${Math.round(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s` : '—'}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.transcript_turns ?? '—'}</td>
                  <td className="px-4 py-2.5">{s.roadmap_generated ? '✅' : '—'}</td>
                  <td className="px-4 py-2.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {s.estimated_cost_usd != null ? `$${s.estimated_cost_usd.toFixed(4)}` : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}