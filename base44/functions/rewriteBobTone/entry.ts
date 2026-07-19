import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * rewriteBobTone — Rewrites all Bob Dyson scripts across clip entities
 * to use a softer, suggestive, discussion-based tone instead of directive/telling.
 *
 * After rewriting, resets bobStatus to 'not_started' so clips can be re-rendered.
 *
 * POST body:
 *   { entityName: "DnnNewsClip" }  → process one entity
 *   { entityName: "all" }          → process all known clip entities
 *
 * Auth: admin session.
 */

const CLIP_ENTITIES = [
  'DnnNewsClip',
  'RoadmapClip',
  'VettingDeskClip',
  'RealEstateQAClip',
  'CorporateReloClip',
  'ReceivingAgentClip',
  'LenderClip',
  'SolveMyStoryClip',
  'DnnComparisonClip',
  'PortalLeadInClip',
  'BobAnswerClip',
];

const TONE_INSTRUCTION = `Rewrite the following spoken script in the SAME VOICE and with the SAME INFORMATION, but change the tone to match Bob Dyson's updated voice.

CRITICAL VOICE & TONE RULES:
- VOICE: Sped up from the original slow/boring delivery. Energetic but not hyper. A livelier pace.
- PERSONALITY: Warm, seasoned, dry wit — a little humor, a little charm. Like talking to friends.
- TONE: Conversational, NOT an instructor or lecturer. Like you're sitting across the table from a friend.
- APPROACH: Use phrases like "What we do in these situations is...", "Here's how we handle that...", "Honestly...", "So here's the thing..."
- Speak WITH the listener, not AT them — share experiences, tell quick stories, use "we" and "I" naturally.
- NEVER use "you need to", "you should", "you must", "do this", "don't do that", or any imperative commands.
- Instead, frame guidance as shared experience and suggestions: "What we do in these situations is...", "One approach that's worked well...", "You might think about..."
- Respect that the listener may have their own knowledge and situation — offer perspective, not directives.
- Keep the warm, seasoned, dry-wit personality. Keep all facts, numbers, and specific details exactly the same.
- Keep it conversational and natural spoken language — not stiff, not corporate.
- Keep it approximately the same length as the original.
- Do NOT add any preamble, labels, or explanation — return ONLY the rewritten script text.

ORIGINAL SCRIPT:
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { entityName } = body;
    if (!entityName) {
      return Response.json({ error: 'entityName required (e.g. "DnnNewsClip" or "all")' }, { status: 400 });
    }

    const entitiesToProcess = entityName === 'all' ? CLIP_ENTITIES : [entityName];
    const allResults = [];

    for (const entName of entitiesToProcess) {
      const Clips = base44.asServiceRole.entities[entName];
      if (!Clips) {
        allResults.push({ entity: entName, error: 'Entity not found' });
        continue;
      }

      let clips = [];
      try {
        clips = await Clips.list(undefined, 200);
      } catch (e) {
        allResults.push({ entity: entName, error: e.message });
        continue;
      }

      const entityResults = [];
      for (const clip of clips) {
        if (!clip.bobScript) continue;

        try {
          const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: TONE_INSTRUCTION + clip.bobScript,
          });

          const newScript = typeof result === 'string'
            ? result.trim()
            : (result?.response || result?.text || result?.output || '').trim();

          if (!newScript || newScript.length < 10) {
            entityResults.push({ clipId: clip.id, status: 'failed', error: 'No rewrite returned' });
            continue;
          }

          await Clips.update(clip.id, {
            bobScript: newScript,
            bobStatus: 'not_started',
            bobHeygenId: null,
            bobVideoUrl: null,
          });

          entityResults.push({
            clipId: clip.id,
            status: 'rewritten',
            oldLength: clip.bobScript.length,
            newLength: newScript.length,
          });

          // Small delay between LLM calls
          await new Promise(r => setTimeout(r, 300));
        } catch (err) {
          entityResults.push({ clipId: clip.id, status: 'error', error: err.message });
        }
      }

      allResults.push({ entity: entName, processed: entityResults.length, results: entityResults });
    }

    return Response.json({ success: true, entities: allResults });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});