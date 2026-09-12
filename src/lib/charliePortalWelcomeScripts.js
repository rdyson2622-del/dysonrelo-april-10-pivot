/**
 * charliePortalWelcomeScripts.js
 * 
 * Single source of truth for Charlie Simmons' custom Welcome Back messages
 * across all 6 subscriber portals:
 * 1. Client Portal (Relocating Family / Client)
 * 2. Corporate Relo / HR Desk Portal
 * 3. Broker Portal (Wisdom Properties & Brokerage Partners)
 * 4. Active Relocation Agent Portal (PRN Affiliate Agent)
 * 5. Referral Agent Portal (Affiliate Referral Network)
 * 6. Vendor Portal (Vetted Vendor & Financial Services)
 * 
 * Every script strictly concludes with the exact required mandate:
 * "All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit."
 */

export const CHARLIE_PORTAL_WELCOME_SCRIPTS = {
  client: {
    portalId: 'client',
    roleLabel: 'SUBSCRIBER • RELOCATING FAMILY',
    portalTitle: 'Client Relocation Portal',
    badge: 'Fiduciary Relocation Hub',
    welcomeHeading: 'Welcome back to your Relocation Portal',
    script: "Welcome back! I'm Charlie Simmons, your AI Concierge at Dyson & Dyson. We've updated your fiduciary relocation roadmap with your latest destination market data, vetted local agents, and timeline milestones. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
  hr: {
    portalId: 'hr',
    roleLabel: 'SUBSCRIBER • HR DESK',
    portalTitle: 'Corporate Relocation Desk',
    badge: 'Executive Relocation Hub',
    welcomeHeading: 'Welcome back to the Corporate Relocation Desk',
    script: "Welcome back to the Corporate Relocation Desk! I'm Charlie Simmons. Your executive employee relocation files, policy compliance tracking, and direct tax-differential tools are ready for review. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
  broker: {
    portalId: 'broker',
    roleLabel: 'SUBSCRIBER • BROKER DESK',
    portalTitle: 'Brokerage Command Portal',
    badge: 'Wisdom Properties • Pilot Brokerage',
    welcomeHeading: 'Welcome back to your Brokerage Portal',
    script: "Welcome back to your Brokerage Command Portal! I'm Charlie Simmons. Your escrow pipelines, agent production rosters, transaction audit files, and luxury syndication tools are up to the minute. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
  agent: {
    portalId: 'agent',
    roleLabel: 'SUBSCRIBER • PRN AGENT',
    portalTitle: 'PRN Relocation Agent Portal',
    badge: 'Vetted Referral Network',
    welcomeHeading: 'Welcome back to your Agent Portal',
    script: "Welcome back to your PRN Agent Portal! I'm Charlie Simmons. Your inbound vetted referral leads, active client workfiles, and pipeline tracking are synchronized and ready. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
  referral_agent: {
    portalId: 'referral_agent',
    roleLabel: 'SUBSCRIBER • REFERRAL AGENT',
    portalTitle: 'Referral Agent Portal',
    badge: 'Affiliate Referral Network',
    welcomeHeading: 'Welcome back to your Referral Portal',
    script: "Welcome back to your Referral Agent Portal! I'm Charlie Simmons. Your referral pipeline, commission tracking, buyer-broker handoffs, and agreements are ready at your fingertips. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
  vendor: {
    portalId: 'vendor',
    roleLabel: 'SUBSCRIBER • VETTED VENDOR',
    portalTitle: 'Vetted Vendor & Partner Desk',
    badge: 'Fiduciary Service Partner',
    welcomeHeading: 'Welcome back to the Vendor Partner Desk',
    script: "Welcome back to the Dyson & Dyson Vetted Partner Desk! I'm Charlie Simmons. Your territory dispatch, fiduciary service requests, lender and title integrations, and mutual client milestones are active. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
  },
};

/**
 * Resolves which portal role is active based on current URL pathname and sessionStorage role.
 */
export function getActivePortalRole(pathname = '', savedRole = '') {
  const path = (pathname || '').toLowerCase();
  const role = (savedRole || '').toLowerCase();

  if (role === 'hr' || path.includes('corporate-relo')) return 'hr';
  if (role === 'broker' || path.includes('/broker') || path.includes('broker-portal')) return 'broker';
  if (role === 'agent' || path.includes('agent-command') || path.includes('sending-agent') || (path.includes('find-agent') && role === 'agent')) return 'agent';
  if (role === 'referral_agent' || path.includes('referral-agent') || path.includes('referral-process') || path.includes('referral-forms') || (path.includes('partner-benefits') && role === 'referral_agent')) return 'referral_agent';
  if (role === 'vendor' || path.includes('financial-services') || path.includes('vendor') || (path.includes('search') && role === 'vendor')) return 'vendor';

  // Default to client portal
  return 'client';
}