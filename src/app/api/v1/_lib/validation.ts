import { z } from "zod";

// ==========================================
// Auth Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255),
});

export const socialAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  accessToken: z.string(),
  idToken: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128),
});

// ==========================================
// Meeting Schemas (reused from tRPC)
// ==========================================

export const createMeetingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  settings: z
    .object({
      waitingRoom: z.boolean().optional(),
      recording: z.boolean().optional(),
      transcription: z.boolean().optional(),
      maxParticipants: z.number().int().min(2).max(200).optional(),
    })
    .optional(),
});

export const updateMeetingSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  settings: z
    .object({
      waitingRoom: z.boolean().optional(),
      recording: z.boolean().optional(),
      transcription: z.boolean().optional(),
      maxParticipants: z.number().int().min(2).max(200).optional(),
    })
    .optional(),
});

// ==========================================
// Action Item Schemas (reused from tRPC)
// ==========================================

export const createActionItemSchema = z.object({
  meetingId: z.string(),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export const updateActionItemSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

// ==========================================
// User Schemas (reused from tRPC)
// ==========================================

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  image: z.string().url().optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  defaultVideoEnabled: z.boolean().optional(),
  defaultAudioEnabled: z.boolean().optional(),
});

// ==========================================
// Notification Schemas
// ==========================================

export const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

export const registerDeviceSchema = z.object({
  platform: z.enum(["ios", "android"]),
  token: z.string().min(1),
  deviceName: z.string().optional(),
  deviceId: z.string().optional(),
});

export const unregisterDeviceSchema = z.object({
  token: z.string().min(1),
});

// ==========================================
// Organization Schemas
// ==========================================

export const updateOrgSettingsSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  settings: z.record(z.unknown()).optional(),
});

// ==========================================
// Chat Schema
// ==========================================

export const sendChatMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  type: z.enum(["TEXT", "FILE", "REACTION", "SYSTEM"]).default("TEXT"),
  replyToId: z.string().optional(),
  isPrivate: z.boolean().default(false),
  recipientId: z.string().optional(),
});

// ==========================================
// AI Schemas
// ==========================================

export const copilotSchema = z.object({
  meetingId: z.string(),
  question: z.string().min(1).max(2000),
});

export const processMeetingSchema = z.object({
  audioUrl: z.string().optional(),
  notifyParticipants: z.boolean().default(false),
});

// ==========================================
// Search Schema
// ==========================================

export const searchSchema = z.object({
  q: z.string().min(1).max(500),
  type: z.enum(["all", "meetings", "transcripts", "action_items"]).default("all"),
});
