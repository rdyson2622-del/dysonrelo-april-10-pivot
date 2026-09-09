import React from 'react';
import { 
  Sliders, Eye, Sparkles, Image, Type, Search, Mic, MapPin, 
  Layers, CheckCircle, ChevronDown, Check
} from 'lucide-react';

const GOLD = '#D4AF37';

const HERO_STYLES = [
  {
    id: 'split_concierge',
    title: 'Split Concierge (Current Dyson Model)',
    desc: 'Architectural photo on right, organized to-do pathways & Charlie Voice Concierge on left.',
    badge: 'Recommended',
  },
  {
    id: 'full_bleed_architectural',
    title: 'Full-Bleed Architectural Hero',
    desc: 'High-impact full-width estate photography with centered gold search pill & overlay copy.',
    badge: 'Luxury Presence Signature',
  },
  {
    id: 'cinematic_video',
    title: 'Cinematic Twilight Drone Loop',
    desc: 'Muted 4K luxury estate twilight footage with elegant serif branding & floating concierge bar.',
    badge: 'High Engagement',
  },
  {
    id: 'minimal_search',
    title: 'Minimalist Clean Search',
    desc: 'Understated luxury with prominent search engine, market tags, and zero visual clutter.',
    badge: 'Ultra Fast',
  },
];

const PRESET_BACKGROUNDS = [
  { id: 'scottsdale', name: 'Scottsdale, AZ', tag: '$8.9M • Desert Sunset', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=90' },
  { id: 'austin', name: 'Austin, TX', tag: '$7.5M • Hill Country Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90' },
  { id: 'naples', name: 'Naples, FL', tag: '$12.8M • Waterfront Sunset', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=90' },
  { id: 'boulder', name: 'Boulder, CO', tag: '$9.2M • Alpine Glass Manor', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90' },
  { id: 'dallas', name: 'Dallas, TX', tag: '$7.8M • Preston Hollow Estate', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=90' },
];

export default function BuilderSectionControls({ config, onChange }) {
  return (
    <div className="space-y-6 text-left">
      {/* 1. HERO SECTION CONFIGURATION */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Hero Layout Style
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
            Luxury Presence Pattern
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {HERO_STYLES.map((style) => {
            const isSelected = config.hero_style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange('hero_style', style.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#1e1910] border-[#D4AF37] shadow-lg'
                    : 'bg-[#0d0d0d] border-white/10 hover:border-white/30'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{style.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-snug">{style.desc}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COPY & MESSAGING EDITORS */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#D4AF37]" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Brand Statements &amp; Copy
          </h4>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
              Primary Brand Headline
            </label>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => onChange('headline', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
              Supporting Value Statement
            </label>
            <textarea
              rows={2}
              value={config.subheadline}
              onChange={(e) => onChange('subheadline', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
              Executive Quote (Bob Dyson)
            </label>
            <textarea
              rows={2}
              value={config.quote_text}
              onChange={(e) => onChange('quote_text', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* 3. FEATURED ESTATE PHOTOGRAPHY */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Featured Hero Imagery
            </h4>
          </div>
          <span className="text-[10px] text-white/50">Curated 4K Stills</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_BACKGROUNDS.map((bg) => {
            const isSelected = config.featured_city?.includes(bg.name.split(',')[0]);
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => onChange('featured_city', bg.name)}
                className={`relative rounded-xl overflow-hidden aspect-video border text-left cursor-pointer group transition-all ${
                  isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-1.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white truncate">{bg.name}</span>
                  <span className="text-[8px] text-[#D4AF37] truncate">{bg.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. COMPONENT VISIBILITY TOGGLES */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Module Toggles
        </h4>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 cursor-pointer">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-xs font-bold text-white block">Charlie AI Voice Concierge</span>
                <span className="text-[10px] text-white/50">Allow visitors to talk live with Charlie</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.show_charlie_voice}
              onChange={(e) => onChange('show_charlie_voice', e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 cursor-pointer">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-xs font-bold text-white block">Explore Destinations Strip</span>
                <span className="text-[10px] text-white/50">Show horizontal carousel of 0% tax &amp; luxury hubs</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.show_destination_strip}
              onChange={(e) => onChange('show_destination_strip', e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 cursor-pointer">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-xs font-bold text-white block">Curated Destination Listings</span>
                <span className="text-[10px] text-white/50">Display 4-card architectural grid below fold</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.show_featured_listings}
              onChange={(e) => onChange('show_featured_listings', e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
}