/**
 * Utility to manage user check-in identity on DysonHomes Copilot.
 * 
 * Sources:
 * 1. Base44 authenticated user session (user.full_name, user.email)
 * 2. Captured contact info from mobile report requests (dyson_copilot_contact_info)
 * 3. Advisory agreement contact info (dyson_copilot_client_name)
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
      source: 'auth'
    };
  }

  // 2. Local storage contact info (checked in via phone / email report request)
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
          source: 'contact'
        };
      }
    }

    const clientName = localStorage.getItem(CLIENT_NAME_KEY);
    if (clientName && clientName.trim()) {
      const rawName = clientName.trim();
      return {
        name: rawName,
        firstName: rawName.split(' ')[0],
        source: 'advisory'
      };
    }

    const visitorName = localStorage.getItem(VISITOR_NAME_KEY);
    if (visitorName && visitorName.trim()) {
      const rawName = visitorName.trim();
      return {
        name: rawName,
        firstName: rawName.split(' ')[0],
        source: 'visitor'
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