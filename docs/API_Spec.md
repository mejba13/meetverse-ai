# MeetVerse AI - API Specification

## API Overview

MeetVerse AI uses a hybrid API approach:
- **tRPC** for internal frontend-to-backend communication (type-safe)
- **REST** for external integrations and webhooks
- **WebSocket** for real-time events (signaling, transcription, presence)

Base URL: `https://api.meetverse.ai/v1`

## Authentication

All authenticated endpoints require one of:
- **Session Cookie**: HTTP-only cookie set after login
- **API Key**: `Authorization: Bearer <api_key>` (for external integrations)

```typescript
// Request headers for API key auth
{
  "Authorization": "Bearer mvai_live_xxxxxxxxxxxx",
  "Content-Type": "application/json"
}
```

---

## REST API Endpoints

### Authentication

#### POST /api/auth/register
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe",
  "organizationName": "Acme Inc" // Optional, creates new org
}
```

**Response (201):**
```json
{
  "user": {
    "id": "usr_xxxxxxxxxxxx",
    "email": "user@example.com",
    "name": "John Doe",
    "organizationId": "org_xxxxxxxxxxxx"
  },
  "message": "Verification email sent"
}
```

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "usr_xxxxxxxxxxxx",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "requiresMfa": false
}
```
*Sets HTTP-only session cookie*

#### POST /api/auth/logout
End user session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Meetings

#### POST /api/meetings
Create a new meeting.

**Request Body:**
```json
{
  "title": "Weekly Standup",
  "description": "Team sync meeting",
  "scheduledStart": "2024-03-15T09:00:00Z",
  "scheduledEnd": "2024-03-15T09:30:00Z",
  "settings": {
    "waitingRoom": true,
    "recording": true,
    "transcription": true,
    "maxParticipants": 50
  }
}
```

**Response (201):**
```json
{
  "id": "mtg_xxxxxxxxxxxx",
  "roomId": "abc-defg-hij",
  "title": "Weekly Standup",
  "hostId": "usr_xxxxxxxxxxxx",
  "inviteLink": "https://meet.meetverse.ai/abc-defg-hij",
  "scheduledStart": "2024-03-15T09:00:00Z",
  "status": "scheduled",
  "createdAt": "2024-03-10T14:30:00Z"
}
```

#### GET /api/meetings
List user's meetings.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by: scheduled, live, ended, cancelled |
| from | ISO8601 | Start of date range |
| to | ISO8601 | End of date range |
| limit | number | Max results (default: 20, max: 100) |
| cursor | string | Pagination cursor |

**Response (200):**
```json
{
  "meetings": [
    {
      "id": "mtg_xxxxxxxxxxxx",
      "roomId": "abc-defg-hij",
      "title": "Weekly Standup",
      "scheduledStart": "2024-03-15T09:00:00Z",
      "status": "scheduled",
      "participantCount": 0
    }
  ],
  "nextCursor": "cursor_xxxx",
  "hasMore": true
}
```

#### GET /api/meetings/:id
Get meeting details.

**Response (200):**
```json
{
  "id": "mtg_xxxxxxxxxxxx",
  "roomId": "abc-defg-hij",
  "title": "Weekly Standup",
  "description": "Team sync meeting",
  "hostId": "usr_xxxxxxxxxxxx",
  "host": {
    "id": "usr_xxxxxxxxxxxx",
    "name": "John Doe",
    "avatarUrl": "https://..."
  },
  "scheduledStart": "2024-03-15T09:00:00Z",
  "scheduledEnd": "2024-03-15T09:30:00Z",
  "actualStart": null,
  "actualEnd": null,
  "status": "scheduled",
  "settings": {
    "waitingRoom": true,
    "recording": true,
    "transcription": true
  },
  "inviteLink": "https://meet.meetverse.ai/abc-defg-hij",
  "createdAt": "2024-03-10T14:30:00Z"
}
```

#### POST /api/meetings/:id/join
Join a meeting and get WebRTC token.

**Request Body:**
```json
{
  "displayName": "John Doe", // For guests
  "audioEnabled": true,
  "videoEnabled": true
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...", // LiveKit JWT
  "serverUrl": "wss://livekit.meetverse.ai",
  "roomName": "abc-defg-hij",
  "participantId": "part_xxxxxxxxxxxx",
  "iceServers": [
    {
      "urls": ["stun:stun.meetverse.ai:3478"]
    },
    {
      "urls": ["turn:turn.meetverse.ai:3478"],
      "username": "xxxx",
      "credential": "xxxx"
    }
  ]
}
```

#### POST /api/meetings/:id/end
End a meeting (host only).

**Response (200):**
```json
{
  "message": "Meeting ended",
  "processingStatus": "started",
  "estimatedProcessingTime": 120 // seconds
}
```

---

### Transcripts & AI

#### GET /api/meetings/:id/transcript
Get meeting transcript.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | json, srt, vtt, txt |
| speakerLabels | boolean | Include speaker names |

**Response (200):**
```json
{
  "meetingId": "mtg_xxxxxxxxxxxx",
  "segments": [
    {
      "id": "seg_xxxxxxxxxxxx",
      "speakerId": "usr_xxxxxxxxxxxx",
      "speakerName": "John Doe",
      "content": "Let's start with the status updates.",
      "startTime": 0,
      "endTime": 2500,
      "confidence": 0.95
    },
    {
      "id": "seg_xxxxxxxxxxxx",
      "speakerId": "usr_yyyyyyyyyyyy",
      "speakerName": "Jane Smith",
      "content": "I finished the API integration yesterday.",
      "startTime": 3000,
      "endTime": 5200,
      "confidence": 0.92
    }
  ],
  "duration": 1800000, // milliseconds
  "wordCount": 4521
}
```

