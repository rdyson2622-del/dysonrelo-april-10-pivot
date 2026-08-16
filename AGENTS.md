# DysonRelo operating agents

Claude is retired as the operating team. **Cursor builds. Grok Bot writes briefs and visuals.**

Read `CURSOR.md` first. It is the priority master file.

## ⛔ GOLDEN RULES — READ BEFORE ANY SEND ACTION

See [GOLDEN_RULES.md](GOLDEN_RULES.md) for the full text. Summary:

1. **NEVER send mass email / mass SMS / any bulk campaign to a list of
   agents, clients, or subscribers without explicit, confirmed, human
   (owner) approval in the current conversation.** No exceptions for "test
   runs" or "dry runs." If it is not a clear "yes, send it now," do not send.
2. When in doubt between "show me" and "send to a list," assume "show me."
3. One recipient at a time is fine when triggered by a user action.
   Anything that iterates over a LIST requires explicit approval.

This is a regulatory and reputational guardrail, not a preference.

## Library specialists (this PR)

These three desks own the Agent Library sections that are not departments:

| Invoke | File | Library section |
| --- | --- | --- |
| `Canon Specialist:` | [specialists/canon.md](specialists/canon.md) | AI Agent Intelligence |
| `Playbook Specialist:` | [specialists/playbook.md](specialists/playbook.md) | Skills & SOPs |
| `Conduit Specialist:` | [specialists/conduit.md](specialists/conduit.md) | Integrations, Workflows & n8n/Grok Webhooks |

They do **not** replace Marketing, Operations, Sales, DNN News, or Finance. Those desks execute. Canon / Playbook / Conduit keep the source-of-truth documents and connectors correct.

## Departmental specialists (sibling roster)

When `specialists/marketing.md` (and the other department files) are on the branch, route build work there:

- Marketing — campaigns, SMS, landing, PR
- Operations — intake, compliance, skip trace, relo ops
- Sales — PRN, recruiting, agreements, roster
- DNN News — articles, broadcast, Charlie/Bob, HeyGen
- Finance — company financials only; do not change the app unless explicitly asked

## How to assign work

In Cursor: start with the desk name, then the job.

`Canon Specialist: tighten the luxury-family ICP against the Nashville owner sequence.`  
`Playbook Specialist: update the Lead Management SOP SLA to 4 hours.`  
`Conduit Specialist: document the Gmail owner-reply webhook and add Slack routing.`

Grok Bot: set **Department** in `briefs/from-grok/.../HANDOFF.md` to `Canon` | `Playbook` | `Conduit` (or a departmental desk).

Admin roster: `/admin/library-specialists`  
Knowledge Library: `/admin/claude-flow