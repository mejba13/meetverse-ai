# ADR-005: Frontend Framework and Architecture

## Status
Accepted

## Context
MeetVerse AI needs a modern web application supporting:
- Server-side rendering for SEO and performance
- Real-time updates during meetings
- Complex interactive UI (video grid, sidebars, controls)
- Type safety across the stack

### Options Considered

**Option 1: Next.js 14/15 with App Router**
- React Server Components
- Built-in routing, API routes
- Excellent performance
- Vercel deployment optimized

**Option 2: Remix**
- Progressive enhancement
- Excellent data loading patterns
- Smaller ecosystem

**Option 3: Nuxt 3 (Vue)**
- Vue ecosystem
- Good DX
- Smaller talent pool

**Option 4: SvelteKit**
- Excellent performance
- Smaller bundle sizes
- Growing ecosystem

## Decision
We will use **Next.js 15 with App Router**, along with:
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Zustand** for client state
- **TanStack Query** for server state
- **tRPC** for type-safe API

## Rationale

1. **Server Components**: Reduce client-side JavaScript, faster initial load, better SEO.

2. **App Router**: Modern routing with layouts, loading states, and error boundaries built-in.

3. **Ecosystem**: Largest React ecosystem, abundant resources, easy hiring.

4. **Type Safety**: End-to-end TypeScript with tRPC ensures API contracts are enforced.

5. **Deployment**: Optimized for Vercel but deployable anywhere.

6. **Real-Time Ready**: Easy integration with WebSockets and LiveKit.

## Project Structure

```
src/
├── app/                          # App Router pages
│   ├── (auth)/                   # Auth group (sign-in, sign-up)
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (dashboard)/              # Dashboard group (protected)
│   │   ├── layout.tsx            # Shared dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── meetings/page.tsx
│   │   └── settings/page.tsx
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page
│   │   └── pricing/page.tsx
│   ├── meeting/                  # Meeting room (special layout)
│   │   └── [roomId]/page.tsx
│   ├── api/                      # API routes
│   │   └── trpc/[trpc]/route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # Shadcn/ui components
│   ├── meeting/                  # Meeting-specific components
│   │   ├── video-grid.tsx
│   │   ├── control-bar.tsx
│   │   └── participant-tile.tsx
│   ├── dashboard/
│   └── shared/
├── lib/
│   ├── api/                      # API client utilities
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand stores
│   └── utils/                    # Utility functions
├── server/
│   ├── api/                      # tRPC routers
│   │   ├── routers/
│   │   └── trpc.ts
│   ├── db/                       # Prisma client
│   └── services/                 # Business logic
└── types/                        # Shared TypeScript types
```

## Consequences

### Positive
- Fast initial page loads with Server Components
- Type safety across entire stack
- Component library provides accessibility
- Excellent developer experience
- Large ecosystem and community

### Negative
- Learning curve for React Server Components
- App Router still evolving
- Build times can be slow for large apps

### Mitigations
- Establish clear patterns for Server vs Client components
- Use Turbopack for faster dev builds
- Incremental adoption of new features

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "zustand": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "framer-motion": "^11.0.0",
    "livekit-client": "^2.0.0",
    "@livekit/components-react": "^2.0.0"
  }
}
```

## References
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [tRPC Documentation](https://trpc.io/docs)
