import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * complianceReviewDocument
 *
 * Runs an AI compliance review on an uploaded ComplianceDocument.
 * Reads the document file directly (PDF/image), then produces a condensed
 * summary, compliance opinion, risk level, red flags, missing items and key dates.
 *
 * Body: { documentId: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { documentId } = await req.json().catch(() => ({}));
    if (!documentId) {
      return Response.json({ error: 'documentId is required' }, { status: 400 });
    }

    const docs = await base44.asServiceRole.entities.ComplianceDocument.filter({ id: documentId });
    const doc = docs?.[0];
    if (!doc) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    await base44.asServiceRole.entities.ComplianceDocument.update(documentId, { status: 'reviewing' });

    try {
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a senior real estate compliance officer reviewing a document for a California real estate brokerage (Dyson & Dyson, DRE #02303118).

The attached document may be a DRE form, a California Association of Realtors (C.A.R.) form, a disclosure (TDS, SPQ, AVID, NHD, lead paint, etc.), a purchase agreement, listing agreement, buyer representation agreement, or a title/escrow document (prelim title report, escrow instructions, closing statement).

Document source category (per uploader): ${doc.source || 'unknown'}
File name: ${doc.file_name}

Review the document thoroughly and provide:
1. document_type — identify the exact document type/form name if recognizable.
2. summary — a condensed plain-English summary (3-6 sentences) of what the document is and what it covers.
3. opinion — your professional compliance opinion: is it complete, properly executed, and compliant? What should the brokerage do next?
4. risk_level — low / medium / high / critical based on compliance exposure.
5. red_flags — specific concerns: missing signatures or initials, blank required fields, contradictory terms, expired forms, unusual clauses, agency disclosure issues, deadline risks.
6. missing_items — anything that appears missing or incomplete (signatures, dates, addenda, required disclosures).
7. key_dates — any important dates or deadlines mentioned (contingency removal, close of escrow, expiration).

Be specific and cite what you actually see in the document. If the document is unreadable or not a real estate document, say so in the opinion and use risk_level "high".`,
        file_urls: [doc.file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            document_type: { type: 'string' },
            summary: { type: 'string' },
            opinion: { type: 'string' },
            risk_level: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            red_flags: { type: 'array', items: { type: 'string' } },
            missing_items: { type: 'array', items: { type: 'string' } },
            key_dates: { type: 'array', items: { type: 'string' } }
          },
          required: ['document_type', 'summary', 'opinion', 'risk_level']
        }
      });

      await base44.asServiceRole.entities.ComplianceDocument.update(documentId, {
        status: 'reviewed',
        document_type: result.document_type,
        ai_summary: result.summary,
        ai_opinion: result.opinion,
        risk_level: result.risk_level,
        red_flags: result.red_flags || [],
        missing_items: result.missing_items || [],
        key_dates: result.key_dates || [],
        reviewed_at: new Date().toISOString(),
        error_message: ''
      });

      return Response.json({ success: true, documentId, risk_level: result.risk_level });
    } catch (reviewError) {
      await base44.asServiceRole.entities.ComplianceDocument.update(documentId, {
        status: 'failed',
        error_message: String(reviewError.message || reviewError)
      });
      return Response.json({ error: reviewError.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});