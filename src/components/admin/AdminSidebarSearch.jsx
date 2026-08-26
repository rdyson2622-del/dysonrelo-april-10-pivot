import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const uniqBy = (arr, key) => {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
};

const GOLD = '#D4AF37';

// Flattens every navigable child link across all sidebar nav sections into
// one searchable list: { label, path }.
export function buildSearchIndex(navSections) {
  const items = [];
  navSections.forEach(section => {
    section.children.forEach(child => {
      if (child.path && child.label) items.push({ label: child.label, path: child.path });
    });
  });
  return items;
}

export default function AdminSidebarSearch({ items }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const uniqueItems = useMemo(() => uniqBy(items, 'path'), [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return uniqueItems.filter(i => i.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, uniqueItems]);

  const goTo = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      goTo(results[0].path);
    } else if (e.key === 'Escape') {
      setQuery('');
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="px-3 pt-2 pb-2 relative shrink-0 z-30">
      <label
        htmlFor="admin-sidebar-search-input"
        className="flex items-center gap-2 px-3 py-2 rounded-full cursor-text transition-all"
        style={{
          background: 'rgba(212,175,55,0.12)',
          border: `1.5px solid ${open || query ? GOLD : 'rgba(212,175,55,0.45)'}`,
          boxShadow: open ? '0 0 0 2px rgba(212,175,55,0.2)' : 'none',
        }}
      >
        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
        <input
          id="admin-sidebar-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search admin…"
          autoComplete="off"
          className="w-full bg-transparent text-sm outline-none border-none text-white placeholder:text-white/50 relative z-10"
          style={{ pointerEvents: 'auto' }}
        />
        {query && (
          <button type="button" onClick={(e) => { e.preventDefault(); setQuery(''); setOpen(false); inputRef.current?.focus(); }}>
            <X className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        )}
      </label>

      {open && query && (
        <div className="absolute left-3 right-3 mt-1 rounded-xl overflow-hidden z-50"
          style={{ background: '#1a1a1a', border: `1px solid rgba(212,175,55,0.3)` }}>
          {results.length > 0 ? (
            results.map((r, i) => (
              <button key={`${r.path}-${i}`} type="button" onClick={() => goTo(r.path)}
                className="w-full flex items-center px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
                style={{ borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span className="truncate text-white">{r.label}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>No matches</p>
          )}
        </div>
      )}
    </div>
  );
}