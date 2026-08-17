import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets, waitUntil } from 'base44:runtime';
import { resolveBrokerageId, computeDaysUntil, resolveBoldtrailApiBase, fetchBoldtrailTransactions, boldtrailGetCollection } from '../../shared/boldtrailSync.ts';

/**
 * Pull transaction documents for a given escrow # from BoldTrail, then run a
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

    const token = secrets.get('BOLDTRAIL_API_TOKEN');
    if (!token) {
      return Response.json({
        error: 'BOLDTRAIL_API_TOKEN not set',
        hint: 'Paste the Wisdom BoldTrail Back Office API key (Admin → API settings) as BOLDTRAIL_API_TOKEN.',
      }, { status: 400 });
    }
    const resolved = resolveBoldtrailApiBase(secrets.get('BOLDTRAIL_API_BASE_URL'));
    const pulled = await fetchBoldtrailTransactions(resolved.baseUrl, token, resolved.flavor);
    if (!pulled.ok) {
      return Response.json({
        error: `BoldTrail API ${pulled.status || 502}`,
        detail: pulled.detail,
        attempts: pulled.attempts,
      }, { status: 502 });
    }
    const deals = pulled.items;
    const deal = deals.find(d =>
      String(d.id || d.transaction_id || d.escrow_number || d.externalId || '') === escrowNumber
    );
    if (!deal) {
      return Response.json({
        error: `No BoldTrail deal found for escrow #${escrowNumber}`,
        hint: 'Confirm the escrow number matches a deal ID in BoldTrail BackOffice.',
      }, { status: 404 });
    }

    const propertyAddress = deal.property_address || deal.address || deal.transactionName || '';
    const dealId = deal.id || deal.transaction_id || escrowNumber;
    const docHost = pulled.host || resolved.baseUrl;

    // 2. Attempt to fetch documents (Back Office /transactions/:id/documents, then /deals)
    let docUrls = [];
    for (const docPath of [`/transactions/${dealId}/documents`, `/deals/${dealId}/documents`]) {
      try {
        const docs = await boldtrailGetCollection(docHost, token, docPath);
        if (docs.ok) {
          docUrls = docs.items
            .map(d => d.url || d.download_url || d.file_url || d.signed_url)
            .filter(Boolean);
          if (docUrls.length > 0) break;
        }
      } catch { /* endpoint may not exist — proceed with deal-data-only analysis */ }
    }

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
    waitUntil(runLlmAudit(base44, analysis.id, escrowNumber, propertyAddress, deal, docUrls, brokerageId));

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

/**
 * Background LLM audit — extracts deadlines, signature requirements, and friction
 * hotspots from the deal data + any pulled documents, scores the friction, and
 * spawns EscrowMilestone internal alerts for high/critical hotspots.
 */
