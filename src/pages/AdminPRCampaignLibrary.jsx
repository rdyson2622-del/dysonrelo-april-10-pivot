import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PrCampaignExplainerCard from '@/components/admin/prCampaign/PrCampaignExplainerCard';
import PrReleaseTable from '@/components/admin/prCampaign/PrReleaseTable';
import PrReleaseDetail from '@/components/admin/prCampaign/PrReleaseDetail';
import PrReleaseFormModal from '@/components/admin/prCampaign/PrReleaseFormModal';
import PrReleaseTitleOverlayBacklog from '@/components/admin/prCampaign/PrReleaseTitleOverlayBacklog';

export default function AdminPRCampaignLibrary() {
  const [releases, setReleases] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [releaseList, distributionList] = await Promise.all([
      base44.entities.PrRelease.list('-created_date'),
      base44.entities.PrDistribution.list('-created_date'),
    ]);
    setReleases(releaseList);
    setDistributions(distributionList);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = releases.find(r => r.id === selectedId) || null;
  const selectedDistributions = distributions.filter(d => d.pr_release_id === selectedId);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">PR & Campaign Library</h1>
          <p className="text-sm text-muted-foreground">Admin-only. Nothing here goes public without Bob's yes.</p>
        </div>
        {!selected && (
          <Button onClick={() => { setEditingRelease(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> New Release
          </Button>
        )}
      </div>

      <PrCampaignExplainerCard />

      {!selected && <PrReleaseTitleOverlayBacklog onDone={load} />}

      {selected ? (
        <PrReleaseDetail
          release={selected}
          distributions={selectedDistributions}
          onBack={() => setSelectedId(null)}
          onEdit={() => { setEditingRelease(selected); setShowForm(true); }}
          onChanged={load}
        />
      ) : (
        <PrReleaseTable
          releases={releases}
          distributions={distributions}
          loading={loading}
          onSelect={setSelectedId}
        />
      )}

      {showForm && (
        <PrReleaseFormModal
          release={editingRelease}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}