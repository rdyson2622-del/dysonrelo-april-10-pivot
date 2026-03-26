import React, { useState, useRef, useEffect } from 'react'; // useRef kept for messagesEndRef
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, MessageCircle, Map, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
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

  const WELCOME_MESSAGE = `Hi! I'm Charlie — your Dyson & Dyson site guide. 👋\n\nI'm here to show you around and point you in the right direction. I'm not an advisor yet — that's coming soon when I'll be powered by Google AI Studio with full voice and knowledge.\n\nFor now, tell me what you're curious about and I'll direct you to the right place.`;

  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: WELCOME_MESSAGE,
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  // Cleanup on unmount only
  useEffect(() => {
    return () => stopCharlie();
  }, []);

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
  const getSpokeResponse = (text) => {
    const t = text.toLowerCase();

    if (t.includes('neighborhood') || t.includes('area') || t.includes('where') || t.includes('city')) {
      return {
        display: `Great question about neighborhoods — but that's exactly what our **Gemini Live Session** is built for! 🗺️\n\nIn that session, Bob Dyson and Gemini AI will dive deep into your destination city — neighborhoods, schools, commute, lifestyle fit — all in real time.\n\n👉 **[Start Your Gemini Session](/GeminiSession)**\n\nThis service is 100% free to you.`,
        spoken: `Neighborhoods, schools, commute — that's exactly what your private Gemini session with Bob Dyson is built for. It's free. Click below to begin.`
      };
    }
    if (t.includes('agent') || t.includes('realtor') || t.includes('broker')) {
      return {
        display: `Agent matching is one of our specialties! 🤝\n\nBob Dyson personally reviews the top agents in your destination market and matches you based on your personality and needs.\n\nComplete your **Gemini intake session** first so we know exactly what you need.\n\n👉 **[Begin Your Session](/GeminiSession)**`,
        spoken: `Bob Dyson hand-selects your agent personally. To get matched, start with your Gemini session — it's completely free.`
      };
    }
    if (t.includes('cost') || t.includes('free') || t.includes('fee') || t.includes('price')) {
      return {
        display: `Our service is **100% free to you as the buyer.** Always. 🎉\n\nWe're compensated through a referral arrangement with your agent at close — you never pay us directly, and there are no hidden fees.\n\n👉 **[Start Your Gemini Session](/GeminiSession)**`,
        spoken: `Our service is one hundred percent free to you as the buyer. Always. Your agent handles our compensation at close.`
      };
    }
    if (t.includes('start') || t.includes('begin') || t.includes('how') || t.includes('next')) {
      return {
        display: `Here's how Dyson & Dyson works:\n\n1. **Chat with me** — I orient you to the service\n2. **Gemini Live Session** — a private AI interview with Bob Dyson builds your full relocation profile\n3. **Agent Match** — we hand-select the best agents in your destination city\n4. **Relocation Plan** — moving, schools, utilities, healthcare all coordinated\n\n👉 **[Start Your Gemini Session](/GeminiSession)**`,
        spoken: `Here's how it works. Chat with me first. Then your private Gemini session with Bob Dyson builds your full relocation profile. From there, we match you with the right agent. All free.`
      };
    }
    // Default
    return {
      display: `Got it — I've received your request. While I'm still learning, I've passed this to both our human relocation specialists and deep-learning AI experts who will get you the answers you're looking for. 🤝\n\nIn the meantime, the fastest path to real answers is your **private Gemini session** with a Dyson Relocation Specialist.\n\n👉 **[Start Your Free Gemini Session](/GeminiSession)**\n\nOr reach Dyson & Dyson directly: **(858) 353-1200**`,
      spoken: `Got it. I've passed your request to both our human specialists and deep-learning AI experts. Your Gemini session is the fastest path to real answers — it's completely free.`
    };
  };

  const handleSend = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping || isSpeaking) return;

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Small delay to feel natural
    setIsTyping(true);
    stopCharlie();
    setTimeout(() => {
      const { display, spoken } = getSpokeResponse(messageText);
      const charlieMsg = { role: 'charlie', content: display, type: 'text' };
      setMessages(prev => [...prev, charlieMsg]);
      setIsTyping(false);
      speakAsCharlie(spoken, () => setIsSpeaking(true), () => setIsSpeaking(false));
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
            {isTyping ? 'Looking that up...' : isSpeaking ? 'Speaking...' : 'Site Guide • Full AI Coming Soon'}
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
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                placeholder="Tell me what you're looking for..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-sm border-0 rounded-lg"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping || isSpeaking}
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