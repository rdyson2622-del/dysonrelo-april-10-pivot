import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  MessageSquare, X, Send, Mic, AlertTriangle, Edit3,
  Compass, Lightbulb, RefreshCw, CheckCircle2, Loader2, Navigation
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

/**
 * BrokerageCommPill — inline communication pill.
 * Self-fetches the current user + brokerage so it can be dropped into any
 * brokerage page without props. Sits in document flow (not floating).
 * Voice or text → saves a BrokerageMessage scoped to the current page.
 */
export default function BrokerageCommPill() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [text, setText] = useState('');
  const [subjectType, setSubjectType] = useState('general');
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [hint, setHint] = useState('');
  const recognitionRef = useRef(null);
  const pageContext = getPageContext(location.pathname);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  const { data: brokerage } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) return await base44.entities.Brokerage.get(userBrokerageId);
      return null;
    },
    enabled: !!user,
  });

  const brokerageId = brokerage?.id;

  const { data: messages = [] } = useQuery({
    queryKey: ['brokerageMessages', brokerageId, pageContext],
    queryFn: () => base44.entities.BrokerageMessage.filter(
      { brokerage_id: brokerageId, page_context: pageContext },
      '-created_date',
      20
    ),
    enabled: !!brokerageId,
    refetchInterval: 15000,
  });

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
        setText(transcript);
        setHint('Heard: "' + transcript + '"');
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => { setListening(false); setHint('Voice error — try again or type.'); };
      recognitionRef.current = rec;
    }
    return () => { try { recognitionRef.current?.abort(); } catch {} };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setText('');
      setHint('Listening… speak your message');
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const send = async () => {
    if (!text.trim() || !brokerageId) return;
    setSending(true);
    setHint('');
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
      setHint('✓ Sent');
      queryClient.invalidateQueries({ queryKey: ['brokerageMessages', brokerageId, pageContext] });
    } catch (e) {
      setHint('Error — try again');
    } finally {
      setSending(false);
    }
  };

  const pendingCount = messages.filter(m => m.status === 'sent').length;

  return (
    <div className="max-w-3xl w-full mb-6">
      <div
        className="rounded-2xl px-4 py-3 transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.04))',
          border: `1.5px solid ${listening ? GOLD : `${GOLD}50`}`,
          boxShadow: listening ? `0 0 24px ${GOLD}30` : 'none',
        }}
      >
        {/* Subject type pills */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
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
          {pendingCount > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold self-center" style={{ background: '#ef4444', color: '#fff' }}>
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: listening ? 'rgba(239,68,68,0.15)' : `${GOLD}15`,
              border: `1.5px solid ${listening ? '#ef4444' : GOLD}`,
            }}
            title={listening ? 'Stop' : 'Speak'}
          >
            {listening ? (
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-3 rounded-sm bg-red-500 animate-pulse"></span>
                <span className="w-1 h-4 rounded-sm bg-red-500 animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1 h-2 rounded-sm bg-red-500 animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              </span>
            ) : (
              <Mic className="w-4 h-4" style={{ color: GOLD }} />
            )}
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); setHint(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
            placeholder={listening ? 'Listening…' : `Speak or type — ${SUBJECT_TYPES.find(s => s.id === subjectType)?.label.toLowerCase()} on ${pageContext}`}
            className="flex-1 bg-transparent text-sm outline-none placeholder-stone-400"
            style={{ color: '#f5f5f0' }}
            disabled={sending}
          />

          <button
            onClick={send}
            disabled={!text.trim() || sending}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: text.trim() ? `${GOLD}20` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${text.trim() ? GOLD : 'rgba(255,255,255,0.1)'}`,
            }}
            title="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: GOLD }} /> : <Send className="w-4 h-4" style={{ color: text.trim() ? GOLD : '#888' }} />}
          </button>
        </div>

        {/* Hint */}
        {(hint || listening) && (
          <div className="mt-2 flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: listening ? '#ef4444' : GOLD }} />
            <p className="text-[11px]" style={{ color: listening ? '#ef4444' : GOLD }}>
              {hint || 'Listening… speak your message'}
            </p>
          </div>
        )}
      </div>

      {/* Recent messages */}
      {messages.length > 0 && (
        <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto">
          {messages.slice(0, 4).map(m => {
            const cfg = SUBJECT_TYPES.find(s => s.id === m.subject_type) || SUBJECT_TYPES[0];
            const Icon = cfg.icon;
            return (
              <div key={m.id} className="flex items-start gap-2 text-[11px] px-2">
                <Icon className="w-3 h-3 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className="text-stone-300 ml-1.5">{m.content}</span>
                  {m.admin_response && <span className="text-stone-500 ml-1.5">→ {m.admin_response}</span>}
                </div>
                {m.status === 'resolved' && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}