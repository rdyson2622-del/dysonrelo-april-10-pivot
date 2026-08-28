import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * dnnRenderTimeoutCheck — watchdog for stuck n8n Higgsfield renders.
 *
 * The n8n pipeline calls back dnnRenderDispatched / n8nBroadcastCallback
 * when done, but if n8n stalls or never responds, a broadcast can sit in
 * "processing" or "rendering" forever with no alert — a silent failure.
 *
 * This scans broadcasts stuck in those statuses for more than
 * TIMEOUT_MINUTES since their last update and force-marks them "failed"
 * with a clear errorMessage. That update triggers the existing
 * "Broadcast Render Failure Alert" entity automation, which SMS's the admin.
 *
 * Run on a schedule (see automation). Admin-only.
 */

const TIMEOUT_MINUTES = 20;
const STUCK_STATUSES = ['processing', 'rendering', 'compositing'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;
    const cutoff = Date.now() - TIMEOUT_MINUTES * 60 * 1000;
    const heygenKey = Deno.env.get('HEYGEN_API_KEY');

    // For the direct-HeyGen per-clip pipeline (show.clips present), HeyGen
    // may have actually finished rendering even though our own poller hasn't
    // caught up yet — this watchdog must NOT blindly kill those. Check real
    // HeyGen status first and rescue completed clips instead of failing them.
    const checkHeygenClip = async (heygenId) => {
      if (!heygenKey || !heygenId) return null;
      try {
        const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${heygenId}`, {
          headers: { 'X-Api-Key': heygenKey },
        });
        const data = await res.json();
        return data?.data || null;
      } catch (_) {
        return null;
      }
    };

    const flagged = [];
    for (const status of STUCK_STATUSES) {
      const stuck = await Broadcasts.filter({ status });
      for (const b of stuck) {
        const lastUpdate = new Date(b.updated_date || b.created_date).getTime();
        if (lastUpdate >= cutoff) continue;

        if (Array.isArray(b.clips) && b.clips.length > 0) {
          // Direct HeyGen per-clip pipeline — verify against HeyGen before failing.
          const newClips = [...b.clips];
          let anyStillRendering = false;
          for (let i = 0; i < newClips.length; i++) {
            const clip = newClips[i];
            if (clip.videoUrl) continue;
            const hgStatus = await checkHeygenClip(clip.heygenId);
            if (hgStatus?.status === 'completed' && hgStatus.video_url) {
              const vidRes = await fetch(hgStatus.video_url);
              const buf = await vidRes.arrayBuffer();
              const file = new File([buf], `dnn_broadcast_${b.broadcast_date}_clip${i}.mp4`, { type: 'video/mp4' });
              const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              newClips[i] = { ...clip, videoUrl: up.file_url, status: 'completed' };
            } else if (hgStatus?.status === 'failed') {
              newClips[i] = { ...clip, status: 'failed' };
            } else {
              anyStillRendering = true;
            }
          }
          const allDone = newClips.every(c => c.videoUrl);
          if (allDone) {
            await Broadcasts.update(b.id, { clips: newClips, status: 'completed', errorMessage: '' });
            continue; // rescued — not flagged as failed
          }
          if (anyStillRendering) continue; // genuinely still in flight on HeyGen, leave it alone
          await Broadcasts.update(b.id, {
            clips: newClips,
            status: 'failed',
            errorMessage: `Render timed out after ${TIMEOUT_MINUTES} minutes — HeyGen reported a clip failure.`,
          });
          flagged.push({ id: b.id, show_name: b.show_name, was_status: status });
          continue;
        }

        await Broadcasts.update(b.id, {
          status: 'failed',
          errorMessage: `Render timed out — no callback from the render pipeline after ${TIMEOUT_MINUTES} minutes (was stuck in "${status}").`,
        });
        flagged.push({ id: b.id, show_name: b.show_name, was_status: status });
      }
    }

    return Response.json({ success: true, flagged_count: flagged.length, flagged });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}