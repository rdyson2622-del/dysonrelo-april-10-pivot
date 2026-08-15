# DNN Daily News — Decoupled 3-Stage Pipeline Architecture

> **Status**: LEGACY / FALLBACK — creative path is being replaced.
> **New target**: see [`DNN_INHOUSE_CREATIVE.md`](./DNN_INHOUSE_CREATIVE.md)
> (eliminate HeyGen + Creatomate for daily mornings; Google TTS + owned studio).
>
> Historical note: transitioned from monolithic n8n workflow to event-driven
> micro-workflows because HeyGen renders (2-5 min) exceeded n8n Wait timeouts.

---

## Architecture Overview

```
  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
  │  WORKFLOW 1  │        │  WORKFLOW 2  │        │  WORKFLOW 3  │
  │ Script &     │        │ Webhook      │        │ Multi-Channel│
  │ Dispatch     │        │ Ingestion    │        │ Publishing   │
  │ (~5 sec)     │        │ (~3 sec)     │        │ (as needed)  │
  └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
         │                       │                       │
    Gemini script            HeyGen callback         Base44 trigger
    HeyGen dispatch          Cloud upload             (status=ready)
    → Base44 status=         → Base44 status=         → Social + SMS
      "rendering"              "ready"                  + Email
                                                      → Base44 status=
                                                        "completed"
```

**Key principle**: No n8n workflow ever holds an open HTTP connection waiting for
HeyGen. HeyGen renders independently in the background and calls back via its
native webhook when done.

---

## Base44 Database Schema (DnnBroadcast entity)

| Field | Type | Stage | Description |
|-------|------|-------|-------------|
| `id` | string (built-in) | — | Unique record id |
| `status` | enum | all | `draft` → `rendering` → `ready` → `completed` (or `failed`) |
| `script` | text | Stage 1 | Gemini-generated news script |
| `heygenId` | string | Stage 1 | HeyGen video job id (set by W1) |
| `videoUrl` | string (CDN) | Stage 2 | Final MP4 URL (set by W2 after cloud upload) |
| `published_at` | date-time | Stage 3 | When all channels published (set by W3) |
| `distribution` | array | Stage 3 | Per-channel publish results + analytics |
| `errorMessage` | string | any | Last error if failed |
| `created_date` | date-time (built-in) | — | Record creation timestamp |

### Status Flow
```
draft (Scripting)
  ↓  n8n W1 dispatches to HeyGen, calls dnnRenderDispatched
rendering (HeyGen rendering in background)
  ↓  HeyGen calls n8n W2 webhook, W2 uploads to cloud, calls n8nBroadcastCallback
ready (MP4 uploaded, CDN link stored)
  ↓  Base44 entity automation fires dnnTriggerDistribution → n8n W3
completed (Published to all channels)
```

---

## Base44 Backend Functions (API Endpoints)

### 1. `dnnRenderDispatched` — Stage 1 callback
- **URL**: `https://1dnn.com/functions/dnnRenderDispatched`
- **Called by**: n8n Workflow 1 (after HeyGen dispatch)
- **Auth**: `N8N_PIPELINE_SECRET` (header `x-pipeline-secret` or body `pipeline_secret`)
- **Payload**:
  ```json
  {
    "broadcast_id": "<id>",
    "heygen_video_id": "<HeyGen job id>",
    "script": "<optional Gemini script text>",
    "pipeline_secret": "<secret>"
  }
  ```
- **Action**: Sets `status="rendering"`, stores `heygenId`, optionally stores `script`

### 2. `n8nBroadcastCallback` — Stage 2 callback (EXISTING, reused)
- **URL**: `https://1dnn.com/functions/n8nBroadcastCallback`
- **Called by**: n8n Workflow 2 (after cloud upload)
- **Auth**: `N8N_PIPELINE_SECRET`
- **Payload**:
  ```json
  {
    "broadcast_id": "<id>",
    "status": "ready",
    "video_url": "<CDN MP4 URL>",
    "pipeline_secret": "<secret>"
  }
  ```
- **Action**: Sets `status="ready"`, stores `videoUrl`

### 3. `dnnTriggerDistribution` — Stage 3 trigger (entity automation)
- **URL**: `https://1dnn.com/functions/dnnTriggerDistribution`
- **Called by**: Base44 entity automation (DnnBroadcast update → status="ready")
- **Action**: Fetches broadcast, fires n8n Workflow 3 webhook with video_url + metadata

