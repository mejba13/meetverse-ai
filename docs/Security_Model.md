# MeetVerse AI - Security Model

## Security Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  EDGE SECURITY (CloudFlare)                                                  │
│  ├── DDoS Protection (L3/L4/L7)                                             │
│  ├── Web Application Firewall (WAF)                                         │
│  ├── Bot Protection                                                          │
│  ├── Rate Limiting                                                           │
│  └── SSL/TLS Termination (TLS 1.3)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  APPLICATION SECURITY                                                        │
│  ├── Authentication (NextAuth.js v5)                                        │
│  ├── Authorization (RBAC)                                                    │
│  ├── Input Validation (Zod)                                                  │
│  ├── CSRF Protection                                                         │
│  ├── Security Headers                                                        │
│  └── API Rate Limiting                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  DATA SECURITY                                                               │
│  ├── Encryption at Rest (AES-256)                                           │
│  ├── Encryption in Transit (TLS 1.3)                                        │
│  ├── Database Row-Level Security                                            │
│  ├── Secrets Management                                                      │
│  └── Optional E2EE for Meetings                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  OPERATIONAL SECURITY                                                        │
│  ├── Audit Logging                                                           │
│  ├── Security Monitoring                                                     │
│  ├── Vulnerability Scanning                                                  │
│  ├── Incident Response                                                       │
│  └── Regular Security Reviews                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication

### Session Management

```typescript
// NextAuth.js v5 Configuration
export const authConfig = {
  session: {
    strategy: "database", // Server-side sessions
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Refresh daily
  },
  cookies: {
    sessionToken: {
      name: "meetverse.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
```

### Password Policy

| Requirement | Value |
|-------------|-------|
| Minimum Length | 12 characters |
| Uppercase | At least 1 |
| Lowercase | At least 1 |
| Numbers | At least 1 |
| Special Characters | At least 1 |
| Hash Algorithm | bcrypt (cost factor 12) |
| Breach Check | HaveIBeenPwned API |

### Multi-Factor Authentication (MFA)

Supported methods:
1. **TOTP** - Time-based One-Time Password (Google Authenticator, Authy)
2. **WebAuthn** - Hardware security keys, biometrics
3. **SMS** - Backup only (discouraged due to SIM-swap risks)

### OAuth Providers

| Provider | Scopes Requested |
|----------|------------------|
| Google | email, profile, openid |
| Microsoft | User.Read, email, profile |
| GitHub | user:email |

### SSO (Enterprise)

Supported protocols:
- **SAML 2.0** - For enterprise identity providers
- **OIDC** - OpenID Connect for modern IdPs

---

## Authorization (RBAC)

### Role Hierarchy

```
Owner
  └── Admin
        └── Member
              └── Guest
```

### Permission Matrix

| Permission | Owner | Admin | Member | Guest |
|------------|-------|-------|--------|-------|
| Delete organization | ✓ | | | |
| Manage billing | ✓ | | | |
| Configure SSO | ✓ | ✓ | | |
| Manage users | ✓ | ✓ | | |
| View audit logs | ✓ | ✓ | | |
| Configure integrations | ✓ | ✓ | | |
| Create meetings | ✓ | ✓ | ✓ | |
| Host meetings | ✓ | ✓ | ✓ | |
| Join meetings | ✓ | ✓ | ✓ | ✓ |
| View own transcripts | ✓ | ✓ | ✓ | |
| View org analytics | ✓ | ✓ | | |

### Meeting-Level Permissions

| Permission | Host | Participant | Guest |
|------------|------|-------------|-------|
| End meeting | ✓ | | |
| Remove participants | ✓ | | |
| Mute others | ✓ | | |
| Start recording | ✓ | | |
| Enable waiting room | ✓ | | |
| Share screen | ✓ | ✓ | Configurable |
| Send chat | ✓ | ✓ | ✓ |
| Use reactions | ✓ | ✓ | ✓ |

---

## Data Protection

### Encryption Standards

| Data Type | At Rest | In Transit |
|-----------|---------|------------|
| User credentials | AES-256 (bcrypt for passwords) | TLS 1.3 |
| Database records | AES-256 (transparent) | TLS 1.3 |
| Meeting recordings | AES-256 | TLS 1.3 |
| Transcripts | AES-256 | TLS 1.3 |
| WebRTC media | SRTP (AES-128) | DTLS 1.2 |
| E2EE meetings | AES-256-GCM (client-side) | TLS 1.3 + E2EE |

### Data Classification

| Classification | Examples | Handling |
|----------------|----------|----------|
| **Public** | Marketing pages, public docs | No restrictions |
| **Internal** | Meeting metadata, user names | Authenticated access |
| **Confidential** | Transcripts, recordings | RBAC + tenant isolation |
| **Restricted** | Passwords, tokens, PII | Encrypted, minimal access |

### Tenant Isolation

```sql
-- Row-Level Security Policy Example
CREATE POLICY tenant_isolation ON meetings
  USING (org_id = current_setting('app.current_org_id')::uuid);

-- All queries automatically filter by organization
SELECT * FROM meetings; -- Only returns current org's meetings
```

---

## Input Validation & Sanitization

### Validation Strategy

