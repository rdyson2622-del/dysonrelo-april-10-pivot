# DNN Desk — Lead Agent, Specialists & Social MP4 Plan

> Goal: Every morning news run ends in a **usable MP4** posted to **7 social / distribution sites**,
> orchestrated by a **DNN lead AI agent** with **specialist assistants** under it.

---

## 1. Seven distribution targets

| # | Site | Today | MP4 requirement | Owner specialist |
|---|------|-------|-----------------|------------------|
| 1 | **LinkedIn** | API video upload (pages + personal) | Horizontal MP4/WebM URL | Herald |
| 2 | **Facebook** | Graph `file_url` video | Public CDN MP4 | Herald |
| 3 | **Instagram** | Reels API | Public video URL (prefer 9:16 later) | Herald |
| 4 | **YouTube** | Loomly / manual | MP4 download | Herald |
| 5 | **TikTok** | Loomly / manual | Prefer 9:16 MP4 | Herald |
| 6 | **X (Twitter)** | Pitch/media only today | MP4 or watch link | Herald |
| 7 | **DNN News (1dnn.com)** | In-app player + `in_app_news` flag | Player + optional MP4 | Signal |

Native auto-upload today: **LinkedIn, Facebook, Instagram** (`dnnSocialPostCore`).  
Manual / Loomly handoff: **YouTube, TikTok, X**.  
Always: **in-app DNN News**.

---

## 2. MP4 bake plan (no Creatomate / no HeyGen for daily)

### Target asset
- Field: `DnnBroadcast.compositedVideoUrl`
- Format phase 1: **WebM or MP4**, 1920×1080 @ 30fps, studio BG + dual hosts + bullets + TTS
- Format phase 2: also emit **9:16** crop for IG/TikTok/Shorts

### Bake pipeline (in-house)

```
Approved scripts (intro / content / outro)
        ↓  Conductor triggers bake
 Google TTS per scene (Charlie + Bob)     ← already: charlieSpeak
        ↓
 Canvas studio compositor (1920×1080)
   • studio background
   • Charlie plate (LL) / Bob plate (LR)
   • whiteboard bullets on Bob scene
   • headline lower-third
        ↓  MediaRecorder (canvas video + TTS audio)
 Blob → Core.UploadFile
        ↓
 compositedVideoUrl + status=ready
        ↓  Herald
 dnnSocialPostCore → LI / FB / IG
 + download MP4 for YouTube / TikTok / X / Loomly
 + flag in_app_news
```

### Why this fits Base44 / Cursor
- No ffmpeg binary in Deno
- Reuses `UploadFile` + existing social core
- Creatomate becomes optional fallback only
- HeyGen not required for daily MP4

### Implementation stages
1. **Now** — Client bake utility + Admin “Bake MP4” on In-House Creative  
2. **Next** — Auto-bake after script approval (Conductor)  
3. **Then** — 9:16 variant + YouTube/TikTok connectors  
4. **Later** — Evergreen silent video loops instead of still plates  

---

## 3. DNN lead agent + specialist assistants

**Lead:** **Conductor** — DNN Desk Lead / Workflow Orchestrator  
Owns the morning run end-to-end. Specialists report status to Conductor; Conductor alone decides go/no-go for bake + social.

| Specialist | Pipeline stage | Primary surfaces |
|------------|----------------|------------------|
| **Pulse** | National source pull / market intel | `dnnNationalSourcePull`, News Feed |
| **Scout** | Story scoring / selection | `dnnSelectBroadcastStories` |
| **Composer** | White-label scripts + CTAs + bullets | Daily News Library, Script Studio |
| **Charlie** | On-air anchor voice (open/close) | `charlieSpeak` speaker=charlie |
| **Signal** | Studio assembly + MP4 bake | In-House Creative, bake utility |
| **Herald** | 7-site distribution | `dnnSocialPostCore`, Social Launch, Loomly |
| **Emissary** | Subscriber email / SMS blast | Morning email blast, Twilio |
| **Sentinel** | Credits, failures, escalations | Credit Monitor, fail alerts |

Bob Dyson is the **on-camera expert identity** (TTS speaker=bob), not a separate orchestration agent.

Human **Agent Bureau** (PartnerAgents) stays outside this AI org chart.

---

## 4. Morning run (Conductor checklist)

1. Pulse — national sources pulled / white-labeled  
2. Scout — top stories selected  
3. Composer — intro / content / outro + bullets approved  
4. Signal — bake MP4 → `compositedVideoUrl`  
5. Herald — post to LI/FB/IG; stage YT/TikTok/X downloads; mark in-app  
6. Emissary — subscriber email / SMS if scheduled  
7. Sentinel — confirm no failed renders / low credits  

---

## 5. Repo scaffold

| Artifact | Purpose |
|----------|---------|
| `DNN_DESK_AGENTS_AND_MP4_PLAN.md` | This plan |
| `src/lib/dnnDeskAgents.js` | Lead + specialist roster (source of truth) |
| `src/lib/bakeInHouseShow.js` | Canvas + MediaRecorder → UploadFile |
| `/admin/dnn/desk-org` | Admin org chart + stage links |
| In-House Creative “Bake MP4” | Signal’s first tool |

---

## 6. Success criteria

- [ ] One button produces a downloadable / CDN MP4 from approved scripts  
- [ ] `compositedVideoUrl` set without HeyGen or Creatomate  
- [ ] Herald can post that URL to LinkedIn, Facebook, Instagram  
- [ ] Same file downloadable for YouTube, TikTok, X  
- [ ] Desk org page lists Conductor + specialists with stage ownership  
- [ ] After one clean week, HeyGen auto-render stays off by default  
