import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Plus } from 'lucide-react';
import PrDistributionTable from '@/components/admin/prCampaign/PrDistributionTable';
import PrDistributionFormModal from '@/components/admin/prCampaign/PrDistributionFormModal';

export default function PrReleaseDetail({ release, distributions, onBack, onEdit, onChanged }) {
  const [showDistForm, setShowDistForm] = useState(false);
  const [editingDist, setEditingDist] = useState(null);

  const markApproved = () => base44.entities.PrRelease.update(release.id, { status: 'Approved', approvedByBobAt: new Date().toISOString() }).then(onChanged);
  const markProduced = () => base44.entities.PrRelease.update(release.id, { status: 'In production', producedAt: new Date().toISOString() }).then(onChanged);
  const markDistributed = () => base44.entities.PrRelease.update(release.id, { status: 'Distributed' }).then(onChanged);
  const archive = () => base44.entities.PrRelease.update(release.id, { status: 'Archived' }).then(onChanged);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to list</Button>
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground">{release.title}</h2>
        <p className="text-sm text-muted-foreground">{release.campaign} · {release.weekLabel} · Status: {release.status}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={release.status !== 'Draft'} onClick={markApproved}>Mark Approved</Button>
        <Button size="sm" disabled={release.status !== 'Approved'} onClick={markProduced}>Mark Produced</Button>
        <Button size="sm" disabled={release.status !== 'In production' || distributions.length < 1} onClick={markDistributed}>Mark Distributed</Button>
        <Button size="sm" variant="destructive" disabled={release.status === 'Archived'} onClick={archive}>Archive</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <div><p className="text-muted-foreground">CTA Site</p><p className="text-foreground">{release.ctaSite || '—'}</p></div>
        <div><p className="text-muted-foreground">CTA Phone</p><p className="text-foreground">{release.ctaPhone || '—'}</p></div>
        <div><p className="text-muted-foreground">CTA Offer</p><p className="text-foreground">{release.ctaOffer || '—'}</p></div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Disclosure ({release.disclosureMode || 'mode not set'})</p>
        <p className="text-sm text-foreground">{release.disclosure || '—'}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Script</p>
        <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-md p-4">{release.scriptBody}</p>
      </div>

      {release.notes && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Notes</p>
          <p className="text-sm text-foreground">{release.notes}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Distribution History</p>
          <Button size="sm" onClick={() => { setEditingDist(null); setShowDistForm(true); }}><Plus className="h-4 w-4 mr-2" />Add Distribution</Button>
        </div>
        <PrDistributionTable
          distributions={distributions}
          onUpdateMetrics={row => { setEditingDist(row); setShowDistForm(true); }}
        />
      </div>

      {showDistForm && (
        <PrDistributionFormModal
          releaseId={release.id}
          distribution={editingDist}
          onClose={() => setShowDistForm(false)}
          onSaved={() => { setShowDistForm(false); onChanged(); }}
        />
      )}
    </div>
  );
}