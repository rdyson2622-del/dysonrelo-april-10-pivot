import React, { useState } from 'react';

export default function ChiefPilotSubjectList({ subjects, activeId, onSelect, onRename, onMove }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const startRename = subject => {
    setEditingId(subject.id);
    setDraft(subject.title);
  };

  const saveRename = id => {
    const title = draft.trim();
    if (title) onRename(id, title);
    setEditingId(null);
  };

  return (
    <nav className="space-y-1" aria-label="Chief Pilot subjects">
      {subjects.map((subject, index) => editingId === subject.id ? (
        <form key={subject.id} onSubmit={event => { event.preventDefault(); saveRename(subject.id); }} className="border-l border-dyson-gold px-3 py-2">
          <input autoFocus value={draft} onChange={event => setDraft(event.target.value)} className="w-full border-b border-white/20 bg-transparent py-1 text-sm text-dyson-text outline-none focus:border-dyson-gold" />
          <div className="mt-2 flex gap-3 text-[11px]">
            <button type="submit" className="text-dyson-text">Save</button>
            <button type="button" onClick={() => setEditingId(null)} className="text-dyson-taupe">Cancel</button>
          </div>
        </form>
      ) : (
        <div key={subject.id} className={`border-l px-3 py-2 ${activeId === subject.id ? 'border-dyson-gold' : 'border-transparent'}`}>
          <button type="button" onClick={() => onSelect(subject.id)} className={`w-full text-left text-sm ${activeId === subject.id ? 'text-dyson-text' : 'text-dyson-taupe hover:text-dyson-text'}`}>{subject.title}</button>
          <div className="mt-1.5 flex gap-3 text-[10px] text-dyson-taupe/70">
            <button type="button" onClick={() => startRename(subject)} className="hover:text-dyson-text">Rename</button>
            <button type="button" disabled={index === 0} onClick={() => onMove(subject.id, -1)} className="disabled:opacity-25 hover:text-dyson-text">Up</button>
            <button type="button" disabled={index === subjects.length - 1} onClick={() => onMove(subject.id, 1)} className="disabled:opacity-25 hover:text-dyson-text">Down</button>
          </div>
        </div>
      ))}
    </nav>
  );
}