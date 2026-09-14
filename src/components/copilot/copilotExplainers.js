/**
 * Canned prompt pill explainer mapping for DysonHomes Copilot (Pages 2 & 3).
 * Maps specific prompt pills to verified existing MP4 assets already shipped in the platform.
 * Pills without an MP4 remain text-only as per instructions.
 */

export const COPILOT_EXPLAINERS = [
  {
    id: 'closing_rebate',
    label: 'How does Dyson & Dyson protect buyers?',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker Solutions Take',
    topic: 'Fiduciary Contingency Shields & Due Diligence',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/3400475d9_bobanswer_6a5d2e96818523aa8749508e.mp4',
    textAnswer: 'Our fiduciary desk acts as an independent second set of eyes. We review public records, permit history, coastal hazard zones, and contingency timelines to ensure your earnest money deposit is 100% protected before you sign.',
  },
  {
    id: 'hidden_risks',
    label: 'How do you find hidden property risks?',
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    speakerRole: 'AI Concierge Explainer',
    topic: 'Independent Fiduciary Second-Opinion Audit',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/6f622bb1c_charlie_avatar_clean_vet.mp4',
    textAnswer: 'Listing agents represent the seller. When you share any property address, we pull unvarnished public records, permit histories, flood risk zones, topography, and comps to identify risks before you write an offer.',
  },
  {
    id: 'who_is_dyson',
    label: 'Who is Dyson & Dyson?',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Founder & Principal Broker',
    topic: '55+ Years of Real Estate Leadership',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/a4a2013f3_bobanswer_6a5d2e96818523aa87495089.mp4',
    textAnswer: 'Dyson & Dyson is an independent relocation concierge management firm founded by Bob Dyson (CA DRE #00609384), former founder who grew Red Carpet Corporation to 1,600+ offices nationwide.',
  },
  {
    id: 'bob_solutions_traps',
    label: "Bob's Take: Escrow & Deal Traps",
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker Solutions Take',
    topic: 'Managing Complex Contingencies & Escrow Snags',
    videoUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/94b83e0f7_reqa_6a5272697665dffe7b165e0d_bob.mp4',
    textAnswer: 'When an escrow is stuck—appraisal shortfalls, repair disputes, or financing snags—our fiduciary desk steps in alongside your local agent with decades of deal-structuring expertise.',
  },
];

export function findExplainerByQuery(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return COPILOT_EXPLAINERS.find(e => 
    q.includes(e.label.toLowerCase()) || 
    e.label.toLowerCase().includes(q) ||
    (q.includes('thousands back') && e.id === 'closing_rebate') ||
    (q.includes('hidden') && q.includes('risk') && e.id === 'hidden_risks') ||
    (q.includes('who is') && (q.includes('dyson') || q.includes('bob')) && e.id === 'who_is_dyson') ||
    ((q.includes('bob') || q.includes('solution') || q.includes('trap')) && e.id === 'bob_solutions_traps')
  ) || null;
}