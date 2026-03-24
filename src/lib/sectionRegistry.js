// Section Registry — granular content block IDs across all pages
// Format: #101, #102... so they're distinct from page-level IDs (1–99)
// Each section has: id, label, path (route), anchor (scroll target), file (source file for devs)

export const SECTION_REGISTRY = {
  // ── HOME PAGE ──────────────────────────────────
  101: { label: 'Home: Hero / Charlie Intro',        path: '/Home',        anchor: 'home-hero',          file: 'pages/Home' },
  102: { label: 'Home: How It Works Steps',          path: '/Home',        anchor: 'home-how-it-works',  file: 'pages/Home' },
  103: { label: 'Home: Service Cards Grid',          path: '/Home',        anchor: 'home-services',      file: 'pages/Home' },
  104: { label: 'Home: Bob Dyson Bio',               path: '/Home',        anchor: 'home-bio',           file: 'pages/Home' },
  105: { label: 'Home: Agent Recruitment',           path: '/Home',        anchor: 'home-agents',        file: 'pages/Home' },
  106: { label: 'Home: AI Orchestration Grid',       path: '/Home',        anchor: 'home-ai-grid',       file: 'pages/Home' },

  // ── DASHBOARD ─────────────────────────────────
  201: { label: 'Dashboard: Hero / Welcome',         path: '/Dashboard',   anchor: 'dash-hero',          file: 'pages/Dashboard' },
  202: { label: 'Dashboard: Relocation Profile Card',path: '/Dashboard',   anchor: 'dash-profile',       file: 'components/dashboard/RelocationProfileCard' },
  203: { label: 'Dashboard: Quick Nav Cards',        path: '/Dashboard',   anchor: 'dash-nav',           file: 'pages/Dashboard' },
  204: { label: 'Dashboard: Task Timeline',          path: '/Dashboard',   anchor: 'dash-tasks',         file: 'components/dashboard/TaskTimeline' },

  // ── CITY GUIDE ────────────────────────────────
  301: { label: 'City Guide: Preview / Gate Hero',   path: '/CityGuide',   anchor: 'guide-hero',         file: 'pages/CityGuide' },
  302: { label: 'City Guide: 6 Category Cards',      path: '/CityGuide',   anchor: 'guide-categories',   file: 'pages/CityGuide' },
  303: { label: 'City Guide: How It Unlocks Steps',  path: '/CityGuide',   anchor: 'guide-unlock',       file: 'pages/CityGuide' },
  304: { label: 'City Guide: Urgent Request Box',    path: '/CityGuide',   anchor: 'guide-urgent',       file: 'pages/CityGuide' },
  305: { label: 'City Guide: Full Research Mode',    path: '/CityGuide',   anchor: 'guide-full',         file: 'pages/CityGuide' },

  // ── CHAT ──────────────────────────────────────
  401: { label: 'Chat: Charlie Interface',           path: '/Chat',        anchor: 'chat-interface',     file: 'components/charlie/ChatInterface' },

  // ── ADMIN CLIENT DETAIL ───────────────────────
  501: { label: 'Admin Client: Profile Tab',         path: '/AdminClients/:clientId', anchor: 'client-profile',   file: 'components/admin/client-detail/ClientProfileTab' },
  502: { label: 'Admin Client: Chat Tab',            path: '/AdminClients/:clientId', anchor: 'client-chat',      file: 'components/admin/client-detail/ClientChatTab' },
  503: { label: 'Admin Client: Session Monitor',     path: '/AdminClients/:clientId', anchor: 'client-session',   file: 'components/admin/client-detail/ClientSessionMonitor' },
  504: { label: 'Admin Client: Transaction Timeline',path: '/AdminClients/:clientId', anchor: 'client-timeline',  file: 'components/admin/client-detail/ClientTransactionTimeline' },
  505: { label: 'Admin Client: Gemini Tab',          path: '/AdminClients/:clientId', anchor: 'client-gemini',    file: 'components/admin/client-detail/ClientGeminiTab' },

  // ── ADMIN OWNERS ──────────────────────────────
  601: { label: 'Admin Owners: List',                path: '/AdminOwners', anchor: 'owners-list',        file: 'pages/AdminOwners' },
  602: { label: 'Admin Owners: Campaign Panel',      path: '/AdminOwners', anchor: 'owners-campaign',    file: 'components/admin/OutreachWorkflow' },

  // ── CHARLIE SCRIPTS ───────────────────────────
  701: { label: "Charlie Scripts: Script List",      path: '/AdminCharlieScripts', anchor: 'scripts-list',  file: 'pages/AdminCharlieScripts' },
  702: { label: "Charlie Scripts: Script Editor",    path: '/AdminCharlieScripts', anchor: 'scripts-editor',file: 'pages/AdminCharlieScripts' },
};

export const getSectionById = (id) => SECTION_REGISTRY[parseInt(id)];

export const getSectionsByPath = (path) =>
  Object.entries(SECTION_REGISTRY)
    .filter(([, s]) => s.path === path || (s.path.includes(':') && path.startsWith(s.path.split(':')[0])))
    .map(([id, s]) => ({ id: parseInt(id), ...s }));