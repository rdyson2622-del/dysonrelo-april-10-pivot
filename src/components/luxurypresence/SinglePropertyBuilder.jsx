import React, { useState } from 'react';
import { 
  Building, Sparkles, Globe, Eye, Copy, Check, ExternalLink, 
  Share2, Camera, ShieldCheck, MapPin, DollarSign, Calendar
} from 'lucide-react';

const GOLD = '#D4AF37';

const SAMPLE_PROPERTIES = [
  {
    id: 'sp-1',
    address: '2840 Silverleaf Sunset Ridge',
    city: 'Scottsdale',
    state: 'AZ',
    price: '$8,950,000',
    beds: 5,
    baths: 6.5,
    sqft: '7,890',
    headline: 'Modern Desert Masterpiece with Panoramic McDowell Mountain Views',
    slug: '2840-silverleaf',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=90',
    highlights: ['0% Income Tax Destination', 'Infinity Edge Sunset Pool', 'Sub-Zero & Wolf Chef Kitchen', 'Private Guard-Gated Silverleaf'],
  },
  {
    id: 'sp-2',
    address: '112 Port Royal Coastal Vista',
    city: 'Naples',
    state: 'FL',
    price: '$12,800,000',
    beds: 5,
    baths: 7,
    sqft: '9,150',
    headline: 'Ultra-Luxury Deepwater Yachting Estate with Direct Gulf Access',
    slug: '112-port-royal',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=90',
    highlights: ['Direct Gulf Access Deepwater Dock', 'Florida Zero State Income Tax', 'Custom Wine Room & Wellness Spa', 'Private Port Royal Beach Club'],
  },
  {
    id: 'sp-3',
    address: '420 Westlake Glass Pavilion',
    city: 'Austin',
    state: 'TX',
    price: '$7,250,000',
    beds: 5,
    baths: 6,
    sqft: '6,920',
    headline: 'Hill Country Modern Architectural Haven with Lake Austin Skyline Views',
    slug: '420-westlake',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90',
    highlights: ['Eanes ISD Top Ranked Schools', 'Texas Zero State Income Tax', 'Seamless Indoor-Outdoor Glass Walls', 'Minutes to Tech Executive Corridor'],
  },
];

export default function SinglePropertyBuilder() {
  const [selectedProperty, setSelectedProperty] = useState(SAMPLE_PROPERTIES[0]);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  const liveUrl = `https://dysonrelo.com/estates/${selectedProperty.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(liveUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. OVERVIEW & GENERATOR HEADER */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Luxury Presence Single-Property Site Engine
            </h4>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black bg-gradient-to-r from-[#e8c84a] to-[#D4AF37]">
            1-Click Launch
          </span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          Luxury Presence pioneered the dedicated single-property website. Transform any curated listing or off-market pocket listing into a dedicated architectural showcase with lead capture and fiduciary agent oversight.
        </p>
      </div>

      {/* 2. SELECT PROPERTY TO GENERATE */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Select Curated Listing
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_PROPERTIES.map((prop) => {
            const isSelected = selectedProperty.id === prop.id;
            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => setSelectedProperty(prop)}
                className={`rounded-xl overflow-hidden border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative aspect-video">
                  <img src={prop.image} alt={prop.address} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 font-mono">
                    {prop.price}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0d0d0d]">
                  <p className="text-xs font-bold text-white truncate">{prop.address}</p>
                  <p className="text-[10px] text-white/60">{prop.city}, {prop.state} • {prop.beds}b / {prop.baths}ba</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE SINGLE-PROPERTY SITE CONTROLS */}
      <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37] space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
              Active Dedicated Site
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              {selectedProperty.address}
            </h3>
            <p className="text-xs text-[#fce38a] font-mono">
              {selectedProperty.city}, {selectedProperty.state} • {selectedProperty.price}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-[#1a1a1a] hover:bg-[#222] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copiedSlug ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{copiedSlug ? 'Copied' : 'Copy URL'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Site</span>
            </button>
          </div>
        </div>

        {/* Generated Modules Included */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
            <Camera className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-xs font-bold text-white block">4K High-Res Gallery</span>
            <span className="text-[9px] text-white/50">Full-bleed lightbox view</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
            <Building className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-xs font-bold text-white block">3D Matterport Tour</span>
            <span className="text-[9px] text-white/50">Virtual walk-through</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
            <DollarSign className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-xs font-bold text-white block">Tax Benefit Sheet</span>
            <span className="text-[9px] text-white/50">0% state tax comparison</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10">
            <Calendar className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-xs font-bold text-white block">Private Showing VIP</span>
            <span className="text-[9px] text-white/50">Direct broker routing</span>
          </div>
        </div>
      </div>

      {/* MODAL: SINGLE-PROPERTY STANDALONE PREVIEW */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0a0a] border border-[#D4AF37] shadow-2xl text-white">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Single-Property Website Live Demo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Close Preview ✕
              </button>
            </div>

            {/* Simulated Hero Section */}
            <div className="relative aspect-[16/9] w-full">
              <img src={selectedProperty.image} alt={selectedProperty.address} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
                  Private Offering • DysonRelo Global Syndication
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
                  {selectedProperty.address}
                </h1>
                <p className="text-sm sm:text-lg text-white/80 font-medium">
                  {selectedProperty.city}, {selectedProperty.state} • <span className="font-mono text-[#fce38a] font-bold">{selectedProperty.price}</span>
                </p>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-y border-white/10 py-4">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">{selectedProperty.beds}</span>
                  <span className="text-xs text-white/60 block">Bedrooms</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">{selectedProperty.baths}</span>
                  <span className="text-xs text-white/60 block">Bathrooms</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">{selectedProperty.sqft}</span>
                  <span className="text-xs text-white/60 block">Square Feet</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#10b981] font-mono">0%</span>
                  <span className="text-xs text-white/60 block">State Income Tax</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-serif text-[#D4AF37] mb-2">
                  Architectural Highlights &amp; Enclave Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProperty.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-white/10 text-xs">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Showing Lead Form */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/50 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Request Confidential Showing &amp; Escrow Packet
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input placeholder="Your Name" className="bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white" />
                  <input placeholder="Your Email" className="bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white" />
                  <button className="rounded-lg font-bold text-xs text-black py-2 bg-gradient-to-r from-[#e8c84a] to-[#D4AF37] shadow">
                    Book Private Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}