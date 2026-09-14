# CHAT-SEARCH-ITEMS-WIRE-STATUS.md
**Status:** PASS / VERIFIED  
**Date:** 2026-09-14  
**Components:**  
- `src/components/admin/copilot/GrokPageTwoChatCanvas.jsx`
- `src/components/copilot/CopilotAvatarSlot.jsx`
- `src/lib/charlieSimmonsPrompt.js`
- `src/components/admin/copilot/CopilotPublicReadOnlyTeamRail.jsx`  
**Lab URL:** `/admin/dysonhomes-copilot#page-2` & `/copilot/page-2` (https://dysonhomes.com/team)  
**Publish Status:** NO (Changes strictly kept local/in-app, no publish)

---

## Verified Specifications & Behavior

1. **Four Canned Explainer MP4 IDs (PASS):**
   - **Pill 1:** *"How do I get thousands back at closing?"*  
     - Explainer ID: `closing_rebate`  
     - Speaker: Charlie Simmons  
     - Asset: `who_is_dyson_charlie_explainer.mp4`  
     - Result: Plays video in Avatar Slot; appends transcript note.
   - **Pill 2:** *"How do you find hidden property risks?"*  
     - Explainer ID: `hidden_risks`  
     - Speaker: Charlie Simmons  
     - Asset: `hidden_risks_charlie_explainer.mp4`  
     - Result: Plays video in Avatar Slot; appends transcript note.
   - **Pill 3:** *"Who is Dyson & Dyson?"*  
     - Explainer ID: `who_is_dyson`  
     - Speaker: Charlie Simmons  
     - Asset: `who_is_dyson_charlie_explainer.mp4`  
     - Result: Plays video in Avatar Slot; appends transcript note.
   - **Pill 4:** *"Bob's Take: Escrow & Deal Traps"*  
     - Explainer ID: `bob_solutions_traps`  
     - Speaker: Bob Dyson  
     - Asset: `bob_dyson_escrow_solutions.mp4`  
     - Result: Switches avatar slot to Bob Dyson header with gold badge and plays explainer.

2. **Free-Text Charlie Reply (PASS):**
   - Text inputs that are not address-shaped and not canned pills trigger `base44.integrations.Core.InvokeLLM` with `CHARLIE_COPILOT_LIVE_PROMPT`.
   - Real conversational text response from Charlie is rendered into the message thread with avatar icon, timestamp, and automatic smooth scroll.
   - Address-shaped queries automatically route to Page 3 Dossier audit.

3. **Talk Live Gemini Duplex Integration (PASS):**
   - **Model:** `models/gemini-2.5-flash-preview-native-audio-dialog` via WebSocket proxy.
   - **Voice:** `Algieba` (English US natural voice).
   - **Full Duplex & Barge-In:** Yields immediately when user speaks or taps mic; server audio cancels instantaneously.
   - **Audio Pipeline:** 16kHz PCM mono microphone stream downsampled via Web Audio API, native audio part playback.
   - **Session Safety:** 5-minute soft session cap with live countdown timer, inline mic mute/unmute toggle, and instant red "End Session" kill switch.
   - **Explainer Interaction:** When an MP4 explainer is clicked while a live duplex session is active, live audio automatically pauses and resumes once the explainer finishes.
   - **Known Browser Limitation:** Requires user microphone permission grant on first tap; inline warning displayed if user denies permission.

4. **Team Rail View-Only (PASS):**
   - Page 2 left rail features read-only cards for Bob Dyson (Founder / 55+ yrs leadership), Charlie Simmons (AI Concierge / The Face of CoPilot), and the specialized AI mini-app identifiers with lock/read-only badges.

5. **Mandatory Hard-Stops & Process Guidance Appended (PASS):**
   - `src/lib/charlieSimmonsPrompt.js` contains the mandatory V2V HARD STOPS & Relo a2 process instructions:
     - 0 fees for buyers.
     - 25% broker-to-broker referral compensation model.
     - CA DRE #02303118 brokerage identity.
     - Tax/legal disclaimer referring to licensed CPAs and attorneys.
     - Yield-immediately barge-in behavior.

6. **Publish Decision:**
   - **NO PUBLISH** triggered per directive.