#### GET /api/meetings/:id/summary
Get AI-generated meeting summary.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | executive, detailed, action-focused |

**Response (200):**
```json
{
  "meetingId": "mtg_xxxxxxxxxxxx",
  "format": "executive",
  "summary": "The team discussed Q2 planning and agreed on three main priorities...",
  "keyDecisions": [
    {
      "decision": "Launch feature X by end of March",
      "timestamp": 845000
    }
  ],
  "highlights": [
    {
      "quote": "This is our most important initiative this quarter",
      "speaker": "John Doe",
      "timestamp": 312000
    }
  ],
  "generatedAt": "2024-03-15T10:05:00Z"
}
```

#### GET /api/meetings/:id/actions
Get extracted action items.

**Response (200):**
```json
{
  "meetingId": "mtg_xxxxxxxxxxxx",
  "actionItems": [
    {
      "id": "act_xxxxxxxxxxxx",
      "title": "Send updated project timeline",
      "assignee": {
        "id": "usr_xxxxxxxxxxxx",
        "name": "John Doe"
      },
      "dueDate": "2024-03-18",
      "priority": "high",
      "status": "pending",
      "sourceTranscript": {
        "content": "John, can you send the updated timeline by Monday?",
        "timestamp": 1245000
      },
      "externalTaskId": null
    }
  ],
  "totalCount": 5
}
```

#### POST /api/ai/copilot/query
Query the AI co-pilot.

**Request Body:**
```json
{
  "meetingId": "mtg_xxxxxxxxxxxx", // Optional, for meeting context
  "query": "What were the main points discussed about the budget?",
  "includeKnowledgeBase": true
}
```

**Response (200):**
```json
{
  "response": "Based on the discussion, three main budget points were raised...",
  "sources": [
    {
      "type": "transcript",
      "timestamp": 845000,
      "excerpt": "We need to allocate $50K for..."
    },
    {
      "type": "knowledge_base",
      "documentTitle": "Q2 Budget Planning",
      "excerpt": "The approved budget for Q2 is..."
    }
  ],
  "confidence": 0.89
}
```

---

### Users & Organizations

#### GET /api/users/me
Get current user profile.

**Response (200):**
```json
{
  "id": "usr_xxxxxxxxxxxx",
  "email": "user@example.com",
  "name": "John Doe",
  "avatarUrl": "https://...",
  "subscriptionTier": "pro",
  "organization": {
    "id": "org_xxxxxxxxxxxx",
    "name": "Acme Inc",
    "role": "admin"
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "timezone": "America/New_York"
  }
}
```

#### PATCH /api/users/me
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "avatarUrl": "https://...",
  "preferences": {
    "theme": "light"
  }
}
```

---

## WebSocket Events

### Connection

Connect to: `wss://api.meetverse.ai/ws`

**Authentication:**
```json
{
  "type": "auth",
  "token": "session_token_or_api_key"
}
```

### Meeting Events

**Join Room:**
```json
{
  "type": "room:join",
  "roomId": "abc-defg-hij"
}
```

**Participant Joined:**
```json
{
  "type": "participant:joined",
  "participant": {
    "id": "part_xxxxxxxxxxxx",
    "userId": "usr_xxxxxxxxxxxx",
    "name": "John Doe",
    "avatarUrl": "https://..."
  }
}
```

**Participant Left:**
```json
{
  "type": "participant:left",
  "participantId": "part_xxxxxxxxxxxx"
}
```

### Transcription Events

**Transcript Segment:**
```json
{
  "type": "transcript:segment",
  "segment": {
    "id": "seg_xxxxxxxxxxxx",
    "speakerId": "usr_xxxxxxxxxxxx",
    "speakerName": "John Doe",
    "content": "This is what was just said.",
    "isFinal": false,
    "confidence": 0.87
  }
}
```

**Transcript Final:**
```json
{
  "type": "transcript:final",
  "segment": {
    "id": "seg_xxxxxxxxxxxx",
    "speakerId": "usr_xxxxxxxxxxxx",
    "speakerName": "John Doe",
    "content": "This is the finalized transcript segment.",
    "isFinal": true,
    "confidence": 0.95,
    "startTime": 45000,
    "endTime": 48500
  }
}
```

### AI Events

**Action Item Detected:**
```json
{
  "type": "ai:action_detected",
  "actionItem": {
    "tempId": "temp_xxxxxxxxxxxx",
    "title": "Review the proposal",
    "suggestedAssignee": {
      "id": "usr_xxxxxxxxxxxx",
      "name": "Jane Smith"
    },
    "suggestedDueDate": "2024-03-20",
    "sourceTranscript": "Jane, please review the proposal by Wednesday."
  }
}
```

**Co-Pilot Response:**
```json
{
  "type": "ai:copilot_response",
  "queryId": "query_xxxxxxxxxxxx",
  "response": "Based on the discussion...",
  "isComplete": true
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| MEETING_FULL | 400 | Meeting at capacity |
| MEETING_ENDED | 400 | Meeting has ended |

---

## Rate Limits

| Tier | Requests/minute | WebSocket connections |
|------|-----------------|----------------------|
| Free | 60 | 2 |
| Pro | 300 | 10 |
| Business | 1000 | 50 |
| Enterprise | Custom | Custom |

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1710432000
```
