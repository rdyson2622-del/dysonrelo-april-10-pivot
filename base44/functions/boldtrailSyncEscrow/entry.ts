import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mapDealToMilestones, upsertEscrowMilestone, resolveBrokerageId, brokermintUrl } from '../../shared/boldtrailSync.ts';

/**
 * Direct Brokermint (BoldTrail BackOffice) API sync.
 * Polls the Brokermint Transactions API (my.brokermint.com/api/v2) and
 * upserts EscrowMilestone records. Admin-only. Invoke manually or via a
 * scheduled automation.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const accountId = secrets.get('BROKERMINT_ACCOUNT_ID');
    const apiKey = secrets.get('BROKERMINT_API_KEY');
    if (!accountId || !apiKey) {
      return Response.json({
        error: 'BROKERMINT_ACCOUNT_ID / BROKERMINT_API_KEY not set',
        hint: 'Get your account ID and API key from Brokermint support and save them as secrets.',
      }, { status: 400 });
    }

    const res = await fetch(brokermintUrl('/transactions', accountId, apiKey), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return Response.json({
        error: `Brokermint API ${res.status}`,
        detail: await res.text(),
      }, { status: 502 });
    }
    const body = await res.json();
    const deals = Array.isArray(body) ? body : (body.deals || body.data || []);

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
      source: 'brokermint_api',
      deals_pulled: deals.length,
      milestones_created: created,
      milestones_updated: updated,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}