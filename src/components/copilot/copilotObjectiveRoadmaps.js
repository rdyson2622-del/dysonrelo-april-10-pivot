export const OBJECTIVE_ROADMAPS = {
  dossier: {
    title: 'Property audit objective',
    milestones: ['Verify property', 'Review comps', 'Review risks', 'Confirm diligence', 'Set offer position']
  },
  vetting: {
    title: 'Independent agent objective',
    milestones: ['Define representation', 'Review candidates', 'Interview agents', 'Confirm terms', 'Select agent']
  },
  roadmap: {
    title: 'Transaction move objective',
    milestones: ['Property audit', 'Agent pairing', 'Offer strategy', 'Open escrow', 'Inspect and title', 'Finance', 'Close']
  },
  escrow: {
    title: 'Escrow protection objective',
    milestones: ['Open file', 'Verify deposit', 'Review contingencies', 'Review title', 'Authorize closing']
  },
  solutions: {
    title: 'Advisory solution objective',
    milestones: ['Define issue', 'Collect facts', 'Review options', 'Choose action', 'Confirm outcome']
  }
};

export function createObjectiveProject(door, requestText = '') {
  const template = OBJECTIVE_ROADMAPS[door] || OBJECTIVE_ROADMAPS.solutions;
  return {
    id: `${door}-${Date.now()}`,
    door,
    title: template.title,
    requestText,
    createdAt: new Date().toISOString(),
    milestones: template.milestones.map((title, index) => ({ id: `${door}-${index + 1}`, title, status: 'pending' }))
  };
}