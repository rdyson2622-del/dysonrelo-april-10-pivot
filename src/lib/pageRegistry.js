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
  13: { name: 'Admin Dashboard', path: '/admin', section: 'Admin' },
  14: { name: 'Owners List', path: '/admin/owners', section: 'Admin' },
  15: { name: 'Owner Detail', path: '/admin/owners/:ownerId', section: 'Admin' },
  16: { name: 'Clients List', path: '/admin/clients', section: 'Admin' },
  17: { name: 'Client Detail', path: '/admin/client-detail', section: 'Admin' },
  18: { name: 'Outreach Campaigns', path: '/admin/outreach-campaigns', section: 'Admin' },
  19: { name: 'Outreach Pipeline', path: '/admin/outreach-pipeline', section: 'Admin' },
  20: { name: 'Flagged Conversations', path: '/admin/flagged-conversations', section: 'Admin' },
  21: { name: 'Search Profiles', path: '/admin/search-profiles', section: 'Admin' },
  22: { name: 'Communications', path: '/admin/communications', section: 'Admin' },
  23: { name: 'Presentation Library', path: '/admin/presentation-library', section: 'Admin' },
  24: { name: 'Referrals', path: '/admin/referrals', section: 'Admin' },
  25: { name: "Charlie's Scripts", path: '/admin/charlie-scripts', section: 'Admin' },
  26: { name: 'Skip Trace Lookup', path: '/admin/skip-trace', section: 'Admin' },
  27: { name: 'Bulk Skip Trace', path: '/admin/bulk-skip-trace', section: 'Admin' },
  28: { name: 'Target Audiences', path: '/admin/target-audiences', section: 'Admin' },
  29: { name: 'Marketing Campaigns', path: '/admin/marketing-campaigns', section: 'Admin' },
  30: { name: 'Campaign Roadmap', path: '/admin/campaign-roadmap', section: 'Admin' },
  31: { name: 'Social Media Launch', path: '/admin/social-launch', section: 'Admin' },
  32: { name: 'Business Plan', path: '/business-plan', section: 'Admin' },
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