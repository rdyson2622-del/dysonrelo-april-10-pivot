import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Radio } from 'lucide-react';
import SponsorAdCard from '@/components/admin/dnnSponsorAds/SponsorAdCard';

export default function AdminDnnSponsorAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await base44.entities.DnnSponsorAd.list('loopDay', 20);
    setAds(list);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    await base44.functions.invoke('dnnSponsorAdLibrary', { action: 'seed' });
    await load();
    setSeeding(false);
  };

  const handleCheckAll = async () => {
    await base44.functions.invoke('dnnSponsorAdLibrary', { action: 'checkAll' });
    await load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <Link to="/admin/dnn/agent-bureau" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-[#D4AF37] mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <div className="flex items-center gap-2 mb-1">
        <Radio className="w-5 h-5 text-[#D4AF37]" />
        <h1 className="text-2xl font-semibold text-[#D4AF37]">DNN Sponsor Ads — 7-Day Rotation</h1>
      </div>
      <p className="text-sm text-white/50 mb-6 max-w-2xl">
        DNN is the broadcast company. Bob Dyson and the Dyson Companies sponsor the news. Each of these 7 ads is Bob's opinion
        and suggested response on a national real estate issue — Fed policy, lending, legislation, insurance, compliance — never
        a single city's market. One ad plays per day; the 7-day set repeats weekly.
      </p>

      {ads.length === 0 && !loading && (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="mb-6 px-4 py-2 rounded-lg text-sm font-bold bg-[#D4AF37] text-black disabled:opacity-50"
        >
          {seeding ? 'Creating…' : 'Create the 7-Day Rotation'}
        </button>
      )}

      {ads.some(a => a.status === 'rendering') && (
        <button
          onClick={handleCheckAll}
          className="mb-6 ml-2 px-4 py-2 rounded-lg text-sm font-bold border border-[#D4AF37]/50 text-[#D4AF37]"
        >
          Check Rendering Status
        </button>
      )}

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <div className="space-y-4">
          {ads.map(ad => (
            <SponsorAdCard key={ad.id} ad={ad} onChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}