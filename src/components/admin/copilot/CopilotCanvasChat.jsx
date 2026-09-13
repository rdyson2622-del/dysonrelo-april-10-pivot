import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Phone, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

const CHARLIE_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/1f6368d4d_CharlieSimmons_Headshot.png";
const BOB_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/7b1659a85_BobDyson_Still.png";

export default function CopilotCanvasChat({ 
  messages, 
  onSendMessage, 
  onSendSms,
  smsSent,
  activePropertyAddress,
  onReset
}) {
  const [inputText, setInputText] = useState('');
  const [phoneText, setPhoneText] = useState('');

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneText.trim()) return;
    onSendSms(phoneText);
    setPhoneText('');
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-2xl overflow-hidden text-left">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-[#111111] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img 
              src={CHARLIE_AVATAR} 
              alt="Charlie AI" 
              className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]" 
            />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-1 ring-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Charlie AI Copilot</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold uppercase">
                Fiduciary
              </span>
            </div>
            <span className="text-[10px] text-white/50 block">Backed by Bob Dyson (DRE #00609384)</span>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            New Search
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <img 
                src={msg.speaker === 'bob' ? BOB_AVATAR : CHARLIE_AVATAR} 
                alt="Assistant" 
                className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]/70 shrink-0 mt-0.5" 
              />
            )}
            
            <div 
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] text-black font-medium'
                  : 'bg-[#141414] border border-[#2a2a2a] text-white/90'
              }`}
            >
              {msg.role !== 'user' && (
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                  {msg.speaker === 'bob' ? 'Bob Dyson (Broker)' : 'Charlie (AI Copilot)'}
                </span>
              )}
              <p className="whitespace-pre-line text-[11.5px] leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* SMS Lead Capture Block if relevant */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#161208] to-[#0d0d0d] border border-[#D4AF37]/50 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Phone className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Send Dossier To My Mobile</span>
          </div>
          <p className="text-[10.5px] text-white/70 leading-snug">
            Never spammed or auctioned to outside agents. Enter your number for direct private delivery:
          </p>
          
          {smsSent ? (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10.5px] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Dossier queued! Sent via SMS.</span>
            </div>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="tel"
                value={phoneText}
                onChange={(e) => setPhoneText(e.target.value)}
                placeholder="(555) 000-0000"
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs outline-none focus:border-[#D4AF37] font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-black font-bold text-[10.5px] shrink-0 transition-all cursor-pointer"
              >
                Text Me
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleTextSubmit} className="p-2.5 bg-[#111111] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Charlie or Bob anything..."
          className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-[#D4AF37] placeholder:text-white/40"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black transition-all cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}