/**
 * Shared helpers for the three BoldTrail integration paths
 * (Direct API / Gmail parsing / API Nation webhooks).
 * Used by boldtrailSyncEscrow, gmailEscrowSync, and apiNationWebhook.
 */

/**
 * Official hosts (live-probed 2026-08-17):
 * - CRM Public API V2: https://api.kvcore.com/v2/public  (Bearer JWT, /contacts)
 * - Back Office (Brokermint): https://my.brokermint.com/api/v2  (/transactions)
 * api.boldtrail.com is not the public CRM host (AWS 403).
 * /v2/deals and /v2/contacts (without /public) 404 on kvCORE.
 */
export const BOLDTRAIL_CRM_API_BASE = 'https://api.kvcore.com/v2/public';
export const BOLDTRAIL_BACKOFFICE_API_BASE = 'https://my.brokermint.com/api/v2';
/** @deprecated use BOLDTRAIL_CRM_API_BASE or BOLDTRAIL_BACKOFFICE_API_BASE */
export const BOLDTRAIL_OFFICIAL_API_BASE = BOLDTRAIL_BACKOFFICE_API_BASE;

const UNSET_SECRET = /^(undefined|null|none|n\/a|-|empty|tbd)$/i;

/**
 * Resolve BOLDTRAIL_API_BASE_URL.
 * Empty / placeholder / scheme-less / api.boldtrail.com fall back to
 * BoldTrail Back Office (Wisdom escrow source). kvCORE aliases normalize
 * to /v2/public so /contacts is a real path.
 */
export function resolveBoldtrailApiBase(raw) {
  const trimmed = String(raw ?? '').trim();
  const configured = Boolean(trimmed) && !UNSET_SECRET.test(trimmed);

  if (!configured) {
    return {
      baseUrl: BOLDTRAIL_BACKOFFICE_API_BASE,
      source: 'default',
      configured: false,
      invalid: false,
      flavor: 'backoffice',
    };
  }

  let candidate = trimmed.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(candidate)) {
    if (/^(api\.(kvcore|boldtrail)\.com|my\.brokermint\.com)(\/|$)/i.test(candidate)) {
      candidate = `https://${candidate}`;
    } else {
      return {
        baseUrl: BOLDTRAIL_BACKOFFICE_API_BASE,
        source: 'default_after_invalid',
        configured: true,
        invalid: true,
        flavor: 'backoffice',
      };
    }
  }

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();
    if (host === 'api.boldtrail.com' || host === 'api.kvcore.com') {
      return {
        baseUrl: BOLDTRAIL_CRM_API_BASE,
        source: host === 'api.boldtrail.com' ? 'normalized_alias' : 'secret',
        configured: true,
        invalid: false,
        flavor: 'crm',
      };
    }
    if (host === 'my.brokermint.com' || host.endsWith('.brokermint.com')) {
      const path = (parsed.pathname || '/').replace(/\/+$/, '') || '/api/v2';
      const withApi = /\/api\/v2(\/|$)/i.test(path) ? path : `${path}/api/v2`;
      return {
        baseUrl: `https://my.brokermint.com${withApi}`.replace(/\/+$/, ''),
        source: 'secret',
        configured: true,
        invalid: false,
        flavor: 'backoffice',
      };
    }
    return {
      baseUrl: candidate,
      source: 'secret',
      configured: true,
      invalid: false,
      flavor: 'custom',
    };
  } catch {
    return {
      baseUrl: BOLDTRAIL_BACKOFFICE_API_BASE,
      source: 'default_after_invalid',
      configured: true,
      invalid: true,
      flavor: 'backoffice',
    };
  }
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

/**
 * GET a BoldTrail/Brokermint collection. Tries Bearer, then api_key query
 * (Brokermint classic). Returns { ok, status, items, usedUrl, auth }.
 */
