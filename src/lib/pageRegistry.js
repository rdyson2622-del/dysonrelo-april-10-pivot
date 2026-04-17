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
   14: { name: 'Search Listing Profiles', path: '/admin/search-profiles', section: 'Admin' },
   15: { name: 'Skip Trace Lookup', path: '/admin/skip-trace', section: 'Admin' },
   16: { name: 'Outreach Pipeline', path: '/admin/outreach-pipeline', section: 'Admin' },
   17: { name: 'Compose SMS', path: '/admin/compose-sms', section: 'Admin' },
   18: { name: 'Owner Response Board', path: '/admin/owner-kanban', section: 'Admin' },
   19: { name: 'Batch SMS Logs', path: '/admin/batch-sms-log', section: 'Admin' },
   20: { name: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns', section: 'Admin' },
   21: { name: 'Outreach Analytics', path: '/admin/outreach-analytics', section: 'Admin' },
   22: { name: 'SMS Sequences', path: '/admin/sms-sequences', section: 'Admin' },
   23: { name: 'Listing Owners Info', path: '/admin/owners', section: 'Admin' },
   24: { name: 'Clients List', path: '/admin/clients', section: 'Admin' },
   25: { name: 'Client Detail', path: '/admin/client-detail', section: 'Admin' },
   26: { name: 'Presentation Library', path: '/admin/presentation-library', section: 'Admin' },
   27: { name: 'Flagged Conversations', path: '/admin/flagged-conversations', section: 'Admin' },
   28: { name: 'Referral Management', path: '/admin/referrals', section: 'Admin' },
   29: { name: "Charlie's Scripts", path: '/admin/charlie-scripts', section: 'Admin' },
   30: { name: "Charlie's Knowledge Base", path: '/admin/charlie-knowledge-base', section: 'Admin' },
   31: { name: "Charlie's Escalations", path: '/admin/charlie-escalations', section: 'Admin' },
   32: { name: 'Bulk Skip Trace', path: '/admin/bulk-skip-trace', section: 'Admin' },
   33: { name: 'Target Audiences', path: '/admin/target-audiences', section: 'Admin' },
   34: { name: 'Marketing Campaigns', path: '/admin/marketing-campaigns', section: 'Admin' },
   35: { name: 'Campaign Roadmap', path: '/admin/campaign-roadmap', section: 'Admin' },
   36: { name: 'Social Media Launch', path: '/admin/social-launch', section: 'Admin' },
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