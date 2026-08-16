# Interactive Workflow Boxes — Handoff Brief for Cursor & Grok Bot

**Owner:** Base44 (platform + architecture)
**Heavy lifting:** Cursor (code) + Grok Bot (specs)
**Target page:** `src/pages/AdminWorkflowAtlas.jsx`
**Target data:** `src/lib/departmentWorkflows.js`
**Status:** Ready for execution overnight / off-hours

---

## 1. Objective

Turn every workflow atlas box (stage) from a **static visual** into a **live execution unit**.

Today each box shows a title, a plain-English description, and links to admin pages. The goal: each box becomes a 3-part interactive unit —

1. **Voice / text input** — the operator speaks or types the objective for that box (e.g., "Find listings in Nashville under $400K").
2. **Specialist execution** — the box dispatches to the correct Grok specialist via the existing `grokChiefOrchestrate` backend function. The specialist runs the task and returns a result.
3. **Save + Export** — the action and its result are (a) saved to a persistent action log on the flow, and (b) routed to the correct downstream file / department function (listing → client record, SMS blast → campaign log, reply → owner board, etc.).

The atlas becomes a **living execution dashboard** — visual, voice-driven, logged at every step, no idle waiting.

---

## 2. What already exists — reuse, do not rebuild

### Command Center orchestration (already live)
- **Backend function:** `grokChiefOrchestrate` — routes an admin message to the right specialist and returns the specialist's response. Already logs every dispatch to the `GrokDispatch` entity.
- **Page:** `src/pages/AdminGrokCommand.jsx` — the Command Center UI. Shows the org chart (Bob, Jay, Chief + all Grok Assistants), a chat panel, and a live activity feed pulled from `GrokDispatch`.
- **Entity:** `GrokDispatch` — persistent log of every orchestrator → specialist dispatch. Fields: `admin_message`, `orchestrator_id`, `specialist_id`, `specialist_name`, `specialist_response`, `orchestrator_response`, `action`, `status`.
- **Sidebar widget:** `AdminDispatchWidget` — live scrollable dispatch feed.

