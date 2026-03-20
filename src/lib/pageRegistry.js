// Full Site Page Registry — Use page numbers for instant bug/feedback reference
// "Page 15 has a typo" = instant location identification across the entire platform

export const PAGE_REGISTRY = {
  // ========== PUBLIC / CLIENT PAGES ==========
  1: { name: 'Home', path: '/', section: 'Public' },
  2: { name: 'Dashboard', path: '/Dashboard', section: 'Client' },
  3: { name: 'Chat with Charlie', path: '/Chat', section: 'Client' },
  4: { name: 'City Guide', path: '/CityGuide', section: 'Client' },
  5: { name: 'Property Search', path: '/Search', section: 'Client' },
  6: { name: 'Gemini Session', path: '/GeminiSession', section: 'Client' },
  7: { name: 'Explainers', path: '/Explainers', section: 'Public' },
  8: { name: 'Agent Explainer', path: '/AgentExplainer', section: 'Public' },

  // ========== ADMIN PAGES ==========
  9: { name: 'Admin Dashboard', path: '/Admin', section: 'Admin' },
  10: { name: 'Owners List', path: '/AdminOwners', section: 'Admin' },
  11: { name: 'Owner Detail', path: '/AdminOwners/:ownerId', section: 'Admin' },
  12: { name: 'Clients List', path: '/AdminClients', section: 'Admin' },
  13: { name: 'Client Detail', path: '/AdminClients/:clientId', section: 'Admin' },
  14: { name: 'Listing Search', path: '/AdminListingSearch', section: 'Admin' },
  15: { name: 'Outreach Campaigns', path: '/AdminOutreachCampaigns', section: 'Admin' },
  16: { name: 'Flagged Conversations', path: '/AdminFlaggedConversations', section: 'Admin' },
  17: { name: 'Search Profiles', path: '/AdminSearchProfiles', section: 'Admin' },
  18: { name: 'Communications', path: '/AdminCommunications', section: 'Admin' },
  19: { name: 'Message Templates', path: '/AdminTemplates', section: 'Admin' },
  20: { name: 'Presentation Library', path: '/AdminPresentationLibrary', section: 'Admin' },
  21: { name: 'Referrals', path: '/AdminReferrals', section: 'Admin' },
  22: { name: 'Content Approval', path: '/AdminContentApproval', section: 'Admin' },
  23: { name: 'Interviews', path: '/AdminInterviews', section: 'Admin' },
  24: { name: "Charlie's Scripts", path: '/AdminCharlieScripts', section: 'Admin' },
  25: { name: 'Business Plan', path: '/BusinessPlan', section: 'Admin' },
  26: { name: 'Skip Trace Results', path: '/SkipTraceResults', section: 'Admin' },
  27: { name: 'Listing Agent Explainer', path: '/AdminListingAgentExplainer', section: 'Admin' },
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