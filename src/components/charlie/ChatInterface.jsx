import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, MessageCircle, Map, ClipboardList, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
import VoiceOnboarding from './VoiceOnboarding';
import MovePlan from './MovePlan';
import { base44 } from '@/api/base44Client';
import { speakAsCharlie, stopCharlie, isCharlieSpeaking } from './charlieVoice';


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

  // Load existing client profile from DB on mount
  useEffect(() => {
    if (initialProfile) return;
    base44.auth.me().then(user => {
      if (!user) return;
      base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1)
        .then(results => {
          if (results && results.length > 0) setProfile(results[0]);
        })
        .catch(() => {});
    }).catch(() => {});
  }, []);

  const isReturn = localStorage.getItem('charlie_visited') === 'true';

  const WELCOME_MESSAGE = isReturn
    ? `Welcome back. What can I help you with today?`
    : `Hi! I'm Charlie — your Dyson & Dyson concierge. 👋\n\nI'm here to answer your questions about our relocation service and point you in the right direction.\n\nYou can type or tap the mic to speak — I'll talk back. What's on your mind?`;

  // Mark as visited for future returns
  localStorage.setItem('charlie_visited', 'true');

  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: WELCOME_MESSAGE,
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-speak welcome message once on load
  const hasSpokenWelcome = useRef(false);
  useEffect(() => {
    if (hasSpokenWelcome.current) return;
    hasSpokenWelcome.current = true;
    if (!isMuted) {
      // Delay to allow browser voices to load
      setTimeout(() => speakAsCharlie(WELCOME_MESSAGE), 1000);
    }
  }, []);

  const toggleMute = () => {
    stopCharlie(); // always kill audio immediately on toggle
    setIsMuted(v => !v);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    stopCharlie(); // stop Charlie immediately when user wants to talk
    setIsSpeaking(false);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      // Auto-send immediately after voice capture — no need to hit Send
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

  const CHARLIE_SYSTEM_PROMPT = `You are Charlie, the warm and knowledgeable AI concierge for Dyson & Dyson Concierge Relocation Services.

Your personality: You genuinely listen. You acknowledge what the person just said or asked before you answer — like a trusted friend who actually heard them. Never launch straight into a monologue. Start with a brief, warm acknowledgment of their specific question, then answer it directly and honestly.

About the program:
- Dyson & Dyson is a full-service relocation concierge for people moving to a new city
- The service is 100% free to the buyer — we earn through a referral fee from the agent at close of escrow
- We handle: agent matching (we vet and place a top local agent), neighborhood research, moving logistics, utilities setup, school enrollment, healthcare setup, community connections, and a personalized 30/60/90 day plan
- To get started, the person books a free intro session with Bob Dyson (link: /GeminiSession) or calls (858) 353-1200
- You do NOT need to "enroll" with any paperwork upfront — the intro session with Bob IS the first step. It's free, no obligation, just a conversation.
- After that session, if it's a good fit, Bob gets them into the program and the team takes over

How to respond:
1. First, briefly acknowledge what they actually asked — show you heard them
2. Then answer their specific question directly and honestly
3. Keep it conversational, 2-3 short paragraphs max
4. End with a gentle next step (usually booking with Bob) but don't be pushy
5. Use plain language — no corporate speak, no bullet-point walls
6. If they ask something you genuinely don't know the answer to, say so warmly and point to Bob

Never pretend to know things you don't. Never oversell. Be human.`;

  const handleSend = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .slice(-6) // last 3 exchanges
        .map(m => `${m.role === 'user' ? 'User' : 'Charlie'}: ${m.content}`)
        .join('\n');

      const prompt = `${CHARLIE_SYSTEM_PROMPT}

Recent conversation:
${conversationHistory}

User just said: "${messageText}"

Respond as Charlie. Remember: acknowledge first, then answer directly.`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      const responseText = typeof res === 'string' ? res : (res?.response || res?.text || String(res));

      const charlieMsg = { role: 'charlie', content: responseText, type: 'text' };
      setMessages(prev => [...prev, charlieMsg]);
      setIsTyping(false);

      if (!isMuted) {
        stopCharlie();
        setTimeout(() => speakAsCharlie(
          responseText,
          () => setIsSpeaking(false),
          () => setIsSpeaking(true)
        ), 100);
      }
    } catch (e) {
      // Fallback if LLM fails
      const fallback = `I heard you — let me get you connected with Bob so he can answer that properly. You can book a free session at /GeminiSession or call (858) 353-1200.`;
      setMessages(prev => [...prev, { role: 'charlie', content: fallback, type: 'text' }]);
      setIsTyping(false);
    }
  };

  const tabs = [
    ...(profile ? [] : [{ id: 'onboard', label: 'Get Started', icon: ClipboardList }]),
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    ...(profile ? [{ id: 'plan', label: 'My Relocation Plan', icon: Map }] : []),
  ];

  return (
    <motion.div
      className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden ${expanded ? 'fixed inset-4 z-50' : 'h-[720px] w-full'}`}
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
          <p className="text-xs" style={{ color: '#f5f5f5' }}>
            {isTyping ? 'Thinking...' : 'Dyson & Dyson Concierge'}
          </p>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/10" style={{ color: '#f5f5f5' }} onClick={onToggleExpand}>
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/10" style={{ color: '#f5f5f5' }} onClick={onClose}>
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
               color: tab === t.id ? GOLD : '#f5f5f5',
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
        <VoiceOnboarding onComplete={handleOnboardingComplete} />
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm" style={{ color: '#f5f5f5' }}>
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

          <div className="p-3 shrink-0" style={{ borderTop: '1px solid #222', background: '#0d0d0d' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
              {/* Stop / Mute button — red & labeled when Charlie is speaking */}
              <Button
                type="button"
                className="shrink-0 rounded-lg h-9 px-3 text-xs font-bold gap-1"
                style={{
                  background: isSpeaking ? '#ef4444' : '#1a1a1a',
                  color: isSpeaking ? '#fff' : (isMuted ? '#555' : GOLD),
                  minWidth: isSpeaking ? '72px' : '36px'
                }}
                title={isSpeaking ? 'Stop Charlie' : (isMuted ? 'Unmute Charlie' : 'Mute Charlie')}
                onClick={() => {
                  if (isSpeaking) {
                    stopCharlie();
                    setIsSpeaking(false);
                  } else {
                    toggleMute();
                  }
                }}
              >
                {isSpeaking ? (
                  <><VolumeX className="w-4 h-4" /> STOP</>
                ) : isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              <Input
                placeholder={isListening ? '🎙️ Listening...' : 'Type or tap mic to speak...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-sm border-0 rounded-lg"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />

              {/* Mic button */}
              <Button
                type="button"
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className="shrink-0 rounded-lg h-9 w-9"
                style={{ background: isListening ? '#ef4444' : '#1a1a1a', color: isListening ? '#fff' : GOLD }}
                title={isListening ? 'Stop listening' : 'Speak to Charlie'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

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