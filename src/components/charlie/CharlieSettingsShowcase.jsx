import React, { useState } from 'react';

export const CHARLIE_SETTINGS = [
  {
    id: 'studio_anchor',
    title: 'DNN News Anchor Desk',
    setting: 'Morning Studio Broadcast',
    role: 'Lead News Anchor & Market Intelligence',
    badge: 'ANCHOR DESK',
    badgeColor: 'bg-[#ef4444] text-white',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png',
    description: 'Charlie at the morning broadcast anchor desk breaking down 30-year fixed mortgage rates, Federal Reserve interest decisions, and national relocation migration corridors.',
  },
  {
    id: 'studio_stage',
    title: 'DNN Broadcast Stage',
    setting: 'Full Broadcast Studio Set',
    role: 'Studio Co-Anchor & Market Discussion',
    badge: 'STUDIO SET',
    badgeColor: 'bg-[#10b981] text-black font-black',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/8d6b4672f_Screenshot2026-08-24at1.59.35PM.png',
    description: 'Charlie and Bob on the DNN main stage delivering daily real estate intelligence, vetting reports, and transaction analysis.',
  },
  {
    id: 'world_desk',
    title: 'DNN World Desk',
    setting: 'Executive Anchor Suite',
    role: 'National Market Strategy & Corridor Analysis',
    badge: 'WORLD DESK',
    badgeColor: 'bg-[#D4AF37] text-black font-black',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0e52087b_Screenshot2026-09-09at23409PM.png',
    description: 'Charlie at the golden DNN world desk conducting comprehensive tax-saving reviews and relocation feasibility assessments.',
  },
  {
    id: 'advisory_portrait',
    title: 'Fiduciary Relocation Advisory',
    setting: 'Private Advisory Office',
    role: 'Conversational Voice-to-Voice Assistance',
    badge: 'GEMINI LIVE',
    badgeColor: 'bg-black text-[#10b981] border border-[#10b981]/50',
    image: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/17085d0f8_Screenshot2026-08-30at93052AM.png',
    description: 'Available around the clock on your mobile device or desktop to answer questions, audit agent credentials, coordinate move milestones, and connect you with vetted fiduciaries.',
  },
];

export default function CharlieSettingsShowcase() {
  const [selectedSetting, setSelectedSetting] = useState(CHARLIE_SETTINGS[0]);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#D4AF37]/40 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 
            className="text-lg font-bold text-white tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Charlie Across the Concierge Platform
          </h3>
          <p className="text-xs text-white/60">
            Multiple operational settings where Charlie guides your move
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black border border-[#D4AF37]/40 text-[#D4AF37]">
          4 SETTINGS
        </span>
      </div>

      {/* Settings Thumbnails Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CHARLIE_SETTINGS.map((item) => {
          const isSelected = selectedSetting.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSetting(item)}
              className={`rounded-2xl overflow-hidden border text-left transition-all cursor-pointer group flex flex-col ${
                isSelected
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-lg scale-102 bg-[#1c170d]'
                  : 'border-white/10 hover:border-white/30 bg-black/40'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-black">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[7px] font-black tracking-wider uppercase ${item.badgeColor} shadow`}>
                  {item.badge}
                </span>
              </div>

              <div className="p-2 min-w-0 flex-1 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </div>
                <div className="text-[9px] text-white/50 truncate">
                  {item.setting}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Featured Setting Card Detail */}
      <div className="p-3.5 rounded-2xl bg-black border border-white/10 flex flex-col sm:flex-row gap-3.5 items-center">
        <div className="w-full sm:w-44 aspect-[16/9] sm:aspect-[4/3] rounded-xl overflow-hidden border border-[#D4AF37]/40 shrink-0">
          <img 
            src={selectedSetting.image} 
            alt={selectedSetting.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5 min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${selectedSetting.badgeColor}`}>
              {selectedSetting.badge}
            </span>
            <span className="text-xs text-[#D4AF37] font-semibold truncate">
              {selectedSetting.role}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {selectedSetting.title} — {selectedSetting.setting}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            {selectedSetting.description}
          </p>
        </div>
      </div>
    </div>
  );
}