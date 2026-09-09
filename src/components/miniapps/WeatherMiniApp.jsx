import React, { useState } from 'react';
import { 
  CloudSun, Sun, Cloud, CloudRain, Wind, Droplets, 
  MapPin, Compass, Search, ArrowRight, ShieldCheck, Sparkles, Thermometer
} from 'lucide-react';

const GOLD = '#D4AF37';

const PRESET_MARKETS = {
  'scottsdale': {
    city: 'Scottsdale, AZ',
    state: 'Arizona',
    temp: 84,
    condition: 'Sunny & Clear',
    high: 88,
    low: 64,
    humidity: 18,
    wind: '6 mph',
    sunDays: 314,
    taxNote: '0% State Income Tax • Warm dry desert winters',
    forecast: [
      { day: 'Wed', high: 88, low: 64, cond: 'Sunny' },
      { day: 'Thu', high: 86, low: 63, cond: 'Sunny' },
      { day: 'Fri', high: 89, low: 66, cond: 'Clear' },
      { day: 'Sat', high: 91, low: 67, cond: 'Sunny' },
      { day: 'Sun', high: 87, low: 65, cond: 'Clear' },
    ]
  },
  'austin': {
    city: 'Austin, TX',
    state: 'Texas',
    temp: 79,
    condition: 'Warm Breeze',
    high: 83,
    low: 61,
    humidity: 48,
    wind: '9 mph',
    sunDays: 228,
    taxNote: '0% State Income Tax • Moderate spring & fall',
    forecast: [
      { day: 'Wed', high: 83, low: 61, cond: 'Partly Cloudy' },
      { day: 'Thu', high: 85, low: 62, cond: 'Sunny' },
      { day: 'Fri', high: 82, low: 60, cond: 'Warm Breeze' },
      { day: 'Sat', high: 84, low: 63, cond: 'Sunny' },
      { day: 'Sun', high: 81, low: 59, cond: 'Clear' },
    ]
  },
  'naples': {
    city: 'Naples, FL',
    state: 'Florida',
    temp: 82,
    condition: 'Tropical Sunshine',
    high: 86,
    low: 71,
    humidity: 62,
    wind: '8 mph',
    sunDays: 264,
    taxNote: '0% State Income Tax • Year-round coastal climate',
    forecast: [
      { day: 'Wed', high: 86, low: 71, cond: 'Tropical Sun' },
      { day: 'Thu', high: 85, low: 70, cond: 'Sunny' },
      { day: 'Fri', high: 87, low: 72, cond: 'Breeze' },
      { day: 'Sat', high: 86, low: 71, cond: 'Sunny' },
      { day: 'Sun', high: 84, low: 69, cond: 'Clear' },
    ]
  },
  'boulder': {
    city: 'Boulder, CO',
    state: 'Colorado',
    temp: 64,
    condition: 'Crisp Alpine Sun',
    high: 68,
    low: 42,
    humidity: 24,
    wind: '11 mph',
    sunDays: 300,
    taxNote: '300+ Sunny Days/yr • Four season mountain lifestyle',
    forecast: [
      { day: 'Wed', high: 68, low: 42, cond: 'Sunny' },
      { day: 'Thu', high: 65, low: 40, cond: 'Crisp' },
      { day: 'Fri', high: 70, low: 44, cond: 'Clear' },
      { day: 'Sat', high: 66, low: 41, cond: 'Partly Cloudy' },
      { day: 'Sun', high: 63, low: 39, cond: 'Clear' },
    ]
  },
  'dallas': {
    city: 'Dallas, TX',
    state: 'Texas',
    temp: 77,
    condition: 'Mild & Clear',
    high: 81,
    low: 58,
    humidity: 44,
    wind: '10 mph',
    sunDays: 234,
    taxNote: '0% State Income Tax • Major corporate metro hub',
    forecast: [
      { day: 'Wed', high: 81, low: 58, cond: 'Sunny' },
      { day: 'Thu', high: 83, low: 60, cond: 'Clear' },
      { day: 'Fri', high: 80, low: 57, cond: 'Breeze' },
      { day: 'Sat', high: 82, low: 59, cond: 'Sunny' },
      { day: 'Sun', high: 79, low: 56, cond: 'Clear' },
    ]
  },
  'san_francisco': {
    city: 'San Francisco, CA',
    state: 'California',
    temp: 62,
    condition: 'Coastal Fog & Sun',
    high: 66,
    low: 51,
    humidity: 74,
    wind: '14 mph',
    sunDays: 260,
    taxNote: 'Origin Baseline • High coastal humidity & state tax',
    forecast: [
      { day: 'Wed', high: 66, low: 51, cond: 'Partly Cloudy' },
      { day: 'Thu', high: 64, low: 50, cond: 'Fog/Sun' },
      { day: 'Fri', high: 67, low: 52, cond: 'Clear' },
      { day: 'Sat', high: 65, low: 51, cond: 'Breezy' },
      { day: 'Sun', high: 63, low: 49, cond: 'Partly Cloudy' },
    ]
  }
};

