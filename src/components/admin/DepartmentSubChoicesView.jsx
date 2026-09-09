import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Newspaper, GitBranch, ClipboardList, MapPin, Building2, SendHorizontal, 
  Video, Edit, Library, Clapperboard, Zap, BarChart3, Users, Send, Shield, 
  BookOpen, Star, FileCheck, DollarSign, Archive, ArrowRight, Sparkles,
  Map, ShieldCheck, FileSearch, Home, ShoppingBag, TrendingUp, Calendar,
  MessageCircle, Fingerprint, List, ExternalLink, Play, Mail, MessageSquare, CheckCircle2, Inbox, Clock,
  Calculator, CloudSun, Mic, Brain, Compass, Thermometer, Phone, ScrollText
} from 'lucide-react';
import { ADMIN_DEPT_MINI_APPS } from './AdminMiniAppsGrid';
import LiveEmailTextStatusPanel from './LiveEmailTextStatusPanel';
import CalendarMiniApp from '@/components/miniapps/CalendarMiniApp';
import CalculatorMiniApp from '@/components/miniapps/CalculatorMiniApp';
import WeatherMiniApp from '@/components/miniapps/WeatherMiniApp';

const GOLD = '#D4AF37';

export const DEPARTMENT_DATA = {
  dnn: {
    id: 'dnn',
    name: 'DNN News & Intelligence',
    subtitle: 'Morning broadcast production, daily video library, and media intelligence',
    icon: Newspaper,
    accentColor: '#ef4444',
    badge: 'DAILY BROADCAST',
    subChoices: [
      {
        id: 'broadcast_production',
        title: 'Studio & Broadcast Production',
        tagline: 'Video renders, pipelines, and script generation',
        icon: Clapperboard,
        color: '#ef4444',
        badge: 'ACTIVE RENDER',
        description: 'Manage the automated 6AM morning brief, script reviews, video previews, and render credit quotas.',
        primaryLink: { label: 'Open Daily Library', path: '/admin/dnn/daily-library' },
        links: [
          { label: '📚 Daily News Library', path: '/admin/dnn/daily-library', highlight: true },
          { label: '🎬 Video Preview & Blast', path: '/admin/dnn/video-preview' },
          { label: '✏️ Script Studio (Templates & Preview)', path: '/admin/dnn/script-studio', highlight: true },
          { label: '🎬 Show Production Pipeline', path: '/admin/dnn/show-pipeline' },
          { label: '⚡ Pipeline Credit Monitor', path: '/admin/heygen-credits' },
          { label: '📊 Production Cost Dashboard', path: '/admin/production-dashboard' },
        ],
      },
      {
        id: 'news_intel',
        title: 'News Feed & Market Intelligence',
        tagline: 'Staged market articles, data feeds, and archive',
        icon: Newspaper,
        color: '#f59e0b',
        badge: 'REAL-TIME DATA',
        description: 'Curate local and national housing stories, federal reserve decisions, and tax migration data.',
        primaryLink: { label: 'Explore News Feed', path: '/admin/dnn/news-feed' },
        links: [
          { label: '📰 News Feed (Staging Desk)', path: '/admin/dnn/news-feed', highlight: true },
          { label: '📊 Market Data Hub', path: '/admin/dnn/market-data' },
          { label: '📺 Broadcast Archive Page', path: '/dnn-archive' },
          { label: '📖 Bureau Story Hub', path: '/admin/dnn/bureau-stories' },
          { label: '🎥 Explainer Video Sets', path: '/admin/dnn/explainer-videos' },
        ],
      },
      {
        id: 'subscribers_bureau',
        title: 'Subscribers & Agent Bureau',
        tagline: 'Subscriber CRM, communications, and co-branding',
        icon: Users,
        color: '#3b82f6',
        badge: 'B2B SYNDICATION',
        description: 'Track audience growth, agent syndication channels, and private-label morning broadcast dispatches.',
        primaryLink: { label: 'Open Subscriber CRM', path: '/admin/dnn/subscribers' },
        links: [
          { label: '👥 Subscriber CRM', path: '/admin/dnn/subscribers', highlight: true },
          { label: '📨 Communications Hub', path: '/admin/dnn/communications' },
          { label: '🛡️ Agent Bureau (B2B)', path: '/admin/dnn/agent-bureau' },
          { label: '📣 Agent Recruiting Broadcast', path: '/admin/dnn/recruiting' },
          { label: '📈 Featured Agent Revenue', path: '/admin/dnn/revenue' },
        ],
      },
      {
        id: 'studio_landing',
        title: 'Studio Landing & Verified 16:9',
        tagline: 'Verified studio set design, layout, and master source',
        icon: Video,
        color: '#10b981',
        badge: 'LOCKED SPEC',
        description: 'Preview and inspect the verified 16:9 studio desk layout, Charlie anchor composites, and locked source code.',
        primaryLink: { label: 'View Verified Studio', path: '/admin/archived/studio-landing' },
        links: [
          { label: '✅ DNN Studio Landing Page (Verified)', path: '/admin/archived/studio-landing', highlight: true },
          { label: '🔒 Locked Source Code', path: '/admin/dnn/studio-landing-source' },
          { label: '✅ Locked Final Look (Charlie Solution)', path: '/admin/dnn/charlie-studio-solution' },
          { label: '📊 DNN Flow Chart', path: '/admin/workflows/dnn' },
        ],
      },
    ],
  },
  workflows: {
    id: 'workflows',
    name: 'Workflows & System Atlas',
    subtitle: 'Automated multi-step processes, roadmaps, and Grok dispatch',
    icon: GitBranch,
    accentColor: '#38bdf8',
    badge: 'SYSTEM ORCHESTRATION',
    subChoices: [
      {
        id: 'atlas',
        title: 'Master Workflow Atlas',
        tagline: 'Interactive department flow charts and triggers',
        icon: GitBranch,
        color: '#38bdf8',
        badge: 'ARCHITECTURE',
        description: 'Visual flow diagrams showing triggers, decision branching, and backend automations across all desks.',
        primaryLink: { label: 'Launch Atlas', path: '/admin/workflows' },
        links: [
          { label: '🗺️ Master Workflow Atlas Overview', path: '/admin/workflows', highlight: true },
          { label: '📊 Marketing Workflow', path: '/admin/workflows/marketing' },
          { label: '📊 Sales & Recruiting Workflow', path: '/admin/workflows/sales' },
          { label: '📊 DNN Intelligence Workflow', path: '/admin/workflows/dnn' },
        ],
      },
      {
        id: 'roadmap_completion',
        title: 'Road Map to Completion',
        tagline: 'Real-time project milestone and delivery tracking',
        icon: Map,
        color: '#10b981',
        badge: 'MILESTONES',
        description: 'Master show sheet and operational milestone status for all platform capabilities.',
        primaryLink: { label: 'Open Road Map', path: '/admin/roadmap' },
        links: [
          { label: '📍 Road Map to Completion', path: '/admin/roadmap', highlight: true },
          { label: '📋 Master Show Sheet', path: '/admin/show-sheet' },
          { label: '🖥️ Claude Screen Viewer', path: '/admin/claude-screen-viewer' },
        ],
      },
      {
        id: 'dispatch_grok',
        title: 'Dispatch Log & AI Specialists',
        tagline: 'Execution logs, command center, and specialist agents',
        icon: Zap,
        color: '#f59e0b',
        badge: 'AUTOMATION',
        description: 'Monitor real-time task dispatches, specialist worker assignments, and Grok chief orchestration.',
        primaryLink: { label: 'Grok Command', path: '/admin/grok-command' },
        links: [
          { label: '⚡ Grok Command Console', path: '/admin/grok-command', highlight: true },
          { label: '📜 Dispatch Execution Log', path: '/admin/dispatch-log' },
          { label: '🤖 Library Specialists Roster', path: '/admin/library-specialists' },
        ],
      },
    ],
  },
  agents: {
    id: 'agents',
    name: 'Agent Desk & Command Center',
    subtitle: 'Affiliate recruiting, top agent roster, workfiles, and agreements',
    icon: ClipboardList,
    accentColor: '#60a5fa',
    badge: 'NETWORK MANAGEMENT',
    subChoices: [
      {
        id: 'command_center',
        title: 'Agent Command Center',
        tagline: 'Active relocation transactions and agent workfiles',
        icon: ClipboardList,
        color: '#60a5fa',
        badge: 'CLIENT FILES',
        description: 'Manage live client relocation workfiles, milestone progress, and communication threads.',
        primaryLink: { label: 'Open Command Center', path: '/agent-command-center' },
        links: [
          { label: '📋 Agent Command Center', path: '/agent-command-center', highlight: true },
          { label: '⭐ Active Relocation Agents Roster', path: '/admin/active-relocation-agents' },
          { label: '🤝 Referral Agents Network', path: '/admin/referral-agents' },
        ],
      },
      {
        id: 'recruiting_pipeline',
        title: 'Affiliate Recruiting & Outreach',
        tagline: 'Bob Dyson contacts, top agent prospects, and pitches',
        icon: Users,
        color: '#10b981',
        badge: 'RECRUITMENT',
        description: 'Target top-producing independent agents across destination markets to join the PRN network.',
        primaryLink: { label: 'Recruiting Pipeline', path: '/admin/affiliate-recruiting' },
        links: [
          { label: '🎯 Affiliate Recruiting Pipeline', path: '/admin/affiliate-recruiting', highlight: true },
          { label: '👤 Bob Dyson Contact List', path: '/admin/bob-dyson-contacts', highlight: true },
          { label: '📜 Top Relocation Agent Prospects', path: '/admin/roster' },
          { label: '🚀 Exodus Pitch Presentation', path: '/admin/exodus-pitch' },
          { label: '🎁 Partner Benefits Overview', path: '/admin/partner-benefits' },
        ],
      },
      {
        id: 'agreements_compliance',
        title: 'Agreements & Legal Compliance',
        tagline: 'Master agreements, PRN contracts, and fee distribution',
        icon: ShieldCheck,
        color: '#D4AF37',
        badge: 'FIDUCIARY CONTRACTS',
        description: 'Issue 25% referral agreements, verify DRE licensing, and audit executed contractor packages.',
        primaryLink: { label: 'Master Agreement', path: '/admin/master-agreement' },
        links: [
          { label: '📜 Master Referral & Relo Mgmt Agreement', path: '/admin/master-agreement', highlight: true },
          { label: '✍️ PRN Agreements Generator', path: '/admin/prn-agreements' },
          { label: '📥 Agreement Submissions Tracker', path: '/admin/agreement-submissions' },
          { label: '🤝 Lead Handoff Desk', path: '/admin/lead-handoff' },
        ],
      },
    ],
  },
  listing_outreach: {
    id: 'listing_outreach',
    name: 'MLS Listing Agent Outreach',
    subtitle: 'Prospecting, skip tracing, and personalized agent preview delivery',
    icon: MapPin,
    accentColor: '#f59e0b',
    badge: 'DIRECT OUTREACH',
    subChoices: [
      {
        id: 'listing_prospects',
        title: 'Listing Agent CRM & Outreach',
        tagline: 'Track active MLS listings and outreach campaigns',
        icon: MapPin,
        color: '#f59e0b',
        badge: 'MLS PROSPECTING',
        description: 'Contact MLS listing agents with custom fiduciary co-marketing presentations.',
        primaryLink: { label: 'Listing Prospects', path: '/admin/listing-prospects' },
        links: [
          { label: '📍 MLS Listing Agent Outreach Hub', path: '/admin/listing-prospects', highlight: true },
          { label: '🔍 Search Listing Profiles', path: '/admin/search-profiles' },
          { label: '📱 Quick Send (Video / Page → SMS)', path: '/admin/quick-send' },
        ],
      },
      {
        id: 'skip_tracing',
        title: 'Skip Trace & Property Research',
        tagline: 'BatchData property lookups and owner intelligence',
        icon: Fingerprint,
        color: '#3b82f6',
        badge: 'INTELLIGENCE',
        description: 'Find validated phone numbers, emails, and corporate ownership for off-market and MLS listings.',
        primaryLink: { label: 'Skip Trace Lookup', path: '/admin/skip-trace' },
        links: [
          { label: '🔎 Skip Trace Single Lookup', path: '/admin/skip-trace', highlight: true },
          { label: '📦 Bulk Skip Trace CSV Importer', path: '/admin/bulk-skip-trace' },
          { label: '📋 Owner Response Board (Kanban)', path: '/admin/owner-kanban' },
          { label: '🏡 Listing Owners Directory', path: '/admin/owners' },
        ],
      },
      {
        id: 'outreach_pipeline',
        title: 'Outreach Pipeline & SMS Logs',
        tagline: 'SMS campaigns, response queues, and delivery metrics',
        icon: SendHorizontal,
        color: '#10b981',
        badge: 'DELIVERY SYSTEM',
        description: 'Monitor outreach stages, review sent messages, and follow up with interested sellers and agents.',
        primaryLink: { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline' },
        links: [
          { label: '🚀 Outreach Pipeline Stages', path: '/admin/outreach-pipeline', highlight: true },
          { label: '💬 Compose Direct SMS Message', path: '/admin/compose-sms' },
          { label: '📜 Batch SMS Audit Logs', path: '/admin/batch-sms-log' },
          { label: '📊 Outreach Performance Analytics', path: '/admin/outreach-analytics' },
        ],
      },
    ],
  },
  wisdom: {
    id: 'wisdom',
    name: 'Wisdom Relo & Brokerage Suite',
    subtitle: 'Wisdom Properties subscriber hub, escrow auditing, and listings',
    icon: Building2,
    accentColor: '#10b981',
    badge: 'SUBSCRIBER #1',
    subChoices: [
      {
        id: 'escrow_audit',
        title: 'Escrows & Brokermint Doc Audit',
        tagline: 'Escrow tracking, file audits, and compliance checks',
        icon: ShieldCheck,
        color: '#10b981',
        badge: 'BACKOFFICE',
        description: 'Live escrow transaction sync from Brokermint, milestone checklist validation, and AI compliance audit.',
        primaryLink: { label: 'Escrow Management', path: '/admin/wisdom/escrow' },
        links: [
          { label: '🛡️ Escrow Management & Deadlines', path: '/admin/wisdom/escrow', highlight: true },
          { label: '🔍 Transaction Doc Audit (by Escrow #)', path: '/admin/wisdom/audit', highlight: true },
          { label: '📄 AI Compliance Review Uploader', path: '/admin/compliance-review' },
        ],
      },
      {
        id: 'client_records',
        title: 'Listing & Buying Clients',
        tagline: 'Client portfolios, transaction files, and agents',
        icon: Home,
        color: '#3b82f6',
        badge: 'PORTFOLIO',
        description: 'View active listing clients, buying clients, company agents, and broker referrals.',
        primaryLink: { label: 'Listing Clients', path: '/admin/wisdom/listings' },
        links: [
          { label: '🏡 Listing Clients Hub', path: '/admin/wisdom/listings', highlight: true },
          { label: '🛍️ Buying Clients Roster', path: '/admin/wisdom/buying-clients' },
          { label: '👥 Company & Network Agents', path: '/admin/wisdom/agents' },
          { label: '🏢 Brokerage Client Dashboard', path: '/brokerage' },
        ],
      },
      {
        id: 'marketing_presence',
        title: 'Marketing & Luxury Presence',
        tagline: 'Luxury Presence website builder and co-branded campaigns',
        icon: Star,
        color: '#D4AF37',
        badge: 'BRANDING',
        description: 'Manage custom domain branding, luxury presence showcase settings, and co-branded marketing blasts.',
        primaryLink: { label: 'Luxury Presence Builder', path: '/admin/wisdom/luxury' },
        links: [
          { label: '✨ Luxury Presence Website Builder', path: '/admin/wisdom/luxury', highlight: true },
          { label: '📈 Wisdom Marketing Campaigns', path: '/admin/wisdom/marketing' },
          { label: '🤝 Agent Referrals Bureau', path: '/brokerage/referrals' },
        ],
      },
    ],
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Campaigns & PR Desk',
    subtitle: 'Automated SMS campaigns, video marketing, press kits, and media CRM',
    icon: SendHorizontal,
    accentColor: '#ec4899',
    badge: 'GROWTH ENGINE',
    subChoices: [
      {
        id: 'campaigns_sms',
        title: 'SMS Campaigns & Sequencing',
        tagline: 'Multi-step sequences, scheduled drops, and analytics',
        icon: Calendar,
        color: '#ec4899',
        badge: 'CAMPAIGNS',
        description: 'Automate high-conversion SMS sequences for homeowners, relocating families, and partner agents.',
        primaryLink: { label: 'Campaigns Hub', path: '/admin/marketing-campaigns-hub' },
        links: [
          { label: '🎯 Marketing Campaigns Hub', path: '/admin/marketing-campaigns-hub', highlight: true },
          { label: '📅 Scheduled SMS Campaigns', path: '/admin/scheduled-campaigns' },
          { label: '💬 Multi-Step SMS Sequences', path: '/admin/sms-sequences' },
          { label: '📊 Campaign Performance Metrics', path: '/admin/outreach-analytics' },
        ],
      },
      {
        id: 'video_media',
        title: 'Video Marketing & Vault',
        tagline: 'Video SMS drops, explainer vaults, and decks',
        icon: Video,
        color: '#8b5cf6',
        badge: 'RICH MEDIA',
        description: 'Deploy video SMS messages with Charlie AI explainers and manage presentation slide decks.',
        primaryLink: { label: 'Video SMS Campaigns', path: '/admin/video-sms-campaign' },
        links: [
          { label: '📹 Video SMS Campaigns', path: '/admin/video-sms-campaign', highlight: true },
          { label: '🎬 Media Video Library', path: '/admin/video-library' },
          { label: '📑 Presentation Slide Deck Library', path: '/admin/presentation-library' },
          { label: '🚀 Social Media Launch Desk', path: '/admin/social-launch' },
        ],
      },
      {
        id: 'pr_media_crm',
        title: 'PR & Media Pitching',
        tagline: 'Journalist outreach, press kit assets, and pitches',
        icon: Newspaper,
        color: '#D4AF37',
        badge: 'EARNED MEDIA',
        description: 'Track real estate journalists, customize press releases, and distribute national media pitches.',
        primaryLink: { label: 'Media CRM', path: '/admin/media-crm' },
        links: [
          { label: '📰 Real Estate Media CRM', path: '/admin/media-crm', highlight: true },
          { label: '⭐ Media Pitch Tracker', path: '/admin/pitch-tracker' },
          { label: '📦 Press Kit Digital Assets', path: '/admin/press-kit' },
          { label: '✍️ Mass Pitch Personalizer', path: '/admin/mass-pitch' },
        ],
      },
    ],
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar & Relocation Schedules',
    subtitle: 'Relocation milestones, home tour itineraries, and closing deadlines',
    icon: Calendar,
    accentColor: '#a855f7',
    badge: 'MOVE TIMELINE',
    subChoices: [
      {
        id: 'move_milestones',
        title: 'Interactive Relocation Calendar',
        tagline: 'Track client moving dates and critical milestones',
        icon: Calendar,
        color: '#a855f7',
        badge: 'CLIENT DATES',
        description: 'Interactive monthly and daily schedule of moves, key turnover dates, and van line logistics.',
        primaryLink: { label: 'Open Full Calendar', path: '/calendar' },
        links: [
          { label: '🗓️ Relocation Calendar Mini App', path: '/calendar', highlight: true },
          { label: '📋 Master Client Roadmaps', path: '/client-roadmap' },
          { label: '🏠 Intake Schedule Sequence', path: '/relocation-intake' },
        ],
      },
      {
        id: 'escrow_deadlines',
        title: 'Escrow & Transaction Deadlines',
        tagline: 'Brokermint contingency periods & closing dates',
        icon: ShieldCheck,
        color: '#10b981',
        badge: 'ESCROW SCHEDULE',
        description: 'Monitor loan contingencies, appraisal deadlines, and scheduled close of escrow dates.',
        primaryLink: { label: 'Escrow Deadlines', path: '/admin/wisdom/escrow' },
        links: [
          { label: '🛡️ Escrow Management Deadlines', path: '/admin/wisdom/escrow', highlight: true },
          { label: '🔍 Transaction Document Audits', path: '/admin/wisdom/audit' },
          { label: '📄 AI Compliance Reviews', path: '/admin/compliance-review' },
        ],
      },
      {
        id: 'marketing_calendar',
        title: 'Campaign & Broadcast Schedule',
        tagline: '6AM Morning brief broadcasts & scheduled SMS drops',
        icon: Clock,
        color: '#f59e0b',
        badge: 'AUTOMATED DROPS',
        description: 'View scheduled SMS campaigns, recurring morning brief production, and weekly recap distributions.',
        primaryLink: { label: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns' },
        links: [
          { label: '📅 Scheduled SMS Campaigns', path: '/admin/scheduled-campaigns', highlight: true },
          { label: '🎬 Daily Show Production Pipeline', path: '/admin/dnn/show-pipeline' },
          { label: '🎯 Outreach Campaign Roadmap', path: '/admin/campaign-roadmap' },
        ],
      },
    ],
  },
  email: {
    id: 'email',
    name: 'Email Desk & bob@dysonrelo.com',
    subtitle: 'Sending verification via Resend, Microsoft 365 inbound routing, and client threads',
    icon: Mail,
    accentColor: '#38bdf8',
    badge: 'bob@dysonrelo.com',
    subChoices: [
      {
        id: 'email_live_desk',
        title: 'bob@dysonrelo.com Live Verification',
        tagline: 'Real-time outbound sending & inbound MX routing diagnostics',
        icon: Mail,
        color: '#38bdf8',
        badge: 'VERIFIED SENDING',
        description: 'Inspect Resend DKIM/SPF domain verification, Microsoft 365 inbound MX destination, and run one-click test sends.',
        primaryLink: { label: 'Email Mini App', path: '/email' },
        links: [
          { label: '✉️ Email Client Mini App', path: '/email', highlight: true },
          { label: '📤 Quick Send (Video / Page → Email)', path: '/admin/quick-send' },
          { label: '📨 Communications Hub', path: '/admin/dnn/communications' },
        ],
      },
      {
        id: 'client_comms',
        title: 'Client Communications Desk',
        tagline: 'Message history, lead replies, and inquiry threads',
        icon: MessageCircle,
        color: '#10b981',
        badge: 'CLIENT LOGS',
        description: 'Review communications with relocation buyers, listing agents, and vetting candidates.',
        primaryLink: { label: 'Communications Logs', path: '/admin/communications' },
        links: [
          { label: '💬 Admin Communications Roster', path: '/admin/communications', highlight: true },
          { label: '🚩 Flagged Conversations', path: '/admin/flagged-conversations' },
          { label: '👥 Subscriber CRM Directory', path: '/admin/dnn/subscribers' },
        ],
      },
      {
        id: 'email_outreach',
        title: 'B2B & Subscriber Email Blasts',
        tagline: 'Resend high-volume multi-inbox rotation & newsletters',
        icon: Send,
        color: '#D4AF37',
        badge: 'RESEND BLAST',
        description: 'Multi-inbox agent outreach with 40/day cap, morning broadcast email notifications, and invite dispatches.',
        primaryLink: { label: 'Subscriber Invites', path: '/admin/subscriber-invite' },
        links: [
          { label: '✉️ Send Subscriber Invites', path: '/admin/subscriber-invite', highlight: true },
          { label: '📍 MLS Listing Agent Outreach Hub', path: '/admin/listing-prospects' },
          { label: '📰 8AM Morning Email Blast Workflow', path: '/admin/workflows/dnn' },
        ],
      },
    ],
  },
  text: {
    id: 'text',
    name: 'Text / SMS Communications Desk',
    subtitle: 'Twilio active carrier line, automated 10DLC pipelines, and client SMS alerts',
    icon: MessageSquare,
    accentColor: '#10b981',
    badge: 'TWILIO ACTIVE',
    subChoices: [
      {
        id: 'direct_sms',
        title: 'Compose & Direct SMS',
        tagline: 'Send individual and targeted messages to owners & clients',
        icon: SendHorizontal,
        color: '#10b981',
        badge: 'CARRIER LINE',
        description: 'Send direct text messages to homeowners, follow up with leads, and receive automatic email alerts on replies.',
        primaryLink: { label: 'Compose SMS', path: '/admin/compose-sms' },
        links: [
          { label: '💬 Compose Single SMS', path: '/admin/compose-sms', highlight: true },
          { label: '📱 Quick Send Video / Page via SMS', path: '/admin/quick-send' },
          { label: '📞 Direct Call / Text: (858) 353-1200', path: '/admin/outreach-pipeline' },
        ],
      },
      {
        id: 'outreach_pipeline_sms',
        title: 'Outreach Pipeline & Response Board',
        tagline: 'Owner response Kanban & lead qualification workflow',
        icon: Users,
        color: '#f59e0b',
        badge: 'RESPONSES',
        description: 'Track inbound text responses from homeowners, qualify relocation intent, and assign vetted agents.',
        primaryLink: { label: 'Outreach Pipeline', path: '/admin/outreach-pipeline' },
        links: [
          { label: '🚀 Outreach Pipeline Stages', path: '/admin/outreach-pipeline', highlight: true },
          { label: '📋 Owner Response Kanban', path: '/admin/owner-kanban' },
          { label: '🏡 Listing Owners Directory', path: '/admin/owners' },
        ],
      },
      {
        id: 'batch_logs',
        title: 'Batch SMS Logs & Sequences',
        tagline: 'Audit trail of dispatched SMS campaigns & automated drips',
        icon: List,
        color: '#ec4899',
        badge: 'AUDIT LOGS',
        description: 'Real-time delivery verification, failure tracking, opt-out management, and multi-step SMS sequences.',
        primaryLink: { label: 'Batch SMS Logs', path: '/admin/batch-sms-log' },
        links: [
          { label: '📜 Batch SMS Audit Logs', path: '/admin/batch-sms-log', highlight: true },
          { label: '💬 Multi-Step SMS Sequences', path: '/admin/sms-sequences' },
          { label: '📊 Outreach Analytics Dashboard', path: '/admin/outreach-analytics' },
        ],
      },
    ],
  },
  calculator: {
    id: 'calculator',
    name: 'Mortgage & Relocation Calculator',
    subtitle: 'Principal & interest, property taxes, van line moving costs, and temporary lodging',
    icon: Calculator,
    accentColor: '#34d399',
    badge: 'MORTGAGE & RELO',
    subChoices: [
      {
        id: 'mortgage_calc',
        title: 'Mortgage & Payment Estimator',
        tagline: 'Home price, down payment %, interest rate & taxes',
        icon: Calculator,
        color: '#34d399',
        badge: 'P&I + TAXES',
        description: 'Accurate monthly mortgage calculation including P&I, state-specific property taxes, and hazard insurance.',
        primaryLink: { label: 'Open Calculator', path: '/calculator' },
        links: [
          { label: '🧮 Mortgage & Payment Tool', path: '/calculator', highlight: true },
          { label: '💳 Financial Services Hub', path: '/financial-services' },
          { label: '🏦 Select a Vetted Lender', path: '/admin/dnn/lender-vetting' },
        ],
      },
      {
        id: 'moving_costs',
        title: 'Van Line & Relocation Logistics',
        tagline: 'Distance, bedrooms, packing & storage estimation',
        icon: Compass,
        color: '#f59e0b',
        badge: 'MOVING ESTIMATE',
        description: 'Calculate comprehensive interstate moving costs, storage units, mileage allowances, and transition budgets.',
        primaryLink: { label: 'Relo Estimator', path: '/calculator' },
        links: [
          { label: '🚚 Relocation Expense Estimator', path: '/calculator', highlight: true },
          { label: '📋 Master Client Roadmaps', path: '/client-roadmap' },
          { label: '🏡 Relocation Intake Planner', path: '/relocation-intake' },
        ],
      },
      {
        id: 'tax_savings',
        title: 'State Tax Differential & Net Sheet',
        tagline: 'California vs Texas/Florida/Nevada tax comparisons',
        icon: Sparkles,
        color: '#D4AF37',
        badge: 'TAX BATTLEPLAN',
        description: 'Model real cash-flow advantages of moving between state tax brackets, capital gains timing, and 1031 exchanges.',
        primaryLink: { label: 'Tax & Solutions Map', path: '/solutions' },
        links: [
          { label: '✨ Tax & Relo Solutions Map', path: '/solutions', highlight: true },
          { label: '⚖️ Fiduciary Transparency Deck', path: '/transparency' },
          { label: '📊 Market Data Hub', path: '/admin/dnn/market-data' },
        ],
      },
    ],
  },
  weather: {
    id: 'weather',
    name: 'Destination Climates & Weather Hub',
    subtitle: 'Seasonal temperatures, annual sunny days, and live 5-day forecasts for top relocation destinations',
    icon: CloudSun,
    accentColor: '#38bdf8',
    badge: 'CLIMATE RADAR',
    subChoices: [
      {
        id: 'destination_forecasts',
        title: 'Top Relocation Market Forecasts',
        tagline: 'Scottsdale, Austin, Nashville, Miami & Incline Village',
        icon: CloudSun,
        color: '#38bdf8',
        badge: '5-DAY WEATHER',
        description: 'Live weather updates, seasonal temperatures, humidity indexes, and conditions in top relocation cities.',
        primaryLink: { label: 'Open Weather Hub', path: '/weather' },
        links: [
          { label: '☀️ Weather & Climate Mini App', path: '/weather', highlight: true },
          { label: '🗺️ Explore Destination Strip', path: '/city-guide' },
          { label: '🌆 City Relocation Guides', path: '/city-guide' },
        ],
      },
      {
        id: 'climate_comparison',
        title: 'Climate vs California Benchmark',
        tagline: 'Compare winter lows, annual sun days, and summer humidity',
        icon: Thermometer,
        color: '#f59e0b',
        badge: 'BENCHMARK',
        description: 'Side-by-side analysis comparing California coastal weather with destination mountain, desert, and sun-belt climates.',
        primaryLink: { label: 'Compare Climates', path: '/weather' },
        links: [
          { label: '🌡️ Climate Comparison Tool', path: '/weather', highlight: true },
          { label: '📍 Vetted Agents by City', path: '/find-agent' },
          { label: '📰 DNN Market Data Feed', path: '/admin/dnn/market-data' },
        ],
      },
      {
        id: 'lifestyle_matching',
        title: 'Weather & Tax Matchmaker',
        tagline: 'Match buyers to ideal climate and 0% tax states',
        icon: Sparkles,
        color: '#10b981',
        badge: 'MATCHMAKER',
        description: 'Synthesize optimal lifestyle factors: 300+ days of sun, low tax jurisdiction, and luxury real estate availability.',
        primaryLink: { label: 'Relo Solutions Map', path: '/solutions' },
        links: [
          { label: '🌟 Lifestyle & Tax Solutions', path: '/solutions', highlight: true },
          { label: '🏡 Search Listing Profiles', path: '/admin/search-profiles' },
          { label: '💬 Talk with Charlie AI', path: '/talking-app' },
        ],
      },
    ],
  },
  charlie: {
    id: 'charlie',
    name: "Charlie Simmons AI Concierge Desk",
    subtitle: 'Real-time conversational voice mode (V2V), trained knowledge base Q&A, and spoken script studio',
    icon: Mic,
    accentColor: '#e8c84a',
    badge: 'VOICE-TO-VOICE',
    subChoices: [
      {
        id: 'v2v_voice',
        title: 'Voice-to-Voice (V2V) Concierge',
        tagline: 'Real-time two-way spoken conversation with Gemini Live',
        icon: Mic,
        color: '#10b981',
        badge: 'LIVE AUDIO',
        description: 'Experience hands-free voice interaction. Charlie speaks in an authentic broadcast tone, answering relocation queries instantly.',
        primaryLink: { label: 'Launch Voice Studio', path: '/talking-app' },
        links: [
          { label: '🎙️ Spoken Voice Studio (Talking App)', path: '/talking-app', highlight: true },
          { label: '📊 Voice Concierge Analytics', path: '/admin/voice-concierge-analytics' },
          { label: '🗣️ Charlie Voice Presentation', path: '/charlie-voice' },
        ],
      },
      {
        id: 'knowledge_brain',
        title: 'Charlie Knowledge Base & Q&A Brain',
        tagline: 'Vetting criteria, process knowledge, and escalation handling',
        icon: Brain,
        color: '#a855f7',
        badge: 'TRAINED BRAIN',
        description: 'Manage Charlie’s trained facts, vetted partner standards, relocation processes, and consumer answers.',
        primaryLink: { label: 'Knowledge Base', path: '/admin/charlie-knowledge-base' },
        links: [
          { label: '🧠 Charlie Knowledge Base Roster', path: '/admin/charlie-knowledge-base', highlight: true },
          { label: '⚠️ Review Flagged Escalations', path: '/admin/charlie-escalations' },
          { label: '🎥 Bob Dyson Video Answers Library', path: '/admin/bob-library' },
        ],
      },
      {
        id: 'broadcast_scripts',
        title: 'Spoken Scripts & HeyGen Pipeline',
        tagline: 'Daily 6AM broadcast scripts, audio synthesis, and avatars',
        icon: ScrollText,
        color: '#D4AF37',
        badge: 'SCRIPT STUDIO',
        description: 'Audit and edit AI-generated morning brief scripts, verify Ruben American voice synthesis, and test HeyGen renders.',
        primaryLink: { label: 'Charlie Scripts', path: '/admin/charlie-scripts' },
        links: [
          { label: '📜 Charlie Spoken Scripts Roster', path: '/admin/charlie-scripts', highlight: true },
          { label: '🎬 DNN Script Review Desk', path: '/admin/dnn/script-review' },
          { label: '⚡ Pipeline Credit Monitor', path: '/admin/heygen-credits' },
        ],
      },
    ],
  },
};

export default function DepartmentSubChoicesView({ 
  deptId = 'dnn', 
  onSelectDept 
}) {
  const navigate = useNavigate();
  const dept = DEPARTMENT_DATA[deptId] || DEPARTMENT_DATA.dnn;
  const DeptIcon = dept.icon;

  return (
    <div className="space-y-6 text-left">
      {/* ── TOP DEPARTMENT SWITCHER (MATCHING THE 6 MINI APPS) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {ADMIN_DEPT_MINI_APPS.map((app) => {
          const Icon = app.icon;
          const isActive = app.id === dept.id;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                if (onSelectDept) {
                  onSelectDept(app.id);
                } else {
                  navigate(`/admin?dept=${app.id}`);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl shrink-0 font-bold text-xs transition-all cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-[#0a0a0a] border-2 border-[#D4AF37] text-white shadow-md scale-102'
                  : 'bg-[#141414] hover:bg-[#222222] border border-black/30 text-white/85 hover:text-white'
              }`}
            >
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${app.iconColor}25` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: app.iconColor }} />
              </div>
              <span className="truncate">{app.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── DEPARTMENT BANNER ── */}
      <div 
        className="p-5 sm:p-6 rounded-3xl border shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #16130d 0%, #0c0b08 100%)',
          borderColor: `${dept.accentColor}70`,
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/10"
              style={{ background: `linear-gradient(135deg, ${dept.accentColor}33, #0a0a0a)` }}
            >
              <DeptIcon className="w-7 h-7 drop-shadow" style={{ color: dept.accentColor }} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black border text-[#D4AF37]"
                  style={{ borderColor: `${dept.accentColor}80` }}
                >
                  {dept.badge}
                </span>
                <span className="text-[11px] text-white/50 font-mono">
                  Department Sub-Choices
                </span>
              </div>

              <h2 
                className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {dept.name}
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                {dept.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/50 hidden sm:inline">
              Choose a direction below:
            </span>
          </div>
        </div>
      </div>

      {/* ── LIVE EMAIL OR TEXT STATUS & TEST PANEL (FOR EMAIL & TEXT DESKS) ── */}
      {(dept.id === 'email' || dept.id === 'text') && (
        <div className="animate-in fade-in duration-300">
          <LiveEmailTextStatusPanel mode={dept.id} />
        </div>
      )}

      {/* ── CALENDAR MINI APP EMBED (FOR CALENDAR DESK) ── */}
      {dept.id === 'calendar' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#a855f7]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#a855f7] uppercase tracking-wider">
              INTERACTIVE RELOCATION &amp; MOVE CALENDAR
            </span>
            <Link 
              to="/calendar" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <CalendarMiniApp />
        </div>
      )}

      {/* ── CALCULATOR MINI APP EMBED (FOR CALCULATOR DESK) ── */}
      {dept.id === 'calculator' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#34d399]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#34d399] uppercase tracking-wider">
              INTERACTIVE MORTGAGE &amp; RELOCATION CALCULATOR
            </span>
            <Link 
              to="/calculator" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <CalculatorMiniApp />
        </div>
      )}

      {/* ── WEATHER MINI APP EMBED (FOR WEATHER DESK) ── */}
      {dept.id === 'weather' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#38bdf8]/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
              DESTINATION MARKETS &amp; CLIMATE WEATHER HUB
            </span>
            <Link 
              to="/weather" 
              className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <WeatherMiniApp />
        </div>
      )}

      {/* ── CHARLIE AI VOICE CONCIERGE EMBED (FOR CHARLIE DESK) ── */}
      {dept.id === 'charlie' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              CHARLIE SIMMONS AI CONCIERGE · VOICE &amp; BRAIN CONTROLS
            </span>
            <Link 
              to="/talking-app" 
              className="text-xs text-[#10b981] hover:underline font-bold flex items-center gap-1"
            >
              <span>Launch Voice Studio (V2V)</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#10b981]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">V2V REAL-TIME</span>
                <h4 className="text-sm font-bold text-white mt-1">Spoken Voice Concierge</h4>
                <p className="text-xs text-white/70 mt-1">Engage Charlie directly in high-fidelity two-way conversational voice mode powered by Gemini Live.</p>
              </div>
              <Link to="/talking-app" className="py-2 px-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs text-center">
                Launch Voice Studio
              </Link>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#a855f7]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#a855f7] uppercase tracking-wider">KNOWLEDGE BASE</span>
                <h4 className="text-sm font-bold text-white mt-1">Trained Real Estate Q&amp;A</h4>
                <p className="text-xs text-white/70 mt-1">Review and fine-tune Charlie's answers on agent vetting, tax migration, and relocation process.</p>
              </div>
              <Link to="/admin/charlie-knowledge-base" className="py-2 px-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs text-center">
                Manage Q&amp;A Brain
              </Link>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">SCRIPT STUDIO</span>
                <h4 className="text-sm font-bold text-white mt-1">Spoken Broadcast Scripts</h4>
                <p className="text-xs text-white/70 mt-1">Configure and edit opening, body, and closing broadcast scripts voiced by Charlie.</p>
              </div>
              <Link to="/admin/charlie-scripts" className="py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs text-center">
                Open Script Studio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-CHOICES GRID (THE 3-4 SUB DIRECTIONS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dept.subChoices.map((choice, idx) => {
          const ChoiceIcon = choice.icon;

          return (
            <div 
              key={choice.id}
              className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all shadow-2xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header with Icon & Sub-Choice Number */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow"
                      style={{ background: `linear-gradient(135deg, ${choice.color}25, #000)` }}
                    >
                      <ChoiceIcon className="w-5 h-5 drop-shadow" style={{ color: choice.color }} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] block">
                        DIRECTION #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {choice.title}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-black border border-white/15 text-white/70 shrink-0">
                    {choice.badge}
                  </span>
                </div>

                {/* Subtitle / Description */}
                <p className="text-[11.5px] text-white/70 leading-relaxed font-normal">
                  {choice.description}
                </p>

                {/* Sub-Choices Direct Links List */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-white/40 block mb-1">
                    DESTINATIONS:
                  </span>
                  {choice.links.map((link, li) => (
                    <Link
                      key={li}
                      to={link.path}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        link.highlight
                          ? 'bg-[#1b1710] hover:bg-[#252014] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                          : 'bg-[#141414] hover:bg-[#1e1e1e] text-white/85 hover:text-white border border-white/5'
                      }`}
                    >
                      <span className="truncate">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              {choice.primaryLink && (
                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigate(choice.primaryLink.path)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 bg-[#D4AF37] hover:bg-[#e8c84a] text-black"
                  >
                    <span>{choice.primaryLink.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}