/**
 * Shared helpers for the three BoldTrail integration paths
 * (Direct API / Gmail parsing / API Nation webhooks).
 * Used by boldtrailSyncEscrow, gmailEscrowSync, and apiNationWebhook.
 */

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
export function mapDealToMilestones(deal, client_id) {
  const milestones = [];
  const base = {
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
 * Map an API Nation webhook payload (transaction event) to a single milestone.
 * API Nation payloads vary; we extract what we can defensively.
 */
export function mapWebhookEventToMilestone(event, client_id) {
  const tx = event.transaction || event.deal || event.data || event;
  const milestone_type = normalizeMilestoneType(event.event_type || event.milestone || tx.milestone_type);
  return {
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