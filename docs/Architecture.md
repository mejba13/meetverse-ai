# MeetVerse AI - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENTS                                               │
│                                                                                         │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│    │   Web App    │    │   iOS App    │    │ Android App  │    │  Slack Bot   │       │
│    │  (Next.js)   │    │   (Future)   │    │   (Future)   │    │   (Future)   │       │
│    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                                         │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                     EDGE LAYER                                             │
│                                                                                           │
│    ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│    │                           CloudFlare (CDN + WAF + DDoS)                          │   │
│    │                                                                                  │   │
│    │   • Static asset caching          • Rate limiting                               │   │
│    │   • DDoS protection               • Bot protection                              │   │
│    │   • SSL termination               • Geographic routing                          │   │
│    └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                           │
└───────────────────────────────────────────┬───────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│      WEB APPLICATION      │ │      MEDIA SERVERS        │ │      AI SERVICES          │
│                           │ │                           │ │                           │
│  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │ │  ┌─────────────────────┐  │
│  │    Next.js 15       │  │ │  │    LiveKit Cloud    │  │ │  │  Transcription      │  │
│  │    App Router       │  │ │  │    (SFU)            │  │ │  │  (Deepgram)         │  │
│  │                     │  │ │  │                     │  │ │  └─────────────────────┘  │
│  │  • Server Components│  │ │  │  • WebRTC routing   │  │ │  ┌─────────────────────┐  │
│  │  • API Routes       │  │ │  │  • TURN relay       │  │ │  │  LLM Service        │  │
│  │  • tRPC endpoints   │  │ │  │  • Recording        │  │ │  │  (Claude API)       │  │
│  │  • WebSocket server │  │ │  │  • Simulcast        │  │ │  └─────────────────────┘  │
│  └─────────────────────┘  │ │  └─────────────────────┘  │ │  ┌─────────────────────┐  │
│                           │ │                           │ │  │  Vector Search      │  │
└───────────────────────────┘ └───────────────────────────┘ │  │  (Pinecone)         │  │
            │                             │                 │  └─────────────────────┘  │
            │                             │                 └───────────────────────────┘
            │                             │                             │
            └──────────────┬──────────────┴─────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATA LAYER                                            │
│                                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │    PostgreSQL       │  │      Redis          │  │         Object Storage          │ │
│  │    (Neon)           │  │    (Upstash)        │  │       (CloudFlare R2)           │ │
│  │                     │  │                     │  │                                 │ │
│  │  • Users            │  │  • Sessions         │  │  • Recordings                   │ │
│  │  • Organizations    │  │  • Room state       │  │  • Uploaded files               │ │
│  │  • Meetings         │  │  • Rate limiting    │  │  • Profile images               │ │
│  │  • Transcripts      │  │  • Pub/Sub          │  │  • Export files                 │ │
│  │  • Action Items     │  │  • Presence         │  │                                 │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────────────┘ │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend (Next.js 15)

```
src/
├── app/                      # App Router pages
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── (marketing)/         # Public marketing pages
│   ├── meeting/[roomId]/    # Meeting room
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── meeting/             # Meeting-specific components
│   ├── dashboard/           # Dashboard components
│   └── shared/              # Shared components
├── lib/
│   ├── api/                 # API client
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   └── utils/               # Utility functions
├── server/
│   ├── api/                 # tRPC routers
│   ├── db/                  # Prisma schema & client
│   └── services/            # Business logic
└── types/                   # TypeScript types
```

### 2. WebRTC Architecture (SFU Model)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SFU (Selective Forwarding Unit)                    │
│                                                                             │
│                              ┌─────────────────┐                            │
│                              │   LiveKit SFU   │                            │
│                              │                 │                            │
│                              │  ┌───────────┐  │                            │
│                              │  │  Router   │  │                            │
│                              │  └───────────┘  │                            │
│                              │        │        │                            │
│                              └────────┼────────┘                            │
│                                       │                                     │
│            ┌──────────────────────────┼──────────────────────────┐         │
│            │                          │                          │         │
│            ▼                          ▼                          ▼         │
│     ┌─────────────┐           ┌─────────────┐           ┌─────────────┐   │
│     │ Participant │           │ Participant │           │ Participant │   │
│     │     A       │           │     B       │           │     C       │   │
│     │             │           │             │           │             │   │
│     │  Publishes: │           │  Publishes: │           │  Publishes: │   │
│     │  - Video    │           │  - Video    │           │  - Video    │   │
│     │  - Audio    │           │  - Audio    │           │  - Audio    │   │
│     │             │           │             │           │             │   │
│     │ Subscribes: │           │ Subscribes: │           │ Subscribes: │   │
│     │  - B, C     │           │  - A, C     │           │  - A, B     │   │
│     └─────────────┘           └─────────────┘           └─────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Benefits of SFU over Mesh:
• Linear bandwidth scaling (each participant uploads once)
• Server-side recording without client load
• Simulcast for adaptive quality
• Better for 3+ participants
• Easier to implement E2EE
```

### 3. AI Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REAL-TIME PIPELINE                                 │
│                          (During Meeting)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Audio Stream   │───▶│   Deepgram      │───▶│  Transcript     │
│  from LiveKit   │    │   Streaming     │    │  Segments       │
│                 │    │   API           │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      │
                                                      ▼
                                              ┌─────────────────┐
                                              │  WebSocket to   │
                                              │  Client UI      │
                                              │  (< 500ms)      │
                                              └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         POST-MEETING PIPELINE                                │
│                        (After Meeting Ends)                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Meeting Ends
     │
     ▼
┌─────────────────┐
│  Finalize       │
│  Transcript     │───┐
└─────────────────┘   │
                      │
                      ▼
              ┌─────────────────┐
              │  Generate       │
              │  Embeddings     │
              │  (OpenAI Ada)   │
              └─────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Summary    │ │  Action     │ │   Store     │
│  Generation │ │  Extraction │ │  Vectors    │
│  (Claude)   │ │  (Claude)   │ │  (Pinecone) │
└─────────────┘ └─────────────┘ └─────────────┘
          │           │
          ▼           ▼
┌─────────────────────────────────────────────┐
│           Store in PostgreSQL               │
│  • Summary text    • Action items           │
│  • Highlights      • Key decisions          │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            Distribute Results               │
│  • Email to participants                    │
│  • Push to Slack                            │
│  • Create tasks in Asana/Jira               │
└─────────────────────────────────────────────┘
```

