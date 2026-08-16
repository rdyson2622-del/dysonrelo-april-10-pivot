import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * monitorAgentDeadlines — Real-time human-accountability monitor.
 *
 * Runs on a schedule (every 15 minutes via automation). Scans all active
 * relocation clients and their escrow/transaction milestones for deadline
 * breaches and human-side delays. Creates flagged SubscriberRoadmap records
 * so the consumer's Master Show Sheet catches agent/closing/marketing
 * bottlenecks the moment they happen — not after.
 *
 * The bottleneck in a real estate move is rarely the automation. It's the
 * humans in the chain: the selected agent who misses first-touch, the closer
 * who drags past contract dates, the marketing that stalls. This monitor
 * catches those in real time and flags them on the consumer's roadmap.
 *
 * Flag types (all flag_source = 'human_accountability'):
 *   - Agent First Touch Overdue: agent selected but no progress within 4 hours
 *   - Buyer Broker Agreement Unsigned: 3+ days after agent selection, still unsigned
 *   - Escrow Deadline At Risk: target close within 7 days, status not under contract
 *   - Move Date Passed: move date has passed, status not moved/closed
 *   - Escrow Milestone Overdue: EscrowMilestone past due_date, not completed
 *   - Transaction Milestone Overdue: TransactionMilestone past deadline, not completed
 *
 * Dedup: checks for existing active flags with same subscriber_id + title
 * before creating. Updates the flag_reason with fresh elapsed time if it exists.
 */

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const flagsCreated: string[] = [];
    const flagsUpdated: string[] = [];

    // ── 1. Load all active relocation clients ──
    const clients = await base44.asServiceRole.entities.RelocationClient.list(undefined, 500);
    const activeClients = clients.filter(c =>
      c.status && !['closed', 'inactive'].includes(c.status)
    );

    // ── 2. Load existing human-accountability flags to avoid duplicates ──
    let existingFlags: any[] = [];
    try {
      existingFlags = await base44.asServiceRole.entities.SubscriberRoadmap.filter(
        { flag_source: 'human_accountability', status: 'flagged' },
        '-created_date',
        500
      );
    } catch (e) {
      // flag_source field may not be deployed yet on first run — fall back to all flagged
      existingFlags = await base44.asServiceRole.entities.SubscriberRoadmap.filter(
        { status: 'flagged' },
        '-created_date',
        500
      );
    }

    const findExistingFlag = (clientId: string, flagTitle: string) =>
      existingFlags.find(f => f.subscriber_id === clientId && f.title === flagTitle);

    const createOrUpdateFlag = async (
      clientId: string,
      clientName: string | undefined,
      title: string,
      reason: string,
      deskId: string,
      deskName: string,
      priority: string
    ) => {
      const existing = findExistingFlag(clientId, title);
      if (existing) {
        await base44.asServiceRole.entities.SubscriberRoadmap.update(existing.id, {
          flag_reason: reason,
        });
        flagsUpdated.push(title);
      } else {
        await base44.asServiceRole.entities.SubscriberRoadmap.create({
          subscriber_id: clientId,
          subscriber_name: clientName || 'Unknown',
          subscriber_type: 'relocation_client',
          title,
          desk_id: deskId,
          desk_name: deskName,
          status: 'flagged',
          flag_reason: reason,
          flag_source: 'human_accountability',
          priority,
          requested_at: now.toISOString(),
        });
        flagsCreated.push(title);
      }
    };

    // ── 3. Check each client for deadline breaches ──
    for (const client of activeClients) {
      const clientId = client.id;
      const clientName = client.full_name;

      // 3a. Agent first-touch check (agent assigned, 4+ hours elapsed, status hasn't progressed)
      if (client.agent_selected_date && client.assigned_agent) {
        const selectedAt = new Date(client.agent_selected_date);
        const elapsed = now.getTime() - selectedAt.getTime();

        if (elapsed > FOUR_HOURS_MS &&
            ['new_lead', 'in_consultation'].includes(client.status)) {
          const hoursElapsed = Math.round(elapsed / 3600000);
          const title = 'Agent First Touch Overdue';
          const reason = `${client.agent_name || 'Assigned agent'} has not first-touched ${clientName || 'client'} within 4 hours of assignment (${hoursElapsed}h elapsed). Contract expectation: 4-hour first touch.`;

          await createOrUpdateFlag(clientId, clientName, title, reason, 'sales', 'Sales & PRN', 'urgent');
        }
      }

      // 3b. Buyer broker unsigned check (3+ days after agent_selected_date)
      if (client.agent_selected_date && client.buyer_broker_signed === false) {
        const selectedAt = new Date(client.agent_selected_date);
        const elapsed = now.getTime() - selectedAt.getTime();

        if (elapsed > THREE_DAYS_MS) {
          const daysElapsed = Math.round(elapsed / 86400000);
          const title = 'Buyer Broker Agreement Unsigned';
          const reason = `${clientName || 'Client'} has not signed a buyer broker agreement ${daysElapsed} day(s) after agent selection. Contract expectation: signed within 3 days.`;

          await createOrUpdateFlag(clientId, clientName, title, reason, 'sales', 'Sales & PRN', 'high');
        }
      }

      // 3c. Escrow deadline at risk (target close within 7 days, not under_contract)
      if (client.target_close_of_escrow &&
          client.status !== 'under_contract' &&
          client.status !== 'closed') {
        const closeDate = new Date(client.target_close_of_escrow);
        const daysUntil = (closeDate.getTime() - now.getTime()) / 86400000;

        if (daysUntil < 7 && daysUntil > -30) {
          const title = 'Escrow Deadline At Risk';
          const reason = daysUntil > 0
            ? `Target close of escrow is ${Math.round(daysUntil)} day(s) away but client status is "${client.status}". Contract expectation: under contract before close.`
            : `Target close of escrow was ${Math.abs(Math.round(daysUntil))} day(s) ago but client status is "${client.status}". Deadline breached.`;

          await createOrUpdateFlag(clientId, clientName, title, reason, 'operations', 'Operations',
            daysUntil < 0 ? 'urgent' : 'high');
        }
      }

      // 3d. Move date passed (status not moved/closed)
      if (client.move_date &&
          client.status !== 'moved' &&
          client.status !== 'closed') {
        const moveDate = new Date(client.move_date);
        const daysPast = (now.getTime() - moveDate.getTime()) / 86400000;

        if (daysPast > 0) {
          const title = 'Move Date Passed';
          const reason = `Planned move date has passed ${Math.round(daysPast)} day(s) ago but client status is "${client.status}". Move may be stalled.`;

          await createOrUpdateFlag(clientId, clientName, title, reason, 'operations', 'Operations', 'urgent');
        }
      }
    }

    // ── 4. Check EscrowMilestone records for overdue milestones ──
    try {
      const milestones = await base44.asServiceRole.entities.EscrowMilestone.list(undefined, 500);
      for (const m of milestones) {
        if (m.status === 'completed' || m.status === 'waived') continue;

        const dueDate = new Date(m.due_date);
        if (dueDate < now) {
          const client = activeClients.find(c => c.id === m.client_id);
          if (!client) continue;

          const title = `Escrow Milestone Overdue: ${m.milestone_type}`;
          const reason = `${m.milestone_type} milestone was due ${m.due_date} (responsible: ${m.responsible_party || 'unassigned'}). Status: ${m.status}.`;

          await createOrUpdateFlag(m.client_id, client.full_name, title, reason,
            'operations', 'Operations', 'high');
        }
      }
    } catch (e) {
      console.log('EscrowMilestone check skipped:', e.message);
    }

    // ── 5. Check TransactionMilestone records for overdue milestones ──
    try {
      const txMilestones = await base44.asServiceRole.entities.TransactionMilestone.list(undefined, 500);
      for (const m of txMilestones) {
        if (m.status === 'completed') continue;

        if (m.deadline_date) {
          const deadline = new Date(m.deadline_date);
          if (deadline < now) {
            const client = activeClients.find(c => c.id === m.client_id);
            if (!client) continue;

            const title = `Transaction Milestone Overdue: ${m.title}`;
            const reason = `"${m.title}" (${m.category}) was due ${m.deadline_date}. Status: ${m.status}.${m.is_critical ? ' CRITICAL deadline.' : ''}`;

            await createOrUpdateFlag(m.client_id, client.full_name, title, reason,
              'operations', 'Operations', m.is_critical ? 'urgent' : 'high');
          }
        }
      }
    } catch (e) {
      console.log('TransactionMilestone check skipped:', e.message);
    }

    return Response.json({
      success: true,
      clientsScanned: activeClients.length,
      flagsCreated: flagsCreated.length,
      flagsUpdated: flagsUpdated.length,
      flagsCreated,
      flagsUpdated,
    });
  } catch (error) {
    console.error('monitorAgentDeadlines error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}