export async function boldtrailGetCollection(baseUrl, token, path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const attempts = [
    { url: `${baseUrl}${cleanPath}`, auth: 'bearer' },
    { url: `${baseUrl}${cleanPath}${cleanPath.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(token)}`, auth: 'api_key' },
  ];
  let last = { ok: false, status: 0, items: [], usedUrl: attempts[0].url, auth: 'bearer', detail: '' };
  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, { headers: authHeaders(token) });
      const text = await res.text();
      let body = null;
      try { body = JSON.parse(text); } catch { /* not JSON */ }
      const items = Array.isArray(body)
        ? body
        : (body?.data || body?.deals || body?.transactions || body?.contacts || []);
      last = {
        ok: res.ok,
        status: res.status,
        items: Array.isArray(items) ? items : [],
        usedUrl: attempt.url.replace(encodeURIComponent(token), 'REDACTED'),
        auth: attempt.auth,
        detail: res.ok ? '' : (typeof body?.error === 'string' ? body.error : (body?.errors?.[0] || text.slice(0, 180))),
      };
      if (res.ok) return last;
      if (res.status !== 401 && res.status !== 403) return last;
    } catch (error) {
      last = { ok: false, status: 0, items: [], usedUrl: attempt.url, auth: attempt.auth, detail: error?.message || 'Network error' };
    }
  }
  return last;
}

/**
 * Pull escrow/transaction rows. Back Office uses /transactions; the CRM
 * public API has no /deals path (404). We try both on the configured host,
 * then the other official host, so a wrong secret URL still connects.
 */
export async function fetchBoldtrailTransactions(baseUrl, token, flavor) {
  const primaryPaths = flavor === 'crm' ? ['/deals', '/transactions'] : ['/transactions', '/deals'];
  const hosts = [baseUrl];
  if (baseUrl !== BOLDTRAIL_BACKOFFICE_API_BASE) hosts.push(BOLDTRAIL_BACKOFFICE_API_BASE);
  if (baseUrl !== BOLDTRAIL_CRM_API_BASE) hosts.push(BOLDTRAIL_CRM_API_BASE);

  const attempts = [];
  for (const host of hosts) {
    const paths = host === BOLDTRAIL_CRM_API_BASE ? ['/deals', '/contacts'] : primaryPaths;
    for (const path of paths) {
      const result = await boldtrailGetCollection(host, token, path);
      attempts.push({ host, path, status: result.status, ok: result.ok, auth: result.auth, detail: result.detail });
      if (result.ok && path !== '/contacts') {
        return { ...result, host, path, attempts };
      }
    }
  }
  return { ok: false, status: attempts[0]?.status || 0, items: [], host: baseUrl, path: '/transactions', attempts, detail: attempts.map(a => `${a.host}${a.path} ${a.status}`).join('; ') };
}

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
function dealAddress(deal) {
  const parts = [deal.property_address || deal.address, deal.city, deal.state, deal.zip || deal.zipcode]
    .filter(Boolean);
  if (deal.property_address) return deal.property_address;
  if (deal.address && (deal.city || deal.state)) return parts.join(', ');
  return deal.address || deal.transactionName || '';
}

export function mapDealToMilestones(deal, client_id, brokerage_id) {
  const milestones = [];
  const base = {
    brokerage_id: brokerage_id || null,
    client_id: client_id || "boldtrail_import",
    property_address: dealAddress(deal),
    escrow_company: deal.escrow_company || deal.title_company || deal.escrowCompany || "BoldTrail",
    escrow_number: String(deal.id || deal.transaction_id || deal.escrow_number || deal.externalId || ''),
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

  pushIf(deal.inspection_date || deal.homeInspectionDate, "inspection", "Inspection", "inspector", "Property inspection scheduled");
  pushIf(deal.inspection_contingency_date, "inspection_contingency_release", "Inspection Contingency Release", "buyer", "Inspection contingency deadline");
  pushIf(deal.appraisal_date, "appraisal", "Appraisal", "appraiser", "Property appraisal");
  pushIf(deal.loan_approval_date, "loan_approval", "Loan Approval", "lender", "Loan approval / clear to close");
  pushIf(deal.contingency_release_date, "release_of_contingencies", "Release of Contingencies", "buyer", "All contingencies released");
  pushIf(deal.clear_to_close_date, "clear_to_close", "Clear to Close", "lender", "Lender clear to close issued");
  pushIf(deal.closing_date || deal.expected_close_date || deal.closingDate, "closing_date", "Closing Date", "escrow_company", "Scheduled closing date");
  pushIf(deal.funding_date || deal.closedAt, "funding", "Funding", "escrow_company", "Loan funding");
  return milestones;
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