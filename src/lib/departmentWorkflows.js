/**
 * Visual workflow atlas for new IT / admin employees.
 * Human language first. Admin paths are the “open this page” buttons.
 * Cursor laid out the flows; the pages use the same Base44 admin look
 * as the Knowledge Library flowchart.
 */

export const WORKFLOW_DESKS = [
  {
    id: 'marketing',
    name: 'Marketing',
    short: 'Find owners and start the conversation',
    icon: '📣',
    color: '#D4AF37',
    specialist: 'Marketing Specialist',
    sidebarHint: 'First page under Marketing & Prep, PR & Media, and Creative Lab',
  },
  {
    id: 'operations',
    name: 'Operations',
    short: 'Run the move once someone is in the door',
    icon: '⚙️',
    color: '#10b981',
    specialist: 'Operations Specialist',
    sidebarHint: 'First page under Relo Management, Corporate Relo, Operations, and Charlie’s Brain',
  },
  {
    id: 'sales',
    name: 'Sales & PRN',
    short: 'Recruit partners and hand off the client',
    icon: '🤝',
    color: '#f59e0b',
    specialist: 'Sales Specialist',
    sidebarHint: 'First page under Affiliate Recruiting, Client Results, and Agent Vetting',
  },
  {
    id: 'dnn',
    name: 'DNN News',
    short: 'Write, render, and publish the daily show',
    icon: '📺',
    color: '#38bdf8',
    specialist: 'DNN News Specialist',
    sidebarHint: 'First page under DNN Intelligence',
  },
  {
    id: 'finance',
    name: 'Finance',
    short: 'Watch the money — do not rebuild the app',
    icon: '💰',
    color: '#a78bfa',
    specialist: 'Finance Specialist',
    sidebarHint: 'First page under Finance',
  },
  {
    id: 'knowledge',
    name: 'Knowledge & Pipes',
    short: 'Canon, Playbook, and Conduit — the shared files and connectors',
    icon: '📜',
    color: '#3b82f6',
    specialist: 'Canon / Playbook / Conduit',
    sidebarHint: 'Also linked from the Knowledge Library',
  },
];

