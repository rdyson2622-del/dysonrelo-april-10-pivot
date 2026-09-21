import React from 'react';

const MODES = [['chats', 'Chats'], ['news', 'News'], ['library', 'Library · For Preferred Clients']];

export default function ChiefPilotModeRail({ activeMode, onSelect, heading }) {
  return (
    <nav className="flex flex-col gap-1 border-y border-white/10 py-3" aria-label="Chief Pilot modes">
      {heading && <p className="mb-1 px-3 text-[11px] tracking-[0.18em] text-dyson-taupe">{heading}</p>}
      {MODES.map(([id, label]) => {
        return (
          <button key={id} type="button" onClick={() => onSelect(id)} aria-pressed={activeMode === id} className={`w-full rounded-md px-3 py-2 text-left text-xs ${activeMode === id ? 'bg-white/10 text-dyson-text' : 'text-dyson-taupe hover:bg-white/5 hover:text-dyson-text'}`}>
            {label}
          </button>
        );
      })}
    </nav>
  );
}