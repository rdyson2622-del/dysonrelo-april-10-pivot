# AI Departmental Specialists

Bob’s operating team for the DysonRelo **Base44** app. **Claude is retired.** Cursor builds. Grok Bot writes briefs and visuals.

Four Base44 desks: **Marketing, Operations, Sales, DNN News.**  
Company finance is outside Base44 and is not assigned here.

## How to assign work

### In Cursor (recommended)

1. Open [cursor.com/agents](https://cursor.com/agents) or the Cursor desktop chat on this repo.
2. Start with the desk name, then the job:

   `Marketing Specialist: draft and wire a Nashville owner SMS sequence.`

3. Cursor reads `.cursor/rules/specialist-*.mdc` and the matching file in this folder.

You do **not** need the xAI account for Cursor. This Cloud Agent already runs on Grok inside Cursor.

### In Grok Bot (when the xAI account is restored)

1. Create `briefs/from-grok/YYYY-MM-DD-short-slug/HANDOFF.md` from `briefs/HANDOFF_TEMPLATE.md`
2. Set **Department** to one of: Marketing | Operations | Sales | DNN News
3. Put visuals in `assets/from-grok/YYYY-MM-DD-short-slug/`
4. Open a PR labeled `from-grok` if that label exists

Until xAI is unsuspended, skip Grok Bot visuals. Type the brief in Cursor instead.

### In the Base44 admin app

After this PR is merged and published: **Admin → AI Departmental Specialists** (`/admin/specialists`).

## Roster

| Desk | File | Platform | App scope |
| --- | --- | --- | --- |
| Coordinator | (root `AGENTS.md`) | Cursor | All DysonRelo / Base44 |
| Marketing | [marketing.md](./marketing.md) | Grok + Cursor | Base44 |
| Operations | [operations.md](./operations.md) | Cursor | Base44 |
| Sales | [sales.md](./sales.md) | Cursor + Grok | Base44 |
| DNN News | [dnn-news.md](./dnn-news.md) | Grok + Cursor | Base44 |

## Not these specialists

- **Finance** — company-wide books, not a Base44 desk. No specialist in this app.
- The public page `/ai-assistants` (Charlie, Scout, Nexus, …) is the **customer-facing** assistant roster inside the product. Do not confuse those names with this operating team.
