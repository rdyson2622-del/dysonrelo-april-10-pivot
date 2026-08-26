import React from 'react';
import { MapPin, BedDouble, Bath, Ruler } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * ListingDetailsCard — shows the agent their own listing back to them:
 * photo, address, price, and specs. Everything about the listing itself —
 * never anything about where a client might be moving.
 */
export default function ListingDetailsCard({ prospect }) {
  if (!prospect.listing_address && !prospect.photo_url) return null;
  return (
    <div className="rounded-2xl overflow-hidden mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
      {prospect.photo_url && (
        <img src={prospect.photo_url} alt={prospect.listing_address || 'Listing'} className="w-full h-56 object-cover" />
      )}
      <div className="p-5">
        {prospect.listing_address && (
          <p className="text-white font-semibold flex items-center gap-1.5 mb-1">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: GOLD }} /> {prospect.listing_address}{prospect.city ? `, ${prospect.city}` : ''}
          </p>
        )}
        {prospect.listing_value ? (
          <p className="text-lg font-serif mb-2" style={{ color: GOLD }}>${Number(prospect.listing_value).toLocaleString()}</p>
        ) : null}
        {(prospect.bedrooms || prospect.bathrooms || prospect.sqft) && (
          <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
            {prospect.bedrooms ? <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {prospect.bedrooms} bd</span> : null}
            {prospect.bathrooms ? <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prospect.bathrooms} ba</span> : null}
            {prospect.sqft ? <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {Number(prospect.sqft).toLocaleString()} sqft</span> : null}
          </div>
        )}
        {prospect.listing_description && (
          <p className="text-sm text-white/60 leading-relaxed">{prospect.listing_description}</p>
        )}
      </div>
    </div>
  );
}