### Workflow atlas (the target)
- **Page:** `src/pages/AdminWorkflowAtlas.jsx` — renders `MasterView` (all desks) or `DepartmentView` (one desk's flow). Each stage is a `StageBox` with a `StageDetail` panel below.
- **Data:** `src/lib/departmentWorkflows.js` — `WORKFLOW_DESKS` (6 desks), `DEPARTMENT_FLOWS` (6 flows with stages), `MASTER_JOURNEYS` (4 human journeys). Each stage has `id`, `title`, `plain`, and `pages[]` (admin links).

### Specialists
- **Library specialists:** `src/lib/librarySpecialists.js` — Canon, Playbook, Conduit.
- **Department desks:** `src/lib/departmentWorkflows.js` — Marketing, Operations, Sales, DNN, Finance, Knowledge.
- Each desk has a `specialist` name and a `color`. The orchestrator already knows how to route to these.

---

## 3. Architecture for interactive boxes

### New entity: `WorkflowAction`

A persistent log of every action executed from a workflow box.

```
Entity: WorkflowAction
Fields:
  - desk_id        string    (marketing | operations | sales | dnn | finance | knowledge)
  - stage_id       string    (the stage id from DEPARTMENT_FLOWS, e.g. "find", "trace", "send")
  - stage_title    string    (denormalized for display)
  - operator_id    string    (created_by_id — the admin who ran it)
  - input_text     string    (what the operator said/typed)
  - specialist_id  string    (which specialist handled it — from grokChiefOrchestrate response)
  - specialist_name string
  - response_text  string    (the specialist's answer)
  - status         string    (enum: pending | completed | failed)
  - export_target  string    (where the result was routed — see §5)
  - export_id      string    (entity record id if the result created/updated a record)
  - error_message  string    (null unless status=failed)
  - created_date   datetime  (built-in)
```

**RLS:** admin-only (read, create, update, delete all require `role: admin`). Same pattern as `GrokDispatch`.

### UI changes to `AdminWorkflowAtlas.jsx`

Each `StageBox` gets:
- A **microphone / input affordance** (small icon in the corner of the box).
- When clicked, the `StageDetail` panel below expands to show an **input bar** (text + optional voice via Web Speech API) and a **run button**.
- On run: call `grokChiefOrchestrate` with the operator's input + the stage context (desk_id + stage_id + stage title as context).
- Show the specialist's response inline in the detail panel.
- Save the action to `WorkflowAction`.
- If the stage has an `export_target`, route the result to the right downstream function/entity (see §5).

### New component: `WorkflowActionPanel`

A focused component (under 50 lines) that lives below `StageDetail`. It:
- Shows the input bar + run button.
- Shows the last action's response (loading while in flight).
- Shows a compact history of prior actions on this stage (last 5, from `WorkflowAction` filtered by desk_id + stage_id).

### New component: `WorkflowActionLog`

A compact list of recent actions across all stages of the current desk — shown at the bottom of `DepartmentView`. Gives the operator a running history of what they've executed in this flow.

---

## 4. Per-flow execution specs

Each stage in each flow needs an `export_target` — where the result goes. Here is the mapping. **Grok Bot should draft the detailed prompts for each specialist; Cursor wires the UI.**

### Marketing flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| find | `PropertySearch` entity | Create/update a search profile for the city+price |
| trace | `ListingOwner` entity | Skip trace results save to owner records |
| send | `BatchSMSLog` entity | SMS blast logged as a batch |
| board | `ListingOwner` status update | "Yes" replies move owner to contacted status |
| follow | `SMSSequenceEnrollment` entity | Day-3+ follow-up enrollment |
| press | `MediaPitch` entity | PR pitch created/tracked |

### Operations flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| intake | `RelocationClient` entity | New client record from intake |
| plan | `MovingPlan` entity | Roadmap / plan created for client |
| hygiene | `OptOut` entity check | Opt-outs and dupes cleaned |
| compliance | `ComplianceDocument` entity | Doc routed for review |
| watch | `CharlieEscalation` entity | Flagged chat escalated |

### Sales & PRN flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| recruit | `VettedPartner` entity | New recruit added to pipeline |
| roster | `ReferralAgentList` entity | Agent added to master roster |
| agree | `generateReferralAgreement` function | Agreement PDF generated |
| handoff | `ReferralHandoff` entity | Lead handoff logged |
| vet | `VettedPartner` status update | Vetted agent marked active |

### DNN News flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| write | `DnnArticle` entity | Article/script created |
| render | `DnnBroadcast` entity | Show dispatched to render pipeline |
| publish | `DnnBroadcast.distribution` | Distribution status updated |
| audience | `DnnSubscriber` entity | Subscriber / bureau updated |

### Finance flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| fees | read-only (no export) | Advisory only — no record created |
| revenue | read-only (no export) | Advisory only |
| cost | read-only (no export) | Advisory only |

### Knowledge flow
| Stage | export_target | What happens |
|-------|--------------|--------------|
| canon | `ClaudeNode` entity | Knowledge doc updated |
| playbook | `ClaudeNode` entity | SOP updated |
| conduit | read-only (no export) | Integration status check only |

**Finance and Knowledge conduit are advisory / read-only.** Do not create records from these stages. The specialist can explain; it does not write.

---

## 5. Base44 conventions Cursor MUST follow (build breakers)

These will break the build if violated. Read them twice.

### Imports
- **ESM only.** Never use `require()` or `module.exports`. This is a Vite ESM project.
- Use the `@/` alias for all imports: `@/components/...`, `@/lib/...`, `@/api/base44Client`. Never use relative `src/` paths.
- `cn` comes from `@/lib/utils`. Never import it from `@/utils`.
- Each shadcn UI component is imported from its own file: `Label` from `@/components/ui/label`, `useToast` from `@/components/ui/use-toast`. One UI file never re-exports another.
- Icons: `lucide-react` only, only icons that exist. A nonexistent or unimported icon breaks the whole app.
- If a lucide icon shares a page/component name, alias it: `import { Home as HomeIcon } from "lucide-react"`.

### Entities
- Entity schemas live in `base44/entities/<Name>.jsonc`. They are stored as JSON objects — always write the complete schema, no placeholders.
- Built-in fields (never declare): `id`, `created_date`, `updated_date`, `created_by_id`.
- Never store large content (base64, PDFs, blobs) in entity fields. Upload via `UploadFile`, store the `file_url`.
- Entity SDK: `import { base44 } from '@/api/base44Client'` then `base44.entities.WorkflowAction.list()`, `.create()`, `.filter()`, etc.

### Backend functions
- Backend functions live in `base44/functions/<name>/entry.ts`.
- Logic shared by more than one function goes in `base44/shared/` and is imported — never copy between functions.
- After writing/editing a function, test it with `test_backend_function`.
- All admin-facing backend functions must verify the caller has `role: admin` (except public consumer tools).

### Styling
- Tailwind classes must be literal strings — the build purges dynamic names (`bg-${color}-500`).
- Color tokens: `hsl(var(--token))` needs HSL channels; `rgb(var(--token))` needs RGB tuples. Never mix.
- Use mapped token classes (`bg-primary`, `font-heading`) — no hardcoded hex in JSX (`bg-[#ffffff]`, `bg-white`).
- The app uses a custom Dyson theme: black background, gold (`#D4AF37`) accents, serif headings (`Cormorant Garamond`), `Inter` body. Match the existing `AdminWorkflowAtlas.jsx` look.

### Components
- Small focused files: components under 50 lines. Every new component gets its own file.
- Export every component as default, named same as its file.
- Hooks are called only at the top level of a component — never conditionally, in loops, or inside handlers.

### Routing
- `src/App.jsx` is the router. New pages need an import + a `<Route>`. Edit it surgically — never rewrite the whole file.
- `<Routes>` may contain only `<Route>` elements as direct children.

---

## 6. Security constraints

### Authentication & authorization
- **Every backend function invoked from the workflow atlas must verify `role: admin`.** The workflow atlas is admin-only. No exceptions.
- The `grokChiefOrchestrate` function already does this — reuse it, do not create a parallel path.
- Frontend: the workflow atlas page is already behind the admin layout (`AdminLayout`). Keep it there.

### RLS on the new `WorkflowAction` entity
```
read:    admin only
create:  admin only
update:  admin only
delete:  admin only
```
Same pattern as `GrokDispatch`. No app-user or public access. Workflow actions are internal operational logs.

### Data safety
- **Never log PII to `WorkflowAction.input_text` or `response_text`.** The specialist responses may contain client names, phone numbers, emails. If the specialist returns PII, store it — but the entity is admin-only, so it stays internal. Do not surface workflow action logs in any public or app-user-facing view.
- **Never send PII to an external LLM that doesn't need it.** The `grokChiefOrchestrate` function already controls the prompt. Do not pass raw client phone numbers or emails in the orchestrator input unless the specialist explicitly needs them to perform the task.
- **Opt-out compliance:** The Marketing "send" stage must check the `OptOut` entity before any SMS blast. The specialist should refuse to draft a blast that includes opted-out numbers. This is a TCPA requirement, not a preference.
- **No direct database writes from the frontend.** All entity mutations go through the Base44 SDK (`base44.entities.X.create/update`). Never use direct API calls or raw fetch.

### Secrets
- Secrets are set via the Base44 dashboard (not in code). Existing secrets: `TWILIO_AUTH_TOKEN`, `HEYGEN_API_KEY`, `GEMINI_API_KEY`, `N8N_BROADCAST_WEBHOOK_URL`, etc.
- Never hardcode API keys in frontend code. Never log secret values.
- Backend functions reference secrets via `process.env.<SECRET_NAME>`.

### What the specialists can and cannot do
- **Can:** read entities, draft content, explain, recommend, route to the orchestrator.
- **Cannot:** write code, modify the app, create users, send payments, bypass RLS, override opt-outs.
- The orchestrator (`grokChiefOrchestrate`) is the single chokepoint. Do not create a second dispatch path from the workflow atlas.

---

## 7. Voice input (optional, phase 2)

If voice is desired, use the browser's Web Speech API (`webkitSpeechRecognition`). It is free, runs client-side, and needs no backend. Keep it optional — text input is the primary path and must work without voice.

Do not use `GenerateSpeech` (TTS) for input — that's output. Do not use `TranscribeAudio` for live voice — that's for uploaded audio files.

---

## 8. Execution order (suggested)

1. **Grok Bot (tonight):** Draft the specialist prompt for each stage — what the specialist should do when it receives a message on that stage, what entity it should create/update, and what it should return. Save these as a spec doc.
2. **Cursor (tomorrow):** 
   a. Create the `WorkflowAction` entity (full schema, admin RLS).
   b. Add `export_target` to each stage in `departmentWorkflows.js`.
   c. Create `WorkflowActionPanel` component (input + run + last response).
   d. Create `WorkflowActionLog` component (recent actions for the desk).
   e. Wire both into `AdminWorkflowAtlas.jsx` — `StageDetail` gets the panel, `DepartmentView` gets the log.
   f. Wire the run button to call `grokChiefOrchestrate` and save to `WorkflowAction`.
3. **Base44 (tomorrow):** Verify the build lands clean, RLS is correct, no PII leaks, opt-out check works on the Marketing send stage.

---

## 9. What NOT to do

- Do not create a second orchestrator. Use `grokChiefOrchestrate`.
- Do not create a second dispatch log entity. Use `GrokDispatch` for orchestrator routing; `WorkflowAction` is for the workflow atlas action history (they overlap but serve different UI).
- Do not make Finance stages create records. They are advisory.
- Do not bypass opt-out checks on SMS stages.
- Do not add voice as a hard dependency. Text input must work first.
- Do not rewrite `AdminWorkflowAtlas.jsx` wholesale. Add the interactive layer with `find_replace` and new component files.
- Do not change the existing visual style of the atlas. The boxes stay gold-bordered, serif, dark background. The interactive layer is additive.

---

## 10. Questions for Grok Bot to answer in the spec doc

For each stage in each flow, Grok Bot should answer:
1. What is the specialist's task when it receives a message on this stage?
2. What entity (if any) should the result save to?
3. What fields should be populated?
4. What should the specialist return to the operator?
5. What are the failure modes (opt-out, bad data, missing fields)?
6. What is the confirmation message the operator should see?

Answer these for all 6 flows × their stages. That is the spec Cursor builds from.

---

**End of brief. Base44 will verify the build when Cursor's work syncs back.**