### 4. `dnnPublishComplete` — Stage 3 callback
- **URL**: `https://1dnn.com/functions/dnnPublishComplete`
- **Called by**: n8n Workflow 3 (after all channels published)
- **Auth**: `N8N_PIPELINE_SECRET`
- **Payload**:
  ```json
  {
    "broadcast_id": "<id>",
    "distribution_results": [
      { "channel": "linkedin", "status": "sent", "post_id": "..." },
      { "channel": "facebook", "status": "sent", "post_id": "..." },
      { "channel": "instagram", "status": "failed", "error": "token expired" },
      { "channel": "subscriber_email", "status": "sent", "recipient_count": 142 }
    ],
    "pipeline_secret": "<secret>"
  }
  ```
- **Action**: Sets `status="completed"`, stamps `published_at`, merges `distribution` results

### 5. `dnnRetriggerBroadcast` — Manual re-trigger (EXISTING, updated)
- **URL**: `https://1dnn.com/functions/dnnRetriggerBroadcast`
- **Called by**: Admin (from Show Pipeline UI)
- **Action**: Resets broadcast to `status="draft"`, fires n8n Workflow 1 webhook

---

## n8n Workflow Configuration

### Workflow 1: Script & Dispatch (~5 sec)
1. **Trigger**: Daily cron OR webhook from Base44 (`N8N_BROADCAST_WEBHOOK_URL`)
2. **Gemini node**: Generate news script (structured JSON: title, script, captions, sms_text)
3. **HeyGen node**: POST `/v2/video/generate` with script + avatar params + `webhook_url` → n8n W2 listener URL
4. **HTTP node**: POST to `https://1dnn.com/functions/dnnRenderDispatched` with `{ broadcast_id, heygen_video_id, script }` + `x-pipeline-secret` header
5. **END** — do NOT add a Wait/poll node

### Workflow 2: Webhook Ingestion (~3 sec)
1. **Trigger**: n8n Webhook node (listens for HeyGen `video_status.completed`)
   - URL: `https://<n8n-domain>/webhook/heygen-callback` (give this to HeyGen as `webhook_url`)
2. **Catch**: `video_id` + raw CDN video URL from HeyGen payload
3. **Cloud upload**: Transfer URL → Cloud Storage (S3/R2/Cloudinary), get permanent CDN link
   - CRITICAL: pass string URLs only, never raw .mp4 binary through n8n nodes
4. **HTTP node**: POST to `https://1dnn.com/functions/n8nBroadcastCallback` with `{ broadcast_id, status: "ready", video_url }` + `x-pipeline-secret` header
5. **END**

### Workflow 3: Multi-Channel Publishing (as needed)
1. **Trigger**: Webhook from Base44 (`N8N_DISTRIBUTION_WEBHOOK_URL` — fired by entity automation)
2. **Fetch**: broadcast_id, video_url, script, headlines from trigger payload
3. **Publish concurrently** (parallel branches, isolated error-retry per channel):
   - LinkedIn (POST to page)
   - Facebook (POST to page)
   - Instagram (Reels)
   - Twilio SMS broadcast
   - Subscriber email blast
4. **HTTP node**: POST to `https://1dnn.com/functions/dnnPublishComplete` with `{ broadcast_id, distribution_results }` + `x-pipeline-secret` header
5. **END**

---

## Secrets Required

| Secret | Used By | Purpose |
|--------|---------|---------|
| `N8N_BROADCAST_WEBHOOK_URL` | Base44 → n8n W1 | Trigger script & dispatch |
| `N8N_DISTRIBUTION_WEBHOOK_URL` | Base44 → n8n W3 | Trigger multi-channel publishing |
| `N8N_PIPELINE_SECRET` | n8n → Base44 | Authenticate all n8n→Base44 callbacks |
| `HEYGEN_API_KEY` | n8n W1 | HeyGen video generation |
| `GEMINI_API_KEY` | n8n W1 | Script generation |
| `CREATOMATE` | n8n (optional) | Alternative compositing |
| `TWILIO_*` | n8n W3 | SMS broadcast |

---

## Entity Automation

**Name**: DNN Broadcast → Distribution Trigger
**Type**: entity
**Entity**: DnnBroadcast
**Event**: update
**Conditions**: `changed_fields` contains `status` AND `data.status` equals `ready`
**Function**: `dnnTriggerDistribution`

This ensures distribution fires exactly once — only when status transitions TO "ready",
not on every subsequent update of an already-ready record.