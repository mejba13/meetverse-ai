/**
 * Prisma Seed Script
 *
 * Creates test data for development and testing.
 * Run with: pnpm db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log("🌱 Starting database seed...\n");

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

  // Create 4 test users
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
      subscriptionTier: "PAID",
      role: "MEMBER",
      image: null,
    },
    {
      email: "participant@meetverse.ai",
      name: "Alex Rivera",
      password: "Participant!@#890",
      subscriptionTier: "FREE",
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

  // Create a sample meeting hosted by the first user
  const sampleMeeting = await prisma.meeting.upsert({
    where: { roomId: "demo-meeting-001" },
    update: {},
    create: {
      roomId: "demo-meeting-001",
      title: "Weekly Team Standup",
      description: "Regular weekly sync to discuss progress and blockers",
      hostId: createdUsers[0].id,
      organizationId: organization.id,
      status: "SCHEDULED",
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
      settings: JSON.stringify({
        waitingRoom: false,
        recording: true,
        transcription: true,
        maxParticipants: 50,
      }),
    },
  });

  console.log(`✓ Sample meeting created: ${sampleMeeting.title}`);

  // Add participants to the meeting
  for (let i = 1; i < createdUsers.length; i++) {
    await prisma.meetingParticipant.upsert({
      where: {
        meetingId_userId: {
          meetingId: sampleMeeting.id,
          userId: createdUsers[i].id,
        },
      },
      update: {},
      create: {
        meetingId: sampleMeeting.id,
        userId: createdUsers[i].id,
        role: "PARTICIPANT",
      },
    });
  }

  console.log("✓ Participants added to meeting");

  // Create a completed meeting with transcript and action items
  const completedMeeting = await prisma.meeting.upsert({
    where: { roomId: "demo-meeting-002" },
    update: {},
    create: {
      roomId: "demo-meeting-002",
      title: "Product Planning Session",
      description: "Q1 roadmap planning and feature prioritization",
      hostId: createdUsers[1].id,
      organizationId: organization.id,
      status: "ENDED",
      scheduledStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      actualStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      actualEnd: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      settings: JSON.stringify({
        waitingRoom: false,
        recording: true,
        transcription: true,
      }),
      aiSummary: `## Meeting Summary

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
      aiSummaryFormat: "markdown",
    },
  });

  console.log(`✓ Completed meeting created: ${completedMeeting.title}`);

  // Add transcript segments
  const transcriptSegments = [
    {
      speakerId: createdUsers[1].id,
      speakerName: "Marcus Johnson",
      content: "Welcome everyone to our Q1 planning session. Let's start by reviewing our priorities.",
      startTime: 0,
      endTime: 5000,
      confidence: 0.95,
    },
    {
      speakerId: createdUsers[0].id,
      speakerName: "Sarah Chen",
      content: "I think we should focus on improving video quality first. Users have been asking for better resolution options.",
      startTime: 5000,
      endTime: 12000,
      confidence: 0.92,
    },
    {
      speakerId: createdUsers[2].id,
      speakerName: "Alex Rivera",
      content: "Agreed. I can work on implementing adaptive bitrate streaming for better performance.",
      startTime: 12000,
      endTime: 18000,
      confidence: 0.89,
    },
    {
      speakerId: createdUsers[3].id,
      speakerName: "Emily Taylor",
      content: "For the AI features, the transcription module is ready for beta testing. We should launch it next week.",
      startTime: 18000,
      endTime: 25000,
      confidence: 0.94,
    },
  ];

  for (const segment of transcriptSegments) {
    await prisma.transcriptSegment.create({
      data: {
        meetingId: completedMeeting.id,
        speakerId: segment.speakerId,
        speakerName: segment.speakerName,
        content: segment.content,
        startTime: segment.startTime,
        endTime: segment.endTime,
        confidence: segment.confidence,
        language: "en",
        isFinal: true,
      },
    });
  }

  console.log("✓ Transcript segments created");

  // Create action items
  const actionItems = [
    {
      title: "Provide timeline estimates for video improvements",
      description: "Engineering team to estimate implementation time for adaptive bitrate streaming",
      assigneeId: createdUsers[2].id,
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Complete UI mockups for new features",
      description: "Design team to finalize mockups for the Q1 feature set",
      assigneeId: createdUsers[3].id,
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Finalize Q1 requirements document",
      description: "Product team to document all feature requirements and acceptance criteria",
      assigneeId: createdUsers[0].id,
      status: "PENDING",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const item of actionItems) {
    await prisma.actionItem.create({
      data: {
        meetingId: completedMeeting.id,
        title: item.title,
        description: item.description,
        assigneeId: item.assigneeId,
        status: item.status,
        priority: item.priority,
        dueDate: item.dueDate,
        aiGenerated: true,
        aiConfidence: 0.88,
      },
    });
  }

  console.log("✓ Action items created");

  // Create meeting highlights
  const highlights = [
    {
      type: "DECISION",
      content: "Prioritize video quality improvements for Q1",
      timestamp: 8000,
      speakerName: "Sarah Chen",
    },
    {
      type: "KEY_MOMENT",
      content: "AI transcription ready for beta launch next week",
      timestamp: 20000,
      speakerName: "Emily Taylor",
    },
  ];

  for (const highlight of highlights) {
    await prisma.meetingHighlight.create({
      data: {
        meetingId: completedMeeting.id,
        type: highlight.type,
        content: highlight.content,
        timestamp: highlight.timestamp,
        speakerName: highlight.speakerName,
        aiConfidence: 0.9,
      },
    });
  }

  console.log("✓ Meeting highlights created");

  console.log("\n✅ Database seed completed successfully!\n");
  console.log("Test Accounts:");
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
