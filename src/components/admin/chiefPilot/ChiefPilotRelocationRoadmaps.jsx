import React from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';
import ChiefPilotRoadMapStrip from './ChiefPilotRoadMapStrip';

export default function ChiefPilotRelocationRoadmaps({ title, activeProperty, escrowStub, isExample, onOpenListing }) {
  if (!activeProperty) return <ChiefPilotActivePropertyHeader property={null} onOpenListing={onOpenListing} />;
  const current = escrowStub ? 'Escrow' : 'Property Search';
  const destination = [activeProperty?.address?.city || activeProperty?.city?.split(',')[0], activeProperty?.address?.state].filter(Boolean).join(', ');
  return (
    <div>
      <ChiefPilotActivePropertyHeader property={activeProperty} onOpenListing={onOpenListing} />
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-normal text-dyson-text">{title}</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      {activeProperty && <article className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-dyson-text">{activeProperty.fullAddress}</p><p className="mt-1 text-xs text-dyson-taupe">Destination thread: {destination || 'Pending'}</p><ChiefPilotRoadMapStrip current={current} /><p className="mt-5 text-xs leading-5 text-dyson-taupe">The highlighted phase is the current working point for this property.</p></article>}
    </div>
  );
}