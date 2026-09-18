import React, { useState } from 'react';

const subjects = {
  'Property Audit': 'Review property facts, comparable sales, material risks, and open diligence items.',
  'Agent Vetting': 'Focus the workspace on agent background, local performance, references, and fit.',
  'Move Roadmap': 'Organize the move into a clear sequence of decisions, owners, and next steps.',
  'Escrow Watch': 'Track escrow milestones, unresolved items, deadlines, and transaction questions.',
  'DNN News': 'Bring current housing and relocation intelligence into the working dossier.'
};

export default function ChiefPilotPageTwo() {
  const [activeSubject, setActiveSubject] = useState(null);

  return (
    <section className="min-h-[620px] overflow-hidden rounded-xl border border-white/10 bg-dyson-ink">
      <div className="grid min-h-[620px] md:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <p className="mb-6 text-xs font-medium tracking-wide text-dyson-taupe">Workspace</p>
          <nav className="flex flex-col items-start gap-1" aria-label="Chief Pilot subjects">
            {Object.keys(subjects).map(subject => (
              <button key={subject} type="button" onClick={() => setActiveSubject(subject)} className={`w-full border-l px-3 py-2.5 text-left text-sm transition-colors ${activeSubject === subject ? 'border-dyson-gold text-dyson-text' : 'border-transparent text-dyson-taupe hover:text-dyson-text'}`}>
                {subject}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex min-h-[420px] items-center justify-center p-8 sm:p-12">
          {activeSubject ? (
            <div className="w-full max-w-2xl border-b border-white/10 pb-8">
              <p className="mb-3 text-xs text-dyson-taupe">Focused dossier</p>
              <h2 className="text-2xl font-normal text-dyson-text">{activeSubject}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-dyson-taupe">{subjects[activeSubject]}</p>
            </div>
          ) : (
            <p className="text-sm text-dyson-taupe/70">Select a subject to focus the dossier.</p>
          )}
        </div>
      </div>
    </section>
  );
}