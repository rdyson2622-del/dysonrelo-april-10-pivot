import React, { useState } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, CheckCircle2, 
  Waves, Clock, Square, Compass
} from 'lucide-react';

const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const CHARLIE_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/1f6368d4d_CharlieSimmons_Headshot.png";

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'charlie',
      text: "I audited 742 Vista Del Mar, La Jolla.\nOverpriced vs comps; rebate estimate where allowed by law. Dossier on the right.\nWhat's your mobile so I can text this?"
    },
    {
      id: 2,
      sender: 'user',
      text: "742 Vista Del Mar, La Jolla, CA 92037",
      time: "10:24 AM"
    }
  ]);

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

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: `Got it! I've updated the file and dispatched the audit details. Feel free to ask any other questions about 742 Vista Del Mar.`
        }
      ]);
    }, 600);
  };

  return (
    <div 
      className="w-full rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden select-none text-left"
      style={{ background: '#080808', color: '#f5f5f5' }}
    >
      {/* ── TOP HEADER BAR ── */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
        {/* Left: D&D Logo + IN LAB + Back Button */}
        <div className="flex items-center gap-3">
          <img 
            src={DYSON_LOGO} 
            alt="Dyson & Dyson" 
            className="h-8 w-auto object-contain"
          />
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

        {/* Center / Right: Brand Header */}
        <div className="flex items-baseline gap-2">
          <span 
            className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            DYSON HOMES
          </span>
          <span 
            className="font-serif italic text-xl sm:text-2xl text-[#D4AF37] leading-none drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            copilot
          </span>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN CANVAS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* ── LEFT COLUMN: CHAT INTERFACE (35% = 4 cols lg) ── */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0d0d0d]">
          <div className="space-y-4">
            {/* Top Charlie Profile */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden bg-black">
                  <img 
                    src={CHARLIE_AVATAR} 
                    alt="Charlie" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Charlie</h3>
                <span className="text-xs text-stone-400">online</span>
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

          {/* Bottom Chat Input Form */}
          <div className="pt-4 mt-auto">
            <form onSubmit={handleSendMessage} className="space-y-1.5">
              <div className="flex items-center bg-[#141414] rounded-2xl border border-white/10 focus-within:border-[#D4AF37]/60 p-2 pl-3 shadow-inner">
                <Paperclip className="w-4 h-4 text-stone-400 mr-2 shrink-0 cursor-pointer hover:text-white" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-stone-500 font-normal"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-full bg-[#D4AF37] hover:brightness-110 disabled:opacity-40 text-black flex items-center justify-center transition-all cursor-pointer shrink-0 ml-1.5"
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

        {/* ── RIGHT COLUMN: DOSSIER ARTIFACT (65% = 7 cols lg) ── */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#080808] space-y-3.5 overflow-y-auto">
          {/* Header */}
          <div className="pb-1">
            <span className="text-[10.5px] font-bold tracking-widest text-[#D4AF37] uppercase font-mono">
              DOSSIER • 742 VISTA DEL MAR
            </span>
          </div>

          {/* ── CARD 1: HONEST COMPS ── */}
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0f0f0f] p-4 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#D4AF37]">
                HONEST COMPS
              </h3>
            </div>
            <p className="text-[11px] text-stone-400">
              Sold 30–90 days | Within 0.75 mi | Adjusted to 7/2024 market
            </p>

            {/* Comps Table */}
            <div className="space-y-1.5 pt-1 text-[11.5px] font-mono">
              <div className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/5 gap-2">
                <span className="font-semibold text-white w-28 sm:w-32">718 Via Capri</span>
                <span className="text-stone-400">0.32 mi</span>
                <span className="text-stone-400">5 bd | 4.5 ba | 4,612 sf</span>
                <span className="text-stone-200">Sold $6.25M</span>
                <span className="text-[#D4AF37] font-bold">Adj. $6.41M</span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/5 gap-2">
                <span className="font-semibold text-white w-28 sm:w-32">7550 Eads Ave</span>
                <span className="text-stone-400">0.48 mi</span>
                <span className="text-stone-400">4 bd | 4 ba | 3,980 sf</span>
                <span className="text-stone-200">Sold $5.30M</span>
                <span className="text-[#D4AF37] font-bold">Adj. $5.48M</span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-stone-300 py-1 border-b border-white/5 gap-2">
                <span className="font-semibold text-white w-28 sm:w-32">737 Bonair Way</span>
                <span className="text-stone-400">0.61 mi</span>
                <span className="text-stone-400">5 bd | 4 ba | 4,305 sf</span>
                <span className="text-stone-200">Sold $5.85M</span>
                <span className="text-[#D4AF37] font-bold">Adj. $6.02M</span>
              </div>
            </div>

            <p className="text-[11px] italic text-[#D4AF37] pt-1">
              Subject at $7.95M list is 24–32% above adjusted comps.
            </p>
          </div>

          {/* ── CARD 2: HIDDEN RISKS ── */}
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0f0f0f] p-4 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#D4AF37]">
                HIDDEN RISKS
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Topography &amp; drainage</h4>
                  <p className="text-stone-400 text-[11px]">
                    Steep lot; prior water intrusion noted in 2021 disclosure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Waves className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Coastal bluff influence</h4>
                  <p className="text-stone-400 text-[11px]">
                    Setback &amp; erosion disclosure on file; future costs possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Permit &amp; code notes</h4>
                  <p className="text-stone-400 text-[11px]">
                    Unpermitted pool heater; fence variance exception.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] italic text-[#D4AF37] pt-1">
              Review seller disclosures and coastal reports closely.
            </p>
          </div>

          {/* ── CARD 3: CLOSING-COST CREDIT ── */}
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0f0f0f] p-4 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#D4AF37]">
                CLOSING-COST CREDIT
              </h3>
            </div>
            <p className="text-[11px] text-stone-400">
              Rebate estimate where allowed by law | Based on $7.95M purchase price.
            </p>

            <div className="bg-[#141414] border border-white/5 rounded-lg p-3 sm:p-3.5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-stone-300">
                Estimated buyer credit
              </span>
              <div className="text-right">
                <div className="text-base sm:text-lg font-bold font-mono text-[#D4AF37]">
                  $199,500 – $238,500
                </div>
                <div className="text-[11px] text-[#D4AF37]/90 font-mono">
                  (2.51% – 3.00%)
                </div>
              </div>
            </div>

            <p className="text-[11px] italic text-[#D4AF37] pt-0.5">
              Requires licensed broker representation. Not available in all states.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}