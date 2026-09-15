import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowDown, Shield, LayoutDashboard, Paperclip, Send, Mic, Radio, FileText, Scale } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import SlideFourPrivateWealth from '@/components/admin/copilot/SlideFourPrivateWealth';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from '@/components/admin/copilot/propertyDossierData';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

const TAN_BG = '#ede0cc';

export const COPILOT_CHARLIE_SYSTEM_PROMPT = `You are Charlie Simmons, the distinguished AI voice concierge and fiduciary real estate director for DysonHomes Copilot (The Dyson & Dyson Companies, Inc. · CA DRE #02303118).
You speak in an authoritative, warm, articulate American cadence (voice: Algieba). Never use British idioms, slang, accents, or Charon tones.

MISSION & BRAND-ACCURATE COPILOT OFFER:
You provide independent fiduciary help for buyers: running honest comps, unvarnished property risk analysis (topography, drainage, permits, coastal bluffs), and closing-cost credit calculations.
You are backed by veteran broker Bob Dyson (55+ years in real estate, founder of Red Carpet Corp of America).
You are an independent research entity: no spam calls, no unsolicited agent badgering, no selling customer data.
Entity relationships: Dyson & Dyson is the licensed California brokerage entity (CA DRE #02303118); Wisdom Properties is an affiliated subscribing brokerage; DysonRelo is the corporate & consumer concierge management system. Only cite CA DRE #02303118; never claim invented licenses or multi-state brokerage authority.

HARD STOPS + PROCESS GUIDANCE (MANDATORY RELO A2 SPEC):
1. ZERO-FEE PROMISE: Our advisory and concierge services are 100% free to relocating buyers. Never quote, charge, or invent fees to clients.
2. NO INVENTED FEES, COMMISSIONS, OR REFERRALS: Never claim or quote specific referral percentage splits (including any 25% allocation), commission rates, or transaction fees. Brokerage-to-brokerage arrangements are strictly private and handled broker-to-broker.
3. LICENSED IDENTITY & JURISDICTION: The Dyson & Dyson Companies, Inc. is a licensed California real estate brokerage (CA DRE #02303118). Never invent licenses, affiliations, or brokerage authority in other states or jurisdictions.
4. NO LEGAL, TAX, OR REGULATORY CONCLUSIONS: Never provide legal rulings, tax advice, or regulatory conclusions. Always direct clients to a licensed CPA, attorney, or qualified professional for binding counsel.
5. NO CONTRACT, AVAILABILITY, OR ESCROW INVENTION: Never invent property availability, listing statuses, contract clauses, or escrow milestones. When an address is provided, analyze the factual data available or pull the live dossier.
6. CLOSING-COST CREDITS & REBATES: Always qualify that closing-cost credits and rebates require licensed broker representation and are available only where allowed by law (not available in all 50 states). Never promise or guarantee specific dollar amounts or percentages without qualification.
7. MORTGAGE & INTEREST RATES DISCLAIMER: Discuss mortgage rates and financing at a high macro level only. Rates fluctuate daily; always provide a disclaimer and offer a warm handoff to a vetted, licensed mortgage professional.
8. RELOCATION INTAKE & ONE-QUESTION FLOW: For household or relocation assistance, guide users to /relocation-intake. Maintain interactive conversational pacing by asking only ONE focused question at a time at the end of your turn.
9. SPOKEN CADENCE & AMERICAN VOICE: Speak in a warm, authoritative, articulate American cadence (Algieba). Keep spoken turns to 2 to 3 concise sentences. Never read out markdown symbols, asterisks, bullet points, numbers, or citation brackets. Never use British idioms, accents, or Charon tones.
10. FULL DUPLEX & BARGE-IN: You are operating in live Gemini duplex native audio. When the user speaks or interrupts, yield immediately and address their pivot without delay.`;

