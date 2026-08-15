import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs daily — deletes DNN articles older than 2 days to keep feed fresh
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Calculate cutoff: 2 days ago
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    // Get all articles older than 2 days
    const oldArticles = await base44.asServiceRole.entities.DnnArticle.filter({});
    
    const toDelete = oldArticles.filter(a => {
      // Never delete pinned/featured articles (e.g. the standalone DNN Intelligence Report video)
      if ((a.tags || []).includes('featured')) return false;
      const generated = new Date(a.generated_date || a.created_date);
      return generated < new Date(twoDaysAgo);
    });

    // Delete them
    let deletedCount = 0;
    for (const article of toDelete) {
      try {
        await base44.asServiceRole.entities.DnnArticle.delete(article.id);
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete article ${article.id}:`, err.message);
      }
    }

    return Response.json({
      success: true,
      deleted: deletedCount,
      cutoffDate: twoDaysAgo,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});