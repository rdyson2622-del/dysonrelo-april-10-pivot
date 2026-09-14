import React, { useState } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, CheckCircle2, 
  Waves, Clock, Square, DollarSign, Sparkles, Shield, Briefcase,
  Mic, User, Bot, Radio
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import { COPILOT_EXPLAINERS, findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch, showRail = true }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [isConsumerTransmitting, setIsConsumerTransmitting] = useState(false);
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
  const messagesEndRef = React.useRef(null);
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
  React.useEffect(() => {
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

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePillClick = (query) => {
    // 1. Highlight consumer transmitting
    setIsConsumerTransmitting(true);
    setTimeout(() => setIsConsumerTransmitting(false), 1400);

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

    // 1. Highlight consumer transmitting animation
    setIsConsumerTransmitting(true);
    setTimeout(() => setIsConsumerTransmitting(false), 1400);

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
      className="w-full rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden select-none text-left"
      style={{ background: '#080808', color: '#f5f5f5' }}
    >
      {/* ── TOP HEADER BAR: D&D badge + sweep copilot logo ── */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
        {/* Left: D&D badge + Back Button + Dual View Indicator */}
        <div className="flex items-center gap-3">
          <DysonVerticalBadge height={40} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase">
              PAGE 2 · COMMAND CENTER
            </span>
            <Square className="w-3.5 h-3.5 text-stone-500" />
          </div>
          {onBackToSearch && (
            <button
              type="button"
              onClick={onBackToSearch}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all ml-1 cursor-pointer"
            >
              ← Search
            </button>
          )}

          {/* Quick Right-Side View Switcher in Header: Audit, Solutions & News */}
          <div className="hidden sm:flex items-center bg-[#141414] p-0.5 rounded-lg border border-white/10 ml-2 gap-0.5">
            <button
              type="button"
              onClick={() => setRightPanelView('dossier')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'dossier'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>Audit</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelView('solutions')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'solutions'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>Solutions Vault</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelView('news')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                rightPanelView === 'news'
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>Daily News</span>
            </button>
          </div>

          {/* Dedicated Explode Button in Header - Especially Handy for Portrait Mobile Screens */}
          <button
            type="button"
            onClick={() => setIsPageExploded(true)}
            className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 text-[#D4AF37] text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ml-1 shadow-sm"
            title="Explode this view to full screen (ideal for portrait mobile devices)"
          >
            <span>⛶ Explode View</span>
          </button>
        </div>

        {/* Center / Right: Brand Header with Italicized Copilot */}
        <div className="flex items-baseline gap-2.5">
          <span 
            className="font-serif text-base sm:text-lg font-normal tracking-[0.18em] text-white uppercase leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            DYSON HOMES
          </span>
          <span 
            className="font-serif italic text-lg sm:text-[21px] font-normal text-[#D4AF37] leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            CoPilot
          </span>
        </div>
      </div>

      {/* ── UNIFIED 3-ZONE MAIN CANVAS: Far-Left Mini-Apps Rail (~124px), Left Dialogue Engine, Right Presentation Dossier ── */}
      <div className="flex flex-col lg:flex-row min-h-[740px]">
        
        {/* ── FAR-LEFT STREAMLINED AI MINIONS RAIL (24 APPS) ── */}
        {showRail && (
          <CopilotMiniAppsRail />
        )}

        {/* ── CENTER-LEFT COLUMN: ALL COMMUNICATION & LIVE DIALOGUE ENGINE ── */}
        <div className="w-full lg:w-[460px] xl:w-[490px] p-3 sm:p-4 flex flex-col justify-between bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0">
          
          {/* Scrollable Conversation Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[580px]">
            {/* Header Stage Label */}
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                3-WAY FIDUCIARY DIALOGUE STAGE
              </span>
              <span className="text-[8px] text-stone-500 font-mono">LIVE CONVERSATION</span>
            </div>

            {/* ── HOW TO / WHAT TO EXPECT: INTERACTIVE 3-WAY AUDIO DISCUSSION DEMO ── */}
            <CopilotThreeWayDemo 
              onTurnChange={setActiveDemoSpeaker}
              onMessagePosted={(msg) => {
                setMessages(prev => [...prev, msg]);
              }}
              onResetDemo={() => {
                setActiveDemoSpeaker(null);
              }}
            />

            {/* ── 3-WAY AVATAR STAGING: BOB, CHARLIE & CONSUMER/SUBSCRIBER ── */}
            <div className="flex flex-wrap items-start gap-2 pt-0.5">
              {/* Bob Dyson Box */}
              <CopilotDynamicSpeakerBox 
                speaker="bob"
                variant="card"
                activeExplainer={activeExplainer}
                isSpeakingOverride={activeDemoSpeaker === 'bob'}
                onClearExplainer={() => setActiveExplainer(null)}
                onTriggerExplainer={handlePillClick}
              />

              {/* Charlie Simmons Box */}
              <CopilotDynamicSpeakerBox 
                speaker="charlie"
                variant="card"
                activeExplainer={activeExplainer}
                isSpeakingOverride={activeDemoSpeaker === 'charlie'}
                onClearExplainer={() => setActiveExplainer(null)}
                onTriggerExplainer={handlePillClick}
                onVoiceTranscript={(t) => {
                  if (t?.text && t?.role === 'assistant') {
                    setMessages(prev => [
                      ...prev,
                      {
                        id: Date.now(),
                        sender: 'charlie',
                        text: t.text,
                      }
                    ]);
                  }
                }}
              />

              {/* Consumer / Subscriber Box (Enlarges when sending) */}
              <CopilotConsumerSpeakerBox 
                isTransmitting={isConsumerTransmitting || activeDemoSpeaker === 'consumer'}
                userName="You"
                userRole="Verified Buyer"
              />
            </div>

            {/* ── CHAT MESSAGES STREAM ── */}
            <div className="space-y-3 pt-2">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                const isBob = m.sender === 'bob';

                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Speaker Header Tag */}
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px]">
                      {isUser ? (
                        <>
                          <span className="text-stone-400 font-medium">You</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        </>
                      ) : isBob ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span className="text-[#D4AF37] font-bold">Bob Dyson (Broker)</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-emerald-400 font-bold">Charlie Simmons (Voice)</span>
                        </>
                      )}
                    </div>

                    <div 
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-[12.5px] leading-relaxed max-w-[94%] shadow-md ${
                        isUser
                          ? 'bg-[#1e1e1e] border border-white/15 text-white rounded-tr-xs'
                          : isBob
                          ? 'bg-[#16140e] border border-[#D4AF37]/40 text-stone-200 rounded-tl-xs'
                          : 'bg-[#141414] border border-white/10 text-stone-200 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>

                    {m.time && (
                      <span className="text-[9.5px] text-stone-500 mt-0.5 px-1 font-mono">
                        {m.time}
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── PINNED BOTTOM DIALOGUE BAR (MODELED AFTER GROK BOT) ── */}
          <div className="pt-2 mt-auto border-t border-white/10 sticky bottom-0 bg-[#0b0b0b] z-20 space-y-2">
            
            {/* Directional Guidance Chips: "Anything Real Estate" Mode */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What solutions and playbooks do you offer for home buyers?");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span>🔍 Anything Real Estate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, how does Dyson & Dyson handle transaction discovery and lender compliance?");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Shield className="w-2.5 h-2.5 text-yellow-400" />
                <span>Lender Compliance</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Briefcase className="w-2.5 h-2.5" />
                <span>Ask Bob: Escrow Traps</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("How does Prop 19 tax base portability work when relocating in California?");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-stone-300 border border-white/15 transition-all cursor-pointer"
              >
                <span>Prop 19 Tax</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('solutions');
                  handlePillClick("What are the coastal bluff setback and soil stability risks in California?");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-stone-300 border border-white/15 transition-all cursor-pointer"
              >
                <span>Bluff Setbacks</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRightPanelView('news');
                  handlePillClick("Charlie, summarize this broadcast in bullet points");
                }}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-2.5 h-2.5 text-rose-400" />
                <span>Daily News</span>
              </button>
            </div>

            {/* Grok-Style Message Bar with Directions */}
            <form onSubmit={handleSendMessage} className="space-y-1">
              <div className="flex items-center bg-[#141414] hover:bg-[#171717] rounded-2xl border border-white/15 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/40 px-3 py-2 shadow-2xl transition-all">
                <Paperclip className="w-4 h-4 text-stone-400 mr-2 shrink-0 cursor-pointer hover:text-white transition-colors" title="Attach file or pre-approval" />
                
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
                    className="p-1.5 rounded-full text-stone-400 hover:text-[#D4AF37] hover:bg-white/5 transition-all cursor-pointer"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 text-black flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5 text-black -rotate-12 translate-x-px" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8.5px] text-stone-500 px-1">
                <span>CoPilot Fiduciary Dialogue</span>
                <span className="font-mono">Zero Fee</span>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PROPERTY AUDIT & DAILY NEWS BROADCAST (WITH EXPLODE-TO-FULL-PAGE) ── */}
        <div className={`flex-1 min-w-0 transition-colors ${rightPanelView === 'solutions' ? 'bg-[#ede0cc]' : 'bg-[#080808]'}`}>
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

      {/* ── FULL-PAGE EXPLODED SUBJECT THEATER (VIDEOS, STORIES, SOLUTIONS, PROPERTY AUDIT) ── */}
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

      {/* ── CONTACT CAPTURE MODAL (ZERO-PRESSURE SUBSCRIBER ONBOARDING) ── */}
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