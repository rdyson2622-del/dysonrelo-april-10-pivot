import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Sparkles, Shield, User, Volume2, ShieldCheck, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotAvatarSlot, { CHARLIE_HEADSHOT } from '@/components/copilot/CopilotAvatarSlot';
import { COPILOT_EXPLAINERS, findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { CHARLIE_COPILOT_LIVE_PROMPT } from '@/lib/charlieSimmonsPrompt';

function isAddressLike(str) {
  if (!str) return false;
  const s = str.trim().toLowerCase();
  if (/^\d+\s+[a-z0-9\s.,#-]+/i.test(s) && (
    /\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|way|ct|court|lane|ln|cir|circle|ter|terrace|pl|place|hwy|highway|pkwy|parkway)\b/i.test(s) ||
    /,\s*[a-z]{2}\b/i.test(s) ||
    /\b\d{5}\b/.test(s) ||
    s.includes('vista del mar') ||
    s.includes('mountain shadow') ||
    s.includes('oak hollow')
  )) {
    return true;
  }
  if (s.includes('vista del mar') || s.includes('mountain shadow') || s.includes('oak hollow')) {
    return true;
  }
  return false;
}

export default function GrokPageTwoChatCanvas({ onAskAddress, onListenToggle, onBackToLanding, hideBadge = false }) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handlePillClick = (query) => {
    const explainer = findExplainerByQuery(query);
    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: query },
        { 
          id: Date.now() + 1, 
          sender: 'charlie', 
          text: explainer.textAnswer || `Playing the explainer for "${explainer.label}" in the Copilot slot above.` 
        }
      ]);
    } else {
      setActiveExplainer(null);
      if (onAskAddress) {
        onAskAddress(query);
      }
    }
  };

  const handleSubmit = async (e, customText) => {
    if (e) e.preventDefault();
    const query = (customText || inputValue).trim();
    if (!query) return;

    setInputValue('');

    // 1. Canned prompt pill check -> plays MP4 explainer
    const explainer = findExplainerByQuery(query);
    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: query },
        { 
          id: Date.now() + 1, 
          sender: 'charlie', 
          text: explainer.textAnswer || `Playing the explainer for "${explainer.label}" in the Copilot slot above.` 
        }
      ]);
      return;
    }

    // 2. Address-shaped input -> opens Page 3 Dossier
    if (isAddressLike(query)) {
      setActiveExplainer(null);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: query },
        { 
          id: Date.now() + 1, 
          sender: 'charlie', 
          text: `Auditing ${query} for honest comps, hidden risks, and closing-cost rebates. Opening your dossier now.` 
        }
      ]);
      if (onAskAddress) {
        setTimeout(() => {
          onAskAddress(query);
        }, 500);
      }
      return;
    }

    // 3. Non-address free-text question -> Real Charlie LLM response appended
    setActiveExplainer(null);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: query }
    ]);
    setIsTyping(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${CHARLIE_COPILOT_LIVE_PROMPT}

You are Charlie Simmons answering a live question typed into the DysonHomes Copilot Chat Canvas.
Provide a concise, authoritative, articulate 2 to 3 sentence fiduciary answer based on Bob Dyson's 55+ years of real estate brokerage leadership.
Remember: 0 fees for buyers, 25% broker-to-broker referral compensation, closing rebates where allowed by law, and refer to licensed CPA/attorney for legal/tax decisions.

User question: "${query}"`
      });

      const replyText = typeof res === 'string' 
        ? res 
        : (res?.output || res?.reply || res?.text || (typeof res === 'object' ? Object.values(res)[0] : 'I am here to guide your transaction.'));

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: String(replyText).replace(/^["']|["']$/g, '').trim()
        }
      ]);
    } catch (err) {
      console.warn('Charlie InvokeLLM error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: "As an independent fiduciary real estate concierge backed by Dyson & Dyson (CA DRE #02303118), our team reviews contracts, contingency timelines, and micro-comps directly. How can we assist with your target market or property?"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleListen = () => {
    setIsListening(prev => !prev);
    if (onListenToggle) onListenToggle();
  };

  return (
    <div 
      className="w-full min-h-[640px] flex flex-col justify-between p-6 sm:p-10 select-none text-left relative overflow-hidden"
      style={{ background: '#0a0a0a', color: '#f5f5f5' }}
    >
      {/* ── TOP HEADER ── */}
      <div className="flex items-center justify-between w-full border-b border-white/10 pb-4">
        {/* Top-Left: Clean D&D badge (if not hidden by parent) */}
        <div className="flex items-center gap-3">
          {!hideBadge && <DysonVerticalBadge height={44} />}
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              ← Back to Landing Page
            </button>
          )}
        </div>

        {/* Top-Right: Listen button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleListen}
            className="px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="flex items-end gap-0.5 h-3 text-[#D4AF37]">
              <span className="w-0.5 h-2 bg-[#D4AF37] rounded-full inline-block" />
              <span className="w-0.5 h-3 bg-[#D4AF37] rounded-full inline-block animate-pulse" />
              <span className="w-0.5 h-1.5 bg-[#D4AF37] rounded-full inline-block" />
              <span className="w-0.5 h-2.5 bg-[#D4AF37] rounded-full inline-block" />
            </span>
            <span>{isListening ? 'Listening...' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* ── CHARLIE AVATAR SLOT: Single responsive instance (reduced box width matching 25% circle scale) ── */}
      <div className="w-full max-w-xs mx-auto mb-2 lg:mb-0 lg:max-w-none lg:absolute lg:top-[84px] lg:right-3 lg:w-[140px] lg:z-20">
        <CopilotAvatarSlot 
          activeExplainer={activeExplainer}
          onClearExplainer={() => setActiveExplainer(null)}
          size="vertical"
        />
      </div>

      {/* ── CENTER CONTENT (Shifted left 5% and lowered another 10% for clear separation) ── */}
      <div className="w-full max-w-xl xl:max-w-2xl mx-auto text-center space-y-4 pt-4 lg:pt-24 pb-8 sm:pb-12 my-auto translate-y-[6%] -translate-x-[5%] transition-transform">

        {/* When no messages yet: Greeting heading */}
        {messages.length === 0 ? (
          <div className="space-y-1.5">
            <h1 
              className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-white tracking-tight font-serif"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              What can I help you with?
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 font-light tracking-wide">
              Ask Charlie about any address or tap a prompt for an explainer
            </p>
          </div>
        ) : (
          /* When messages exist: Conversation Stream Container */
          <div className="w-full max-h-[300px] sm:max-h-[320px] overflow-y-auto space-y-3 px-1 text-left scrollbar-thin">
            {messages.map((m) => (
              <div key={m.id}>
                {m.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-xs px-4 py-2.5 bg-[#1e1e1e] border border-white/10 text-white text-xs sm:text-[13px] max-w-[85%] shadow-md">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full border border-[#D4AF37] overflow-hidden shrink-0 mt-0.5 bg-black shadow">
                      <img src={CHARLIE_HEADSHOT} alt="Charlie Simmons" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="rounded-2xl rounded-bl-xs px-4 py-2.5 bg-[#141414] border border-[#D4AF37]/40 text-stone-200 text-xs sm:text-[13px] leading-relaxed max-w-[88%] shadow-lg whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-2 text-stone-400 text-xs italic pl-9">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span>Charlie is analyzing...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        )}

        {/* Prominent input + Gold Send */}
        <form onSubmit={handleSubmit} className="w-full pt-1">
          <div className="flex items-center bg-[#141414] rounded-full border-2 border-[#D4AF37]/60 shadow-[0_4px_24px_rgba(0,0,0,0.8)] px-5 py-3 transition-all focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]">
            <Paperclip className="w-5 h-5 text-[#D4AF37]/80 shrink-0 mr-3 cursor-pointer hover:text-[#D4AF37]" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste any property address or ask Charlie..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40 font-normal"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#D4AF37] hover:brightness-110 disabled:opacity-30 flex items-center justify-center text-black font-bold transition-all cursor-pointer shrink-0 ml-2 shadow-md"
            >
              <Send className="w-4 h-4 text-black -rotate-12 translate-x-px" />
            </button>
          </div>
        </form>

        {/* TAN prompt pills (black text, gold inside, mapped to shipped explainers) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handlePillClick('How do I get thousands back at closing?')}
            className={`px-3.5 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeExplainer?.id === 'closing_rebate' ? 'ring-2 ring-[#D4AF37] border-[#854d0e]' : 'border-[#c4b59f]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>How do I get thousands back at closing?</span>
          </button>

          <button
            type="button"
            onClick={() => handlePillClick('How do you find hidden property risks?')}
            className={`px-3.5 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeExplainer?.id === 'hidden_risks' ? 'ring-2 ring-[#D4AF37] border-[#854d0e]' : 'border-[#c4b59f]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>How do you find hidden property risks?</span>
          </button>

          <button
            type="button"
            onClick={() => handlePillClick('Who is Dyson & Dyson?')}
            className={`px-3.5 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeExplainer?.id === 'who_is_dyson' ? 'ring-2 ring-[#D4AF37] border-[#854d0e]' : 'border-[#c4b59f]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>Who is Dyson & Dyson?</span>
          </button>

          {/* Bob's solutions take trigger */}
          <button
            type="button"
            onClick={() => handlePillClick("Bob's Take: Escrow & Deal Traps")}
            className={`px-3.5 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeExplainer?.id === 'bob_solutions_traps' ? 'ring-2 ring-[#D4AF37] border-[#854d0e]' : 'border-[#c4b59f]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#854d0e]" />
            <span>Bob's Take: Escrow &amp; Deal Traps</span>
          </button>
        </div>

        {/* Trust Endorsement */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37] whitespace-nowrap font-medium">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] whitespace-nowrap font-medium">We are an independent research entity - no spam calls or agent involvement</span>
        </div>
      </div>

      {/* ── BOTTOM FOOTER ── */}
      <div className="w-full flex items-center justify-between text-[11px] text-stone-500 pt-4 border-t border-white/5">
        <span>DysonHomes Copilot • Chat Canvas</span>
        
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleListen}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>V2V</span>
          </button>
        </div>
      </div>
    </div>
  );
}