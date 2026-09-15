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
  const [rightPanelView, setRightPanelView] = useState(null); // null (blank) | 'dossier' | 'news' | 'solutions'
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
  const dossierData = getPropertyDossier(property);

  // Command Center & Intelligence panel stay blank until the user actually
  // asks something — no pre-seeded sample audit or conversation.
  const [messages, setMessages] = useState([]);

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
      {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
      <div ref={canvasRef} className="flex flex-col lg:flex-row min-h-[640px]">
        
        {/* ── CENTER-LEFT COLUMN: ROSTER (VISUAL/READ-ONLY, CHARLIE ONLY LIVE TALK) + GROK-PLAIN CHAT ── */}
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
            
            {/* Plain Grok-Style Input (No glow ring, thin border) */}
            <form onSubmit={handleSendMessage} className="space-y-1">
              <div className="flex items-center bg-[#ede0cc] hover:bg-[#e5d6c0] rounded-xl border border-[#ede0cc] focus-within:border-black/40 px-3 py-2 transition-all">
                <Paperclip className="w-4 h-4 text-black/60 mr-2 shrink-0 cursor-pointer hover:text-black" title="Attach file or pre-approval" />
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything real estate—compliance, Prop 19, escrow traps, comps..."
                  className="flex-1 bg-transparent text-black text-xs sm:text-sm outline-none placeholder:text-black/50 font-normal min-w-0"
                />

                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePillClick('Talk Live with Charlie')}
                    className="p-1 rounded-md text-black/60 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
                    title="Voice input (Charlie Live)"
                  >
                    <Mic className="w-4 h-4 text-black" />
                  </button>

                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded-md hover:brightness-125 font-semibold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    style={{ backgroundColor: '#000000', color: '#ffffff', opacity: inputText.trim() ? 1 : 0.7 }}
                    title="Send message"
                  >
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>Send</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Plain prompt chips with thin borders placed below Ask Anything search bar and above mini apps */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What solutions and playbooks do you offer for home buyers?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
              >
                <span>Solutions Vault</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
              >
                <span>Lender Compliance</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
              >
                <span>Ask Bob: Escrow Traps</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("How does Prop 19 tax base portability work when relocating in California?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
              >
                <span>Prop 19 Tax</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What are the coastal bluff setback and soil stability risks in California?");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer"
              >
                <span>Bluff Setbacks</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('news');
                  handlePillClick("Charlie, summarize this broadcast in bullet points");
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

    </div>
  );
}