import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, 
  Waves, Clock, Radio, Mic, Briefcase, Shield, Sparkles
} from 'lucide-react';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch, showRail = true }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const [rightPanelView, setRightPanelView] = useState('dossier'); // 'dossier' | 'news' | 'solutions'
  const [isPageExploded, setIsPageExploded] = useState(false);
  const [selectedExplodedItem, setSelectedExplodedItem] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dyson_subscriber_unlocked') === 'true';
    }
    return false;
  });
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);
  const firstMessageRef = useRef(null);
  const [textStartOffset, setTextStartOffset] = useState(480);
  const dossierData = getPropertyDossier(property);

  const [messages, setMessages] = useState(() => {
    const data = getPropertyDossier(property);
    return [
      {
        id: 1,
        sender: 'charlie',
        text: `I audited ${data.shortAddress}, ${data.city}.\n${data.marketSummary} Executive audit on the right.\nWhat's your mobile so I can text this report to you?`
      },
      {
        id: 2,
        sender: 'user',
        text: data.fullAddress,
        time: "10:24 AM"
      }
    ];
  });

  // Keep chat initial messages strictly in sync whenever property prop changes
  useEffect(() => {
    const data = getPropertyDossier(property);
    setMessages([
      {
        id: 1,
        sender: 'charlie',
        text: `I audited ${data.shortAddress}, ${data.city}.\n${data.marketSummary} Executive audit on the right.\nWhat's your mobile so I can text this report to you?`
      },
      {
        id: 2,
        sender: 'user',
        text: data.fullAddress,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [property]);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Synchronize text starting position so right-side dossier aligns with left-side chat text
  useEffect(() => {
    const measureOffset = () => {
      if (firstMessageRef.current && canvasRef.current) {
        const msgRect = firstMessageRef.current.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const offset = msgRect.top - canvasRect.top;
        if (offset > 120) {
          setTextStartOffset(Math.round(offset));
        }
      }
    };
    measureOffset();
    const timer = setTimeout(measureOffset, 100);
    window.addEventListener('resize', measureOffset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureOffset);
    };
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
          answerText = `Charlie: I've opened the corresponding playbook in the Solutions Vault on the right. With ${dossierData.shortAddress}, our fiduciary protocol protects you with zero added broker fees and independent comps.`;
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
      {/* ── TOP HEADER BAR: D&D badge + CoPilot wordmark (capital C+P, black/gold/white, no green) ── */}
      <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-end gap-3 bg-[#0a0a0a]">
        
        {/* Top Controls: Pinned to Far Right */}
        <div className="flex items-center gap-3 ml-auto">
          {onBackToSearch && (
            <button
              type="button"
              onClick={onBackToSearch}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1 font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              ← Search
            </button>
          )}

          {/* Quick Right-Side View Switcher: Audit, Solutions & News (All grey font, active is white, no yellow) */}
          <div className="hidden sm:flex items-center bg-[#141414] p-0.5 rounded-md border border-white/10 ml-2 gap-0.5">
            <button
              type="button"
              onClick={() => setRightPanelView('dossier')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'dossier'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>Audit</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelView('solutions')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'solutions'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Solutions Vault</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelView('news')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'news'
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>Daily News</span>
            </button>
          </div>

          {/* Quiet Full-Screen Expand Stub */}
          <button
            type="button"
            onClick={() => setIsPageExploded(true)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ml-1 ${
              isPageExploded
                ? 'bg-white/15 text-white border-white/20 font-medium'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-stone-400 hover:text-white'
            }`}
            title="Expand chat + dossier canvas to full viewport"
          >
            <span>Full screen</span>
          </button>

          {/* Quiet Project Daily News Stub */}
          <button
            type="button"
            onClick={() => setRightPanelView('news')}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ml-1 ${
              rightPanelView === 'news'
                ? 'bg-white/15 text-white border-white/20 font-medium'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-stone-400 hover:text-white'
            }`}
            title="Project today's DNN Daily News show"
          >
            <span>Project Daily News</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
      <div ref={canvasRef} className="flex flex-col lg:flex-row min-h-[640px]">
        
        {/* ── CENTER-LEFT COLUMN: ROSTER (VISUAL/READ-ONLY, CHARLIE ONLY LIVE TALK) + GROK-PLAIN CHAT ── */}
        <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col justify-between bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0">
          
          {/* Scrollable Conversation Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[560px]">

            {/* ── ROSTER: BOB, CHARLIE, YOU SPEAKER BOXES ── */}
            <div className="grid grid-cols-3 gap-2 pt-1">
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

            {/* ── INTERACTIVE 3-WAY DIALOGUE STAGE PILL ── */}
            <div className="pt-2">
              <CopilotThreeWayDemo 
                onTurnChange={setActiveDemoSpeaker}
                onResetDemo={() => setActiveDemoSpeaker(null)}
                onMessagePosted={(msg) => {
                  setMessages(prev => [...prev, msg]);
                }}
              />
            </div>

            {/* ── PLAIN GROK-STYLE TEXT CHAT (NO YELLOW DOTS, NO RINGS, CLEAN TYPOGRAPHY) ── */}
            <div className="space-y-3 pt-[45%]">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                const isBob = m.sender === 'bob';

                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Plain Sender Tag without colored dots */}
                    <div className="mb-0.5 px-1 text-[11px] font-medium text-stone-400">
                      {isUser ? 'You' : isBob ? 'Bob Dyson (Broker)' : 'Charlie Simmons (Voice)'}
                    </div>

                    {/* Grok-style text bubble: clean, flat, thin border, no rings */}
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
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── PINNED BOTTOM DIALOGUE BAR: Grok-plain input, thin borders, no rings ── */}
          <div className="pt-2 mt-auto border-t border-white/10 sticky bottom-0 bg-[#0b0b0b] z-20 space-y-2">
            
            {/* Plain prompt chips with thin borders (no rings, no yellow dots) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What solutions and playbooks do you offer for home buyers?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-white/15 hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <span>Solutions Vault</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              >
                <span>Lender Compliance</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              >
                <span>Ask Bob: Escrow Traps</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("How does Prop 19 tax base portability work when relocating in California?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              >
                <span>Prop 19 Tax</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What are the coastal bluff setback and soil stability risks in California?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              >
                <span>Bluff Setbacks</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('news');
                  handlePillClick("Charlie, summarize this broadcast in bullet points");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              >
                <span>Daily News</span>
              </button>
            </div>

            {/* Plain Grok-Style Input (No glow ring, thin border) */}
            <form onSubmit={handleSendMessage} className="space-y-1">
              <div className="flex items-center bg-[#141414] hover:bg-[#171717] rounded-xl border border-white/20 focus-within:border-[#D4AF37] px-3 py-2 transition-all">
                <Paperclip className="w-4 h-4 text-stone-400 mr-2 shrink-0 cursor-pointer hover:text-white" title="Attach file or pre-approval" />
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything real estate—compliance, Prop 19, escrow traps, comps..."
                  className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-stone-500 font-normal min-w-0"
                />

                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePillClick('Talk Live with Charlie')}
                    className="p-1 rounded-md text-stone-400 hover:text-[#D4AF37] hover:bg-white/5 transition-all cursor-pointer"
                    title="Voice input (Charlie Live)"
                  >
                    <Mic className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-3 py-1 rounded-md bg-[#D4AF37] hover:brightness-110 disabled:opacity-40 text-black font-semibold text-xs flex items-center justify-center transition-all cursor-pointer"
                    title="Send message"
                  >
                    <span>Send</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8.5px] text-stone-500 px-1 font-mono">
                <span>CoPilot Fiduciary Dialogue</span>
                <span>Zero Broker Fee</span>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
        <div className="flex-1 min-w-0 bg-[#080808]">
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
          />
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

      {/* ── FLOATING BOTTOM-RIGHT PILL: REFER A FRIEND + V2V ── */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 shadow-2xl">
        <a 
          href="/refer"
          className="px-3.5 py-2 rounded-l-full bg-[#fce38a] hover:bg-[#fad85d] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
        >
          <span className="text-black font-bold text-base leading-none">+</span>
          <span>Refer a Friend</span>
        </a>
        <div className="px-3 py-2 rounded-r-full bg-[#0a0a0a] border border-[#fce38a]/40 text-[#fce38a] font-mono text-[11px] font-bold flex items-center gap-1 shadow-lg">
          <span>⌖</span>
          <span>V2V</span>
        </div>
      </div>
    </div>
  );
}