### 4. Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTH ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Client      │         │   NextAuth.js   │         │    Database     │
│                 │         │     v5          │         │                 │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         │  1. Login Request         │                           │
         │ ─────────────────────────▶│                           │
         │                           │                           │
         │                           │  2. Validate credentials  │
         │                           │ ─────────────────────────▶│
         │                           │                           │
         │                           │  3. User record           │
         │                           │ ◀─────────────────────────│
         │                           │                           │
         │                           │  4. Create session        │
         │                           │ ─────────────────────────▶│
         │                           │                           │
         │  5. Set HTTP-only cookie  │                           │
         │ ◀─────────────────────────│                           │
         │     + CSRF token          │                           │
         │                           │                           │

Token Strategy:
┌─────────────────────────────────────────────────────────────────────────────┐
│  Session Token (Cookie)                                                      │
│  ├── HTTP-only: true                                                        │
│  ├── Secure: true (HTTPS only)                                              │
│  ├── SameSite: Lax                                                          │
│  └── Expires: 7 days (sliding)                                              │
│                                                                             │
│  LiveKit Token (JWT)                                                        │
│  ├── Generated per-meeting                                                  │
│  ├── Contains: userId, roomId, permissions                                  │
│  ├── Expires: 24 hours                                                      │
│  └── Signed with LiveKit API secret                                         │
└─────────────────────────────────────────────────────────────────────────────┘

RBAC Model:
┌─────────────────────────────────────────────────────────────────────────────┐
│  Role          │  Permissions                                               │
├────────────────┼────────────────────────────────────────────────────────────│
│  Owner         │  All permissions + delete organization + billing           │
│  Admin         │  All permissions except delete org and billing             │
│  Member        │  Create/join meetings, view own data                       │
│  Guest         │  Join meetings (no account), limited features              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Database Schema (Simplified)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│      users        │       │   organizations   │       │     meetings      │
├───────────────────┤       ├───────────────────┤       ├───────────────────┤
│ id (PK)           │       │ id (PK)           │       │ id (PK)           │
│ email             │──────▶│ name              │◀──────│ room_id           │
│ name              │       │ slug              │       │ host_id (FK)      │
│ avatar_url        │       │ logo_url          │       │ org_id (FK)       │
│ password_hash     │       │ settings (JSONB)  │       │ title             │
│ subscription_tier │       │ created_at        │       │ scheduled_start   │
│ org_id (FK)       │       │ updated_at        │       │ status            │
│ role              │       └───────────────────┘       │ settings (JSONB)  │
│ preferences       │                                   │ ai_summary        │
│ created_at        │                                   │ created_at        │
└───────────────────┘                                   └───────────────────┘
         │                                                       │
         │                                                       │
         ▼                                                       ▼
┌───────────────────┐                               ┌───────────────────┐
│ meeting_participants│                             │    transcripts    │
├───────────────────┤                               ├───────────────────┤
│ id (PK)           │                               │ id (PK)           │
│ meeting_id (FK)   │                               │ meeting_id (FK)   │
│ user_id (FK)      │                               │ speaker_id (FK)   │
│ joined_at         │                               │ content           │
│ left_at           │                               │ start_time        │
│ role              │                               │ end_time          │
└───────────────────┘                               │ confidence        │
                                                    │ embedding         │
                                                    └───────────────────┘
                                                             │
                                                             ▼
                                                    ┌───────────────────┐
                                                    │   action_items    │
                                                    ├───────────────────┤
                                                    │ id (PK)           │
                                                    │ meeting_id (FK)   │
                                                    │ assignee_id (FK)  │
                                                    │ title             │
                                                    │ due_date          │
                                                    │ status            │
                                                    │ priority          │
                                                    │ source_transcript │
                                                    └───────────────────┘
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS | Server-rendered React app |
| **UI Components** | Shadcn/ui, Radix Primitives, Framer Motion | Accessible, animated UI |
| **State** | Zustand, TanStack Query | Client state & server state |
| **API** | tRPC, REST | Type-safe API layer |
| **Auth** | NextAuth.js v5 | Authentication & sessions |
| **Database** | PostgreSQL (Neon), Prisma ORM | Primary data store |
| **Cache** | Redis (Upstash) | Sessions, rate limiting, pub/sub |
| **WebRTC** | LiveKit | Video/audio/screen sharing |
| **Transcription** | Deepgram | Real-time speech-to-text |
| **AI** | Claude API, OpenAI Embeddings | Summaries, co-pilot, search |
| **Vectors** | Pinecone | Semantic search |
| **Storage** | CloudFlare R2 | Files, recordings |
| **Email** | Resend | Transactional email |
| **Monitoring** | Sentry, Axiom | Error tracking, logs |
