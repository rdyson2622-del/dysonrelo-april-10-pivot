import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

// One-click backfill: burns the bannerHook title overlay (via Creatomate) into
// every already-finished CoPilot video that doesn't have it yet. New videos get
// this automatically from PrReleaseVideoPanel — this card is just for the backlog.
export default function PrReleaseTitleOverlayBacklog({ onDone }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const releases = await base44.entities.PrRelease.list('-created_date', 200);
    setPending(releases.filter(r => r.mediaAssetUrl && r.bannerHook && !r.titleOverlayAppliedAt));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const runOverlay = async (release) => {
    const startRes = await base44.functions.invoke('prReleaseTitleOverlay', {
      action: 'start', releaseId: release.id, videoUrl: release.mediaAssetUrl, titleText: release.bannerHook,
    });
    const renderId = startRes.data.renderId;
    if (!renderId) throw new Error('No render id returned');
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise(r => setTimeout(r, 3000));
      const checkRes = await base44.functions.invoke('prReleaseTitleOverlay', { action: 'check', renderId, releaseId: release.id });
      if (checkRes.data.status === 'succeeded') return;
      if (checkRes.data.status === 'failed') throw new Error('Render failed');
    }
    throw new Error('Timed out');
  };

  const processAll = async () => {
    setProcessing(true);
    for (let i = 0; i < pending.length; i++) {
      const release = pending[i];
      setProgress(`Applying title to "${release.title}" (${i + 1} of ${pending.length})…`);
      try {
        await runOverlay(release);
      } catch (e) {
        setProgress(`Failed on "${release.title}": ${e.message}`);
      }
    }
    setProcessing(false);
    setProgress('Done.');
    await load();
    if (onDone) onDone();
  };

  if (loading) return null;
  if (pending.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{pending.length} finished CoPilot video{pending.length > 1 ? 's' : ''} still need{pending.length > 1 ? '' : 's'} the title overlay</p>
        <p className="text-xs text-muted-foreground">{processing ? progress : 'Burns each bannerHook in as a 3-second lower-third via Creatomate.'}</p>
      </div>
      <Button size="sm" onClick={processAll} disabled={processing}>
        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
        {processing ? 'Processing…' : 'Add Titles to All'}
      </Button>
    </div>
  );
}