export const DEPARTMENT_FLOWS = {
  marketing: {
    title: 'Marketing flow',
    audience: 'New IT · how we find listing owners and talk to them',
    story: 'Marketing does not close the house. It finds the departing seller, sends a human-sounding message, and parks replies on the board for Sales and Operations.',
    stages: [
      {
        id: 'find',
        title: 'Find listings',
        plain: 'Set a city and price. The app looks for new homes every day.',
        pages: [{ label: 'Search Listing Profiles', path: '/admin/search-profiles' }],
      },
      {
        id: 'trace',
        title: 'Find the owner',
        plain: 'Skip trace turns an address into a name and phone. Do not blast a number that opted out.',
        pages: [
          { label: 'Skip Trace', path: '/admin/skip-trace' },
          { label: 'Bulk Skip Trace', path: '/admin/bulk-skip-trace' },
        ],
      },
      {
        id: 'send',
        title: 'Send the first text',
        plain: 'Compose or schedule SMS. Day 1 goes out. STOP is honored on the same cycle.',
        pages: [
          { label: 'Compose SMS', path: '/admin/compose-sms' },
          { label: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns' },
          { label: 'Video SMS', path: '/admin/video-sms-campaign' },
        ],
      },
      {
        id: 'board',
        title: 'Watch the board',
        plain: 'Replies land on the Owner Response Board. “Yes” is a same-day handoff, not another blast.',
        pages: [
          { label: 'Owner Response Board', path: '/admin/owner-kanban' },
          { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline' },
          { label: 'Batch SMS Logs', path: '/admin/batch-sms-log' },
        ],
      },
      {
        id: 'follow',
        title: 'Follow up',
        plain: 'Day 3 and later steps follow the Follow-up SOP. No two marketing texts in 24 hours. Quiet after 8pm local.',
        pages: [
          { label: 'SMS Sequences', path: '/admin/sms-sequences' },
          { label: 'Outreach Analytics', path: '/admin/outreach-analytics' },
        ],
      },
      {
        id: 'press',
        title: 'PR & landing',
        plain: 'Press kit, pitch tracker, and new landing pages. Same brand voice as Canon. Not a second outreach machine.',
        pages: [
          { label: 'Media CRM', path: '/admin/media-crm' },
          { label: 'Press Kit', path: '/admin/press-kit' },
          { label: 'Social Launch', path: '/admin/social-launch' },
          { label: 'New Landing Page', path: '/admin/new-landing-page' },
        ],
      },
    ],
  },

  operations: {
    title: 'Operations flow',
    audience: 'New IT · how a family actually gets moved',
    story: 'Once someone is a client, Operations keeps intake, the roadmap, compliance, and flagged chats correct. Charlie talks. Humans decide the hard calls.',
    stages: [
      {
        id: 'intake',
        title: 'Intake',
        plain: 'Relocation form, Solve My Story, or Charlie chat. Need a name, destination, timeline, and opt-in before anyone is assigned.',
        pages: [
          { label: 'Relocation Intake (public)', path: '/relocation-intake' },
          { label: 'Clients', path: '/admin/clients' },
        ],
      },
      {
        id: 'plan',
        title: 'Build the plan',
        plain: 'Roadmap, city guide, schools, healthcare, utilities. Invitation-only Gemini session with Bob when it is a fit.',
        pages: [
          { label: 'Relo Management', path: '/admin/relo-management' },
          { label: 'City Guide (public)', path: '/CityGuide' },
          { label: 'Corporate / HR', path: '/admin/corporate-relo' },
        ],
      },
      {
        id: 'hygiene',
        title: 'Data hygiene',
        plain: 'Skip-trace quality, duplicate phones, and opt-outs. Bad data is an Operations problem, not a Marketing creative problem.',
        pages: [
          { label: 'Skip Trace', path: '/admin/skip-trace' },
          { label: 'Opt-Ins', path: '/admin/opt-ins' },
        ],
      },
      {
        id: 'compliance',
        title: 'Compliance',
        plain: 'Documents with fees or a DRE number need a human. AI can draft. Anchor / Guardian review. You approve.',
        pages: [{ label: 'Compliance Doc Review', path: '/admin/compliance-review' }],
      },
      {
        id: 'watch',
        title: 'Watch the desk',
        plain: 'Flagged Charlie chats, escalations, and client lists. After-hours Charlie answers; a human picks up next morning.',
        pages: [
          { label: 'Flagged Messages', path: '/admin/flagged-conversations' },
          { label: 'Charlie Escalations', path: '/admin/charlie-escalations' },
          { label: 'Charlie Scripts', path: '/admin/charlie-scripts' },
        ],
      },
    ],
  },

  sales: {
    title: 'REFERRAL AGENT RECRUITING FLOW',
    audience: 'A New AGI - IT  approach to Relocation· This is how how independent Brokerage agents become members of the national desk',
    story: 'DysonRelo.com  becomes the National Relocation Department for boutique firms in every city in all 50 states. The referring agent keeps 25%. We manage the move for a management fee paid by the receiving agent. Agreements stay clean.',
    stages: [
      {
        id: 'recruit',
        title: 'Recruit the partner',
        plain: 'Affiliate pipeline, Exodus pitch, partner benefits. We are not a franchise raid.',
        pages: [
          { label: 'Recruiting Pipeline', path: '/admin/affiliate-recruiting' },
          { label: 'Exodus Pitch', path: '/admin/exodus-pitch' },
          { label: 'Partner Benefits', path: '/admin/partner-benefits' },
        ],
      },
      {
        id: 'roster',
        title: 'Put them on the roster',
        plain: 'Master partner roster and agent subscribe. No lead is released until they are on the list.',
        pages: [
          { label: 'Master Partner Roster', path: '/admin/roster' },
          { label: 'Agent Subscribe (public)', path: '/agent-subscribe' },
        ],
      },
      {
        id: 'agree',
        title: 'Sign the paper',
        plain: 'Master Referral & Relo Management Agreement. Fee math is 25% sending / 10–15% Dyson. Do not invent percents.',
        pages: [
          { label: 'Master Agreement', path: '/admin/master-agreement' },
          { label: 'PRN Fee Agreements', path: '/admin/prn-agreements' },
        ],
      },
      {
        id: 'handoff',
        title: 'Hand off the client',
        plain: 'Lead-handoff email: story, city, timeline, special assets. Receiving agent must first-touch within 4 hours.',
        pages: [
          { label: 'Lead Handoff', path: '/admin/lead-handoff' },
          { label: 'Sending Agent Tracker', path: '/admin/sending-agents' },
        ],
      },
      {
        id: 'vet',
        title: 'Vet destination talent',
        plain: 'Buyer-side agents and lenders get a real review — license, production, personality. Client chooses from 3–5, not a dump.',
        pages: [
          { label: 'Agent Vetting', path: '/admin/dnn/agent-vetting' },
          { label: 'Lender Vetting', path: '/admin/dnn/lender-vetting' },
          { label: 'Referrals', path: '/admin/referrals' },
        ],
      },
    ],
  },

  dnn: {
    title: 'DNN News flow',
    audience: 'New IT · how a show goes from idea to air',
    story: 'Charlie anchors. Bob is the guest. n8n and HeyGen render in the background — we never sit and wait on a spinning wheel. Voice is the 1927 Parallel, not clickbait.',
    stages: [
      {
        id: 'write',
        title: 'Write the brief',
        plain: 'Daily articles and morning scripts. Edit in Script Studio. Nothing renders until a human approves.',
        what: 'Generate the daily news articles and morning broadcast scripts',
        why: 'Nothing renders until a human approves the script — this is the editorial gate',
        who: 'DNN News Specialist + human editor',
        when: 'Every morning before render',
        where: 'Script Studio / News Feed',
        export_target: {
          function: 'dnnPipelinePull',
          entity: 'DnnArticle',
          input_hint: 'Optional: topics or headlines to focus this pull…',
          default_payload: {},
        },
        pages: [
          { label: 'News Feed (staging)', path: '/admin/dnn/news-feed' },
          { label: 'Script Studio', path: '/admin/dnn/script-studio' },
          { label: 'Script Review', path: '/admin/dnn/script-review' },
          { label: 'Daily News Library', path: '/admin/dnn/daily-library' },
        ],
      },
      {
        id: 'render',
        title: 'Render the show',
        plain: 'Studio sends one HeyGen job. When the video is done, a webhook comes back. Do not hold the page open waiting.',
        what: 'Dispatch the HeyGen video render for the daily broadcast',
        why: 'One dispatch = one stitched MP4. The webhook calls back — never hold the page open',
        who: 'DNN News Specialist + n8n + HeyGen',
        when: 'After script approval, every morning',
        where: 'DNN Studio / Show Pipeline',
        export_target: {
          function: 'dnnDailyVideoPipeline',
          entity: 'DnnBroadcast',
          input_hint: 'Optional: override topics for this show…',
          default_payload: {},
        },
        pages: [
          { label: 'DNN Studio', path: '/admin/dnn/studio' },
          { label: 'Show Pipeline', path: '/admin/dnn/show-pipeline' },
          { label: 'Video Preview', path: '/admin/dnn/video-preview' },
        ],
      },
      {
        id: 'publish',
        title: 'Publish',
        plain: 'Ready shows go to social, SMS, and email. Failures alert the desk — check the fail path before you re-blast.',
        what: 'Distribute the completed broadcast to social, SMS, and email',
        why: 'Failures alert the desk — check the fail path before you re-blast',
        who: 'DNN News Specialist + n8n distribution',
        when: 'After render completes and compositing is done',
        where: 'Communications Hub / Show Performance',
        export_target: {
          function: 'dnnTriggerDistribution',
          entity: 'DnnBroadcast',
          input_hint: 'Optional: broadcast ID to distribute (leave blank for latest ready)…',
          default_payload: {},
        },
        pages: [
          { label: 'Communications Hub', path: '/admin/dnn/communications' },
          { label: 'Show Performance', path: '/admin/dnn/show-performance' },
        ],
      },
      {
        id: 'audience',
        title: 'Audience & bureau',
        plain: 'Subscribers, agent bureau, recruiting broadcast. DNN is also how partners see the brand.',
        pages: [
          { label: 'Subscriber CRM', path: '/admin/dnn/subscribers' },
          { label: 'Agent Bureau', path: '/admin/dnn/agent-bureau' },
          { label: 'Recruiting Broadcast', path: '/admin/dnn/recruiting' },
          { label: 'DNN News (public)', path: '/dnn-news' },
        ],
      },
    ],
  },

  finance: {
    title: 'Finance flow',
    audience: 'New IT · money is advisory unless Bob says “change the app”',
    story: 'Finance reads dashboards and explains fees. It does not redesign Marketing or DNN. If someone asks to “fix the fee,” confirm they mean the number on the page — then keep the diff tiny.',
    stages: [
      {
        id: 'fees',
        title: 'Know the fees',
        plain: '25% to the sending/PRN partner. 10–15% Dyson relo management. Sometimes framed as 35% total. Zero to the family.',
        pages: [
          { label: 'Master Agreement', path: '/admin/master-agreement' },
          { label: 'Business Plan', path: '/admin/business-plan' },
        ],
      },
      {
        id: 'revenue',
        title: 'Read revenue',
        plain: 'Featured-agent and bureau revenue. Look, don’t rebuild.',
        pages: [{ label: 'DNN Revenue', path: '/admin/dnn/revenue' }],
      },
      {
        id: 'cost',
        title: 'Read production cost',
        plain: 'HeyGen credits and production spend. A zero balance is an Operations/DNN problem to pause renders — not a redesign.',
        pages: [
          { label: 'Production Cost', path: '/admin/production-dashboard' },
          { label: 'HeyGen Credits', path: '/admin/heygen-credits' },
        ],
      },
    ],
  },

  knowledge: {
    title: 'Knowledge & pipes flow',
    audience: 'New IT · the three desks that are not departments',
    story: 'Canon writes who we are. Playbook writes how we work. Conduit keeps Gmail, Drive, and webhooks plugged in. Departments execute.',
    stages: [
      {
        id: 'canon',
        title: 'Canon',
        plain: 'CURSOR.md, brand voice, customer profiles, service catalog, company history. Nobody invents a new fee or Bob story here.',
        pages: [
          { label: 'Library Specialists', path: '/admin/library-specialists' },
          { label: 'Knowledge Library', path: '/admin/claude-flow' },
        ],
      },
      {
        id: 'playbook',
        title: 'Playbook',
        plain: 'Five SOPs: leads, property research, client comms, documents, follow-up. Sales/Ops/Marketing run them.',
        pages: [{ label: 'Knowledge Library → SOPs', path: '/admin/claude-flow' }],
      },
      {
        id: 'conduit',
        title: 'Conduit',
        plain: 'Gmail, Drive, Slack (not live yet), Calendar (not live yet), CRM entities, n8n, Grok/Cursor webhook.',
        pages: [
          { label: 'Connect AI Assistant', path: '/connect' },
          { label: 'Knowledge Library → Integrations', path: '/admin/claude-flow' },
        ],
      },
    ],
  },
};

export const MASTER_JOURNEYS = [
  {
    id: 'family',
    title: 'The family',
    color: '#10b981',
    steps: [
      { label: 'Finds us', via: 'Charlie / intake / sending agent' },
      { label: 'Tells the story', via: 'Solve My Story · Gemini live' },
      { label: 'Gets a plan', via: 'Operations · city guide' },
      { label: 'Meets 3–5 agents', via: 'Sales · Nexus' },
      { label: 'Moves', via: 'Dispatch · escrow watch' },
    ],
  },
  {
    id: 'owner',
    title: 'The departing owner',
    color: '#D4AF37',
    steps: [
      { label: 'Listing found', via: 'Marketing search' },
      { label: 'Skip traced', via: 'Operations hygiene' },
      { label: 'First text', via: 'Marketing SMS' },
      { label: 'Says yes', via: 'Owner board' },
      { label: 'Becomes a family file', via: 'Operations intake' },
    ],
  },
  {
    id: 'partner',
    title: 'The PRN partner',
    color: '#f59e0b',
    steps: [
      { label: 'Hears the pitch', via: 'Exodus / benefits' },
      { label: 'Joins the roster', via: 'Sales' },
      { label: 'Signs the agreement', via: '25% protected' },
      { label: 'Gets a handoff', via: '4-hour first touch' },
      { label: 'Closes · we manage the move', via: 'Operations' },
    ],
  },
  {
    id: 'show',
    title: 'The daily show',
    color: '#38bdf8',
    steps: [
      { label: 'Script', via: 'DNN News' },
      { label: 'Human approve', via: 'Script review' },
      { label: 'HeyGen render', via: 'webhook, not a wait' },
      { label: 'Publish', via: 'social · SMS · email' },
      { label: 'Measure', via: 'show performance' },
    ],
  },
];

export function getDesk(id) {
  return WORKFLOW_DESKS.find((d) => d.id === id) || null;
}

export function getFlow(id) {
  return DEPARTMENT_FLOWS[id] || null;
}