import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, ArrowLeft, Activity, Bot, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#D4AF37';

const SPECIALISTS = [
  { id: 'bob', name: 'Bob', role: 'real estate / strategy', tier: 'top', color: '#D4AF37', desc: 'Co-founder · Revenue & Strategy' },
  { id: 'jay', name: 'Jay', role: 'CTO / IT / Base44', tier: 'top', color: '#3B82F6', desc: 'Co-founder · Technology & Platform' },
  { id: 'chief', name: 'Chief of Staff', role: 'desk', tier: 'mid', color: '#A78BFA', desc: 'Central coordinator · Triage & routing' },
  { id: 'director', name: 'Director', role: 'video / media', tier: 'bottom', color: '#EC4899', desc: 'DNN video production & broadcast' },
  { id: 'relay', name: 'Relay N8N', role: 'automations', tier: 'bottom', color: '#10B981', desc: 'Workflow automations & API relays' },
  { id: 'hunt', name: 'Hunt', role: 'job applications', tier: 'bottom', color: '#F59E0B', desc: 'Recruitment & candidate tracking' },
];

const SYSTEM_PROMPTS = {
  bob: 'You are Bob Dyson, co-founder of Dyson & Dyson Concierge Relocation. You specialize in real estate strategy, market analysis, and relocation services. You are direct, strategic, and focus on revenue-generating activities. Keep responses concise and actionable.',
  jay: 'You are Jay, the CTO and IT specialist for Dyson & Dyson. You manage the Base44 platform, integrations, automations, and technical infrastructure. You are technical, precise, and solution-oriented. Keep responses concise and technical.',
  chief: 'You are the Chief of Staff for Dyson & Dyson. You coordinate between Bob, Jay, and the specialist bots (Director, Relay N8N, Hunt). You manage the desk, triage tasks, and ensure smooth operations. You are organized and diplomatic. Keep responses concise and structured.',
  director: 'You are the Director of Video and Media for DNN (Dyson News Network). You manage video production, broadcast pipelines, studio compositing, and media content distribution. You are creative and production-focused. Keep responses concise and practical.',
  relay: 'You are Relay N8N, the automation specialist for Dyson & Dyson. You manage n8n workflows, API integrations, webhook relays, and automated pipelines. You are systematic and process-driven. Keep responses concise and technical.',
  hunt: 'You are Hunt, the job applications specialist for Dyson & Dyson. You manage recruitment, job postings, candidate tracking, and HR outreach. You are thorough and detail-oriented. Keep responses concise and organized.',
};

function OrgNode({ specialist, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-xl px-5 py-3 text-center transition-all hover:scale-105"
      style={{
        background: isSelected ? `${specialist.color}22` : '#1e1e1e',
        border: `1.5px solid ${isSelected ? specialist.color : 'rgba(255,255,255,0.12)'}`,
        minWidth: '160px',
      }}
    >
      <p className="text-sm font-bold" style={{ color: isSelected ? specialist.color : '#e0e0e0' }}>
        {specialist.name}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {specialist.role}
      </p>
      {isSelected && (
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full" style={{ background: specialist.color }} />
      )}
    </button>
  );
}

function Connector({ orientation = 'down' }) {
  if (orientation === 'down') {
    return <div className="w-px h-6 mx-auto" style={{ background: 'rgba(255,255,255,0.15)' }} />;
  }
  return null;
}

