"use client";

import {
  useParticipants,
  useLocalParticipant,
  useTracks,
  VideoTrack,
  AudioTrack,
  useIsSpeaking,
} from "@livekit/components-react";
import { Track, Participant } from "livekit-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, MicOff, Pin, MoreVertical, Crown } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function LiveKitVideoGrid() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  // Get screen share tracks
  const screenShareTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: true,
  });

  const hasScreenShare = screenShareTracks.length > 0;

  // Calculate grid layout based on participant count
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (hasScreenShare) {
    const screenTrack = screenShareTracks[0];
    return (
      <div className="flex h-full gap-4">
        {/* Screen share view */}
        <div className="flex-1 rounded-2xl bg-muted overflow-hidden relative">
          <VideoTrack
            trackRef={screenTrack}
            className="h-full w-full object-contain"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 rounded-lg px-3 py-1.5 text-sm text-white">
            {screenTrack.participant.name || "Unknown"} is sharing screen
          </div>
        </div>

        {/* Participant strip */}
        <div className="w-48 flex flex-col gap-2 overflow-y-auto">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.sid}
              participant={participant}
              isLocal={participant.sid === localParticipant?.sid}
              size="small"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid h-full gap-4 auto-rows-fr",
        getGridClass(participants.length)
      )}
    >
      {participants.map((participant) => (
        <ParticipantTile
          key={participant.sid}
          participant={participant}
          isLocal={participant.sid === localParticipant?.sid}
        />
      ))}
    </div>
  );
}

interface ParticipantTileProps {
  participant: Participant;
  isLocal?: boolean;
  size?: "default" | "small";
}

function ParticipantTile({ participant, isLocal, size = "default" }: ParticipantTileProps) {
  const isSmall = size === "small";

  // Get the camera track for this participant
  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  const cameraTrack = cameraTracks.find(
    (track) => track.participant.sid === participant.sid
  );

  // Check if participant is speaking
  const isSpeaking = useIsSpeaking(participant);

  // Check mute status
  const audioTracks = useTracks([Track.Source.Microphone], {
    onlySubscribed: true,
  });

  const audioTrack = audioTracks.find(
    (track) => track.participant.sid === participant.sid
  );

  const isMuted = !audioTrack || audioTrack.publication?.isMuted;
  const isVideoEnabled = cameraTrack && !cameraTrack.publication?.isMuted;

  // Check if host (metadata could contain this info)
  let isHost = false;
  try {
    if (participant.metadata) {
      isHost = JSON.parse(participant.metadata).isHost === true;
    }
  } catch {
    // Ignore JSON parse errors
  }

  const displayName = participant.name || "Participant";

  return (
    <div
      className={cn(
        "video-tile group relative rounded-xl overflow-hidden bg-muted",
        isSmall ? "aspect-video" : "",
        isSpeaking && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {isVideoEnabled && cameraTrack ? (
        <VideoTrack
          trackRef={cameraTrack}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            isLocal && "scale-x-[-1]" // Mirror local video
          )}
        />
      ) : (
        // Camera off state
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <Avatar className={cn(isSmall ? "h-12 w-12" : "h-24 w-24")}>
            <AvatarFallback
              className={cn(
                "bg-primary/20 text-primary",
                isSmall ? "text-lg" : "text-3xl"
              )}
            >
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Audio track (hidden) */}
      {audioTrack && !isLocal && (
        <AudioTrack trackRef={audioTrack} />
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-2">
          {isMuted ? (
            <MicOff className="h-4 w-4 text-red-400" />
          ) : (
            <Mic className={cn("h-4 w-4 text-white", isSpeaking && "text-green-400")} />
          )}
          <span className={cn("font-medium text-white", isSmall ? "text-xs" : "text-sm")}>
            {displayName}
            {isLocal && " (You)"}
          </span>
          {isHost && (
            <Crown className="h-3.5 w-3.5 text-yellow-400" />
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button className="rounded-lg bg-black/50 p-1.5 text-white hover:bg-black/70">
          <Pin className="h-4 w-4" />
        </button>
        <button className="rounded-lg bg-black/50 p-1.5 text-white hover:bg-black/70">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Export simple video grid for non-LiveKit scenarios (fallback)
export { VideoGrid } from "./video-grid";
