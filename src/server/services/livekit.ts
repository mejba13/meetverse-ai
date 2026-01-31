/**
 * LiveKit Service
 *
 * Handles WebRTC room token generation and management.
 */

import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "";
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

/**
 * Check if LiveKit is configured
 */
export function isLiveKitConfigured(): boolean {
  return !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET && LIVEKIT_URL);
}

/**
 * Generate a room access token for a participant
 */
export async function generateRoomToken(params: {
  roomId: string;
  participantId: string;
  participantName: string;
  isHost?: boolean;
  canPublish?: boolean;
  canSubscribe?: boolean;
  canPublishData?: boolean;
}): Promise<string> {
  const {
    roomId,
    participantId,
    participantName,
    isHost = false,
    canPublish = true,
    canSubscribe = true,
    canPublishData = true,
  } = params;

  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error("LiveKit credentials not configured");
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantId,
    name: participantName,
    ttl: "24h",
  });

  at.addGrant({
    room: roomId,
    roomJoin: true,
    canPublish,
    canSubscribe,
    canPublishData,
    // Host-specific permissions
    roomAdmin: isHost,
    roomRecord: isHost,
  });

  return await at.toJwt();
}

/**
 * Create a LiveKit room service client
 */
function getRoomServiceClient(): RoomServiceClient {
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error("LiveKit credentials not configured");
  }

  return new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
}

/**
 * List participants in a room
 */
export async function listParticipants(roomId: string) {
  const client = getRoomServiceClient();
  return client.listParticipants(roomId);
}

/**
 * Remove a participant from a room
 */
export async function removeParticipant(roomId: string, participantId: string) {
  const client = getRoomServiceClient();
  return client.removeParticipant(roomId, participantId);
}

/**
 * Mute a participant's track
 */
export async function muteParticipant(
  roomId: string,
  participantId: string,
  trackSid: string,
  muted: boolean
) {
  const client = getRoomServiceClient();
  return client.mutePublishedTrack(roomId, participantId, trackSid, muted);
}

/**
 * Delete a room
 */
export async function deleteRoom(roomId: string) {
  const client = getRoomServiceClient();
  return client.deleteRoom(roomId);
}

/**
 * Get room info
 */
export async function getRoomInfo(roomId: string) {
  const client = getRoomServiceClient();
  const rooms = await client.listRooms([roomId]);
  return rooms[0] || null;
}

/**
 * Generate recording egress (for cloud recording)
 */
export async function startRecording(roomId: string, outputUrl: string) {
  // This would integrate with LiveKit's Egress API for recording
  // Simplified for now
  console.log(`[LiveKit] Starting recording for room ${roomId} to ${outputUrl}`);
  return { success: true };
}
