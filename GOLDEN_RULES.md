# ⛔ GOLDEN RULES — READ BEFORE ANY SEND ACTION

> These rules are non-negotiable. They exist to protect the company from
> regulatory fines, domain suspension, and reputational damage.
> Any AI agent, developer, or operator working in this repo MUST read
> and obey these rules before triggering any outbound communication.

---

## 🥇 GOLDEN RULE #1 — NEVER SEND MASS MAILERS / BLASTS WITHOUT EXPLICIT HUMAN APPROVAL

**NO mass email, mass SMS, or any bulk outbound campaign — to agents, clients,
subscribers, or any list — may be sent by an AI agent or backend function
without explicit, confirmed, human (owner) approval given in the current
conversation.**

This is a **GOLDEN RULE**. There are no exceptions for "test runs," "dry runs,"
"demos," or "it looked like that's what they wanted." If it is not an explicit
"yes, send it now" from the owner, **DO NOT SEND.**

### Why this exists
On 2026-08-16, an AI agent ran `agentInviteCampaign` with `action: "send"`
against 353 agents without confirmation. That kind of unsolicited bulk send
can trigger:

- **CAN-SPAM / GDPR / TCPA violations** — mass email/SMS without confirmed
  opt-in and without human approval exposes the company to fines and
  regulatory action.
- **Domain suspension** — Gmail, Outlook, and ESP providers flag bulk sends
  as spam and can suspend the sending domain.
- **Twilio account suspension** — bulk SMS to invalid or international
  numbers triggers carrier complaints and account flags.
- **Reputational damage** — one bad blast can poison the brand with the
  exact agents we are trying to recruit.

### What "mass mailer / blast" means
ANY call to a function or integration that sends to more than ONE recipient
in a single run. This includes (but is not limited to):

- `agentInviteCampaign`
- `dnnMorningEmailBlast`
- `sendBatchOutreachSMS`
- `sendPreparedBatchSMS`
- `dnnAudienceDistribute`
- `dnnSocialBlast`
- `dnnBroadcastSocialPost`
- Any loop that calls `SendEmail` / `SendPushNotification` / Twilio SMS
  more than once per run.

### The only correct behavior
1. **Never call a send/broadcast function unless the user has explicitly
   said "send it" / "launch it" / "blast it" in THIS conversation.**
2. If unsure — **ASK.** A clarifying question is always cheaper than a fine.
3. "Preview it," "show me the page," "let me see it," "dry run" — these are
   NOT approval to send. They mean show, not send.
4. Even with approval, cap volume and validate recipients (opt-in status,
   valid phone format, region permissions) before dispatch.
5. When a send function exists, it must default to a **preview / report
   mode** and require an explicit `confirm: true` flag to actually deliver.

---

## 🥇 GOLDEN RULE #2 — WHEN IN DOUBT, DO NOTHING

If a user request could be interpreted as "send to a list" OR "show me the
thing," assume the latter. Build the page, show the preview, surface the
numbers — but never dispatch to real humans without a clear yes.

---

## 🥇 GOLDEN RULE #3 — ONE RECIPIENT AT A TIME UNLESS APPROVED

Single-recipient sends (one welcome email, one SMS reply) are fine when
triggered by a user action. Anything that iterates over a LIST requires
explicit owner approval for that specific send.

---

_These rules were added 2026-08-16 after a mass-send incident.
They are not optional. They are not a suggestion. They are the line._