import React, { useState } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, CheckCircle2, 
  Waves, Clock, Square, DollarSign, Sparkles, Shield, Briefcase
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotAvatarSlot from '@/components/copilot/CopilotAvatarSlot';
import { COPILOT_EXPLAINERS, findExplainerByQuery } from '@/components/copilot/copilotExplainers';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'charlie',
      text: "I audited 742 Vista Del Mar, La Jolla.\nOverpriced vs comps; rebate estimate where allowed by law. Dossier on the left.\nWhat's your mobile so I can text this report to you?"
    },
    {
      id: 2,
      sender: 'user',
      text: "742 Vista Del Mar, La Jolla, CA 92037",
      time: "10:24 AM"
    }
  ]);

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
            text: `Got it! Let me know if you need any adjustments or offer structuring guidance for 742 Vista Del Mar.`
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
            text: `Got it! I've dispatched the 742 Vista Del Mar dossier directly to you. Feel free to ask about nearby micro-comps or offer terms.`
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

      {/* ── 2-COLUMN MAIN CANVAS (REVERSED): Left ~65% Dossier, Right ~35% Sticky Chat + Charlie in Box ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* ── LEFT COLUMN: DOSSIER WITH THREE TAN FILL BOXES (~65% = 7 cols lg) ── */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#080808] space-y-4 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Header */}
          <div className="pb-1">
            <span className="text-[10.5px] font-bold tracking-widest text-[#D4AF37] uppercase font-mono">
              DOSSIER • 742 VISTA DEL MAR
            </span>
          </div>

          {/* ── TAN BOX 1: HONEST COMPS (TAN FILL #ede0cc, BLACK TEXT) ── */}
          <div className="rounded-xl border border-[#c4b59f] bg-[#ede0cc] text-[#0a0a0a] p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#854d0e]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#1a1815]">
                HONEST COMPS
              </h3>
            </div>
            <p className="text-[11px] text-[#554c40] font-medium">
              Sold 30–90 days | Within 0.75 mi | Adjusted to current market
            </p>

            {/* Comps Table in Tan Container */}
            <div className="space-y-1.5 pt-1 text-[11.5px] font-mono">
              <div className="flex flex-wrap items-center justify-between text-[#2a241c] py-1 border-b border-[#d8cab6] gap-2">
                <span className="font-bold text-[#0a0a0a] w-28 sm:w-32">718 Via Capri</span>
                <span className="text-[#554c40]">0.32 mi</span>
                <span className="text-[#554c40]">5 bd | 4.5 ba | 4,612 sf</span>
                <span className="text-[#2a241c]">Sold $6.25M</span>
                <span className="text-[#854d0e] font-bold">Adj. $6.41M</span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[#2a241c] py-1 border-b border-[#d8cab6] gap-2">
                <span className="font-bold text-[#0a0a0a] w-28 sm:w-32">7550 Eads Ave</span>
                <span className="text-[#554c40]">0.48 mi</span>
                <span className="text-[#554c40]">4 bd | 4 ba | 3,980 sf</span>
                <span className="text-[#2a241c]">Sold $5.30M</span>
                <span className="text-[#854d0e] font-bold">Adj. $5.48M</span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[#2a241c] py-1 border-b border-[#d8cab6] gap-2">
                <span className="font-bold text-[#0a0a0a] w-28 sm:w-32">737 Bonair Way</span>
                <span className="text-[#554c40]">0.61 mi</span>
                <span className="text-[#554c40]">5 bd | 4 ba | 4,305 sf</span>
                <span className="text-[#2a241c]">Sold $5.85M</span>
                <span className="text-[#854d0e] font-bold">Adj. $6.02M</span>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#854d0e] pt-1">
              Subject at $7.95M list is 24–32% above adjusted comps.
            </p>
          </div>

          {/* ── TAN BOX 2: HIDDEN RISKS (TAN FILL #ede0cc, BLACK TEXT) ── */}
          <div className="rounded-xl border border-[#c4b59f] bg-[#ede0cc] text-[#0a0a0a] p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#854d0e]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#1a1815]">
                HIDDEN RISKS
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-[#854d0e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#0a0a0a]">Topography &amp; drainage</h4>
                  <p className="text-[#554c40] text-[11px]">
                    Steep lot; prior water intrusion noted in 2021 disclosure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Waves className="w-4 h-4 text-[#854d0e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#0a0a0a]">Coastal bluff influence</h4>
                  <p className="text-[#554c40] text-[11px]">
                    Setback &amp; erosion disclosure on file; future costs possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#854d0e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#0a0a0a]">Permit &amp; code notes</h4>
                  <p className="text-[#554c40] text-[11px]">
                    Unpermitted pool heater; fence variance exception.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#854d0e] pt-1">
              Review seller disclosures and coastal reports closely.
            </p>
          </div>

          {/* ── TAN BOX 3: CLOSING-COST CREDIT (TAN FILL #ede0cc, BLACK TEXT) ── */}
          <div className="rounded-xl border border-[#c4b59f] bg-[#ede0cc] text-[#0a0a0a] p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#854d0e]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#1a1815]">
                CLOSING-COST CREDIT
              </h3>
            </div>
            <p className="text-[11px] text-[#554c40] font-medium">
              Rebate estimate where allowed by law | Based on $1.5M purchase price.
            </p>

            <div className="bg-[#f7efe3] border border-[#d8cab6] rounded-lg p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-[#1a1815]">
                Estimated buyer credit
              </span>
              <div className="text-right">
                <div className="text-base sm:text-lg font-bold font-mono text-[#854d0e]">
                  $10,000 – $12,000
                </div>
                <div className="text-[11px] text-[#554c40] font-mono">
                  (0.67% – 0.80%)
                </div>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#854d0e] pt-0.5">
              Requires licensed broker representation. Not available in all states.
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN: STICKY CHARLIE CHAT + CHARLIE IN HIS VERTICAL BOX LIKE SLIDE #2 (~35% = 5 cols lg) ── */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-[#0d0d0d]">
          <div className="space-y-4">
            {/* Charlie in his vertical rectangular card like Slide #2 positioned to the right */}
            <div className="flex justify-end pr-1 pt-1">
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
                  ? 'bg-[#ede0cc] text-black border-[#854d0e] ring-1 ring-[#D4AF37]'
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
                  ? 'bg-[#ede0cc] text-black border-[#854d0e] ring-1 ring-[#D4AF37]'
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
                  ? 'bg-[#ede0cc] text-black border-[#854d0e] ring-1 ring-[#D4AF37]'
                  : 'bg-white/5 hover:bg-white/10 text-[#D4AF37] border-[#D4AF37]/40'
              }`}
            >
              <Briefcase className="w-3 h-3 text-[#854d0e]" />
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

      </div>
    </div>
  );
}