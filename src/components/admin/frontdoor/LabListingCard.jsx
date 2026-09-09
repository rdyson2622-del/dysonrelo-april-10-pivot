import React from 'react';
import { Sparkles, MapPin, ExternalLink, Heart } from 'lucide-react';

const GOLD = '#D4AF37';

export default function LabListingCard({ listing, onAskCharlie }) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleOpenMls = (e) => {
    e.stopPropagation();
    const cleanLocation = `${listing.city}_${listing.state}`.replace(/\s+/g, '-');
    const url = `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group shadow-xl"
      style={{
        background: '#0a0a0a',
        border: `1.5px solid rgba(212, 175, 55, 0.4)`,
        boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
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
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span
              className="text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-md"
              style={{ background: GOLD, color: '#0a0a0a' }}
            >
              {listing.tag}
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
              isSaved ? 'bg-red-500/90 text-white shadow-lg scale-110' : 'bg-black/60 text-white/80 hover:text-white hover:scale-105'
            }`}
            title={isSaved ? "Saved to Favorites" : "Save Property"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <span
            className="absolute bottom-2.5 right-2.5 text-[9px] font-mono px-2 py-0.5 rounded bg-black/85 text-white/90 border border-white/20 backdrop-blur-sm"
          >
            Verified MLS
          </span>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: GOLD,
              }}
            >
              {listing.price}
            </div>
            <span className="text-[10px] text-white/50 uppercase font-sans tracking-wider">
              {listing.status}
            </span>
          </div>

          <div className="text-xs font-bold text-white truncate">
            {listing.address}
          </div>
          <div className="text-[11px] text-white/70 mb-3 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span>{listing.city}, {listing.state}</span>
          </div>

          <div
            className="flex items-center justify-between text-[11px] font-medium border-t pt-2.5"
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

      {/* Dual Action Footer: Ask Charlie & View Live MLS */}
      <div className="px-4 pb-3.5 pt-1 grid grid-cols-2 gap-2">
        <button
          onClick={handleOpenMls}
          className="w-full py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer bg-[#181818] hover:bg-[#222] text-white border border-white/20 active:scale-95"
        >
          <span>View MLS</span>
          <ExternalLink className="w-3 h-3 text-white/60" />
        </button>

        <button
          onClick={() => onAskCharlie(listing)}
          className="w-full py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer hover:opacity-95 active:scale-95 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
            color: '#0a0a0a',
          }}
        >
          <Sparkles className="w-3 h-3 text-black" />
          <span>Ask Charlie</span>
        </button>
      </div>
    </div>
  );
}