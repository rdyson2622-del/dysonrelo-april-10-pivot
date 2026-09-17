import { base44 } from '@/api/base44Client';

/**
 * Utility to manage user check-in identity and dual-storage on DysonHomes Copilot.
 * 
 * 1. Preferred Client Identity (Replaces transactional 'Subscribe' / 'Sign Up')
 * 2. Personal Client Vault (Private saved items for recognized Preferred Clients)
 * 3. Global AI Brain (Anonymized Q&A intelligence feeding Charlie & Bob)
 */

const CONTACT_STORAGE_KEY = 'dyson_copilot_contact_info';
const CLIENT_NAME_KEY = 'dyson_copilot_client_name';
const VISITOR_NAME_KEY = 'dyson_visitor_name';

export function getCheckedInUser(authUser = null) {
  // 1. Authenticated User takes top priority
  if (authUser && (authUser.full_name || authUser.email)) {
    const rawName = authUser.full_name || authUser.email.split('@')[0];
    const firstName = rawName.trim().split(' ')[0];
    return {
      name: rawName.trim(),
      firstName,
      email: authUser.email || '',
      phone: authUser.phone || '',
      source: 'auth',
      isPreferredClient: true
    };
  }

  // 2. Local storage contact info (checked in via phone / email report request or Preferred Client claim)
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.name && parsed.name.trim()) {
        const rawName = parsed.name.trim();
        return {
          name: rawName,
          firstName: rawName.split(' ')[0],
          email: parsed.email || '',
          phone: parsed.phone || '',
          source: 'contact',
          isPreferredClient: true
        };
      }
    }

    const clientName = localStorage.getItem(CLIENT_NAME_KEY);
    if (clientName && clientName.trim()) {
      const rawName = clientName.trim();
      return {
        name: rawName,
        firstName: rawName.split(' ')[0],
        source: 'advisory',
        isPreferredClient: true
      };
    }

    const visitorName = localStorage.getItem(VISITOR_NAME_KEY);
    if (visitorName && visitorName.trim()) {
      const rawName = visitorName.trim();
      return {
        name: rawName,
        firstName: rawName.split(' ')[0],
        source: 'visitor',
        isPreferredClient: false
      };
    }
  } catch (_) {}

  return null;
}

export function saveCheckedInContact({ name, phone, email }) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      name: (name || '').trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      lastSeenAt: new Date().toISOString()
    };
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(payload));
    if (payload.name) {
      localStorage.setItem(CLIENT_NAME_KEY, payload.name);
    }
    window.dispatchEvent(new CustomEvent('dyson_copilot_contact_updated', { detail: payload }));
  } catch (_) {}
}

export function clearCheckedInContact() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONTACT_STORAGE_KEY);
    localStorage.removeItem(CLIENT_NAME_KEY);
    localStorage.removeItem(VISITOR_NAME_KEY);
    window.dispatchEvent(new CustomEvent('dyson_copilot_contact_updated', { detail: null }));
  } catch (_) {}
}

/**
 * Claim Preferred Client status (Soft opt-in without password or friction)
 */
export async function claimPreferredClient({ name, phone, email }) {
  const normName = (name || '').trim();
  const normPhone = (phone || '').trim();
  const normEmail = (email || '').trim();

  saveCheckedInContact({ name: normName, phone: normPhone, email: normEmail });

  try {
    // Record in CopilotVisitor entity
    await base44.entities.CopilotVisitor.create({
      name: normName,
      phone: normPhone,
      email: normEmail || undefined,
      source: 'preferred_claim',
      last_seen_at: new Date().toISOString(),
      consent_text: 'Preferred Client Vault Activation - Fiduciary Second Opinion & Private Dossier Storage'
    });
  } catch (err) {
    console.warn('Non-blocking visitor record creation warning:', err);
  }

  return {
    name: normName,
    firstName: normName.split(' ')[0] || 'Preferred Client',
    phone: normPhone,
    email: normEmail,
    isPreferredClient: true
  };
}

/**
 * Dual Storage Pipeline 1: Personal Client Vault (Private to recognized client)
 */
export async function saveToClientVault({
  title,
  item_type = 'discussion',
  address = '',
  notes = '',
  payload = {},
  clientUser = null
}) {
  const activeUser = clientUser || getCheckedInUser();
  const phone = activeUser?.phone || activeUser?.email || 'guest_device';
  const name = activeUser?.name || 'Preferred Client';
  const email = activeUser?.email || '';

  // Local storage cache for immediate offline UX
  try {
    const localKey = 'dyson_copilot_saved_discussions';
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    const newEntry = {
      id: Date.now().toString(),
      title,
      item_type,
      propertyAddress: address,
      notes,
      messages: payload?.messages || [],
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(localKey, JSON.stringify([newEntry, ...existing]));
    window.dispatchEvent(new Event('dyson_vault_updated'));
  } catch (_) {}

  // Save to backend entity
  try {
    const record = await base44.entities.CopilotClientVault.create({
      client_phone: phone,
      client_email: email || undefined,
      client_name: name,
      title: title || `Saved Discussion · ${new Date().toLocaleDateString()}`,
      item_type,
      address: address || undefined,
      notes: notes || undefined,
      payload,
      saved_at: new Date().toISOString()
    });
    return { success: true, record };
  } catch (err) {
    console.warn('Client Vault entity persistence notice:', err);
    return { success: true, localOnly: true };
  }
}

/**
 * Dual Storage Pipeline 2: Global AI Brain (Anonymized Q&A intelligence feeding Charlie & Bob)
 */
export async function saveToGlobalBrain({
  question,
  answer,
  speaker = 'charlie',
  topic = 'General Real Estate',
  property_address = ''
}) {
  if (!question || !answer) return;

  // Anonymize: scrub any client phone/email from question and answer before saving
  const scrub = (str) => (str || '')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[anonymized_email]')
    .replace(/\b(?:\+?1[-.]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[anonymized_phone]');

  const cleanQuestion = scrub(question);
  const cleanAnswer = scrub(answer);

  try {
    await base44.entities.CopilotKnowledgeBase.create({
      question: cleanQuestion,
      answer: cleanAnswer,
      speaker: ['charlie', 'bob', 'duo'].includes(speaker) ? speaker : 'charlie',
      topic: topic || 'General Real Estate',
      property_address: property_address ? scrub(property_address) : undefined,
      source: 'copilot_dialogue',
      is_approved: true
    });
  } catch (err) {
    console.warn('Global Brain Q&A save notice:', err);
  }
}