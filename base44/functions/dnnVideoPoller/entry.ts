import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { checkHeygenStatus } from '../../shared/heygenStatus.ts';

/**
 * dnnVideoPoller
 *
 * Runs every 5 minutes. Drives the full DNN studio broadcast pipeline:
 *
 *   1. Polls DnnNewsClip HeyGen renders → downloads completed clips.
 *   2. For articles in 'rendering': when all 3 clips are done, triggers
 *      dnnCreatomateRender to composite the studio backdrop + bullet banner,
 *      stores the Creatomate render ID, and moves the article to 'compositing'.
 *   3. For articles in 'compositing': polls Creatomate, downloads the final
 *      composited MP4, and marks the article 'complete'.
 */

const HEYGEN_API = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    const pipelineSecret = Deno.env.get('N8N_PIPELINE_SECRET');
    const results = [];
    // Poller drives both paths: single-MP4 DnnBroadcast records + legacy 3-clip articles.

    // ── 1. Poll DnnNewsClip HeyGen renders ──
    const clips = await base44.asServiceRole.entities.DnnNewsClip.list(undefined, 200);

    for (const clip of clips) {
      for (const role of ['charlie', 'bob']) {
        const status = clip[`${role}Status`];
        const videoId = clip[`${role}HeygenId`];
        if (status !== 'rendering' || !videoId) continue;

        // 5-minute timeout: abort stuck HeyGen renders
        if (Date.now() - new Date(clip.updated_date).getTime() > 5 * 60 * 1000) {
          await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
            [`${role}Status`]: 'failed',
            errorMessage: 'Render timed out after 5 minutes',
          });
          results.push({ type: 'clip', clipId: clip.id, role, status: 'timeout' });
          continue;
        }

        try {
          const { status: s, videoUrl: cdnUrl, error: heygenError } = await checkHeygenStatus(HEYGEN_API_KEY, videoId);

          if (s === 'completed' && cdnUrl) {
            let savedUrl = null;
            try {
              const vidRes = await fetch(cdnUrl);
              if (vidRes.ok) {
                const buf = await vidRes.arrayBuffer();
                const file = new File([buf], `dnn_clip_${clip.id}_${role}.mp4`, { type: 'video/mp4' });
                const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                if (up?.file_url) savedUrl = up.file_url;
              }
            } catch (uploadErr) {
              console.log(`Upload failed for clip ${videoId}: ${uploadErr.message}`);
            }
            if (!savedUrl) savedUrl = cdnUrl;

            await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
              [`${role}VideoUrl`]: savedUrl,
              [`${role}Status`]: 'completed',
            });
            results.push({ type: 'clip', clipId: clip.id, role, status: 'completed' });
          } else if (s === 'failed') {
            await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
              [`${role}Status`]: 'failed',
              errorMessage: heygenError || 'Render failed',
            });
            results.push({ type: 'clip', clipId: clip.id, role, status: 'failed' });
          }
        } catch (e) {
          results.push({ type: 'clip', clipId: clip.id, role, error: e.message });
        }

        await new Promise((r) => setTimeout(r, 300));
      }
    }

    // ── 2. DnnBroadcast 'rendering' → poll HeyGen → download stitched MP4 → 'ready' ──
    // This is the SINGLE-MP4 path (dnnDirectDispatch / dnnAutoRender). One HeyGen
    // job = one stitched MP4. Nothing else flips these records, so the poller owns it.
    const renderingBroadcasts = await base44.asServiceRole.entities.DnnBroadcast.filter(
      { status: 'rendering' },
      '-updated_date',
      50
    );

    for (const bc of renderingBroadcasts) {
      try {
        const videoId = bc.heygenId;
        if (!videoId) {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'no_heygen_id' });
          continue;
        }

        // 25-minute timeout: multi-scene stitched renders (3 scenes -> 1 MP4) take
        // longer than single clips. Only abort if genuinely stuck.
        if (Date.now() - new Date(bc.updated_date).getTime() > 25 * 60 * 1000) {
          await base44.asServiceRole.entities.DnnBroadcast.update(bc.id, {
            status: 'failed',
            errorMessage: 'HeyGen render timed out after 25 minutes',
          });
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'timeout' });
          continue;
        }

        const { status: s, videoUrl: cdnUrl, error: heygenError } = await checkHeygenStatus(HEYGEN_API_KEY, videoId);

        if (s === 'completed' && cdnUrl) {
          // Download the stitched MP4 and re-upload to permanent storage
          let savedUrl = null;
          try {
            const vidRes = await fetch(cdnUrl);
            if (vidRes.ok) {
              const buf = await vidRes.arrayBuffer();
              const safeName = String(bc.show_name || 'dnn-broadcast').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
              const file = new File([buf], `${safeName}.mp4`, { type: 'video/mp4' });
              const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              if (up?.file_url) savedUrl = up.file_url;
            }
          } catch (uploadErr) {
            console.log(`Upload failed for broadcast ${videoId}: ${uploadErr.message}`);
          }
          if (!savedUrl) savedUrl = cdnUrl;

          await base44.asServiceRole.entities.DnnBroadcast.update(bc.id, {
            videoUrl: savedUrl,
            status: 'ready',
            errorMessage: null,
          });
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'ready', video_url: savedUrl });
        } else if (s === 'failed') {
          await base44.asServiceRole.entities.DnnBroadcast.update(bc.id, {
            status: 'failed',
            errorMessage: heygenError || 'HeyGen render failed',
          });
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'failed' });
        } else {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'still_rendering', heygen_status: s });
        }

        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        results.push({ type: 'broadcast', broadcast_id: bc.id, error: e.message });
      }
    }

    // ── 2b. DnnBroadcast 'ready' → auto-bake studio background (Creatomate) → 'compositing' ──
    const readyBroadcasts = await base44.asServiceRole.entities.DnnBroadcast.filter(
      { status: 'ready' },
      '-updated_date',
      50
    );

    for (const bc of readyBroadcasts) {
      try {
        // Skip if already composited or already baking
        const comp = bc.compositedVideoUrl;
        if (comp && !String(comp).startsWith('creatomate:pending:')) continue;

        const startRes = await base44.asServiceRole.functions.invoke('dnnCompositeBroadcast', {
          action: 'start',
          broadcast_id: bc.id,
          pipeline_secret: pipelineSecret,
        });
        const startData = startRes?.data || startRes;
        if (startData?.renderId || startData?.status) {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'compositing', renderId: startData.renderId });
        } else {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'composite_start_failed', error: startData });
        }

        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        results.push({ type: 'broadcast', broadcast_id: bc.id, error: e.message });
      }
    }

    // ── 2c. DnnBroadcast 'compositing' → poll Creatomate → 'completed' ──
    const compositingBroadcasts = await base44.asServiceRole.entities.DnnBroadcast.filter(
      { status: 'compositing' },
      '-updated_date',
      50
    );

    for (const bc of compositingBroadcasts) {
      try {
        const renderId = bc.compositedRenderId;
        if (!renderId) {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'no_composite_render_id' });
          continue;
        }

        const checkRes = await base44.asServiceRole.functions.invoke('dnnCompositeBroadcast', {
          action: 'check',
          broadcast_id: bc.id,
          renderId,
          pipeline_secret: pipelineSecret,
        });
        const checkData = checkRes?.data || checkRes;

        if (checkData?.status === 'succeeded') {
          // dnnCompositeBroadcast already set compositedVideoUrl; flip to completed
          await base44.asServiceRole.entities.DnnBroadcast.update(bc.id, { status: 'completed' });
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'completed', compositedVideoUrl: checkData.compositedVideoUrl });
        } else if (checkData?.error) {
          await base44.asServiceRole.entities.DnnBroadcast.update(bc.id, {
            status: 'failed',
            errorMessage: String(checkData.error).slice(0, 500),
          });
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'failed', error: checkData.error });
        } else {
          results.push({ type: 'broadcast', broadcast_id: bc.id, status: 'still_compositing', renderStatus: checkData?.status });
        }

        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        results.push({ type: 'broadcast', broadcast_id: bc.id, error: e.message });
      }
    }

    // ── 3. Articles 'rendering' → trigger Creatomate when all 3 clips done (LEGACY 3-clip path) ──
    const renderingArticles = await base44.asServiceRole.entities.DnnArticle.filter(
      { production_status: 'rendering' },
      '-updated_date',
      50
    );

    for (const article of renderingArticles) {
      try {
        const articleClips = await base44.asServiceRole.entities.DnnNewsClip.filter(
          { article_id: article.id },
          'faqIndex',
          10
        );
        if (articleClips.length < 3) {
          results.push({ type: 'article', article_id: article.id, status: 'clips_not_created' });
          continue;
        }

        const allDone = articleClips.every((c) => {
          if (c.kind === 'qa') return c.bobStatus === 'completed' && c.bobVideoUrl;
          return c.charlieStatus === 'completed' && c.charlieVideoUrl;
        });
        if (!allDone) {
          results.push({ type: 'article', article_id: article.id, status: 'clips_not_ready' });
          continue;
        }

        // Trigger Creatomate composite
        let startData;
        try {
          const startRes = await base44.asServiceRole.functions.invoke('dnnCreatomateRender', {
            action: 'start',
            headline: article.headline,
            articleId: article.id,
            pipeline_secret: pipelineSecret,
          });
          startData = startRes?.data || startRes;
        } catch (invokeErr) {
          startData = invokeErr?.response?.data || { error: invokeErr.message };
        }

        if (!startData?.renderId) {
          results.push({ type: 'article', article_id: article.id, status: 'composite_start_failed', error: startData });
          continue;
        }

        await base44.asServiceRole.entities.DnnArticle.update(article.id, {
          production_status: 'compositing',
          heygen_video_id: startData.renderId,
        });
        results.push({ type: 'article', article_id: article.id, status: 'compositing', renderId: startData.renderId });
      } catch (e) {
        results.push({ type: 'article', article_id: article.id, error: e.message });
      }
    }

    // ── 3. Articles 'compositing' → poll Creatomate → download final MP4 ──
    const compositingArticles = await base44.asServiceRole.entities.DnnArticle.filter(
      { production_status: 'compositing' },
      '-updated_date',
      50
    );

    for (const article of compositingArticles) {
      try {
        const renderId = article.heygen_video_id;
        if (!renderId) {
          results.push({ type: 'article', article_id: article.id, status: 'no_render_id' });
          continue;
        }

        let checkData;
        try {
          const checkRes = await base44.asServiceRole.functions.invoke('dnnCreatomateRender', {
            action: 'check',
            renderId,
            headline: article.headline,
            articleId: article.id,
            pipeline_secret: pipelineSecret,
          });
          checkData = checkRes?.data || checkRes;
        } catch (invokeErr) {
          checkData = invokeErr?.response?.data || { error: invokeErr.message };
        }

        if (checkData?.status === 'succeeded') {
          results.push({ type: 'article', article_id: article.id, status: 'complete', video_url: checkData.mp4Url });
        } else if (checkData?.error) {
          await base44.asServiceRole.entities.DnnArticle.update(article.id, {
            production_status: 'failed',
            last_render_error: String(checkData.error).slice(0, 500),
          });
          results.push({ type: 'article', article_id: article.id, status: 'failed', error: checkData.error });
        } else {
          results.push({ type: 'article', article_id: article.id, status: 'still_compositing', renderStatus: checkData?.status });
        }
      } catch (e) {
        results.push({ type: 'article', article_id: article.id, error: e.message });
      }
    }

    return Response.json({ checked: results.length, results });
  } catch (error) {
    console.error('dnnVideoPoller error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});