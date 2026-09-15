import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowDown, Shield, LayoutDashboard, Paperclip, Send, Mic, Radio, FileText, Scale, ArrowLeft } from 'lucide-react';
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

export const COPILOT_CHARLIE_SYSTEM_PROMPT = "You are Charlie Simmons, AI concierge for DysonHomes Copilot (Dyson & Dyson Companies / DysonRelo). Warm, clear, brief, interruptible. On Copilot your job is to ANSWER ordinary real-estate and product questions on-point — do not pass the buck on normal questions.\n\nPRODUCT (say truthfully when asked):\n- DysonHomes Copilot is a human & AI-assisted private real estate copilot on dysonhomes.com.\n- Paste an address or MLS-style lookup to see comps, property risks, and closing rebate context where allowed by law.\n- Trust line: No agent spam. Independent fiduciary match — not the listing agent.\n- Public experience is conversational (chat + Talk Live). Admin/back office is separate.\n- Ads/referrals talk about “online home search sites / portals” — never name Zillow.\n\nHOW TO ANSWER:\n- Lead with a useful answer in 2–4 short sentences, then one optional follow-up question.\n- Ordinary topics you SHOULD handle: what Copilot does, comps vs list price (high-level), what “risks” means (flood/fire/title/HOA/permit-style flags — high-level), how independent buyer-agent match differs from listing agent, how to paste an address, what Talk Live is, who Bob Dyson is (founder/brokerage principal for Dyson & Dyson — keep brief; no invented bio facts).\n- If the dossier already shows comps/risks/rebate notes, narrate what is on screen; do not invent new numbers.\n- If data is missing, say what you need (address/MLS) and how to paste it — do not invent listings, prices, or availability.\n\nHARD STOPS (non-negotiable — hand to human, do not invent):\n- Exact fees, commissions, rebate dollar amounts or percentages, referral splits.\n- DRE / licensing / “are you my agent?” / contracts / agency / legal / tax advice.\n- Guarantees of sale price, appraisal, investment returns, or outcomes.\n- Claiming to be a licensed broker; you are the AI concierge. Brokerage: The Dyson & Dyson Companies (CA DRE #02303118).\nOn a hard stop: one plain sentence + offer human specialist callback. Do not lecture.\n\nSTYLE:\n- Conversational, not corporate. No monologues. One question at a time when you need info.\n- Never invent company policies, unpublished products, or campaign promises.\n- If unsure of a fact, say so briefly and offer human follow-up — but still give the best accurate high-level help you can first.\n- You are Charlie only (not Bob) unless Bob has locked Bob voice.\n\nVOICE:\n- Interruptible Live: if user barges in, stop and answer what they asked next.";

const COPILOT_SEED_FAQS = [{question:"What is DysonHomes Copilot? / What do you do?",answer:"DysonHomes Copilot is your human & AI-assisted private real estate copilot. Paste an address to see comps, property risks, and closing-rebate context where allowed by law — with an independent fiduciary match, not the listing agent. No agent spam.",is_active:true},{question:"What are comps? / How do you get comps?",answer:"Comps are recent similar sales near the property. Copilot shows them in the dossier so you can see how the home sits versus the market. Numbers come from the analysis on screen — ask me to walk through what’s already shown; I won’t invent sale prices.",is_active:true},{question:"How do you find hidden property risks?",answer:"Risks are flags like flood/fire exposure, title or permit issues, and HOA-style gotchas when the data supports them. I’ll summarize what’s in your dossier in plain English. For legal conclusions, a human specialist confirms.",is_active:true},{question:"How do I get money back at closing? / What’s the rebate?",answer:"Where allowed by law, DysonHomes can structure a closing-cost credit tied to an independent buyer-agent referral — never dual agency with the listing agent. I won’t invent a dollar amount or percentage; a human specialist confirms what applies in your state and deal.",is_active:true},{question:"Who is my agent? / Are you the listing agent?",answer:"We’re not the listing agent. The goal is an independent fiduciary buyer-side match looking out for you. I’m Charlie, the AI concierge — a human DysonRelo / Dyson & Dyson specialist handles agency and contracts (CA DRE #02303118).",is_active:true},{question:"Who is Bob Dyson?",answer:"Bob Dyson is the real-estate brain behind Dyson & Dyson / DysonRelo and DysonHomes Copilot — strategy and fiduciary direction. I’m Charlie, the AI guide on the site.",is_active:true},{question:"What’s Talk Live? / Can I talk to you?",answer:"Talk Live is interruptible voice with me (Charlie) on Copilot — same gold path as our live voice stack. Tap Talk, allow the mic, barge in anytime. Typing still works.",is_active:true},{question:"What’s your commission? / Exact rebate %?",answer:"I can’t invent fees, commissions, or rebate percentages. I’ll flag that for a human specialist — want a callback?",is_active:true}];

