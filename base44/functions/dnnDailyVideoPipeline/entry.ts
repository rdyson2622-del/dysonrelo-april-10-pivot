import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnDailyVideoPipeline
 *
 * Tag-team banter pipeline:
 *   1. Finds published DnnArticles with interview_qa but no DnnNewsClip records yet
 *   2. Generates an intro + outro script to bookend the Q&A exchanges
 *   3. Creates DnnNewsClip records (intro, qa pairs, outro) with Charlie + Bob scripts
 *   4. Submits HeyGen renders for each clip's Charlie and Bob segments
 *
 * Batch mode (POST { batch: true }): processes ALL pending articles
 * Single mode: processes the most recent article only
 *
 * The dnnVideoPoller (every 5 min) checks DnnNewsClip records with 'rendering'
 * status and stores completed video URLs.
 *
 * The DnnNewsPresenter component automatically plays completed DnnNewsClip records.
 */

const HEYGEN_API = 'https://api.heygen.com';

// Charlie Simmons — DNN anchor avatar + voice
const CHARLIE_AVATAR_ID = '41f40b894f6944188c7908253b12e921';
const CHARLIE_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';

// Bob Dyson — talking photo + voice
const BOB_TALKING_PHOTO_ID = '31b79a86784e495090472af2e7b9407c';
const BOB_VOICE_ID = '147b8f5713024fb9afc106f266e47482';

// No studio background — render avatars on solid black so they blend
// seamlessly with the full-screen broadcast player's black canvas.
const DNN_BG = { type: 'color', value: '#000000' };

// Submit a HeyGen render and return { video_id } or null
async function submitHeyGenRender(script, role, heygenApiKey) {
  const character = role === 'bob'
    ? { type: 'talking_photo', talking_photo_id: BOB_TALKING_PHOTO_ID }
    : { type: 'avatar', avatar_id: CHARLIE_AVATAR_ID, avatar_style: 'normal' };

  const voice = role === 'bob'
    ? { type: 'text', voice_id: BOB_VOICE_ID, input_text: script, emotion: 'Excited', speed: 1.12 }
    : { type: 'text', voice_id: CHARLIE_VOICE_ID, input_text: script };

  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: { 'X-Api-Key': heygenApiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_inputs: [{ character, voice, background: DNN_BG }],
      dimension: { width: 1280, height: 720 },
    }),
  });

  let data;
  try { data = await res.json(); } catch (_) { data = {}; }

  if (!res.ok || !data?.data?.video_id) {
    console.error(`HeyGen render failed for ${role}:`, JSON.stringify(data));
    return null;
  }

  return data.data.video_id;
}

// Generate intro and outro scripts for an article
async function generateBookendScripts(base44, article) {
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are writing the OPENING and CLOSING lines for a DNN Intelligence Brief broadcast.

Charlie is the anchor — sharp, quick, slightly wry. Bob is the expert — warm, seasoned, 55 years in the business.

ARTICLE HEADLINE: ${article.headline}
ARTICLE BODY: ${article.body}

Write TWO scripts:

1. INTRO (Charlie only, under 40 words): Charlie opens the segment, introduces the topic, and tosses to Bob. Natural handoff language. Example tone: "Good morning — Charlie here with your DNN Intelligence Brief. Today we're tracking [topic]. Bob, what's the real story here?"

2. OUTRO (Charlie only, under 30 words): Charlie closes the segment after the Q&A. Natural sign-off. Example tone: "And that's your DNN Intelligence Brief for today. Subscribe at dysonanddyson.com for daily market intelligence."

Return JSON: { "intro": "...", "outro": "..." }`,
    response_json_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string' },
        outro: { type: 'string' },
      }
    }
  });

  return {
    intro: result?.intro || `Good morning — Charlie here with your DNN Intelligence Brief. Today we're looking at ${article.headline}.`,
    outro: result?.outro || `And that's your DNN Intelligence Brief for today. Subscribe at dysonanddyson.com for daily market intelligence.`,
  };
}

