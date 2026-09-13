import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import CopilotDocumentViewer from './CopilotDocumentViewer';

const CHARLIE_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/1f6368d4d_CharlieSimmons_Headshot.png";

export default function CopilotChatDossierCanvas({ property, onPropertyChange }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'charlie',
      text: `I've audited ${property?.address || 'the property'}. See the executive report on the right. Enter your mobile number to get the complete dossier via private text.`,
      time: 'Just now'
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
      time: 'Just now'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    const isPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(text.replace(/[\s\(\)\-\.]/g, ''));

    setTimeout(() => {
      if (isPhone) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'charlie',
            text: `Confirmed! I just dispatched the full audit dossier for ${property.address.split(',')[0]} to your phone. Zero sales spam or calls guaranteed.`,
            time: 'Just now'
          }
        ]);
        return;
      }

      if (text.length > 10 && /\d+/.test(text)) {
        if (onPropertyChange) {
          onPropertyChange(text);
        }
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'charlie',
            text: `Updating the dossier on the right for ${text.split(',')[0]} with comps, risk analysis, and buyer closing rebate.`,
            time: 'Just now'
          }
        ]);
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: `Got it. The dossier on the right reflects our latest closed comps and rebate calculations for ${property.address.split(',')[0]}. Enter your phone number if you want a copy texted, or type another address to audit.`,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className="w-full h-[760px] bg-white border border-[#d8cab6] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-left">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN: 35% WIDTH (THE CHAT INTERFACE ONLY)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[35%] h-full flex flex-col bg-[#ffffff] border-r border-[#e2e8f0]">
        
        {/* Top: Header ("Charlie AI") */}
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={CHARLIE_AVATAR} 
                alt="Charlie AI" 
                className="w-9 h-9 rounded-full object-cover border border-[#e2e8f0]" 
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f172a] tracking-tight">
                Charlie AI
              </h2>
              <span className="text-[11px] text-[#64748b]">
                Real Estate Copilot · Active
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            Audit Ready
          </span>
        </div>

        {/* Middle: Chat Bubbles Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafc]">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'charlie' && (
                <img 
                  src={CHARLIE_AVATAR} 
                  alt="Charlie" 
                  className="w-7 h-7 rounded-full object-cover border border-[#e2e8f0] shrink-0 mb-0.5" 
                />
              )}

              <div 
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#0f172a] text-white rounded-br-xs font-normal'
                    : 'bg-white border border-[#e2e8f0] text-[#1e293b] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">
                  {msg.text}
                </p>
                <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-[#94a3b8]'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Sticky Text Input Bar Pinned to Bottom */}
        <div className="p-3.5 bg-white border-t border-[#e2e8f0] shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Reply to Charlie or enter phone number..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#f1f5f9] border border-transparent focus:border-[#cbd5e1] focus:bg-white text-xs sm:text-sm text-[#0f172a] outline-none transition-all placeholder:text-[#94a3b8]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] disabled:opacity-40 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT COLUMN: 65% WIDTH (THE DOSSIER DOCUMENT ARTIFACT)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[65%] h-full flex flex-col bg-[#f8f9fa] overflow-hidden">
        <CopilotDocumentViewer property={property} />
      </div>

    </div>
  );
}