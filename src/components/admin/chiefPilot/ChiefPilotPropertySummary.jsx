import React from 'react';

const present = value => value !== '' && value !== null && value !== undefined;
const money = value => present(value) && !Number.isNaN(Number(value)) ? `$${Number(value).toLocaleString()}` : null;

export default function ChiefPilotPropertySummary({ property, onClear, isExample = false }) {
  const building = property.building || {};
  const listing = property.listing || {};
  const valuation = property.valuation || {};
  const missing = isExample ? 'not available in example' : 'Not available';
  const facts = [
    ['Beds', building.beds], ['Baths', building.baths],
    ['Square feet', present(building.livingArea) ? Number(building.livingArea).toLocaleString() : null],
    ['Year built', building.yearBuilt], ['Status', listing.status],
    ['List / record value', property.listPrice === 'Price unlisted' ? null : property.listPrice], ['Valuation', money(valuation.estimatedValue)],
    ['MLS number', listing.listingNumber]
  ].map(([label, value]) => [label, present(value) ? value : missing]);
  const photo = property.photoUrl || listing.photoUrl || property.photos?.[0]?.url || property.images?.[0]?.url;
  return (
    <section className="mt-7 border-y border-white/10 py-5 text-left">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs text-dyson-taupe">Active Property</p><h3 className="mt-1 text-lg text-dyson-text">{property.fullAddress}</h3></div>
        {!isExample && <button type="button" onClick={onClear} className="text-xs text-dyson-taupe underline underline-offset-4">Clear</button>}
      </div>
      {photo && <img src={photo} alt={property.fullAddress} className="mt-5 max-h-56 w-full rounded-lg object-cover" />}
      {facts.length > 0 && <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">{facts.map(([label, value]) => <div key={label}><dt className="text-[11px] text-dyson-taupe">{label}</dt><dd className="mt-1 text-sm text-dyson-text">{value}</dd></div>)}</dl>}
      <p className="mt-5 text-xs leading-5 text-dyson-taupe">{property.comps?.length ? property.compsSummary : isExample ? 'Comparable sales: not available in example.' : 'Verified property request; comparable sales are currently unavailable.'}</p>
      <p className="mt-3 text-xs text-dyson-gold">Save to your Private Vault / Claim Preferred Client status</p>
    </section>
  );
}