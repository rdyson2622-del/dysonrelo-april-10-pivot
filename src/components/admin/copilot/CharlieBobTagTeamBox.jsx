import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck, Sparkles, CheckCircle2, Award } from 'lucide-react';

const CHARLIE_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/1f6368d4d_CharlieSimmons_Headshot.png";
const BOB_AVATAR = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/7b1659a85_BobDyson_Still.png";

export default function CharlieBobTagTeamBox({ onOpenExplainer }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState('charlie'); // charlie | bob

  const handleTogglePlay = () => {
    setIsPlayingAudio(prev => !prev);
    if (!isPlayingAudio) {
      setActiveSpeaker('charlie');
      setTimeout(() => {
        setActiveSpeaker('bob');
      }, 3500);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0a0a0a] border border-[#222222] shadow-xl p-4 sm:p-6 text-white text-left space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider">
            HUMAN + AI DUO
          </div>
          <h3 
            className="text-base sm:text-lg font-bold text-white tracking-wide font-serif"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            The Charlie &amp; Bob Dyson Tag-Team Approach
          </h3>
        </div>

        {/* Audio Simulation Trigger */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            isPlayingAudio 
              ? 'bg-[#D4AF37] text-black shadow-lg animate-pulse' 
              : 'bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/40'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlayingAudio ? 'Playing Introduction...' : 'Listen: 30s Tag-Team Intro'}</span>
        </button>
      </div>

      {/* Main Tag-Team Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Charlie Card */}
        <div 
          className={`p-4 rounded-xl border transition-all ${
            isPlayingAudio && activeSpeaker === 'charlie'
              ? 'bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]'
              : 'bg-[#121212] border-white/10'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <img 
                src={CHARLIE_AVATAR} 
                alt="Charlie Simmons" 
                className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#D4AF37] text-black text-[8px] font-black uppercase">
                AI
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Charlie Simmons</span>
                <span className="text-[10px] text-[#D4AF37] font-semibold uppercase">AI Real Estate Copilot</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                &ldquo;Hi, I&rsquo;m Charlie. The split second you paste any property address or MLS link, I run algorithmic valuation models across actual closed sales, scan municipal permit records, check coastal commission boundaries, and calculate your closing rebate in under 30 seconds.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10.5px] text-[#D4AF37]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Instant Real-Time Ingestion
            </span>
            <span className="text-white/50">24/7 Zero-UI Analysis</span>
          </div>
        </div>

        {/* Bob Dyson Card */}
        <div 
          className={`p-4 rounded-xl border transition-all ${
            isPlayingAudio && activeSpeaker === 'bob'
              ? 'bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]'
              : 'bg-[#121212] border-white/10'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <img 
                src={BOB_AVATAR} 
                alt="Bob Dyson" 
                className="w-14 h-14 rounded-full object-cover border-2 border-[#ede0cc] shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[8px] font-black uppercase">
                DRE
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Bob Dyson</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Broker &bull; DRE #00609384</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                &ldquo;And I&rsquo;m Bob Dyson. I&rsquo;ve been a licensed California broker for over 35 years. Once Charlie pulls the raw data, my fiduciary brokerage team verifies the numbers, matches you with vetted local fiduciary representation, monitors every escrow milestone, and credits your cash rebate at closing.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10.5px] text-emerald-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 35+ Years California Brokerage
            </span>
            <span className="text-white/50">Escrow Monitoring &amp; Rebate</span>
          </div>
        </div>
      </div>

      {/* Summary Chips & Link to Explainer */}
      <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] flex items-center gap-1.5 text-white/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Zero UI &bull; No Spam
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] flex items-center gap-1.5 text-white/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Up To 50% Cash Rebate
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] flex items-center gap-1.5 text-white/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Fiduciary Escrow Oversight
          </span>
        </div>

        {onOpenExplainer && (
          <button
            type="button"
            onClick={() => onOpenExplainer(3)}
            className="text-[11px] text-[#D4AF37] hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Learn How We Audit Together &rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
}