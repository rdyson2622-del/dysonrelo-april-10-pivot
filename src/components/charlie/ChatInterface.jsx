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
{/* EMERGENCY COMMAND BAR */}
<div style={{ position: 'fixed', top: '0', left: '0', width: '100%', background: '#000', borderBottom: '2px solid #D4AF37', zIndex: '999999', padding: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
  <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>SYSTEM OVERRIDE:</span>
  <button 
    onClick={() => window.alert('ORDERING 10 LA LISTINGS >$2M... (Connecting to MLS Keys)')}
    style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '5px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
  >
    EXECUTE 10 LA LISTINGS
  </button>
</div>
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

export default function ChatInterface({ expanded = false, onToggleExpand, onClose, initialProfile = null, initialMessage = '' }) {
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

  const WELCOME_MESSAGE = `Hi! I'm Charlie — your Dyson & Dyson site guide. 👋\n\nI'm here to show you around and point you in the right direction. I'm not an advisor yet — that's coming soon when I'll be powered by Google AI Studio with full voice and knowledge.\n\nFor now, tell me what you're curious about and I'll direct you to the right place. Or tap below to get started:\n\n👉 **[Start Your Free Gemini Session](/GeminiSession)**`;

  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: WELCOME_MESSAGE,
      type: 'text',
    },
  ]);
  const [input, setInput] = useState(initialMessage);
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

    const cityGuideTopics = t.includes('neighborhood') || t.includes('area') || t.includes('school') ||
      t.includes('district') || t.includes('community') || t.includes('city guide') || t.includes('research') ||
      t.includes('cost of living') || t.includes('healthcare') || t.includes('hospital') || t.includes('park') ||
      t.includes('dining') || t.includes('culture') || t.includes('recreation');

    const agentTopics = t.includes('agent') || t.includes('realtor') || t.includes('broker');

    const cityName = profile?.destination_city || 'your destination city';
    const clientCommitted = profile?.buyer_broker_signed === true;
    const agentSelected = !!(profile?.agent_name);

    if (cityGuideTopics) {
      if (clientCommitted) {
        return {
          display: `Your **City Guide for ${cityName}** is fully unlocked! 🗺️\n\nHead to the City Guide tab and tap any category — Neighborhoods, Schools, Cost of Living, Healthcare, Parks, or Local Culture — for live AI research tailored to your specific move.\n\n👉 **[Open City Guide](/CityGuide)**`,
          spoken: `Your City Guide for ${cityName} is fully unlocked. Go tap any category for live personalized research right now.`
        };
      } else if (agentSelected) {
        return {
          display: `You're one step away from your full City Guide! 🙌\n\nYour agent — **${profile.agent_name}** — is your Boots on the Ground in ${cityName}. Now that they're selected, the last step is signing your **Buyer Broker Agreement** to formalize the relationship.\n\nOnce that's done, your deep-dive guide unlocks — tailored school data, neighborhood breakdowns, healthcare, cost of living — all filtered to your actual target area.\n\n👉 **[View Your Dashboard](/Dashboard)**`,
          spoken: `You're one step away. ${profile.agent_name} is your boots on the ground in ${cityName}. Sign your Buyer Broker Agreement and your full City Guide unlocks instantly.`
        };
      } else {
        return {
          display: `I can certainly help with general info about **${cityName}** — but to give you the deep-dive school data, neighborhood breakdowns, and healthcare research you actually need, we first have to get your **Boots on the Ground**. 👟\n\nThat means selecting your local expert agent. Here's why this matters:\n\n- School quality varies **block by block** — the right agent knows which side of the street matters\n- Neighborhood character can't be captured in a search result — your agent lives it\n- Healthcare, commute, community — all depend on exactly where you'll be\n\n**Selecting your agent is the key that unlocks your full moving plan.** It's free to you as the buyer.\n\n👉 **[Start Your Gemini Session](/GeminiSession)** — Bob Dyson personally selects your agent from there.`,
          spoken: `I can find you a house in ${cityName} — but to give you the deep-dive school and neighborhood data you need, we first have to get your Boots on the Ground by selecting your local expert agent. That's the key that unlocks your full moving plan. Start your Gemini session and Bob will personally select your agent.`
        };
      }
    }

    if (agentTopics) {
      if (agentSelected) {
        return {
          display: `You're all set with **${profile.agent_name}**! 🤝\n\nThey're your local expert on the ground in ${cityName}. If you have questions or want to update your preferences, just let me know — I'll make sure they're briefed.\n\nNext step: get your **Buyer Broker Agreement** signed to unlock your full City Guide and complete concierge service.\n\n👉 **[View Your Dashboard](/Dashboard)**`,
          spoken: `You're already matched with ${profile.agent_name}. They're your expert on the ground. Get your Buyer Broker Agreement signed and your full City Guide unlocks immediately.`
        };
      }
      return {
        display: `Agent matching is one of our most important services. 🤝\n\nBob Dyson personally reviews the top agents in **${cityName}** and hand-selects the right match for your personality, budget, and priorities. We don't just send referrals — we vet performance records, client reviews, and local expertise.\n\nSelecting your agent also unlocks your **City Guide** — so you get personalized neighborhood research at the same time.\n\n👉 **[Start Your Gemini Session](/GeminiSession)**`,
        spoken: `Bob Dyson personally selects your agent — reviewing performance records and client reviews to find the right match for your specific move. And selecting your agent is the first step to unlocking your full City Guide. Start with your Gemini session.`
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
        display: `Here's how Dyson & Dyson works:\n\n1. **Chat with me** — I orient you to the service\n2. **Gemini Live Session** — a private AI interview with Bob Dyson builds your full relocation profile\n3. **Agent Match** — we hand-select the best agent in ${cityName}\n4. **City Guide Unlocks** — personalized research across neighborhoods, schools, cost of living, and more\n5. **Full Concierge** — moving, utilities, healthcare, community connections all coordinated\n\n👉 **[Start Your Gemini Session](/GeminiSession)**`,
        spoken: `Here's how it works. Chat with me first. Then your Gemini session builds your full relocation profile. From there, we match you with the right agent for ${cityName}, your City Guide unlocks, and our full concierge service kicks in. All free.`
      };
    }
    // Default
    return {
      display: `I'm still getting my full voice and knowledge wired up — the real deep-dive AI experience is coming soon! 🚧\n\nFor now, I can point you in the right direction. The best next step is your **private Gemini session** with Bob Dyson — that's where real answers live.\n\n👉 **[Start Your Free Gemini Session](/GeminiSession)**\n\nOr reach Bob directly: **(405) 833-2622**`,
      spoken: `I'm still in my early wiring stage — but your Gemini session with Bob Dyson is where the real answers are. It's free. Click below to get started.`
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