# Briefs from Grok Bot

Grok drops task briefs here. Cursor implements them in Base44/GitHub.
Set **Department** on every brief: Marketing | Operations | Sales | DNN News.
See `specialists/README.md`. Claude is retired as the operating team.

## How to hand off (Grok)

1. Create a dated folder: `briefs/from-grok/YYYY-MM-DD-short-slug/`
2. Add `HANDOFF.md` using the template in `briefs/HANDOFF_TEMPLATE.md`
3. Put media under `assets/from-grok/YYYY-MM-DD-short-slug/`
4. Open a PR into `main` (or push a branch) and add label **`from-grok`** if available
5. In the PR body, include: department, goal, pages/functions touched, and “ready for Cursor”

If the xAI account is still suspended, skip Grok Bot visuals and type the brief in Cursor instead.

## How Cursor picks it up

1. Read `HANDOFF.md` and route to the named departmental specialist
2. Implement in app code (`src/`, `base44/`)
3. Open/update a Cursor PR
4. After merge to `main`, publish in Base44

Do not force-push `main`. Prefer feature branches.
