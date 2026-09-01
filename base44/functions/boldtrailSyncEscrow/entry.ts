import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mapDealToMilestones, upsertEscrowMilestone, upsertEscrowRecord, resolveBrokerageId, brokermintUrl, toISODate } from '../../shared/boldtrailSync.ts';

/**
 * Direct Brokermint (BoldTrail BackOffice) API sync — builds the per-escrow
 * milestone roadmap shown on the Escrow Management page.
 *
 * The transactions LIST endpoint only returns basic fields (no dates), so for
 * each transaction we fetch its DETAIL endpoint (GET /transactions/:id) to
 * get acceptance/listing/buyer-agreement/closing dates, map them to
 * EscrowMilestone records, and upsert them.
 *
 * Only transactions with no milestones on file yet are fetched each run
 * (BATCH_LIMIT per run) so a large backlog clears itself over a few runs
 * instead of making hundreds of detail calls at once. No auth requirement so
 * this can also run unattended via a scheduled automation.
 */
const BATCH_LIMIT = 15;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const accountId = secrets.get('BROKERMINT_ACCOUNT_ID');
    const apiKey = secrets.get('BROKERMINT_API_KEY');
    if (!accountId || !apiKey) {
      return Response.json({
        error: 'BROKERMINT_ACCOUNT_ID / BROKERMINT_API_KEY not set',
        hint: 'Get your account ID and API key from Brokermint support and save them as secrets.',
      }, { status: 400 });
    }

    const listRes = await fetch(brokermintUrl('/transactions', accountId, apiKey), {
      headers: { 'Accept': 'application/json' },
    });
    if (!listRes.ok) {
      return Response.json({
        error: `Brokermint API ${listRes.status}`,
        detail: await listRes.text(),
      }, { status: 502 });
    }
    const listBody = await listRes.json();
    const deals = Array.isArray(listBody) ? listBody : (listBody.deals || listBody.data || []);

    const brokerageId = await resolveBrokerageId(base44);

    // Which escrow numbers already have milestones pulled from Brokermint?
    const existingMilestones = await base44.asServiceRole.entities.EscrowMilestone.filter(
      { extracted_from: 'boldtrail_api' }, undefined, 2000
    );
    const alreadySynced = new Set(existingMilestones.map(m => String(m.escrow_number)));

    const newDeals = deals.filter(d => {
      const id = String(d.id || d.transaction_id || d.escrow_number || '');
      return id && !alreadySynced.has(id);
    }).slice(0, BATCH_LIMIT);

    let created = 0, updated = 0, skipped = 0;
    for (const listing of newDeals) {
      const id = listing.id || listing.transaction_id;
      // Fetch full detail — the list endpoint doesn't include dates.
      const detailRes = await fetch(brokermintUrl(`/transactions/${id}`, accountId, apiKey), {
        headers: { 'Accept': 'application/json' },
      });
      if (!detailRes.ok) { skipped++; continue; }
      const deal = await detailRes.json();

      // Key-dates summary record (Acceptance/Closing date) — agent names are
      // left for manual entry since Brokermint's API doesn't expose them.
      try {
        await upsertEscrowRecord(base44, {
          escrow_number: String(id),
          brokerage_id: brokerageId,
          property_address: [deal.address, deal.city, deal.state].filter(Boolean).join(", "),
          acceptance_date: toISODate(deal.acceptance_date),
          closing_date: toISODate(deal.closing_date),
          last_synced_at: new Date().toISOString(),
        });
      } catch { /* best-effort */ }

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
      transactions_found: deals.length,
      already_synced: alreadySynced.size,
      transactions_processed: newDeals.length,
      milestones_created: created,
      milestones_updated: updated,
      skipped,
      backlog_remaining: Math.max(0, deals.length - alreadySynced.size - newDeals.length),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}