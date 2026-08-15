/**
 * AI Departmental Specialists — single source of truth.
 *
 * Used by the admin roster page and kept in sync with:
 *   specialists/*.md
 *   .cursor/rules/specialist-*.mdc
 *
 * Claude is retired as the operating team. Cursor implements Base44/GitHub.
 * Grok Bot writes briefs, copy, and visuals into briefs/from-grok/ and assets/from-grok/.
 */

export const COORDINATOR = {
  id: 'coordinator',
  name: 'Cursor Coordinator',
  shortName: 'Coordinator',
  department: 'All desks',
  icon: '🧭',
  color: '#D4AF37',
  platform: 'Cursor',
  scope: 'dysonrelo',
  oneLiner: 'Routes every request to the right specialist, implements Grok handoffs, and ships Base44/GitHub changes.',
  howToAsk: 'Open a Cursor Cloud Agent or chat and describe the job. Start with the department name when you know it.',
  owns: [
    'Reading briefs/from-grok/ and implementing them',
    'Feature branches, PRs, and Base44 publish path',
    'Routing work to Marketing, Operations, Sales, or DNN News',
  ],
  doesNotOwn: [
    'Original visuals/storyboards (Grok Bot, when the xAI account is active)',
    'Company financials — Finance is outside Base44 and has no specialist in this app',
  ],
};

