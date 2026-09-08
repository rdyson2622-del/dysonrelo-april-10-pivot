import React from 'react';
import { ExternalLink, ArrowRight, Compass, X, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#D4AF37';

export default function CharlieActionPointer({ action, onDismiss }) {
  const navigate = useNavigate();

  if (!action) return null;

  const isExternal = action.url || action.path?.startsWith('http');
  const targetUrl = action.url || action.path;
  const isMls = action.type === 'mls_search' || targetUrl?.includes('realtor.com') || targetUrl?.includes('homes.com');
  const displayLocation = action.location || action.title || 'Live MLS Search';

  const handleLaunch = () => {
    if (isExternal) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className="w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div
        className="p-3 sm:p-3.5 rounded-2xl border text-left shadow-2xl relative overflow-hidden backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, #111111 0%, #0d0d0d 100%)',
          borderColor: GOLD,
          boxShadow: '0 8px 32px rgba(212,175,55,0.25)',
        }}
      >
        {/* Glowing Ambient Accent */}
        <div
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none opacity-20 blur-xl"
          style={{ background: GOLD }}
        />

        {/* Top Status Line with Live Pointer Beacon */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Charlie's Pointer
            </span>
            <span className="text-[10px] text-white/50 hidden sm:inline">• 1-Tap Action Ready</span>
          </div>

          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white p-1 rounded cursor-pointer transition-colors"
            title="Dismiss pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pointer Directive Copy */}
        <div className="space-y-1 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <span className="text-base select-none animate-bounce">👉</span>
            <span>
              {isMls ? (
                <>Found live MLS listings for <span className="text-[#D4AF37] font-extrabold">{displayLocation}</span></>
              ) : (
                <>Ready to open <span className="text-[#D4AF37] font-extrabold">{action.title || action.path}</span></>
              )}
            </span>
          </div>
          <p className="text-[11px] text-white/70 pl-6 leading-tight">
            {isMls
              ? 'Search bar populated below. Tap the gold button to launch live listings in a new tab.'
              : 'Tap to proceed directly to this section of the DysonRelo platform.'}
          </p>
        </div>

        {/* Primary Action Button (The "Pointer" Button) */}
        <div className="flex flex-wrap items-center gap-2 pl-6">
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              color: '#0a0a0a',
            }}
          >
            {isMls ? (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span>Open {displayLocation} Listings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Open {action.title || 'Page'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {isMls && (
            <span className="text-[10px] text-white/50 italic">
              (Direct feed • zero spam)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}