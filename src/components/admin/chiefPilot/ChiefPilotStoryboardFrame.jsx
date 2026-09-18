import React from 'react';
import ChiefPilotRoadMapStrip from './ChiefPilotRoadMapStrip';

export default function ChiefPilotStoryboardFrame({ type, property, agentName }) {
  const address = property?.shortAddress || property?.fullAddress || '6228 Calle Pavana';
  const rawPhoto = property?.photoUrl || property?.listing?.photoUrl || property?.photos?.[0] || property?.images?.[0];
  const photo = typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url;
  const market = [property?.address?.city || property?.city?.split(',')[0], property?.address?.state].filter(Boolean).join(', ') || 'San Diego';
  if (type === 'search') return <div className="space-y-2">{photo ? <img src={photo} alt="" className="h-12 w-full rounded object-cover" /> : <div className="flex h-12 items-center justify-center rounded border border-dyson-gold/30 text-[8px] text-dyson-gold">Open full listing</div>}<p className="truncate text-[10px] text-dyson-text">{address}</p><div className="grid grid-cols-3 gap-1">{['Beds', 'Baths', 'Sq ft'].map(item => <span key={item} className="rounded bg-white/5 py-1 text-center text-[8px] text-dyson-taupe">{item}</span>)}</div></div>;
  if (type === 'audit') return <div className="divide-y divide-white/10 border-y border-white/10">{['Pricing context', 'Issues spotted', 'Questions'].map(item => <div key={item} className="py-2"><p className="text-[9px] text-dyson-text">{item}</p><div className="mt-1 h-1.5 w-4/5 rounded bg-white/10" /></div>)}</div>;
  if (type === 'vetting') return <div className="rounded border border-white/10 p-2"><p className="text-[9px] text-dyson-text">Agent fit · {market}</p>{['Local buyer-side', 'Diligence fit', 'Communication'].map(item => <div key={item} className="mt-2 border-l border-dyson-gold/50 pl-2 text-[8px] text-dyson-taupe">{item}</div>)}</div>;
  if (type === 'roadmap') return <div><p className="truncate text-[9px] text-dyson-text">{address}</p><ChiefPilotRoadMapStrip compact /></div>;
  if (type === 'escrow') return <div className="divide-y divide-white/10">{['Escrow opened', 'Disclosures', 'Inspections'].map((item, index) => <div key={item} className="flex justify-between py-2 text-[8px]"><span className="text-dyson-text">{index + 1}. {item}</span><span className="text-dyson-taupe">EXAMPLE</span></div>)}</div>;
  return <div><div className="grid grid-cols-3 gap-1">{['Client', agentName || 'Agent', 'Dyson'].map(item => <span key={item} className="truncate rounded border border-white/10 px-1 py-2 text-center text-[8px] text-dyson-text">{item}</span>)}</div><div className="mt-3 space-y-1"><div className="h-1.5 w-full rounded bg-white/10" /><div className="h-1.5 w-3/4 rounded bg-dyson-gold/30" /></div></div>;
}