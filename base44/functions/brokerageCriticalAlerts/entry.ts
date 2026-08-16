import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const GOLD = '#D4AF37';

const MILESTONE_ORDER = [
  'initial_deposit', 'inspection', 'inspection_contingency_release',
  'appraisal', 'loan_approval', 'homeowners_insurance',
  'release_of_contingencies', 'clear_to_close', 'closing_date',
  'funding', 'moving_date', 'utility_activation', 'final_walkthrough', 'other',
];

/**
 * Scans escrow milestones for critical items (overdue or due ≤3 days, not completed).
 * - Frontend call (logged-in user): returns that user's brokerage alerts (RLS-scoped).
 * - Automation call (no user, send_emails=true): reads all brokerages, emails each
 *   brokerage's authorized users a digest of their critical alerts.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch {}

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const sendEmails = body.send_emails === true;

    const now = new Date();
    const DAY = 1000 * 60 * 60 * 24;

    const buildAlerts = (milestones) => {
      const alerts = [];
      const byEscrow = {};
      milestones.forEach(m => {
        if (m.status === 'completed' || m.status === 'waived') return;
        if (!m.due_date) return;
        const days = Math.ceil((new Date(m.due_date) - now) / DAY);
        const isOverdue = days < 0;
        const isDueSoon = days <= 3;
        if (isOverdue || isDueSoon || m.status === 'at_risk' || m.status === 'failed') {
          const key = m.escrow_number || m.property_address || 'unknown';
          if (!byEscrow[key]) byEscrow[key] = { escrow_number: m.escrow_number, address: m.property_address, company: m.escrow_company, items: [] };
          byEscrow[key].items.push({
            milestone: m.milestone_name || m.milestone_type,
            due_date: m.due_date,
            days,
            status: m.status,
            severity: isOverdue ? 'overdue' : (m.status === 'at_risk' || m.status === 'failed' ? 'critical' : 'due_soon'),
          });
        }
      });
      Object.values(byEscrow).forEach(esc => {
        esc.items.forEach(it => alerts.push({
          escrow_number: esc.escrow_number,
          address: esc.address,
          company: esc.company,
          ...it,
        }));
      });
      return { alerts, escrowCount: Object.keys(byEscrow).length };
    };

    // ── Automation path: read all, group by brokerage, email users ──
    if (!user && sendEmails) {
      const allMilestones = await base44.asServiceRole.entities.EscrowMilestone.list('-due_date', 500);
      const result = buildAlerts(allMilestones);

      if (result.alerts.length === 0) {
        return Response.json({ ok: true, alerts: [], sent: 0, message: 'No critical alerts.' });
      }

      // Group alerts by brokerage_id
      const byBrokerage = {};
      result.alerts.forEach(a => {
        const m = allMilestones.find(x => (x.escrow_number === a.escrow_number || x.property_address === a.address) && (x.milestone_name === a.milestone || x.milestone_type === a.milestone));
        const bid = m?.brokerage_id || 'unassigned';
        if (!byBrokerage[bid]) byBrokerage[bid] = [];
        byBrokerage[bid].push(a);
      });

      // Fetch users to email
      const users = await base44.asServiceRole.entities.User.list();
      let sent = 0;
      for (const [bid, bidAlerts] of Object.entries(byBrokerage)) {
        const recipients = users.filter(u => {
          const ubid = u.brokerage_id || u.data?.brokerage_id;
          return ubid === bid || (bid === 'unassigned' && u.role === 'admin');
        }).map(u => u.email).filter(Boolean);
        if (recipients.length === 0) continue;

        const subject = `⚠️ ${bidAlerts.length} Critical Escrow Alert${bidAlerts.length !== 1 ? 's' : ''} — DysonRelo Portal`;
        const lines = bidAlerts.map(a => {
          const sev = a.severity === 'overdue' ? 'OVERDUE' : a.severity === 'critical' ? 'CRITICAL' : 'DUE SOON';
          return `• [${sev}] ${a.address || 'Escrow #' + a.escrow_number} — ${a.milestone} — due ${a.due_date} (${a.days < 0 ? Math.abs(a.days) + 'd overdue' : a.days + 'd left'})`;
        });
        const body = `Critical escrow alerts for your brokerage:\n\n${lines.join('\n')}\n\nReview now in the Broker/Agent Portal.`;
        try {
          await base44.integrations.Core.SendEmail({ to: recipients.join(','), subject, body });
          sent += recipients.length;
        } catch (e) { /* skip failed sends */ }
      }

      return Response.json({ ok: true, alerts: result.alerts, escrowCount: result.escrowCount, sent });
    }

    // ── Frontend path: user-scoped (RLS), return alerts only ──
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const milestones = await base44.entities.EscrowMilestone.list('-due_date', 500);
    const result = buildAlerts(milestones);
    return Response.json({ ok: true, alerts: result.alerts, escrowCount: result.escrowCount });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}