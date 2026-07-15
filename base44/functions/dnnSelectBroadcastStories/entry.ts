import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnSelectBroadcastStories — The story selection step of the DNN pipeline.
 *
 * Pulls all recently published articles, scores them based on whether they have
 * strong solution angles (client_solution, agent_solution, vendor_solution),
 * and selects the top 3-5 stories for the daily broadcast.
 *
 * Selected stories are marked with production_status = 'new' so the broadcast
 * pipeline knows which articles to include in the show.
 *
 * Called manually or on a schedule before the broadcast script generation runs.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    // 1. Pull all recently published articles (last 48 hours)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const articles = await base44.asServiceRole.entities.DnnArticle.filter(
      { status: 'published', generated_date: { $gte: twoDaysAgo } },
      '-generated_date',
      50
    );

    if (!articles.length) {
      return Response.json({ error: 'No published articles found in the last 48 hours' }, { status: 404 });
    }

    // 2. Score each article based on solution quality
    const scored = articles.map(article => {
      let score = 0;

      // Solution completeness (0-3 points)
      if (article.client_solution && article.client_solution.trim().length > 20) score += 1;
      if (article.agent_solution && article.agent_solution.trim().length > 20) score += 1;
      if (article.vendor_solution && article.vendor_solution.trim().length > 20) score += 1;

      // Has interview Q&A (1 point)
      if (article.interview_qa && article.interview_qa.length > 0) score += 1;

      // National scope gets slight boost (1 point)
      if (article.scope === 'national') score += 1;

      // Freshness bonus (1 point if generated in last 24 hours)
      const generatedDate = new Date(article.generated_date || article.created_date);
      const hoursOld = (Date.now() - generatedDate.getTime()) / (60 * 60 * 1000);
      if (hoursOld < 24) score += 1;

      return { article, score, hoursOld };
    });

    // 3. Sort by score (highest first), then by freshness
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.hoursOld - b.hoursOld;
    });

    // 4. Select top 3 stories (or fewer if not enough high-quality stories)
    const minScore = 2; // At least 2 points (one solution + one bonus)
    const eligible = scored.filter(s => s.score >= minScore);
    const selectedCount = Math.min(3, eligible.length);
    const selected = eligible.slice(0, selectedCount);

    if (!selected.length) {
      return Response.json({
        success: false,
        error: 'No articles with sufficient solution angles found',
        total_articles: articles.length,
        min_score_required: minScore,
      }, { status: 404 });
    }

    // 5. Reset all articles' production_status, then mark selected ones as 'new'
    // This ensures only the selected stories enter the broadcast pipeline
    for (const article of articles) {
      if (article.production_status && article.production_status !== 'none' && article.production_status !== 'complete') {
        await base44.asServiceRole.entities.DnnArticle.update(article.id, { production_status: 'none' });
      }
    }

    const selectedIds = [];
    for (const s of selected) {
      await base44.asServiceRole.entities.DnnArticle.update(s.article.id, { production_status: 'new' });
      selectedIds.push({
        id: s.article.id,
        headline: s.article.headline,
        scope: s.article.scope,
        trigger_type: s.article.trigger_type,
        score: s.score,
        has_client_solution: !!(s.article.client_solution && s.article.client_solution.trim().length > 20),
        has_agent_solution: !!(s.article.agent_solution && s.article.agent_solution.trim().length > 20),
        has_vendor_solution: !!(s.article.vendor_solution && s.article.vendor_solution.trim().length > 20),
        has_qa: !!(s.article.interview_qa && s.article.interview_qa.length > 0),
      });
    }

    return Response.json({
      success: true,
      total_articles_reviewed: articles.length,
      selected_for_broadcast: selectedIds.length,
      min_score_required: minScore,
      selected_stories: selectedIds,
      message: `${selectedIds.length} stories selected for broadcast. Ready for script generation and rendering.`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});