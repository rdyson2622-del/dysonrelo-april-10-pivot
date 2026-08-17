import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mapDealToMilestones, upsertEscrowMilestone, resolveBrokerageId, resolveBoldtrailApiBase, fetchBoldtrailTransactions } from '../../shared/boldtrailSync.ts';

/**
 * Option A — Direct BoldTrail Back Office sync.
 * Polls Brokermint /transactions (fallback /deals) and upserts EscrowMilestone.
 * Admin-only. Invoke manually or via a scheduled automation.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const canSync = user.role === 'admin' || user.brokerage_id || user.data?.brokerage_id;
    if (!canSync) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const token = secrets.get('BOLDTRAIL_API_TOKEN');
    if (!token) {
      return Response.json({
        error: 'BOLDTRAIL_API_TOKEN not set',
        hint: 'Paste the Wisdom BoldTrail Back Office API key (Admin → API settings) as BOLDTRAIL_API_TOKEN. Lead Engine JWTs cannot read transactions.',
      }, { status: 400 });
    }
    const resolved = resolveBoldtrailApiBase(secrets.get('BOLDTRAIL_API_BASE_URL'));
    const pulled = await fetchBoldtrailTransactions(resolved.baseUrl, token, resolved.flavor);
    if (!pulled.ok) {
      return Response.json({
        error: `BoldTrail API ${pulled.status || 502}`,
        detail: pulled.detail,
        attempts: pulled.attempts,
        hint: 'Set BOLDTRAIL_API_BASE_URL to https://my.brokermint.com/api/v2 and BOLDTRAIL_API_TOKEN to the Back Office API key (not a Lead Engine JWT).',
      }, { status: 502 });
    }
    const deals = pulled.items;

    const brokerageId = await resolveBrokerageId(base44);
    let created = 0, updated = 0, skipped = 0;
    for (const deal of deals) {
      const milestones = mapDealToMilestones(deal, deal.client_id, brokerageId);
      if (milestones.length === 0) { skipped++; continue; }
      for (const m of milestones) {
        try {
          const result = await upsertEscrowMilestone(base44, m);
          if (result && result.created_date && result.updated_date && new Date(result.updated_date).getTime() - new Date(result.created_date).getTime() < 5000) {
            created++;
          } else {
            updated++;
          }
        } catch { skipped++; }
      }
    }

    return Response.json({
      status: 'ok',
      source: 'boldtrail_api',
      host: pulled.host,
      path: pulled.path,
      deals_pulled: deals.length,
      milestones_created: created,
      milestones_updated: updated,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}