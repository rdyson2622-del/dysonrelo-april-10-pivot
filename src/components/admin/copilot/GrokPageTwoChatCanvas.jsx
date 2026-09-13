import React, { useState } from 'react';
import { Paperclip, Send, Sparkles, Shield, User, Volume2, ShieldCheck } from 'lucide-react';

const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

export default function GrokPageTwoChatCanvas({ onAskAddress, onListenToggle }) {
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
      className="w-full min-h-[680px] lg:h-[720px] flex flex-col justify-between p-6 sm:p-10 select-none text-left relative overflow-hidden"
      style={{ background: '#0a0a0a', color: '#f5f5f5' }}
    >
      {/* ── TOP HEADER ── */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left Card with gold outline and Dyson & Dyson logo */}
        <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-2xl border border-[#D4AF37]/40 bg-[#121212]/60 p-2 sm:p-3 relative shadow-lg flex items-start justify-start">
          <img 
            src={DYSON_LOGO} 
            alt="Dyson & Dyson" 
            className="w-12 sm:w-14 h-auto object-contain"
          />
        </div>

        {/* Top-Right: — copilot script + Listen button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]/60 inline-block" />
            <span 
              className="font-serif italic text-2xl sm:text-3xl text-[#D4AF37] leading-none drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              copilot
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleListen}
            className="px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {/* Audio soundwave bars icon */}
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
        {/* Headline */}
        <div className="space-y-2">
          <h1 
            className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-white tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What can I help you with?
          </h1>
          <p className="text-sm sm:text-base text-stone-400 font-light tracking-wide">
            Ask Charlie about any address...
          </p>
        </div>

        {/* Search Pill Input */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center bg-[#141414] rounded-full border border-[#D4AF37]/60 shadow-[0_4px_24px_rgba(0,0,0,0.8)] px-5 py-3 transition-all focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/50">
            <Paperclip className="w-5 h-5 text-[#D4AF37]/80 shrink-0 mr-3 cursor-pointer hover:text-[#D4AF37]" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Charlie anything..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40 font-normal"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 disabled:opacity-30 transition-all cursor-pointer shrink-0 ml-2"
            >
              <Send className="w-4 h-4 text-[#D4AF37] -rotate-12 translate-x-px" />
            </button>
          </div>
        </form>

        {/* 3 Quick Prompt Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleSubmit(null, 'How do I get thousands back at closing?')}
            className="px-4 py-2 rounded-full border border-[#D4AF37]/35 bg-[#141414]/90 hover:bg-[#1a1a1a] hover:border-[#D4AF37] text-stone-200 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>How do I get thousands back at closing?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(null, 'How do you find hidden property risks?')}
            className="px-4 py-2 rounded-full border border-[#D4AF37]/35 bg-[#141414]/90 hover:bg-[#1a1a1a] hover:border-[#D4AF37] text-stone-200 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>How do you find hidden property risks?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(null, 'Who is Bob Dyson?')}
            className="px-4 py-2 rounded-full border border-[#D4AF37]/35 bg-[#141414]/90 hover:bg-[#1a1a1a] hover:border-[#D4AF37] text-stone-200 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Who is Bob Dyson?</span>
          </button>
        </div>

        {/* Trust Endorsement Note */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Trusted by discerning clients. Built for real estate clarity.</span>
        </div>
      </div>

      {/* ── BOTTOM FOOTER ── */}
      <div className="w-full flex items-center justify-between text-[11px] text-stone-500 pt-4">
        <span>Admin Lab • chat canvas •</span>
        <span className="hidden sm:inline">DysonHomes Copilot · Private Wealth</span>
      </div>
    </div>
  );
}