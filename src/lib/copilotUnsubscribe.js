import { base44 } from '@/api/base44Client';

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

export function generateUnsubscribeToken() {
  const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `unsub_${Date.now().toString(36)}_${rand}`;
}

export async function findUnsubscribeRecordByToken(token) {
  if (!token) return null;
  try {
    const records = await base44.entities.CopilotUnsubscribe.filter({ token });
    return records && records.length > 0 ? records[0] : null;
  } catch (err) {
    console.warn('Could not query CopilotUnsubscribe by token:', err);
    return null;
  }
}

export async function findUnsubscribeRecordByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  try {
    const records = await base44.entities.CopilotUnsubscribe.filter({ email: normalized });
    return records && records.length > 0 ? records[0] : null;
  } catch (err) {
    console.warn('Could not query CopilotUnsubscribe by email:', err);
    return null;
  }
}

export async function submitUnsubscribe({ email, token, source = 'public_page' }) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error('A valid email address is required.');
  }

  const existing = await findUnsubscribeRecordByEmail(normalized);
  const now = new Date().toISOString();
  const assignedToken = token || existing?.token || generateUnsubscribeToken();

  if (existing) {
    const updated = await base44.entities.CopilotUnsubscribe.update(existing.id, {
      status: 'unsubscribed',
      marketing_suppressed: true,
      transactional_allowed: true,
      unsubscribed_at: now,
      source: existing.source || source,
      token: assignedToken
    });
    return updated;
  }

  const created = await base44.entities.CopilotUnsubscribe.create({
    email: normalized,
    token: assignedToken,
    status: 'unsubscribed',
    marketing_suppressed: true,
    transactional_allowed: true,
    source,
    unsubscribed_at: now,
    token_created_at: now
  });

  return created;
}

export async function findUnsubscribeRecordByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  try {
    const records = await base44.entities.CopilotUnsubscribe.filter({ phone: normalized });
    return records && records.length > 0 ? records[0] : null;
  } catch (err) {
    console.warn('Could not query CopilotUnsubscribe by phone:', err);
    return null;
  }
}

export async function submitStopContact({ email, phone, reason, requestType = 'stop_contact', source = 'copilot_stop_contact' }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail && !normalizedPhone) {
    throw new Error('Please provide at least one valid email address or phone number.');
  }

  const existing = (normalizedEmail ? await findUnsubscribeRecordByEmail(normalizedEmail) : null) ||
                   (normalizedPhone ? await findUnsubscribeRecordByPhone(normalizedPhone) : null);

  const now = new Date().toISOString();
  const assignedToken = existing?.token || generateUnsubscribeToken();

  const payload = {
    email: normalizedEmail || existing?.email || undefined,
    phone: normalizedPhone || existing?.phone || undefined,
    token: assignedToken,
    request_type: requestType,
    reason: reason?.trim() || undefined,
    status: 'unsubscribed',
    marketing_suppressed: true,
    transactional_allowed: true,
    source: existing?.source || source,
    unsubscribed_at: now
  };

  if (existing) {
    return await base44.entities.CopilotUnsubscribe.update(existing.id, payload);
  }

  return await base44.entities.CopilotUnsubscribe.create({
    ...payload,
    token_created_at: now
  });
}