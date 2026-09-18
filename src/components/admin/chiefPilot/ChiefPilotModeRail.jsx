import React from 'react';

const MODES = [['chats', 'Chats'], ['library', 'Library'], ['news', 'News']];

export default function ChiefPilotModeRail({ activeMode, onSelect }) {
  return (
    <nav className="grid grid-cols-3 gap-1 border-y border-white/10 py-3" aria-label="Chief Pilot modes">
      {MODES.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onSelect(id)} aria-pressed={activeMode === id} className={`rounded-md px-2 py-1.5 text-xs ${activeMode === id ? 'bg-white/10 text-dyson-text' : 'text-dyson-taupe hover:text-dyson-text'}`}>
          {label}
        </button>
      ))}
    </nav>
  );
}