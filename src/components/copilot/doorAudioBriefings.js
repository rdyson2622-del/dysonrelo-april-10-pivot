/**
 * Voice Briefing Strategy Configuration for the 5 Core Execution Doors:
 * 1. Property Audit (Charlie Simmons - Concierge & Valuation Desk)
 * 2. Agent Vetting (Bob Dyson - Principal Broker Fiduciary Standards)
 * 3. Move Roadmap (Charlie Simmons - AI Concierge & Process Director)
 * 4. Escrow Watch (Bob Dyson - Principal Broker Solutions Take)
 * 5. DNN News (Charlie Simmons & Bob Dyson - DNN Market Desk)
 */

export const BOB_AVATAR = 'https://files2.heygen.ai/talking_photo/31b79a86784e495090472af2e7b9407c/5c0bde249fe348bb8b9dfb07299f608c.WEBP?Expires=1789606882&Signature=YUNW1j0tU8LsI1vb0JnPSMwCFFhUwdI2U1MoECnlYvthEhenxAfg-ws0S6jibQKfxBhXSRobys8qEkDXU-WvfEi4rH1Sej4yZCwxgjlxPNNv9XjJgaTpZDeeMYzQC8A5cLTT3-l~u5Jy~zeoIlaRFJGM2yu4vTRxo2Ul0fPWg4dK-10LrLqrsFrxEITI1uvRsyfP5ysTm1J7HaW9pCVY~1~1z2HB1zmNuMsVYcCowXhZWfyyOAsPySSciYJfIkFN6Xw16C~n7mK1B5twxKAPjW-yV0Cq8H~wCvqAUr9BbBZpTut1jy1kHtWCEmRiju1M-sQOb4ymWXlvLHxP71xlpA__&Key-Pair-Id=K38HBHX5LX3X2H';
export const CHARLIE_AVATAR = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';
export const DNN_BROADCAST_THUMBNAIL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d5e0cb3f1_Screenshot2026-09-14at81551PM.png';

