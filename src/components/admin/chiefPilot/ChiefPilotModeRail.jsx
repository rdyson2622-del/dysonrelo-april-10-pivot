import React from 'react';

const MODES = [['chats', 'Chats'], ['library', 'Library'], ['news', 'News']];

export default function ChiefPilotModeRail({ activeMode, onSelect }) {
  return (
    <nav className="flex flex-col gap-1 border-y border-white/10 py-3" aria-label="Chief Pilot modes">
      {MODES.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onSelect(id)} aria-pressed={activeMode === id} className={`w-full rounded-md px-3 py-2 text-left text-xs ${activeMode === id ? 'bg-white/10 text-dyson-text' : 'text-dyson-taupe hover:bg-white/5 hover:text-dyson-text'}`}>
          {label}
        </button>
      ))}
    </nav>
  );
}