export default function WeatherMiniApp({ onBack }) {
  const [originKey, setOriginKey] = useState('san_francisco');
  const [destinationKey, setDestinationKey] = useState('scottsdale');
  const [viewMode, setViewMode] = useState('compare'); // 'compare' | 'destination' | 'local'

  const origin = PRESET_MARKETS[originKey] || PRESET_MARKETS['san_francisco'];
  const dest = PRESET_MARKETS[destinationKey] || PRESET_MARKETS['scottsdale'];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-white text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-[#38bdf8]/50"
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
          >
            <CloudSun className="w-6 h-6 text-[#7dd3fc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                MINI APP
              </span>
              <span className="text-[10px] text-white/50 font-semibold tracking-wider uppercase">
                CLIMATE &amp; RELOCATION WEATHER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Local &amp; Destination Weather
            </h1>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('compare')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Compare Both
          </button>
          <button
            type="button"
            onClick={() => setViewMode('destination')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'destination'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Destination
          </button>
          <button
            type="button"
            onClick={() => setViewMode('local')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'local'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Local Origin
          </button>
        </div>
      </div>

      {/* Destination Quick Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] shrink-0">
          SELECT DESTINATION:
        </span>
        {Object.entries(PRESET_MARKETS).filter(([k]) => k !== originKey).map(([key, data]) => (
          <button
            key={key}
            type="button"
            onClick={() => setDestinationKey(key)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              destinationKey === key
                ? 'bg-[#D4AF37] text-black border-white shadow-md'
                : 'bg-[#181818] text-white/80 border-white/10 hover:border-[#D4AF37]'
            }`}
          >
            {data.city}
          </button>
        ))}
      </div>

      {/* Main Climate Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DESTINATION MARKET (HIGHLIGHTED) */}
        {(viewMode === 'compare' || viewMode === 'destination') && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1710] to-[#0e0e0e] border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37] text-black shadow-sm">
                  TARGET DESTINATION
                </span>
                <h2 className="text-xl font-bold font-serif text-white mt-1">
                  {dest.city}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-[#D4AF37]">
                  {dest.temp}°F
                </div>
                <div className="text-xs text-white/70 font-semibold">{dest.condition}</div>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">High / Low</div>
                <div className="font-mono font-bold text-white mt-0.5">{dest.high}° / {dest.low}°</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">Humidity</div>
                <div className="font-mono font-bold text-white mt-0.5">{dest.humidity}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">Wind</div>
                <div className="font-mono font-bold text-white mt-0.5">{dest.wind}</div>
              </div>
            </div>

            {/* Relocation Snapshot */}
            <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Annual Sunshine: {dest.sunDays} Days / Year</span>
              </div>
              <p className="text-[10.5px] text-white/70 leading-snug">
                {dest.taxNote}
              </p>
            </div>

            {/* 5-Day Outlook */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-white/50">5-Day Forecast</div>
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                {dest.forecast.map((f, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#141414] border border-white/10">
                    <div className="text-[10px] text-white/60 font-semibold">{f.day}</div>
                    <div className="font-mono font-bold text-white text-xs my-0.5">{f.high}°</div>
                    <div className="text-[9px] text-[#D4AF37] truncate">{f.cond}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOCAL CURRENT CITY */}
        {(viewMode === 'compare' || viewMode === 'local') && (
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#222] text-white/80 border border-white/20">
                  CURRENT LOCAL ORIGIN
                </span>
                <h2 className="text-xl font-bold font-serif text-white mt-1">
                  {origin.city}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-mono text-white/90">
                  {origin.temp}°F
                </div>
                <div className="text-xs text-white/60 font-semibold">{origin.condition}</div>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">High / Low</div>
                <div className="font-mono font-bold text-white mt-0.5">{origin.high}° / {origin.low}°</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">Humidity</div>
                <div className="font-mono font-bold text-white mt-0.5">{origin.humidity}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/10">
                <div className="text-[9.5px] text-white/50 uppercase font-semibold">Wind</div>
                <div className="font-mono font-bold text-white mt-0.5">{origin.wind}</div>
              </div>
            </div>

            {/* Relocation Snapshot */}
            <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-white/60" />
                <span>Annual Sunshine: {origin.sunDays} Days / Year</span>
              </div>
              <p className="text-[10.5px] text-white/50 leading-snug">
                {origin.taxNote}
              </p>
            </div>

            {/* 5-Day Outlook */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-white/50">5-Day Forecast</div>
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                {origin.forecast.map((f, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#181818] border border-white/10">
                    <div className="text-[10px] text-white/60 font-semibold">{f.day}</div>
                    <div className="font-mono font-bold text-white/80 text-xs my-0.5">{f.high}°</div>
                    <div className="text-[9px] text-white/50 truncate">{f.cond}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}