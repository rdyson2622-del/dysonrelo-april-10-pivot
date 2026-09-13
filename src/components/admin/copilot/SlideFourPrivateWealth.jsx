import React, { useState } from 'react';
import { Send, MapPin, CheckCircle2 } from 'lucide-react';
import CopilotDocumentViewer from './CopilotDocumentViewer';

const CHARLIE_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/1f6368d4d_CharlieSimmons_Headshot.png";

const INITIAL_PROPERTIES = {
  '742 Vista Del Mar, La Jolla, CA 92037': {
    address: '742 Vista Del Mar, La Jolla, CA 92037',
    price: 3450000,
    beds: 4,
    baths: 4.5,
    sqft: 3820,
    dom: 64,
    compsPrice: 3200000,
    rebate: 21562,
    risks: [
      '64 days on market — seller price reduction of $150k pending',
      'Coastal Commission permitting boundary: strict exterior remodel restrictions',
      'Recent neighborhood comp sold 7.2% below asking price'
    ],
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253': {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required',
      'Dual A/C units are 14 years old — approaching replacement lifecycle'
    ],
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  '4220 Oak Hollow Terrace, Austin, TX 78746': {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County reassessment triggers ~18% property tax escalation',
      'Flash flood zone buffer near greenbelt easement'
    ],
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
};

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [activeAddress, setActiveAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [property, setProperty] = useState(INITIAL_PROPERTIES['742 Vista Del Mar, La Jolla, CA 92037']);
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'charlie',
      text: "I've audited 742 Vista Del Mar. See the dossier on the right. Enter your mobile number to get the full report.",
      time: 'Just now'
    }
  ]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    // Append user message
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: 'Just now'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Check if input is a phone number
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

      // Check if user entered another address
      const matched = Object.keys(INITIAL_PROPERTIES).find(addr => 
        addr.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(addr.split(',')[0].toLowerCase())
      );

      if (matched || text.length > 10 && /\d+/.test(text)) {
        const targetProp = INITIAL_PROPERTIES[matched] || {
          address: text,
          price: 2650000,
          beds: 4,
          baths: 3.5,
          sqft: 3400,
          dom: 36,
          compsPrice: 2490000,
          rebate: 16562,
          risks: [
            'Market comps indicate listing price is ~6% above 90-day tract closed median',
            'Municipal tax basis will reset to purchase price upon escrow close'
          ],
          lastSoldPrice: 1720000,
          lastSoldYear: 2020
        };

        setProperty(targetProp);
        setActiveAddress(targetProp.address);
        if (onRunAudit) onRunAudit(targetProp.address);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'charlie',
            text: `I've updated the dossier for ${targetProp.address.split(',')[0]} on the right. It is listed at $${targetProp.price.toLocaleString()}, with an estimated buyer rebate of +$${targetProp.rebate.toLocaleString()} at closing.`,
            time: 'Just now'
          }
        ]);
        return;
      }

      // Default conversational response
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: `Got it. The dossier on the right reflects our latest closed comps analysis and rebate calculations for ${property.address.split(',')[0]}. Enter your phone number if you want a copy texted, or paste another address to audit.`,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className="w-full h-[780px] bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-left">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN: 35% WIDTH (THE CHAT INTERFACE ONLY)
          Strict clone of ChatGPT / Grok / Text Message Thread
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[35%] h-full flex flex-col bg-[#ffffff] border-r border-[#e2e8f0]">
        
        {/* Top: Clean Header ("Charlie AI") */}
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
              placeholder="Reply to Charlie..."
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
          Single, clean, cohesive digital document viewer
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[65%] h-full flex flex-col bg-[#f8f9fa] overflow-hidden">
        <CopilotDocumentViewer property={property} />
      </div>

    </div>
  );
}