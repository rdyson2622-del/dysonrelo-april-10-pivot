import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminCheifPilot() {
  const [params, setParams] = useSearchParams();
  const page = params.get('page') === '2' ? 2 : 1;
  return (
    <div className="min-h-screen bg-dyson-black text-dyson-text p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-dyson-taupe hover:text-dyson-gold"><ArrowLeft className="h-4 w-4" />Admin</Link>
          <p className="text-xs tracking-widest text-dyson-gold">DYSONHOMES.COM</p>
          <h1 className="text-2xl sm:text-3xl font-normal">CHIEF PILOT</h1>
          <p className="text-sm text-dyson-taupe">New pages workspace · Separate from the current live pages.</p>
        </header>
        <div role="tablist" aria-label="New DysonHomes pages" className="flex flex-wrap gap-3">
          {[1, 2].map(number => (
            <button key={number} id={`page-tab-${number}`} role="tab" aria-selected={page === number} aria-controls="page-workspace" onClick={() => setParams({ page: String(number) })} className={`rounded-full border px-5 py-2 text-sm ${page === number ? 'border-dyson-gold bg-dyson-gold text-dyson-text-dark' : 'border-dyson-taupe bg-dyson-charcoal text-dyson-taupe'}`}>
              Page #{number}
            </button>
          ))}
        </div>
        <section id="page-workspace" role="tabpanel" aria-labelledby={`page-tab-${page}`} className="min-h-80 rounded-2xl border border-dyson-taupe bg-dyson-charcoal p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-normal">Page #{page}</h2>
            <span className="text-xs text-dyson-taupe">Not started</span>
          </div>
          <p className="mt-8 text-sm text-dyson-taupe">A clean workspace for the new DysonHomes.com page #{page}. Design and content will be added next.</p>
        </section>
      </div>
    </div>
  );
}