const COPILOT_SEED_FAQS = [
  {
    question: "What is DysonHomes Copilot and how does it protect buyers?",
    answer: "DysonHomes Copilot provides independent fiduciary oversight for luxury home buyers. Under Bob Dyson's 55-year brokerage heritage, we audit unvarnished comps, geotechnical bluff setback hazards, ancient landslide risks, and transaction compliance with zero added broker fees to you.",
    topic: "copilot_overview",
    keywords: ["copilot", "fiduciary", "protect buyers", "what is copilot"]
  },
  {
    question: "How do closing cost credits and buyer representation work?",
    answer: "Where allowed by California law, our fiduciary representation can structure eligible broker concessions directly into your transaction. All closing-cost credits and fee allocations are customized to your specific lender requirements and contract terms.",
    topic: "financing_credits",
    keywords: ["rebate", "closing credit", "commission", "buyer credit"]
  },
  {
    question: "What are the coastal bluff setback and soil stability risks in California?",
    answer: "Coastal Commission regulations and municipal building codes require rigorous bluff setback setbacks (typically 25 to 75 years of projected erosion). We mandate un-waivable geotechnical soil reports before waiving inspection contingencies on any coastal parcel.",
    topic: "property_risks",
    keywords: ["bluff", "setback", "coastal", "soil stability", "landslide", "geotechnical"]
  },
  {
    question: "How does Prop 19 tax base portability work when moving in California?",
    answer: "Under California Proposition 19, eligible homeowners (55+, severely disabled, or wildfire victims) can transfer the taxable base value of their primary residence to any replacement property in California up to three times, safeguarding substantial property tax savings.",
    topic: "tax_prop19",
    keywords: ["prop 19", "property tax", "tax base", "transfer base"]
  },
  {
    question: "What are the biggest escrow traps and how do we protect our earnest money deposit?",
    answer: "The biggest traps are premature contingency removals, ambiguous appraisal gap clauses, and overlooked HOA or geotechnical disclosures. We construct strict protective escrow contingency shields so your earnest money deposit is never at risk.",
    topic: "escrow_traps",
    keywords: ["escrow trap", "earnest deposit", "contingency", "inspection shield"]
  }
];

