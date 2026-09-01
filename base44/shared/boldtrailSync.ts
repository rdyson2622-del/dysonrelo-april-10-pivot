/**
 * Shared helpers for the three BoldTrail integration paths
 * (Direct API / Gmail parsing / API Nation webhooks).
 * Used by boldtrailSyncEscrow, gmailEscrowSync, and apiNationWebhook.
 */

/**
 * Resolve the default brokerage_id for sync functions.
 * Returns the first founder or active Brokerage's id.
 * When more brokerages onboard, pass brokerage_id explicitly in the payload instead.
 */
export async function resolveBrokerageId(base44, explicitId) {
  if (explicitId) return explicitId;
  const brokerages = await base44.asServiceRole.entities.Brokerage.filter(
    { status: { "$in": ["active", "trial"] } },
    "-subscribed_at",
    1
  );
  return brokerages && brokerages.length > 0 ? brokerages[0].id : null;
}

/**
 * Upsert an EscrowMilestone — match by escrow_number + milestone_type.
 * Creates if new, updates if existing. Returns the saved record.
 */
export async function upsertEscrowMilestone(base44, milestone) {
  const { escrow_number, milestone_type } = milestone;
  if (!escrow_number || !milestone_type) {
    throw new Error("upsertEscrowMilestone requires escrow_number + milestone_type");
  }
  const existing = await base44.asServiceRole.entities.EscrowMilestone.filter({
    escrow_number,
    milestone_type,
  });
  const days_until_due = computeDaysUntil(milestone.due_date);
  const payload = { ...milestone, days_until_due };
  if (existing && existing.length > 0) {
    const id = existing[0].id;
    return await base44.asServiceRole.entities.EscrowMilestone.update(id, payload);
  }
  return await base44.asServiceRole.entities.EscrowMilestone.create(payload);
}

/**
 * Compute days remaining until a due date (negative = overdue).
 */
export function computeDaysUntil(dueDate) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null;
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Map a BoldTrail Deal object (from the Deals API) to EscrowMilestone records.
 * A single deal typically yields several milestones (inspection, appraisal, close, etc.)
 * depending on which dates the deal exposes.
 */
export function mapDealToMilestones(deal, client_id, brokerage_id) {
  const milestones = [];
  const base = {
    brokerage_id: brokerage_id || null,
    client_id: client_id || "boldtrail_import",
    property_address: deal.property_address || deal.address || "",
    escrow_company: deal.escrow_company || deal.title_company || "BoldTrail",
    escrow_number: deal.id || deal.transaction_id || deal.escrow_number,
    extracted_from: "boldtrail_api",
  };

  const pushIf = (due_date, milestone_type, milestone_name, responsible_party, description) => {
    if (!due_date) return;
    milestones.push({
      ...base,
      milestone_type,
      milestone_name,
      due_date: typeof due_date === "string" ? due_date.slice(0, 10) : new Date(due_date).toISOString().slice(0, 10),
      responsible_party,
      description,
      status: "pending",
    });
  };

  pushIf(deal.inspection_date, "inspection", "Inspection", "inspector", "Property inspection scheduled");
  pushIf(deal.inspection_contingency_date, "inspection_contingency_release", "Inspection Contingency Release", "buyer", "Inspection contingency deadline");
  pushIf(deal.appraisal_date, "appraisal", "Appraisal", "appraiser", "Property appraisal");
  pushIf(deal.loan_approval_date, "loan_approval", "Loan Approval", "lender", "Loan approval / clear to close");
  pushIf(deal.contingency_release_date, "release_of_contingencies", "Release of Contingencies", "buyer", "All contingencies released");
  pushIf(deal.clear_to_close_date, "clear_to_close", "Clear to Close", "lender", "Lender clear to close issued");
  pushIf(deal.closing_date || deal.expected_close_date, "closing_date", "Closing Date", "escrow_company", "Scheduled closing date");
  pushIf(deal.funding_date, "funding", "Funding", "escrow_company", "Loan funding");
  return milestones;
}

/**
 * Confirmed working Brokermint (BoldTrail BackOffice) REST endpoint.
 * Auth is via account_id + api_key query params, not a Bearer token.
 */
