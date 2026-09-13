import React, { useState } from 'react';
import { Paperclip, Send, Sparkles, Shield, User, Volume2, ShieldCheck } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

export default function GrokPageTwoChatCanvas({ onAskAddress, onListenToggle, onBackToLanding, hideBadge = false }) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e, customText) => {
    if (e) e.preventDefault();
    const query = customText || inputValue;
    if (!query.trim()) return;
    if (onAskAddress) {
      onAskAddress(query.trim());
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

      {/* ── CENTER CONTENT ── */}
      <div className="w-full max-w-2xl mx-auto text-center space-y-6 my-auto py-8">
        {/* Headline greeting */}
        <div className="space-y-2">
          <h1 
            className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-white tracking-tight font-serif"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What can I help you with?
          </h1>
          <p className="text-sm sm:text-base text-stone-400 font-light tracking-wide">
            Ask Charlie about any address
          </p>
        </div>

        {/* Prominent input + Gold Send */}
        <form onSubmit={handleSubmit} className="w-full">
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
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[#D4AF37] hover:brightness-110 disabled:opacity-30 flex items-center justify-center text-black font-bold transition-all cursor-pointer shrink-0 ml-2 shadow-md"
            >
              <Send className="w-4 h-4 text-black -rotate-12 translate-x-px" />
            </button>
          </div>
        </form>

        {/* Three TAN pills (black text, gold inside):
            1) How do I get thousands back at closing?
            2) How do you find hidden property risks?
            3) Who is Dyson & Dyson? */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit(null, 'How do I get thousands back at closing?')}
            className="px-4 py-2.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border border-[#c4b59f] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>How do I get thousands back at closing?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(null, 'How do you find hidden property risks?')}
            className="px-4 py-2.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border border-[#c4b59f] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>How do you find hidden property risks?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(null, 'Who is Dyson & Dyson?')}
            className="px-4 py-2.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] border border-[#c4b59f] text-[#0a0a0a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-[#b8920a]" />
            <span>Who is Dyson & Dyson?</span>
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
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8c84a] text-black font-semibold text-xs shadow-lg">
          <span className="flex items-center gap-1">
            <span className="text-sm font-bold leading-none">+</span>
            <span>Refer a Friend</span>
          </span>
          <span className="text-black/40">|</span>
          <span className="flex items-center gap-1 text-[11px] font-bold">
            <Volume2 className="w-3.5 h-3.5 text-black" />
            <span>V2V</span>
          </span>
        </div>
      </div>
    </div>
  );
}