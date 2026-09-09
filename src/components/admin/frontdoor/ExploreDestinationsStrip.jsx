import React, { useRef } from 'react';
import { Compass, Sun, Mountain, Waves, TrendingUp, Building, ChevronLeft, ChevronRight } from 'lucide-react';

const QUICK_MARKETS = [
  {
    city: 'Scottsdale, AZ',
    state: 'AZ',
    avgPrice: '$3.85M',
    tag: 'Low Tax • Sunbelt',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Austin, TX',
    state: 'TX',
    avgPrice: '$4.25M',
    tag: '0% State Tax • Tech',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Naples, FL',
    state: 'FL',
    avgPrice: '$6.75M',
    tag: 'Waterfront • No Tax',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Boulder, CO',
    state: 'CO',
    avgPrice: '$4.90M',
    tag: 'Mountain Outdoors',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Nashville, TN',
    state: 'TN',
    avgPrice: '$3.95M',
    tag: '0% State Tax • Belle Meade',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Dallas, TX',
    state: 'TX',
    avgPrice: '$5.40M',
    tag: 'Highland Park • Executive',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=90',
  },
];

export default function ExploreDestinationsStrip({ onMarketClick }) {
  const scrollRef = useRef(null);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-b border-[#0a0a0a]/15 shadow-inner" 
      style={{ background: '#f5eee2' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header bar with controls */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0a0a0a]">
              Explore Top Relocation Destinations:
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#665a4c] font-medium hidden md:inline">
              Zero state tax havens &amp; executive growth hubs nationwide
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollBy(-220)}
                className="w-6 h-6 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer shadow-sm border border-[#D4AF37]/40"
                title="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(220)}
                className="w-6 h-6 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer shadow-sm border border-[#D4AF37]/40"
                title="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div 
          ref={scrollRef}
          className="flex items-stretch gap-3 overflow-x-auto pb-1.5 scroll-smooth no-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {QUICK_MARKETS.map((m) => {
            const MarketIcon = m.icon;
            return (
              <button
                key={m.city}
                type="button"
                onClick={() => onMarketClick && onMarketClick(m.city)}
                className="group relative rounded-xl overflow-hidden p-2.5 text-left border border-[#D4AF37]/50 shadow-md transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer flex flex-col justify-end min-h-[112px] bg-[#0a0a0a] shrink-0 w-[185px] sm:w-[200px]"
              >
                <img
                  src={m.image}
                  alt={m.city}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.92) 100%)',
                  }}
                />
                <div className="relative z-10">
                  <span className="text-[8.5px] font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 drop-shadow">
                    <MarketIcon className="w-2.5 h-2.5" />
                    <span>{m.tag}</span>
                  </span>
                  <span className="text-xs font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors drop-shadow block">
                    {m.city}
                  </span>
                  <span className="text-[10px] text-white/90 font-mono block drop-shadow">
                    Avg {m.avgPrice}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}