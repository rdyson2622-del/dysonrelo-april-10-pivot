import React from 'react';
import { Search } from 'lucide-react';

const GOLD = '#D4AF37';

export default function AdminSearchPill({ value, onChange }) {
  return (
    <div
      className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-full max-w-md"
      style={{ background: '#000', border: `1px solid ${GOLD}66` }}
    >
      <Search className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search admin tools…"
        className="w-full bg-transparent text-sm outline-none text-white placeholder:text-white/40"
      />
    </div>
  );
}