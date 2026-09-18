import React from 'react';

export default function ChiefPilotActivePropertyHeader({ property, agentName, onOpenListing, dark = false }) {
  if (!property) {
    return <div className={`sticky top-0 z-20 mb-6 flex items-center justify-between gap-4 border-b py-3 backdrop-blur ${dark ? 'border-white/10 bg-dyson-black' : 'border-black/10 bg-dyson-cream'}`}><span className={`text-sm ${dark ? 'text-white/65' : 'text-dyson-text-dark/70'}`}>Search a property first</span><button type="button" onClick={onOpenListing} className={`text-xs underline underline-offset-4 ${dark ? 'text-dyson-gold-light' : 'text-dyson-gold-deep'}`}>Open Property Search</button></div>;
  }
  const listing = property.listing || {};
  const rawPhoto = property.photoUrl || listing.photoUrl || property.photos?.[0] || property.images?.[0];
  const photo = typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url;
  const value = property.listPrice !== 'Price unlisted' ? property.listPrice : property.valuation?.estimatedValue ? `$${Number(property.valuation.estimatedValue).toLocaleString()}` : null;
  return (
    <button type="button" onClick={onOpenListing} className={`sticky top-0 z-20 mb-6 flex w-full items-center gap-3 border-b py-3 text-left backdrop-blur ${dark ? 'border-white/10 bg-dyson-black' : 'border-black/10 bg-dyson-cream'}`}>
      {photo ? <img src={photo} alt="" className="h-11 w-14 rounded-md object-cover" /> : <div className={`h-11 w-14 rounded-md ${dark ? 'bg-white/10' : 'bg-black/10'}`} />}
      <div className="min-w-0 flex-1"><p className={`truncate text-sm ${dark ? 'text-white' : 'text-dyson-text-dark'}`}>{property.fullAddress}</p><p className={`mt-1 truncate text-[11px] ${dark ? 'text-white/55' : 'text-dyson-text-dark/60'}`}>{listing.status || 'Status not available'}{value ? ` · ${value}` : ''}{agentName ? ` · Agent: ${agentName}` : ''}</p></div>
      <span className={`shrink-0 text-[11px] ${dark ? 'text-dyson-gold-light' : 'text-dyson-gold-deep'}`}>Property search →</span>
    </button>
  );
}