export default function DysonHomesCopilot({ initialPage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [analyzedProperty, setAnalyzedProperty] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  // Copilot Command Center Interactive Wire State
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
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

    const explainer = findExplainerByQuery(clean);
    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: explainer.speaker === 'bob' ? 'bob' : 'charlie',
          text: explainer.textAnswer || `Playing video explainer for "${explainer.label}".`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsSending(false);
      return;
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
              <div className="flex flex-col lg:flex-row h-auto lg:h-[720px] xl:h-[750px] overflow-hidden">
                
                {/* ── CENTER-LEFT COLUMN: ROSTER + LIVE GEMINI/INVOKELLM CHAT ── */}
                <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0 h-full overflow-hidden">
                  
                  {/* Scrollable Conversation Container */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin">

                    {/* ── HEADER: COPILOT + COMMAND CENTER ── */}
                    <div className="relative flex items-baseline justify-center gap-2.5 pb-1 px-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          resetToBlank();
                          scrollToSection(page1Ref, 1, '/');
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-xs font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        title="Back to Landing & Search"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Back</span>
                      </button>

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
                </div>

                {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
                <div className="flex-1 min-w-0 bg-[#080808] h-full overflow-hidden flex flex-col">
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

              {/* ── TWO ROWS DIRECTLY OVER MINI APPS: INPUT BAR + PROMPT CHIPS ── */}
              <div className="px-3 sm:px-4 py-3 bg-[#0a0a0a] border-t border-white/10 space-y-2.5">
                
                {/* Row 1: Plain Input Bar (Tan #ede0cc background) - Reduced to ~40% width on left */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeSendMessage();
                  }} 
                  className="space-y-1 w-full md:w-[40%]"
                >
                  <div 
                    className="flex items-center rounded-xl px-3 py-2 transition-all border border-[#ede0cc] w-full relative overflow-hidden"
                    style={{ backgroundColor: '#ede0cc', color: '#000000' }}
                  >
                    <Paperclip className="w-4 h-4 text-black mr-2 shrink-0 cursor-pointer z-10" title="Attach file or pre-approval" />
                    
                    <div className="relative flex-1 min-w-0 flex items-center h-6 overflow-hidden">
                      {/* Continuous scrolling marquee placeholder until viewer adds a request */}
                      {!inputText && !isInputFocused && (
                        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none text-black/60 text-xs sm:text-sm whitespace-nowrap">
                          <div className="inline-flex animate-marquee whitespace-nowrap">
                            <span className="mr-12 font-normal">Ask anything real estate—compliance, Prop 19, escrow traps, comps...</span>
                            <span className="mr-12 font-normal">Ask anything real estate—compliance, Prop 19, escrow traps, comps...</span>
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        value={inputText}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder=""
                        className="w-full bg-transparent text-black text-xs sm:text-sm outline-none font-normal min-w-0 z-10"
                        style={{ color: '#000000' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0 z-10">
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

                {/* Row 2: Plain prompt chips with thin borders placed below Ask Anything search bar */}
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