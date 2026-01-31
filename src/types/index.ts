/**
 * MeetVerse AI - Shared Types
 */

// Re-export Prisma model types for convenience
export type {
  User,
  Organization,
  Meeting,
  MeetingParticipant,
  TranscriptSegment,
  ActionItem,
  MeetingHighlight,
  ChatMessage,
} from "@prisma/client";

// String-based enums (SQLite compatible)
export type SubscriptionTier = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
export type UserRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
export type MeetingStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
export type ParticipantRole = "HOST" | "CO_HOST" | "PARTICIPANT" | "GUEST";
export type ActionItemStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type ActionItemPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type HighlightType = "DECISION" | "KEY_MOMENT" | "QUOTE" | "QUESTION" | "TOPIC_CHANGE";
export type ChatMessageType = "TEXT" | "FILE" | "REACTION" | "SYSTEM";

/**
 * Meeting settings stored as JSON in database
 */
export interface MeetingSettings {
  waitingRoom?: boolean;
  recording?: boolean;
  transcription?: boolean;
  maxParticipants?: number;
  allowScreenShare?: boolean;
  allowChat?: boolean;
  allowReactions?: boolean;
  muteOnEntry?: boolean;
  requirePassword?: string;
}

/**
 * User preferences stored as JSON in database
 */
export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  slackNotifications?: boolean;
  defaultVideoEnabled?: boolean;
  defaultAudioEnabled?: boolean;
}

/**
 * Organization settings stored as JSON in database
 */
export interface OrganizationSettings {
  defaultMeetingSettings?: MeetingSettings;
  allowGuestAccess?: boolean;
  requireEmailDomain?: string;
  brandColor?: string;
}

/**
 * Participant in a meeting (with user details)
 */
export interface ParticipantInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  joinedAt: Date;
}

/**
 * Real-time transcript segment
 */
export interface TranscriptUpdate {
  id: string;
  speakerId?: string;
  speakerName: string;
  content: string;
  startTime: number;
  isFinal: boolean;
  confidence: number;
}

/**
 * AI Co-Pilot query response
 */
export interface CoPilotResponse {
  response: string;
  sources: Array<{
    type: "transcript" | "knowledge_base";
    content: string;
    timestamp?: number;
    documentTitle?: string;
  }>;
  confidence: number;
}

/**
 * Meeting summary formats
 */
export type SummaryFormat = "executive" | "detailed" | "action-focused";

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Pagination response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | "participant:joined"
  | "participant:left"
  | "participant:updated"
  | "transcript:segment"
  | "transcript:final"
  | "ai:action_detected"
  | "ai:copilot_response"
  | "chat:message"
  | "meeting:status_changed"
  | "meeting:recording_started"
  | "meeting:recording_stopped";

/**
 * Base WebSocket event
 */
export interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: number;
}
