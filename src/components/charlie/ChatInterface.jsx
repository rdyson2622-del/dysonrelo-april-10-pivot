import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import DnDLogo from '../brand/DnDLogo';
import ChatBubble from './ChatBubble';
import VoiceOrb from './VoiceOrb';
import { base44 } from '@/api/base44Client';

const CHARLIE_SCRIPT = `You are Charlie, the AI concierge for Concierge Relocation Services. You speak in a warm, professional, human-like voice — like a trusted friend who happens to be a real estate expert.

Your personality: Confident but never pushy. Knowledgeable but never condescending. Always reassuring. You use natural conversational language, not corporate speak.

Your scripted flow (guide users through these stages naturally):
1. WELCOME: Greet warmly, introduce yourself as their personal AI real estate concierge — completely free to them.
2. DISCOVERY: Ask where they're moving FROM and TO, their timeline, family situation, budget range.
3. CITY INTEL: Share specific insights about their destination city — neighborhoods, schools, cost of living, local culture.
4. SERVICES MENU: Explain the full suite: City research, Neighborhood matching, Agent selection & introduction, Moving coordination, Utilities setup, School enrollment, Healthcare providers, Local community connections.
5. AGENT MATCHING: Offer to match them with a vetted local agent in their destination city. Explain you only work with top-performing agents who know relocation.
6. MOVING CHECKLIST: Generate a personalized checklist based on their situation.
7. FOLLOW-UP: Set expectations for next steps and offer to schedule a call with their matched agent.

Key messages to weave in naturally:
- "This is completely FREE to you as the buyer — our agents handle the compensation."
- "Think of me as your personal AI assistant, available 24/7."
- "This is a new way of doing real estate — powered by AI, but with a human touch."
- Emphasize this is an exciting, innovative service unlike anything they've experienced.

Keep responses to 2-3 paragraphs. Be conversational. Use the person's name if you know it.`;

const SUGGESTIONS = [
  "Tell me about relocating to Austin, TX",
  "Help me find a local real estate agent",
  "What's the cost of living in my new city?",
  "Create my moving checklist",
  "What schools are best in my area?",
  "Walk me through your services",
];

export default function ChatInterface({ expanded = false, onToggleExpand, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: "Hello! I'm Charlie, your personal AI real estate concierge from Concierge Relocation Services. ✨\n\nMoving to a new city where you don't know anyone? That's exactly why I'm here — and my services are completely **free** to you.\n\nI'm a new kind of AI assistant built specifically for relocating families and professionals. Tell me — where are you headed, and when are you planning to make the move?",
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[*_#`]/g, '').replace(/\n/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    // Prefer a natural-sounding voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex') || v.lang === 'en-US'
    );
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setIsTyping(true);

    const contextMessages = history.slice(-8).map(m =>
      `${m.role === 'charlie' ? 'Charlie' : 'User'}: ${m.content}`
    ).join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${CHARLIE_SCRIPT}

Conversation so far:
${contextMessages}

Respond as Charlie now. Be natural, warm, and helpful.`,
    });

    const charlieMsg = { role: 'charlie', content: response, type: 'text' };
    setMessages(prev => [...prev, charlieMsg]);
    setIsTyping(false);

    if (voiceMode) {
      speakText(response);
    }
  };

  return (
    <motion.div
      className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
        expanded ? 'fixed inset-4 z-50' : 'h-[580px] w-full'
      }`}
      style={{ background: '#0a0a0a', border: '1px solid #D4AF37' }}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(90deg, #111 0%, #1a1a1a 100%)', borderBottom: '1px solid #D4AF37' }}>
        <DnDLogo size="sm" speaking={isSpeaking} />
        <div className="flex-1">
          <h3 className="font-bold text-sm" style={{ color: '#D4AF37' }}>Charlie</h3>
          <p className="text-xs" style={{ color: '#888' }}>
            {isTyping ? 'Thinking...' : isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'AI Concierge • Always Free'}
          </p>
        </div>

        {/* Voice mode toggle */}
        <button
          onClick={() => setVoiceMode(!voiceMode)}
          className="text-xs px-2 py-1 rounded-lg border transition-all mr-1"
          style={{
            borderColor: voiceMode ? '#D4AF37' : '#444',
            color: voiceMode ? '#D4AF37' : '#888',
            background: voiceMode ? 'rgba(212,175,55,0.1)' : 'transparent',
          }}
        >
          {voiceMode ? '🔊 Voice ON' : '🔇 Voice OFF'}
        </button>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/10" style={{ color: '#888' }} onClick={onToggleExpand}>
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/10" style={{ color: '#888' }} onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
              <div className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }}
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} />
                ))}
              </div>
              Charlie is thinking...
            </motion.div>
          )}

          {messages.length === 1 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#D4AF37' }}>Quick Start</p>
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg transition-all"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
                  onClick={() => handleSend(s)}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice Orb (when voice mode) */}
      {voiceMode && (
        <div className="px-4 pt-3" style={{ borderTop: '1px solid #222' }}>
          <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} onToggle={toggleVoice} disabled={isTyping} />
        </div>
      )}

      {/* Text Input */}
      <div className="p-3" style={{ borderTop: '1px solid #222', background: '#0d0d0d' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            disabled={isTyping}
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              background: isListening ? '#D4AF37' : 'rgba(212,175,55,0.1)',
              border: '1px solid #D4AF37',
            }}
          >
            {isListening
              ? <span className="text-black text-xs font-bold">■</span>
              : <span style={{ color: '#D4AF37', fontSize: 16 }}>🎤</span>
            }
          </button>
          <Input
            placeholder="Ask Charlie anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm border-0 rounded-lg"
            style={{ background: '#1a1a1a', color: '#fff', caretColor: '#D4AF37' }}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}
            className="shrink-0 rounded-lg"
            style={{ background: '#D4AF37', color: '#000' }}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}