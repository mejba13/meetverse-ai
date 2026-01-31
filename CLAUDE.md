# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeetVerse AI is an AI-powered video conferencing platform with intelligent meeting co-pilot capabilities. The platform provides real-time transcription, smart action item detection, meeting summaries, and engagement analytics.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components, Framer Motion
- **State Management**: Zustand (client), TanStack Query (server)
- **API**: tRPC for type-safe internal APIs
- **Database**: PostgreSQL via Neon, Prisma ORM
- **Cache**: Redis via Upstash
- **Auth**: NextAuth.js v5
- **WebRTC**: LiveKit SDK (SFU architecture)
- **AI**: Anthropic Claude API, Deepgram (transcription), OpenAI (embeddings)
- **Storage**: CloudFlare R2

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Start dev server with Turbopack

# Build & Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # Run TypeScript compiler

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── (marketing)/         # Public marketing pages
│   ├── meeting/[roomId]/    # Meeting room
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Shadcn/ui base components
│   ├── meeting/             # Meeting room components
│   ├── dashboard/           # Dashboard components
│   ├── auth/                # Auth forms
│   └── shared/              # Shared components (providers)
├── lib/
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   └── utils/               # Utility functions
├── server/
│   ├── api/routers/         # tRPC routers
│   ├── db/                  # Prisma client
│   └── services/            # Business logic services
├── types/                   # TypeScript types
docs/
├── PRD_Summary.md           # Product requirements summary
├── Requirements_FR_NFR.md   # Functional/non-functional requirements
├── Architecture.md          # System architecture
├── API_Spec.md              # API documentation
├── Security_Model.md        # Security implementation
├── ADR/                     # Architecture Decision Records
prisma/
└── schema.prisma            # Database schema
```

## Architecture Decisions

Key architectural choices are documented in `/docs/ADR/`:

- **ADR-001**: SFU (LiveKit) over Mesh for WebRTC - supports 200+ participants
- **ADR-002**: Deepgram for transcription - real-time streaming, speaker diarization
- **ADR-003**: Claude API for AI features - 200K context window for full transcripts
- **ADR-004**: Neon PostgreSQL - serverless, branching for dev/preview
- **ADR-005**: Next.js 15 App Router - Server Components, tRPC integration

## Key Patterns

### Component Organization
- UI primitives in `components/ui/` (Shadcn/ui pattern)
- Feature components grouped by domain (meeting, dashboard, auth)
- Server Components by default, `"use client"` only when needed

### Database Access
- Always use Prisma client from `@/server/db`
- Multi-tenant queries filter by `organizationId`
- Soft delete via `deletedAt` field where applicable

### API Routes
- Internal APIs via tRPC for type safety
- REST endpoints for external integrations/webhooks
- WebSocket for real-time events (transcription, presence)

### Styling
- Tailwind CSS with design tokens in `tailwind.config.ts`
- Brand colors: Primary Indigo (#6366F1), Secondary Purple (#8B5CF6), Accent Pink (#EC4899)
- Dark mode as default, supports light mode via next-themes

### Environment Variables
- Server-only vars validated in `lib/env.ts`
- Client vars prefixed with `NEXT_PUBLIC_`
- Copy `.env.example` to `.env.local` for local development

## Meeting Room Architecture

The meeting room (`/meeting/[roomId]`) uses:
- `MeetingRoom` - Main container with state management
- `VideoGrid` - Participant video tiles with responsive layout
- `ControlBar` - Media controls (mute, camera, share, record)
- `MeetingSidebar` - Chat, participants, transcript, AI panels
- `TranscriptBar` - Live caption overlay

WebRTC connection flow:
1. Client requests room token from API
2. API validates permissions, generates LiveKit JWT
3. Client connects to LiveKit server
4. Media tracks published/subscribed via SFU

## AI Pipeline

Real-time pipeline (during meeting):
1. Audio stream from LiveKit → Deepgram streaming API
2. Transcript segments → WebSocket to client
3. Display with <500ms latency

Post-meeting pipeline:
1. Finalize transcript with speaker labels
2. Generate embeddings → Pinecone
3. Extract action items via Claude
4. Generate summary via Claude
5. Distribute to participants

## Development Notes

- Node.js 20+ required
- Use pnpm as package manager
- Turbopack enabled for faster dev builds
- TypeScript strict mode enabled
- ESLint + Prettier for code consistency
