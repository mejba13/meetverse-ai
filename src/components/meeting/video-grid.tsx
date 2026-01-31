"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, MicOff, Pin, MoreVertical } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  isScreenSharing?: boolean;
}

export function VideoGrid({ participants, isScreenSharing }: VideoGridProps) {
  // Calculate grid layout based on participant count
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (isScreenSharing) {
    // Screen share layout: main content + side strip
    return (
      <div className="flex h-full gap-4">
        {/* Screen share view */}
        <div className="flex-1 rounded-2xl bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-medium mb-2">Screen Share</div>
            <div className="text-sm text-muted-foreground">
              You are sharing your screen
            </div>
          </div>
        </div>

        {/* Participant strip */}
        <div className="w-48 flex flex-col gap-2 overflow-y-auto">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
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
        <ParticipantTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
}

interface ParticipantTileProps {
  participant: Participant;
  size?: "default" | "small";
}

function ParticipantTile({ participant, size = "default" }: ParticipantTileProps) {
  const isSmall = size === "small";

  return (
    <div
      className={cn(
        "video-tile group relative",
        isSmall ? "aspect-video" : ""
      )}
    >
      {participant.isVideoEnabled ? (
        // Video placeholder - in real app, this would be the actual video element
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20">
          {/* Simulated video with avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className={cn(isSmall ? "h-12 w-12" : "h-24 w-24")}>
              <AvatarFallback
                className={cn(
                  "bg-primary/20 text-primary",
                  isSmall ? "text-lg" : "text-3xl"
                )}
              >
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      ) : (
        // Camera off state
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Avatar className={cn(isSmall ? "h-12 w-12" : "h-24 w-24")}>
            <AvatarFallback
              className={cn(
                "bg-primary/20 text-primary",
                isSmall ? "text-lg" : "text-3xl"
              )}
            >
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-2">
          {participant.isMuted ? (
            <MicOff className="h-4 w-4 text-red-400" />
          ) : (
            <Mic className="h-4 w-4 text-white" />
          )}
          <span className={cn("font-medium text-white", isSmall ? "text-xs" : "text-sm")}>
            {participant.name}
          </span>
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

      {/* Speaking indicator */}
      {!participant.isMuted && participant.id === "1" && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background" />
      )}
    </div>
  );
}
