import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight } from 'lucide-react';

export default function PrLibrarySummaryCard() {
  const [release, setRelease] = useState(null);
  const [lastDistributionDate, setLastDistributionDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const releases = await base44.entities.PrRelease.list('-created_date', 1);
    const latest = releases[0] || null;
    setRelease(latest);
    if (latest) {
      const dist = await base44.entities.PrDistribution.filter({ pr_release_id: latest.id }, '-postedAt', 1);
      setLastDistributionDate(dist[0]?.postedAt || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#D4AF37]">PR / Media Activity</h2>
        <Link to="/admin/pr-campaign-library" className="text-xs flex items-center gap-1 text-white/60 hover:text-[#D4AF37]">
          Open PR & Campaign Library <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : release ? (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div><p className="text-white/50 text-xs">Last release</p><p className="font-medium">{release.title}</p></div>
          <div><p className="text-white/50 text-xs">Status</p><p className="font-medium">{release.status}</p></div>
          <div><p className="text-white/50 text-xs">Last distribution</p><p className="font-medium">{lastDistributionDate ? new Date(lastDistributionDate).toLocaleDateString() : '—'}</p></div>
        </div>
      ) : (
        <p className="text-sm text-white/50">PR library — connect when ready.</p>
      )}
    </div>
  );
}