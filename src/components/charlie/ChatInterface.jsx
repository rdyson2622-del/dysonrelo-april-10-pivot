import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, MessageCircle, Map, ClipboardList, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
import OnboardingFlow from './OnboardingFlow';
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

  const WELCOME_MESSAGE = `Hi! I'm Charlie — your Dyson & Dyson site guide. 👋\n\nI'm here to show you around and point you in the right direction. For now, tell me what you're curious about and I'll direct you to the right place.\n\nAnd soon — we'll actually be voice-to-voice. I'm excited to meet you that way and be able to provide answers and save all your information instantly. 🎙️`;

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
    stopCharlie(); // stop Charlie speaking when user wants to talk
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

  // Returns { display: string, spoken: string }
  // No auto-navigate — links appear in chat, user clicks when ready
  const getSpokeResponse = (text) => {
    const t = text.toLowerCase();

    if (t.includes('neighbor') || t.includes('area') || t.includes('where') || t.includes('city') || t.includes('city guide')) {
      return {
        display: `Great question about neighborhoods! Head over to the City Guide to explore neighborhoods, schools, commute, and lifestyle fit for your destination.\n\n👉 **[Open City Guide](/CityGuide)**`,
        spoken: `Great question about neighborhoods. Head over to the City Guide to explore neighborhoods, schools, commute, and lifestyle fit for your destination.`
      };
    }
    if (t.includes('agent') || t.includes('realtor') || t.includes('broker')) {
      return {
        display: `Agent matching is one of our specialties! Start your Gemini session to tell us about your ideal agent personality and needs — we'll find your perfect match.\n\n👉 **[Start Agent Matching](/GeminiSession)**`,
        spoken: `Agent matching is one of our specialties. Start your Gemini session to tell us about your ideal agent personality and needs.`
      };
    }
    if (t.includes('cost') || t.includes('free') || t.includes('fee') || t.includes('price')) {
      return {
        display: `Our service is **100% free to you as the buyer.** Always.\n\nWe're compensated through a referral arrangement with your agent at close — you never pay us directly, and there are no hidden fees.\n\n👉 **[Start Your Free Session](/GeminiSession)**`,
        spoken: `Our service is one hundred percent free to you as the buyer. Always. Your agent handles our compensation at close — you never pay us a dime.`
      };
    }
    if (t.includes('start') || t.includes('begin') || t.includes('how') || t.includes('next') || t.includes('move objective') || t.includes('commit') || t.includes('relocation journey') || t.includes('process')) {
      return {
        display: `Let me show you exactly how our process works. Click below to see the full Relocation Journey and commit to your personalized plan.\n\n👉 **[View Relocation Journey](/RelocationRoadmap)**`,
        spoken: `Our process is straightforward. Click the link to see the full Relocation Journey and commit to your personalized plan.`
      };
    }
    // Default
    return {
      display: `Got it! I've noted your question. While I'm still ramping up my full AI capabilities, the fastest path to real answers is your private Gemini session with a Dyson Relocation Specialist — completely free.\n\n👉 **[Start Your Gemini Session](/GeminiSession)**\n\nOr call Bob directly: **(858) 353-1200**`,
      spoken: `Got it. The fastest path to real answers is your Gemini session with a Dyson Relocation Specialist. It's completely free, and Bob is also available at 858-353-1200.`
    };
  };

  const handleSend = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Small delay to feel natural
    setIsTyping(true);
    setTimeout(() => {
      const { display, spoken, navigate } = getSpokeResponse(messageText);
      const charlieMsg = { role: 'charlie', content: display, type: 'text' };
      setMessages(prev => [...prev, charlieMsg]);
      setIsTyping(false);

      if (!isMuted) {
        stopCharlie();
        setTimeout(() => speakAsCharlie(
          spoken || display,
          () => setIsSpeaking(false),
          () => setIsSpeaking(true)
        ), 100);
      }
    }, 1200);
  };

  const tabs = [
    ...(profile ? [] : [{ id: 'onboard', label: 'Get Started', icon: ClipboardList }]),
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    ...(profile ? [{ id: 'plan', label: 'My Relocation Plan', icon: Map }] : []),
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
          <p className="text-xs" style={{ color: '#f5f5f5' }}>
            {isTyping ? 'Looking that up...' : 'Site Guide • Full AI Coming Soon'}
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