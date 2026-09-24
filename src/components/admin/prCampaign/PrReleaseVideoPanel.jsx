import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

// Lets admin paste a HeyGen video_id (returned when a script was dispatched
// via heygenBobDeskTest), pull its render status, and save the finished
// video permanently onto this PrRelease record so it's kept for review here.
export default function PrReleaseVideoPanel({ release, onChanged }) {
  const [videoId, setVideoId] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkAndSave = async () => {
    if (!videoId.trim()) return;
    setChecking(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('heygenBobDeskTest', { action: 'status', video_id: videoId.trim() });
      const { status, videoUrl, error: renderError } = res.data;
      if (status === 'completed' && videoUrl) {
        await base44.entities.PrRelease.update(release.id, { mediaAssetUrl: videoUrl });
        setVideoId('');
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
        <Button size="sm" onClick={checkAndSave} disabled={checking || !videoId.trim()}>
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check & Save'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}