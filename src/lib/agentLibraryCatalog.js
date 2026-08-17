/**
 * Canonical Knowledge Library nodes for the three non-department sections.
 * Used by the admin roster, the flowchart empty-state, and claudeLibrarySeedCatalog.
 *
 * Titles are stable IDs — the seed function matches on title and will not duplicate.
 */

export const AGENT_LIBRARY_CATALOG = [
  // ── AI Agent Intelligence (Canon) ──────────────────────────────────────
  {
    slug: 'cursor-md',
    title: 'CURSOR.md',
    summary: 'Master context file — priority reference for all agent interactions',
    section: 'agent_context',
    is_priority: true,
    node_order: 10,
    owner: 'canon',
    executeWith: ['All specialists (read-only)'],
    content: `# CURSOR.md — DysonRelo Master Context

Priority reference for every Cursor, Grok, and Base44 agent. Owned by Canon.

## Company
Dyson & Dyson Concierge Relocation Services is an independent relocation management company — not a brokerage, not a listing portal. Free to the buyer. Always.

- Legal: The Dyson & Dyson Companies, Inc. · CA DRE #02303118
- Sites: dysonrelo.com · 1dnn.com
- Founder: Bob Dyson — 40+ years; built Red Carpet Corporation of America to 1,600+ offices / 45,000 agents / 42 states; founded DNN

## Fees (do not freelance)
- 25% referral fee on buyer-side commission (protected for the sending/PRN partner)
- 10–15% relocation management fee, disclosed up front
- Some handoffs framed as 35% total (25% sending / 10% Dyson)
- Zero cost to the relocating family

## Voice
Warm, cinematic, specific — the “1927 Parallel.” Gold #D4AF37. Never clickbait.

## Operating team
Claude is retired. Cursor builds. Grok writes briefs.
Departmental: Marketing, Operations, Sales, DNN News, Finance.
Library: Canon (this section), Playbook (SOPs), Conduit (integrations).

Repo file: \`CURSOR.md\`. Keep this node and that file in sync.`,
  },
  {
    slug: 'brand-voice',
    title: 'Brand Voice & Philosophy',
    summary: 'DysonRelo brand personality, tone of voice, and communication philosophy',
    section: 'agent_context',
    is_priority: true,
    node_order: 20,
    owner: 'canon',
    executeWith: ['Marketing', 'DNN News', 'Charlie', 'Composer'],
    content: `# Brand Voice & Philosophy

Owned by Canon. Marketing and DNN News execute in this voice.

## Personality
A trusted counselor who has already made the flight plan. Not a startup. Not a discount desk. Bob’s 1927 Parallel: AI-powered concierge relocation is the airplane, not the novelty.

## Tone
- Warm, specific, cinematic
- Short sentences when the fact matters; longer when the story matters
- Address the family, the listing agent, or HR by name and situation
- Gold serif headlines, tan consumer surfaces, charcoal admin

## Words we use
Concierge. Managed referral. Vetted. White-glove. Free to the buyer. Destination desk. Private Referral Network. 1927 Parallel.

## Words we never use
Disrupt. Hack. Crush. Guaranteed appreciation. “AI-powered” as the whole pitch. Franchise-style relo-fee scare tactics against independents (we explain the math; we do not sneer).

## Philosophy
AI handles research, matching, documents, and 24/7 answers. Humans decide which agent, which red flag, and which advice is sound. Tagline: we use AI to work faster; the client always gets a real person who knows real estate.

## Charlie
First voice on the portal. Calm, competent, never cute. He does not invent fees or DRE numbers.

## DNN
Authoritative news bureau, not clickbait. Charlie anchors; Bob is the expert guest.`,
  },
  {
    slug: 'icps',
    title: 'Ideal Customer Profiles',
    summary: 'Target customer personas, demographics, and relocation journey profiles',
    section: 'agent_context',
    is_priority: false,
    node_order: 30,
    owner: 'canon',
    executeWith: ['Sales', 'Marketing', 'Scout', 'Lens'],
    content: `# Ideal Customer Profiles

Owned by Canon. Sales and Marketing target from this list. Scout scores against it.

## 1. Relocating family (primary consumer)
Corporate transfer or job-led move, 30–55, household income supporting a destination purchase. Needs schools, healthcare, a vetted buyer’s agent, and one throat to choke. Enters via Charlie, Solve My Story, or a sending-agent referral.

## 2. Listing owner / departing seller
Home is listed or about to list. They need a destination plan as much as a sale. Owner SMS and skip-trace outreach live here. Never pitch them a buyer-paid fee.

## 3. Boutique / independent listing agent (PRN)
No corporate relo department. They keep 25%. Dyson is their national desk. High-fit: luxury or relationship-driven firms that already sell white-glove.

## 4. Corporate HR / mobility
HR needs a managed employee move without a franchise relo contract. Dyson is the de-facto relo department. Gemini live sessions are invitation-only.

## 5. Luxury / complex household
Art, vehicles, multi-gen, medical specialists, private-school placement. Price is not the objection; competence is.

## Disqualify
Tire-kickers who will not opt in. Agents hunting a free lead with no agreement. Anyone asking us to hide fees.`,
  },
  {
    slug: 'service-catalog',
    title: 'Service Catalog',
    summary: 'Full catalog of DysonRelo services, packages, and offerings',
    section: 'agent_context',
    is_priority: false,
    node_order: 40,
    owner: 'canon',
    executeWith: ['Operations', 'Dispatch', 'Charlie'],
    content: `# Service Catalog

Owned by Canon. Operations and Dispatch deliver. Charlie describes — he does not invent packages.

## Always included (free to the buyer)
- Neighborhood and city research matched to lifestyle, commute, schools, safety
- 24/7 Charlie concierge
- Destination agent search: evaluate the field, present 3–5 vetted candidates, client chooses
- Moving logistics checklist (pack through delivery)
- Utilities and services transferred before arrival
- School district research, tours, enrollment paperwork
- Healthcare setup — doctors, dentists, specialists, insurance continuity
- Client dashboard: timeline, listings, tasks, chat, escrow status

## By invitation
- Gemini Live session — client + Gemini + Bob Dyson, real-time relocation profile
- Corporate / HR managed employee relocation

## Partner offerings (not billed to the family)
- Sending-agent / PRN managed referral
- Escrow monitoring and milestone alerts
- Lead handoff package (client story, logistics, fee terms)
- DNN Intelligence Briefs and morning broadcast (public + subscriber)

## We do not sell
Buyer-paid concierge packages. Franchise “relo fees” that raid the referring agent. Guaranteed pricing or appreciation.`,
  },
  {
    slug: 'company-history',
    title: 'Company History & Background',
    summary: 'DysonRelo company story, founding, milestones, and business background',
    section: 'agent_context',
    is_priority: false,
    node_order: 50,
    owner: 'canon',
    executeWith: ['Marketing', 'DNN News', 'Curator'],
    content: `# Company History & Background

Owned by Canon. Do not invent milestones. Source: \`src/lib/corporateProfile.js\` and the Business Plan.

## Bob Dyson
Began as a corporate jet pilot and chief pilot for the Governor of Oklahoma. Entered real estate in his twenties; 1,000+ properties acquired and managed. In 1985, after growing a 500-office franchise to 1,600+ offices and 45,000 agents across 42 states, he sold and founded Dyson & Dyson with Loraine.

## DNN
Dyson News Network founded 2006. Daily real estate news; syndication history includes Yahoo Mail and Yahoo Finance. Today: Charlie Simmons anchors; Bob is the expert guest; 1dnn.com.

## Wisdom Properties
San Diego North County, 2017–present.

## DysonRelo
Concierge relocation program: decades of destination-desk practice interfaced with Gemini, Grok, and the 21 in-product assistants. Licensed as The Dyson & Dyson Companies, Inc., CA DRE #02303118.

## What we are not
Not Red Carpet reincarnated. Not a tech company that hired a broker last year. The legacy is the vetting standard — it is not a franchise we still operate.`,
  },

  // ── Skills & SOPs (Playbook) ───────────────────────────────────────────
  {
    slug: 'lead-management-sop',
    title: 'Lead Management SOP',
    summary: 'End-to-end lead management: intake, qualification, assignment, and follow-up',
    section: 'skills_sops',
    is_priority: true,
    node_order: 10,
    owner: 'playbook',
    executeWith: ['Sales', 'Marketing', 'Scout', 'Nexus', 'Bridge'],
    content: `# Lead Management SOP

Playbook owns this document. **Sales executes** (PRN / handoff). **Marketing executes** owner SMS. Scout scores. Nexus / Bridge assign.

## 1. Intake
- Consumer: Relocation Intake, Solve My Story, Charlie chat, Gemini live
- Owner: skip trace → ListingOwner → OwnerOutreachCampaign
- Agent: affiliate recruiting, agent-subscribe, bureau application
- Required fields before assignment: name, destination city/state, timeline, phone or email, opt-in

## 2. Qualification (Scout)
Score intent, destination clarity, timeline, and ICP fit (see Ideal Customer Profiles).
Disqualify: no opt-in, STOP/opt-out, missing destination, fee-hide requests.

## 3. Assignment
- Buyer-side family → Nexus / \`findAndNotifyAgents\` → 3–5 vetted destination agents
- PRN sending agent → Sales roster + lead-handoff email (\`/admin/lead-handoff\`)
- Owner lead → Marketing sequence, not a cold agent dump

## 4. SLA
- New inbound consumer: first human or Charlie touch within 1 business hour
- PRN accepted lead: receiving agent first contact within **4 hours**
- Owner SMS reply: same calendar day

## 5. Follow-up
Hand to Follow-up Automation SOP. Do not leave a qualified lead in “new” overnight.

## Systems
\`RelocationClient\`, \`ListingOwner\`, \`ReferralHandoff\`, \`findAndNotifyAgents\`, \`createOutreachCampaign\`.`,
  },
  {
    slug: 'property-research-sop',
    title: 'Property Research SOP',
    summary: 'Property search, analysis, comparison, and recommendation procedures',
    section: 'skills_sops',
    is_priority: false,
    node_order: 20,
    owner: 'playbook',
    executeWith: ['Operations', 'Pulse', 'Radar', 'Charlie'],
    content: `# Property Research SOP

Playbook owns this document. **Operations executes.** Pulse and Radar gather. Charlie presents.

## 1. Search
Match destination city, budget, beds/baths, schools, commute, and special needs (medical, multi-gen, livestock, art).
Sources: MLS/regional, Zillow/Realtor APIs where connected, PropStream, public census/school data, Gemini web enrichment.
Functions: \`dailyPropertySearch\`, \`findPaloAltoListings\`, \`propstreamPropertyDetails\`.

## 2. Analysis
For each candidate: price vs comps, days on market, tax, school zone, distance to work/healthcare, red flags (flood, HOA, license issues).

## 3. Comparison
Use \`/PropertyComparison\` and the client dashboard. Never send a raw MLS dump. Present 3–7 properties with a one-line “why this one.”

## 4. Recommendation
Charlie or the assigned agent recommends; Bob/human reviews luxury or exception files. Do not guarantee future value.

## 5. City layer
City Guide covers neighborhoods, schools, hospitals, and urgent personal requests (pediatric oncology, faith community, etc.). Operations researches those personally when flagged.`,
  },
  {
    slug: 'client-communication-sop',
    title: 'Client Communication SOP',
    summary: 'Client communication standards, response times, and messaging guidelines',
    section: 'skills_sops',
    is_priority: false,
    node_order: 30,
    owner: 'playbook',
    executeWith: ['Sales', 'Marketing', 'Charlie', 'Composer', 'Emissary'],
    content: `# Client Communication SOP

Playbook owns this document. **Sales + Marketing execute.** Charlie is the front door. Composer drafts. Emissary watches email. Voice is Canon.

## Channels
- Charlie chat / voice / Gemini live
- SMS (Twilio) — outreach, sequences, opt-out honored immediately
- Email — Gmail connector, intake mail, owner replies
- In-app dashboard messages

## Response times
| Audience | First response | After hours |
| --- | --- | --- |
| Relocating client | 1 business hour | Charlie 24/7; human next morning |
| PRN partner | 4 hours on an accepted lead | Next business morning |
| Listing owner reply | Same day | Next morning, no new blast |
| Press / HR | 1 business day | — |

## Rules
- Honor STOP / unsubscribe on the same message cycle
- No fee language Charlie did not read from Canon
- Escalations → \`notifyEscalation\` / flagged conversations / Operations
- Luxury and medical requests: acknowledge, then research — do not guess

## Brand
Every outbound line could be read aloud by Bob. If it sounds like a growth-hack SMS, rewrite it.`,
  },
  {
    slug: 'document-preparation-sop',
    title: 'Document Preparation SOP',
    summary: 'Document creation, review, approval, and delivery procedures',
    section: 'skills_sops',
    is_priority: false,
    node_order: 40,
    owner: 'playbook',
    executeWith: ['Operations', 'Sales', 'Composer', 'Anchor', 'Guardian'],
    content: `# Document Preparation SOP

Playbook owns this document. **Operations + Sales execute.** Composer drafts. Anchor / Guardian review.

## Create
- Referral & Relo Management Agreement — \`generateReferralAgreement\`, Master Agreement page
- Listing / referral / seller templates — \`generateDocument\`, \`generateSellerTemplate\`
- Lead-handoff package — \`/admin/lead-handoff\`
- Compliance packets — \`complianceReviewDocument\`

## Review
1. Composer or function generates markdown/PDF
2. Anchor checks disclosures, DRE, fee math (25 / 10–15 / 35)
3. Sales owns PRN legal wording; Operations owns client-facing checklists
4. Human sign-off on anything that creates a fee obligation

## Approve
No document with a fee or license number ships without a human. AI-assisted disclosure stays on.

## Deliver
Client dashboard, email (Gmail), or partner portal. File a copy in Drive under the Agent Library / client folder when Conduit’s Drive sync is on.

## Never
Invent a DRE number, change fee percents, or send an unsigned “binding” PDF.`,
  },
  {
    slug: 'follow-up-automation-sop',
    title: 'Follow-up Automation SOP',
    summary: 'Automated follow-up sequences, timing, and escalation rules',
    section: 'skills_sops',
    is_priority: false,
    node_order: 50,
    owner: 'playbook',
    executeWith: ['Sales', 'Marketing', 'Relay', 'Signal'],
    content: `# Follow-up Automation SOP

Playbook owns this document. **Relay executes.** Marketing owns owner SMS creative. Sales owns PRN cadence.

## Sequences
- Owner outreach: Day 1 send → Day 3 follow-up → later sequence steps (\`AdminSMSSequences\`, \`sendDay3FollowupSMS\`, \`scheduleSMSSequence\`)
- Consumer: Charlie check-in if intake stalls; human if Gemini session is booked
- PRN: 4-hour first-touch clock after accept; escalate to Sales if silent

## Timing
Do not stack two SMS on the same owner in 24 hours unless they replied. Quiet hours: no new marketing SMS after 8pm local.

## Escalation
- STOP / opt-out → \`twilioOptOutWebhook\` / OptOut entity — halt all sequences
- Positive reply (yes, call me) → \`gmailOwnerReplyHandler\` / inbound SMS → Sales same day
- No reply after the published sequence → park, do not invent a fourth blast
- Flagged conversation → Operations

## Systems
\`sendFollowUpSMS\`, \`sendDay3FollowupSMS\`, \`scheduleSMSSequence\`, \`SMSSequenceEnrollment\`, Signal for internal alerts.`,
  },

  // ── Integrations (Conduit) ─────────────────────────────────────────────
  {
    slug: 'gmail-integration',
    title: 'Gmail Integration',
    summary: 'Gmail connector setup, email sending, and inbox monitoring configuration',
    section: 'tools_integrations',
    is_priority: true,
    node_order: 10,
    owner: 'conduit',
    executeWith: ['Emissary', 'Marketing', 'Sales'],
    content: `# Gmail Integration

Conduit owns the connector. Emissary consumes. Marketing/Sales own the copy.

## Setup
- Connector: \`base44/connectors/gmail.jsonc\`
- Scopes today: \`gmail.send\`, \`email\`
- Inbox monitoring for owner replies: \`gmailOwnerReplyHandler\` (needs read access — request additional Gmail scopes if replies are silent)

## What it does
- Sends intake and handoff mail
- Watches owner replies for YES / STOP keywords
- Pairs with Emissary (in-product email intelligence)

## Rules
- Secret names only in docs. Token lives in Base44 connectors.
- Honor STOP the same as SMS.
- Do not BCC growth lists from the founder inbox without an approved campaign.

## Related
\`sendIntakeEmail\`, \`dnnWelcomeEmail\`, \`dnnMorningEmailBlast\`, Connect page webhook is **not** Gmail — that is the Grok/Cursor API.`,
  },
  {
    slug: 'google-drive-sync',
    title: 'Google Drive Sync',
    summary: 'Google Drive file management, sync rules, and folder structure',
    section: 'tools_integrations',
    is_priority: false,
    node_order: 20,
    owner: 'conduit',
    executeWith: ['Canon', 'Sentinel'],
    content: `# Google Drive Sync

Conduit owns the pipe. Canon owns what the docs say.

## Folder tree
Root: **DysonRelo Agent Library**
- \`01_Departments\`
- \`02_Agent_Context\`
- \`03_Skills_SOPs\`
- \`04_Tools_Integrations\`

Defined in \`base44/shared/claudeLibraryDrive.ts\`.

## Functions
- \`claudeLibraryProvisionDocs\` — create one Google Doc per ClaudeNode
- \`claudeLibrarySyncDoc\` — pull Drive → Base44
- \`claudeLibraryWebhookSync\` — Drive webhook writes back to ClaudeNode
- \`claudeLibraryDirectUpdate\` — API key push from Grok/Cursor

## Rules
- Primary content lives in the Google Doc; \`content\` on ClaudeNode is the in-app copy
- Force-recreate only with \`{ force: true }\`
- Do not move the root folder by hand without updating the helper`,
  },
  {
    slug: 'slack-notifications',
    title: 'Slack Notifications',
    summary: 'Slack integration for team alerts, pipeline notifications, and channel routing',
    section: 'tools_integrations',
    is_priority: false,
    node_order: 30,
    owner: 'conduit',
    executeWith: ['Signal', 'Operations', 'DNN News'],
    content: `# Slack Notifications

Conduit owns the integration (not yet a Base44 connector). Signal is the in-product consumer.

## Intended routing
| Event | Channel idea |
| --- | --- |
| New qualified consumer lead | #sales-leads |
| Owner YES reply | #outreach |
| DNN render fail | #dnn-pipeline |
| Compliance flag | #operations |
| Grok handoff brief opened | #cursor-handoffs |

## Build notes
- Prefer incoming webhooks or a Slack connector — do not commit bot tokens
- Reuse \`notifyAdmin\`, \`notifyEscalation\`, \`dnnBroadcastFailAlert\` as the event sources
- Quiet hours follow the Follow-up Automation SOP

## Until it ships
Email + admin badges remain the alert path. Do not pretend Slack is live in client copy.`,
  },
  {
    slug: 'calendar-management',
    title: 'Calendar Management',
    summary: 'Google Calendar integration for scheduling, availability, and reminders',
    section: 'tools_integrations',
    is_priority: false,
    node_order: 40,
    owner: 'conduit',
    executeWith: ['Operations', 'Relay', 'Charlie'],
    content: `# Calendar Management

Conduit owns the connector (not yet installed). Operations / Relay consume.

## Intended use
- Gemini Live and Bob sessions (invitation-only)
- Destination agent intro calls (4-hour SLA clock starts at accept, not at calendar hold)
- Utility / school / healthcare appointments on the moving plan
- Reminders into Charlie and the client dashboard

## Build notes
- Google Calendar API via a Base44 connector, same Google Workspace as Drive/Gmail
- Write holds with the client timezone; never SMS a reminder after 8pm local
- Cancel + notify if the receiving agent misses the 4-hour first touch

## Until it ships
Manual scheduling from admin communications. Do not invent a public booking link that bypasses qualification.`,
  },
  {
    slug: 'crm-connections',
    title: 'CRM Connections',
    summary: 'CRM integration setup, data sync, and contact management workflows',
    section: 'tools_integrations',
    is_priority: false,
    node_order: 50,
    owner: 'conduit',
    executeWith: ['Sales', 'Scout', 'Nexus', 'Bridge'],
    content: `# CRM Connections

Conduit owns sync and hygiene. Sales owns the relationship. There is no Salesforce in this repo — Base44 entities **are** the CRM.

## Objects
| Entity | Purpose |
| --- | --- |
| RelocationClient | Consumer / family |
| ListingOwner | Outbound owner |
| AudienceContact / DnnSubscriber | DNN + marketing lists |
| MediaContact | Press |
| PartnerAgent / Agent / Vetted* | PRN and bureau |
| ReferralHandoff / AgentReferral | Assignment |
| OwnerOutreachCampaign | Owner pipeline |

## Rules
- Opt-in / OptOut are source of truth for messaging
- Do not duplicate a ListingOwner by phone
- Scout reads these objects; it does not create a parallel store
- External CRM (if added later) syncs **from** these entities, not the other way around

## BoldTrail (Wisdom Properties)

Conduit owns the pipe. Secret **names** only — never commit values.

| Secret | Paste this |
| --- | --- |
| \`BOLDTRAIL_API_BASE_URL\` | \`https://my.brokermint.com/api/v2\` |
| \`BOLDTRAIL_API_TOKEN\` | Back Office API key (Admin → API settings). Not a Lead Engine JWT. |

CRM Public API V2 is \`https://api.kvcore.com/v2/public\` (contacts only). \`api.boldtrail.com\` 403s. \`/v2/deals\` does not exist on the CRM host. Empty or malformed base-URL secrets fall back to Back Office in \`resolveBoldtrailApiBase\`.

Functions: \`boldtrailHealthCheck\`, \`boldtrailSyncEscrow\`, \`boldtrailPullTransactionDocs\`. Re-test from \`/admin/wisdom/escrow\`.

## Related admin
\`/admin/clients\`, \`/admin/communications\`, \`/admin/roster\`, \`/admin/dnn/subscribers\`, \`/admin/media-crm\`, \`/admin/wisdom/escrow\`.`,
  },
];

export function catalogBySection(section) {
  return AGENT_LIBRARY_CATALOG.filter((n) => n.section === section)
    .slice()
    .sort((a, b) => (a.node_order || 0) - (b.node_order || 0));
}

export function catalogSeedPayload(nodes = AGENT_LIBRARY_CATALOG) {
  return nodes.map((n) => ({
    title: n.title,
    summary: n.summary,
    section: n.section,
    content: n.content,
    is_priority: !!n.is_priority,
    node_order: n.node_order || 0,
  }));
}
