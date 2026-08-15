import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * grokLibrarySeedCatalog — admin-only.
 * Creates ClaudeNode records for the Canon / Playbook / Conduit catalog.
 * Matches on title and never overwrites an existing node.
 *
 * Payload: { nodes?: Array<{ title, summary, section, content, is_priority, node_order }> }
 * When nodes is omitted, seeds the built-in fallback list (titles + summaries only).
 */

const FALLBACK_NODES = [
  { title: 'CURSOR.md', summary: 'Master context file — priority reference for all agent interactions', section: 'agent_context', is_priority: true, node_order: 10 },
  { title: 'Brand Voice & Philosophy', summary: 'DysonRelo brand personality, tone of voice, and communication philosophy', section: 'agent_context', is_priority: true, node_order: 20 },
  { title: 'Ideal Customer Profiles', summary: 'Target customer personas, demographics, and relocation journey profiles', section: 'agent_context', is_priority: false, node_order: 30 },
  { title: 'Service Catalog', summary: 'Full catalog of DysonRelo services, packages, and offerings', section: 'agent_context', is_priority: false, node_order: 40 },
  { title: 'Company History & Background', summary: 'DysonRelo company story, founding, milestones, and business background', section: 'agent_context', is_priority: false, node_order: 50 },
  { title: 'Lead Management SOP', summary: 'End-to-end lead management: intake, qualification, assignment, and follow-up', section: 'skills_sops', is_priority: true, node_order: 10 },
  { title: 'Property Research SOP', summary: 'Property search, analysis, comparison, and recommendation procedures', section: 'skills_sops', is_priority: false, node_order: 20 },
  { title: 'Client Communication SOP', summary: 'Client communication standards, response times, and messaging guidelines', section: 'skills_sops', is_priority: false, node_order: 30 },
  { title: 'Document Preparation SOP', summary: 'Document creation, review, approval, and delivery procedures', section: 'skills_sops', is_priority: false, node_order: 40 },
  { title: 'Follow-up Automation SOP', summary: 'Automated follow-up sequences, timing, and escalation rules', section: 'skills_sops', is_priority: false, node_order: 50 },
  { title: 'Gmail Integration', summary: 'Gmail connector setup, email sending, and inbox monitoring configuration', section: 'tools_integrations', is_priority: true, node_order: 10 },
  { title: 'Google Drive Sync', summary: 'Google Drive file management, sync rules, and folder structure', section: 'tools_integrations', is_priority: false, node_order: 20 },
  { title: 'Slack Notifications', summary: 'Slack integration for team alerts, pipeline notifications, and channel routing', section: 'tools_integrations', is_priority: false, node_order: 30 },
  { title: 'Calendar Management', summary: 'Google Calendar integration for scheduling, availability, and reminders', section: 'tools_integrations', is_priority: false, node_order: 40 },
  { title: 'CRM Connections', summary: 'CRM integration setup, data sync, and contact management workflows', section: 'tools_integrations', is_priority: false, node_order: 50 },
];

const VALID_SECTIONS = new Set(['departments', 'agent_context', 'skills_sops', 'tools_integrations']);

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const incoming = Array.isArray(body.nodes) && body.nodes.length > 0 ? body.nodes : FALLBACK_NODES;

    const existing = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);
    const byTitle = new Map((existing || []).map((n) => [n.title, n]));

    let created = 0;
    let skipped = 0;
    const createdIds = [];

    for (const raw of incoming) {
      const title = String(raw?.title || '').trim();
      if (!title) continue;
      if (byTitle.has(title)) {
        skipped++;
        continue;
      }
      const section = VALID_SECTIONS.has(raw.section) ? raw.section : 'agent_context';
      const node = await base44.asServiceRole.entities.ClaudeNode.create({
        title,
        summary: String(raw.summary || ''),
        section,
        content: String(raw.content || raw.summary || ''),
        is_priority: !!raw.is_priority,
        node_order: Number(raw.node_order) || 0,
      });
      byTitle.set(title, node);
      createdIds.push(node.id);
      created++;
    }

    return Response.json({
      status: 'ok',
      created,
      skipped,
      created_ids: createdIds,
      catalog_size: incoming.length,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}