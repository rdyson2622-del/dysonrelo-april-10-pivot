import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Grok Chief Orchestrate — the real dispatch engine.
// When an admin messages the Chief of Staff (or Bob/Jay as co-founders),
// this function:
//   1. Asks the orchestrator LLM to route the request to a specialist
//   2. If delegating, calls that specialist's LLM with the framed task
//   3. Returns BOTH the routing decision AND the specialist's response
//   4. Logs the dispatch to GrokDispatch so the whole team can see it in the sidebar
//
// This is what turns the Command Center from a chat board into a dispatch hub.

// ── Specialist definitions (mirrors frontend GROK_ASSISTANTS) ──
const SPECIALISTS = {
  marketing: {
    name: 'Marketing Specialist',
    color: '#D4AF37',
    prompt: 'You are the Marketing Specialist for Dyson & Dyson. You find listing owners and start the conversation. You handle: search profiles, skip trace, SMS campaigns, owner response board, outreach pipeline, PR & media, landing pages. Keep responses concise and actionable.',
  },
  operations: {
    name: 'Operations Specialist',
    color: '#10b981',
    prompt: 'You are the Operations Specialist for Dyson & Dyson. You run the move once someone is in the door. You handle: intake, roadmap, city guides, corporate relo, compliance, flagged messages, Charlie escalations. Keep responses concise and actionable.',
  },
  sales: {
    name: 'Sales Specialist',
    color: '#f59e0b',
    prompt: 'You are the Sales Specialist for Dyson & Dyson. You recruit partners and hand off the client. You handle: affiliate recruiting, exodus pitch, partner benefits, master roster, PRN agreements, lead handoff, agent/lender vetting. Fee math: 25% sending partner, 10-15% Dyson. Keep responses concise and actionable.',
  },
  dnn: {
    name: 'DNN News Specialist',
    color: '#38bdf8',
    prompt: 'You are the DNN News Specialist for Dyson & Dyson. You write, render, and publish the daily show. You handle: news feed, script studio, script review, daily library, show pipeline, video preview, studio dashboard, communications hub, show performance, subscriber CRM, agent bureau, recruiting broadcast. Keep responses concise and actionable.',
  },
  finance: {
    name: 'Finance Specialist',
    color: '#a78bfa',
    prompt: 'You are the Finance Specialist for Dyson & Dyson. You watch the money. You handle: featured agent revenue, production cost dashboard, HeyGen credit monitoring, fee math (25% sending, 10-15% Dyson). You advise, you do not rebuild the app. Keep responses concise and actionable.',
  },
  canon: {
    name: 'Canon Specialist',
    color: '#3b82f6',
    prompt: 'You are the Canon Specialist for Dyson & Dyson. You own master files, brand voice, customer profiles, service catalog, and company history. You handle: CURSOR.md, brand voice, ICPs, service catalog, company history. Keep responses concise and actionable.',
  },
  playbook: {
    name: 'Playbook Specialist',
    color: '#10b981',
    prompt: 'You are the Playbook Specialist for Dyson & Dyson. You write the five operating procedures: lead management, property research, client communication, document preparation, follow-up automation. Keep responses concise and actionable.',
  },
  conduit: {
    name: 'Conduit Specialist',
    color: '#8b5cf6',
    prompt: 'You are the Conduit Specialist for Dyson & Dyson. You own Gmail, Google Drive, Slack, Calendar, CRM, n8n, and Grok/Cursor webhooks. You handle connectors, Drive folder tree, webhook functions, Connect page. Never paste secrets. Keep responses concise and actionable.',
  },
};

// ── Orchestrator personas ──
const ORCHESTRATORS = {
  chief: { name: 'Chief of Staff', color: '#A78BFA', prompt: 'You are the Chief of Staff for Dyson & Dyson. Your job is to triage incoming requests from the admin and route them to the appropriate specialist for execution. You are the central coordinator — you do not do the work yourself, you dispatch it to the specialist who can.' },
  bob: { name: 'Bob Dyson', color: '#D4AF37', prompt: 'You are Bob Dyson, co-founder of Dyson & Dyson. You specialize in real estate strategy, market analysis, and relocation services. As a co-founder you can jump any task — either handle it directly with strategic guidance, or delegate to the appropriate specialist for execution.' },
  jay: { name: 'Jay', color: '#3B82F6', prompt: 'You are Jay, CTO and IT specialist for Dyson & Dyson. You manage the Base44 platform, integrations, automations, and technical infrastructure. As a co-founder you can jump any task — either handle it directly with technical guidance, or delegate to the appropriate specialist for execution.' },
};

const ROUTING_SCHEMA = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['delegate', 'respond_directly'] },
    specialist_id: {
      type: 'string',
      description: 'One of: marketing, operations, sales, dnn, finance, canon, playbook, conduit',
    },
    task: { type: 'string', description: 'The framed task for the specialist to execute' },
    reason: { type: 'string', description: 'Why this specialist was chosen' },
    response: { type: 'string', description: 'Direct response if action is respond_directly' },
  },
  required: ['action'],
};

