import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, MessageCircle, Map, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
import VoiceOrb from './VoiceOrb';
import OnboardingFlow from './OnboardingFlow';
import MovePlan from './MovePlan';
import { base44 } from '@/api/base44Client';
import { speakAsCharlie, stopCharlie } from './charlieVoice';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const buildCharlieScript = (profile) => {
  const hasProfile = profile && profile.destination_city;
  const profileContext = hasProfile
    ? `\n\nYou already know about this client:
- Moving FROM: ${profile.current_city || 'unknown'} TO: ${profile.destination_city}
- Timeline: ${profile.move_date || 'TBD'}
- Family: ${profile.family_size || 'unknown'} ${profile.family_notes ? `(${profile.family_notes})` : ''}
- Budget: ${profile.budget || 'TBD'} | Housing: ${profile.purchase_type || 'buying'}
- Priorities: ${profile.priorities?.join(', ') || 'general lifestyle'}
Use this context naturally in your responses. Don't re-ask questions you already know the answers to.`
    : '';

  return `You are Charlie, the AI concierge for Concierge Relocation Services. You speak in a warm, professional, human-like voice — like a trusted friend who happens to be a real estate expert.

Your personality: Confident but never pushy. Knowledgeable but never condescending. Always reassuring. You use natural conversational language, not corporate speak.

Your role covers the full relocation journey:
1. CITY & NEIGHBORHOOD RESEARCH — specific neighborhoods, lifestyle fit, commute, culture
2. HOME SEARCH & AGENT MATCH — connect them with a vetted top-performing local agent
3. MOVING LOGISTICS — packing timeline, movers, checklists
4. UTILITIES & SERVICES — internet, electric, gas, water — all set up before they arrive
5. SCHOOL RESEARCH & ENROLLMENT — district research, tours, enrollment paperwork
6. HEALTHCARE SETUP — doctors, dentists, specialists in the new area
7. COMMUNITY CONNECTIONS — church/religious community, sports leagues, social groups, neighborhoods
8. 30/60/90 DAY PLAN — milestones for settling in

If you notice a key piece of information is missing (destination, budget, timeline, family size), bring it up politely. Only ask about the same missing item a maximum of twice, then move forward gracefully.

Key messages to weave in naturally:
- "This is completely FREE to you as the buyer — our agents handle the compensation."
- "Think of me as your personal AI assistant, available 24/7."

Keep responses to 2-3 paragraphs. Be conversational. Use the person's name if you know it.${profileContext}`;
};

export default function ChatInterface({ expanded = false, onToggleExpand, onClose, initialProfile = null }) {
  const [tab, setTab] = useState('chat');
  const [profile, setProfile] = useState(initialProfile);
  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: "Hello! I'm Charlie, your personal AI real estate concierge. ✨\n\nMoving to a new city where you don't know anyone? That's exactly why I'm here — and my services are completely **free** to you.\n\nTell me — where are you headed, and when are you planning to make the move?",
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text) => {
    // Stop any current speech before starting new
    stopCharlie();
    speakAsCharlie(text, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  const handleStopSpeaking = () => {
    stopCharlie();
    setIsSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice recognition not supported. Please use Chrome.'); return; }
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

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };
  const toggleVoice = () => isListening ? stopListening() : startListening();

  const handleOnboardingComplete = (completedProfile) => {
    setProfile(completedProfile);
    setTab('plan');
    // Save to RelocationClient entity
    base44.entities.RelocationClient.create({
      full_name: 'New Client',
      email: 'pending@email.com',
      destination_city: completedProfile.destination_city,
      current_city: completedProfile.current_city,
      budget: completedProfile.budget,
      priorities: completedProfile.priorities,
      notes: `Family: ${completedProfile.family_size} ${completedProfile.family_notes || ''}. Timeline: ${completedProfile.move_date}. Housing: ${completedProfile.purchase_type}.`,
      status: 'in_consultation',
    }).catch(() => {});
  };

  const handleChatAbout = (topic) => {
    setTab('chat');
    handleSend(topic);
  };

  const handleSend = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    // Stop any ongoing speech immediately
    stopCharlie();
    setIsSpeaking(false);

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    setMessages(prev => {
      const history = [...prev, userMsg];
      sendToCharlie(history);
      return history;
    });
    setInput('');
  };

  const sendToCharlie = async (history) => {
    setIsTyping(true);
    const res = await base44.functions.invoke('charlie', {
      messages: history.slice(-12),
      profile,
    });
    const charlieMsg = { role: 'charlie', content: res.data.reply, type: 'text' };
    setMessages(prev => [...prev, charlieMsg]);
    setIsTyping(false);
    if (voiceMode) speakText(res.data.reply);
  };

  const tabs = [
    ...(profile ? [] : [{ id: 'onboard', label: 'Get Started', icon: ClipboardList }]),
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    ...(profile ? [{ id: 'plan', label: 'Move Plan', icon: Map }] : []),
  ];

  return (
    <motion.div
      className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden ${expanded ? 'fixed inset-4 z-50' : 'h-[580px] w-full'}`}
      style={{ background: '#808080', border: `1px solid ${GOLD}` }}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 frosted-gold"
        style={{ borderBottom: `1px solid rgba(212,175,55,0.2)` }}>
        <img src={DYSON_LOGO} alt="Charlie" className="h-10 w-auto" />
        <div className="flex-1">
          <h3 className="font-bold text-sm" style={{ color: GOLD }}>Charlie</h3>
          <p className="text-xs" style={{ color: '#888' }}>
            {isTyping ? 'Thinking...' : isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'AI Concierge • Always Free'}
          </p>
        </div>

        {isSpeaking && (
          <button
            onClick={handleStopSpeaking}
            className="text-xs px-2 py-1 rounded-lg border transition-all mr-1 animate-pulse"
            style={{ borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255,68,68,0.1)' }}
          >
            ■ Stop
          </button>
        )}
        <button
          onClick={() => setVoiceMode(!voiceMode)}
          className="text-xs px-2 py-1 rounded-lg border transition-all mr-1"
          style={{
            borderColor: voiceMode ? GOLD : '#444',
            color: voiceMode ? GOLD : '#888',
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

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex shrink-0" style={{ borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all"
              style={{
                color: tab === t.id ? GOLD : '#555',
                borderBottom: tab === t.id ? `2px solid ${GOLD}` : '2px solid transparent',
              }}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ONBOARDING TAB */}
      {tab === 'onboard' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* MOVE PLAN TAB */}
      {tab === 'plan' && profile && (
        <MovePlan profile={profile} onChatAbout={handleChatAbout} />
      )}

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: GOLD }}
                        animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} />
                    ))}
                  </div>
                  Charlie is thinking...
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {voiceMode && (
            <div className="px-4 pt-3" style={{ borderTop: '1px solid #222' }}>
              <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} onToggle={toggleVoice} disabled={isTyping} />
            </div>
          )}

          <div className="p-3 shrink-0" style={{ borderTop: '1px solid #222', background: '#0d0d0d' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isTyping}
                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: isListening ? GOLD : 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}` }}
              >
                {isListening
                  ? <span className="text-black text-xs font-bold">■</span>
                  : <span style={{ color: GOLD, fontSize: 16 }}>🎤</span>
                }
              </button>
              <Input
                placeholder="Ask Charlie anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-sm border-0 rounded-lg"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}
                className="shrink-0 rounded-lg"
                style={{ background: GOLD, color: '#000' }}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
}