import React from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import CalendarMiniApp from './CalendarMiniApp';
import EmailMiniApp from './EmailMiniApp';
import CalculatorMiniApp from './CalculatorMiniApp';
import WeatherMiniApp from './WeatherMiniApp';

const GOLD = '#D4AF37';

export default function MiniAppModal({ appId, isOpen, onClose }) {
  if (!isOpen || !appId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl overflow-y-auto flex flex-col relative"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.2)',
        }}
      >
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 py-3 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#D4AF37]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              DYSONRELO MINI APP
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#282828] border border-white/20 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            title="Close Mini App"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-2 sm:p-4">
          {appId === 'calendar' && <CalendarMiniApp onBack={onClose} />}
          {appId === 'email' && <EmailMiniApp onBack={onClose} />}
          {appId === 'calculator' && <CalculatorMiniApp onBack={onClose} />}
          {appId === 'weather' && <WeatherMiniApp onBack={onClose} />}
        </div>
      </div>
    </div>
  );
}