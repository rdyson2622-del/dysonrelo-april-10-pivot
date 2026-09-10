import { base44 } from '@/api/base44Client';

const STORAGE_PREFIX = 'dyson_charlie_walkthrough_done_';
const SKIPPED_PREFIX = 'dyson_charlie_walkthrough_skipped_';

/**
 * Checks whether the user/agent has completed the Charlie walkthrough.
 */
export function checkCharlieWalkthroughDone({ user, agent, slug }) {
  if (user?.data?.charlie_walkthrough_done === true) return true;
  if (agent?.charlie_walkthrough_done === true) return true;
  
  const idKey = agent?.id || slug || user?.id || 'default';
  if (typeof window !== 'undefined') {
    if (localStorage.getItem(`${STORAGE_PREFIX}${idKey}`) === 'true') return true;
    if (localStorage.getItem(`${STORAGE_PREFIX}global`) === 'true') return true;
  }
  return false;
}

/**
 * Checks whether the walkthrough was skipped/dismissed for the current session.
 */
export function checkCharlieWalkthroughDismissedSession({ user, agent, slug }) {
  const idKey = agent?.id || slug || user?.id || 'default';
  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem(`${SKIPPED_PREFIX}${idKey}`) === 'true') return true;
    if (sessionStorage.getItem(`${SKIPPED_PREFIX}session`) === 'true') return true;
  }
  return false;
}

/**
 * Marks the Charlie walkthrough as completed.
 * Saves to localStorage, user profile, and agent entity if available.
 */
export async function markCharlieWalkthroughDone({ userId, agentId, agentType = 'referral', slug } = {}) {
  const idKey = agentId || slug || userId || 'default';
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${idKey}`, 'true');
    localStorage.setItem(`${STORAGE_PREFIX}global`, 'true');
    window.dispatchEvent(new CustomEvent('charlie-walkthrough-status-changed', { 
      detail: { done: true, agentId, slug } 
    }));
  }

  // Persist to logged-in user profile
  try {
    await base44.auth.updateMe({ charlie_walkthrough_done: true });
  } catch {
    // If not logged in or guest, ignore error
  }

  // Persist to agent entity
  try {
    if (agentId) {
      if (agentType === 'referral') {
        await base44.entities.ReferralAgent.update(agentId, { charlie_walkthrough_done: true });
      } else if (agentType === 'active') {
        await base44.entities.ActiveRelocationAgent.update(agentId, { charlie_walkthrough_done: true });
      } else if (agentType === 'partner') {
        await base44.entities.PartnerAgent.update(agentId, { charlie_walkthrough_done: true });
      }
    }
  } catch {
    // Ignore update failures
  }
}

/**
 * Records a soft skip when the user clicks "Continue to desk (I'll talk later)".
 * Dismisses the modal for this session without marking the walkthrough as done.
 */
export async function markCharlieWalkthroughSkipped({ userId, agentId, agentType = 'referral', slug } = {}) {
  const idKey = agentId || slug || userId || 'default';
  const now = new Date().toISOString();

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`${SKIPPED_PREFIX}${idKey}`, 'true');
    sessionStorage.setItem(`${SKIPPED_PREFIX}session`, 'true');
  }

  try {
    await base44.auth.updateMe({ charlie_walkthrough_skipped_at: now });
  } catch {
    // ignore
  }

  try {
    if (agentId) {
      if (agentType === 'referral') {
        await base44.entities.ReferralAgent.update(agentId, { charlie_walkthrough_skipped_at: now });
      } else if (agentType === 'active') {
        await base44.entities.ActiveRelocationAgent.update(agentId, { charlie_walkthrough_skipped_at: now });
      } else if (agentType === 'partner') {
        await base44.entities.PartnerAgent.update(agentId, { charlie_walkthrough_skipped_at: now });
      }
    }
  } catch {
    // ignore
  }
}