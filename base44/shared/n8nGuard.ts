/**
 * n8nGuard — blocks all n8n (M2M) pipeline calls.
 *
 * The owner has disabled the n8n integration. Any request carrying the
 * x-pipeline-secret header (an n8n machine-to-machine call) is rejected
 * with 410 Gone before any work or external API call happens.
 *
 * Authenticated admin-user calls (no x-pipeline-secret header) pass through
 * unchanged, so admin UI features that share these endpoints still work.
 *
 * Usage at the top of a Deno.serve handler:
 *   import { blockIfN8n } from '../../shared/n8nGuard.ts';
 *   Deno.serve(async (req) => {
 *     try {
 *       const blocked = blockIfN8n(req); if (blocked) return blocked;
 *       ...
 */
export function blockIfN8n(req: Request): Response | null {
  const providedSecret = req.headers.get('x-pipeline-secret');
  if (!providedSecret) return null; // not an n8n call — allow
  return Response.json(
    { disabled: true, message: 'n8n pipeline integration has been disabled. No work performed.' },
    { status: 410 }
  );
}