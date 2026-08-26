import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Loader2, Send } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * AskCharliePill — the bottom-left "Ask Charlie a question about this
 * portal" widget for Guest Pass preview pages. No login required; answers
 * are generated fresh per question, scoped to this prospect's context.
 */
export default function AskCharliePill({ agentName, city }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [asking, setAsking] = useState(false);
  const firstName = (agentName || '').split(' ')[0];

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || asking) return;
    setAsking(true);
    setReply('');
    try {
      const res = await base44.functions.invoke('guestCharliePreview', { question: question.trim(), agent_name: agentName, city });
      setReply(res.data?.reply || "Sorry, I couldn't get an answer just now.");
    } catch {
      setReply("Sorry, I couldn't get an answer just now.");
    }
    setAsking(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div className="mb-3 w-80 rounded-2xl p-4" style={{ background: '#161616', border: `1px solid ${GOLD}40`, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          <p className="text-sm text-white mb-3">
            Hi {firstName || 'there'}, I'm Charlie. I guide all your clients through their moves. What would you like to know about our process?
          </p>
          {reply && <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{reply}</p>}
          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question…"
              disabled={asking}
              className="flex-1 bg-transparent text-sm text-white outline-none rounded-lg p-2 placeholder-stone-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
            />
            <button type="submit" disabled={asking || !question.trim()} className="px-3 rounded-lg disabled:opacity-40" style={{ background: GOLD }}>
              {asking ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4 text-black" />}
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
        style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, color: GOLD, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
      >
        {open ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        Ask Charlie
      </button>
    </div>
  );
}