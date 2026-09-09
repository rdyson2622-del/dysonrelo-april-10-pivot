import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import CalendarMiniApp from '@/components/miniapps/CalendarMiniApp';
import EmailMiniApp from '@/components/miniapps/EmailMiniApp';
import CalculatorMiniApp from '@/components/miniapps/CalculatorMiniApp';
import WeatherMiniApp from '@/components/miniapps/WeatherMiniApp';

export default function MiniAppPage({ appType }) {
  const { type } = useParams();
  const navigate = useNavigate();
  const currentApp = appType || type;

  return (
    <div className="min-h-screen bg-[#070707] text-white p-3 sm:p-6 flex flex-col items-center">
      {/* Top Breadcrumb Header */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-3 mb-4 border-b border-[#D4AF37]/20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/portal')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Portal Front Door</span>
        </button>
      </div>

      {/* Main Mini App Component */}
      <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-2xl border border-[#D4AF37]/40 shadow-2xl p-2 sm:p-4">
        {currentApp === 'calendar' && <CalendarMiniApp />}
        {currentApp === 'email' && <EmailMiniApp />}
        {currentApp === 'calculator' && <CalculatorMiniApp />}
        {currentApp === 'weather' && <WeatherMiniApp />}
      </div>
    </div>
  );
}