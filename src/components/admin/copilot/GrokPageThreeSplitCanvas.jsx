import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, 
  Waves, Clock, Radio, Mic, Briefcase, Shield, Sparkles, ArrowLeft, Bookmark
} from 'lucide-react';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import CopilotSavedDiscussionsModal from '@/components/copilot/CopilotSavedDiscussionsModal';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch, showRail = true }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const [rightPanelView, setRightPanelView] = useState(null); // null (blank) | 'dossier' | 'news' | 'solutions'
  const [isPageExploded, setIsPageExploded] = useState(false);
  const [selectedExplodedItem, setSelectedExplodedItem] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isSavedDiscussionsOpen, setIsSavedDiscussionsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('dyson_copilot_saved_discussions');
        if (raw) return JSON.parse(raw).length;
      } catch (_) {}
    }
    return 1;
  });
  const [isSubscriber, setIsSubscriber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dyson_subscriber_unlocked') === 'true';
    }
    return false;
  });

  // Discussion history stack state (stacked as added, retained on 40% side)
  const [discussionChips, setDiscussionChips] = useState([
    { id: 'solutions', label: 'Saved Solutions', query: 'What solutions and playbooks do you offer for home buyers?', view: 'solutions' },
    { id: 'compliance', label: 'Lender Compliance', query: 'Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?', view: 'solutions' },
    { id: 'escrow', label: 'Ask Bob: Escrow Traps', query: 'Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?', view: 'solutions' },
    { id: 'prop19', label: 'Prop 19 Tax', query: 'How does Prop 19 tax base portability work when relocating in California?', view: 'solutions' },
    { id: 'bluff', label: 'Bluff Setbacks', query: 'What are the coastal bluff setback and soil stability risks in California?', view: 'solutions' },
    { id: 'news', label: 'Daily News', query: 'Charlie, summarize this broadcast in bullet points', view: 'news' },
  ]);

  const addDiscussionChip = (text, view = 'solutions') => {
    if (!text || text.trim().length === 0) return;
    const trimmed = text.trim();
    setDiscussionChips(prev => {
      if (prev.some(c => c.query.toLowerCase() === trimmed.toLowerCase() || c.label.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const label = trimmed.length > 24 ? trimmed.slice(0, 24) + '...' : trimmed;
      return [...prev, { id: `disc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, label, query: trimmed, view }];
    });
  };
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);
  const dossierData = getPropertyDossier(property);

  // Command Center & Intelligence panel conversation messages
  const [messages, setMessages] = useState([]);

  // When property is passed/updated, deliver fiduciary audit to dialogue if empty
  useEffect(() => {
    if (property && messages.length === 0) {
      const cleanAddr = property;
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: `Audit property: ${cleanAddr}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const charlieMsg = {
        id: Date.now() + 1,
        sender: 'charlie',
        speakerName: 'Charlie Simmons',
        text: `Charlie here. Fiduciary property audit initiated for ${cleanAddr}. I've pulled recent comparable sales within 0.75 miles, adjusted for market shifts, and checked local environmental and zoning risk factors. On the right, your live dossier is active with honest comps, hidden risk alerts, and lender compliance discovery.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const bobMsg = {
        id: Date.now() + 2,
        sender: 'bob',
        speakerName: 'Bob Dyson',
        text: `Bob Dyson here. On ${cleanAddr}, our primary fiduciary mandate is safeguarding your earnest money deposit. We verify all contingency timelines, geological inspections, and seller disclosures are in place before you ever submit an offer.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([userMsg, charlieMsg, bobMsg]);
      setRightPanelView('dossier');
    }
  }, [property]);

  const resetToBlank = () => {
    setMessages([]);
    setRightPanelView(null);
    setActiveExplainer(null);
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handlePillClick = (query) => {
    const explainer = findExplainerByQuery(query);
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    const isBobQuery = /bob|trap|escrow|bluff|contract|legal|compliance|regulations|offer strategy|hud-1/i.test(query);
    const isNewsQuery = /news|broadcast|inventory|bullet|summary|headline/i.test(query);
    const isTextReportQuery = /text|mobile|phone|send report|send me/i.test(query);
    const isSolutionsQuery = /solution|vault|prop 19|tax|bluff|coastal|setback|how to|guide|playbook|exchange|1031|compliance|trap|fiduciary/i.test(query);

    if (isTextReportQuery) {
      setIsCaptureModalOpen(true);
    }

    if (isNewsQuery) {
      setRightPanelView('news');
    } else if (isSolutionsQuery) {
      setRightPanelView('solutions');
    }

    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: explainer.speaker === 'bob' ? 'bob' : 'charlie',
            text: explainer.textAnswer || `Playing video explainer for "${explainer.label}" above.`
          }
        ]);
      }, 400);
    } else {
      setActiveExplainer(null);
      setTimeout(() => {
        let answerText = '';
        if (query.includes('bullet') || (isNewsQuery && !isBobQuery)) {
          answerText = `Charlie: Here is your DNN Daily Broadcast Summary for ${dossierData.city || 'Southern California'}:\n• Constrained inventory down 14% YoY across luxury zip codes.\n• Price resilience supported by high equity buyers, but appraisal gaps are emerging.\n• Our fiduciary protocol secures unvarnished comps, strict inspection contingency shields, and verified compliance with all state and lender guidelines.`;
        } else if (isBobQuery && isNewsQuery) {
          answerText = `Bob Dyson: In a constrained inventory market like ${dossierData.shortAddress}, listing agents love to bluff about multiple offers. We demand signed confirmation of competing offers and lock in appraisal protective shields so you never overpay.`;
        } else if (/compliance|concession|credit|structure|lender/i.test(query)) {
          answerText = `Bob Dyson: On ${dossierData.shortAddress}, our fiduciary protocol ensures all contract terms, title exceptions, and physical disclosures are rigorously verified before submitting an offer.`;
        } else if (/prop 19|tax/i.test(query)) {
          answerText = `Charlie: Under California Proposition 19, if you or your spouse are 55+, severely disabled, or wildfire victims, you can transfer your taxable property base to any replacement home anywhere in California up to 3 times, saving tens of thousands annually.`;
        } else if (/bluff|coastal|setback|soil/i.test(query)) {
          answerText = `Charlie: For coastal parcels, California Coastal Commission setback rules require 75-year erosion projections. We mandate a deep geotechnical review of ancient landslide fault lines before you waive physical inspection contingencies.`;
        } else if (isBobQuery) {
          answerText = `Bob Dyson: Regarding "${query}" — in California contracts, we never allow premature contingency waivers. We draft appraisal and title contingency shields to verify soil stability and structure comprehensive contract shields tailored to your specific lender and property requirements.`;
        } else {
          answerText = `Charlie: I've opened the corresponding playbook in Saved Solutions on the right. With ${dossierData.shortAddress}, our fiduciary protocol protects you with zero added broker fees and independent comps.`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: isBobQuery ? 'bob' : 'charlie',
            text: answerText
          }
        ]);
      }, 600);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    addDiscussionChip(text);

    const explainer = findExplainerByQuery(text);
    const isBobQuery = /bob|trap|escrow|bluff|contract|legal|fee|disclosure|title|broker|compliance|regulations|offer strategy|hud-1/i.test(text);
    const isNewsQuery = /news|broadcast|video|inventory|headline|dnn/i.test(text);
    const isPhoneOrText = /text|mobile|phone|\d{3}.*\d{3}.*\d{4}/i.test(text);
    const isSolutionsQuery = /solution|vault|prop 19|tax|bluff|coastal|setback|how to|guide|playbook|exchange|1031|compliance|trap|fiduciary/i.test(text);

    if (isPhoneOrText && !isBobQuery && !isNewsQuery) {
      setIsCaptureModalOpen(true);
    }

    if (isNewsQuery) {
      setRightPanelView('news');
    } else if (isSolutionsQuery) {
      setRightPanelView('solutions');
    }

    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: explainer.speaker === 'bob' ? 'bob' : 'charlie',
            text: explainer.textAnswer || `Playing video explainer for "${explainer.label}" in your Copilot slot above.`
          }
        ]);
      }, 400);
    } else {
      setActiveExplainer(null);
      setTimeout(() => {
        let answerText = '';
        if (isNewsQuery && isBobQuery) {
          answerText = `Bob Dyson: In light of today's broadcast, our fiduciary desk protects your earnest money deposit with strict escrow contingencies. We audit all listing agent claims on ${dossierData.shortAddress} directly against county recorder data.`;
        } else if (isNewsQuery) {
          answerText = `Charlie: I've brought up today's DNN Studio Broadcast on the right. You can watch the full report, expand it to full-screen theater mode, or ask us any questions as it plays.`;
        } else if (isBobQuery) {
          answerText = `Bob Dyson: Our fiduciary protocol protects you with zero added broker fees and strict disclosure audits for ${dossierData.shortAddress}. Would you like me to prepare an initial offer analysis?`;
        } else {
          answerText = `Charlie: I've logged that for ${dossierData.shortAddress}. We can text this full audit directly to your phone or connect you live with Bob.`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: isBobQuery ? 'bob' : 'charlie',
            text: answerText
          }
        ]);
      }, 700);
    }
  };

  return (
    <div 
      className="w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden select-none text-left"
      style={{ background: '#080808', color: '#f5f5f5' }}
    >
      {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
      <div ref={canvasRef} className="flex flex-col lg:flex-row h-auto lg:h-[720px] xl:h-[750px] overflow-hidden">
        
        {/* ── CENTER-LEFT COLUMN: ROSTER (VISUAL/READ-ONLY, CHARLIE ONLY LIVE TALK) + GROK-PLAIN CHAT ── */}
        <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0 h-full overflow-hidden">
          
          {/* Scrollable Conversation Container */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin">

            {/* ── HEADER: COPILOT + COMMAND CENTER (EXACTLY WHERE IT WAS) ── */}
            <div className="flex items-baseline justify-center gap-2.5 pb-2 px-0.5">
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

            {/* ── ROSTER: BOB, CHARLIE, YOU SPEAKER BOXES (REDUCED BY 10%) ── */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-[90%] mx-auto">
              <CopilotDynamicSpeakerBox 
                speaker="bob"
                variant="card"
                className="w-full"
                isSpeakingOverride={activeDemoSpeaker === 'bob'}
                activeExplainer={activeExplainer}
                onClearExplainer={() => setActiveExplainer(null)}
                onTriggerExplainer={(query) => handlePillClick(query)}
              />
              <CopilotDynamicSpeakerBox 
                speaker="charlie"
                variant="card"
                className="w-full"
                isSpeakingOverride={activeDemoSpeaker === 'charlie'}
                activeExplainer={activeExplainer}
                onClearExplainer={() => setActiveExplainer(null)}
                onTriggerExplainer={(query) => handlePillClick(query)}
              />
              <CopilotConsumerSpeakerBox 
                className="w-full"
                userName="You"
                userRole="Verified Buyer"
                isTransmitting={activeDemoSpeaker === 'consumer'}
              />
            </div>

            {/* ── INTERACTIVE 3-WAY DIALOGUE STAGE ── */}
            <div className="pt-2">
              <CopilotThreeWayDemo 
                onTurnChange={setActiveDemoSpeaker}
                onResetDemo={() => {
                  setActiveDemoSpeaker(null);
                  resetToBlank();
                }}
                onMessagePosted={(msg) => {
                  setMessages(prev => [...prev, msg]);
                }}
              />
            </div>

            {/* ── COMMAND BAR: POSITIONED DIRECTLY UNDER DEMO BOX MATCHING PAGE 1 SEARCH STYLE ── */}
            <div className="pt-2.5 pb-1 space-y-2">
              <form onSubmit={handleSendMessage} className="w-full">
                <div 
                  className="flex items-center rounded-full px-3.5 py-1.5 transition-all border border-[#D4AF37] w-full relative overflow-hidden shadow-lg bg-white"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                >
                  <Paperclip className="w-4 h-4 text-black mr-2 shrink-0 cursor-pointer z-10" title="Attach file or pre-approval" />
                  
                  <div className="relative flex-1 min-w-0 flex items-center h-7 overflow-hidden">
                    {!inputText && !isInputFocused && (
                      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none text-black/65 text-xs sm:text-sm whitespace-nowrap">
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
                      onClick={() => handlePillClick('Talk Live with Charlie')}
                      className="p-1 rounded-md text-black transition-all cursor-pointer"
                      title="Voice input (Charlie Live)"
                    >
                      <Mic className="w-4 h-4 text-black" />
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm bg-black text-white hover:bg-stone-900 border-none active:scale-95"
                      style={{ backgroundColor: '#000000', color: '#ffffff', opacity: 1 }}
                      title="Send message"
                    >
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>Send</span>
                      <span className="text-[#D4AF37] ml-1">→</span>
                    </button>
                  </div>
                </div>
              </form>

              {messages.length > 0 && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={resetToBlank}
                    className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                    title="Clear all messages and reset screen to blank"
                  >
                    Clear Session
                  </button>
                </div>
              )}
            </div>

            {/* ── 3-WAY INTERACTIVE DIALOGUE FEED (COLOR-CODED DURING SPEECH & AT REST) ── */}
            <div className="space-y-3 pt-3">
              {messages.map((m) => {
                const isConsumer = m.sender === 'consumer';
                const isCharlie = m.sender === 'charlie';
                const isBob = m.sender === 'bob';
                const isPlainUser = m.sender === 'user';

                // Active speaking state driven by 3-Way Dialogue Demo
                const isSpeakingNow = (
                  (activeDemoSpeaker === 'consumer' && isConsumer) ||
                  (activeDemoSpeaker === 'charlie' && isCharlie) ||
                  (activeDemoSpeaker === 'bob' && isBob)
                );

                // Speaker border and glow styles based on designated colors:
                // Buyer = RED (#ef4444) | Charlie = GREEN (#10b981) | Bob = GOLD (#D4AF37)
                let bubbleClasses = 'bg-[#141414] border border-white/15 text-stone-200';
                if (isSpeakingNow) {
                  if (isConsumer) {
                    bubbleClasses = 'bg-[#1c0f0f] border-2 border-rose-500 ring-2 ring-rose-500/60 shadow-[0_0_22px_rgba(239,68,68,0.5)] text-white scale-[1.01]';
                  } else if (isCharlie) {
                    bubbleClasses = 'bg-[#0c1a14] border-2 border-emerald-500 ring-2 ring-emerald-500/60 shadow-[0_0_22px_rgba(16,185,129,0.5)] text-white scale-[1.01]';
                  } else if (isBob) {
                    bubbleClasses = 'bg-[#211c0f] border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_0_22px_rgba(212,175,55,0.55)] text-white scale-[1.01]';
                  }
                } else {
                  if (isConsumer) {
                    bubbleClasses = 'bg-[#161111] border-l-4 border-l-rose-500 border-white/10 text-white';
                  } else if (isCharlie) {
                    bubbleClasses = 'bg-[#0f1512] border-l-4 border-l-emerald-500 border-white/10 text-stone-200';
                  } else if (isBob) {
                    bubbleClasses = 'bg-[#16140e] border-l-4 border-l-[#D4AF37] border-[#D4AF37]/30 text-stone-200';
                  } else if (isPlainUser) {
                    bubbleClasses = 'bg-[#1e1e1e] border border-white/15 text-white';
                  }
                }

                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isPlainUser ? 'items-end' : 'items-start'} transition-all duration-300`}
                  >
                    {/* Color-Coded Speaker Name & Status Indicator */}
                    <div className="mb-1 px-1 text-[11px] font-medium flex items-center gap-1.5">
                      {isConsumer ? (
                        <>
                          <span className={`w-2 h-2 rounded-full bg-rose-500 ${isSpeakingNow ? 'animate-ping' : ''}`} />
                          <span className="text-rose-400 font-bold">
                            {m.speakerName || 'You (Buyer)'}
                          </span>
                          {isSpeakingNow && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-bold uppercase tracking-wider animate-pulse">
                              Speaking Live
                            </span>
                          )}
                        </>
                      ) : isCharlie ? (
                        <>
                          <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isSpeakingNow ? 'animate-ping' : ''}`} />
                          <span className="text-emerald-400 font-bold">
                            {m.speakerName || 'Charlie Simmons (Voice)'}
                          </span>
                          {isSpeakingNow && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase tracking-wider animate-pulse">
                              Speaking Live
                            </span>
                          )}
                        </>
                      ) : isBob ? (
                        <>
                          <span className={`w-2 h-2 rounded-full bg-[#D4AF37] ${isSpeakingNow ? 'animate-ping' : ''}`} />
                          <span className="text-[#D4AF37] font-bold">
                            {m.speakerName || 'Bob Dyson (Broker)'}
                          </span>
                          {isSpeakingNow && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/25 text-[#D4AF37] font-mono font-bold uppercase tracking-wider animate-pulse">
                              Directing Live
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-stone-300 font-semibold">You</span>
                      )}
                    </div>

                    <div 
                      className={`rounded-xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed max-w-[96%] transition-all duration-300 ${bubbleClasses}`}
                    >
                      <p className="whitespace-pre-line font-normal">{m.text}</p>
                    </div>

                    {m.time && (
                      <span className="text-[9px] text-stone-500 mt-1 px-1 font-mono">
                        {m.time}
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
        <div className="flex-1 min-w-0 bg-[#080808] h-full overflow-hidden flex flex-col">
          <CopilotDossierNewsPanel
            property={property}
            dossierData={dossierData}
            activeView={rightPanelView}
            onViewChange={setRightPanelView}
            isExploded={isPageExploded}
            onToggleExplode={() => setIsPageExploded(prev => !prev)}
            onExplodeItem={(item) => {
              setSelectedExplodedItem(item);
              setIsPageExploded(true);
            }}
            onPromptClick={handlePillClick}
            onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
            isSubscriber={isSubscriber}
            onBackToSearch={() => {
              resetToBlank();
              onBackToSearch?.();
            }}
          />
        </div>

      </div>

      {/* ── FOOTER ROW DIRECTLY OVER MINI APPS: DISCUSSION STACK (LOWER LEFT <= 40% SCREEN) & BRANDING (FAR RIGHT) ── */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#0a0a0a] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Discussion History & Saved Discussions Stack (Lower Left Stacked, <= 40% Screen Width) */}
        <div className="w-full sm:max-w-[40%] flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSavedDiscussionsOpen(true)}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
            title="Open Saved Discussions"
          >
            <Bookmark className="w-3 h-3 text-[#D4AF37]" />
            <span>Saved Discussions</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {discussionChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                if (chip.view) setRightPanelView(chip.view);
                handlePillClick(chip.query);
              }}
              className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer shrink-0"
              title={chip.query}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Branding: stacked vertically on the far right */}
        <div className="flex flex-col items-end text-right font-normal text-white shrink-0 self-end sm:self-center ml-auto">
          <span className="text-[12px] sm:text-[12.5px] font-normal text-white tracking-normal whitespace-nowrap">
            The Dyson &amp; Dyson Companies, Inc. Ca. DRE#02303118
          </span>
          <div className="text-[11.5px] sm:text-[12px] font-normal text-white flex items-center gap-2 whitespace-nowrap mt-0.5">
            <a href="tel:8583531200" className="text-white hover:underline transition-colors font-normal">
              (858) 353 1200
            </a>
            <span className="text-white">·</span>
            <a href="mailto:bob@dysonrelo.com" className="text-white hover:underline transition-colors font-normal">
              bob@dysonrelo.com
            </a>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HORIZONTAL AI MINIONS RAIL ── */}
      {showRail && (
        <CopilotMiniAppsRail />
      )}

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
        property={property}
        onPromptClick={handlePillClick}
        onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
        isSubscriber={isSubscriber}
      />

      {/* ── CONTACT CAPTURE MODAL ── */}
      <CopilotContactCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        propertyAddress={dossierData.fullAddress || property || '742 Vista Del Mar, La Jolla, CA'}
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

      {/* ── SAVED DISCUSSIONS MODAL ── */}
      <CopilotSavedDiscussionsModal
        isOpen={isSavedDiscussionsOpen}
        onClose={() => setIsSavedDiscussionsOpen(false)}
        currentMessages={messages}
        currentProperty={property}
        onRestoreDiscussion={(restoredMsgs) => {
          setMessages(restoredMsgs);
        }}
        onSaveCurrent={() => {
          try {
            const raw = localStorage.getItem('dyson_copilot_saved_discussions');
            if (raw) setSavedCount(JSON.parse(raw).length);
          } catch (_) {}
        }}
      />

    </div>
  );
}