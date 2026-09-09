import React from 'react';
import { Palette, Sparkles, Type, Check, LayoutTemplate } from 'lucide-react';

const GOLD = '#D4AF37';

const THEME_PRESETS = [
  {
    id: 'obsidian_gold',
    name: 'Obsidian & 24K Gold',
    desc: 'The signature DysonRelo look — deep blacks, warm champagne gold borders, and crisp serif luxury.',
    primary: '#0a0a0a',
    accent: '#D4AF37',
    text: '#ffffff',
    bg: '#ede0cc',
  },
  {
    id: 'champagne_taupe',
    name: 'Warm Champagne & Taupe',
    desc: 'Soft architectural linen feel with muted sand tones, bronze accents, and editorial warmth.',
    primary: '#18140f',
    accent: '#b8920a',
    text: '#fff8ee',
    bg: '#d8cab6',
  },
  {
    id: 'beverly_minimal',
    name: 'Beverly Hills Clean Paper',
    desc: 'Contemporary high-contrast white & charcoal with ultra-sharp architectural lines and subtle gold foil.',
    primary: '#ffffff',
    accent: '#854d0e',
    text: '#0a0a0a',
    bg: '#fcfcfc',
  },
  {
    id: 'monaco_navy',
    name: 'Monaco Coast Navy & Bronze',
    desc: 'Deep marine navy paired with brushed bronze accents for coastal, waterfront, and deepwater estates.',
    primary: '#081225',
    accent: '#d4af37',
    text: '#ffffff',
    bg: '#e8edf5',
  },
];

const FONT_PAIRS = [
  {
    id: 'garamond_inter',
    name: 'Cormorant Garamond + Inter',
    heading: 'Cormorant Garamond',
    body: 'Inter',
    desc: 'Classical bespoke luxury paired with ultra-clean modern legibility.',
    sample: 'Exquisite Architectural Estates',
  },
  {
    id: 'canela_sans',
    name: 'Editorial Serif + Modern Sans',
    heading: 'Playfair Display',
    body: 'Inter',
    desc: 'High-fashion editorial aesthetic common in Architectural Digest and Robb Report.',
    sample: 'Private Coastal Enclaves',
  },
  {
    id: 'playfair_outfit',
    name: 'Contemporary Sans + Accent',
    heading: 'Inter',
    body: 'Inter',
    desc: 'Silicon Valley executive minimalism with clean geometric typography.',
    sample: 'Modern Glass Pavilion',
  },
];

const CARD_STYLES = [
  { id: 'luxury_black_gold', name: 'Luxury Black & Gold', desc: 'Dark obsidian card with 24K gold borders & hover glow.' },
  { id: 'editorial_white', name: 'Editorial Gallery', desc: 'Clean white background with deep shadows & large typography.' },
  { id: 'minimal_clean', name: 'Minimal Frameless', desc: 'Zero border distraction, edge-to-edge imagery with floating price.' },
];

export default function BuilderThemeControls({ config, onChange }) {
  return (
    <div className="space-y-6 text-left">
      {/* 1. PALETTE PRESET */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Luxury Presence Color Palette
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
            Brand Tokens
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = config.theme_preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange('theme_preset', preset.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#1e1910] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]'
                    : 'bg-[#0d0d0d] border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-5 h-5 rounded-full border border-white/20" style={{ background: preset.primary }} title="Primary" />
                  <span className="w-5 h-5 rounded-full border border-white/20" style={{ background: preset.accent }} title="Accent Gold" />
                  <span className="w-5 h-5 rounded-full border border-white/20" style={{ background: preset.bg }} title="Canvas" />
                </div>

                <p className="text-[10.5px] text-white/55 leading-snug">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TYPOGRAPHY PAIRINGS */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#D4AF37]" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Curated Typography Pairs
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {FONT_PAIRS.map((font) => {
            const isSelected = config.font_pair === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onChange('font_pair', font.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#1e1910] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]'
                    : 'bg-[#0d0d0d] border-white/10 hover:border-white/30'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{font.name}</span>
                  </div>
                  <div
                    className="text-base text-[#fce38a] font-serif mt-1 font-bold italic"
                    style={{ fontFamily: font.heading.includes('Garamond') ? 'Cormorant Garamond, serif' : 'serif' }}
                  >
                    “{font.sample}”
                  </div>
                  <p className="text-[10.5px] text-white/50 mt-1 leading-snug">{font.desc}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CARD PRESENTATION STYLES */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-[#D4AF37]" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Listing Card Aesthetic
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {CARD_STYLES.map((card) => {
            const isSelected = config.listing_card_style === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onChange('listing_card_style', card.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e1910] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]'
                    : 'bg-[#0d0d0d] border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{card.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </div>
                <p className="text-[10px] text-white/50 leading-snug">{card.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}