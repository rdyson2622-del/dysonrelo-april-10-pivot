# Transparent Workflow Vision — The Full Plan

**Originator:** Bob Dyson (admin)
**Date:** 2026-08-16
**Status:** Vision captured · routing to AI specialists for discussion

---

## 1. The Core Idea

Every function on the site — not just the admin workflow atlas — becomes a **visual, transparent flow chart** that the user (client OR admin) can watch in progress, understand the WHY behind each step, and flag issues the moment they appear.

This is not a dashboard. It is a **live, visible chain of accountability** that runs alongside every real estate transaction, every relocation, every show, every referral.

### The deeper purpose (the "glue")

The visual part of this — during the production of ALL functions — is the **new glue that helps the consumer transition to AI workflows and understand them.** Most consumers have never watched an AI workflow run. They don't trust what they can't see. This visual layer is how they see it: every stage, every reason, every flag, every accountable party — in plain English, in real time.

When the consumer can watch the flow, two things happen:
1. **Accountability becomes true, clean, and clear.** Not a promise — a visible fact. The consumer sees who is responsible at each stage, when credits are spent, and where a 401 flag appeared. No party can hide.
2. **The consumer transitions to AI workflows without fear.** They are not being asked to trust a black box. They are being asked to watch a transparent one. The visual is the on-ramp from "I don't understand AI" to "I can see exactly what the AI is doing for me right now."

This is why the visual is not a nice-to-have. It is the adoption mechanism. Without it, the AI workflows are invisible to the people they serve. With it, the AI workflows are accountable, legible, and trustworthy.

---

## 2. What the viewer sees (the "white copy" concept)

Modeled on the Show Pipeline page's upper-left description area: every flow chart opens with a plain-English explanation of:

- **WHAT** this project or function is (e.g. "Producing today's DNN broadcast")
- **WHY** we are producing it (e.g. "So partners and subscribers see the brand daily and trust the desk")
- **WHO** is accountable at each stage (Charlie, Bob, the agent, the lender, the client)
- **WHEN** credits or money get spent (so nothing burns budget without a human seeing it first)
- **WHERE** a 401 / issue flag can appear (so a problem is visible to everyone the moment it happens)

This language is not admin-only. The same transparent flow is shown to:
- The 5 portal participants (client, relocation agent, referral/sending agent, vendor, corporate HR)
- DNN subscribers
- Partner agents and brokers

---

## 3. The 5 capabilities every flow chart gives the viewer

1. **See the progress** — every stage lights up as it completes. No spinning wheel, no "we'll get back to you."
2. **Understand the reasons** — the white-copy area explains why each step exists, not just what it does.
3. **View or edit during flow** — a client or admin can pause, read, or adjust a project mid-flight, before credits are spent or a commitment is made.
4. **Flag a 401 issue** — any participant can flag a stage that looks wrong. The flag is visible to the consumer, Dyson, and the agent/broker involved. No more silent problems buried in a transaction.
5. **Make everyone accountable** — the flow chart shows who is responsible at each stage. The client sees the agent's stage. The agent sees the client's stage. Dyson sees both.

---

## 4. Why this is novel for real estate

In a traditional real estate transaction, there is **no way to really flag an issue along the path** of relocating a client. Problems get buried in emails, texts, or phone calls. The client doesn't know there's a problem until it's already a crisis.

This process changes that:
- The issue is **flagged on the flow chart** the moment it appears.
- It is **transparent to the consumer**, to Dyson, and to the agent or broker involved.
- It **makes everyone accountable** — no party can claim they didn't know.
- It is **especially important for commitments to consumers** — when Dyson refers a lead to an agent, and when Dyson commits to relocating a client, the flow chart is the receipt of that commitment.

---

## 5. Where it applies (every function on the site)

### Admin-facing flows (workflow atlas — already designed)
- DNN News (write → render → publish → audience)
- Marketing (find → trace → send → board → follow → press)
- Operations (intake → plan → hygiene → compliance → watch)
- Sales & PRN (recruit → roster → agree → handoff → vet)
- Finance (fees → revenue → cost) — advisory / read-only
- Knowledge & Pipes (canon → playbook → conduit) — read-only

### Client-facing flows (new — the transparency layer)
- The family relocation journey (intake → plan → agents → move → close)
- The departing owner journey (listing → trace → first text → yes → family file)
- The PRN partner journey (pitch → roster → agreement → handoff → close)
- The daily show journey (script → approve → render → publish → measure)

Each of these already exists as a `MASTER_JOURNEY` in the atlas. The vision is to make them **live and visible to the participant**, not just the admin.

---

## 6. The 401 flag concept

A "401" is an issue flag — a problem spotted on the flow that needs human attention before the flow continues.

Examples:
- A render failed (DNN)
- An agent hasn't first-touched a lead within 4 hours (Sales)
- A compliance doc needs review (Operations)
- A client's timeline slipped (Operations)
- An opt-out was missed (Marketing — TCPA risk)
- A fee math error (Finance)

The flag:
- Appears on the stage box in red/amber.
- Is visible to every participant who can see that flow.
- Blocks the flow from advancing until a human clears it.
- Logs who flagged it, who cleared it, and when.

This is the accountability mechanism. Without it, the flow chart is just a pretty picture. With it, the flow chart is a contract.

---

## 7. Build order (agreed with admin)

**3 stages at a time, by subject. DNN News first (it's the priority and the pilot).**

### Phase 1 — DNN pilot (now)
- Create the `WorkflowAction` entity (persistent action log, admin RLS).
- Create the `WorkflowActionPanel` component (input + run + last response + 401 flag).
- Wire the 3 DNN stages: `write` → `render` → `publish`.
- Add the white-copy description area to the DNN flow view.
- Each stage shows WHAT / WHY / WHO / WHEN-CREDITS / 401.

### Phase 2 — DNN finish + Marketing start
- Wire DNN `audience` stage.
- Wire Marketing `find` → `trace` → `send` stages.
- Add opt-out check to the Marketing `send` stage (TCPA).

### Phase 3 — Marketing finish + Operations start
- Wire Marketing `board` → `follow` → `press`.
- Wire Operations `intake` → `plan` → `hygiene`.

### Phase 4+ — Sales, Finance, Knowledge, then client-facing journeys.

---

## 8. What this is NOT

- It is not a replacement for the existing admin pages. The flow chart links to them.
- It is not a second orchestrator. It uses `grokChiefOrchestrate` for AI dispatch.
- It is not a silent logger. The 401 flag is the whole point — problems must be visible.
- It is not admin-only. The client-facing journeys are shown to the participants.

---

## 9. Open questions for the AI specialists to discuss

1. **Operations Specialist:** How should the 401 flag block a flow? Hard block (no advance) or soft block (warn + allow override)?
2. **Sales Specialist:** When a 401 flag appears on a referral handoff, who sees it — just Dyson, or the agent too?
3. **DNN News Specialist:** Should the white-copy description be editable per show, or fixed per flow?
4. **Marketing Specialist:** The opt-out check is a TCPA requirement. Should a missed opt-out auto-flag a 401, or block the send entirely?
5. **Finance Specialist:** Credits and money are spent at render/publish. Should the flow require a human "approve spend" click before those stages fire?
6. **Canon (knowledge):** Where does the brand-voice language for the white-copy descriptions live — in Canon, or in the flow data?

---

**End of vision. This document is the source of truth for the build.**