export const DEFAULT_DOOR_BRIEFINGS = {
  dossier: {
    id: 'dossier',
    doorName: 'Property Audit',
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    speakerRole: 'AI Concierge & Valuation Desk',
    avatar: CHARLIE_AVATAR,
    accentColor: '#10b981',
    title: 'Property Audit Briefing',
    subtitle: 'Independent comps, hazard zones & permit history',
    // Authentic HeyGen Ruben studio male voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=15d0b3f3-7255-4c4b-91a6-bc747917aeee.wav',
    spokenText: 'Charlie here. Welcome to your independent Property Audit. Here we break down unvarnished micro-neighborhood comps adjusted for square footage and condition, along with local hazard disclosures, bluff setbacks, and property tax records. Review your honest comps and hidden risks on screen, or ask me any question to drill into the data before formulating an offer.',
    promptQuery: 'Charlie, walk me through the comps and hidden risks on this property'
  },
  vetting: {
    id: 'vetting',
    doorName: 'Agent Vetting',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker Fiduciary Standards',
    avatar: BOB_AVATAR,
    accentColor: '#D4AF37',
    title: 'Agent Vetting Briefing',
    subtitle: 'Independent representation standards vs. dual agency',
    // Authentic HeyGen Bob Dyson cloned studio baritone voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/147b8f5713024fb9afc106f266e47482/id=8d7006a7-2844-4221-a052-5e62b8db0e38.wav',
    spokenText: "Bob Dyson here. Welcome to our Agent Vetting desk. In coastal luxury real estate, dual agency is a serious risk to your equity—the listing agent's legal loyalty is to the seller's price, not yours. Through our licensed California referral agreement, CoPilot pairs you with a thoroughly vetted, independent local buyer specialist. Our fiduciary broker desk remains actively involved alongside you through every negotiation and milestone to closing, with zero added fees to you. Tap any protocol below to see how we safeguard your interests.",
    promptQuery: 'Bob, break down the risks of using the listing agent and how independent advocacy works'
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
    // Authentic HeyGen Ruben studio male voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=85a174ea-4db1-497f-bb9a-7bcae1427870.wav',
    spokenText: 'Charlie here. This is your Move Roadmap—a structured 7-phase execution timeline from initial property audit and offer formulation all the way through escrow contingencies and closing. CoPilot stays actively engaged alongside you and your agent at every milestone. Tap any phase below to inspect the specific diligence steps and documentation required.',
    promptQuery: 'Charlie, explain the 7 transaction phases of the Move Roadmap'
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
    subtitle: 'Earnest money defense, 48-hr notices & title exceptions',
    // Authentic HeyGen Bob Dyson cloned studio baritone voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/147b8f5713024fb9afc106f266e47482/id=b2d17d80-5f6a-4f11-ac55-d2d636d05ec0.wav',
    spokenText: 'Bob Dyson here. Welcome to Escrow Watch. Once you are in contract, protecting your earnest money deposit is paramount. Under California law, liquidated damages for buyer default are capped at three percent. In standard California agreements, contingencies never expire automatically—the seller must issue a formal forty-eight-hour Notice to Perform before demanding removal. We supervise every contingency timeline, appraisal gap, and preliminary title Schedule B exception so you never risk your deposit.',
    promptQuery: 'Bob, explain earnest money defense, 48-hour notices to perform, and Schedule B title exceptions'
  },
  news: {
    id: 'news',
    doorName: 'DNN News',
    speaker: 'charlie_bob',
    speakerName: 'Charlie & Bob',
    speakerRole: 'DNN Daily Market Desk',
    avatar: DNN_BROADCAST_THUMBNAIL,
    accentColor: '#D4AF37',
    title: 'DNN Daily Broadcast',
    subtitle: 'Coastal market intelligence & migration trends',
    // Authentic HeyGen Ruben studio male voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=e14065ee-baa7-4aa0-9e92-540fce6493f2.wav',
    spokenText: "Welcome to today's DNN Market Desk broadcast. Charlie Simmons and Bob Dyson present the latest coastal real estate intelligence, inventory constraints, mortgage rate movements, and buyer contract protections. Tap play to view today's complete broadcast or inspect today's briefs below.",
    promptQuery: 'Charlie and Bob, summarize today’s DNN News broadcast'
  },
  dnn: {
    id: 'dnn',
    doorName: 'DNN News',
    speaker: 'charlie_bob',
    speakerName: 'Charlie & Bob',
    speakerRole: 'DNN Daily Market Desk',
    avatar: DNN_BROADCAST_THUMBNAIL,
    accentColor: '#D4AF37',
    title: 'DNN Daily Broadcast',
    subtitle: 'Coastal market intelligence & migration trends',
    // Authentic HeyGen Ruben studio male voice
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=e14065ee-baa7-4aa0-9e92-540fce6493f2.wav',
    spokenText: "Welcome to today's DNN Market Desk broadcast. Charlie Simmons and Bob Dyson present the latest coastal real estate intelligence, inventory constraints, mortgage rate movements, and buyer contract protections. Tap play to view today's complete broadcast or inspect today's briefs below.",
    promptQuery: 'Charlie and Bob, summarize today’s DNN News broadcast'
  },
  solutions: {
    id: 'solutions',
    doorName: 'Solutions Vault',
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    speakerRole: 'Principal Broker Solutions Take',
    avatar: BOB_AVATAR,
    accentColor: '#D4AF37',
    title: 'Solutions Vault Briefing',
    subtitle: 'Fiduciary playbooks for escrow snags & deal structure',
    audioUrl: 'https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/147b8f5713024fb9afc106f266e47482/id=f002a65f-b3e9-4d51-907f-88f57c2aa9f5.wav',
    spokenText: "Bob Dyson here. Welcome to our Real Estate Solutions and Intelligence Vault. Here we archive our tactical playbooks—from Prop 19 tax base portability to navigating appraisal shortfalls, unpermitted space, and title defects. Tap any playbook below to inspect our deal-structuring rules.",
    promptQuery: 'Bob, walk me through the key playbooks in the Solutions Vault'
  }
};

const SCRIPTS_STORAGE_KEY = 'dyson_copilot_door_scripts';

export function getSavedScripts() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SCRIPTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

export function saveDoorScript(doorId, scriptText) {
  if (typeof window === 'undefined' || !doorId) return;
  try {
    const saved = getSavedScripts();
    saved[doorId] = scriptText;
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('dyson_door_scripts_updated', { detail: { doorId, scriptText } }));
  } catch (_) {}
}

export function resetDoorScript(doorId) {
  if (typeof window === 'undefined' || !doorId) return;
  try {
    const saved = getSavedScripts();
    delete saved[doorId];
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('dyson_door_scripts_updated', { detail: { doorId } }));
  } catch (_) {}
}

export function resetAllDoorScripts() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SCRIPTS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('dyson_door_scripts_updated', { detail: {} }));
  } catch (_) {}
}

export function getDoorAudioBriefing(doorId = 'dossier') {
  const base = DEFAULT_DOOR_BRIEFINGS[doorId] || DEFAULT_DOOR_BRIEFINGS.dossier;
  const saved = getSavedScripts();
  const customScript = saved[doorId];

  return {
    ...base,
    spokenText: customScript || base.spokenText,
    isCustomized: Boolean(customScript && customScript !== base.spokenText)
  };
}

export const DOOR_AUDIO_BRIEFINGS = DEFAULT_DOOR_BRIEFINGS;