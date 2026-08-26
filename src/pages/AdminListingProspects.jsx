import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Copy, Check, MapPin, Phone, Mail } from 'lucide-react';
import BulkImportPanel from '@/components/admin/listingProspects/BulkImportPanel';
import MlsUrlLookup from '@/components/admin/listingProspects/MlsUrlLookup';

const GOLD = '#D4AF37';

/**
 * AdminListingProspects — daily MLS calling list. Paste a single MLS
 * listing URL and everything else (listing details + agent name/phone/
 * email) is pulled automatically, generating a personalized preview link.
 */
export default function AdminListingProspects() {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState(null);

  const { data: prospects = [] } = useQuery({
    queryKey: ['listingProspects'],
    queryFn: () => base44.entities.ListingProspect.list('-created_date', 100),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['listingProspects'] });

  const linkFor = (token) => `${window.location.origin}/agent-preview/${token}`;

  const copyLink = (p) => {
    navigator.clipboard.writeText(linkFor(p.token));
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1 flex items-center gap-2" style={{ color: GOLD }}>
        <MapPin className="w-3.5 h-3.5" /> MLS Listing Agent Outreach
      </p>
      <h1 className="text-2xl font-serif text-white mb-4">MLS Listing Agent Outreach</h1>

      <MlsUrlLookup onImported={refresh} />

      <BulkImportPanel onImported={refresh} />

      <div className="space-y-2">
        {prospects.map(p => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="min-w-0">
              <p className="text-sm text-white font-semibold truncate">{p.agent_name} <span className="text-white/40">· {p.brokerage}</span></p>
              <p className="text-xs text-white truncate">{p.listing_address}{p.city ? `, ${p.city}` : ''} {p.listing_value ? `· $${Number(p.listing_value).toLocaleString()}` : ''}</p>
              <div className="flex items-center gap-3 mt-1">
                {p.agent_phone && <a href={`tel:${p.agent_phone}`} className="flex items-center gap-1 text-xs" style={{ color: GOLD }}><Phone className="w-3 h-3" /> {p.agent_phone}</a>}
                {p.agent_email && <a href={`mailto:${p.agent_email}`} className="flex items-center gap-1 text-xs" style={{ color: GOLD }}><Mail className="w-3 h-3" /> {p.agent_email}</a>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full" style={{ color: GOLD, border: `1px solid ${GOLD}40` }}>{p.status}</span>
              <button onClick={() => copyLink(p)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}40`, color: GOLD }}>
                {copiedId === p.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Link</>}
              </button>
            </div>
          </div>
        ))}
        {prospects.length === 0 && <p className="text-sm text-white">No prospects added yet.</p>}
      </div>
    </div>
  );
}