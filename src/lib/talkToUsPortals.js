/**
 * Per-portal copy + audience context for the universal "Talk to us" pill.
 * Keyed by the same roleKey values RoleSelector stores in sessionStorage
 * ('dyson_role'), so the pill and the LLM behind it both know who they're
 * talking to without the visitor having to say so.
 */
export const TALK_TO_US_PORTALS = {
  client: {
    context: 'client_portal',
    pillLabel: 'Ask Your Concierge',
    panelTitle: "Tell Your Concierge What You Need",
    placeholder: "Take your time — describe your situation in your own words. e.g. \"My deal is stuck in escrow\" or \"I need help finding a home in Austin.\"",
    audience: 'a relocating or prospective client using the Dyson & Dyson concierge portal',
  },
  agent: {
    context: 'agent_portal',
    pillLabel: 'Message the Agent Desk',
    panelTitle: "Tell The Agent Desk What You Need",
    placeholder: "Take your time — ask about a referral match, a client handoff, or anything about the network.",
    audience: 'an active real estate agent inside the Dyson & Dyson vetted agent network',
  },
  referral_agent: {
    context: 'agent_portal',
    pillLabel: 'Message the Referral Desk',
    panelTitle: "Tell The Referral Desk What You Need",
    placeholder: "Take your time — ask about a referral fee, a client you're sending us, or anything else.",
    audience: 'a referring agent or broker sending a client to Dyson & Dyson for a 25% referral fee',
  },
  vendor: {
    context: 'vendor_portal',
    pillLabel: 'Message the Vendor Desk',
    panelTitle: "Tell The Vendor Desk What You Need",
    placeholder: "Take your time — ask about a job, a client property, or anything else.",
    audience: 'a relocation vendor (mover, inspector, contractor) supporting a Dyson & Dyson relocation',
  },
  hr: {
    context: 'corporate_relo',
    pillLabel: 'Ask About Your Move',
    panelTitle: "Tell Us About Your Employee's Move",
    placeholder: "Take your time — describe your employee's situation or ask us anything about the zero-fee program.",
    audience: 'an HR or corporate relocation manager evaluating or using the zero management-fee relocation program',
  },
  brokerage_admin: {
    context: 'brokerage_portal',
    pillLabel: 'Message Your Brokerage Team',
    panelTitle: "Tell Your Brokerage Team What You Need",
    placeholder: "Take your time — ask about an escrow, a listing, an agent, or anything else.",
    audience: 'a brokerage admin or broker using their subscribed Dyson & Dyson brokerage portal',
  },
  general: {
    context: 'general',
    pillLabel: 'Ask Us Anything',
    panelTitle: "Tell Us What You Need",
    placeholder: "Take your time — describe your situation in your own words. e.g. \"My deal is stuck in escrow\" or \"I need an agent in Austin.\"",
    audience: 'a website visitor exploring Dyson & Dyson services',
  },
};

export function getTalkToUsPortal(roleKey) {
  return TALK_TO_US_PORTALS[roleKey] || TALK_TO_US_PORTALS.general;
}