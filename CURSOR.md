# CURSOR.md — DysonRelo Master Context

**Priority reference for every Cursor, Grok, and Base44 agent interaction.**  
Owned by the **Canon Specialist**. Do not invent a competing brand voice, fee model, or company story.

## Who we are

Dyson & Dyson Concierge Relocation Services is an independent relocation management company — not a brokerage, not a listing portal, not a franchise desk. We manage the move for families going across the country, from first question to final walkthrough.

- **Legal:** The Dyson & Dyson Companies, Inc. · CA DRE #02303118
- **Consumer sites:** dysonrelo.com · 1dnn.com
- **Founder:** Bob Dyson — 40+ years in real estate; built Red Carpet Corporation of America from 500 to 1,600+ offices and 45,000 agents across 42 states; founded Dyson News Network (DNN)
- **Promise:** The service is **100% free to the buyer. Always.**

## How money works (do not freelance)

- **25%** referral fee on the buyer-side commission (receiving agent at close) — protected for the sending/PRN partner
- **10–15%** relocation management fee (disclosed up front)
- Combined managed-referral framing on some handoffs: **35% total** (25% sending broker / 10% Dyson)
- Zero cost, zero surprise fees to the relocating family

## Brand voice (one sentence)

Warm, cinematic, and specific — the “1927 Parallel.” Authoritative like a trusted counselor, never a hype machine. Gold `#D4AF37`, serif headlines, tan `#ede0cc` consumer surfaces, charcoal admin.

Full voice: `specialists/canon.md` and the **Brand Voice & Philosophy** library node.

## Operating team (Cursor + Grok — Claude is retired)

| Desk | Invoke | Owns |
| --- | --- | --- |
| Coordinator | (default) | Routing, PRs, Base44 publish path |
| Marketing | `Marketing Specialist:` | Campaigns, SMS, landing, PR |
| Operations | `Operations Specialist:` | Intake, skip trace, compliance, relo ops |
| Sales | `Sales Specialist:` | PRN, recruiting, agreements, roster |
| DNN News | `DNN News Specialist:` | Articles, broadcast, Charlie/Bob, HeyGen |
| Finance | `Finance Specialist:` | Company money — do not change the app unless asked |
| **Canon** | `Canon Specialist:` | Master files, brand, ICPs, catalog, history |
| **Playbook** | `Playbook Specialist:` | SOP documents (execution stays with the desks above) |
| **Conduit** | `Conduit Specialist:` | Gmail, Drive, Slack, Calendar, CRM, n8n/Grok webhooks |

Departmental desks live in the sibling PR / `specialists/*.md` when present. Library desks live in `specialists/canon.md`, `playbook.md`, `conduit.md`.

The public page `/ai-assistants` (Charlie, Scout, Nexus, Relay, …) is the **customer-facing** roster. Do not confuse those names with this operating team.

## Agent Library (Knowledge Library)

Admin: `/admin/claude-flow`

1. **Departments** — Marketing, Operations, Sales, Finance, DNN News
2. **AI Agent Intelligence** — this file, brand voice, ICPs, service catalog, company history
3. **Skills & SOPs** — lead, property research, client communication, documents, follow-up
4. **Integrations, Workflows & n8n/Grok Webhooks** — Gmail, Drive, Slack, Calendar, CRM

Seed missing nodes from Admin → AI Library Specialists, or invoke `claudeLibrarySeedCatalog`.

## Build rules

- Feature branches only. Never force-push `main`.
- After merge, a human publishes on Base44.com.
- Grok Bot writes briefs under `briefs/from-grok/` using `briefs/HANDOFF_TEMPLATE.md`. Cursor implements.
- Cursor Cloud Agents do not need the owner’s xAI login.
- Finance does not change DysonRelo.com unless the request says so in plain language.
- Do not invent new fees, DRE numbers, or Bob biography facts. Read `src/lib/corporateProfile.js` and the Company History node.

## Product map (short)

- **Charlie** — portal concierge (chat, voice, Gemini live)
- **Relocation intake / roadmap** — Solve My Story → dashboard → city guide → agent match
- **PRN** — independent/boutique agents; Dyson is their national relo desk
- **DNN** — daily real estate news + morning broadcast (Charlie & Bob)
- **Outreach** — listing-owner SMS, skip trace, sequences
- **21 AI assistants** — in-product specialists; Conductor orchestrates them
