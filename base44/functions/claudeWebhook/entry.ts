import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * claudeWebhook — Simple JSON API gateway for Claude / external AI clients.
 *
 * Replaces MCP server. No OAuth, no token exchange — just an API key.
 *
 * USAGE:
 *   POST https://1dnn.com/api/functions/claudeWebhook
 *   Header: x-api-key: <CLAUDELIBRARYAPIKEY value>
 *   Body:   { "tool": "<tool_name>", "args": { ... } }
 *
 *   GET (with api key) → returns the list of available tools (like MCP tools/list)
 *   GET (no key)       → 401
 *
 * All 8 operations run as the service role (admin-level) since the API key
 * itself is the auth gate. Each operation delegates to its original backend
 * function via functions.invoke, passing an internal flag so the target
 * function skips its own auth check.
 */

const TOOLS = [
  {
    name: 'find_destination_agents',
    description: 'Finds the top 5 real estate agents in a destination city via web search, creates referral proposal records, and emails each agent an exclusive relocation lead offer with accept/decline links.',
    function: 'findAndNotifyAgents',
    required_args: ['seller_outreach_id', 'destination_city', 'destination_state'],
    optional_args: ['seller_name', 'moving_timeline'],
  },
  {
    name: 'create_owner_outreach_campaign',
    description: 'Creates an OwnerOutreachCampaign record for a listing owner if one does not already exist. Use before sending the first outreach SMS to a homeowner.',
    function: 'createOutreachCampaign',
    required_args: ['listing_owner_id'],
    optional_args: [],
  },
  {
    name: 'send_owner_sms_batch',
    description: 'Sends the Day 1 owner-outreach SMS to a batch of listing owners via Twilio. Each owner needs a valid phone and listing_owner_id. Logs the batch to BatchSMSLog.',
    function: 'sendBatchOutreachSMS',
    required_args: ['owners'],
    optional_args: ['city'],
  },
  {
    name: 'run_morning_broadcast',
    description: "Drives the DNN morning broadcast pipeline. action 'generate' writes today's scripts; 'render' starts HeyGen clip renders; 'run' does both; 'check' polls in-progress renders and stores completed videos.",
    function: 'dnnMorningBroadcast',
    required_args: ['action'],
    optional_args: [],
  },
  {
    name: 'generate_daily_articles',
    description: 'Generates 10 localized DNN Intelligence Briefs across random markets and trigger types (tax, housing, jobs, rates, migration, employer news) and publishes them to the consumer feed. No parameters.',
    function: 'dnnDailyArticle',
    required_args: [],
    optional_args: [],
  },
  {
    name: 'trigger_broadcast_distribution',
    description: "Fires the n8n multi-channel publishing webhook for a broadcast whose status is 'ready' and has a videoUrl, publishing to LinkedIn, Facebook, Instagram, SMS, and email. Pass the broadcast id.",
    function: 'dnnTriggerDistribution',
    required_args: ['entity_id'],
    optional_args: [],
  },
  {
    name: 'render_article_video',
    description: "Synthesizes anchor audio for a DNN article and kicks off a HeyGen lip-sync avatar video render. Returns a video_id to poll via heygenCheckVideo.",
    function: 'heygenRenderVideo',
    required_args: ['article_id'],
    optional_args: ['avatar_id'],
  },
  {
    name: 'generate_referral_agreement',
    description: 'Generates a Relocation Referral & Management Agreement document (markdown text) between Dyson & Dyson and a listing agent/broker for a specific property. Returns the agreement text ready for signature.',
    function: 'generateReferralAgreement',
    required_args: ['list_agent_name', 'broker_name', 'property_address'],
    optional_args: ['list_agent_email', 'seller_name', 'referral_fee_percent', 'relocation_mgmt_fee_percent'],
  },
];

export default async function(req) {
  try {
    // ── Auth: validate API key ──────────────────────────────────────────
    const apiKey = req.headers.get('x-api-key') || new URL(req.url).searchParams.get('key');
    const expectedKey = secrets.get('CLAUDELIBRARYAPIKEY');

    if (!expectedKey) {
      return Response.json({ error: 'CLAUDELIBRARYAPIKEY secret not configured' }, { status: 500 });
    }
    if (!apiKey || apiKey !== expectedKey) {
      return Response.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);

    // ── GET: list tools (like MCP tools/list) ───────────────────────────
    if (req.method === 'GET') {
      return Response.json({
        server: 'DysonRelo Claude Webhook',
        tool_count: TOOLS.length,
        tools: TOOLS.map(t => ({
          name: t.name,
          description: t.description,
          required_args: t.required_args,
          optional_args: t.optional_args,
        })),
        usage: 'POST with header x-api-key and body { "tool": "<name>", "args": { ... } }',
      });
    }

    // ── POST: execute a tool ────────────────────────────────────────────
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed. Use GET or POST.' }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const { tool, args } = body;

    if (!tool) {
      return Response.json({ error: 'Missing "tool" in request body', available_tools: TOOLS.map(t => t.name) }, { status: 400 });
    }

    const toolDef = TOOLS.find(t => t.name === tool);
    if (!toolDef) {
      return Response.json({ error: `Unknown tool: ${tool}`, available_tools: TOOLS.map(t => t.name) }, { status: 400 });
    }

    // Validate required args
    const providedArgs = args || {};
    const missing = toolDef.required_args.filter(a => providedArgs[a] === undefined || providedArgs[a] === null);
    if (missing.length > 0) {
      return Response.json({ error: `Missing required args for ${tool}: ${missing.join(', ')}` }, { status: 400 });
    }

    // ── Delegate to the original backend function ──────────────────────
    // All original functions use asServiceRole for their DB/integration calls,
    // so internal invocation runs at service-role level regardless of user auth.
    const result = await base44.asServiceRole.functions.invoke(toolDef.function, providedArgs);

    return Response.json({
      tool,
      success: true,
      result: result?.data ?? result,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}