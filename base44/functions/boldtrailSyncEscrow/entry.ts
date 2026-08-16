import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mapDealToMilestones, upsertEscrowMilestone, getDefaultBrokerageId } from '../../shared/boldtrailSync.ts';

/**
 * Option A — Direct BoldTrail API sync.
 * Polls the BoldTrail Deals API and upserts EscrowMilestone records.
 * Admin-only. Invoke manually or via a scheduled automation.
 *
 * NOTE: BoldTrail's public V2 API is in beta. The exact endpoint paths
 * are confirmed in the developer portal (developer.insiderealestate.com/publicv2).
 * This function uses BOLDTRAIL_API_BASE_URL + /deals as the default and
 * will work once your token + base URL are confirmed.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const token = secrets.get('BOLDTRAIL_API_TOKEN');
    if (!token) {
      return Response.json({
        error: 'BOLDTRAIL_API_TOKEN not set',
        hint: 'Generate an API token in BoldTrail: Lead Engine → Lead Dropbox → My API Tokens (All scope), then save it as the BOLDTRAIL_API_TOKEN secret.',
      }, { status: 400 });
    }
    const rawBase = (secrets.get('BOLDTRAIL_API_BASE_URL') || '').trim();
    const baseUrl = (rawBase || 'https://api.boldtrail.com/v2').replace(/\/$/, '');
    if (!/^https?:\/\//.test(baseUrl)) {
      return Response.json({
        error: 'BOLDTRAIL_API_BASE_URL is invalid',
        hint: 'Set it to https://api.boldtrail.com/v2 (or the exact base from the BoldTrail developer portal). Current value is empty or malformed.',
      }, { status: 400 });
    }

    const brokerage_id = await getDefaultBrokerageId(base44);

    const url = new URL(`${baseUrl}/deals`);
    url.searchParams.set('status', 'active');
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      return Response.json({
        error: `BoldTrail API ${res.status}`,
        detail: await res.text(),
      }, { status: 502 });
    }
    const body = await res.json();
    const deals = Array.isArray(body) ? body : (body.deals || body.data || []);

    let created = 0, updated = 0, skipped = 0;
    for (const deal of deals) {
      const milestones = mapDealToMilestones(deal, deal.client_id, brokerage_id);
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
      deals_pulled: deals.length,
      milestones_created: created,
      milestones_updated: updated,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}