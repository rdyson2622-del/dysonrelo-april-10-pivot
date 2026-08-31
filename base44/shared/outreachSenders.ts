// Multi-inbox rotation for cold agent outreach — spreads sends across
// several addresses on the already-verified dysonrelo.com domain so no
// single address (e.g. bob@dysonrelo.com) exceeds the safe cold-sending
// threshold (~40/day) and puts the whole domain's reputation at risk.
export const OUTREACH_SENDERS = [
  { email: 'bob@dysonrelo.com', label: 'Bob Dyson — Dyson Relo' },
  { email: 'partners@dysonrelo.com', label: 'Dyson Relo Partners' },
  { email: 'network@dysonrelo.com', label: 'Dyson Relo Network' },
  { email: 'hello@dysonrelo.com', label: 'Dyson Relo' },
];

export const DAILY_CAP_PER_SENDER = 40;

/**
 * Picks the least-used sender address that hasn't hit today's cap yet, by
 * counting how many ListingProspect records were emailed from each address
 * today (tracked via sent_from + contacted_at). Returns null if every
 * sender has hit its daily cap.
 */
export async function pickOutreachSender(base44: any) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const recent = await base44.asServiceRole.entities.ListingProspect.filter({}, '-contacted_at', 500);
  const countsToday: Record<string, number> = {};
  for (const p of recent) {
    if (p.sent_from && p.contacted_at && String(p.contacted_at).slice(0, 10) === todayStr) {
      countsToday[p.sent_from] = (countsToday[p.sent_from] || 0) + 1;
    }
  }
  const available = OUTREACH_SENDERS.filter((s) => (countsToday[s.email] || 0) < DAILY_CAP_PER_SENDER);
  if (available.length === 0) return null;
  available.sort((a, b) => (countsToday[a.email] || 0) - (countsToday[b.email] || 0));
  return available[0];
}