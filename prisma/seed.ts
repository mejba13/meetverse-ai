/**
 * Prisma Seed Script
 *
 * Creates comprehensive test data for development and testing.
 * Run with: pnpm db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Helper to generate unique room IDs
function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data (for clean re-seeding)
  console.log("🧹 Cleaning existing data...");
  await prisma.chatMessage.deleteMany();
  await prisma.meetingHighlight.deleteMany();
  await prisma.actionItem.deleteMany();
  await prisma.transcriptSegment.deleteMany();
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  console.log("✓ Existing data cleared\n");

  // Create an organization
  const organization = await prisma.organization.upsert({
    where: { slug: "meetverse-demo" },
    update: {},
    create: {
      name: "MeetVerse Demo",
      slug: "meetverse-demo",
      settings: JSON.stringify({
        maxMeetingDuration: 180,
        allowRecording: true,
        aiFeatures: true,
      }),
    },
  });

  console.log("✓ Organization created:", organization.name);

  // Create 6 test users
  const users = [
    {
      email: "admin@meetverse.ai",
      name: "Sarah Chen",
      password: "Admin123!@#456",
      subscriptionTier: "ENTERPRISE",
      role: "ADMIN",
      image: null,
    },
    {
      email: "host@meetverse.ai",
      name: "Marcus Johnson",
      password: "Host1234!@#567",
      subscriptionTier: "PRO",
      role: "MEMBER",
      image: null,
    },
    {
      email: "participant@meetverse.ai",
      name: "Alex Rivera",
      password: "Participant!@#890",
      subscriptionTier: "PRO",
      role: "MEMBER",
      image: null,
    },
    {
      email: "guest@meetverse.ai",
      name: "Emily Taylor",
      password: "Guest12345!@#$",
      subscriptionTier: "FREE",
      role: "MEMBER",
      image: null,
    },
    {
      email: "developer@meetverse.ai",
      name: "James Wilson",
      password: "Dev123!@#$%^",
      subscriptionTier: "PRO",
      role: "MEMBER",
      image: null,
    },
    {
      email: "designer@meetverse.ai",
      name: "Olivia Martinez",
      password: "Design123!@#$",
      subscriptionTier: "PRO",
      role: "MEMBER",
      image: null,
    },
  ];

  const createdUsers = [];

  for (const userData of users) {
    const passwordHash = await hashPassword(userData.password);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        passwordHash,
        subscriptionTier: userData.subscriptionTier,
        role: userData.role,
        organizationId: organization.id,
      },
      create: {
        email: userData.email,
        name: userData.name,
        passwordHash,
        subscriptionTier: userData.subscriptionTier,
        role: userData.role,
        organizationId: organization.id,
        preferences: JSON.stringify({
          theme: "dark",
          notifications: {
            email: true,
            push: true,
          },
          language: "en",
          timezone: "America/Los_Angeles",
        }),
      },
    });

    createdUsers.push(user);
    console.log(`✓ User created: ${user.name} (${user.email})`);
  }

  // ==========================================
  // CREATE LIVE MEETING (Currently Active)
  // ==========================================
  const liveMeeting = await prisma.meeting.create({
    data: {
      roomId: generateRoomId(),
      title: "Sprint Planning - Q1 2026",
      description: "Planning session for the upcoming sprint with the development team",
      hostId: createdUsers[0].id,
      organizationId: organization.id,
      status: "LIVE",
      scheduledStart: new Date(Date.now() - 30 * 60 * 1000), // Started 30 min ago
      actualStart: new Date(Date.now() - 30 * 60 * 1000),
      settings: JSON.stringify({
        waitingRoom: false,
        recording: true,
        transcription: true,
        maxParticipants: 50,
      }),
    },
  });

  // Add participants to live meeting
  for (let i = 1; i < 4; i++) {
    await prisma.meetingParticipant.create({
      data: {
        meetingId: liveMeeting.id,
        userId: createdUsers[i].id,
        role: "PARTICIPANT",
      },
    });
  }

  console.log(`✓ LIVE meeting created: ${liveMeeting.title}`);

  // ==========================================
  // CREATE UPCOMING/SCHEDULED MEETINGS
  // ==========================================
  const upcomingMeetings = [
    {
      title: "Weekly Team Standup",
      description: "Regular weekly sync to discuss progress and blockers",
      hostId: createdUsers[0].id,
      scheduledStart: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
      duration: 30,
    },
    {
      title: "Product Demo - New Features",
      description: "Showcasing the latest AI-powered features to stakeholders",
      hostId: createdUsers[1].id,
      scheduledStart: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
      duration: 60,
    },
    {
      title: "Design Review Session",
      description: "Review and finalize UI/UX designs for the dashboard",
      hostId: createdUsers[5].id,
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 45,
    },
    {
      title: "Client Onboarding - TechCorp",
      description: "Introduction and setup session with new enterprise client",
      hostId: createdUsers[0].id,
      scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      duration: 60,
    },
    {
      title: "Engineering Sync",
      description: "Technical discussion about API architecture improvements",
      hostId: createdUsers[4].id,
      scheduledStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
      duration: 45,
    },
  ];

  for (const meeting of upcomingMeetings) {
    const created = await prisma.meeting.create({
      data: {
        roomId: generateRoomId(),
        title: meeting.title,
        description: meeting.description,
        hostId: meeting.hostId,
        organizationId: organization.id,
        status: "SCHEDULED",
        scheduledStart: meeting.scheduledStart,
        scheduledEnd: new Date(meeting.scheduledStart.getTime() + meeting.duration * 60 * 1000),
        settings: JSON.stringify({
          waitingRoom: false,
          recording: true,
          transcription: true,
          maxParticipants: 50,
        }),
      },
    });

    // Add random participants
    const participantCount = Math.floor(Math.random() * 4) + 2;
    const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
    for (let i = 0; i < participantCount && i < shuffledUsers.length; i++) {
      if (shuffledUsers[i].id !== meeting.hostId) {
        await prisma.meetingParticipant.create({
          data: {
            meetingId: created.id,
            userId: shuffledUsers[i].id,
            role: "PARTICIPANT",
          },
        });
      }
    }

    console.log(`✓ Scheduled meeting created: ${meeting.title}`);
  }

  // ==========================================
  // CREATE COMPLETED/ENDED MEETINGS
  // ==========================================
  const completedMeetings = [
    {
      title: "Product Planning Session",
      description: "Q1 roadmap planning and feature prioritization",
      hostId: createdUsers[1].id,
      scheduledStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      duration: 90,
      summary: `## Meeting Summary

### Key Discussion Points
- Reviewed Q1 roadmap priorities
- Discussed AI feature implementation timeline
- Assigned action items for the team

### Decisions Made
1. Prioritize video quality improvements
2. Launch AI transcription in beta next week
3. Schedule follow-up meeting for design review

### Next Steps
- Engineering to provide timeline estimates
- Design team to complete mockups
- Product to finalize requirements document`,
    },
    {
      title: "Customer Feedback Review",
      description: "Analyzing recent customer feedback and feature requests",
      hostId: createdUsers[0].id,
      scheduledStart: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      duration: 45,
      summary: `## Meeting Summary

### Customer Insights
- 85% satisfaction rate with video quality
- Top request: Better mobile experience
- Feature request: Calendar integrations

### Action Items
1. Prioritize mobile app improvements
2. Research calendar API integrations
3. Schedule UX research sessions

### Highlights
- Positive feedback on AI transcription accuracy
- Enterprise clients requesting SSO support`,
    },
    {
      title: "Engineering Architecture Review",
      description: "Technical deep-dive into system architecture",
      hostId: createdUsers[4].id,
      scheduledStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      duration: 60,
      summary: `## Technical Review Summary

### Architecture Decisions
- Adopted microservices for AI pipeline
- Selected Redis for real-time caching
- Implemented WebSocket for live features

### Performance Improvements
- Reduced API latency by 40%
- Optimized database queries
- Implemented connection pooling

### Next Steps
- Load testing for 10k concurrent users
- Implement horizontal scaling
- Set up monitoring dashboards`,
    },
    {
      title: "Marketing Strategy Alignment",
      description: "Aligning product launches with marketing campaigns",
      hostId: createdUsers[0].id,
      scheduledStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      duration: 60,
      summary: `## Marketing Alignment Summary

### Campaign Timeline
- Beta launch: Week 1
- Public announcement: Week 3
- Feature spotlight series: Ongoing

### Key Messages
- AI-powered meeting intelligence
- Enterprise-grade security
- Seamless integrations

### Content Strategy
- Blog posts highlighting AI features
- Customer success stories
- Technical documentation`,
    },
    {
      title: "Team Retrospective - January",
      description: "Monthly team retrospective and celebration",
      hostId: createdUsers[1].id,
      scheduledStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      duration: 45,
      summary: `## Retrospective Summary

### What Went Well
- Shipped 3 major features on time
- Customer satisfaction improved 15%
- Team collaboration excellent

### Areas for Improvement
- Better documentation practices
- More async communication
- Earlier testing cycles

### Action Items
- Implement documentation templates
- Set up async standup bot
- Create testing guidelines`,
    },
    {
      title: "Security Audit Review",
      description: "Review of quarterly security audit findings",
      hostId: createdUsers[0].id,
      scheduledStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      duration: 75,
      summary: `## Security Audit Summary

### Audit Results
- Overall score: 94/100
- No critical vulnerabilities
- 3 minor recommendations

### Implemented Fixes
- Updated encryption protocols
- Enhanced access controls
- Improved logging

### Compliance Status
- SOC 2 Type II: Compliant
- GDPR: Compliant
- HIPAA: In progress`,
    },
  ];

  for (const meeting of completedMeetings) {
    const actualStart = new Date(meeting.scheduledStart);
    const actualEnd = new Date(actualStart.getTime() + meeting.duration * 60 * 1000);

    const created = await prisma.meeting.create({
      data: {
        roomId: generateRoomId(),
        title: meeting.title,
        description: meeting.description,
        hostId: meeting.hostId,
        organizationId: organization.id,
        status: "ENDED",
        scheduledStart: meeting.scheduledStart,
        scheduledEnd: new Date(meeting.scheduledStart.getTime() + meeting.duration * 60 * 1000),
        actualStart,
        actualEnd,
        settings: JSON.stringify({
          waitingRoom: false,
          recording: true,
          transcription: true,
        }),
        aiSummary: meeting.summary,
        aiSummaryFormat: "markdown",
      },
    });

    // Add transcript segments for completed meetings
    const transcripts = [
      {
        speakerId: createdUsers[0].id,
        speakerName: "Sarah Chen",
        content: `Welcome everyone to the ${meeting.title}. Let's get started with our agenda.`,
        startTime: 0,
        endTime: 5000,
      },
      {
        speakerId: createdUsers[1].id,
        speakerName: "Marcus Johnson",
        content: "Thanks Sarah. I'd like to start by sharing some updates from the team.",
        startTime: 5000,
        endTime: 10000,
      },
      {
        speakerId: createdUsers[2].id,
        speakerName: "Alex Rivera",
        content: "Great progress on our end. We've completed the main deliverables ahead of schedule.",
        startTime: 10000,
        endTime: 16000,
      },
      {
        speakerId: createdUsers[4].id,
        speakerName: "James Wilson",
        content: "The technical implementation is solid. We should discuss the next steps.",
        startTime: 16000,
        endTime: 22000,
      },
    ];

    for (const segment of transcripts) {
      await prisma.transcriptSegment.create({
        data: {
          meetingId: created.id,
          speakerId: segment.speakerId,
          speakerName: segment.speakerName,
          content: segment.content,
          startTime: segment.startTime,
          endTime: segment.endTime,
          confidence: 0.92 + Math.random() * 0.06,
          language: "en",
          isFinal: true,
        },
      });
    }

    // Add action items for completed meetings
    const actionItemTemplates = [
      { title: "Follow up on discussion points", priority: "HIGH" },
      { title: "Share meeting notes with team", priority: "MEDIUM" },
      { title: "Schedule follow-up meeting", priority: "LOW" },
    ];

    for (const template of actionItemTemplates) {
      const randomAssignee = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      await prisma.actionItem.create({
        data: {
          meetingId: created.id,
          title: template.title,
          description: `Action item from ${meeting.title}`,
          assigneeId: randomAssignee.id,
          status: Math.random() > 0.5 ? "COMPLETED" : "PENDING",
          priority: template.priority,
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          aiGenerated: true,
          aiConfidence: 0.85 + Math.random() * 0.1,
        },
      });
    }

    // Add highlights for completed meetings
    await prisma.meetingHighlight.create({
      data: {
        meetingId: created.id,
        type: "DECISION",
        content: `Key decision made during ${meeting.title}`,
        timestamp: 15000,
        speakerName: "Sarah Chen",
        aiConfidence: 0.9,
      },
    });

    console.log(`✓ Completed meeting created: ${meeting.title}`);
  }

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log("\n✅ Database seed completed successfully!\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("📊 Data Summary:");
  console.log("   • 1 LIVE meeting (active now)");
  console.log("   • 5 SCHEDULED meetings (upcoming)");
  console.log("   • 6 ENDED meetings (with summaries)");
  console.log("   • 6 Test users");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("🔐 Test Accounts:");
  console.log("═══════════════════════════════════════════════════════════");
  users.forEach((u) => {
    console.log(`  📧 ${u.email}`);
    console.log(`     Password: ${u.password}`);
    console.log(`     Role: ${u.role} | Tier: ${u.subscriptionTier}`);
    console.log("");
  });
  console.log("═══════════════════════════════════════════════════════════");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
