import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

// Lets live-voice Charlie pull verified, company-specific answers instead of
// guessing from general model knowledge. Simple keyword scoring — fast enough
// for a real-time voice tool call, no LLM round-trip needed.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { query } = await req.json();
    if (!query) {
      return Response.json({ error: 'query is required' }, { status: 400 });
    }

    const entries = await base44.asServiceRole.entities.CharlieKnowledgeBase.filter({ is_active: true });

    const queryWords = query.toLowerCase().split(/\W+/).filter((w: string) => w.length > 2);
    const scored = entries
      .map((entry: any) => {
        const haystack = `${entry.question} ${(entry.keywords || []).join(' ')} ${entry.answer}`.toLowerCase();
        const score = queryWords.reduce((acc: number, w: string) => acc + (haystack.includes(w) ? 1 : 0), 0);
        return { entry, score };
      })
      .filter((s: any) => s.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3);

    if (scored.length === 0) {
      return Response.json({ found: false, answers: [] });
    }

    await Promise.all(
      scored.map((s: any) =>
        base44.asServiceRole.entities.CharlieKnowledgeBase.update(s.entry.id, {
          times_used: (s.entry.times_used || 0) + 1,
          last_used: new Date().toISOString(),
        })
      )
    );

    return Response.json({
      found: true,
      answers: scored.map((s: any) => ({ question: s.entry.question, answer: s.entry.answer, topic: s.entry.topic })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});