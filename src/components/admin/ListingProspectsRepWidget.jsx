import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle2 } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * ListingProspectsRepWidget — pinned in the Admin sidebar so Bob can see,
 * at a glance, which rep (e.g. "Marcos") brought in each MLS listing agent
 * relationship without clicking into the full outreach page.
 */
export default function ListingProspectsRepWidget() {
  const { data: prospects = [] } = useQuery({
    queryKey: ['listingProspectsSidebar'],
    queryFn: () => base44.entities.ListingProspect.list('-created_date', 5),
  });

  if (prospects.length === 0) return null;

  return (
    <div className="px-3 pb-2 shrink-0">
      <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Brought In By</p>
        <div className="space-y-1.5">
          {prospects.map(p => (
            <Link
              key={p.id}
              to="/admin/listing-prospects"
              className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
            >
              <UserCircle2 className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
              <span className="font-semibold shrink-0" style={{ color: GOLD }}>{p.rep_name || '—'}</span>
              <span className="text-white/60 truncate">→ {p.agent_name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}