export default function AdminGrokCommand() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('chief');
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activityFeed, setActivityFeed] = useState([]);
  const scrollRef = useRef(null);

  const selected = SPECIALISTS.find(s => s.id === selectedId);
  const chatMessages = messages[selectedId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, sending]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { role: 'user', content: msg }],
    }));

    try {
      const fullPrompt = `${SYSTEM_PROMPTS[selectedId]}\n\nUser: ${msg}`;
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
      });
      const response = typeof res === 'string' ? res : (res?.text || JSON.stringify(res));

      setMessages(prev => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), { role: 'bot', content: response }],
      }));

      setActivityFeed(prev => [
        { specialist: selected.name, color: selected.color, message: msg, response, time: new Date() },
        ...prev,
      ].slice(0, 50));
    } catch (e) {
      setMessages(prev => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), { role: 'bot', content: `Error: ${e.message}` }],
      }));
    }
    setSending(false);
  };

  const topTier = SPECIALISTS.filter(s => s.tier === 'top');
  const midTier = SPECIALISTS.filter(s => s.tier === 'mid');
  const bottomTier = SPECIALISTS.filter(s => s.tier === 'bottom');

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </button>
            <h1 className="text-2xl font-bold text-white">Grok Specialist Command Center</h1>
            <p className="text-sm text-slate-400 mt-1">Pecking order · Communicate with any specialist · Watch responses in real-time</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: Org Chart + Activity Feed */}
          <div className="space-y-6">
            {/* Org Chart */}
            <div className="rounded-2xl p-6" style={{ background: '#232323', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-center" style={{ color: GOLD }}>
                Pecking Order
              </p>

              {/* Top tier container */}
              <div className="rounded-xl p-4 mb-2" style={{ background: '#333333', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] text-center mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Either can jump any task</p>
                <div className="flex items-center justify-center gap-4">
                  {topTier.map(s => (
                    <OrgNode key={s.id} specialist={s} isSelected={selectedId === s.id} onClick={() => setSelectedId(s.id)} />
                  ))}
                </div>
              </div>

              {/* Connector lines from top to mid */}
              <div className="flex justify-center">
                <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Mid tier */}
              <div className="flex justify-center mb-2">
                {midTier.map(s => (
                  <OrgNode key={s.id} specialist={s} isSelected={selectedId === s.id} onClick={() => setSelectedId(s.id)} />
                ))}
              </div>

              {/* Connector lines from mid to bottom (3 branches) */}
              <div className="relative h-6 mb-2">
                {/* Vertical from mid */}
                <div className="absolute left-1/2 top-0 w-px h-3 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.15)' }} />
                {/* Horizontal bar */}
                <div className="absolute top-3 left-1/4 right-1/4 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                {/* Three verticals down */}
                <div className="absolute top-3 left-1/4 w-px h-3 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <div className="absolute top-3 left-1/2 w-px h-3 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <div className="absolute top-3 left-3/4 w-px h-3 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Bottom tier */}
              <div className="flex items-start justify-center gap-4">
                {bottomTier.map(s => (
                  <OrgNode key={s.id} specialist={s} isSelected={selectedId === s.id} onClick={() => setSelectedId(s.id)} />
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-2xl p-5" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Live Activity Feed</p>
              </div>
              {activityFeed.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No communications yet. Send a message to a specialist to see it here.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityFeed.map((entry, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
                        <span className="text-xs font-bold" style={{ color: entry.color }}>{entry.specialist}</span>
                        <span className="text-[10px] text-slate-500 ml-auto">
                          {entry.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-1 truncate"><span className="text-slate-500">Q:</span> {entry.message}</p>
                      <p className="text-xs text-slate-400 line-clamp-2"><span className="text-slate-500">A:</span> {entry.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Chat Panel */}
          <div className="rounded-2xl flex flex-col" style={{ background: '#111', border: `1px solid ${selected.color}44`, minHeight: '600px', maxHeight: 'calc(100vh - 140px)' }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 rounded-t-2xl" style={{ background: `${selected.color}11`, borderBottom: `1px solid ${selected.color}33` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selected.color}22`, border: `1px solid ${selected.color}44` }}>
                <Bot className="w-5 h-5" style={{ color: selected.color }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: selected.color }}>{selected.name}</p>
                <p className="text-[11px] text-slate-400">{selected.desc}</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && !sending && (
                <div className="text-center py-12">
                  <Bot className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: selected.color }} />
                  <p className="text-sm text-slate-500">Send a message to {selected.name}</p>
                  <p className="text-xs text-slate-600 mt-1">Click any node on the org chart to switch specialists</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: m.role === 'user' ? '#333' : `${selected.color}22` }}>
                    {m.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-slate-400" />
                      : <Bot className="w-3.5 h-3.5" style={{ color: selected.color }} />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}
                    style={{
                      background: m.role === 'user' ? '#2a2a2a' : '#1a1a1a',
                      border: m.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${selected.color}22`,
                    }}>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: m.role === 'user' ? '#e0e0e0' : '#d0d0d0' }}>{m.content}</p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${selected.color}22` }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: selected.color }} />
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: '#1a1a1a', border: `1px solid ${selected.color}22` }}>
                    <p className="text-sm text-slate-500 italic">{selected.name} is thinking…</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 rounded-b-2xl" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${selected.name}…`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-40"
                  style={{ background: selected.color }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}