// Master Page ID Map
// Sections are tagged with <SectionBadge id={N} /> and id="N" on their wrapper element.
// Format: { label, path, anchor }

export const SECTION_REGISTRY = {
  // ── 100s: Consumer Home Page ──────────────────────────────
  101: { label: 'Hero Section (Main Title)',         path: '/Home',            anchor: '101' },
  102: { label: 'Charlie Intro Chat',                path: '/Home',            anchor: '102' },
  103: { label: 'The Dyson Promise (Cards)',          path: '/Home',            anchor: '103' },
  104: { label: 'The Gemini Session Explainer',       path: '/Home',            anchor: '104' },
  105: { label: "Bob Dyson Bio",                      path: '/Home',            anchor: '105' },
  106: { label: 'Agent Selection Process',            path: '/Home',            anchor: '106' },

  // ── 200s: Admin Portal ────────────────────────────────────
  201: { label: 'Admin Overview (Dashboard)',         path: '/Admin',           anchor: '201' },
  202: { label: 'Search Listing Profiles',            path: '/AdminSearchProfiles', anchor: '202' },
  203: { label: 'Partner Access Portal',              path: '/AdminSearchProfiles', anchor: '203' },
  204: { label: 'Listing Owners Info',                path: '/AdminOwners',     anchor: '204' },
  205: { label: "Charlie's Scripts Library",          path: '/AdminCharlieScripts', anchor: '205' },

  // ── 300s: City Guide & Research ───────────────────────────
  301: { label: 'City Guide Search Input',            path: '/CityGuide',       anchor: '301' },
  302: { label: 'Research Category Grid (6 Boxes)',   path: '/CityGuide',       anchor: '302' },
  303: { label: 'Urgent Medical/School Request Form', path: '/CityGuide',       anchor: '303' },
};

export const getSectionById = (id) => SECTION_REGISTRY[id] || null;

export const getSectionsByPath = (path) => {
  return Object.entries(SECTION_REGISTRY)
    .filter(([, s]) => s.path === path)
    .map(([id, s]) => ({ id: parseInt(id), ...s }));
};