import React, { useState } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, CheckCircle2, 
  Waves, Clock, Square, DollarSign, Sparkles, Shield, Briefcase
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotAvatarSlot from '@/components/copilot/CopilotAvatarSlot';
import { COPILOT_EXPLAINERS, findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
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

  const handlePillClick = (query) => {
    const explainer = findExplainerByQuery(query);
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

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
            sender: 'charlie',
            text: `Got it! Let me know if you need any adjustments or offer structuring guidance for ${dossierData.shortAddress}.`
          }
        ]);
      }, 500);
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
            sender: 'charlie',
            text: `Got it! I've dispatched the ${dossierData.shortAddress} dossier directly to you. Feel free to ask about nearby micro-comps or offer terms.`
          }
        ]);
      }, 600);
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

      {/* ── 2-COLUMN MAIN CANVAS: Left ~35% Charlie Chat & Upper-Left Voice Box, Right ~65% Dossier (3 Tan Boxes) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* ── LEFT COLUMN: STICKY CHARLIE CHAT + CHARLIE VOICE BOX IN UPPER LEFT (~35% = 5 cols lg) ── */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-[#0d0d0d] border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-4">
            {/* Charlie in his vertical rectangular card positioned to the UPPER LEFT */}
            <div className="flex justify-start pl-1 pt-1">
              <div className="w-[185px]">
                <CopilotAvatarSlot 
                  activeExplainer={activeExplainer}
                  onClearExplainer={() => setActiveExplainer(null)}
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
                  size="vertical"
                />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3.5 pt-1">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed max-w-[92%] ${
                      m.sender === 'user'
                        ? 'bg-[#1e1e1e] border border-white/10 text-white rounded-br-xs'
                        : 'bg-[#161616] border border-white/10 text-stone-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                  {m.time && (
                    <span className="text-[10px] text-stone-500 mt-1 px-1">
                      {m.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Explainer Pills in Chat Column */}
          <div className="pt-3 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePillClick('How do I get thousands back at closing?')}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                activeExplainer?.id === 'closing_rebate'
                  ? 'bg-[#1e1e1e] text-[#D4AF37] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                  : 'bg-white/5 hover:bg-white/10 text-[#D4AF37] border-[#D4AF37]/40'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Closing rebate</span>
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('How do you find hidden property risks?')}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                activeExplainer?.id === 'hidden_risks'
                  ? 'bg-[#1e1e1e] text-[#D4AF37] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                  : 'bg-white/5 hover:bg-white/10 text-[#D4AF37] border-[#D4AF37]/40'
              }`}
            >
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span>Hidden risks</span>
            </button>
            <button
              type="button"
              onClick={() => handlePillClick("Bob's Take: Escrow & Deal Traps")}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                activeExplainer?.id === 'bob_solutions_traps'
                  ? 'bg-[#1e1e1e] text-[#D4AF37] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                  : 'bg-white/5 hover:bg-white/10 text-[#D4AF37] border-[#D4AF37]/40'
              }`}
            >
              <Briefcase className="w-3 h-3 text-[#D4AF37]" />
              <span>Bob's Take</span>
            </button>
          </div>

          {/* Bottom Chat Input Form: ask mobile to text report */}
          <div className="pt-3 mt-auto">
            <form onSubmit={handleSendMessage} className="space-y-1.5">
              <div className="flex items-center bg-[#141414] rounded-2xl border border-white/10 focus-within:border-[#D4AF37]/60 p-2 pl-3 shadow-inner">
                <Paperclip className="w-4 h-4 text-stone-400 mr-2 shrink-0 cursor-pointer hover:text-white" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your mobile or ask Charlie..."
                  className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-stone-500 font-normal"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-full bg-[#D4AF37] hover:brightness-110 disabled:opacity-40 text-black flex items-center justify-center transition-all cursor-pointer shrink-0 ml-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-black -rotate-12 translate-x-px" />
                </button>
              </div>
              <p className="text-[10px] text-stone-500 text-center">
                Charlie can make mistakes. Verify important information.
              </p>
            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: DOSSIER WITH THREE TAN FILL BOXES (~65% = 7 cols lg) ── */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#080808] space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="pb-1">
            <span className="text-[10.5px] font-bold tracking-widest text-[#D4AF37] uppercase font-mono">
              DOSSIER • {dossierData.shortAddress.toUpperCase()} {dossierData.city ? `(${dossierData.city.toUpperCase()})` : ''}
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