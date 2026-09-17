/**
 * Voice Briefing Strategy Configuration for the 4 Core Execution Doors:
 * 1. Property Audit (Charlie Simmons - Concierge & Valuation Desk)
 * 2. Agent Vetting (Bob Dyson - Principal Broker Fiduciary Standards)
 * 3. Move Roadmap (Charlie Simmons - AI Concierge & Process Director)
 * 4. Escrow Watch (Bob Dyson - Principal Broker Solutions Take)
 */

export const BOB_AVATAR = 'https://files2.heygen.ai/talking_photo/31b79a86784e495090472af2e7b9407c/5c0bde249fe348bb8b9dfb07299f608c.WEBP?Expires=1789606882&Signature=YUNW1j0tU8LsI1vb0JnPSMwCFFhUwdI2U1MoECnlYvthEhenxAfg-ws0S6jibQKfxBhXSRobys8qEkDXU-WvfEi4rH1Sej4yZCwxgjlxPNNv9XjJgaTpZDeeMYzQC8A5cLTT3-l~u5Jy~zeoIlaRFJGM2yu4vTRxo2Ul0fPWg4dK-10LrLqrsFrxEITI1uvRsyfP5ysTm1J7HaW9pCVY~1~1z2HB1zmNuMsVYcCowXhZWfyyOAsPySSciYJfIkFN6Xw16C~n7mK1B5twxKAPjW-yV0Cq8H~wCvqAUr9BbBZpTut1jy1kHtWCEmRiju1M-sQOb4ymWXlvLHxP71xlpA__&Key-Pair-Id=K38HBHX5LX3X2H';
export const CHARLIE_AVATAR = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';

export const DOOR_AUDIO_BRIEFINGS = {
  dossier: {
    id: 'dossier',
    doorName: 'Property Audit',
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    speakerRole: 'AI Concierge & Valuation Desk',
    avatar: CHARLIE_AVATAR,
    accentColor: '#10b981',
    title: 'Property Audit Briefing',
    subtitle: 'Independent comps, tax records & environmental disclosures',
    audioUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/6f622bb1c_charlie_avatar_clean_vet.mp4',
    spokenText: 'Charlie here. You are now reviewing the Property Audit for this home. We have pulled unvarnished comparable sales, tax records, and hazard disclosures so you have an independent, transparent second-look before discussing offer terms.',
    promptQuery: 'Charlie, summarize the valuation and risk findings for this property'
  },
  vetting: {
    id: 'vetting',
    doorName: 'Agent Vetting',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker (CA DRE #02303118)',
    avatar: BOB_AVATAR,
    accentColor: '#D4AF37',
    title: 'Agent Vetting Briefing',
    subtitle: 'Independent representation standards & referral structure',
    audioUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/3400475d9_bobanswer_6a5d2e96818523aa8749508e.mp4',
    spokenText: 'Bob Dyson here. Independent buyer representation is the cornerstone of protecting your equity. Under our licensed referral structure, we pair you with an elite local buyer specialist while our fiduciary desk stays actively involved alongside you through closing.',
    promptQuery: 'Bob, how does Dyson & Dyson protect buyers and avoid dual agency?'
  },
  roadmap: {
    id: 'roadmap',
    doorName: 'Move Roadmap',
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    speakerRole: 'AI Concierge & Process Director',
    avatar: CHARLIE_AVATAR,
    accentColor: '#10b981',
    title: 'Move Roadmap Briefing',
    subtitle: '7-Phase timeline from offer formulation to key handover',
    audioUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/6f622bb1c_charlie_avatar_clean_vet.mp4',
    spokenText: 'Charlie here. You are now looking at the Move Roadmap—your 7-phase timeline from offer formulation to key handover. Tap any milestone below to see the exact diligence checkpoints CoPilot monitors at each step.',
    promptQuery: 'Explain the 7 transaction phases of the Move Roadmap'
  },
  escrow: {
    id: 'escrow',
    doorName: 'Escrow Watch',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker Solutions Take',
    avatar: BOB_AVATAR,
    accentColor: '#D4AF37',
    title: 'Escrow Watch Briefing',
    subtitle: 'Earnest money deposit defense & contingency shields',
    audioUrl: 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/94b83e0f7_reqa_6a5272697665dffe7b165e0d_bob.mp4',
    spokenText: 'Bob Dyson here. In California, your earnest money deposit is protected by affirmative written contingencies. We ensure your funds are safeguarded under the 3% statutory cap and review title Schedule B exceptions before any removal is signed.',
    promptQuery: 'Bob, what are the biggest escrow traps and how do we protect our earnest money deposit?'
  }
};