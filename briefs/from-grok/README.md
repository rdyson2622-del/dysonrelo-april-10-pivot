# Briefs from Grok Bot

Grok drops task briefs here. Cursor implements them in Base44/GitHub.

## How to hand off (Grok)

1. Create a dated folder: `briefs/from-grok/YYYY-MM-DD-short-slug/`
2. Add `HANDOFF.md` using the template in `briefs/HANDOFF_TEMPLATE.md`
3. Set **Department** to a departmental desk (Marketing, Operations, Sales, DNN News, Finance) or a library desk (Canon, Playbook, Conduit)
4. Put media under `assets/from-grok/YYYY-MM-DD-short-slug/`
5. Open a PR into `main` (or push a branch) and add label **`from-grok`** if available
6. In the PR body, include: goal, pages/functions touched, and “ready for Cursor”

## How Cursor picks it up

1. Read `HANDOFF.md`
2. Implement in app code (`src/`, `base44/`)
3. Open/update a Cursor PR
4. After merge to `main`, publish in Base44

Do not force-push `main`. Prefer feature branches.
