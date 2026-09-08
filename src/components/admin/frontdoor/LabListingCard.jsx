import React from 'react';
import { Sparkles } from 'lucide-react';

export default function LabListingCard({ listing, onAskCharlie }) {
  return (
    <div className="bg-[#141414] border border-[#252525] hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-200 group flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <img
            src={listing.image}
            alt={listing.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
            {listing.tag}
          </span>
        </div>

        <div className="p-3.5">
          <div className="text-base font-bold text-white mb-0.5">
            {listing.price}
          </div>
          <div className="text-xs font-semibold text-white/90 truncate">
            {listing.address}
          </div>
          <div className="text-[11px] text-white/60 mb-2.5">
            {listing.city}, {listing.state}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/70 border-t border-[#222] pt-2">
            <span><strong>{listing.beds}</strong> bds</span>
            <span>•</span>
            <span><strong>{listing.baths}</strong> ba</span>
            <span>•</span>
            <span><strong>{listing.sqft}</strong> sqft</span>
          </div>
        </div>
      </div>

      <div className="px-3.5 pb-3 pt-1">
        <button
          onClick={() => onAskCharlie(listing)}
          className="w-full py-1.5 rounded-lg bg-[#222] hover:bg-[#D4AF37] hover:text-black text-white/90 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-[#D4AF37] group-hover:text-black" />
          Ask Charlie About Property
        </button>
      </div>
    </div>
  );
}