/**
 * AI Library Specialists — Canon, Playbook, Conduit.
 *
 * Cross-cutting desks for the three non-department Agent Library sections.
 * Departmental desks (Marketing, Operations, Sales, DNN News, Finance) execute.
 * These three own the source-of-truth documents and connectors.
 */

export const LIBRARY_COORDINATOR_NOTE = {
  title: 'How this sits next to departmental specialists',
  body: 'Marketing, Operations, Sales, DNN News, and Finance remain the build desks. Canon, Playbook, and Conduit keep the Knowledge Library and pipes those desks consume. Do not create a new specialist for a single SOP or a single connector.',
};

export const LIBRARY_SPECIALISTS = [
  {
    id: 'canon',
    name: 'Canon Specialist',
    shortName: 'Canon',
    department: 'AI Agent Intelligence',
    section: 'agent_context',
    icon: '📜',
    color: '#3b82f6',
    platform: 'Cursor + Grok drafts',
    scope: 'dysonrelo',
    oneLiner: 'Master files, brand voice, customer profiles, service catalog, and company history.',
    howToAsk: 'Say “Canon Specialist: …” in Cursor, or drop a brief with Department: Canon.',
    grokDoes: 'Voice samples, ICP one-pagers, history timelines.',
    cursorDoes: 'CURSOR.md, corporateProfile facts, and agent_context library nodes.',
    adminPaths: ['/admin/claude-flow', '/admin/library-specialists', '/admin/business-plan'],
    owns: [
      'CURSOR.md — priority master context',
      'Brand Voice & Philosophy',
      'Ideal Customer Profiles',
      'Service Catalog',
      'Company History & Background',
    ],
    doesNotOwn: [
      'Campaign production (Marketing)',
      'SOP step lists (Playbook)',
      'Connector credentials (Conduit)',
    ],
    consumeAssistants: ['Charlie', 'Lens', 'Curator', 'Sentinel'],
  },
  {
    id: 'playbook',
    name: 'Playbook Specialist',
    shortName: 'Playbook',
    department: 'Skills & SOPs',
    section: 'skills_sops',
    icon: '📖',
    color: '#10b981',
    platform: 'Cursor + Grok checklists',
    scope: 'dysonrelo',
    oneLiner: 'Writes the five operating procedures. Sales, Operations, and Marketing run them.',
    howToAsk: 'Say “Playbook Specialist: …” in Cursor, or drop a brief with Department: Playbook.',
    grokDoes: 'Checklists, SLA drafts, sequence outlines.',
    cursorDoes: 'SOP library nodes and any SLA that is hardcoded in UI or functions.',
    adminPaths: [
      '/admin/claude-flow',
      '/admin/lead-handoff',
      '/admin/sms-sequences',
      '/admin/compliance-review',
    ],
    owns: [
      'Lead Management SOP',
      'Property Research SOP',
      'Client Communication SOP',
      'Document Preparation SOP',
      'Follow-up Automation SOP',
    ],
    doesNotOwn: [
      'Owner SMS blast mechanics (Marketing)',
      'Skip-trace import (Operations)',
      'PRN legal text (Sales)',
    ],
    consumeAssistants: ['Scout', 'Nexus', 'Pulse', 'Relay', 'Composer', 'Anchor'],
  },
  {
    id: 'conduit',
    name: 'Conduit Specialist',
    shortName: 'Conduit',
    department: 'Integrations & Webhooks',
    section: 'tools_integrations',
    icon: '🔌',
    color: '#8b5cf6',
    platform: 'Cursor + Grok diagrams',
    scope: 'dysonrelo',
    oneLiner: 'Gmail, Drive, Slack, Calendar, CRM, n8n, and Grok/Cursor webhooks.',
    howToAsk: 'Say “Conduit Specialist: …” in Cursor, or drop a brief with Department: Conduit.',
    grokDoes: 'Webhook diagrams and sequence maps. Never paste secrets.',
    cursorDoes: 'Connectors, Drive folder tree, webhook functions, Connect page.',
    adminPaths: ['/admin/claude-flow', '/connect', '/admin/dnn/show-pipeline'],
    owns: [
      'Gmail Integration',
      'Google Drive Sync',
      'Slack Notifications',
      'Calendar Management',
      'CRM Connections',
      'n8n and Grok webhook contracts',
    ],
    doesNotOwn: [
      'Email copy (Marketing / Canon)',
      'DNN editorial (DNN News)',
      'Which CRM fields Sales uses (Sales / Playbook)',
    ],
    consumeAssistants: ['Emissary', 'Signal', 'Conductor', 'Herald', 'Scout'],
  },
];

export const LIBRARY_SECTIONS = [
  {
    key: 'agent_context',
    label: 'AI Agent Intelligence',
    specialistId: 'canon',
    description: 'Master files, brand voice, customer profiles & company knowledge',
    color: '#3b82f6',
  },
  {
    key: 'skills_sops',
    label: 'Skills and Standard Operating Procedures',
    specialistId: 'playbook',
    description: 'Standard operating procedures & skill definitions',
    color: '#10b981',
  },
  {
    key: 'tools_integrations',
    label: 'Integrations, Work Flows & N8N OR GROK WebHooks',
    specialistId: 'conduit',
    description: 'Gmail, Drive, Slack, Calendar, CRM, n8n & Grok connections',
    color: '#8b5cf6',
  },
];
