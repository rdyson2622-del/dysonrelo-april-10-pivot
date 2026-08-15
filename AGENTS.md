# DysonRelo — Cursor + Grok operating instructions

You are working on **DysonRelo** (dysonrelo.com / 1dnn.com), a Base44 app in this GitHub repo. Any change pushed and merged to `main` is reflected in the Base44 Builder; publish on [Base44.com](https://base44.com).

## Who does what

| App | Job |
| --- | --- |
| **Cursor** (you, in this repo) | Implement pages, entities, and functions. Open PRs. Coordinate desks. |
| **Grok Bot** | Replaced Claude. Write briefs, copy, scripts, and visuals into `briefs/from-grok/` and `assets/from-grok/`. |

Cursor Cloud Agents do **not** need the owner’s xAI login. If the xAI account is still suspended, Grok Bot visuals may be delayed — still implement from text briefs.

## Departmental specialists

Before coding, identify the desk. Full roster: `specialists/README.md` and `src/lib/departmentalSpecialists.js`.

| Say this | Desk | Default owner |
| --- | --- | --- |
| Marketing Specialist | Campaigns, SMS, landing, PR | Grok (creative) + Cursor (build) |
| Operations Specialist | Intake, compliance, skip trace, relo ops | Cursor |
| Sales Specialist | PRN, recruiting, agreements, roster | Cursor + Grok (pitch copy) |
| DNN News Specialist | Articles, broadcast, Charlie/Bob, HeyGen | Grok (editorial) + Cursor (pipeline) |

Company finance is **out of scope for Base44** — do not assign a Finance specialist in this app.

If the request spans desks, stay Coordinator: split the work, do not mix DNN studio changes into a marketing SMS PR.

## Git and Base44

- Feature branches only. Do not force-push `main`.
- Prefer `cursor/<short-slug>` branches.
- After merge to `main`, the human publishes in Base44.
- Secrets stay in Base44 Settings → Secrets. Never commit `.env.local` keys.

## Handoffs from Grok

1. Read `briefs/from-grok/*/HANDOFF.md`
2. Implement in `src/` and `base44/`
3. Open or update a Cursor PR
4. Leave Grok media paths in `assets/from-grok/` as-is unless the brief says to embed them
