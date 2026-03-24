// Section Registry — cleared for rebuild
// Will be expanded to cover every page in the app with Smart Search support

export const SECTION_REGISTRY = {};

export const getSectionById = (id) => SECTION_REGISTRY[id] || null;

export const getSectionsByPath = (path) => {
  const cleanPath = path.split('?')[0];
  return Object.entries(SECTION_REGISTRY)
    .filter(([, s]) => s.path === cleanPath || s.path.split(':')[0] === cleanPath.split('/').slice(0, -1).join('/') + '/')
    .map(([id, s]) => ({ id: parseInt(id), ...s }));
};