export const BROKERMINT_BASE_URL = "https://my.brokermint.com/api/v2";

export function brokermintUrl(path, accountId, apiKey) {
  const url = new URL(`${BROKERMINT_BASE_URL}${path}`);
  url.searchParams.set("account_id", accountId);
  url.searchParams.set("api_key", apiKey);
  return url.toString();
}

/**
 * Runs the LLM friction/deadline audit for a single Brokermint deal and
 * persists the result onto its TransactionDocAnalysis record. Shared by the
 * manual single-escrow pull (boldtrailPullTransactionDocs) and the automatic
 * all-transactions sync (boldtrailAutoAuditAll) so both stay in lockstep.
 * Uses asServiceRole throughout so it works with or without a logged-in user
 * (scheduled automations have no user session).
 */
export async function runTransactionDocAudit(base44, analysisId, escrowNumber, propertyAddress, deal, docUrls, brokerageId) {
  try {
    const schema = {
      type: "object",
      properties: {
        terms_summary: { type: "string" },
        extracted_deadlines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              date: { type: "string", format: "date" },
              responsible_party: { type: "string" },
              days_from_acceptance: { type: "number" },
            },
          },
        },
        signature_requirements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              party: { type: "string" },
              document_section: { type: "string" },
              deadline_date: { type: "string", format: "date" },
              status: { type: "string", enum: ["pending", "signed", "missing", "unknown"] },
            },
          },
        },
        friction_hotspots: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hotspot_type: { type: "string", enum: ["tight_deadline", "missing_signature", "contingency_gap", "lending_risk", "title_risk", "ambiguous_term", "unusual_clause", "other"] },
              description: { type: "string" },
              severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
              related_deadline: { type: "string" },
              recommended_action: { type: "string" },
            },
          },
        },
      },
    };

    const dealContext = [
      `Escrow #: ${escrowNumber}`,
      `Property: ${propertyAddress || "—"}`,
      `Escrow company: ${deal.escrow_company || deal.title_company || "—"}`,
      `Acceptance date: ${deal.acceptance_date || deal.contract_date || "—"}`,
      `Closing date: ${deal.closing_date || deal.expected_close_date || "—"}`,
      `Inspection date: ${deal.inspection_date || "—"}`,
      `Inspection contingency date: ${deal.inspection_contingency_date || "—"}`,
      `Appraisal date: ${deal.appraisal_date || "—"}`,
      `Loan approval date: ${deal.loan_approval_date || "—"}`,
      `Contingency release date: ${deal.contingency_release_date || "—"}`,
      `Clear to close date: ${deal.clear_to_close_date || "—"}`,
      `Funding date: ${deal.funding_date || "—"}`,
      `Purchase price: ${deal.purchase_price || deal.price || "—"}`,
      `Financing type: ${deal.financing_type || "—"}`,
    ].join("\n");

    const prompt = `You are an expert real estate transaction auditor and managing broker reviewer.
Analyze the following escrow transaction${docUrls.length > 0 ? " and the attached documents (RPA, counters, addenda)" : ""}.
Identify every deadline, signature requirement, and friction hotspot that could cause a missed deadline or failed close.

Transaction data:
${dealContext}

Return a JSON object with:
- terms_summary: plain-English summary of key terms (price, contingency lengths, financing type, special clauses)
- extracted_deadlines: every deadline found (label, date, responsible_party, days_from_acceptance)
- signature_requirements: parties who must sign and by when (status: pending/signed/missing/unknown)
- friction_hotspots: proactive risks (tight_deadline, missing_signature, contingency_gap, lending_risk, title_risk, ambiguous_term, unusual_clause, other) with severity (low/medium/high/critical), description, related_deadline, and recommended_action

Be specific and actionable. Flag tight deadlines and any gaps between contingencies.`;

    const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: docUrls.length > 0 ? docUrls : undefined,
      response_json_schema: schema,
    });

    const result = llmRes?.data || llmRes || {};

    const hotspots = Array.isArray(result.friction_hotspots) ? result.friction_hotspots : [];
    const severityWeight = { low: 1, medium: 3, high: 7, critical: 12 };
    const raw = hotspots.reduce((s, h) => s + (severityWeight[h.severity] || 1), 0);
    const hotspotScore = Math.min(100, raw * 3);

    await base44.asServiceRole.entities.TransactionDocAnalysis.update(analysisId, {
      terms_summary: result.terms_summary || "",
      extracted_deadlines: result.extracted_deadlines || [],
      signature_requirements: result.signature_requirements || [],
      friction_hotspots: hotspots,
      hotspot_score: hotspotScore,
      analyzed_at: new Date().toISOString(),
      status: "analyzed",
    });

    const alertMilestoneIds = [];
    const deadlines = result.extracted_deadlines || [];
    for (const h of hotspots.filter(h => h.severity === "high" || h.severity === "critical")) {
      const related = deadlines.find(d => d.label === h.related_deadline);
      const dueDate = related?.date || deal.closing_date || new Date().toISOString().slice(0, 10);
      try {
        const saved = await base44.asServiceRole.entities.EscrowMilestone.create({
          brokerage_id: brokerageId,
          escrow_number: escrowNumber,
          property_address: propertyAddress,
          milestone_type: "other",
          milestone_name: `FRICTION: ${String(h.hotspot_type || "audit_flag").replace(/_/g, " ")}`,
          due_date: typeof dueDate === "string" ? dueDate.slice(0, 10) : new Date(dueDate).toISOString().slice(0, 10),
          responsible_party: "client_action",
          description: h.description || "Friction hotspot flagged by document audit",
          status: "at_risk",
          alert_tier: "internal",
          alert_status: "raised",
          extracted_from: "doc_audit_llm",
          notes: h.recommended_action || "",
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
        status: "failed",
        error_message: error?.message || "Unknown analysis error",
      });
    } catch { /* best-effort */ }
  }
}

