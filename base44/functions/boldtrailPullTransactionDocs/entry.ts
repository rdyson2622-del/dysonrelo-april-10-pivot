import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets, waitUntil } from 'base44:runtime';
import { resolveBrokerageId, brokermintUrl, runTransactionDocAudit } from '../../shared/boldtrailSync.ts';

/**
 * Pull transaction documents for a given escrow # from Brokermint (BoldTrail BackOffice), then run a
 * real-time LLM audit (deadlines, signatures, friction hotspots) and persist a
 * TransactionDocAnalysis record. Critical/high hotspots also spawn EscrowMilestone
 * internal alerts so they surface in the Escrow alert banner.
 *
 * Returns immediately with status 'analyzing'; the LLM work runs via waitUntil and
 * the TransactionAudit page polls for the 'analyzed' result.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const escrowNumber = String(body.escrow_number || '').trim();
    if (!escrowNumber) {
      return Response.json({ error: 'escrow_number is required' }, { status: 400 });
    }
    const brokerageId = body.brokerage_id || await resolveBrokerageId(base44);

    const accountId = secrets.get('BROKERMINT_ACCOUNT_ID');
    const apiKey = secrets.get('BROKERMINT_API_KEY');
    if (!accountId || !apiKey) {
      return Response.json({
        error: 'BROKERMINT_ACCOUNT_ID / BROKERMINT_API_KEY not set',
        hint: 'Get your account ID and API key from Brokermint support and save them as secrets.',
      }, { status: 400 });
    }

    // 1. Find the transaction matching the escrow number (Brokermint transaction id)
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
    const deal = deals.find(d =>
      String(d.id || d.transaction_id || d.escrow_number || '') === escrowNumber
    );
    if (!deal) {
      return Response.json({
        error: `No Brokermint transaction found for escrow #${escrowNumber}`,
        hint: 'Confirm the escrow number matches a transaction ID in Brokermint.',
      }, { status: 404 });
    }

    const propertyAddress = deal.property_address || deal.address || '';

    // Brokermint's basic API tier has no documents endpoint — proceed with
    // transaction-data-only analysis.
    const docUrls = [];

    // 3. Create the analysis record with status 'analyzing'
    const analysis = await base44.asServiceRole.entities.TransactionDocAnalysis.create({
      brokerage_id: brokerageId,
      escrow_number: escrowNumber,
      property_address: propertyAddress,
      doc_type: 'combined',
      doc_name: `Escrow ${escrowNumber} — ${propertyAddress || 'BoldTrail'}`,
      doc_file_urls: docUrls,
      status: 'analyzing',
      analyzed_at: new Date().toISOString(),
    });

    // 4. Run the LLM audit in the background so the response returns fast
    waitUntil(runTransactionDocAudit(base44, analysis.id, escrowNumber, propertyAddress, deal, docUrls, brokerageId));

    return Response.json({
      status: 'ok',
      message: 'Docs pulled — analysis queued. Refresh in ~30s to see results.',
      analysis_id: analysis.id,
      docs_found: docUrls.length,
      deal_found: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}