export const SPECIALISTS = [
  {
    id: 'marketing',
    name: 'Marketing Specialist',
    shortName: 'Marketing',
    department: 'Marketing',
    icon: '📣',
    color: '#D4AF37',
    platform: 'Grok + Cursor',
    scope: 'dysonrelo',
    oneLiner: 'Campaigns, SMS, landing pages, social launch, and PR assets for DysonRelo.com.',
    howToAsk: 'Say “Marketing Specialist: …” in Cursor, or drop a brief with Department: Marketing.',
    grokDoes: 'Copy, campaign concepts, social scripts, mockups, storyboards.',
    cursorDoes: 'Pages, campaign entities, Twilio/SMS flows, and admin marketing tools.',
    adminPaths: [
      '/admin/marketing-campaigns',
      '/admin/outreach-pipeline',
      '/admin/social-launch',
      '/admin/target-audiences',
      '/admin/video-sms-campaign',
      '/admin/media-crm',
      '/admin/press-kit',
      '/admin/new-landing-page',
    ],
    codeGlobs: [
      'src/pages/AdminMarketingCampaigns.jsx',
      'src/pages/AdminOutreach*.jsx',
      'src/pages/AdminSocialLaunch.jsx',
      'src/pages/AdminMediaCRM.jsx',
      'src/pages/AdminPressKit.jsx',
      'src/components/admin/marketing/**',
      'base44/functions/send*SMS*/**',
      'base44/functions/createOutreachCampaign/**',
    ],
    owns: [
      'Owner outreach SMS and scheduled campaigns',
      'Landing pages and social launch',
      'PR / media CRM, pitch tracker, press kit',
      'Target audiences and campaign roadmap',
    ],
    doesNotOwn: [
      'DNN daily news scripts (DNN News Specialist)',
      'PRN referral agreements (Sales Specialist)',
    ],
  },
  {
    id: 'operations',
    name: 'Operations Specialist',
    shortName: 'Operations',
    department: 'Operations',
    icon: '⚙️',
    color: '#3b82f6',
    platform: 'Cursor',
    scope: 'dysonrelo',
    oneLiner: 'Relocation intake, compliance, flagged conversations, and day-to-day Base44 operations.',
    howToAsk: 'Say “Operations Specialist: …” in Cursor.',
    grokDoes: 'SOPs, checklists, and process briefs when a written playbook is needed.',
    cursorDoes: 'Admin ops pages, intake/relo flows, compliance review, and backend functions.',
    adminPaths: [
      '/admin/relo-management',
      '/admin/compliance-review',
      '/admin/flagged-conversations',
      '/admin/skip-trace',
      '/admin/clients',
      '/relocation-intake',
    ],
    codeGlobs: [
      'src/pages/RelocationIntake.jsx',
      'src/pages/ReloManagement.jsx',
      'src/pages/AdminReloManagement.jsx',
      'src/pages/AdminComplianceReview.jsx',
      'src/pages/AdminSkipTrace.jsx',
      'src/pages/AdminClients.jsx',
      'src/components/intake/**',
      'base44/functions/skipTrace*/**',
      'base44/functions/complianceReviewDocument/**',
    ],
    owns: [
      'Client relocation intake and roadmap',
      'Skip trace and listing-owner data hygiene',
      'Compliance document review',
      'Flagged conversations and referral ops tooling',
    ],
    doesNotOwn: [
      'DNN studio / HeyGen pipeline (DNN News Specialist)',
      'Affiliate recruiting pitches (Sales Specialist)',
    ],
  },
  {
    id: 'sales',
    name: 'Sales & PRN Specialist',
    shortName: 'Sales',
    department: 'Sales',
    icon: '🤝',
    color: '#34d399',
    platform: 'Cursor + Grok',
    scope: 'dysonrelo',
    oneLiner: 'Private Referral Network, affiliate recruiting, agreements, and partner roster.',
    howToAsk: 'Say “Sales Specialist: …” in Cursor, or drop a brief with Department: Sales.',
    grokDoes: 'Exodus / PRN pitch copy, partner benefit language, recruiting scripts.',
    cursorDoes: 'Roster, agreements, recruiting pipeline, and partner-facing pages.',
    adminPaths: [
      '/admin/affiliate-recruiting',
      '/admin/roster',
      '/admin/prn-agent-plan',
      '/admin/prn-agreements',
      '/admin/master-agreement',
      '/admin/partner-benefits',
      '/admin/exodus-pitch',
      '/admin/referrals',
    ],
    codeGlobs: [
      'src/pages/AdminRoster.jsx',
      'src/pages/AdminAffiliateRecruiting.jsx',
      'src/pages/AdminPRN*.jsx',
      'src/pages/AdminMasterAgreement.jsx',
      'src/pages/AdminPartnerBenefits.jsx',
      'src/pages/AdminExodus*.jsx',
      'src/components/agreements/**',
      'base44/functions/generateReferralAgreement/**',
      'base44/functions/findAndNotifyAgents/**',
    ],
    owns: [
      'PRN agent plan and referral fee agreements',
      'Master partner roster and sending-agent tracker',
      'Exodus outreach and partner benefits',
      'Agent / lender bureau applications that are sales-facing',
    ],
    doesNotOwn: [
      'Daily DNN broadcast production (DNN News Specialist)',
      'Owner SMS blast mechanics (Marketing Specialist)',
    ],
  },
  {
    id: 'dnn-news',
    name: 'DNN News Specialist',
    shortName: 'DNN News',
    department: 'DNN News',
    icon: '📰',
    color: '#f59e0b',
    platform: 'Grok + Cursor',
    scope: 'dysonrelo',
    oneLiner: 'DNN Intelligence Bureau — articles, morning broadcast, Charlie/Bob studio, and distribution.',
    howToAsk: 'Say “DNN News Specialist: …” in Cursor, or drop a brief with Department: DNN News.',
    grokDoes: 'Editorial voice, scripts, storyboards, thumbnails, and show concepts.',
    cursorDoes: 'Pipeline functions, studio admin, HeyGen/n8n wiring, and consumer news pages.',
    adminPaths: [
      '/dnn-news',
      '/admin/dnn/news-feed',
      '/admin/dnn/studio',
      '/admin/dnn/script-studio',
      '/admin/dnn/show-pipeline',
      '/admin/dnn/communications',
      '/admin/heygen-credits',
    ],
    codeGlobs: [
      'src/pages/Dnn*.jsx',
      'src/pages/ConsumerDnnNews.jsx',
      'src/pages/AdminShow*.jsx',
      'src/pages/AdminScriptStudio.jsx',
      'src/components/dnn/**',
      'base44/functions/dnn*/**',
      'base44/shared/DNN_PIPELINE_ARCHITECTURE.md',
    ],
    owns: [
      'Daily articles and morning broadcast',
      'Charlie / Bob scripts and HeyGen renders',
      'Subscriber CRM and communications hub',
      'Show pipeline, archive, and performance',
    ],
    doesNotOwn: [
      'Owner outreach SMS (Marketing Specialist)',
      'PRN legal agreements (Sales Specialist)',
    ],
  },
];

export const HOW_THE_TWO_APPS_WORK = {
  cursor: {
    title: 'Cursor (this app)',
    role: 'Builder and coordinator',
    does: [
      'Reads the GitHub repo and edits Base44 app code',
      'Opens pull requests; after merge, publish on Base44.com',
      'Runs as a Cloud Agent at cursor.com/agents — no xAI login required',
    ],
  },
  grok: {
    title: 'Grok Bot',
    role: 'Creative and brief writer',
    does: [
      'Writes HANDOFF.md briefs under briefs/from-grok/',
      'Drops mockups, storyboards, and MP4s under assets/from-grok/',
      'May be limited while the xAI account is suspended (especially image/video tools)',
    ],
  },
  claude: {
    title: 'Claude (retired)',
    role: 'No longer the operating team',
    does: [
      'Claude Desktop MCP remains on /connect as a legacy option only',
      'The old “Claude Agent Library” is now the Knowledge Library',
      'Do not start new departmental work in Claude',
    ],
  },
};

export function getSpecialist(id) {
  if (id === COORDINATOR.id) return COORDINATOR;
  return SPECIALISTS.find((s) => s.id === id) || null;
}
