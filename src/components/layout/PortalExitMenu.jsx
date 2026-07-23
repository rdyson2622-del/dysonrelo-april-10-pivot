import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

const portals = [
  ['Client Concierge', '/home'],
  ['Relocation Agent Network', '/find-agent'],
  ['Referral Agent Network', '/partner-benefits'],
  ['Vendor Utility', '/search'],
  ['Corporate Relo / HR', '/corporate-relo'],
];

export default function PortalExitMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed top-4 left-4 z-50">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-dyson-gold shadow-lg border border-dyson-gold/50">
        {open ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} Portals
      </button>
      {open && (
        <div className="mt-2 w-64 overflow-hidden rounded-xl bg-black p-2 shadow-2xl border border-dyson-gold/40">
          <Link to="/?choose=1" className="block rounded-lg px-3 py-2 text-sm font-bold text-dyson-gold hover:bg-dyson-gold/10">View all five portals</Link>
          {portals.map(([label, path]) => (
            <Link key={path} to={path} className="block rounded-lg px-3 py-2 text-sm text-dyson-text hover:bg-dyson-gold/10">{label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}