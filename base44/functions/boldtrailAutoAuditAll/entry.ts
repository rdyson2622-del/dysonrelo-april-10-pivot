import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets, waitUntil } from 'base44:runtime';
import { resolveBrokerageId, brokermintUrl, runTransactionDocAudit, dealIsOnOrAfterCutoff, SYNC_CUTOFF_DATE } from '../../shared/boldtrailSync.ts';

/**
 * boldtrailAutoAuditAll — fully automatic real-time document audit.
 *
 * Pulls EVERY transaction from Brokermint, finds the ones that don't have a
 * TransactionDocAnalysis yet, and kicks off the LLM friction/deadline audit
 * for each — no manual escrow-number entry required. Runs on a schedule
 * (every 10 minutes via automation) so new Brokermint transactions get
 * reviewed automatically; also callable on-demand from the admin UI for an
 * immediate sync.
 *
 * Caps new audits per run (BATCH_LIMIT) to keep LLM usage bounded — a large
 * backlog clears itself over a few runs instead of firing hundreds of LLM
 * calls at once.
 */
const BATCH_LIMIT = 10;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const accountId = secrets.get('BROKERMINT_ACCOUNT_ID');
    const apiKey = secrets.get('BROKERMINT_API_KEY');
    if (!accountId || !apiKey) {
      return Response.json({
        error: 'BROKERMINT_ACCOUNT_ID / BROKERMINT_API_KEY not set',
      }, { status: 400 });
    }

    const brokerageId = await resolveBrokerageId(base44);

    const dealsRes = await fetch(brokermintUrl('/transactions', accountId, apiKey), {
      headers: { 'Accept': 'application/json' },
    });
    if (!dealsRes.ok) {
      return Response.json({
        error: `Brokermint API ${dealsRes.status}`,
        detail: await dealsRes.text(),
      }, { status: 502 });
    }
    const dealsBody = await dealsRes.json();
    const deals = Array.isArray(dealsBody) ? dealsBody : (dealsBody.deals || dealsBody.data || []);

    // Which escrow numbers already have an analysis on file?
    const existing = await base44.asServiceRole.entities.TransactionDocAnalysis.list('-created_date', 1000);
    const alreadyAudited = new Set(existing.map(a => String(a.escrow_number)));

    const newDeals = deals.filter(d => {
      const escrowNumber = String(d.id || d.transaction_id || d.escrow_number || '');
      return escrowNumber && !alreadyAudited.has(escrowNumber);
    }).slice(0, BATCH_LIMIT);

    const queued = [];
    let excludedBeforeCutoff = 0;
    for (const listDeal of newDeals) {
      const escrowNumber = String(listDeal.id || listDeal.transaction_id || listDeal.escrow_number);

      // Fetch full detail — the list endpoint doesn't reliably include dates,
      // and we need accurate dates to enforce the sync cutoff.
      const detailRes = await fetch(brokermintUrl(`/transactions/${escrowNumber}`, accountId, apiKey), {
        headers: { 'Accept': 'application/json' },
      });
      const deal = detailRes.ok ? await detailRes.json() : listDeal;
      const propertyAddress = deal.property_address || deal.address || '';

      if (!dealIsOnOrAfterCutoff(deal)) {
        // Write a lightweight "checked, excluded" record so this transaction
        // is never re-fetched on future runs — no LLM call needed.
        await base44.asServiceRole.entities.TransactionDocAnalysis.create({
          brokerage_id: brokerageId,
          escrow_number: escrowNumber,
          property_address: propertyAddress,
          doc_type: 'combined',
          doc_name: `Escrow ${escrowNumber} — ${propertyAddress || 'BoldTrail'}`,
          doc_file_urls: [],
          status: 'analyzed',
          terms_summary: `Excluded from audit — transaction dated before the ${SYNC_CUTOFF_DATE} sync cutoff.`,
          hotspot_score: 0,
          analyzed_at: new Date().toISOString(),
        });
        excludedBeforeCutoff++;
        continue;
      }

      const analysis = await base44.asServiceRole.entities.TransactionDocAnalysis.create({
        brokerage_id: brokerageId,
        escrow_number: escrowNumber,
        property_address: propertyAddress,
        doc_type: 'combined',
        doc_name: `Escrow ${escrowNumber} — ${propertyAddress || 'BoldTrail'}`,
        doc_file_urls: [],
        status: 'analyzing',
        analyzed_at: new Date().toISOString(),
      });
      waitUntil(runTransactionDocAudit(base44, analysis.id, escrowNumber, propertyAddress, deal, [], brokerageId));
      queued.push(escrowNumber);
    }

    return Response.json({
      status: 'ok',
      cutoff_date: SYNC_CUTOFF_DATE,
      transactions_found: deals.length,
      already_audited: alreadyAudited.size,
      new_audits_queued: queued.length,
      excluded_before_cutoff: excludedBeforeCutoff,
      queued_escrow_numbers: queued,
      backlog_remaining: Math.max(0, deals.length - alreadyAudited.size - queued.length - excludedBeforeCutoff),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}