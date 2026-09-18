import React from 'react';

export default function ChiefPilotSubjectList({ subjects, activeId, onSelect }) {
  return (
    <nav className="space-y-1" aria-label="Chief Pilot subjects">
      {subjects.map(subject => (
        <button key={subject.id} type="button" onClick={() => onSelect(subject.id)} className={`w-full border-l px-3 py-2 text-left text-sm ${activeId === subject.id ? 'border-dyson-gold text-dyson-text' : 'border-transparent text-dyson-taupe hover:text-dyson-text'}`}>
          {subject.title}
        </button>
      ))}
    </nav>
  );
}