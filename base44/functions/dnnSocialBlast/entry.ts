import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnSocialBlast — Daily social media distribution
 *
 * Posts the latest DNN Intelligence Brief as a VIDEO to:
 *   1. LinkedIn (personal profile video post)
 *   2. Facebook Pages (video post)
 *
 * If no finished video is available, falls back to a text post.
 *
 * Scheduled daily at 6:00 AM PT — the video pipeline runs at 5:10 AM
 * and the poller ensures videos are ready before this fires.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth check — admin only for manual triggers
    const isManual = req.method === 'POST';
    if (isManual) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
      }
    }

    // 1. Get the most recent published article (not yet blasted)
    const candidates = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' }, '-generated_date', 50
    );

    if (!candidates.length) {
      return Response.json({ error: 'No published articles found to post' }, { status: 404 });
    }

    const article = candidates[0];

    // Check if we have a real video URL (not pending)
    const hasVideo = article.video_url && !article.video_url.startsWith('heygen:pending:');

    // 2. Build social copy
    const appUrl = 'https://app.base44.com/apps/683966cc2de4e2c5e7699c47/dnn-news';
    const firstPara = article.body?.split('\n').find(p => p.trim()) || '';
    const teaser = firstPara.length > 180 ? firstPara.slice(0, 180) + '...' : firstPara;

    const triggerLabel = {
      tax_policy: 'TAX POLICY',
      housing_market: 'HOUSING MARKET',
      job_market: 'JOB MARKET',
      interest_rates: 'INTEREST RATES',
      migration_data: 'MIGRATION DATA',
      employer_news: 'EMPLOYER NEWS',
      general: 'INTELLIGENCE BRIEF',
      federal_reserve: 'FEDERAL RESERVE',
      mortgage_lending: 'MORTGAGE LENDING',
      federal_legislation: 'FEDERAL LEGISLATION',
      national_housing_data: 'NATIONAL HOUSING DATA',
      economic_indicators: 'ECONOMIC INDICATORS',
      demographics_migration: 'DEMOGRAPHICS & MIGRATION',
      insurance_climate: 'INSURANCE & CLIMATE',
      regulatory_compliance: 'REGULATORY COMPLIANCE',
      construction_supply: 'CONSTRUCTION & SUPPLY',
      consumer_protection: 'CONSUMER PROTECTION',
    }[article.trigger_type] || 'INTELLIGENCE BRIEF';

    let solutionSection = '';
    if (article.client_solution) solutionSection += `\n\n🔵 FOR CLIENTS: ${article.client_solution}`;
    if (article.agent_solution) solutionSection += `\n🟡 FOR AGENTS: ${article.agent_solution}`;
    if (article.vendor_solution) solutionSection += `\n🟢 FOR VENDORS: ${article.vendor_solution}`;

    const socialText = `📡 DNN Intelligence Bureau — ${triggerLabel}

${article.headline}

${teaser}
${solutionSection}

Dyson & Dyson Real Estate Concierge — the only news network that reports what happened AND tells you exactly what to do about it.

Read the full brief: ${appUrl}

#RealEstateNews #RelocationIntelligence #DNN #DysonAndDyson #HousingMarket #RealEstate`;

    // 3. Download the video if we have one
    let videoBuffer = null;
    if (hasVideo) {
      try {
        const vidRes = await fetch(article.video_url);
        console.log('Video download status:', vidRes.status, 'for URL:', article.video_url?.slice(0, 80));
        if (vidRes.ok) {
          videoBuffer = await vidRes.arrayBuffer();
          console.log('Video buffer size:', videoBuffer.byteLength, 'bytes');
        } else {
          console.warn('Video download returned non-ok status:', vidRes.status, await vidRes.text().catch(() => ''));
        }
      } catch (e) {
        console.warn('Video download failed:', e.message);
      }
    }

    const results = {
      article_headline: article.headline,
      has_video: hasVideo,
      linkedin: null,
      facebook: null,
    };

    // --- 4. Post to LinkedIn (new Videos API + Posts API) ---
    try {
      const { accessToken: linkedinToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${linkedinToken}` },
      });
      const profile = await profileRes.json();
      const authorUrn = `urn:li:person:${profile.sub}`;

      const linkedinHeaders = {
        Authorization: `Bearer ${linkedinToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'Linkedin-Version': '202603',
      };

      if (hasVideo && videoBuffer) {
        // Step 1: Initialize upload via new Videos API
        const initRes = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
          method: 'POST',
          headers: linkedinHeaders,
          body: JSON.stringify({
            initializeUploadRequest: {
              owner: authorUrn,
              fileSizeBytes: videoBuffer.byteLength,
              uploadCaptions: false,
              uploadThumbnail: false,
            },
          }),
        });

        const initData = await initRes.json();
        const uploadToken = initData?.value?.uploadToken;
        const videoUrn = initData?.value?.video;
        const uploadUrl = initData?.value?.uploadInstructions?.[0]?.uploadUrl;

        if (videoUrn && uploadUrl) {
          // Step 2: Upload video binary — handle multi-part chunked uploads
          const instructions = initData?.value?.uploadInstructions || [{ uploadUrl, firstByte: 0, lastByte: videoBuffer.byteLength - 1 }];
          const videoBytes = new Uint8Array(videoBuffer);
          let allUploadsOk = true;
          let uploadErrorDetail = '';
          const uploadedPartIds = [];

          for (const instr of instructions) {
            const start = instr.firstByte || 0;
            const end = (instr.lastByte ?? videoBuffer.byteLength - 1) + 1;
            const chunkSize = end - start;
            const chunk = new Blob([videoBytes.slice(start, end)], { type: 'application/octet-stream' });

            const uploadRes = await fetch(instr.uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': String(chunkSize),
              },
              body: chunk,
            });

            // LinkedIn returns an ETag header for each uploaded part
            const etag = uploadRes.headers.get('etag') || uploadRes.headers.get('ETag');
            if (etag) uploadedPartIds.push(etag.replace(/"/g, ''));

            if (!uploadRes.ok) {
              allUploadsOk = false;
              try { uploadErrorDetail = await uploadRes.text(); } catch (_) {}
              break;
            }
          }

          if (allUploadsOk) {
            // Step 2b: Finalize the upload — uploadToken is always "" (empty string per LinkedIn docs)
            const finalizeBody = {
              finalizeUploadRequest: {
                video: videoUrn,
                uploadToken: uploadToken || '',
                uploadedPartIds,
              },
            };
            const finalizeRes = await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
              method: 'POST',
              headers: linkedinHeaders,
              body: JSON.stringify(finalizeBody),
            });
            const finalizeData = await finalizeRes.json().catch(() => ({}));

            // Step 2c: Poll video status until AVAILABLE (max 30s)
            let videoReady = false;
            let pollStatus = 'unknown';
            for (let attempt = 0; attempt < 6; attempt++) {
              await new Promise(r => setTimeout(r, 5000));
              const statusRes = await fetch(`https://api.linkedin.com/rest/videos/${encodeURIComponent(videoUrn)}`, {
                headers: linkedinHeaders,
              });
              const statusData = await statusRes.json().catch(() => ({}));
              pollStatus = statusData?.status || statusData?.processingStatus || `http_${statusRes.status}`;
              if (pollStatus === 'READY' || pollStatus === 'AVAILABLE') {
                videoReady = true;
                break;
              }
              if (pollStatus === 'FAILED' || pollStatus === 'ERROR') {
                break;
              }
            }

            // Step 3: Create video post via ugcPosts API (rest/posts has a known bug with video)
            // Convert urn:li:video: → urn:li:digitalmediaAsset: for the ugcPosts API
            const mediaUrn = videoUrn.replace(':video:', ':digitalmediaAsset:');
            const ugcPostBody = {
              author: authorUrn,
              lifecycleState: 'PUBLISHED',
              specificContent: {
                'com.linkedin.ugc.ShareContent': {
                  media: [
                    {
                      media: mediaUrn,
                      status: 'READY',
                      title: {
                        attributes: [],
                        text: article.headline,
                      },
                    },
                  ],
                  shareCommentary: {
                    attributes: [],
                    text: socialText,
                  },
                  shareMediaCategory: 'VIDEO',
                },
              },
              visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
              },
            };
            const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
              method: 'POST',
              headers: linkedinHeaders,
              body: JSON.stringify(ugcPostBody),
            });

            let postResult = {};
            try { postResult = await postRes.json(); } catch (_) {}
            const postId = postRes.headers.get('x-restli-id') || postResult.id || 'created';
            if (!postRes.ok) {
              results.linkedin = { success: false, error: postResult.message || `LinkedIn video post failed (status ${postRes.status})`, details: postResult };
            } else {
              results.linkedin = { success: true, post_id: postId, type: 'video', video_ready: videoReady, video_status: pollStatus };
            }
          } else {
            results.linkedin = { success: false, error: 'LinkedIn video binary upload failed', details: uploadErrorDetail.slice(0, 500) };
          }
        } else {
          results.linkedin = { success: false, error: 'LinkedIn upload initialization failed', details: initData };
        }
      } else {
        // --- Text-only fallback via new Posts API ---
        const postRes = await fetch('https://api.linkedin.com/rest/posts', {
          method: 'POST',
          headers: linkedinHeaders,
          body: JSON.stringify({
            author: authorUrn,
            commentary: socialText,
            visibility: 'PUBLIC',
            distribution: {
              feedDistribution: 'MAIN_FEED',
              targetEntities: [],
              thirdPartyDistributionChannels: [],
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false,
          }),
        });

        const postResult = await postRes.json();
        if (!postRes.ok) {
          results.linkedin = { success: false, error: postResult.message || 'LinkedIn API error', details: postResult };
        } else {
          results.linkedin = { success: true, post_id: postResult.id, type: 'text', note: 'No video available — posted text only' };
        }
      }
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    // --- 5. Post to Facebook Pages ---
    try {
      const { accessToken: fbToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

      const accountsRes = await fetch(
        `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${fbToken}`
      );
      const accountsData = await accountsRes.json();

      if (!accountsData.data || accountsData.data.length === 0) {
        results.facebook = { success: false, error: 'No Facebook Pages found for this account' };
      } else {
        const page = accountsData.data[0];

        if (hasVideo && videoBuffer) {
          // --- Video post: upload via multipart form data ---
          const formData = new FormData();
          formData.append('description', socialText);
          formData.append('title', article.headline);
          const videoFile = new File([videoBuffer], 'dnn_brief.mp4', { type: 'video/mp4' });
          formData.append('source', videoFile);

          const fbPostRes = await fetch(
            `https://graph.facebook.com/v25.0/${page.id}/videos?access_token=${page.access_token}`,
            { method: 'POST', body: formData }
          );

          const fbResult = await fbPostRes.json();
          if (!fbPostRes.ok) {
            results.facebook = { success: false, error: fbResult.error?.message || 'Facebook video API error', details: fbResult };
          } else {
            results.facebook = { success: true, post_id: fbResult.id, page_name: page.name, type: 'video' };
          }
        } else {
          // --- Text-only fallback ---
          const fbPostRes = await fetch(
            `https://graph.facebook.com/v25.0/${page.id}/feed?access_token=${page.access_token}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: socialText, link: appUrl }),
            }
          );

          const fbResult = await fbPostRes.json();
          if (!fbPostRes.ok) {
            results.facebook = { success: false, error: fbResult.error?.message || 'Facebook API error', details: fbResult };
          } else {
            results.facebook = { success: true, post_id: fbResult.id, page_name: page.name, type: 'text', note: 'No video available — posted text only' };
          }
        }
      }
    } catch (e) {
      results.facebook = { success: false, error: e.message };
    }

    console.log('DNN Social Blast results:', JSON.stringify(results));

    // Mark article as blasted only if at least one platform succeeded
    const anySuccess = results.linkedin?.success || results.facebook?.success;
    if (anySuccess && article.status === 'published') {
      await base44.asServiceRole.entities.DnnArticle.update(article.id, { status: 'blasted' });
    }

    return Response.json({ success: true, ...results });
  } catch (error) {
    console.error('dnnSocialBlast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});