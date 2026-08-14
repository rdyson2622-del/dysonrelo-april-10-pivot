# DNN In-House Morning Creative — Target Architecture

> **Decision (Aug 2026):** Reimagine the daily morning news creative stack.
> Eliminate paid avatar / composite APIs we do not need. Keep national
> white-label research + script parameters. Deliver Charlie Simmons + Bob Dyson
> in our owned studio using Cursor / Base44-native pieces.

---

## Product intent (unchanged)

1. Pull national real-estate news sources  
2. White-label rewrite into DNN voice (solutions for relocating clients)  
3. Build a parameterised 3-scene script (Charlie open → Bob body → Charlie close)  
4. Present in **our studio background** with **two hosts**:
   - Charlie Simmons — news desk anchor (lower-left box)
   - Bob Dyson — reporting / solutions expert (remote box)
5. Publish morning brief to clients / social / DNN feed

---

## Eliminate vs keep

| Vendor | Role today | Decision | Why |
|--------|------------|----------|-----|
| **ElevenLabs** | None in code | **Already gone** | Business Plan + zero code. Confirm billing cancelled. |
| **HeyGen** | Daily avatar / lip-sync MP4 | **Eliminate for daily creative** | Largest cost + slowest path. Replace with evergreen host plates + Google TTS. |
| **Creatomate** | Bake studio BG + whiteboard for social | **Eliminate for daily creative** | Studio already composited in-app (`TagTeamBroadcastPlayer`). Social can deep-link 1dnn.com or capture later. |
| **Epidemic Sound** | Unused in render path | **Eliminate** | Sting is already owned Web Audio / MP4. |
| **n8n creative W1–W3** | Documented dual path | **Eliminate creative dependency** | `n8nGuard` already blocks M2M; Base44 owns pollers. |
| **Gemini / Google TTS** | Script + research + voice | **Keep** | In-house control plane still needs one LLM + TTS. Already used by `charlieSpeak` / national pull. |
| **Base44 entities + admin** | Orchestration | **Keep** | Source of truth for articles, scripts, approval. |
| **Twilio / social connectors** | Distribution | **Keep (not creative)** | Separate budget from creative render. |

---

## Target morning flow (in-house)

```
 National sources (DnnNewsSource)
        ↓  dnnNationalSourcePull (Gemini rewrite / white-label)
 DnnArticle (published, national)
        ↓  admin select / auto-score
 Parameterised script
   intro_script  (Charlie)
   content_script (Bob) + whiteboard bullets
   outro_script  (Charlie)
        ↓  Google Cloud TTS (charlieSpeak speaker=charlie|bob)
 Audio beds per scene
        ↓  InHouseMorningShowPlayer
 Studio BG + host plates + live nameplates + bullets
        ↓
 In-app /dnn-news + BroadcastShow  (primary)
 Optional: later MediaRecorder / ffmpeg bake for social MP4
        ↓
 Existing distribution (LinkedIn/FB/IG/email/SMS)
```

### What replaces HeyGen
- **Still / evergreen host plates** (Charlie + Bob headshots we already host)
- **Google TTS** for each scene (no lip-sync vendor)
- **Subtle talk pulse** on the active host box while audio plays
- Optional later: one-time filmed evergreen open/close loops (render once, reuse forever)

### What replaces Creatomate
- **Frontend studio assembly** already proven in `TagTeamBroadcastPlayer`
- Social posts prefer **watch link** to 1dnn.com until/unless we add a browser bake step

---

## Script parameters (keep)

From Daily News Library / BroadcastTemplate:

- Opening CTA (Charlie)
- Body / content bullets (Bob — solutions tone)
- Closing CTA (Charlie)
- Show name, date, headlines
- Whiteboard bullets timed to Bob scene

---

## Implementation status

| Piece | Status |
|-------|--------|
| Architecture decision (this doc) | Done |
| Admin prototype `/admin/dnn/in-house-creative` | Done |
| `InHouseMorningShowPlayer` | Done |
| `charlieSpeak` multi-speaker (charlie \| bob) | Done |
| Freeze HeyGen as non-default for new morning shows | Next (flag in auto-render) |
| Retire Creatomate from morning social path | Next |
| Evergreen silent video loops (optional polish) | Later |
| Browser MediaRecorder social bake | Later |

---

## Explicit non-goals (this phase)

- Do not rebuild lip-synced photoreal avatars in-house yet  
- Do not cancel Twilio / Meta / LinkedIn distribution  
- Do not delete HeyGen functions immediately — keep as **manual fallback** until in-house path is trusted for a full week of mornings
