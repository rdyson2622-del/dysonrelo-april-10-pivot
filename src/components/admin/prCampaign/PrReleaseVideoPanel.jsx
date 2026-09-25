import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';

// Lets admin paste a HeyGen video_id (returned when a script was dispatched
// via heygenBobDeskTest), pull its render status, and save the finished
// video permanently onto this PrRelease record so it's kept for review here.
// Auto-fills from release.heygenVideoId and auto-checks once on load so a
// dispatched render shows up here without the admin having to know/paste the id.
//
// Once a finished video is saved, this panel also auto-dispatches the
// bannerHook lower-third title overlay via Creatomate (prReleaseTitleOverlay)
// so every future video gets its title burned in automatically — no manual step.
export default function PrReleaseVideoPanel({ release, onChanged }) {
  const [videoId, setVideoId] = useState(release.heygenVideoId || '');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [overlayStatus, setOverlayStatus] = useState(null); // null | 'running' | 'failed'
  const [overlayError, setOverlayError] = useState(null);
  const overlayAttempted = useRef(false);

  useEffect(() => {
    if (release.heygenVideoId && !release.mediaAssetUrl) {
      checkAndSave(release.heygenVideoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release.id]);

  useEffect(() => {
    if (release.mediaAssetUrl && release.bannerHook && !release.titleOverlayAppliedAt && !overlayAttempted.current) {
      overlayAttempted.current = true;
      applyTitleOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release.id, release.mediaAssetUrl, release.titleOverlayAppliedAt]);

  const checkAndSave = async (idOverride) => {
    const id = (idOverride || videoId).trim();
    if (!id) return;
    setChecking(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('heygenBobDeskTest', { action: 'status', video_id: id });
      const { status, videoUrl, error: renderError } = res.data;
      if (status === 'completed' && videoUrl) {
        await base44.entities.PrRelease.update(release.id, { mediaAssetUrl: videoUrl, heygenVideoId: id });
        onChanged();
      } else if (status === 'failed') {
        setError(renderError || 'Render failed');
      } else {
        setError(`Still rendering (status: ${status}) — check again in a bit.`);
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
    setChecking(false);
  };

  const applyTitleOverlay = async () => {
    setOverlayStatus('running');
    setOverlayError(null);
    try {
      const startRes = await base44.functions.invoke('prReleaseTitleOverlay', {
        action: 'start',
        releaseId: release.id,
        videoUrl: release.mediaAssetUrl,
        titleText: release.bannerHook,
      });
      const renderId = startRes.data.renderId;
      if (!renderId) throw new Error('Creatomate did not return a render id');

      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise(r => setTimeout(r, 3000));
        const checkRes = await base44.functions.invoke('prReleaseTitleOverlay', { action: 'check', renderId, releaseId: release.id });
        if (checkRes.data.status === 'succeeded') {
          setOverlayStatus(null);
          onChanged();
          return;
        }
        if (checkRes.data.status === 'failed') throw new Error('Creatomate render failed');
      }
      throw new Error('Title overlay render timed out — try again shortly.');
    } catch (e) {
      setOverlayStatus('failed');
      setOverlayError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Produced Video</p>
      {release.mediaAssetUrl ? (
        <video src={release.mediaAssetUrl} controls className="w-full max-w-md rounded-md border" />
      ) : (
        <p className="text-sm text-muted-foreground">No video saved yet for this release.</p>
      )}
      <div className="flex gap-2 items-center max-w-md">
        <Input
          placeholder="Paste HeyGen video_id to check & save"
          value={videoId}
          onChange={e => setVideoId(e.target.value)}
        />
        <Button size="sm" onClick={() => checkAndSave()} disabled={checking || !videoId.trim()}>
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check & Save'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      {release.mediaAssetUrl && (
        <div className="flex items-center gap-2 pt-1">
          {release.titleOverlayAppliedAt ? (
            <p className="text-xs text-emerald-600">✓ Title overlay burned in ("{release.bannerHook}")</p>
          ) : overlayStatus === 'running' ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Adding title overlay via Creatomate…</p>
          ) : (
            <Button size="sm" variant="outline" disabled={!release.bannerHook} onClick={applyTitleOverlay}>
              <Sparkles className="h-3.5 w-3.5 mr-2" /> Add Title Overlay
            </Button>
          )}
        </div>
      )}
      {overlayError && <p className="text-xs text-destructive">{overlayError}</p>}
    </div>
  );
}