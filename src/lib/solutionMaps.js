/**
 * Solution Map definitions — consumer-facing flows for client portal pages.
 * Internal desk flows live in departmentWorkflows.js; these are the
 * lighter, visitor-facing versions (like EXPLORE_FLOW in RoadMapEntry).
 *
 * Each flow: { title, color, stages: [{ id, title, plain }] }
 */

import { getFlow } from '@/lib/departmentWorkflows';

// ── Consumer-facing Solution Maps (not tied to an internal desk) ──

export const SOLUTION_MAPS = {
  // The signature landing flow — issue resolution
  solve_my_story: {
    title: 'Your Solution Map',
    color: '#D4AF37',
    stages: [
      { id: 'tell',      title: 'Tell Us',      plain: 'You share your real estate story.' },
      { id: 'triage',    title: 'Triage',      plain: 'We read it and route it to the right specialist.' },
      { id: 'diagnose',  title: 'Diagnose',    plain: 'We map the issue — escrow, title, contract, timing.' },
      { id: 'resolve',   title: 'Resolve',     plain: 'You get a clear, actionable resolution — no pitch.' },
    ],
  },

  // Full relocation lifecycle
  relocation: {
    title: 'Your Relocation Solution Map',
    color: '#10b981',
    stages: [
      { id: 'intake',    title: 'Intake',      plain: 'Tell us where, when, and what matters.' },
      { id: 'plan',      title: 'Plan',        plain: 'We map schools, housing, movers, and timing.' },
      { id: 'agents',   title: 'Agents',      plain: 'You choose from 3–5 vetted agents.' },
      { id: 'escrow',    title: 'Escrow',      plain: 'We watch the deadlines so nothing slips.' },
      { id: 'move',      title: 'Move',        plain: 'You arrive. We managed the rest.' },
    ],
  },

  // City discovery
  explore_city: {
    title: 'Your City Discovery Map',
    color: '#38bdf8',
    stages: [
      { id: 'discover',   title: 'Discover',   plain: 'Pick a city. See what life looks like.' },
      { id: 'schools',    title: 'Schools',    plain: 'We map the school districts.' },
      { id: 'housing',    title: 'Housing',    plain: 'We show what your budget buys.' },
      { id: 'healthcare', title: 'Healthcare', plain: 'We find the doctors and hospitals.' },
      { id: 'decide',     title: 'Decide',     plain: 'You choose — then we introduce agents.' },
    ],
  },

  // Agent matching
  find_agent: {
    title: 'Your Agent Matching Map',
    color: '#f59e0b',
    stages: [
      { id: 'request', title: 'Request',  plain: 'Tell us what you need in an agent.' },
      { id: 'vet',     title: 'Vet',     plain: 'We review license, production, personality.' },
      { id: 'options', title: 'Options',  plain: 'You see 3–5 vetted agents, not a dump.' },
      { id: 'choose',  title: 'Choose',   plain: 'You pick. We make the introduction.' },
      { id: 'refer',   title: 'Refer',    plain: 'The agent sells. We manage the move.' },
    ],
  },

  // Charlie escalation / chat
  ask_charlie: {
    title: 'Your Answer Map',
    color: '#a78bfa',
    stages: [
      { id: 'ask',       title: 'Ask',       plain: 'You ask Charlie a question.' },
      { id: 'route',     title: 'Route',     plain: 'Charlie answers or escalates to a human.' },
      { id: 'answer',    title: 'Answer',    plain: 'You get a real answer, not a deflection.' },
      { id: 'save',      title: 'Save',      plain: 'Good answers go to the knowledge base.' },
    ],
  },

  // My agent / handoff
  my_agent: {
    title: 'Your Handoff Map',
    color: '#10b981',
    stages: [
      { id: 'matched',    title: 'Matched',    plain: 'You and your agent are introduced.' },
      { id: 'first_touch', title: 'First Touch', plain: 'Agent reaches out within 4 hours.' },
      { id: 'working',    title: 'Working',   plain: 'Agent shows homes. We watch the timeline.' },
      { id: 'closed',     title: 'Closed',    plain: 'You move in. We close the file.' },
    ],
  },

  // Financial services / lender
  financing: {
    title: 'Your Financing Map',
    color: '#D4AF37',
    stages: [
      { id: 'prequal',  title: 'Pre-Qual',   plain: 'We connect you to a vetted lender.' },
      { id: 'approval', title: 'Approval',   plain: 'Loan goes through underwriting.' },
      { id: 'clear',    title: 'Clear to Close', plain: 'Lender clears the file.' },
      { id: 'fund',     title: 'Fund',       plain: 'Loan funds. Escrow closes.' },
    ],
  },

  // Corporate relocation
  corporate_relo: {
    title: 'Your Corporate Relo Map',
    color: '#38bdf8',
    stages: [
      { id: 'hr_intake', title: 'HR Intake',  plain: 'HR submits the relocating employee.' },
      { id: 'policy',   title: 'Policy',     plain: 'We align to the corporate relocation policy.' },
      { id: 'assign',   title: 'Assign',     plain: 'We assign a Relocation Manager.' },
      { id: 'move',     title: 'Move',       plain: 'Employee moves. We manage every step.' },
    ],
  },

  // Partner / agent subscribe
  partner_join: {
    title: 'Your Partner Onboarding Map',
    color: '#f59e0b',
    stages: [
      { id: 'subscribe', title: 'Subscribe',  plain: 'You join the network.' },
      { id: 'vetted',    title: 'Vetted',     plain: 'We review your license and production.' },
      { id: 'roster',    title: 'Roster',      plain: 'You go on the national roster.' },
      { id: 'referral',  title: 'Referral',    plain: 'You get your first referral handoff.' },
    ],
  },
};

/**
 * Get a solution map by id.
 * Falls back to internal department flows (marketing, operations, sales, dnn, finance, knowledge)
 * so admin pages can use the same component.
 */
export function getSolutionMap(id) {
  if (SOLUTION_MAPS[id]) return SOLUTION_MAPS[id];
  const deptFlow = getFlow(id);
  if (deptFlow) {
    return {
      title: deptFlow.title || id,
      color: getDeptColor(id),
      stages: deptFlow.stages.map(s => ({ id: s.id, title: s.title, plain: s.plain || s.title })),
    };
  }
  return null;
}

function getDeptColor(id) {
  const colors = {
    marketing: '#D4AF37',
    operations: '#10b981',
    sales: '#f59e0b',
    dnn: '#38bdf8',
    finance: '#a78bfa',
    knowledge: '#3b82f6',
  };
  return colors[id] || '#D4AF37';
}