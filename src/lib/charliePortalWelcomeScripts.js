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
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=bab1cfa3-46c8-4fde-a086-6a803660240c.wav",
  },
  hr: {
    portalId: 'hr',
    roleLabel: 'SUBSCRIBER • HR DESK',
    portalTitle: 'Corporate Relocation Desk',
    badge: 'Executive Relocation Hub',
    welcomeHeading: 'Welcome back to the Corporate Relocation Desk',
    script: "Welcome back to the Corporate Relocation Desk! I'm Charlie Simmons. Your executive employee relocation files, policy compliance tracking, and direct tax-differential tools are ready for review. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=c8548638-d204-4b91-8b58-cb4bc61a570d.wav",
  },
  broker: {
    portalId: 'broker',
    roleLabel: 'SUBSCRIBER • BROKER DESK',
    portalTitle: 'Brokerage Command Portal',
    badge: 'Wisdom Properties • Pilot Brokerage',
    welcomeHeading: 'Welcome back to your Brokerage Portal',
    script: "Welcome back to your Brokerage Command Portal! I'm Charlie Simmons. Your escrow pipelines, agent production rosters, transaction audit files, and luxury syndication tools are up to the minute. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=870e231a-aa8c-4c92-b94f-b59a98e7b4f4.wav",
  },
  agent: {
    portalId: 'agent',
    roleLabel: 'SUBSCRIBER • PRN AGENT',
    portalTitle: 'PRN Relocation Agent Portal',
    badge: 'Vetted Referral Network',
    welcomeHeading: 'Welcome back to your Agent Portal',
    script: "Welcome back to your PRN Agent Portal! I'm Charlie Simmons. Your inbound vetted referral leads, active client workfiles, and pipeline tracking are synchronized and ready. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=9496300c-2f4c-401c-b87d-1bc09871c713.wav",
  },
  referral_agent: {
    portalId: 'referral_agent',
    roleLabel: 'SUBSCRIBER • REFERRAL AGENT',
    portalTitle: 'Referral Agent Portal',
    badge: 'Affiliate Referral Network',
    welcomeHeading: 'Welcome back to your Referral Portal',
    script: "Welcome back to your Referral Agent Portal! I'm Charlie Simmons. Your referral pipeline, commission tracking, buyer-broker handoffs, and agreements are ready at your fingertips. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=04ec29de-8449-416f-ae99-d924e7253eeb.wav",
  },
  vendor: {
    portalId: 'vendor',
    roleLabel: 'SUBSCRIBER • VETTED VENDOR',
    portalTitle: 'Vetted Vendor & Partner Desk',
    badge: 'Fiduciary Service Partner',
    welcomeHeading: 'Welcome back to the Vendor Partner Desk',
    script: "Welcome back to the Dyson & Dyson Vetted Partner Desk! I'm Charlie Simmons. Your territory dispatch, fiduciary service requests, lender and title integrations, and mutual client milestones are active. All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit.",
    audioUrl: "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=574cae29-c8f2-44b9-a6e4-1a75eb545104.wav",
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