/**
 * Map an API Nation webhook payload (transaction event) to a single milestone.
 * API Nation payloads vary; we extract what we can defensively.
 */
export function mapWebhookEventToMilestone(event, client_id, brokerage_id) {
  const tx = event.transaction || event.deal || event.data || event;
  const milestone_type = normalizeMilestoneType(event.event_type || event.milestone || tx.milestone_type);
  return {
    brokerage_id: brokerage_id || tx.brokerage_id || null,
    client_id: client_id || tx.client_id || "apination_import",
    property_address: tx.property_address || tx.address || "",
    escrow_company: tx.escrow_company || tx.title_company || "BoldTrail",
    escrow_number: tx.id || tx.transaction_id || tx.escrow_number,
    milestone_type,
    milestone_name: event.milestone_name || tx.milestone_name || event.event_type || "Update",
    due_date: (tx.due_date || tx.deadline || event.due_date || new Date().toISOString()).slice(0, 10),
    responsible_party: tx.responsible_party || "escrow_company",
    description: event.description || tx.description || `API Nation event: ${event.event_type || "update"}`,
    status: normalizeStatus(event.status || tx.status),
    extracted_from: "apination_webhook",
  };
}

function normalizeMilestoneType(raw) {
  if (!raw) return "other";
  const k = String(raw).toLowerCase().replace(/[^a-z_]/g, "");
  const known = [
    "initial_deposit", "inspection", "inspection_contingency_release",
    "appraisal", "loan_approval", "homeowners_insurance", "final_walkthrough",
    "release_of_contingencies", "clear_to_close", "closing_date",
    "funding", "moving_date", "utility_activation", "other",
  ];
  return known.includes(k) ? k : "other";
}

function normalizeStatus(raw) {
  if (!raw) return "pending";
  const k = String(raw).toLowerCase();
  if (k.includes("complete") || k.includes("done") || k.includes("closed")) return "completed";
  if (k.includes("progress") || k.includes("active")) return "in_progress";
  if (k.includes("risk") || k.includes("late") || k.includes("overdue")) return "at_risk";
  if (k.includes("waiv")) return "waived";
  if (k.includes("fail")) return "failed";
  return "pending";
}