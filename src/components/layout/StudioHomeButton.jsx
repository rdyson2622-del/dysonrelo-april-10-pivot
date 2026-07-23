import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function StudioHomeButton() {
  return (
    <Link
      to="/?choose=1"
      className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-dyson-gold shadow-lg border border-dyson-gold transition-transform hover:scale-[1.03]"
    >
      <Home className="h-3.5 w-3.5" />
      Studio Home
    </Link>
  );
}