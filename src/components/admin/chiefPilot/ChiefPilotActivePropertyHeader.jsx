import React from 'react';

export default function ChiefPilotActivePropertyHeader({ property, onOpenListing }) {
  if (!property) {
    return <div className="sticky top-0 z-20 mb-6 flex items-center justify-between gap-4 border-b border-white/10 bg-dyson-ink/95 py-3 backdrop-blur"><span className="text-sm text-dyson-taupe">Search a property first</span><button type="button" onClick={onOpenListing} className="text-xs text-dyson-gold underline underline-offset-4">Open Property Search</button></div>;
  }
  const listing = property.listing || {};
  const rawPhoto = property.photoUrl || listing.photoUrl || property.photos?.[0] || property.images?.[0];
  const photo = typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url;
  const value = property.listPrice !== 'Price unlisted' ? property.listPrice : property.valuation?.estimatedValue ? `$${Number(property.valuation.estimatedValue).toLocaleString()}` : null;
  return (
    <button type="button" onClick={onOpenListing} className="sticky top-0 z-20 mb-6 flex w-full items-center gap-3 border-b border-white/10 bg-dyson-ink/95 py-3 text-left backdrop-blur">
      {photo ? <img src={photo} alt="" className="h-11 w-14 rounded-md object-cover" /> : <div className="h-11 w-14 rounded-md bg-white/5" />}
      <div className="min-w-0 flex-1"><p className="truncate text-sm text-dyson-text">{property.fullAddress}</p><p className="mt-1 truncate text-[11px] text-dyson-taupe">{listing.status || 'Status not available'}{value ? ` · ${value}` : ''}</p></div>
      <span className="shrink-0 text-[11px] text-dyson-gold">Listing card →</span>
    </button>
  );
}