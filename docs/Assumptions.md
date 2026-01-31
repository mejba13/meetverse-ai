# MeetVerse AI - Assumptions & Dependencies

## Technical Assumptions

### Infrastructure
1. **Cloud Provider**: AWS will be primary cloud provider (can adapt to GCP/Azure)
2. **Media Server**: LiveKit Cloud will be used for MVP (self-hosted option for Enterprise later)
3. **Region**: Initial deployment in US-East, multi-region in Phase 3
4. **CDN**: CloudFlare for static assets and DDoS protection

### AI Services
1. **Transcription**: Deepgram as primary provider (streaming capability, speaker diarization)
2. **LLM**: Claude API (Anthropic) for AI Co-Pilot and summarization
3. **Embeddings**: OpenAI Ada-002 for semantic search vectors
4. **Vector Database**: Pinecone for knowledge base and transcript search

### Development
1. **Package Manager**: pnpm for monorepo management
2. **Node Version**: Node.js 20 LTS
3. **Database**: PostgreSQL 16 via Neon or Supabase for serverless
4. **Caching**: Upstash Redis for serverless Redis

## Product Assumptions

### User Behavior
1. Average meeting duration: 30-45 minutes
2. Average participants per meeting: 4-8 people
3. Peak usage hours: 9am-5pm local time, weekdays
4. 70% of users will use Chrome browser

### Business
1. Free tier conversion to paid: 10%
2. Average organization size: 10-50 users
3. Enterprise deals require SOC 2 compliance
4. Mobile usage < 20% initially

## Dependencies

### External Services (Required)

| Service | Purpose | Fallback |
|---------|---------|----------|
| LiveKit Cloud | WebRTC media server | 100ms |
| Deepgram | Real-time transcription | AssemblyAI |
| Anthropic Claude | AI features | OpenAI GPT-4 |
| Pinecone | Vector search | Weaviate |
| Neon/Supabase | PostgreSQL database | AWS RDS |
| Upstash | Redis cache | AWS ElastiCache |
| Resend | Transactional email | SendGrid |
| CloudFlare | CDN & DDoS | AWS CloudFront |

### Third-Party Integrations (Optional)

| Integration | API/SDK Required |
|-------------|------------------|
| Google Calendar | Google Calendar API |
| Outlook Calendar | Microsoft Graph API |
| Slack | Slack Web API |
| Microsoft Teams | Microsoft Graph API |
| Asana | Asana API |
| Jira | Atlassian API |
| Trello | Trello API |
| Notion | Notion API |
| Salesforce | Salesforce API |
| HubSpot | HubSpot API |

## Risks

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebRTC browser compatibility | High | Feature detection, fallback to audio-only |
| AI service latency | Medium | Caching, streaming responses |
| Transcription accuracy | Medium | User correction UI, multiple providers |
| Scale beyond 200 participants | High | SFU architecture, load balancing |
| Browser memory with long meetings | Medium | Transcript pagination, cleanup |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI service costs unpredictable | High | Usage limits per tier, cost monitoring |
| Compliance certification delays | High | Start SOC 2 process early |
| Enterprise sales cycle long | Medium | Self-serve product-led growth |
| Competitor feature parity | Medium | Focus on AI differentiation |

## Constraints

### Technical Constraints
1. Browser-based only for MVP (no native desktop app)
2. No iOS/Android app until Phase 4
3. Maximum 200 participants per meeting (SFU limitation)
4. Recording storage limited by tier
5. Transcription limited by tier (minutes/month)

### Resource Constraints
1. Single timezone development team (assumed)
2. Limited budget for AI API costs during development
3. No dedicated DevOps initially (platform team bootstraps)

### Timeline Constraints
1. MVP must be functional within 3 months
2. SOC 2 audit requires 6+ months of evidence
3. Enterprise features require Phase 3 completion

## Open Questions

1. **Recording storage limits** - What are the storage quotas per tier?
   - Assumed: Free (5 recordings), Pro (unlimited, 1 year), Business (unlimited, 2 years)

2. **Concurrent meeting limits** - Can free users host multiple simultaneous meetings?
   - Assumed: No, 1 meeting at a time for Free tier

3. **AI feature rate limits** - How many AI queries per meeting?
   - Assumed: Free (10/meeting), Pro (50/meeting), Business (unlimited)

4. **Data residency** - Are there EU data residency requirements?
   - Assumed: Not for MVP, required for Enterprise in Phase 3

5. **Offline support** - Should the app work offline?
   - Assumed: No, requires internet connection
