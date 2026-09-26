import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, User, Bot, Clock } from 'lucide-react';

const GOLD = '#D4AF37';

export default function AdminCharlieConversations() {
  const [selected, setSelected] = useState(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['charlieConversations'],
    queryFn: () => base44.entities.CharlieConversation.list('-session_start', 200),
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" style={{ color: GOLD }} />
          Charlie Conversations
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Live Gemini 3.8 Live voice sessions with Charlie, newest first. Click a row to read the full transcript.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)', background: '#141414' }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(212,175,55,0.08)', color: GOLD }}>
          <div className="col-span-3">Started</div>
          <div className="col-span-2">Page</div>
          <div className="col-span-3">Visitor</div>
          <div className="col-span-2">Model</div>
          <div className="col-span-2 text-right">Turns</div>
        </div>

        {isLoading && <p className="p-4 text-sm text-slate-500">Loading…</p>}
        {!isLoading && conversations.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No conversations recorded yet.</p>
        )}

        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-left text-sm text-white/90 hover:bg-white/5 transition-colors border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="col-span-3 text-xs">{c.session_start ? new Date(c.session_start).toLocaleString() : '—'}</div>
            <div className="col-span-2 text-xs truncate">{c.page || '—'}</div>
            <div className="col-span-3 text-xs truncate">{c.visitor_name || c.visitor_email || c.visitor_id || 'Guest'}</div>
            <div className="col-span-2 text-xs truncate text-slate-400">{c.model?.replace('models/', '') || '—'}</div>
            <div className="col-span-2 text-xs text-right">{c.transcript?.length || 0}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-5"
            style={{ background: '#141414', border: `1px solid ${GOLD}55` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">{selected.visitor_name || selected.visitor_email || 'Guest'}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {selected.session_start ? new Date(selected.session_start).toLocaleString() : '—'}
                  {selected.page ? ` · ${selected.page}` : ''}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(selected.transcript || []).length === 0 && (
                <p className="text-sm text-slate-500">No transcript turns were captured for this session.</p>
              )}
              {(selected.transcript || []).map((t, i) => (
                <div key={i} className={`flex gap-2 ${t.role === 'assistant' ? 'items-start' : 'items-start'}`}>
                  {t.role === 'assistant' ? (
                    <Bot className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                  ) : (
                    <User className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  )}
                  <div className="rounded-lg px-3 py-2 text-sm flex-1" style={{ background: t.role === 'assistant' ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white/90 whitespace-pre-wrap">{t.text}</p>
                    {t.at && <p className="text-[10px] text-slate-500 mt-1">{new Date(t.at).toLocaleTimeString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}