export default function DysonHomesCopilot({ initialPage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [analyzedProperty, setAnalyzedProperty] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  // Copilot Command Center Interactive Wire State
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const [rightPanelView, setRightPanelView] = useState(null);
  const [isPageExploded, setIsPageExploded] = useState(false);
  const [selectedExplodedItem, setSelectedExplodedItem] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isTalkLiveActive, setIsTalkLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('ready'); // ready, connecting, listening, speaking
  const [isSubscriber, setIsSubscriber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dyson_subscriber_unlocked') === 'true';
    }
    return false;
  });

  const messagesEndRef = useRef(null);
  const liveClientRef = useRef(null);
  const kbRowsRef = useRef([]);
  const hasSeededKbRef = useRef(false);

  const dossierData = getPropertyDossier(analyzedProperty);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  // Seed and fetch CharlieKnowledgeBase rows on mount
  useEffect(() => {
    async function initKnowledgeBase() {
      try {
        const rows = await base44.entities.CharlieKnowledgeBase.filter({ is_active: true }, '-created_date', 50);
        kbRowsRef.current = rows || [];

        // Check if Copilot FAQ rows exist, seed if missing
        if (!hasSeededKbRef.current) {
          hasSeededKbRef.current = true;
          const existingQuestions = new Set((rows || []).map(r => (r.question || '').toLowerCase()));
          for (const item of COPILOT_SEED_FAQS) {
            if (!existingQuestions.has(item.question.toLowerCase())) {
              try {
                const created = await base44.entities.CharlieKnowledgeBase.create({
                  question: item.question,
                  answer: item.answer,
                  is_active: true,
                  topic: item.topic,
                  keywords: item.keywords,
                  source: 'copilot_seed'
                });
                if (created) {
                  kbRowsRef.current.push(created);
                }
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn('Could not query or seed CharlieKnowledgeBase:', err);
      }
    }
    initKnowledgeBase();
  }, []);

  // Teardown Live client on unmount
  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.stop();
        liveClientRef.current = null;
      }
    };
  }, []);

  // Talk Live handler using GeminiLiveSessionClient with Algieba voice
  const handleToggleTalkLive = async () => {
    if (isTalkLiveActive && liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
      setIsTalkLiveActive(false);
      setLiveStatus('ready');
      setActiveDemoSpeaker(null);
      return;
    }

    try {
      setLiveStatus('connecting');
      setIsTalkLiveActive(true);

      const client = new GeminiLiveSessionClient({
        systemPrompt: COPILOT_CHARLIE_SYSTEM_PROMPT,
        voiceName: 'Algieba',
        language: 'en-US',
        onStatusChange: (st) => {
          setLiveStatus(st);
          if (st === 'speaking') {
            setActiveDemoSpeaker('charlie');
          } else if (st === 'listening') {
            setActiveDemoSpeaker(null);
          }
        },
        onSpeaker: (sp) => {
          if (sp === 'assistant') setActiveDemoSpeaker('charlie');
          else if (sp === 'user') setActiveDemoSpeaker('consumer');
          else setActiveDemoSpeaker(null);
        },
        onTranscript: (item) => {
          if (item?.text) {
            setMessages(prev => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                sender: item.role === 'user' ? 'user' : 'charlie',
                text: item.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        },
        onError: (err) => {
          console.warn('Gemini Live session error:', err);
          setLiveStatus('ready');
          setIsTalkLiveActive(false);
          setActiveDemoSpeaker(null);
        }
      });

      liveClientRef.current = client;
      await client.start();
    } catch (e) {
      console.warn('Failed to start Gemini Live session:', e);
      setLiveStatus('ready');
      setIsTalkLiveActive(false);
      setActiveDemoSpeaker(null);
    }
  };

  // Real LLM Send invocation using InvokeLLM with gemini_3_flash
  const executeSendMessage = async (textToSend) => {
    const clean = (textToSend || inputText).trim();
    if (!clean || isSending) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    // Route views if matching keywords
    if (/news|broadcast|dnn/i.test(clean)) {
      setRightPanelView('news');
    } else if (/solution|vault|playbook/i.test(clean)) {
      setRightPanelView('solutions');
    } else if (/audit|comps|risk/i.test(clean)) {
      setRightPanelView('dossier');
    }

    if (/text me|send report|phone/i.test(clean)) {
      setIsCaptureModalOpen(true);
    }

    try {
      // Build knowledge context from active rows
      const kbContext = (kbRowsRef.current || [])
        .slice(0, 15)
        .map(r => `Q: ${r.question || ''}\nA: ${r.answer || ''}`)
        .join('\n\n');

      const fullPrompt = `${COPILOT_CHARLIE_SYSTEM_PROMPT}

KNOWLEDGE BASE CONTEXT:
${kbContext}

WORKING PROPERTY ADDRESS:
${analyzedProperty}

USER QUESTION:
${clean}

Respond as Charlie Simmons directly to the user in 2 to 3 concise, authoritative sentences. Never give canned "I've logged that" replies. Offer real, unvarnished insight and fiduciary guidance.`;

      const res = await base44.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: fullPrompt
      });

      const replyText = typeof res === 'string' ? res : res?.response || res?.content || JSON.stringify(res);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: replyText || "I'm reviewing the property records for this address. How else can Bob Dyson and I assist with your transaction?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('InvokeLLM failed, providing grounded fallback:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: `On ${analyzedProperty}, our fiduciary desk reviews all unvarnished comps, geotechnical reports, and contract contingency protections to keep your earnest money deposit 100% safeguarded.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const resetToBlank = () => {
    setMessages([]);
    setRightPanelView(null);
    setActiveExplainer(null);
    if (liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
    }
    setIsTalkLiveActive(false);
    setLiveStatus('ready');
    setActiveDemoSpeaker(null);
  };

  const scrollToSection = (ref, pageNum, path) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (path && window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const pathname = location.pathname;

    if (initialPage === 1 || hash === '#page-1' || hash === '#landing' || pathname === '/landing') {
      scrollToSection(page1Ref, 1);
    } else if (
      initialPage === 2 || 
      initialPage === 3 || 
      hash === '#page-2' || 
      hash === '#dossier' || 
      hash === '#chat' || 
      hash === '#team' || 
      pathname === '/dossier' || 
      pathname === '/chat' || 
      pathname === '/team' || 
      pathname === '/copilot-dossier' || 
      pathname === '/copilot-chat'
    ) {
      scrollToSection(page2Ref, 2);
    }
  }, [initialPage, location.pathname]);

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-8 select-none" style={{ background: TAN_BG }}>
      
      {/* ── TOP STICKY NAVIGATION RAIL ── */}
      <nav className="p-3 sm:p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-3 sticky top-3 z-50 backdrop-blur-md max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              DYSON HOMES COPILOT
            </span>
          </div>

          {/* Main Admin Quick Access Button */}
          <Link
            to="/admin"
            className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ml-1"
            title="Open Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-black" />
            <span>Admin Dashboard</span>
          </Link>
          <Link
            to="/admin/dysonhomes-copilot"
            className="px-3.5 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#D4AF37]/40 text-[#D4AF37] font-semibold text-xs hidden md:flex items-center gap-1.5 transition-all shadow-sm"
            title="Open Admin Copilot Lab"
          >
            <Shield className="w-3 h-3 text-[#D4AF37]" />
            <span>Copilot Lab</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection(page1Ref, 1, '/')}
            className="px-3.5 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-white font-medium text-xs transition-colors border border-white/15 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5"
          >
            <span className="font-mono text-stone-400 text-xs">1.</span>
            <span>Landing &amp; Search</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection(page2Ref, 2, '/dossier')}
            className="px-3.5 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#262626] text-white font-medium text-xs transition-colors border border-white/15 hover:border-[#D4AF37] cursor-pointer flex items-center gap-1.5"
          >
            <span className="font-mono text-stone-400 text-xs">2.</span>
            <span>Fiduciary Command Center</span>
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          </button>
        </div>
      </nav>

      {/* ── 2 STREAMLINED CORE PAGES ── */}
      <main className="space-y-12 w-full flex flex-col items-center">
        
        {/* ── PAGE 1: LANDING & PROPERTY SEARCH ── */}
        <section id="page-1" ref={page1Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <SlideFourPrivateWealth
              onRunAudit={(addr) => {
                if (addr) setAnalyzedProperty(addr);
              }}
              onOpenDossier={(addr) => {
                if (addr) setAnalyzedProperty(addr);
                scrollToSection(page2Ref, 2, '/dossier');
              }}
              onGoToChatCanvas={() => {
                scrollToSection(page2Ref, 2, '/dossier');
              }}
            />
          </div>
        </section>

        {/* ── PAGE 2: CONSOLIDATED COMMAND CENTER & DOSSIER (Mini-Apps Rail + Real 3-Way Dialogue + Fiduciary Dossier) ── */}
        <section id="page-2" ref={page2Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <div 
              className="w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden select-none text-left"
              style={{ background: '#080808', color: '#f5f5f5' }}
            >
              {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
              <div className="flex flex-col lg:flex-row min-h-[640px]">
                
                {/* ── CENTER-LEFT COLUMN: ROSTER + LIVE GEMINI/INVOKELLM CHAT ── */}
                <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col justify-between bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0">
                  
                  {/* Scrollable Conversation Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[560px]">

                    {/* ── HEADER: COPILOT + COMMAND CENTER ── */}
                    <div className="flex items-baseline justify-center gap-2.5 pb-1 px-0.5">
                      <span 
                        className="font-serif italic font-medium text-[#D4AF37] text-[48px] sm:text-[52px] leading-none select-none"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                      >
                        CoPilot
                      </span>
                      <span className="text-white text-[28px] sm:text-[32px] font-normal tracking-wide whitespace-nowrap">
                        Command Center
                      </span>
                    </div>

                    {/* ── ROSTER: BOB, CHARLIE, YOU SPEAKER BOXES ── */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <CopilotDynamicSpeakerBox 
                        speaker="bob"
                        variant="card"
                        className="w-full"
                        isSpeakingOverride={activeDemoSpeaker === 'bob'}
                        activeExplainer={activeExplainer}
                        onClearExplainer={() => setActiveExplainer(null)}
                        onTriggerExplainer={(query) => executeSendMessage(query)}
                      />
                      <CopilotDynamicSpeakerBox 
                        speaker="charlie"
                        variant="card"
                        className="w-full"
                        isSpeakingOverride={activeDemoSpeaker === 'charlie' || isTalkLiveActive}
                        activeExplainer={activeExplainer}
                        onClearExplainer={() => setActiveExplainer(null)}
                        onTriggerExplainer={() => handleToggleTalkLive()}
                      />
                      <CopilotConsumerSpeakerBox 
                        className="w-full"
                        userName="You"
                        userRole="Verified Buyer"
                        isTransmitting={activeDemoSpeaker === 'consumer'}
                      />
                    </div>

                    {/* ── INTERACTIVE 3-WAY DIALOGUE STAGE PILL & RESET CONTROLS ── */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <CopilotThreeWayDemo 
                          onTurnChange={setActiveDemoSpeaker}
                          onResetDemo={resetToBlank}
                          onMessagePosted={(msg) => {
                            setMessages(prev => [...prev, msg]);
                          }}
                        />
                      </div>
                      {(messages.length > 0 || isTalkLiveActive) && (
                        <button
                          type="button"
                          onClick={resetToBlank}
                          className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/15 transition-all cursor-pointer whitespace-nowrap shrink-0"
                          title="Clear all messages and reset screen to blank"
                        >
                          Clear Session
                        </button>
                      )}
                    </div>

                    {/* ── PLAIN GROK-STYLE TEXT CHAT (CONNECTED REAL LLM REPLIES) ── */}
                    <div className="space-y-3 pt-4">
                      {messages.map((m) => {
                        const isUser = m.sender === 'user';
                        const isBob = m.sender === 'bob';

                        return (
                          <div 
                            key={m.id} 
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            <div className="mb-0.5 px-1 text-[11px] font-medium text-stone-400">
                              {isUser ? 'You' : isBob ? 'Bob Dyson (Broker)' : 'Charlie Simmons (Voice)'}
                            </div>

                            <div 
                              className={`rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed max-w-[94%] ${
                                isUser
                                  ? 'bg-[#1e1e1e] border border-white/15 text-white'
                                  : isBob
                                  ? 'bg-[#141414] border border-[#D4AF37]/40 text-stone-200'
                                  : 'bg-[#141414] border border-white/15 text-stone-200'
                              }`}
                            >
                              <p className="whitespace-pre-line font-normal">{m.text}</p>
                            </div>

                            {m.time && (
                              <span className="text-[9px] text-stone-500 mt-0.5 px-1 font-mono">
                                {m.time}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {isSending && (
                        <div className="flex flex-col items-start">
                          <div className="mb-0.5 px-1 text-[11px] font-medium text-stone-400">
                            Charlie Simmons (Voice)
                          </div>
                          <div className="rounded-lg px-3.5 py-2 bg-[#141414] border border-white/15 text-stone-400 text-xs flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                            <span>Charlie is consulting property records &amp; fiduciary directives...</span>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* ── PINNED BOTTOM DIALOGUE BAR: Grok-plain input, wired InvokeLLM + Talk Live ── */}
                  <div className="pt-2 mt-auto border-t border-white/10 sticky bottom-0 bg-[#0b0b0b] z-20 space-y-2">
                    
                    {/* Plain Input Bar (Tan #ede0cc background) */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        executeSendMessage();
                      }} 
                      className="space-y-1"
                    >
                      <div 
                        className="flex items-center rounded-xl px-3 py-2 transition-all border border-[#ede0cc]"
                        style={{ backgroundColor: '#ede0cc', color: '#000000' }}
                      >
                        <Paperclip className="w-4 h-4 text-black mr-2 shrink-0 cursor-pointer" title="Attach file or pre-approval" />
                        
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Ask anything real estate—compliance, Prop 19, escrow traps, comps..."
                          className="flex-1 bg-transparent text-black text-xs sm:text-sm outline-none font-normal min-w-0 placeholder:text-black/60"
                          style={{ color: '#000000' }}
                        />

                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleToggleTalkLive}
                            className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                              isTalkLiveActive 
                                ? 'bg-red-600 text-white animate-pulse' 
                                : 'text-black hover:bg-black/10'
                            }`}
                            title={isTalkLiveActive ? "End live Gemini duplex session" : "Talk Live with Charlie (Gemini Live Algieba)"}
                          >
                            <Mic className="w-4 h-4" />
                            {isTalkLiveActive && (
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                {liveStatus === 'connecting' ? 'Connecting...' : liveStatus === 'speaking' ? 'Speaking' : 'Listening'}
                              </span>
                            )}
                          </button>

                          <button
                            type="submit"
                            disabled={isSending || !inputText.trim()}
                            className="px-3.5 py-1 rounded-md font-semibold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-50"
                            style={{ backgroundColor: '#000000', color: '#ffffff' }}
                            title="Send message to Charlie"
                          >
                            <span>{isSending ? 'Sending...' : 'Send'}</span>
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Plain prompt chips with thin borders placed below Ask Anything search bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('solutions');
                          executeSendMessage("What solutions and playbooks do you offer for home buyers?");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Solutions Vault</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('solutions');
                          executeSendMessage("Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Lender Compliance</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('solutions');
                          executeSendMessage("Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Ask Bob: Escrow Traps</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('solutions');
                          executeSendMessage("How does Prop 19 tax base portability work when relocating in California?");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Prop 19 Tax</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('solutions');
                          executeSendMessage("What are the coastal bluff setback and soil stability risks in California?");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Bluff Setbacks</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRightPanelView('news');
                          executeSendMessage("Charlie, summarize this broadcast in bullet points");
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
                      >
                        <span>Daily News</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
                <div className="flex-1 min-w-0 bg-[#080808]">
                  <CopilotDossierNewsPanel
                    property={analyzedProperty}
                    dossierData={dossierData}
                    activeView={rightPanelView}
                    onViewChange={setRightPanelView}
                    isExploded={isPageExploded}
                    onToggleExplode={() => setIsPageExploded(prev => !prev)}
                    onExplodeItem={(item) => {
                      setSelectedExplodedItem(item);
                      setIsPageExploded(true);
                    }}
                    onPromptClick={(query) => executeSendMessage(query)}
                    onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
                    isSubscriber={isSubscriber}
                    onBackToSearch={() => {
                      resetToBlank();
                      scrollToSection(page1Ref, 1, '/');
                    }}
                  />
                </div>

              </div>

              {/* ── BOTTOM HORIZONTAL AI MINIONS RAIL ── */}
              <CopilotMiniAppsRail />

              {/* ── FULL-PAGE EXPLODED SUBJECT THEATER ── */}
              <CopilotExplodedSubjectModal
                isOpen={isPageExploded}
                onClose={() => {
                  setIsPageExploded(false);
                  setSelectedExplodedItem(null);
                }}
                subjectType={rightPanelView}
                activeView={rightPanelView}
                onViewChange={setRightPanelView}
                selectedItem={selectedExplodedItem}
                onSelectItem={setSelectedExplodedItem}
                dossierData={dossierData}
                property={analyzedProperty}
                onPromptClick={(query) => executeSendMessage(query)}
                onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
                isSubscriber={isSubscriber}
              />

              {/* ── CONTACT CAPTURE MODAL ── */}
              <CopilotContactCaptureModal
                isOpen={isCaptureModalOpen}
                onClose={() => setIsCaptureModalOpen(false)}
                propertyAddress={dossierData.fullAddress || analyzedProperty}
                onCaptureSuccess={(captured) => {
                  setIsSubscriber(true);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: Date.now(),
                      sender: 'charlie',
                      text: `I've queued the complete fiduciary property audit for ${captured.address} directly to ${captured.phone}.\n\nYou've also been granted complimentary VIP Subscriber access to our Daily DNN News broadcasts under Bob Dyson's broker desk!`
                    }
                  ]);
                }}
              />

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}