```typescript
// Using Zod for runtime validation
const createMeetingSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().datetime(),
  settings: z.object({
    maxParticipants: z.number().int().min(2).max(200),
    waitingRoom: z.boolean(),
  }),
});

// Applied at API layer
export async function POST(req: Request) {
  const body = await req.json();
  const validated = createMeetingSchema.parse(body); // Throws on invalid
  // ... proceed with validated data
}
```

### XSS Prevention

1. **React auto-escaping**: All text content escaped by default
2. **CSP headers**: Restrict script sources
3. **Sanitization**: DOMPurify for user-generated HTML (if any)

### SQL Injection Prevention

1. **Prisma ORM**: Parameterized queries by default
2. **No raw SQL**: Raw queries require explicit review
3. **Input validation**: Type coercion before DB operations

---

## API Security

### Rate Limiting

```typescript
// Rate limit configuration
const rateLimits = {
  // Auth endpoints - strict limits
  "/api/auth/*": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
  },
  // General API - by tier
  "/api/*": {
    windowMs: 60 * 1000, // 1 minute
    max: (user) => ({
      free: 60,
      pro: 300,
      business: 1000,
      enterprise: 5000,
    }[user.tier]),
  },
};
```

### Security Headers

```typescript
// next.config.js headers
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' wss://*.meetverse.ai https://*.meetverse.ai;
      media-src 'self' blob:;
      frame-ancestors 'none';
    `.replace(/\s+/g, " ").trim(),
  },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=()",
  },
];
```

### CSRF Protection

- Session-based CSRF tokens for state-changing operations
- SameSite=Lax cookies prevent cross-origin requests
- Origin header validation for sensitive endpoints

---

## Audit Logging

### Logged Events

| Category | Events |
|----------|--------|
| **Authentication** | Login, logout, failed login, MFA events, password reset |
| **Authorization** | Permission denied, role changes |
| **Data Access** | Transcript access, recording download |
| **Admin Actions** | User management, settings changes |
| **Meeting Events** | Create, join, end, recording start/stop |
| **Security** | API key generation, SSO config changes |

### Log Format

```json
{
  "timestamp": "2024-03-15T10:30:00.000Z",
  "level": "info",
  "event": "user.login",
  "actor": {
    "id": "usr_xxxxxxxxxxxx",
    "email": "user@example.com",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "resource": {
    "type": "session",
    "id": "sess_xxxxxxxxxxxx"
  },
  "metadata": {
    "method": "password",
    "mfaUsed": true
  },
  "organizationId": "org_xxxxxxxxxxxx"
}
```

### Retention

| Tier | Retention Period |
|------|------------------|
| Free | 30 days |
| Pro | 90 days |
| Business | 1 year |
| Enterprise | Custom (up to 7 years) |

---

## Compliance

### SOC 2 Type II Controls

| Control Area | Implementation |
|--------------|----------------|
| **Security** | Encryption, access controls, vulnerability management |
| **Availability** | Multi-region deployment, monitoring, incident response |
| **Confidentiality** | Data classification, tenant isolation, encryption |
| **Processing Integrity** | Input validation, audit logs, change management |
| **Privacy** | Consent management, data retention, deletion |

### GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Consent for data processing, documented |
| Data minimization | Only collect necessary data |
| Right to access | Data export endpoint |
| Right to deletion | Account deletion with cascade |
| Data portability | Export in machine-readable format |
| Breach notification | Incident response plan, 72-hour notification |
| DPA | Data Processing Agreement for Enterprise |

### HIPAA Compliance (Enterprise)

| Requirement | Implementation |
|-------------|----------------|
| BAA | Business Associate Agreement |
| PHI encryption | AES-256 at rest and in transit |
| Access controls | RBAC with minimum necessary |
| Audit controls | Comprehensive audit logging |
| Automatic logoff | Session timeout configuration |

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P1 - Critical** | Data breach, service down | < 15 minutes |
| **P2 - High** | Security vulnerability, partial outage | < 1 hour |
| **P3 - Medium** | Performance degradation, non-critical bug | < 4 hours |
| **P4 - Low** | Minor issues, feature requests | < 24 hours |

### Response Process

1. **Detection**: Automated alerts or user reports
2. **Triage**: Assess severity and impact
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat/fix vulnerability
5. **Recovery**: Restore normal operations
6. **Post-Incident**: Review and improve

---

## Security Checklist

### Development

- [ ] All dependencies scanned for vulnerabilities (npm audit)
- [ ] No secrets in code (use environment variables)
- [ ] Input validation on all endpoints
- [ ] Output encoding/escaping
- [ ] Parameterized database queries
- [ ] Error messages don't leak sensitive info
- [ ] Security headers configured
- [ ] HTTPS enforced

### Deployment

- [ ] Environment variables properly secured
- [ ] Database credentials rotated
- [ ] API keys have appropriate scopes
- [ ] Firewall rules reviewed
- [ ] DDoS protection enabled
- [ ] SSL certificates valid
- [ ] Monitoring and alerting active

### Operations

- [ ] Regular security audits scheduled
- [ ] Penetration testing performed
- [ ] Incident response plan documented
- [ ] Team trained on security practices
- [ ] Backup and recovery tested
- [ ] Access reviews conducted quarterly
