// Google Ads conversion tracking — dysonhomes.com
// The AW-18469995239 gtag is already loaded sitewide via index.html. This file
// only fires the two result signals Google needs to count leads: form
// submissions that save a new lead record, and clicks on the office phone link.
//
// LEAD_LABEL / CALL_LABEL are placeholders until the matching conversion
// actions are created in the Google Ads account — swap the real values in
// here once Bob has them.
export const LEAD_LABEL = 'LEAD_LABEL';
export const CALL_LABEL = 'CALL_LABEL';

const CALL_TEL_DIGITS = '8583531200'; // (858) 353-1200

function fireConversion(label) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: `AW-18469995239/${label}` });
}

// Fire once, right after a lead record has actually been saved successfully
// (address/property report request, or starting a Relocation Roadmap).
// Never call this on page load or on a failed submit.
export function fireLeadConversion() {
  fireConversion(LEAD_LABEL);
}

let callTrackingInitialized = false;

// Sitewide click listener for the office phone link — call once on app boot.
// Fires exactly once per tap on any tel:+18583531200 link, anywhere in the app.
export function initCallClickTracking() {
  if (callTrackingInitialized || typeof document === 'undefined') return;
  callTrackingInitialized = true;
  document.addEventListener('click', (e) => {
    const link = e.target?.closest?.('a[href^="tel:"]');
    if (!link) return;
    const digits = link.getAttribute('href').replace(/\D/g, '');
    if (digits.endsWith(CALL_TEL_DIGITS)) {
      fireConversion(CALL_LABEL);
    }
  }, true);
}