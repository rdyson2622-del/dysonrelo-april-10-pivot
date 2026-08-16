import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mic, Loader2, Navigation, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * BrokerageCommandPill — clickless voice/text command router.
 * Sits above the dummy roadmap cards. User speaks or types a natural-language
 * command ("take me to listings and my property on Liberty street") and is
 * auto-routed — no button click required.
 *
 * Voice: click mic once → speak → auto-transcribes → auto-routes.
 * Text: type → press Enter (or auto-submit after 1.2s pause) → auto-routes.
 */
export default function BrokerageCommandPill({ brokerageName }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [routing, setRouting] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [hint, setHint] = useState('');
  const recognitionRef = useRef(null);
  const autoSubmitTimer = useRef(null);

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
        setHint('Heard: "' + transcript + '" — routing…');
        // Auto-submit after transcription
        setTimeout(() => routeCommand(transcript), 300);
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
      setHint('Listening… speak your destination');
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const routeCommand = async (rawText) => {
    const cmd = (rawText || text).trim();
    if (!cmd) return;
    setRouting(true);
    setHint('Routing…');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a navigation router for a real estate brokerage portal. Parse the user's spoken or typed command and return the target page and optional subject query.

Available pages:
- dashboard (main brokerage dashboard)
- escrow (escrow / transaction milestones)
- listings (property listings — active and sold)
- agents (agent records and performance)
- marketing (campaigns and lead generation)
- luxury (luxury / prestige portfolio)

Examples:
"take me to listings and my property on Liberty street" → { target_page: "listings", subject_query: "Liberty street", action: "view" }
"show me escrow for 123 Main St" → { target_page: "escrow", subject_query: "123 Main St", action: "view" }
"open agent records" → { target_page: "agents", subject_query: "", action: "view" }
"who are my top agents" → { target_page: "agents", subject_query: "top", action: "view" }
"marketing campaigns" → { target_page: "marketing", subject_query: "", action: "view" }
"luxury portfolio" → { target_page: "luxury", subject_query: "", action: "view" }

User command: "${cmd.replace(/"/g, "'")}"`,
        response_json_schema: {
          type: 'object',
          properties: {
            target_page: { type: 'string', enum: ['dashboard', 'escrow', 'listings', 'agents', 'marketing', 'luxury'] },
            subject_query: { type: 'string', description: 'specific item to find — property address, agent name, escrow number, etc.' },
            action: { type: 'string', description: 'what they want to do (view, edit, create, etc.)' },
            confidence: { type: 'number' },
          },
        },
      });
      const data = res.data || res;
      const page = data?.target_page || 'dashboard';
      const subject = data?.subject_query || '';
      const action = data?.action || 'view';

      const route = page === 'dashboard' ? '/brokerage' : `/brokerage/${page}`;
      navigate(route, { state: { command: cmd, subject_query: subject, action } });
      setHint(`→ ${page}${subject ? ` · ${subject}` : ''}`);
      setText('');
    } catch (e) {
      console.error('Route parse failed:', e);
      setHint('Could not parse — try again.');
    } finally {
      setRouting(false);
    }
  };

  const onTextChange = (val) => {
    setText(val);
    setHint('');
    // Auto-submit after 1.2s pause (clickless typing)
    if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
    if (val.trim().length > 3) {
      autoSubmitTimer.current = setTimeout(() => routeCommand(val), 1200);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto mb-6">
      <div
        className="rounded-2xl px-4 py-3 transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.04))',
          border: `1.5px solid ${listening ? GOLD : `${GOLD}50`}`,
          boxShadow: listening ? `0 0 24px ${GOLD}30` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: listening ? 'rgba(239,68,68,0.15)' : `${GOLD}15`,
              border: `1.5px solid ${listening ? '#ef4444' : GOLD}`,
            }}
            title={listening ? 'Stop' : 'Speak to navigate'}
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

          {/* Text input — auto-submits */}
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
                routeCommand(text);
              }
            }}
            placeholder={listening ? 'Listening…' : 'Speak or type — "take me to listings and my property on Liberty street"'}
            className="flex-1 bg-transparent text-sm outline-none placeholder-stone-300"
            style={{ color: '#f5f5f0' }}
            disabled={routing}
          />

          {/* Status / route indicator */}
          <div className="shrink-0 flex items-center gap-2">
            {routing ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: GOLD }} />
            ) : (
              <Navigation className="w-4 h-4" style={{ color: `${GOLD}80` }} />
            )}
          </div>
        </div>

        {/* Hint line */}
        {(hint || listening) && (
          <div className="mt-2 flex items-center gap-1.5 px-1">
            <Sparkles className="w-3 h-3" style={{ color: listening ? '#ef4444' : GOLD }} />
            <p className="text-[11px]" style={{ color: listening ? '#ef4444' : GOLD }}>
              {hint || 'Listening… speak your destination'}
            </p>
          </div>
        )}
      </div>
      {!voiceSupported && !hint && (
        <p className="text-center text-[10px] text-gray-600 mt-1.5">
          Voice not supported in this browser — type your destination above
        </p>
      )}
    </div>
  );
}