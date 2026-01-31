# MeetVerse AI

<div align="center">

![MeetVerse AI](https://img.shields.io/badge/MeetVerse-AI-6366F1?style=for-the-badge&logo=video&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**AI-Powered Video Conferencing Platform with Intelligent Meeting Co-Pilot**

[Live Demo](#) • [Documentation](#documentation) • [Features](#features) • [Getting Started](#getting-started)

</div>

---

## Overview

MeetVerse AI is a next-generation video conferencing platform that transforms how teams collaborate. Powered by advanced AI capabilities, it provides real-time transcription, smart action item detection, intelligent meeting summaries, and engagement analytics—making every meeting more productive and actionable.

<img width="1566" height="1272" alt="CleanShot 2026-02-01 at 5  33 07" src="https://github.com/user-attachments/assets/a29647ea-1b9e-4d7d-ae00-28863a70bf0a" />


## Features

### Core Video Conferencing
- **HD Video & Audio** - Crystal-clear communication with adaptive quality
- **Screen Sharing** - Share your screen, window, or specific application
- **Virtual Backgrounds** - Professional backgrounds powered by AI
- **Recording** - Cloud recording with automatic processing

### AI-Powered Capabilities
- **Real-Time Transcription** - Live captions with <500ms latency via Deepgram
- **Speaker Diarization** - Automatic speaker identification and labeling
- **Smart Action Items** - AI extracts actionable tasks from conversations
- **Meeting Summaries** - Comprehensive summaries generated post-meeting
- **Semantic Search** - Search across all your meeting transcripts

### Collaboration Tools
- **In-Meeting Chat** - Real-time messaging with file sharing
- **Participant Management** - Host controls, breakout rooms, waiting room
- **Reactions & Engagement** - Emoji reactions and engagement analytics
- **Integration Ready** - Connect with your favorite productivity tools

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/ui, Framer Motion |
| **State** | Zustand (client), TanStack Query (server) |
| **API** | tRPC for type-safe internal APIs |
| **Database** | PostgreSQL via Neon, Prisma ORM |
| **Cache** | Redis via Upstash |
| **Auth** | NextAuth.js v5 |
| **WebRTC** | LiveKit SDK (SFU architecture) |
| **AI** | Anthropic Claude, Deepgram, OpenAI Embeddings |
| **Storage** | CloudFlare R2 |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  React Components │ Zustand Stores │ TanStack Query │ LiveKit  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (tRPC)                           │
├─────────────────────────────────────────────────────────────────┤
│    Auth Router │ Meeting Router │ AI Router │ User Router      │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │   LiveKit SFU   │ │   AI Services   │
│     (Neon)      │ │   (WebRTC)      │ │ Claude/Deepgram │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended package manager)
- PostgreSQL database (or Neon account)
- LiveKit server access
- API keys for AI services

### Installation

```bash
# Clone the repository
git clone https://github.com/mejba13/meetverse-ai.git
cd meetverse-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# LiveKit
LIVEKIT_API_KEY="..."
LIVEKIT_API_SECRET="..."
LIVEKIT_URL="wss://..."

# AI Services
ANTHROPIC_API_KEY="..."
DEEPGRAM_API_KEY="..."
OPENAI_API_KEY="..."

# Storage
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
```

## Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Build & Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
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
│   └── shared/              # Shared components
├── lib/
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   └── utils/               # Utility functions
├── server/
│   ├── api/routers/         # tRPC routers
│   ├── db/                  # Prisma client
│   └── services/            # Business logic services
└── types/                   # TypeScript types
```

## Documentation

| Document | Description |
|----------|-------------|
| [PRD Summary](docs/PRD_Summary.md) | Product requirements summary |
| [Requirements](docs/Requirements_FR_NFR.md) | Functional & non-functional requirements |
| [Architecture](docs/Architecture.md) | System architecture overview |
| [API Spec](docs/API_Spec.md) | API documentation |
| [Security Model](docs/Security_Model.md) | Security implementation details |
| [ADR](docs/ADR/) | Architecture Decision Records |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Developed By

<div align="center">

<img width="380" height="420" alt="engr-mejba-ahmed" src="https://github.com/user-attachments/assets/83e72c39-5eaa-428a-884b-cb4714332487" />


### **Engr Mejba Ahmed**

**AI Developer | Software Engineer | Entrepreneur**

[![Portfolio](https://img.shields.io/badge/Portfolio-mejba.me-10B981?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.mejba.me)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mejba)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mejba13)

</div>

---

## Hire / Work With Me

I build AI-powered applications, mobile apps, and enterprise solutions. Let's bring your ideas to life!

| Platform | Description | Link |
|----------|-------------|------|
| **Fiverr** | Custom builds, integrations, performance optimization | [fiverr.com/s/EgxYmWD](https://www.fiverr.com/s/EgxYmWD) |
| **Mejba Personal Portfolio** | Full portfolio & contact | [mejba.me](https://www.mejba.me) |
| **Ramlit Limited** | Software development company | [ramlit.com](https://www.ramlit.com) |
| **ColorPark Creative Agency** | UI/UX & creative solutions | [colorpark.io](https://www.colorpark.io) |
| **xCyberSecurity** | Global cybersecurity services | [xcybersecurity.io](https://www.xcybersecurity.io) |

---

<div align="center">

**Built with passion for better meetings**

</div>
