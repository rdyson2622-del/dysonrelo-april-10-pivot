import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';

const GOLD = '#D4AF37';

export default function LabListingCard({ listing, onAskCharlie }) {
  return (
    <div
      className="flex flex-col justify-between rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
      style={{
        background: '#0a0a0a',
        border: `1.5px solid rgba(212, 175, 55, 0.4)`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      }}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <img
            src={listing.image}
            alt={listing.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span
              className="text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow"
              style={{ background: GOLD, color: '#0a0a0a' }}
            >
              {listing.tag}
            </span>
          </div>
          <span
            className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/85 text-white/80 border border-white/20"
          >
            DysonRelo MLS
          </span>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <div
            className="text-xl font-bold leading-tight mb-1"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: GOLD,
            }}
          >
            {listing.price}
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {listing.address}
          </div>
          <div className="text-[11px] text-white/70 mb-3 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span>{listing.city}, {listing.state}</span>
          </div>

          <div
            className="flex items-center gap-3 text-[11px] font-medium border-t pt-2.5"
            style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#ede0cc' }}
          >
            <span><strong className="text-white font-bold">{listing.beds}</strong> Beds</span>
            <span>•</span>
            <span><strong className="text-white font-bold">{listing.baths}</strong> Baths</span>
            <span>•</span>
            <span><strong className="text-white font-bold">{listing.sqft}</strong> SqFt</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-3.5 pt-1">
        <button
          onClick={() => onAskCharlie(listing)}
          className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
            color: '#0a0a0a',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Ask Charlie About Home</span>
        </button>
      </div>
    </div>
  );
}