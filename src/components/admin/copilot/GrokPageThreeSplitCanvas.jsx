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
import { COPILOT_EXPLAINERS, findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch, showRail = true }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [isConsumerTransmitting, setIsConsumerTransmitting] = useState(false);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const messagesEndRef = React.useRef(null);
  const dossierData = getPropertyDossier(property);

  const [messages, setMessages] = useState(() => {
    const data = getPropertyDossier(property);
    return [
      {
        id: 1,
        sender: 'charlie',
        text: `I audited ${data.shortAddress}, ${data.city}.\n${data.marketSummary} Dossier on the right.\nWhat's your mobile so I can text this report to you?`
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
        text: `I audited ${data.shortAddress}, ${data.city}.\n${data.marketSummary} Dossier on the right.\nWhat's your mobile so I can text this report to you?`
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

    const isBobQuery = /bob|trap|escrow|bluff|contract|legal|closing rebate|rebate/i.test(query);

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
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: isBobQuery ? 'bob' : 'charlie',
            text: isBobQuery
              ? `Bob Dyson here: Regarding "${query}" on ${dossierData.shortAddress} — in California transactions, we always draft contingency shields to verify soil stability and ensure credits are credited on your HUD-1 with zero hidden broker fees.`
              : `Got it! On ${dossierData.shortAddress}, the comps show 24–32% premium over adjusted sold averages. We can structure an offer anchored to the $6.25M micro-comps.`
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
    const isBobQuery = /bob|trap|escrow|bluff|contract|legal|fee|disclosure|title|broker/i.test(text);

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
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: isBobQuery ? 'bob' : 'charlie',
            text: isBobQuery
              ? `Bob Dyson: Under CA DRE #00609384, our fiduciary protocol protects you with zero added broker fees and strict disclosure audits for ${dossierData.shortAddress}. Would you like me to prepare an initial offer analysis?`
              : `Charlie: I've logged that for ${dossierData.shortAddress}. We can text this full audit directly to your phone or connect you live with Bob.`
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
        {/* Left: D&D badge + Back Button */}
        <div className="flex items-center gap-3">
          <DysonVerticalBadge height={40} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase">
              PAGE 3 · DOSSIER
            </span>
            <Square className="w-3.5 h-3.5 text-stone-500" />
          </div>
          {onBackToSearch && (
            <button
              type="button"
              onClick={onBackToSearch}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all ml-2 cursor-pointer"
            >
              ← Back to Landing Page
            </button>
          )}
        </div>

        {/* Center / Right: Brand Header with Italicized Copilot */}
        <div className="flex items-baseline gap-2.5">
          <span 
            className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            DYSON HOMES
          </span>
          <span 
            className="font-serif italic text-lg sm:text-[21px] font-medium text-[#D4AF37] leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            CoPilot
          </span>
        </div>
      </div>

      {/* ── UNIFIED 3-ZONE MAIN CANVAS: Far-Left Mini-Apps Rail (~124px), Left Dialogue Engine, Right Presentation Dossier ── */}
      <div className="flex flex-col lg:flex-row min-h-[740px]">
        
        {/* ── FAR-LEFT STREAMLINED AI MINIONS RAIL ── */}
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
            
            {/* Quick Prompt Pill Suggestions */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => handlePillClick('What should my opening offer be based on comps?')}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40 transition-all cursor-pointer"
              >
                <span>Opening offer?</span>
              </button>
              <button
                type="button"
                onClick={() => handlePillClick("Bob's Take: Escrow & Deal Traps")}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Briefcase className="w-2.5 h-2.5" />
                <span>Ask Bob</span>
              </button>
              <button
                type="button"
                onClick={() => handlePillClick('How do you find hidden property risks?')}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-stone-300 border border-white/15 transition-all cursor-pointer"
              >
                <span>Bluff risks</span>
              </button>
              <button
                type="button"
                onClick={() => handlePillClick('How do I get thousands back at closing?')}
                className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-white/5 hover:bg-white/10 text-stone-300 border border-white/15 transition-all cursor-pointer"
              >
                <span>Rebate info</span>
              </button>
            </div>

            {/* Grok-Style Message Bar */}
            <form onSubmit={handleSendMessage} className="space-y-1">
              <div className="flex items-center bg-[#141414] hover:bg-[#171717] rounded-2xl border border-white/15 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/40 px-3 py-2 shadow-2xl transition-all">
                <Paperclip className="w-4 h-4 text-stone-400 mr-2 shrink-0 cursor-pointer hover:text-white transition-colors" title="Attach file or pre-approval" />
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Bob or Charlie about comps, risks, or closing rebate..."
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
                <span>CoPilot Fiduciary Dialogue · DRE #00609384</span>
                <span className="font-mono">Zero Fee</span>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PRESENTATION DOSSIER + CHARLIE OPENING STATEMENT ── */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 bg-[#080808] space-y-4 overflow-y-auto">
          {/* ── CHARLIE'S OPENING GREETING BANNER (TRANSFERRED FROM PAGE 2) ── */}
          <div className="rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#17140b] via-[#101010] to-[#121212] p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  FIDUCIARY AUDIT COMPLETE
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                I've audited {dossierData.shortAddress}. Can we help?
              </h2>
              <p className="text-xs text-stone-300">
                {dossierData.marketSummary} Ask questions on the left or text the full dossier to your mobile.
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePillClick("Text full report to my mobile")}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Text Me Report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="pb-1 flex items-center justify-between">
            <span className="text-[10.5px] font-bold tracking-widest text-[#D4AF37] uppercase font-mono">
              DOSSIER • {dossierData.shortAddress.toUpperCase()} {dossierData.city ? `(${dossierData.city.toUpperCase()})` : ''}
            </span>
            <span className="text-[9px] text-stone-500 font-mono">
              INDEPENDENT 2ND-OPINION
            </span>
          </div>

          {/* ── BLACK BOX 1: HONEST COMPS (BLACK BACKDROP, WHITE/GREY/GOLD TEXT) ── */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                HONEST COMPS
              </h3>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Sold 30–90 days | Within 0.75 mi | Adjusted to current market
            </p>

            {/* Comps Table */}
            <div className="space-y-1.5 pt-1 text-[11.5px] font-mono">
              {dossierData.comps.map((comp, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/10 gap-2">
                  <span className="font-bold text-white w-32 sm:w-36 truncate">{comp.address}</span>
                  <span className="text-stone-400">{comp.distance}</span>
                  <span className="text-stone-400">{comp.specs}</span>
                  <span className="text-stone-300">{comp.soldPrice}</span>
                  <span className="text-[#D4AF37] font-bold">{comp.adjPrice}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold text-[#D4AF37] pt-1">
              {dossierData.compsSummary}
            </p>
          </div>

          {/* ── BLACK BOX 2: HIDDEN RISKS (BLACK BACKDROP, WHITE/GREY/GOLD TEXT) ── */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                HIDDEN RISKS
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {dossierData.risks.map((risk, idx) => {
                const IconComp = idx === 0 ? Scale : idx === 1 ? Waves : Clock;
                return (
                  <div key={risk.id || idx} className="flex items-start gap-2.5">
                    <IconComp className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{risk.title}</h4>
                      <p className="text-stone-400 text-[11px]">{risk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-semibold text-[#D4AF37] pt-1">
              {dossierData.risksSummary}
            </p>
          </div>

          {/* ── BLACK BOX 3: CLOSING-COST CREDIT (BLACK BACKDROP, WHITE/GREY/GOLD TEXT) ── */}
          <div className="rounded-xl border border-white/10 bg-[#121212] text-white p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                CLOSING-COST CREDIT
              </h3>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Rebate estimate where allowed by law | {dossierData.rebateBasis}
            </p>

            <div className="bg-[#181818] border border-white/10 rounded-lg p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-white">
                Estimated buyer credit
              </span>
              <div className="text-right">
                <div className="text-base sm:text-lg font-bold font-mono text-[#D4AF37]">
                  {dossierData.rebateRange}
                </div>
                <div className="text-[11px] text-stone-400 font-mono">
                  {dossierData.rebatePercent}
                </div>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#D4AF37] pt-0.5">
              Requires licensed broker representation. Not available in all states.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}