// Create DnnNewsClip records from an article's interview_qa + bookend scripts
async function createClipsFromArticle(base44, article, heygenApiKey) {
  // Check if clips already exist for this article
  const existing = await base44.asServiceRole.entities.DnnNewsClip.filter(
    { question: article.headline },
    undefined,
    1
  );
  if (existing.length > 0) {
    return { skipped: true, reason: 'clips already exist' };
  }

  // Generate intro + outro
  const bookends = await generateBookendScripts(base44, article);

  // Build clip list: intro, qa pairs, outro
  const clipsToCreate = [];
  let faqIdx = 0;

  // Intro clip — Charlie only
  clipsToCreate.push({
    kind: 'intro',
    faqIndex: faqIdx++,
    question: article.headline,
    charlieScript: bookends.intro,
    scriptStatus: 'approved',
  });

  // Q&A clips — Charlie asks, Bob answers
  const qa = article.interview_qa || [];
  for (const exchange of qa) {
    clipsToCreate.push({
      kind: 'qa',
      faqIndex: faqIdx++,
      question: article.headline,
      charlieScript: exchange.question,
      bobScript: exchange.answer,
      scriptStatus: 'approved',
    });
  }

  // Outro clip — Charlie only
  clipsToCreate.push({
    kind: 'outro',
    faqIndex: faqIdx++,
    question: article.headline,
    charlieScript: bookends.outro,
    scriptStatus: 'approved',
  });

  // Create clip records and submit HeyGen renders
  const results = [];
  for (const clipData of clipsToCreate) {
    const clip = await base44.asServiceRole.entities.DnnNewsClip.create(clipData);

    // Submit Charlie render
    if (clipData.charlieScript) {
      const videoId = await submitHeyGenRender(clipData.charlieScript, 'charlie', heygenApiKey);
      if (videoId) {
        await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
          charlieHeygenId: videoId,
          charlieStatus: 'rendering',
        });
        results.push({ clipId: clip.id, kind: clipData.kind, role: 'charlie', videoId, status: 'submitted' });
      } else {
        await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
          charlieStatus: 'failed',
          errorMessage: 'HeyGen submission failed',
        });
        results.push({ clipId: clip.id, kind: clipData.kind, role: 'charlie', status: 'failed' });
      }
    }

    // Submit Bob render (qa clips only)
    if (clipData.bobScript) {
      const videoId = await submitHeyGenRender(clipData.bobScript, 'bob', heygenApiKey);
      if (videoId) {
        await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
          bobHeygenId: videoId,
          bobStatus: 'rendering',
        });
        results.push({ clipId: clip.id, kind: clipData.kind, role: 'bob', videoId, status: 'submitted' });
      } else {
        await base44.asServiceRole.entities.DnnNewsClip.update(clip.id, {
          bobStatus: 'failed',
          errorMessage: 'HeyGen submission failed',
        });
        results.push({ clipId: clip.id, kind: clipData.kind, role: 'bob', status: 'failed' });
      }
    }

    // Small delay between submissions
    await new Promise(r => setTimeout(r, 500));
  }

  // Mark article as having clips created
  await base44.asServiceRole.entities.DnnArticle.update(article.id, {
    production_status: 'rendering',
  });

  return { article_id: article.id, headline: article.headline, clips: results };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });
    }

    // Parse batch mode
    let batchMode = false;
    if (req.method === 'POST') {
      try { const body = await req.json(); batchMode = body.batch === true; } catch (_) {}
    }

    // Find published articles with interview_qa that don't have clips yet
    const published = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published' },
      '-generated_date',
      batchMode ? 50 : 5
    );

    const candidates = published.filter(
      a => a.interview_qa && a.interview_qa.length > 0 && a.production_status !== 'rendering' && a.production_status !== 'complete'
    );

    if (!candidates.length) {
      return Response.json({ message: 'No articles pending tag-team clip creation' });
    }

    const articles = batchMode ? candidates : [candidates[0]];
    const results = [];
    const errors = [];

    for (const article of articles) {
      try {
        const result = await createClipsFromArticle(base44, article, HEYGEN_API_KEY);
        results.push(result);
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        errors.push({ article_id: article.id, headline: article.headline, error: err.message });
      }
    }

    return Response.json({
      success: true,
      processed: results.length,
      results,
      errors,
    });
  } catch (error) {
    console.error('dnnDailyVideoPipeline error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});