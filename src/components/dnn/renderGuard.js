import { base44 } from '@/api/base44Client';

/**
 * Render Invalidation Pipeline — frontend guard utilities.
 *
 * getRenderStatus(show)  → 'ready' | 'stale' | 'rendering' | 'no_video'
 * ensureFreshRender(show, onStatus)  → if stale, triggers HeyGen re-render,
 *   polls until the fresh MP4 is stored, returns the updated show object.
 *
 * Distribution tools (Download MP4, Copy Video Link, social posting) call
 * ensureFreshRender before using the videoUrl, so the posted/downloaded asset
 * always reflects the latest script/audio/slide improvements.
 */

const RENDER_POLL_INTERVAL_MS = 15000;
const RENDER_MAX_POLLS = 60; // 15 minutes max

/**
 * Returns the current render status for UI display.
 */
export function getRenderStatus(show) {
  if (!show) return 'no_video';
  // Re-render in progress (HeyGen job submitted, no MP4 yet)
  if (show.heygenId && !show.videoUrl) return 'rendering';
  // Script/clips changed but no re-render started yet
  if (show.needsReRender === true) return 'stale';
  if (!show.videoUrl) return 'no_video';
  return 'ready';
}

/**
 * Status badge config for each state.
 */
export const RENDER_STATUS_CONFIG = {
  ready: {
    icon: '✨',
    label: 'Ready to Post',
    color: '#4ade80',
    bgColor: 'rgba(74,222,128,0.1)',
  },
  stale: {
    icon: '⚠️',
    label: 'Changes Made — Re-render Required',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.1)',
  },
  rendering: {
    icon: '⏳',
    label: 'HeyGen Re-rendering Fresh MP4...',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.1)',
  },
  no_video: {
    icon: '📭',
    label: 'No Video Available',
    color: '#94a3b8',
    bgColor: 'rgba(148,163,184,0.1)',
  },
};

/**
 * If the broadcast is flagged stale, triggers a fresh HeyGen render via
 * dnnStitchBroadcast (force=true), then polls until the new MP4 is stored.
 * Returns the updated show object.
 *
 * @param {object} show  — the current broadcast record
 * @param {function} [onStatus] — optional callback(statusString) for live UI updates
 * @returns {Promise<object>} — the fresh show with an up-to-date videoUrl
 */
export async function ensureFreshRender(show, onStatus) {
  if (!show?.needsReRender) return show;

  const broadcastId = show.id;
  if (onStatus) onStatus('rendering');

  // Kick off a forced re-render
  await base44.functions.invoke('dnnStitchBroadcast', {
    action: 'start',
    broadcastId,
    force: true,
  });

  // Poll until HeyGen finishes and the fresh MP4 is stored
  for (let i = 0; i < RENDER_MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, RENDER_POLL_INTERVAL_MS));
    if (onStatus) onStatus('rendering');

    // Trigger the check action (downloads & stores completed renders)
    await base44.functions.invoke('dnnStitchBroadcast', { action: 'check' });

    // Fetch the broadcast to see if it has a fresh MP4
    const broadcasts = await base44.entities.DnnBroadcast.filter({ id: broadcastId });
    const updated = broadcasts?.[0];
    if (updated?.videoUrl && updated.needsReRender === false) {
      return updated;
    }
    if (updated?.status === 'failed') {
      throw new Error(updated.errorMessage || 'HeyGen re-render failed');
    }
  }

  throw new Error('HeyGen re-render timed out after 15 minutes');
}