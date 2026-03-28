// Full Site Page Registry — Use page numbers for instant bug/feedback reference
// "Page 15 has a typo" = instant location identification across the entire platform

export const PAGE_REGISTRY = {
  // ========== PUBLIC / CLIENT PAGES ==========
  1: { name: 'Home', path: '/Home', section: 'Public' },
  2: { name: 'My Progress', path: '/Dashboard', section: 'Client' },
  3: { name: 'Chat with Charlie', path: '/Chat', section: 'Client' },
  4: { name: 'City Guide', path: '/CityGuide', section: 'Client' },
  5: { name: 'Property Search', path: '/Search', section: 'Client' },
  6: { name: 'Gemini Session', path: '/GeminiSession', section: 'Client' },
  7: { name: 'Explainers', path: '/Explainers', section: 'Public' },
  8: { name: 'Agent Explainer', path: '/AgentExplainer', section: 'Public' },
  9: { name: 'Relocation Intake', path: '/RelocationIntake', section: 'Client' },
  10: { name: 'Relocation Roadmap', path: '/RelocationRoadmap', section: 'Client' },
  11: { name: 'Property Comparison', path: '/PropertyComparison', section: 'Client' },
  12: { name: 'Action Steps', path: '/RelocationActionSteps', section: 'Client' },

  // ========== ADMIN PAGES ==========
  13: { name: 'Admin Dashboard', path: '/Admin', section: 'Admin' },
  14: { name: 'Owners List', path: '/AdminOwners', section: 'Admin' },
  15: { name: 'Owner Detail', path: '/AdminOwners/:ownerId', section: 'Admin' },
  16: { name: 'Clients List', path: '/AdminClients', section: 'Admin' },
  17: { name: 'Client Detail', path: '/AdminClients/:clientId', section: 'Admin' },
  18: { name: 'Listing Search', path: '/AdminListingSearch', section: 'Admin' },
  19: { name: 'Outreach Campaigns', path: '/AdminOutreachCampaigns', section: 'Admin' },
  20: { name: 'Flagged Conversations', path: '/AdminFlaggedConversations', section: 'Admin' },
  21: { name: 'Search Profiles', path: '/AdminSearchProfiles', section: 'Admin' },
  22: { name: 'Communications', path: '/AdminCommunications', section: 'Admin' },
  23: { name: 'Message Templates', path: '/AdminTemplates', section: 'Admin' },
  24: { name: 'Presentation Library', path: '/AdminPresentationLibrary', section: 'Admin' },
  25: { name: 'Referrals', path: '/AdminReferrals', section: 'Admin' },
  26: { name: 'Content Approval', path: '/AdminContentApproval', section: 'Admin' },
  27: { name: 'Interviews', path: '/AdminInterviews', section: 'Admin' },
  28: { name: "Charlie's Scripts", path: '/AdminCharlieScripts', section: 'Admin' },
  29: { name: 'Business Plan', path: '/BusinessPlan', section: 'Admin' },
  30: { name: 'Skip Trace Results', path: '/SkipTraceResults', section: 'Admin' },
  31: { name: 'Listing Agent Explainer', path: '/AdminListingAgentExplainer', section: 'Admin' },
  32: { name: 'Skip Trace Lookup', path: '/admin/skip-trace', section: 'Admin' },
  33: { name: 'Bulk Skip Trace', path: '/admin/bulk-skip-trace', section: 'Admin' },
  34: { name: 'Admin Client Detail', path: '/admin/client-detail', section: 'Admin' },
  35: { name: 'Admin Scripts', path: '/admin/scripts', section: 'Admin' },
  36: { name: 'Documents', path: '/AdminDocuments', section: 'Admin' },
};

// Helper function: Get page number by path
export const getPageNumberByPath = (path) => {
  const cleanPath = path.split('?')[0]; // Remove query params
  for (const [number, page] of Object.entries(PAGE_REGISTRY)) {
    // Exact match or dynamic route match
    if (page.path === cleanPath || page.path.split(':')[0] === cleanPath.split('/').slice(0, -1).join('/') + '/') {
      return number;
    }
  }
  return null;
};

// Helper function: Get page info by number
export const getPageByNumber = (number) => PAGE_REGISTRY[number];