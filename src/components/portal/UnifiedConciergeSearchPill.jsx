import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, ArrowRight, Sparkles, Home, ShieldCheck, MapPin } from 'lucide-react';

const GOLD = '#D4AF37';

export default function UnifiedConciergeSearchPill({ 
  placeholder,
  className = '',
  onQuerySubmit,
  showVoiceToggle = true,
  showSuggestions = false
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceNote, setVoiceNote] = useState('Charlie is listening live...');

  const defaultPlaceholder = "Ask anything: taxes, schools, 1031 exchange, or search any city or listing link...";

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceNote('Charlie listening: "Hello! How can I help orchestrate your move today?"');
    } else {
      setIsVoiceActive(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (onQuerySubmit) {
      onQuerySubmit(q);
      return;
    }

    const lower = q.toLowerCase();

    // 1. Voice query trigger
    if (lower.includes('voice') || lower.includes('talk with charlie') || lower.includes('speak to charlie')) {
      navigate('/talking-app');
      return;
    }

    // 2. Listing URL pasted (Zillow, Realtor, Redfin, Homes.com, etc.)
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.includes('zillow.com') || lower.includes('realtor.com') || lower.includes('redfin.com') || lower.includes('homes.com')) {
      navigate(`/search?inspectListing=${encodeURIComponent(q)}`);
      return;
    }

    // 3. Question / Strategy / Tax / Roadmap request
    const isQuestionOrTopic = 
      q.includes('?') || 
      lower.startsWith('how') || 
      lower.startsWith('what') || 
      lower.startsWith('why') || 
      lower.startsWith('when') || 
      lower.startsWith('where') || 
      lower.startsWith('can') ||
      lower.includes('tax') || 
      lower.includes('1031') || 
      lower.includes('school') || 
      lower.includes('roadmap') || 
      lower.includes('cost') || 
      lower.includes('fee') || 
      lower.includes('solution') || 
      lower.includes('strategy') || 
      lower.includes('vet agent') ||
      lower.includes('advice');

    if (isQuestionOrTopic) {
      navigate(`/solutions?prompt=${encodeURIComponent(q)}&autostart=true`);
      return;
    }

    // 4. Default to Destination Market / City Search
    const clean = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
    window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Main Unified Pill Container */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full border-2 border-[#D4AF37] shadow-xl text-[#0a0a0a] transition-all focus-within:ring-2 focus-within:ring-[#D4AF37] relative"
        style={{ background: '#faf6ee' }}
      >
        {/* Search / Ask Icon */}
        <div className="flex items-center gap-2.5 w-full pl-3.5 sm:pl-4 py-1">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#854d0e] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full bg-transparent text-xs sm:text-sm text-[#0a0a0a] placeholder:text-stone-500 font-medium focus:outline-none"
          />
        </div>

        {/* Embedded Voice Button inside the Pill */}
        {showVoiceToggle && (
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2 rounded-full transition-all shrink-0 cursor-pointer shadow-sm ${
              isVoiceActive 
                ? 'bg-[#10b981] text-black animate-bounce' 
                : 'bg-[#0a0a0a] text-[#10b981] hover:bg-[#1a1a1a]'
            }`}
            title={isVoiceActive ? "End live voice" : "Talk with Charlie Voice AI"}
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          className="px-5 sm:px-6 py-2 rounded-full text-xs font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0 shadow-md cursor-pointer flex items-center gap-1.5"
          style={{
            background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
          }}
        >
          <span>Ask / Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Spoken Voice Banner if Voice Active */}
      {isVoiceActive && (
        <div className="p-3 rounded-xl bg-[#0a0a0a] text-white border border-[#10b981] text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping shrink-0" />
            <span className="text-[#10b981] font-semibold italic truncate">{voiceNote}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/talking-app')}
              className="text-[11px] text-[#D4AF37] underline font-bold whitespace-nowrap hover:text-white"
            >
              Full Studio View →
            </button>
            <button
              type="button"
              onClick={() => setIsVoiceActive(false)}
              className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-700 font-bold"
            >
              End
            </button>
          </div>
        </div>
      )}

      {/* Optional Quick Suggestion Prompts */}
      {showSuggestions && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-[#554433] scrollbar-none">
          <span className="text-[10px] font-black uppercase text-[#854d0e] shrink-0">Try asking:</span>
          {[
            "1031 Exchange tax rules for CA to AZ",
            "Top public schools in Scottsdale vs Dallas",
            "Vet listing at 2840 Silverleaf",
            "How does zero-fee concierge work?"
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(prompt);
                navigate(`/solutions?prompt=${encodeURIComponent(prompt)}&autostart=true`);
              }}
              className="px-2.5 py-1 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-stone-800 whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}