import React from 'react';

const present = value => value !== '' && value !== null && value !== undefined;
const money = value => present(value) && !Number.isNaN(Number(value)) ? `$${Number(value).toLocaleString()}` : null;

export default function ChiefPilotListingCard({ property, isExample, onHideExample, onClear }) {
  if (!property) return <section className="rounded-xl border border-white/10 p-6 text-sm text-dyson-taupe">No property selected.</section>;
  const listing = property.listing || {};
  const building = property.building || {};
  const valuation = property.valuation || {};
  const rawPhotos = [property.photoUrl, listing.photoUrl, ...(property.photos || []), ...(property.images || [])];
  const photos = [...new Set(rawPhotos.map(item => typeof item === 'string' ? item : item?.url).filter(Boolean))].slice(0, 3);
  const facts = [['Beds', building.beds], ['Baths', building.baths], ['Sq ft', present(building.livingArea) ? Number(building.livingArea).toLocaleString() : null], ['Year', building.yearBuilt], ['Listing #', listing.listingNumber]];
  const price = property.listPrice !== 'Price unlisted' ? property.listPrice : null;
  return (
    <article className="overflow-hidden rounded-xl border border-white/15 bg-dyson-charcoal text-left">
      {photos.length ? <div className={`grid gap-1 ${photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>{photos.map((url, index) => <img key={url} src={url} alt={`${property.fullAddress} photo ${index + 1}`} className={`w-full object-cover ${index === 0 && photos.length > 1 ? 'row-span-2 h-64' : index === 0 ? 'h-64' : 'h-[126px]'}`} />)}</div> : <div className="flex h-24 items-center justify-center bg-black/20 text-xs text-dyson-taupe">Photos not available</div>}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div>{isExample && <p className="mb-2 text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</p>}<h2 className="text-xl text-dyson-text">{property.fullAddress}</h2><p className="mt-2 text-xs text-dyson-taupe">{listing.status || 'Status not available'}</p></div><div className="text-right"><p className="text-lg text-dyson-text">{price || money(valuation.estimatedValue) || 'Value not available'}</p><p className="mt-1 text-[10px] text-dyson-taupe">{price ? 'List / record value' : 'Estimated value'}</p></div></div>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-5">{facts.map(([label, value]) => <div key={label}><dt className="text-[10px] text-dyson-taupe">{label}</dt><dd className="mt-1 text-sm text-dyson-text">{present(value) ? value : 'Not available'}</dd></div>)}</dl>
        <div className="mt-5 flex gap-4 text-xs">{isExample ? <button type="button" onClick={onHideExample} className="text-dyson-taupe underline underline-offset-4">Hide example</button> : <button type="button" onClick={onClear} className="text-dyson-taupe underline underline-offset-4">Clear property</button>}</div>
      </div>
    </article>
  );
}