// Log a dispatch to the GrokDispatch entity so the sidebar widget can surface it.
// Never throw — logging failures must not break the orchestration response.
async function logDispatch(base44, data) {
  try {
    await base44.entities.GrokDispatch.create(data);
  } catch (e) {
    console.error('Failed to log GrokDispatch:', e.message);
  }
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });

    const { message, conversation, orchestrator_id } = body;
    if (!message) return Response.json({ error: 'Missing message.' }, { status: 400 });

    const orchId = orchestrator_id || 'chief';
    const orch = ORCHESTRATORS[orchId] || ORCHESTRATORS.chief;

    // Build specialist list for the routing prompt
    const specialistList = Object.entries(SPECIALISTS)
      .map(([id, s]) => `- ${id}: ${s.name}`)
      .join('\n');

    // Build conversation context
    let convText = '';
    if (Array.isArray(conversation) && conversation.length > 0) {
      convText = conversation
        .map((t) => `${t.role === 'assistant' ? 'Grok' : 'Admin'}: ${t.content}`)
        .join('\n') + '\n\n';
    }

    // ── Step 1: Orchestrator routes the request ──
    const routingPrompt =
      `${orch.prompt}\n\n` +
      `You have these specialists available to delegate to:\n${specialistList}\n\n` +
      `The admin sent a message. Decide whether to delegate to a specialist or respond directly.\n` +
      `If the task requires execution (looking up data, drafting content, analyzing a situation, making a plan, answering a domain question), DELEGATE to the best specialist.\n` +
      `If it's a quick coordination question you can answer yourself, respond_directly.\n\n` +
      `${convText}Admin: ${message}`;

    const routingRes = await base44.integrations.Core.InvokeLLM({
      prompt: routingPrompt,
      response_json_schema: ROUTING_SCHEMA,
    });

    const decision = typeof routingRes === 'object' && routingRes !== null ? routingRes : null;
    if (!decision || !decision.action) {
      const failResponse = {
        orchestrator_id: orchId,
        orchestrator_response: 'Routing failed — orchestrator did not return a valid decision.',
        routing: null,
        specialist_id: null,
        specialist_name: null,
        specialist_response: null,
      };
      await logDispatch(base44, {
        admin_message: message,
        orchestrator_id: orchId,
        orchestrator_name: orch.name,
        orchestrator_color: orch.color,
        specialist_id: null,
        specialist_name: null,
        specialist_color: null,
        routing_reason: null,
        specialist_response: null,
        orchestrator_response: failResponse.orchestrator_response,
        action: 'respond_directly',
        status: 'failed',
      });
      return Response.json({ ...failResponse, error: 'Routing failed', raw: routingRes }, { status: 500 });
    }

    // ── If responding directly, log and return ──
    if (decision.action === 'respond_directly') {
      const orchResponse = decision.response || '(no response)';
      const result = {
        orchestrator_id: orchId,
        orchestrator_response: orchResponse,
        routing: decision,
        specialist_id: null,
        specialist_name: null,
        specialist_response: null,
      };
      await logDispatch(base44, {
        admin_message: message,
        orchestrator_id: orchId,
        orchestrator_name: orch.name,
        orchestrator_color: orch.color,
        specialist_id: null,
        specialist_name: null,
        specialist_color: null,
        routing_reason: decision.reason || null,
        specialist_response: null,
        orchestrator_response: orchResponse,
        action: 'respond_directly',
        status: 'completed',
      });
      return Response.json(result);
    }

    // ── Step 2: Delegate to the chosen specialist ──
    const specialist = SPECIALISTS[decision.specialist_id];
    if (!specialist) {
      const orchResponse = `I tried to delegate to "${decision.specialist_id}" but that specialist doesn't exist. ${decision.reason || ''}`;
      const result = {
        orchestrator_id: orchId,
        orchestrator_response: orchResponse,
        routing: decision,
        specialist_id: null,
        specialist_name: null,
        specialist_response: null,
      };
      await logDispatch(base44, {
        admin_message: message,
        orchestrator_id: orchId,
        orchestrator_name: orch.name,
        orchestrator_color: orch.color,
        specialist_id: decision.specialist_id,
        specialist_name: null,
        specialist_color: null,
        routing_reason: decision.reason || null,
        specialist_response: null,
        orchestrator_response: orchResponse,
        action: 'delegate',
        status: 'failed',
      });
      return Response.json(result);
    }

    const specialistRes = await base44.integrations.Core.InvokeLLM({
      prompt: `${specialist.prompt}\n\nTask from ${orch.name}: ${decision.task}\n\nProvide a concise, actionable response.`,
    });

    const specialistText =
      typeof specialistRes === 'string'
        ? specialistRes
        : specialistRes?.text || (typeof specialistRes === 'object' ? JSON.stringify(specialistRes) : String(specialistRes));

    const orchResponse = `📤 Routed to ${specialist.name} — ${decision.task}`;

    const result = {
      orchestrator_id: orchId,
      orchestrator_response: orchResponse,
      routing: decision,
      specialist_id: decision.specialist_id,
      specialist_name: specialist.name,
      specialist_response: specialistText,
    };

    await logDispatch(base44, {
      admin_message: message,
      orchestrator_id: orchId,
      orchestrator_name: orch.name,
      orchestrator_color: orch.color,
      specialist_id: decision.specialist_id,
      specialist_name: specialist.name,
      specialist_color: specialist.color,
      routing_reason: decision.reason || null,
      specialist_response: specialistText,
      orchestrator_response: orchResponse,
      action: 'delegate',
      status: 'completed',
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}