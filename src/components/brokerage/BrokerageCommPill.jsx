import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  MessageSquare, X, Send, Mic, AlertTriangle, Edit3,
  Compass, Lightbulb, RefreshCw, CheckCircle2, Loader2
} from 'lucide-react';

const GOLD = '#D4AF37';

const SUBJECT_TYPES = [
  { id: 'general',        label: 'General',        icon: MessageSquare,   color: '#aaa' },
  { id: 'red_light_fix',  label: 'Red Light Fix',  icon: AlertTriangle,   color: '#ef4444' },
  { id: 'edit_request',   label: 'Edit Request',   icon: Edit3,           color: '#f59e0b' },
  { id: 'direction',      label: 'Direction',       icon: Compass,         color: '#38bdf8' },
  { id: 'guidance',       label: 'Guidance',        icon: Lightbulb,       color: '#a78bfa' },
  { id: 'change_request', label: 'Change Request', icon: RefreshCw,       color: GOLD },
];

function getPageContext(pathname) {
  if (pathname === '/brokerage') return 'dashboard';
  const seg = pathname.replace('/brokerage/', '');
  return seg || 'dashboard';
}

export default function BrokerageCommPill({ brokerageId, user }) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [subjectType, setSubjectType] = useState('general');
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const pageContext = getPageContext(location.pathname);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setVoiceSupported(true);
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setText(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recognitionRef.current = rec;
    }
    return () => {
      try { recognitionRef.current?.abort(); } catch {}
    };
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['brokerageMessages', brokerageId, pageContext],
    queryFn: () => base44.entities.BrokerageMessage.filter(
      { brokerage_id: brokerageId, page_context: pageContext },
      '-created_date',
      20
    ),
    enabled: !!brokerageId,
    refetchInterval: 15000,
  });

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const send = async () => {
    if (!text.trim() || !brokerageId) return;
    setSending(true);
    try {
      await base44.entities.BrokerageMessage.create({
        brokerage_id: brokerageId,
        page_context: pageContext,
        subject_type: subjectType,
        sender_id: user?.id,
        sender_name: user?.full_name || user?.email || 'Portal User',
        sender_role: user?.role === 'admin' ? 'admin' : (user?.portal_role || user?.data?.portal_role || 'broker'),
        message_type: listening ? 'voice' : 'text',
        content: text.trim(),
        status: 'sent',
      });
      setText('');
      queryClient.invalidateQueries({ queryKey: ['brokerageMessages', brokerageId, pageContext] });
    } catch (e) {
      console.error('Failed to send brokerage message:', e);
    } finally {
      setSending(false);
    }
  };

  const pendingCount = messages.filter(m => m.status === 'sent').length;

  return (
    <>
      {/* ── Floating Pill (collapsed) ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))',
            border: `1.5px solid ${GOLD}`,
            boxShadow: `0 4px 20px rgba(212,175,55,0.25)`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <MessageSquare className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
            Communication
          </span>
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#ef4444', color: '#fff' }}>
              {pendingCount}
            </span>
          )}
        </button>
      )}

      {/* ── Expanded Panel ── */}
      {open && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(560px,calc(100vw-2rem))]"
          style={{
            background: 'rgba(10,10,10,0.97)',
            border: `1px solid ${GOLD}40`,
            borderRadius: '16px',
            boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.1)`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                {pageContext} — Communication
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subject type pills */}
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-white/5">
            {SUBJECT_TYPES.map(s => {
              const Icon = s.icon;
              const active = subjectType === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSubjectType(s.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                  style={{
                    background: active ? `${s.color}20` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? s.color : 'rgba(255,255,255,0.08)'}`,
                    color: active ? s.color : '#888',
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Messages list */}
          <div className="max-h-48 overflow-y-auto px-4 py-3 space-y-2">
            {isLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              </div>
            )}
            {!isLoading && messages.length === 0 && (
              <p className="text-center text-[11px] text-gray-600 py-4">
                No messages yet on {pageContext}. Send guidance, edits, or red-light fixes below.
              </p>
            )}
            {messages.map(m => {
              const cfg = SUBJECT_TYPES.find(s => s.id === m.subject_type) || SUBJECT_TYPES[0];
              const Icon = cfg.icon;
              return (
                <div key={m.id} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                      <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="text-[9px] text-gray-600">· {m.sender_name}</span>
                    </div>
                    <span className="text-[9px] text-gray-600">
                      {new Date(m.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{m.content}</p>
                  {m.admin_response && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: GOLD }}>Admin Response</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{m.admin_response}</p>
                    </div>
                  )}
                  {m.status === 'resolved' && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[9px] text-green-500 font-semibold">Resolved</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input row */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={`Send ${SUBJECT_TYPES.find(s => s.id === subjectType)?.label.toLowerCase()} on ${pageContext}…`}
                rows={1}
                className="flex-1 bg-transparent text-white text-xs resize-none outline-none placeholder-gray-600 max-h-24"
                style={{ border: 'none' }}
              />
              {voiceSupported && (
                <button
                  onClick={toggleVoice}
                  className="p-2 rounded-full transition-all"
                  style={{
                    background: listening ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${listening ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  }}
                  title={listening ? 'Stop recording' : 'Voice input'}
                >
                  <Mic className={`w-3.5 h-3.5 ${listening ? 'animate-pulse' : ''}`} style={{ color: listening ? '#ef4444' : '#888' }} />
                </button>
              )}
              <button
                onClick={send}
                disabled={!text.trim() || sending}
                className="p-2 rounded-full transition-all disabled:opacity-30"
                style={{
                  background: text.trim() ? `${GOLD}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${text.trim() ? GOLD : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: GOLD }} /> : <Send className="w-3.5 h-3.5" style={{ color: text.trim() ? GOLD : '#888' }} />}
              </button>
            </div>
            {listening && (
              <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: '#ef4444' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Listening… speak your message
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}