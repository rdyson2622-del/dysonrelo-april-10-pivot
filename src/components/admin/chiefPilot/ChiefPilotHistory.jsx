import React from 'react';

export default function ChiefPilotHistory({ items, onOpen }) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto border-t border-white/10 pt-4">
      <p className="mb-3 text-[11px] tracking-wide text-dyson-taupe">Prior activity</p>
      {items.length ? <div className="space-y-1">{items.map(item => (
        <button key={item.id} type="button" onClick={() => onOpen(item)} className="w-full rounded-md px-2 py-2 text-left hover:bg-white/5">
          <span className="block text-[10px] text-dyson-taupe/70">{item.kind}</span>
          <span className="block truncate text-xs text-dyson-text">{item.label}</span>
        </button>
      ))}</div> : <p className="text-xs leading-5 text-dyson-taupe/60">Recent searches, chats, and saved items appear here.</p>}
    </section>
  );
}