# AI Library Specialists

Cross-cutting desks for the three Agent Library sections that are **not** departments.

The five departmental specialists (Marketing, Operations, Sales, DNN News, Finance) remain the build/execute desks. These three own the knowledge, the written SOPs, and the connectors those desks consume.

| Desk | Invoke | Library section | Execute-with |
| --- | --- | --- | --- |
| **Canon** | `Canon Specialist:` | AI Agent Intelligence | All desks (read-only consumers) |
| **Playbook** | `Playbook Specialist:` | Skills & SOPs | Sales, Operations, Marketing |
| **Conduit** | `Conduit Specialist:` | Integrations & webhooks | Conductor / DNN News / Sales |

## Decision (why not fifteen new specialists)

Each bullet the owner listed is a **document or connector**, not a new operating desk.

- CURSOR.md, brand, ICPs, catalog, history → one knowledge desk (**Canon**)
- Five SOPs → one SOP desk (**Playbook**); Sales/Operations/Marketing already run the work
- Gmail, Drive, Slack, Calendar, CRM, n8n/Grok → one integration desk (**Conduit**); Emissary/Signal/Scout stay the in-product consumers

Do not add a sixth “Brand Voice Specialist” or a “Gmail Specialist.” Update the node instead.

## How to assign work

1. Cursor: `Canon Specialist: …` / `Playbook Specialist: …` / `Conduit Specialist: …`
2. Grok Bot: `Department: Canon` | `Playbook` | `Conduit` in `briefs/HANDOFF_TEMPLATE.md`
3. Admin: **AI Library Specialists** at `/admin/library-specialists`
4. Seed library nodes: button on that page, or Admin → Knowledge Library
5. Pictures for new IT: **Master Workflow Atlas** at `/admin/workflows` — also the first item in each admin department section

## Not these specialists

`/ai-assistants` (Charlie, Scout, Nexus, Relay, Emissary, …) is the customer-facing product roster. Crosswalks are listed on each playbook.
