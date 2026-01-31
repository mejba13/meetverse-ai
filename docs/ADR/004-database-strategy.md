# ADR-004: Database Strategy

## Status
Accepted

## Context
MeetVerse AI needs persistent storage for users, organizations, meetings, transcripts, action items, and more. We need to decide on database technology and hosting approach.

### Options Considered

**Option 1: Self-managed PostgreSQL on AWS RDS**
- Full control
- Proven technology
- Operational overhead

**Option 2: Neon (Serverless PostgreSQL)**
- Serverless, auto-scaling
- Branching for dev/preview
- Pay-per-use pricing
- Built-in connection pooling

**Option 3: Supabase**
- PostgreSQL with extras (auth, realtime, storage)
- Good DX
- Row-level security built-in

**Option 4: PlanetScale (MySQL)**
- Serverless MySQL
- Excellent branching
- No foreign key constraints

**Option 5: MongoDB Atlas**
- Document model
- Flexible schema
- Different query patterns

## Decision
We will use **Neon** as primary database with **Prisma ORM**.

## Rationale

1. **PostgreSQL Foundation**: Battle-tested, ACID compliant, excellent for relational data model.

2. **Serverless Benefits**:
   - Auto-scaling based on load
   - Pay-per-use (good for early stage)
   - No connection management headaches
   - Automatic backups

3. **Branching**: Create database branches for preview deployments, essential for our development workflow.

4. **Prisma Integration**: First-class support with Prisma, our chosen ORM for type-safe database access.

5. **Cost Efficiency**: Free tier for development, predictable scaling costs.

6. **Global Availability**: Multi-region deployment for low-latency access.

## Prisma Schema Design Principles

```prisma
// Multi-tenant with organization isolation
model Meeting {
  id            String   @id @default(cuid())
  organizationId String
  organization  Organization @relation(fields: [organizationId], references: [id])

  // Soft delete for data retention
  deletedAt     DateTime?

  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Indexes for common queries
  @@index([organizationId, status, scheduledStart])
}
```

## Consequences

### Positive
- Type-safe database access with Prisma
- Serverless scaling matches our usage patterns
- Database branching improves development velocity
- Built-in connection pooling

### Negative
- Cold start latency for rarely accessed data
- Less control than self-managed
- Potential vendor lock-in

### Mitigations
- Keep database schema PostgreSQL-standard for portability
- Avoid Neon-specific features when possible
- Regular backups to portable format

## Additional Storage Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Cache | Upstash Redis | Sessions, rate limiting, pub/sub |
| Vectors | Pinecone | Semantic search for transcripts |
| Files | CloudFlare R2 | Recordings, uploads |

## References
- [Neon Documentation](https://neon.tech/docs)
- [Prisma with Neon](https://www.prisma.io/docs/guides/deployment/serverless/deploy-to-vercel#neon)