async function runLlmAudit(base44, analysisId, escrowNumber, propertyAddress, deal, docUrls, brokerageId) {
  try {
    const schema = {
      type: 'object',
      properties: {
        terms_summary: { type: 'string' },
        extracted_deadlines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              date: { type: 'string', format: 'date' },
              responsible_party: { type: 'string' },
              days_from_acceptance: { type: 'number' },
            },
          },
        },
        signature_requirements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              party: { type: 'string' },
              document_section: { type: 'string' },
              deadline_date: { type: 'string', format: 'date' },
              status: { type: 'string', enum: ['pending', 'signed', 'missing', 'unknown'] },
            },
          },
        },
        friction_hotspots: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              hotspot_type: { type: 'string', enum: ['tight_deadline', 'missing_signature', 'contingency_gap', 'lending_risk', 'title_risk', 'ambiguous_term', 'unusual_clause', 'other'] },
              description: { type: 'string' },
              severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
              related_deadline: { type: 'string' },
              recommended_action: { type: 'string' },
            },
          },
        },
      },
    };

    const dealContext = [
      `Escrow #: ${escrowNumber}`,
      `Property: ${propertyAddress || '—'}`,
      `Escrow company: ${deal.escrow_company || deal.title_company || '—'}`,
      `Acceptance date: ${deal.acceptance_date || deal.contract_date || '—'}`,
      `Closing date: ${deal.closing_date || deal.expected_close_date || '—'}`,
      `Inspection date: ${deal.inspection_date || '—'}`,
      `Inspection contingency date: ${deal.inspection_contingency_date || '—'}`,
      `Appraisal date: ${deal.appraisal_date || '—'}`,
      `Loan approval date: ${deal.loan_approval_date || '—'}`,
      `Contingency release date: ${deal.contingency_release_date || '—'}`,
      `Clear to close date: ${deal.clear_to_close_date || '—'}`,
      `Funding date: ${deal.funding_date || '—'}`,
      `Purchase price: ${deal.purchase_price || deal.price || '—'}`,
      `Financing type: ${deal.financing_type || '—'}`,
    ].join('\n');

    const prompt = `You are an expert real estate transaction auditor and managing broker reviewer.
Analyze the following escrow transaction${docUrls.length > 0 ? ' and the attached documents (RPA, counters, addenda)' : ''}.
Identify every deadline, signature requirement, and friction hotspot that could cause a missed deadline or failed close.

Transaction data:
${dealContext}

Return a JSON object with:
- terms_summary: plain-English summary of key terms (price, contingency lengths, financing type, special clauses)
- extracted_deadlines: every deadline found (label, date, responsible_party, days_from_acceptance)
- signature_requirements: parties who must sign and by when (status: pending/signed/missing/unknown)
- friction_hotspots: proactive risks (tight_deadline, missing_signature, contingency_gap, lending_risk, title_risk, ambiguous_term, unusual_clause, other) with severity (low/medium/high/critical), description, related_deadline, and recommended_action

Be specific and actionable. Flag tight deadlines and any gaps between contingencies.`;

    const llmRes = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: docUrls.length > 0 ? docUrls : undefined,
      response_json_schema: schema,
    });

    const result = llmRes?.data || llmRes || {};

    // Compute friction score (0-100)
    const hotspots = Array.isArray(result.friction_hotspots) ? result.friction_hotspots : [];
    const severityWeight = { low: 1, medium: 3, high: 7, critical: 12 };
    const raw = hotspots.reduce((s, h) => s + (severityWeight[h.severity] || 1), 0);
    const hotspotScore = Math.min(100, raw * 3);

    await base44.asServiceRole.entities.TransactionDocAnalysis.update(analysisId, {
      terms_summary: result.terms_summary || '',
      extracted_deadlines: result.extracted_deadlines || [],
      signature_requirements: result.signature_requirements || [],
      friction_hotspots: hotspots,
      hotspot_score: hotspotScore,
      analyzed_at: new Date().toISOString(),
      status: 'analyzed',
    });

    // Spawn EscrowMilestone internal alerts for high/critical hotspots
    const alertMilestoneIds = [];
    const deadlines = result.extracted_deadlines || [];
    for (const h of hotspots.filter(h => h.severity === 'high' || h.severity === 'critical')) {
      const related = deadlines.find(d => d.label === h.related_deadline);
      const dueDate = related?.date || deal.closing_date || new Date().toISOString().slice(0, 10);
      try {
        const saved = await base44.asServiceRole.entities.EscrowMilestone.create({
          brokerage_id: brokerageId,
          escrow_number: escrowNumber,
          property_address: propertyAddress,
          milestone_type: 'other',
          milestone_name: `FRICTION: ${String(h.hotspot_type || 'audit_flag').replace(/_/g, ' ')}`,
          due_date: typeof dueDate === 'string' ? dueDate.slice(0, 10) : new Date(dueDate).toISOString().slice(0, 10),
          responsible_party: 'client_action',
          description: h.description || 'Friction hotspot flagged by document audit',
          status: 'at_risk',
          alert_tier: 'internal',
          alert_status: 'raised',
          extracted_from: 'doc_audit_llm',
          notes: h.recommended_action || '',
          days_until_due: computeDaysUntil(dueDate),
        });
        if (saved?.id) alertMilestoneIds.push(saved.id);
      } catch { /* best-effort */ }
    }

    if (alertMilestoneIds.length > 0) {
      await base44.asServiceRole.entities.TransactionDocAnalysis.update(analysisId, {
        alert_milestone_ids: alertMilestoneIds,
      });
    }
  } catch (error) {
    try {
      await base44.asServiceRole.entities.TransactionDocAnalysis.update(analysisId, {
        status: 'failed',
        error_message: error?.message || 'Unknown analysis error',
      });
    } catch { /* best-effort */ }
  }
}