const SAMPLES = [
  {
    match: '742 vista del mar',
    fullAddress: '742 Vista Del Mar, La Jolla, CA 92037',
    shortAddress: '742 Vista Del Mar',
    address: { city: 'La Jolla', state: 'CA', zip: '92037' },
    level3Example: {
      focus: 'Coastal Property Search Example',
      summary: 'A demonstration of how CoPilot organizes coastal due diligence before a buyer relies on a listing.',
      checkpoints: ['Coastal and geotechnical review', 'View and condition adjustments for comparable sales', 'Insurance and disclosure verification'],
      workProduct: 'A focused property brief that separates verified facts, open questions, and items requiring a licensed specialist.'
    }
  },
  {
    match: '1844 mountain shadow way',
    fullAddress: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    shortAddress: '1844 Mountain Shadow Way',
    address: { city: 'Scottsdale', state: 'AZ', zip: '85253' },
    level3Example: {
      focus: 'Desert Property Search Example',
      summary: 'A demonstration of how CoPilot frames desert-home research before inspections and offer decisions.',
      checkpoints: ['Heat, drainage, and site-condition review', 'Roof, HVAC, and major-system verification', 'HOA, insurance, and comparable-sale context'],
      workProduct: 'A decision-ready search brief showing what is known, what remains unverified, and what the buyer should investigate next.'
    }
  }
];

export function getChiefPilotSampleProperty(query = '') {
  const normalized = query.trim().toLowerCase();
  const sample = SAMPLES.find(item => normalized.includes(item.match));
  return sample ? { ...sample, isExample: true } : null;
}